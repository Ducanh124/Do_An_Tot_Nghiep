import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import serviceService from "../services/serviceService";
import bookingService from "../services/bookingService";
import authService from "../services/authService";
import areaService from "../services/areaService";
import discountService from "../services/discountService";
import paymentService from "../services/paymentService";
import "./BookingPage.css";

const BookingPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  // dịch vụ
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  // địa điểm
  const [areas, setAreas] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  // mã khuyến mãi
  const [availableDiscounts, setAvailableDiscounts] = useState([]); // Lưu toàn bộ mã từ API
  const [appliedDiscount, setAppliedDiscount] = useState(null); // Lưu mã đã áp dụng thành công
  // --- STATE CÁC Ô NHẬP LIỆU CÒN LẠI ---
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  //thanh toán
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [showPaymentModal, setShowPaymentModal] = useState(false); // trạng thái để mở hộp thoại
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [serviceData, areaData, discountData] = await Promise.all([
          serviceService.getById(serviceId),
          areaService.getAll(),
          discountService.getAllDiscounts(),
        ]);

        setService(serviceData);
        setAreas(areaData);
        setAvailableDiscounts(discountData);
        const validDiscounts = Array.isArray(discountData)
          ? discountData
          : discountData?.data || []; // Nếu bị lồng trong data thì bóc ra, lỗi thì lấy mảng rỗng

        setAvailableDiscounts(validDiscounts);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [serviceId]);

  // Xử lý khi chọn Tỉnh/Thành
  const handleCityChange = async (e) => {
    const cityId = Number(e.target.value);
    setSelectedCityId(cityId);
    setSelectedDistrictId("");
    //nếu chọn lại thành phố thì xoá quận
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
      console.error("Lỗi khi tải danh sách Quận/Huyện:", error);
      setDistricts([]);
    }
  };
  // Kiểm tra mã giảm giá
  const handleApplyDiscount = () => {
    const inputCode = discountCode.trim().toUpperCase();

    if (inputCode === "") {
      setAppliedDiscount(null);
      return;
    }

    // 1. Tìm mã trong danh sách
    const matchedDiscount = (availableDiscounts || []).find(
      (d) => d.code.toUpperCase() === inputCode,
    );

    if (!matchedDiscount) {
      setAppliedDiscount(null);
      return alert("Mã giảm giá không tồn tại!");
    }

    // 2. Kiểm tra hạn sử dụng & trạng thái
    const now = new Date();
    if (!matchedDiscount.isActive || new Date(matchedDiscount.endDate) < now) {
      setAppliedDiscount(null);
      return alert("Mã giảm giá này đã hết hạn hoặc tạm dừng áp dụng!");
    }

    // 3. Kiểm tra điều kiện đơn tối thiểu
    const currentPrice = Number(service?.price || 0);
    if (currentPrice < Number(matchedDiscount.minBookingAmount)) {
      setAppliedDiscount(null);
      return alert(
        `Mã này chỉ áp dụng cho đơn hàng từ ${Number(matchedDiscount.minBookingAmount).toLocaleString("vi-VN")}₫`,
      );
    }
    // 4. Nếu qua hết các bài test, lưu mã vào State
    setAppliedDiscount(matchedDiscount);
    alert(`Áp dụng mã ${matchedDiscount.code} thành công!`);
  };
  // Xử lý chốt đơn
  // 1. HÀM KIỂM TRA FORM VÀ MỞ MODAL
  const handleBookingSubmit = (e) => {
    e.preventDefault(); // Ngăn load lại trang

    // Kiểm tra dữ liệu đầu vào (Validation)
    if (!selectedDistrictId) return alert("Vui lòng chọn Quận/Huyện!");
    if (!address || !date || !time)
      return alert("Vui lòng điền đủ Địa chỉ, Ngày và Giờ!");

    // Nếu qua bài test, mở Modal thanh toán lên
    setShowPaymentModal(true);
  };

  // 2. HÀM GỌI API TẠO ĐƠN VÀ THANH TOÁN (Chạy khi ấn nút trong Modal)
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
      serviceId: [Number(serviceId)],
    };

    try {
      // Gọi API tạo đơn đặt lịch
      const bookingRes = await bookingService.createBooking(bookingPayload);
      const newBookingId = bookingRes?.id || bookingRes?.data?.id;

      if (!newBookingId) {
        alert(
          "Đã tạo đơn nhưng không lấy được mã đơn hàng. Vui lòng kiểm tra lịch sử!",
        );
        setShowPaymentModal(false); // Đóng modal
        navigate("/history");
        return;
      }

      // Rẽ nhánh thanh toán
      if (paymentMethod === "CASH") {
        alert(" Đặt lịch thành công! Bạn đã chọn thanh toán bằng Tiền mặt.");
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
          window.location.href = vnpayUrl; // chuyển sang VNPay
        } else {
          alert("Lỗi khi tạo link VNPay!");
          navigate("/history");
        }
      }
    } catch (error) {
      console.error("Lỗi khi đặt lịch:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại sau!");
    }
  };

  if (loading)
    return <div className="text-center mt-5">Đang tải dữ liệu...</div>;
  if (!service)
    return (
      <div className="text-center mt-5 text-danger">
        Không tìm thấy dịch vụ!
      </div>
    );
  //  LOGIC TÍNH TOÁN TIỀN HIỂN THỊ
  const originalPrice = Number(service?.price || 0); // Giá gốc
  let discountAmount = 0; // Tiền được giảm
  let finalPrice = originalPrice; // Tổng thanh toán

  if (appliedDiscount) {
    const type = appliedDiscount.discountType;
    const value = Number(appliedDiscount.discountValue || 0);
    const maxDiscount = Number(appliedDiscount.maxDiscountAmount || 0);

    if (type === "percentage") {
      discountAmount = (originalPrice * value) / 100;
      // Nếu có giới hạn giảm tối đa
      if (maxDiscount > 0 && discountAmount > maxDiscount) {
        discountAmount = maxDiscount;
      }
    } else if (type === "fixed_amount") {
      discountAmount = value;
    }

    finalPrice = originalPrice - discountAmount;
    if (finalPrice < 0) finalPrice = 0; // Đảm bảo không bị âm tiền
  }
  return (
    <div className="booking-page-container pt-4">
      <div className="container">
        <button className="btn-back-booking mb-4" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left fs-5"></i> Quay lại
        </button>

        <div className="row g-4">
          {/* CỘT TRÁI: THÔNG TIN DỊCH VỤ */}
          <div className="col-md-5">
            <div className="service-info-card d-flex flex-column h-100 p-4 bg-white rounded shadow-sm">
              <h5 className="text-muted mb-3 border-bottom pb-2">
                Thông tin gói dịch vụ
              </h5>
              <h4 className="service-info-title fw-bold text-primary">
                {service.name}
              </h4>
              <p className="service-info-desc text-secondary">
                {service.description}
              </p>

              {/* Hình ảnh dịch vụ */}
              {service.imageUrl ? (
                <div className="service-image-container my-3 text-center flex-grow-1">
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="img-fluid rounded shadow-sm"
                    style={{
                      maxHeight: "500px",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ) : (
                // Nếu dịch vụ không có ảnh, hiện 1 cái khung trống xám xám cho đỡ bị hụt giao diện
                <div
                  className="my-3 flex-grow-1 d-flex align-items-center justify-content-center bg-light rounded"
                  style={{ minHeight: "200px" }}
                >
                  <i className="bi bi-image text-muted fs-1"></i>
                </div>
              )}

              <div className="mt-auto pt-4 border-top">
                {/* Hiện bảng so sánh chi tiết nếu có mã giảm giá */}
                {appliedDiscount && (
                  <div className="discount-summary mb-3 p-2 bg-light rounded border border-success border-opacity-25">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="text-muted small">Giá gốc dịch vụ:</span>
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

                {/* Tổng thanh toán cuối cùng */}
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

          {/* CỘT PHẢI: FORM ĐẶT LỊCH */}
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

                {/* --- CHỌN KHU VỰC --- */}
                <div className="row mb-3">
                  <div className="col-6">
                    <label className="custom-form-label">
                      Tỉnh/Thành phố *
                    </label>
                    <select
                      className="form-select custom-form-control"
                      value={selectedCityId}
                      onChange={handleCityChange}
                      required
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
                    <label className="custom-form-label">Quận/Huyện *</label>
                    <select
                      className="form-select custom-form-control"
                      value={selectedDistrictId}
                      onChange={(e) => setSelectedDistrictId(e.target.value)}
                      required
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
                    required
                  />
                </div>

                {/* --- CHỌN NGÀY GIỜ  --- */}
                <div className="row mb-3">
                  <div className="col-6">
                    <label className="custom-form-label">Ngày làm *</label>
                    <input
                      type="date"
                      className="form-control custom-form-control"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="custom-form-label">Giờ bắt đầu *</label>
                    <input
                      type="time"
                      className="form-control custom-form-control"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
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
                  onClick={() => setShowPaymentModal(false)} // Nút X để đóng Modal
                ></button>
              </div>

              <div className="modal-body">
                <p className="text-muted mb-3">
                  Vui lòng chọn cách thức thanh toán cho dịch vụ của bạn:
                </p>

                {/* Lựa chọn Tiền mặt */}
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
                      onChange={() => setPaymentMethod("CASH")}
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

                {/* Lựa chọn VNPay */}
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
                      onChange={() => setPaymentMethod("VNPAY")}
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
    </div>
  );
};

export default BookingPage;
