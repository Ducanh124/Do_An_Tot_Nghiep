import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import serviceService from "../services/serviceService";
import bookingService from "../services/bookingService";
import authService from "../services/authService";
import areaService from "../services/areaService";
import discountService from "../services/discountService";
import paymentService from "../services/paymentService";
import categoryService from "../services/categoryService";
import Swal from "sweetalert2";
import "./BookingPage.css";

const BookingPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  // state dịch vụ
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // state model dịch vụ
  const [showAddModal, setShowAddModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryIdModal, setSelectedCategoryIdModal] = useState("");
  const [servicesInModal, setServicesInModal] = useState([]);
  const [tempSelected, setTempSelected] = useState([]); // giỏ hàng tạm trong lúc mở modal

  // state địa điểm và form cũ
  const [areas, setAreas] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const todayString = new Date().toISOString().split("T")[0]; //Lấy ngày hôm nay
  const [note, setNote] = useState("");

  // state khuyến mãi và thanh toán
  const [availableDiscounts, setAvailableDiscounts] = useState([]); //Các mã khuyến mãi khi gọi API
  const [appliedDiscount, setAppliedDiscount] = useState(null); //Các mã khuyến mãi đang được áp dụng thành công
  const [discountCode, setDiscountCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const currentUser = authService.getCurrentUser();

  // tải dữ liệu và thêm luôn dữ liệu mặc định là dữ liệu của khách hàng đăng kí
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // dùng .catch() để nếu 1 api không hoạt động thì các api khác vẫn có thể hoạt động
        const [serviceDataReq, areaDataReq, discountDataReq, userProfileRes] =
          await Promise.all([
            serviceService.getById(serviceId).catch(() => null),
            areaService.getAll().catch(() => []),
            discountService.getAllDiscounts().catch(() => []),
            authService.getMe().catch(() => null),
          ]);

        // xử lý dịch vụ
        if (serviceDataReq) setSelectedServices([serviceDataReq]);

        // xử lý thành phố
        const validAreas = areaDataReq?.data || areaDataReq || [];
        setAreas(validAreas);

        // xử lý khuyến mãi
        const validDiscounts = Array.isArray(discountDataReq)
          ? discountDataReq
          : discountDataReq?.data || [];
        setAvailableDiscounts(validDiscounts);

        // tự động điền địa chỉ của khách hàng
        if (userProfileRes) {
          // bóc tách đa tầng đảm bảo không bao giờ bị lỗi
          const userData =
            userProfileRes?.data?.data ||
            userProfileRes?.data ||
            userProfileRes;
          const savedAreaId = userData?.areaId ? Number(userData.areaId) : null;
          let savedAddress = userData?.address || "";

          // điền số nhà
          if (savedAddress.includes("undefined")) {
            savedAddress = savedAddress.replace(/undefined,?/g, "").trim();
          }
          if (savedAddress && savedAddress !== "null") {
            // cắt chuỗi theo dấu phẩy và chỉ lấy phần đầu tiên để tránh lặp tên quận huyện
            const shortAddress = savedAddress.split(",")[0].trim();
            setAddress(shortAddress);
          }

          // khi có được dữ liệu id của địa chỉ của khách hàng thì phải kiểm tra lại để trả về thành phố và quận tương ứng
          if (savedAreaId) {
            try {
              const rawDistrict = await areaService.getById(savedAreaId);
              const districtInfo = rawDistrict?.data || rawDistrict;
              const foundCityId = districtInfo?.parentId;
              if (foundCityId) {
                setSelectedCityId(Number(foundCityId));
                const rawCity = await areaService.getById(foundCityId);
                const cityInfo = rawCity?.data || rawCity;
                if (cityInfo && cityInfo.children) {
                  setDistricts(cityInfo.children); // đổ quận vào form
                  setTimeout(() => {
                    setSelectedDistrictId(Number(savedAreaId));
                  }, 50); // độ trễ siêu nhỏ 50ms chỉ để react kịp render option
                }
              }
            } catch (fillError) {
              console.error(
                "lỗi ngầm khi lội ngược dòng quận huyện:",
                fillError,
              );
            }
          }
        }
      } catch (error) {
        console.error("lỗi tổng quát:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [serviceId]);

  // logic địa chỉ
  const handleCityChange = async (e) => {
    const cityId = Number(e.target.value);
    setSelectedCityId(cityId);
    setSelectedDistrictId("");
    if (!cityId) {
      setDistricts([]);
      return;
    }
    try {
      const cityData = await areaService.getById(cityId);
      if (cityData && cityData.children) {
        setDistricts(cityData.children);
      } else {
        setDistricts([]);
      }
    } catch (error) {
      console.error("lỗi tải quận huyện:", error);
      setDistricts([]);
    }
  };

  // logic xử lý dịch vụ và modal
  const handleRemoveService = (idToRemove) => {
    if (selectedServices.length <= 1) {
      Swal.fire({
        title: "Thông báo",
        text: "Đơn hàng phải có ít nhất 1 dịch vụ!",
        icon: "warning",
        confirmButtonColor: "#0d6efd",
      });
      return;
    }
    setSelectedServices((prev) => prev.filter((s) => s.id !== idToRemove));
  };

  const handleOpenAddModal = async () => {
    //Copy bỏ từ giỏ chính vào giỏ nháp
    setShowAddModal(true);
    setTempSelected([...selectedServices]); // nạp đồ đã chọn vào giỏ tạm
    try {
      const cats = await categoryService.getCategories();
      setCategories(cats);
    } catch (error) {
      console.error("lỗi tải danh mục:", error);
    }
  };
  //Goij API lấy dịch vụ theo danh mục
  const handleCategoryChangeModal = async (e) => {
    const catId = e.target.value;
    setSelectedCategoryIdModal(catId);
    if (!catId) {
      setServicesInModal([]);
      return;
    }
    try {
      const service = await serviceService.getByCategoryId(catId);
      setServicesInModal(service);
    } catch (error) {
      console.error("lỗi lấy dịch vụ:", error);
    }
  };
  //Check xem đây có phải dịch vụ đã dược chọn hay chưa(Như kiểu tích để chọn và tích để bỏ chọn cùng 1 dịch vụ)
  const handleToggleServiceModal = (svc) => {
    const isExist = tempSelected.find((item) => item.id === svc.id);
    if (isExist) {
      setTempSelected(tempSelected.filter((item) => item.id !== svc.id));
    } else {
      setTempSelected([...tempSelected, svc]);
    }
  };
  //Lấy dịch vụ cho vào giỏ chính
  const handleConfirmAddServices = () => {
    if (tempSelected.length === 0) {
      Swal.fire({
        title: "Thông báo",
        text: "Bạn phải chọn ít nhất 1 dịch vụ!",
        icon: "warning",
        confirmButtonColor: "#0d6efd",
      });
      return;
    }
    setSelectedServices(tempSelected);
    setShowAddModal(false);
  };

  // logic tính tiền sàng lọc mã giảm giá
  const originalPrice = selectedServices.reduce(
    (sum, item) => sum + Number(item?.price || 0),
    0,
  );
  let discountAmount = 0;
  let finalPrice = originalPrice;

  // tự động hủy mã nếu xóa dịch vụ làm tổng tiền rớt dưới mức tối thiểu
  useEffect(() => {
    if (
      appliedDiscount &&
      originalPrice < Number(appliedDiscount.minBookingAmount)
    ) {
      setAppliedDiscount(null);
      setDiscountCode("");
      Swal.fire({
        title: "Thông báo",
        text: "Đã hủy mã giảm giá vì tổng đơn hàng không đủ điều kiện tối thiểu.",
        icon: "info",
        confirmButtonColor: "#0d6efd",
      });
    }
  }, [originalPrice, appliedDiscount]);

  if (appliedDiscount) {
    const type = appliedDiscount.discountType;
    const value = Number(appliedDiscount.discountValue || 0);
    const maxDiscount = Number(appliedDiscount.maxDiscountAmount || 0);

    if (type === "percentage") {
      discountAmount = (originalPrice * value) / 100;
      if (maxDiscount > 0 && discountAmount > maxDiscount) {
        discountAmount = maxDiscount;
      }
    } else if (type === "fixed_amount") {
      discountAmount = value;
    }
    finalPrice = originalPrice - discountAmount;
    if (finalPrice < 0) finalPrice = 0;
  }
  //Kiểm tra và ấp dụng mã giảm giá của lhách hàng
  const handleApplyDiscount = () => {
    const inputCode = discountCode.trim().toUpperCase();
    if (inputCode === "") {
      setAppliedDiscount(null);
      return;
    }
    const matchedDiscount = (availableDiscounts || []).find(
      (d) => d.code.toUpperCase() === inputCode,
    );
    if (!matchedDiscount) {
      setAppliedDiscount(null);
      Swal.fire({
        title: "Lỗi!",
        text: "Mã giảm giá không tồn tại!",
        icon: "error",
        confirmButtonColor: "#0d6efd",
      });
      return;
    }
    const now = new Date();
    if (!matchedDiscount.isActive || new Date(matchedDiscount.endDate) < now) {
      setAppliedDiscount(null);
      Swal.fire({
        title: "Lỗi!",
        text: "Mã giảm giá đã hết hạn hoặc tạm dừng!",
        icon: "error",
        confirmButtonColor: "#0d6efd",
      });
      return;
    }
    if (originalPrice < Number(matchedDiscount.minBookingAmount)) {
      setAppliedDiscount(null);
      Swal.fire({
        title: "Cảnh báo",
        text: `Mã này chỉ áp dụng cho đơn từ ${Number(matchedDiscount.minBookingAmount).toLocaleString("vi-VN")}₫`,
        icon: "warning",
        confirmButtonColor: "#0d6efd",
      });
      return;
    }
    setAppliedDiscount(matchedDiscount);
    Swal.fire({
      title: "Thành công!",
      text: `Áp dụng mã ${matchedDiscount.code} thành công!`,
      icon: "success",
      confirmButtonColor: "#0d6efd",
    });
  };

  // chốt đơn và gửi api
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!selectedDistrictId) {
      Swal.fire({
        title: "Thiếu thông tin",
        text: "Vui lòng chọn Quận/Huyện!",
        icon: "warning",
        confirmButtonColor: "#0d6efd",
      });
      return;
    }
    if (!address || !date || !time) {
      Swal.fire({
        title: "Thiếu thông tin",
        text: "Vui lòng điền đủ Địa chỉ, Ngày và Giờ!",
        icon: "warning",
        confirmButtonColor: "#0d6efd",
      });
      return;
    } //check time và không cho đuawtj lịch trong quá khứ

    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    if (selectedDateTime < now) {
      Swal.fire({
        title: "Thời gian không hợp lệ",
        text: "Thời gian làm việc không được nằm trong quá khứ. Vui lòng chọn lại!",
        icon: "error",
        confirmButtonColor: "#0d6efd",
      });
      return;
    }
    setShowPaymentModal(true);
  };

  const processBooking = async () => {
    const dateTimeString = new Date(`${date}T${time}`).toISOString();
    const bookingPayload = {
      customerId: String(currentUser.id),
      areaId: Number(selectedDistrictId),
      address: address,
      scheduledTime: dateTimeString,
      discountCode: appliedDiscount ? appliedDiscount.code : "",
      status: "pending",
      note: note,
      serviceId: selectedServices.map((s) => Number(s.id)), // lấy tất cả id đang chọn
    };

    try {
      const bookingRes = await bookingService.createBooking(bookingPayload);
      const newBookingId = bookingRes?.id || bookingRes?.data?.id;

      if (!newBookingId) {
        await Swal.fire({
          title: "Thông báo",
          text: "Đã tạo đơn nhưng không lấy được mã đơn hàng. Vui lòng kiểm tra lịch sử!",
          icon: "warning",
          confirmButtonColor: "#0d6efd",
        });
        setShowPaymentModal(false);
        navigate("/history");
        return;
      }

      if (paymentMethod === "CASH") {
        await Swal.fire({
          title: "Thành công!",
          text: "Đặt lịch thành công! Bạn đã chọn thanh toán Tiền mặt.",
          icon: "success",
          confirmButtonColor: "#0d6efd",
        });
        navigate("/history");
      } else if (paymentMethod === "VNPAY") {
        const paymentPayload = {
          bookingId: newBookingId,
          method: "VNPAY",
          status: "PENDING",
        };
        const paymentRes =
          await paymentService.createPaymentUrl(paymentPayload);
        const vnpayUrl = paymentRes?.paymentUrl || paymentRes?.data?.paymentUrl;

        if (vnpayUrl) {
          window.location.href = vnpayUrl;
        } else {
          await Swal.fire({
            title: "Lỗi!",
            text: "Lỗi khi tạo link VNPay!",
            icon: "error",
            confirmButtonColor: "#0d6efd",
          });
          navigate("/history");
        }
      }
    } catch (error) {
      console.error("lỗi khi đặt lịch:", error);
      Swal.fire({
        title: "Lỗi!",
        text: "Có lỗi xảy ra, vui lòng thử lại sau!",
        icon: "error",
        confirmButtonColor: "#0d6efd",
      });
    }
  };

  if (loading)
    return <div className="text-center mt-5">Đang tải dữ liệu...</div>;
  if (selectedServices.length === 0)
    return (
      <div className="text-center mt-5 text-danger">
        Không tìm thấy dịch vụ!
      </div>
    );

  return (
    <div className="booking-page-container pt-4">
      <div className="container">
        <button className="btn-back-booking mb-4" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left fs-5"></i> Quay lại
        </button>

        <div className="row g-4">
          {/* cột trái danh sách dịch vụ đã chọn */}
          <div className="col-md-5">
            <div className="service-info-card d-flex flex-column h-100 p-4 bg-white rounded shadow-sm">
              <h5 className="text-muted mb-3 border-bottom pb-2">
                Các gói dịch vụ đã chọn ({selectedServices.length})
              </h5>

              <div
                className="selected-services-list mb-3"
                style={{
                  maxHeight: "350px",
                  overflowY: "auto",
                  paddingRight: "10px",
                }}
              >
                {selectedServices.map((svc) => (
                  <div
                    key={svc.id}
                    className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom"
                  >
                    <div>
                      <h6 className="fw-bold text-primary mb-1">{svc.name}</h6>
                      <span className="text-secondary fw-semibold">
                        {Number(svc.price).toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                    {selectedServices.length > 1 && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleRemoveService(svc.id)}
                        title="Xóa dịch vụ này"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                className="btn btn-outline-primary mb-4 fw-bold w-100"
                onClick={handleOpenAddModal}
              >
                <i className="bi bi-plus-circle me-2"></i>Chọn thêm dịch vụ
              </button>

              <div className="mt-auto pt-4 border-top">
                {/* hiển thị mã giảm giá */}
                {appliedDiscount && (
                  <div className="discount-summary mb-3 p-2 bg-light rounded border border-success border-opacity-25">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="text-muted small">Giá gốc:</span>
                      <span className="text-muted small text-decoration-line-through">
                        {originalPrice.toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-success small fw-bold">
                        <i className="bi bi-tags-fill me-1"></i>Đã giảm (
                        {appliedDiscount.code}):
                      </span>
                      <span className="text-success small fw-bold">
                        -{discountAmount.toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                  </div>
                )}

                {/* tổng tiền */}
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold fs-5 text-secondary">
                    Tổng thanh toán:
                  </span>
                  <span className="fs-3 fw-bold text-danger">
                    {finalPrice.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* cột phải form đặt lịch */}
          <div className="col-md-7">
            <div className="booking-form-card sticky-booking-form">
              <h4 className="fw-bold mb-4 border-bottom pb-3">
                Chi tiết công việc
              </h4>

              <form onSubmit={handleBookingSubmit}>
                <div className="mb-3">
                  <label className="custom-form-label">Người đặt</label>
                  <input
                    type="text"
                    className="form-control custom-form-control bg-light"
                    value={
                      currentUser?.name || currentUser?.email || "Khách hàng"
                    }
                    readOnly
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-6">
                    <label className="custom-form-label">
                      Tỉnh/Thành phố *
                    </label>
                    <select
                      className="form-select custom-form-control"
                      value={selectedCityId}
                      onChange={handleCityChange}
                    >
                      <option value="">-- Chọn Thành phố --</option>
                      {areas.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-6">
                    <label className="custom-form-label">Phường /Xã *</label>
                    <select
                      className="form-select custom-form-control"
                      value={selectedDistrictId}
                      onChange={(e) => setSelectedDistrictId(e.target.value)}
                      disabled={!selectedCityId}
                    >
                      <option value="">-- Chọn Quận/Huyện --</option>
                      {districts.map((district) => (
                        <option key={district.id} value={district.id}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="custom-form-label">
                    Số nhà, Tên đường *
                  </label>
                  <input
                    type="text"
                    className="form-control custom-form-control"
                    placeholder="Ví dụ: Số 10, Ngõ 20, Trần Phú"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-6">
                    <label className="custom-form-label">Ngày làm *</label>
                    <input
                      type="date"
                      className="form-control custom-form-control"
                      value={date}
                      min={todayString}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  <div className="col-6">
                    <label className="custom-form-label">Giờ bắt đầu *</label>
                    <input
                      type="time"
                      className="form-control custom-form-control"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="custom-form-label">
                    Mã giảm giá (Nếu có)
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0 text-success">
                      <i className="bi bi-ticket-perforated"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control custom-form-control border-start-0 ps-0 text-uppercase"
                      placeholder="Nhập mã ưu đãi..."
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                    />
                    <button
                      className="btn btn-outline-primary"
                      type="button"
                      onClick={handleApplyDiscount}
                    >
                      Áp dụng
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="custom-form-label">
                    Ghi chú cho nhân viên (Tùy chọn)
                  </label>
                  <textarea
                    className="form-control custom-form-control"
                    rows="3"
                    placeholder="Ví dụ: Nhà có chó dữ, cần mang theo thang..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-3 fw-bold fs-5 rounded-3"
                >
                  XÁC NHẬN ĐẶT LỊCH
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* popup chọn phương thức thanh toán */}
      {showPaymentModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-bottom-0">
                <h5 className="modal-title fw-bold text-primary">
                  <i className="bi bi-wallet2 me-2"></i>Chọn phương thức thanh
                  toán
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPaymentModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="text-muted mb-3">
                  Vui lòng chọn cách thức thanh toán cho dịch vụ của bạn:
                </p>
                <div
                  className={`border rounded p-3 mb-3 cursor-pointer ${paymentMethod === "CASH" ? "border-primary bg-light" : ""}`}
                  onClick={() => setPaymentMethod("CASH")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      checked={paymentMethod === "CASH"}
                      readOnly
                    />
                    <label
                      className="form-check-label fw-bold d-block"
                      style={{ cursor: "pointer" }}
                    >
                      💵 Thanh toán tiền mặt
                    </label>
                    <small className="text-muted">
                      Thanh toán sau khi nhân viên hoàn thành công việc.
                    </small>
                  </div>
                </div>
                <div
                  className={`border rounded p-3 cursor-pointer ${paymentMethod === "VNPAY" ? "border-primary bg-light" : ""}`}
                  onClick={() => setPaymentMethod("VNPAY")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      checked={paymentMethod === "VNPAY"}
                      readOnly
                    />
                    <label
                      className="form-check-label fw-bold d-block"
                      style={{ cursor: "pointer" }}
                    >
                      💳 Thanh toán VNPay
                    </label>
                    <small className="text-muted">
                      Chuyển khoản qua ứng dụng ngân hàng hoặc thẻ ATM/Visa.
                    </small>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top-0">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowPaymentModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-primary px-4 fw-bold"
                  onClick={processBooking}
                >
                  Tiến hành thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* popup chọn thêm dịch vụ */}
      {showAddModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Thêm dịch vụ vào đơn</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    1. Chọn Nhóm dịch vụ
                  </label>
                  <select
                    className="form-select"
                    value={selectedCategoryIdModal}
                    onChange={handleCategoryChangeModal}
                  >
                    <option value="">-- Vui lòng chọn danh mục --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCategoryIdModal && (
                  <div className="services-list-modal mt-4">
                    <label className="form-label fw-bold">
                      2. Tích chọn dịch vụ cần thêm
                    </label>
                    {servicesInModal.length === 0 ? (
                      <p className="text-muted small fst-italic">
                        Không có dịch vụ nào trong mục này.
                      </p>
                    ) : (
                      <div className="list-group">
                        {servicesInModal.map((svc) => {
                          const isChecked = tempSelected.some(
                            (item) => item.id === svc.id,
                          );
                          return (
                            <label
                              key={svc.id}
                              className="list-group-item d-flex justify-content-between align-items-center"
                              style={{ cursor: "pointer" }}
                            >
                              <div>
                                <input
                                  className="form-check-input me-3"
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleToggleServiceModal(svc)}
                                />
                                {svc.name}
                              </div>
                              <span className="text-danger fw-bold">
                                {Number(svc.price).toLocaleString("vi-VN")} ₫
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="modal-footer d-flex justify-content-between align-items-center">
                <span className="fw-bold text-primary">
                  Tổng đang chọn: {tempSelected.length}
                </span>
                <div>
                  <button
                    className="btn btn-secondary me-2"
                    onClick={() => setShowAddModal(false)}
                  >
                    Hủy
                  </button>
                  <button
                    className="btn btn-primary fw-bold"
                    onClick={handleConfirmAddServices}
                  >
                    Xác nhận thêm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
