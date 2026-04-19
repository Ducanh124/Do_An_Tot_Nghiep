// src/pages/BookingPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import serviceService from "../services/serviceService";
import bookingService from "../services/bookingService";
import authService from "../services/authService";
import areaService from "../services/areaService";
import "./BookingPage.css";

const BookingPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- STATE TỈNH/THÀNH VÀ QUẬN/HUYỆN ---
  const [areas, setAreas] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState("");

  // --- STATE CÁC Ô NHẬP LIỆU CÒN LẠI ---
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [discountCode, setDiscountCode] = useState("");

  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [serviceData, areaData] = await Promise.all([
          serviceService.getById(serviceId),
          areaService.getAll(),
        ]);

        setService(serviceData);
        setAreas(areaData);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [serviceId]);

  // Xử lý khi chọn Tỉnh/Thành
  const handleCityChange = (e) => {
    const cityId = Number(e.target.value);
    setSelectedCityId(cityId);
    setSelectedDistrictId("");

    const selectedCity = areas.find((area) => area.id === cityId);
    if (selectedCity && selectedCity.children) {
      setDistricts(selectedCity.children);
    } else {
      setDistricts([]);
    }
  };

  // Xử lý chốt đơn
  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDistrictId) return alert("Vui lòng chọn Quận/Huyện!");
    if (!address || !date || !time)
      return alert("Vui lòng điền đủ Địa chỉ, Ngày và Giờ!");

    const dateTimeString = new Date(`${date}T${time}`).toISOString();

    const bookingPayload = {
      customerId: String(currentUser.id),
      areaId: Number(selectedDistrictId), // Lấy ID của Quận để gửi đi
      address: address,
      scheduledTime: dateTimeString,
      discountCodeId: discountCode.trim() !== "" ? discountCode : "",
      status: "pending",
      note: note,
      serviceId: [Number(serviceId)],
    };

    try {
      await bookingService.createBooking(bookingPayload);
      alert(" Đặt lịch thành công! Cảm ơn bạn đã sử dụng dịch vụ.");
      navigate("/");
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

  return (
    <div className="booking-page-container pt-4">
      <div className="container">
        <button className="btn-back-booking mb-4" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left fs-5"></i> Quay lại
        </button>

        <div className="row g-4">
          {/* CỘT TRÁI: THÔNG TIN DỊCH VỤ */}
          <div className="col-md-5">
            <div className="service-info-card d-flex flex-column">
              <h5 className="text-muted mb-3 border-bottom pb-2">
                Thông tin gói dịch vụ
              </h5>
              <h4 className="service-info-title fw-bold">{service.name}</h4>
              <p className="service-info-desc">{service.description}</p>

              <div className="mt-auto pt-4 border-top d-flex justify-content-between align-items-center">
                <span className="fw-bold fs-5 text-secondary">
                  Tổng thanh toán:
                </span>
                <span className="fs-3 fw-bold text-danger">
                  {Number(service.price).toLocaleString("vi-VN")} ₫
                </span>
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

                {/* --- CHỌN NGÀY GIỜ (Đã thêm setDate, setTime để hết lỗi đỏ) --- */}
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
    </div>
  );
};

export default BookingPage;
