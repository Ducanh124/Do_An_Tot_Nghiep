// frontend/src/pages/BookingHistoryPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BookingHistory.css";

const BookingHistoryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. SỬA ĐỔI USE-EFFECT: Đọc dữ liệu từ localStorage thay vì Mock API
  useEffect(() => {
    const loadHistory = () => {
      setLoading(true);
      try {
        // Lấy dữ liệu từ bộ nhớ trình duyệt, nếu trống thì trả về mảng rỗng []
        const savedHistory = JSON.parse(
          localStorage.getItem("bookingHistory") || "[]",
        );
        setHistory(savedHistory);
      } catch (error) {
        console.error("Lỗi lấy lịch sử", error);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  // Hàm phụ trợ để render màu và chữ của Trạng thái
  const renderStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="status-badge badge-warning">Đang chờ xử lý</span>
        );
      case "completed":
        return (
          <span className="status-badge badge-success">Đã hoàn thành</span>
        );
      case "cancelled":
        return <span className="status-badge badge-danger">Đã hủy</span>;
      default:
        return <span className="status-badge badge-secondary">Không rõ</span>;
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page-wrapper">
      <div className="booking-desktop-container shadow-sm pb-5">
        {/* HEADER */}
        <div className="booking-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left"></i> Quay lại
          </button>
          <h4 className="mb-0 fw-bold theme-text-blue">Lịch sử đặt lịch</h4>
          <div style={{ width: "80px" }}></div>
        </div>

        <div className="booking-body">
          {history.length === 0 ? (
            <div className="text-center mt-5 text-muted">
              <i className="bi bi-journal-x" style={{ fontSize: "3rem" }}></i>
              <p className="mt-3">Bạn chưa có đơn đặt lịch nào.</p>
              <button
                className="btn btn-primary mt-2"
                onClick={() => navigate("/")}
              >
                Đặt dịch vụ ngay
              </button>
            </div>
          ) : (
            <div className="history-list d-flex flex-column gap-4">
              {/* THÔNG BÁO TỔNG SỐ ĐƠN HÀNG */}
              <div className="text-muted fw-bold mb-2">
                Bạn đã thực hiện tổng cộng {history.length} đơn hàng:
              </div>

              {history.map((item) => (
                <div key={item.id} className="history-card">
                  {/* Phần đầu Card: Mã đơn & Trạng thái */}
                  <div className="history-card-header">
                    <span className="fw-bold text-muted">
                      Mã đơn: #{item.id}
                    </span>
                    {renderStatusBadge(item.status)}
                  </div>

                  {/* Phần thân Card: Thông tin dịch vụ */}
                  <div className="history-card-body">
                    {/* 2. ĐÃ SỬA THÀNH item.serviceTitle */}
                    <h5 className="service-title theme-text-blue fw-bold mb-3">
                      {item.serviceTitle}
                    </h5>

                    <div className="service-detail-row">
                      <i className="bi bi-clock text-muted me-2"></i>
                      <span>
                        {/* 3. ĐÃ SỬA THÀNH item.createdAt */}
                        <strong>Ngày đặt:</strong> {item.createdAt}
                      </span>
                    </div>

                    <div className="service-detail-row mt-2">
                      <i className="bi bi-geo-alt text-muted me-2"></i>
                      <span>
                        <strong>Địa chỉ:</strong> {item.address}
                      </span>
                    </div>

                    {/* Hiện thêm số nhân viên cho chi tiết */}
                    <div className="service-detail-row mt-2">
                      <i className="bi bi-people text-muted me-2"></i>
                      <span>
                        <strong>Nhân sự:</strong> {item.staffCount} nhân viên
                      </span>
                    </div>
                  </div>

                  {/* Phần chân Card: Tổng tiền & Nút thao tác */}
                  <div className="history-card-footer">
                    <div className="history-price">
                      Tổng tiền:{" "}
                      <span>{item.totalPrice.toLocaleString("vi-VN")} ₫</span>
                    </div>
                    <div className="history-actions">
                      {item.status === "completed" && (
                        <button className="btn btn-outline-primary btn-sm rounded-pill px-3">
                          Đặt lại
                        </button>
                      )}
                      <button className="btn btn-light btn-sm rounded-pill px-3 text-muted border">
                        Chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingHistoryPage;
