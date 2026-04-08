// frontend/src/pages/BookingPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import serviceService from "../services/serviceService"; // Sứ giả gọi API
import "./BookingPage.css";

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Biến chứa dữ liệu thực tế từ Database
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  // Các state lưu lựa chọn của khách hàng
  const [staffCount, setStaffCount] = useState(1);
  const [quantity, setQuantity] = useState(1); // Hệ số thời gian/số lượng
  const [note, setNote] = useState("");
  const [address, setAddress] = useState("");
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Gọi API lấy toàn bộ dịch vụ (Hoặc tốt nhất là gọi API lấy chi tiết 1 dịch vụ nếu Backend có)
        const allServices = await serviceService.getAll();

        // Lọc ra dịch vụ khách đang bấm vào (Khớp service_id)
        const currentService = allServices.find(
          (s) => s.service_id === parseInt(id),
        );

        if (currentService) {
          setService(currentService);
        }
      } catch (err) {
        console.error("Lỗi tải dữ liệu", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading)
    return <div className="text-center mt-5">Đang tải thông tin...</div>;
  if (!service)
    return (
      <div className="text-center mt-5 text-danger">
        Không tìm thấy dịch vụ!
      </div>
    );

  // Lấy giá cơ bản từ DB (Ép kiểu về số)
  const basePrice = Number(service.price);

  // TỔNG TIỀN = Giá cơ bản * Số nhân viên * Hệ số (Thời gian/Số lượng)
  const totalPrice = basePrice * staffCount * quantity;

  const handleConfirmBooking = () => {
    if (!address.trim()) {
      alert("Vui lòng nhập địa chỉ làm việc trước khi tiếp tục!");
      return;
    }

    // Đóng gói data gửi sang trang Thanh toán (Đảm bảo khớp tên với bảng Bookings)
    const orderData = {
      service_id: service.service_id,
      serviceName: service.name,
      staffCount: staffCount,
      totalTime: (service.duration || 60) * quantity, // Tính tổng thời gian dự kiến
      address: address,
      note: note,
      total_amount: totalPrice, // Cột này sẽ chui vào DB
    };

    navigate("/checkout", { state: orderData });
  };

  return (
    <div className="booking-page-wrapper">
      <div className="booking-desktop-container shadow-sm">
        <div className="booking-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left"></i> Quay lại
          </button>
          {/* Lấy tên từ DB */}
          <h4 className="mb-0 fw-bold theme-text-blue">{service.name}</h4>
          <button className="info-btn">
            <i className="bi bi-info-circle"></i>
          </button>
        </div>

        <div className="booking-body">
          {/* Lấy mô tả chi tiết từ DB */}
          <p className="text-muted mb-4">{service.description}</p>

          {/* --- ĐỊA ĐIỂM --- */}
          <div className="section-block">
            <div className="section-title">
              <i className="bi bi-geo-alt-fill theme-icon me-2"></i> ĐỊA ĐIỂM
              LÀM VIỆC
            </div>
            <div className="location-box d-flex flex-column gap-2">
              {isEditingAddress ? (
                <div className="d-flex w-100 gap-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập địa chỉ..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    autoFocus
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => setIsEditingAddress(false)}
                  >
                    Lưu
                  </button>
                </div>
              ) : (
                <div className="d-flex justify-content-between align-items-center w-100">
                  <span className={address ? "fw-bold" : "text-muted"}>
                    {address || "Bạn cần nhập địa chỉ"}
                  </span>
                  <button
                    className="btn-create-new"
                    onClick={() => setIsEditingAddress(true)}
                  >
                    {address ? "Sửa" : "Tạo mới"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* --- TÙY CHỈNH TỪ KHÁCH HÀNG (Thay vì chọn gói cứng) --- */}
          <div className="row mt-4">
            <div className="col-6">
              <div className="section-block h-100">
                <div className="section-title">SỐ NHÂN VIÊN</div>
                <div className="d-flex align-items-center justify-content-between border rounded p-2 mt-2">
                  <button
                    className="btn btn-light"
                    onClick={() => setStaffCount(Math.max(1, staffCount - 1))}
                  >
                    -
                  </button>
                  <span className="fw-bold fs-5">{staffCount}</span>
                  <button
                    className="btn btn-light"
                    onClick={() => setStaffCount(staffCount + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="col-6">
              <div className="section-block h-100">
                <div className="section-title">THỜI GIAN LÀM</div>
                <div className="d-flex align-items-center justify-content-between border rounded p-2 mt-2">
                  <button
                    className="btn btn-light"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="fw-bold fs-5">
                    {/* Tính số phút từ DB nhân với hệ số */}
                    {(service.duration || 60) * quantity} Phút
                  </span>
                  <button
                    className="btn btn-light"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="section-block mt-4">
            <div className="d-flex justify-content-between">
              <span className="text-muted">Đơn giá cơ bản:</span>
              <span className="fw-bold">
                {basePrice.toLocaleString("vi-VN")} ₫
              </span>
            </div>
          </div>

          {/* --- GHI CHÚ --- */}
          <div className="section-block mt-4">
            <div className="section-title">
              <i className="bi bi-pencil-square theme-icon me-2"></i> LƯU Ý /
              GHI CHÚ
            </div>
            <textarea
              className="form-control custom-textarea mt-2"
              rows="3"
              placeholder="Nhập ghi chú cho nhân viên..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* --- THANH BOTTOM --- */}
        <div className="booking-bottom-bar">
          <div>
            <div className="total-price fw-bold text-danger">
              Tổng:{" "}
              <span className="fs-5">
                {totalPrice.toLocaleString("vi-VN")} ₫
              </span>
            </div>
          </div>
          <button
            className="btn btn-primary px-4 py-2 rounded-pill"
            onClick={handleConfirmBooking}
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
