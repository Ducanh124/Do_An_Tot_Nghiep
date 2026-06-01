import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import bookingService from "../services/bookingService";
import "./BookingHistory.css";

const BookingHistory = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Mặc định vào là trang 1
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang (Backend sẽ trả về)

  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);

        // Gọi API với đủ 3 tham số
        const result = await bookingService.getMyBookings(
          currentUser.id,
          currentPage,
          8,
        );
        console.log("Dữ liệu API trả về:", result);
        const sortedData = result.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        setBookings(sortedData); // Lưu danh sách để vẽ bảng
        setTotalPages(result.totalPages); // Lưu tổng số trang để vẽ nút bấm
      } catch (error) {
        console.error("Lỗi tải lịch sử:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [currentUser.id, currentPage]);

  const getStatusBadge = (status) => {
    const s = status ? status.toLowerCase() : "";
    switch (s) {
      case "pending":
        return { text: "Đang chờ xác nhận", className: "bg-warning text-dark" };
      case "is_working":
        return {
          text: "Đang tiến hành làm việc",
          className: "bg-info text-dark",
        };
      case "completed":
        return { text: "Đã hoàn thành", className: "bg-success" };
      case "cancelled":
        return { text: "Đã hủy", className: "bg-danger" };
      case "accepted":
        return {
          text: "Đã được chấp nhận",
          className: "bg-primary text-white",
        };
      default:
        return { text: status || "Không rõ", className: "bg-secondary" };
    }
  };

  if (loading)
    return <div className="text-center mt-5">Đang tải lịch sử...</div>;

  return (
    <div className="container history-container mb-5">
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
          <div className="table-responsive table-history shadow-sm">
            <table className="table table-hover align-middle mb-0 bg-white">
              <thead className="table-light">
                <tr className="text-center">
                  <th>Mã đơn</th>
                  <th>Thời gian làm</th>
                  <th>Địa chỉ</th>
                  <th>Trạng thái</th>
                  <th>Thành tiền</th>
                  <th>Tiến độ công việc</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  const date = new Date(booking.scheduledTime);
                  const badgeInfo = getStatusBadge(booking.status);
                  const canViewDetails = [
                    "accepted",
                    "is_working",
                    "completed",
                  ].includes(booking.status?.toLowerCase());

                  return (
                    <tr key={booking.id}>
                      <td className="text-center booking-id">
                        #{String(booking.id).substring(0, 8).toUpperCase()}
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
                          className={`badge status-badge ${badgeInfo.className}`}
                        >
                          {badgeInfo.text}
                        </span>
                      </td>
                      <td className="text-center fw-bold text-danger">
                        {Number(booking.totalAmount).toLocaleString("vi-VN")} đ
                      </td>
                      <td className="text-center">
                        {canViewDetails ? (
                          <button
                            className="btn btn-sm btn-outline-info rounded-pill px-3"
                            onClick={() => navigate(`/history/${booking.id}`)}
                          >
                            <i className="bi bi-eye me-1"></i> Chi tiết
                          </button>
                        ) : (
                          <span className="text-muted small">Chờ xử lý</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center mt-4">
              <button
                className="btn btn-outline-primary me-3 px-3"
                disabled={currentPage === 1} // Nếu đang ở trang 1 thì làm mờ nút đi
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                <i className="bi bi-chevron-left"></i> Trang trước
              </button>

              <span className="fw-bold text-secondary">
                Trang {currentPage} / {totalPages}
              </span>

              <button
                className="btn btn-outline-primary ms-3 px-3"
                disabled={currentPage >= totalPages} // Nếu đến trang cuối thì làm mờ nút đi
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Trang sau <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          )}
          <div className="history-actions mt-4 text-center">
            <button
              className="btn btn-secondary me-2 px-4"
              onClick={() => navigate("/")}
            >
              Quay lại
            </button>
            <button
              className="btn btn-primary px-4"
              onClick={() => navigate("/danh-muc")}
            >
              Đặt thêm dịch vụ
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BookingHistory;
