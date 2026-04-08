// frontend/src/pages/BookingPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./BookingPage.css";

// MOCK API (Giữ nguyên của bạn)
const mockFetchServiceDetail = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const db = {
    1: {
      id: 1,
      title: "Giúp việc ca lẻ",
      staffOptions: [1, 2, 3],
      durationOptions: [
        { id: 1, hours: 2, desc: "Tối đa 60m² mặt sàn", price: 150000 },
        { id: 2, hours: 3, desc: "Tối đa 90m² mặt sàn", price: 200000 },
        { id: 3, hours: 4, desc: "Tối đa 120m² mặt sàn", price: 250000 },
      ],
    },
    2: {
      id: 2,
      title: "Giúp việc định kỳ",
      staffOptions: [1],
      durationOptions: [
        { id: 4, hours: 2, desc: "1 tuần / 2 buổi", price: 500000 },
        { id: 5, hours: 3, desc: "1 tuần / 3 buổi", price: 700000 },
      ],
    },
    3: {
      id: 3,
      title: "Vệ sinh sofa, nệm",
      staffOptions: [1, 2],
      durationOptions: [
        {
          id: 6,
          hours: "Tuỳ theo công việc",
          desc: "1 Bộ Sofa",
          price: 300000,
        },
        {
          id: 7,
          hours: "Tuỳ theo công việc",
          desc: "2 Bộ Sofa / Kèm nệm",
          price: 500000,
        },
      ],
    },
    4: {
      id: 4,
      title: "Vệ sinh đồ điện tử",
      staffOptions: [1, 2],
      durationOptions: [
        { id: 8, hours: "Tuỳ theo công việc", desc: "Máy lạnh", price: 500000 },
        {
          id: 9,
          hours: "Tuỳ theo công việc",
          desc: "Máy giặt",
          price: 1000000,
        },
      ],
    },
    5: {
      id: 5,
      title: "Phun diệt côn trùng",
      staffOptions: [1],
      durationOptions: [
        { id: 10, hours: "Tuỳ theo công việc", desc: "1 Phòng", price: 200000 },
        { id: 11, hours: "Tuỳ theo công việc", desc: "2 Phòng", price: 400000 },
        {
          id: 12,
          hours: "Tuỳ theo công việc",
          desc: "Toàn nhà",
          price: 1000000,
        },
      ],
    },
    6: {
      id: 6,
      title: "Dịch vụ vận chuyển",
      staffOptions: [2, 3, 4],
      durationOptions: [
        {
          id: 13,
          hours: "Tuỳ theo công việc",
          desc: "Xe tải 1 tấn",
          price: 1000000,
        },
        {
          id: 14,
          hours: "Tuỳ theo công việc",
          desc: "Xe tải 0,5 tấn",
          price: 700000,
        },
      ],
    },
  };
  return db[id] || db[1];
};

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [note, setNote] = useState("");

  // === THÊM BIẾN QUẢN LÝ ĐỊA CHỈ ===
  const [address, setAddress] = useState("");
  const [isEditingAddress, setIsEditingAddress] = useState(false); // Trạng thái mở/đóng ô nhập

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await mockFetchServiceDetail(id);
        setService(data);
        setSelectedStaff(data.staffOptions[0]);
        setSelectedDuration(data.durationOptions[0]);
      } catch (err) {
        setError("Không thể tải thông tin dịch vụ.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) return <div className="text-center mt-5">Đang tải...</div>;
  if (error) return <div className="text-center text-danger mt-5">{error}</div>;
  if (!service)
    return <div className="text-center mt-5">Không tìm thấy dịch vụ!</div>;

  const totalPrice = selectedStaff * selectedDuration.price;

  // === HÀM XỬ LÝ KHI BẤM NÚT "XÁC NHẬN ĐẶT LỊCH" ===
  const handleConfirmBooking = () => {
    if (!address.trim()) {
      alert("Vui lòng nhập địa chỉ làm việc trước khi tiếp tục!");
      return;
    }

    // Gom tất cả dữ liệu thành 1 cục Object
    const orderData = {
      serviceId: service.id,
      serviceTitle: service.title,
      staffCount: selectedStaff,
      durationDesc: selectedDuration.desc,
      durationHours: selectedDuration.hours,
      pricePerUnit: selectedDuration.price,
      totalPrice: totalPrice,
      address: address,
      note: note,
    };

    // Điều hướng sang trang "checkout" và ném dữ liệu theo qua thuộc tính "state"
    navigate("/checkout", { state: orderData });
  };

  return (
    <div className="booking-page-wrapper">
      <div className="booking-desktop-container shadow-sm">
        <div className="booking-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left"></i> Quay lại
          </button>
          <h4 className="mb-0 fw-bold theme-text-blue">{service.title}</h4>
          <button className="info-btn">
            <i className="bi bi-info-circle"></i>
          </button>
        </div>

        <div className="booking-body">
          {/* === ĐỊA ĐIỂM LÀM VIỆC CÓ Ô NHẬP LIỆU === */}
          <div className="section-block">
            <div className="section-title">
              <i className="bi bi-geo-alt-fill theme-icon me-2"></i> ĐỊA ĐIỂM
              LÀM VIỆC
            </div>
            <div className="location-box d-flex flex-column gap-2">
              {isEditingAddress ? (
                // Nếu đang chỉnh sửa -> Hiện ô input
                <div className="d-flex w-100 gap-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập địa chỉ chi tiết (Số nhà, đường...)"
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
                // Nếu không chỉnh sửa -> Hiện text bình thường
                <div className="d-flex justify-content-between align-items-center w-100">
                  <span
                    className={address ? "fw-bold text-dark" : "text-muted"}
                  >
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

          {/* SỐ NHÂN VIÊN */}
          <div className="section-block">
            <div className="section-title">
              <i className="bi bi-people-fill theme-icon me-2"></i> SỐ LƯỢNG
              NHÂN VIÊN
            </div>
            <div className="options-grid staff-grid">
              {service.staffOptions.map((num) => (
                <div
                  key={num}
                  className={`option-card ${selectedStaff === num ? "active" : ""}`}
                  onClick={() => setSelectedStaff(num)}
                >
                  <span className="fs-6">{num} × Nhân viên</span>
                </div>
              ))}
            </div>
          </div>

          {/* THỜI GIAN & BẢNG GIÁ */}
          <div className="section-block">
            <div className="section-title">
              <i className="bi bi-clock-fill theme-icon me-2"></i> THỜI GIAN &
              BẢNG GIÁ
            </div>
            <div className="options-grid duration-grid">
              {service.durationOptions.map((opt) => (
                <div
                  key={opt.id}
                  className={`option-card duration-card ${selectedDuration.id === opt.id ? "active" : ""}`}
                  onClick={() => setSelectedDuration(opt)}
                >
                  <div className="fw-bold fs-6">Giờ: {opt.hours}</div>
                  <div className="small-text">{opt.desc}</div>
                  <div className="option-price mt-3">
                    {opt.price.toLocaleString("vi-VN")} ₫
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GHI CHÚ */}
          <div className="section-block">
            <div className="section-title">
              <i className="bi bi-pencil-square theme-icon me-2"></i> LƯU Ý /
              GHI CHÚ
            </div>
            <div className="note-box">
              <textarea
                className="form-control custom-textarea"
                rows="3"
                placeholder="Ví dụ: Nhà có người dị ứng với thuốc tẩy,.."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>

        {/* THANH BOTTOM CHỐT ĐƠN */}
        <div className="booking-bottom-bar">
          <div>
            <div className="summary-text mb-1">
              {selectedStaff} nhân viên × {selectedDuration.desc}
            </div>
            <div className="total-price">
              Tổng cộng: <span>{totalPrice.toLocaleString("vi-VN")} ₫</span>
            </div>
          </div>
          {/* Gắn sự kiện onClick vào nút này */}
          <button className="btn-continue" onClick={handleConfirmBooking}>
            Xác nhận Đặt lịch
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
