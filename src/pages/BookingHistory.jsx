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

  //Thanh toán
  // Hàm xử lý trạng thái thanh toán (Chỉ dùng class CSS tự viết, không dùng nền)
  const getPaymentBadge = (paymentStatus) => {
    const p = paymentStatus ? paymentStatus.toUpperCase() : "";
    switch (p) {
      case "PAID":
        return (
          <span className="payment-status-paid">
            <i className="bi bi-check-circle me-1"></i>Đã thanh toán
          </span>
        );
      case "PENDING":
        return (
          <span className="payment-status-pending">
            <i className="bi bi-clock-history me-1"></i>Chờ thanh toán
          </span>
        );
      case "FAILED":
        return (
          <span className="payment-status-failed">
            <i className="bi bi-x-circle me-1"></i>Thất bại
          </span>
        );
      default:
        return <span className="payment-status-unknown">Không rõ</span>;
    }
  };

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
        return {
          text: "Đang chờ xác nhận",
          className: "status-text-pending",
          icon: "bi-hourglass-split",
        };
      case "accepted":
        return {
          text: "Đã được chấp nhận",
          className: "status-text-accepted",
          icon: "bi-person-check",
        };
      case "is_working":
        return {
          text: "Đang tiến hành làm",
          className: "status-text-working",
          icon: "bi-tools",
        };
      case "completed":
        return {
          text: "Đã hoàn thành",
          className: "status-text-completed",
          icon: "bi-check2-all",
        };
      case "cancelled":
        return {
          text: "Đã hủy",
          className: "status-text-cancelled",
          icon: "bi-x-octagon",
        };
      default:
        return {
          text: status || "Không rõ",
          className: "status-text-default",
          icon: "bi-question-circle",
        };
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
          <button className="custom-btn btn-main" onClick={() => navigate("/")}>
            <i className="bi bi-calendar-plus"></i> Đặt lịch ngay
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
                  <th>Thanh toán</th>
                  <th>Thao tác</th>
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
                  const canReview =
                    booking.status?.toLowerCase() === "completed";
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

                      <td className="text-center align-middle">
                        <span className={badgeInfo.className}>
                          <i className={`bi ${badgeInfo.icon} me-1`}></i>
                          {badgeInfo.text}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="fw-bold text-danger mb-1">
                          {Number(booking.totalAmount).toLocaleString("vi-VN")}{" "}
                          đ
                        </div>
                        {getPaymentBadge(booking.paymentStatus)}
                      </td>
                      <td className="text-center">
                        <div className="d-flex flex-column align-items-center gap-2">
                          {canViewDetails ? (
                            <button
                              className="custom-btn btn-table btn-detail"
                              onClick={() => navigate(`/history/${booking.id}`)}
                            >
                              <i className="bi bi-eye"></i> Chi tiết
                            </button>
                          ) : (
                            <span className="text-muted small">Chờ xử lý</span>
                          )}

                          {/* Nút Đánh giá (Chỉ hiện khi completed) */}
                          {canReview && (
                            <button
                              className="custom-btn btn-table btn-review"
                              onClick={() =>
                                navigate(`/history/${booking.id}?action=review`)
                              }
                            >
                              <i className="bi bi-star-fill text-danger"></i>{" "}
                              Đánh giá
                            </button>
                          )}
                        </div>
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
                className="custom-btn btn-page me-3"
                disabled={currentPage === 1} // Nếu đang ở trang 1 thì làm mờ nút đi
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                <i className="bi bi-chevron-left"></i> Trang trước
              </button>

              <span className="fw-bold text-secondary">
                Trang {currentPage} / {totalPages}
              </span>

              <button
                className="custom-btn btn-page ms-3"
                disabled={currentPage >= totalPages} // Nếu đến trang cuối thì làm mờ nút đi
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Trang sau <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          )}
          <div className="history-actions mt-4 text-center">
            <button
              className="custom-btn btn-sub me-3"
              onClick={() => navigate("/")}
            >
              <i className="bi bi-arrow-left"></i> Quay lại
            </button>
            <button
              className="custom-btn btn-main"
              onClick={() => navigate("/danh-muc")}
            >
              <i className="bi bi-plus-circle"></i> Đặt thêm dịch vụ
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BookingHistory;
