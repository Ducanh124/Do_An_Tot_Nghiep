// frontend/src/pages/BookingHistoryPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bookingService from "../services/bookingService"; // Gọi sứ giả API
import "./BookingHistory.css";

const BookingHistoryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. SỬA ĐỔI USE-EFFECT: Kéo dữ liệu từ Database thay vì localStorage
  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        // Gọi API lấy lịch sử đặt lịch của user đang đăng nhập
        const data = await bookingService.getMyHistory();
        setHistory(data);
      } catch (error) {
        console.error("Lỗi lấy lịch sử từ máy chủ", error);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  // 2. CẬP NHẬT TRẠNG THÁI (Khớp với DB: pending, accepted, in_progress, completed...)
  const renderStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="status-badge badge-warning">Đang chờ xử lý</span>
        );
      case "accepted":
        return <span className="status-badge badge-info">Đã nhận đơn</span>;
      case "in_progress":
        return (
          <span className="status-badge badge-primary">Đang thực hiện</span>
        );
      case "completed":
        return (
          <span className="status-badge badge-success">Đã hoàn thành</span>
        );
      case "cancelled":
        return <span className="status-badge badge-danger">Đã hủy</span>;
      default:
        return (
          <span className="status-badge badge-secondary">
            {status || "Không rõ"}
          </span>
        );
    }
  };

  // Hàm fomat ngày tháng cho đẹp
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
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
              <div className="text-muted fw-bold mb-2">
                Bạn đã thực hiện tổng cộng {history.length} đơn hàng:
              </div>

              {history.map((item) => (
                <div key={item.booking_id} className="history-card">
                  {/* Mã đơn: Dùng booking_id */}
                  <div className="history-card-header">
                    <span className="fw-bold text-muted">
                      Mã đơn: #{item.booking_id}
                    </span>
                    {renderStatusBadge(item.status)}
                  </div>

                  <div className="history-card-body">
                    {/* Tên dịch vụ: Backend cần join bảng Services để trả về trường service_name */}
                    <h5 className="service-title theme-text-blue fw-bold mb-3">
                      {item.service_name || `Dịch vụ #${item.service_id}`}
                    </h5>

                    <div className="service-detail-row">
                      <i className="bi bi-calendar-check text-muted me-2"></i>
                      <span>
                        {/* Thời gian làm việc dự kiến (scheduled_time) */}
                        <strong>Ngày làm:</strong>{" "}
                        {formatDate(item.scheduled_time)}
                      </span>
                    </div>

                    <div className="service-detail-row mt-2">
                      <i className="bi bi-geo-alt text-muted me-2"></i>
                      <span>
                        <strong>Địa chỉ:</strong> {item.address}
                      </span>
                    </div>

                    {item.note && (
                      <div className="service-detail-row mt-2">
                        <i className="bi bi-pencil-square text-muted me-2"></i>
                        <span>
                          <strong>Ghi chú:</strong> {item.note}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Tổng tiền: Dùng total_amount */}
                  <div className="history-card-footer">
                    <div className="history-price">
                      Tổng tiền:{" "}
                      <span className="fw-bold text-danger">
                        {Number(item.total_amount).toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                    <div className="history-actions">
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
