import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import bookingService from "../services/bookingService";
import "./BookingHistory.css"; // Nhập file CSS vừa tạo

const BookingHistory = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  // Lấy User từ authService (chỉ lấy ID để gọi API)
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        // Gọi API lấy đơn hàng dựa trên ID khách hàng
        const data = await bookingService.getMyBookings(currentUser.id);
        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setBookings(sortedData);
      } catch (error) {
        console.error("Lỗi tải lịch sử:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [currentUser.id]);

  if (loading)
    return <div className="text-center mt-5">Đang tải lịch sử...</div>;

  return (
    <div className="container history-container">
      <h2 className="history-title text-center">Lịch sử đặt lịch của bạn</h2>

      {bookings.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">Bạn chưa có đơn đặt lịch nào.</p>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Đặt lịch ngay
          </button>
        </div>
      ) : (
        <>
          <div className="table-responsive table-history">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr className="text-center">
                  <th>Mã đơn</th>
                  <th>Thời gian làm</th>
                  <th>Địa chỉ</th>
                  <th>Trạng thái</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  const date = new Date(booking.scheduledTime);
                  return (
                    <tr key={booking.id}>
                      <td className="text-center booking-id">
                        #{booking.id.substring(0, 8).toUpperCase()}
                      </td>
                      <td className="text-center">
                        <div className="fw-bold text-primary">
                          {date.toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="text-muted small">
                          {date.toLocaleDateString("vi-VN")}
                        </div>
                      </td>
                      <td>{booking.address}</td>
                      <td className="text-center">
                        <span
                          className={`badge status-badge ${
                            booking.status === "pending"
                              ? "bg-warning text-dark"
                              : booking.status === "completed"
                                ? "bg-success"
                                : booking.status === "cancelled"
                                  ? "bg-danger"
                                  : "bg-primary"
                          }`}
                        >
                          {booking.status === "pending"
                            ? "Đang chờ"
                            : booking.status}
                        </span>
                      </td>
                      <td className="text-center fw-bold text-danger">
                        {Number(booking.totalAmount).toLocaleString("vi-VN")} đ
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="history-actions">
            <button className="btn-nav" onClick={() => navigate("/")}>
              Quay lại trang chủ
            </button>
            <button className="btn-nav" onClick={() => navigate("/danh-muc")}>
              Đặt thêm dịch vụ mới
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BookingHistory;
