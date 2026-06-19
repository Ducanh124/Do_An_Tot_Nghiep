import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import bookingService from "../services/bookingService";
import reviewService from "../services/reviewService";
import "./BookingHistory.css";

const BookingHistory = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Mặc định vào là trang 1
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang (Backend sẽ trả về)
  // lưu kết quả đánh giá số sao: { bookingId: số_sao }
  const [reviewMap, setReviewMap] = useState({});
  // thanh toán
  // nhận thêm tham số bookingStatus vào hàm
  const getPaymentBadge = (paymentStatus, bookingStatus) => {
    const payment = paymentStatus ? paymentStatus.toUpperCase() : "";
    const bStatus = bookingStatus ? bookingStatus.toLowerCase() : "";
    if (bStatus === "completed" && (payment === "CAST" || payment === "CASH")) {
      return (
        <span className="payment-status-paid">
          <i className="bi bi-check-circle me-1"></i>Đã thanh toán (Tiền mặt)
        </span>
      );
    }
    switch (payment) {
      case "PAID":
        return (
          <span className="payment-status-paid">
            <i className="bi bi-check-circle me-1"></i>Đã thanh toán(VNPAY)
          </span>
        );
      case "CAST":
      case "CASH":
        return (
          <span className="payment-status-pending">
            <i className="bi bi-clock-history me-1"></i>Chờ thanh toán (Tiền
            mặt)
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
            <i className="bi bi-x-circle me-1"></i>Thanh toán thất bại
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

        // 1. gọi api lấy đơn hàng với đủ 3 tham số
        const result = await bookingService.getMyBookings(
          currentUser.id,
          currentPage,
          8,
        );
        console.log("Dữ liệu API trả về:", result);
        const sortedData = result.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        setBookings(sortedData); // lưu danh sách để vẽ bảng
        setTotalPages(result.totalPages); // lưu tổng số trang để vẽ nút bấm

        // lấy số sao được đánh giá cho đơn hàng có trạng thái hoàn thành
        const completedBookings = sortedData.filter(
          (b) => b.status?.toLowerCase() === "completed",
        );

        if (completedBookings.length > 0) {
          // gọi api kiểm tra đánh giá của từng đơn hàng
          const reviewsData = await Promise.all(
            completedBookings.map((b) =>
              reviewService.getReviewByBookingId(b.id),
            ),
          );

          // ghi chép vào sổ tay reviewmap
          const newReviewMap = {};
          completedBookings.forEach((b, index) => {
            if (reviewsData[index]) {
              // gắn số sao lấy trường rating từ api trả về
              newReviewMap[b.id] = reviewsData[index].rating;
            }
          });
          setReviewMap(newReviewMap);
        } else {
          setReviewMap({});
        }
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
      case "assigned":
        return {
          text: "Đơn hàng đang chờ xác nhận",
          className: "status-text-pending",
        };
      case "pending":
        return {
          text: "Đơn hàng đang chờ xác nhận",
          className: "status-text-pending",
        };
      case "accepted":
        return {
          text: "Đơn hàng đã được chấp nhận",
          className: "status-text-accepted",
        };
      case "is_working":
        return {
          text: "Nhân viên đang tiến hành làm",
          className: "status-text-working",
        };
      case "is_coming":
        return {
          text: "Nhân viên đang đến nơi làm việc",
          className: "status-text-working",
        };

      case "completed":
        return {
          text: "Nhân viên đã hoàn thành",
          className: "status-text-completed",
        };
      case "cancelled":
        return {
          text: "Đơn hàng đã bị huỷ ",
          className: "status-text-cancelled",
        };
      case "no_staff_available":
        return {
          text: "Không có nhân viên tiếp nhận",
          className: "status-text-cancelled",
        };
      case "rejected":
        return {
          text: "Đơn hàng đã bị huỷ",
          className: "status-text-pending",
        };
      case "arrived":
        return {
          text: "Nhân viên đang đến",
          className: "status-text-working",
        };
      default:
        return {
          text: "Không lấy được trạng thái đơn hàng",
          className: "status-text-default",
        };
    }
  };

  // hàm xử lý đánh giá
  const getReviewStatus = (booking) => {
    if (booking.status?.toLowerCase() !== "completed") {
      return <span className="review-none">-</span>;
    }
    const ratingStar = reviewMap[booking.id]; // tra sổ tay xem đơn này có sao chưa
    if (ratingStar) {
      // đã đánh giá in ra ngôi sao bằng ký tự text
      const stars = [];
      for (let i = 0; i < 5; i++) {
        stars.push(
          <span
            key={i}
            style={{
              color: i < ratingStar ? "#ffc107" : "#e4e5e9", // màu vàng nếu có sao xám nhạt nếu trống
              fontSize: "1.2rem", // chỉnh lại kích thước sao cho cân đối với bảng
              margin: "0 2px", // tạo khoảng cách nhỏ giữa các ngôi sao
            }}
          >
            ★
          </span>,
        );
      }
      return <div className="review-stars">{stars}</div>;
    }
    // chưa đánh giá truy cập vào link có nút ấn giống với chi tiết đơn
    return (
      <span
        className="review-link"
        onClick={() => navigate(`/history/${booking.id}?action=review`)}
      >
        Đánh giá
      </span>
    );
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
                  <th>Trạng thái công việc</th>
                  <th>Thanh toán</th>
                  <th>Số sao cho nhân viên</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  const date = new Date(booking.scheduledTime);
                  const badgeInfo = getStatusBadge(booking.status);
                  const canViewDetails = [
                    "arrived",
                    "no_staff_available",
                    "is_working",
                    "completed",
                    "is_coming",
                    "assigned",
                    "accepted",
                    "pending",
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
                      <td>
                        <div
                          style={{
                            maxWidth: "200px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {booking.address}
                        </div>
                      </td>

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
                        {getPaymentBadge(booking.paymentStatus, booking.status)}
                      </td>

                      {/* cột đánh giá */}
                      <td className="text-center align-middle">
                        {getReviewStatus(booking)}
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
                            <span className="text-muted small">Chờ xử lí</span>
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
                disabled={currentPage === 1} // nếu đang ở trang 1 thì làm mờ nút đi
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                <i className="bi bi-chevron-left"></i> Trang trước
              </button>

              <span className="fw-bold text-secondary">
                Trang {currentPage} / {totalPages}
              </span>

              <button
                className="custom-btn btn-page ms-3"
                disabled={currentPage >= totalPages} // nếu đến trang cuối thì làm mờ nút đi
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
