// src/pages/ReportReview/ReportReview.jsx
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2"; 
import "./reportReview.css";
import { scheduleService } from "../service/scheduleService.js";
import { useAuth } from "../AuthContext.jsx";

const ReportReview = () => {
  const { user } = useAuth();
  
  const [allReviews, setAllReviews] = useState([]); // Chứa toàn bộ đánh giá gốc
  const [loading, setLoading] = useState(true);
  const [starFilter, setStarFilter] = useState("all"); // 'all' hoặc số từ 1 đến 5

  useEffect(() => {
    const fetchReviews = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const res = await scheduleService.getStaffJobs(user.id);
        
        // Bóc tách mảng jobs an toàn tuyệt đối
        let jobs = [];
        if (Array.isArray(res?.data?.data)) {
          jobs = res.data.data;
        } else if (Array.isArray(res?.data)) {
          jobs = res.data;
        } else if (Array.isArray(res)) {
          jobs = res;
        }

      // gộp tên các dịch vụ xong gộp dữ liệu để hiển thị
        const validReviews = jobs
          .filter(
            (job) => job.booking && job.booking.customerReview
          )
          .map((job) => {
            // Lặp qua mảng bookingDetails để gộp tên tất cả các dịch vụ (nếu có nhiều dịch vụ)
            const combinedServiceNames = job.booking.bookingDetails
              ?.map(detail => detail.service?.name)
              .join(" + ") || "Dịch vụ tổng hợp";

            return {
              id: job.id,
              bookingId: job.bookingId,
              customerName: job.booking.customer?.name || "Khách hàng ẩn danh",
              customerPhone: job.booking.customer?.phone || "Không có SĐT",
              serviceNames: combinedServiceNames,
              address: job.booking.address || "Chưa có thông tin địa chỉ",
              scheduledTime: job.booking.scheduledTime,
              rating: job.booking.customerReview.rating || 0,
              reviewText: job.booking.customerReview.review || "",
              createdAt: job.booking.customerReview.createdAt,
            };
          });

        // Sắp xếp đánh giá mới nhất lên đầu 
        validReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setAllReviews(validReviews);
      } catch (error) {
        console.error("Lỗi khi tải danh sách đánh giá:", error);
        
        Swal.fire({
          icon: "error",
          title: "Lỗi tải dữ liệu",
          html: '<span style="color: #ff4d4f; font-weight: 500;">Không thể tải danh sách đánh giá! Vui lòng thử lại.</span>',
          confirmButtonColor: "#ff4d4f",
          confirmButtonText: "Đóng"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [user]);

  const displayedReviews = starFilter === "all" 
    ? allReviews 
    : allReviews.filter(r => r.rating === Number(starFilter));
    // NẾU LÀ ALL THÌ GIỮ NGUYÊN ĐÁNH GIÁ, CÒN NẾU LÀ SỐ THÌ LỌC StarFilter = số đấy

  // Hàm định dạng thời gian ca làm việc
  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleString('vi-VN', { 
      hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' 
    });
  };

  // Hàm vẽ Ngôi sao (Render 5 sao, tô màu theo số điểm)
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "star-filled" : "star-empty"}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="review-container">
      <div className="review-header-wrapper">
        <h2 className="review-title">Đánh giá của khách hàng</h2>
        
        {/* BỘ LỌC SỐ SAO */}
        <div className="star-filter-container">
          <label>Lọc theo:</label>
          <select 
            className="star-select" 
            value={starFilter} 
            onChange={(e) => setStarFilter(e.target.value)}
          >
            <option value="all">Tất cả đánh giá</option>
            <option value="5">5 Sao </option>
            <option value="4">4 Sao </option>
            <option value="3">3 Sao </option>
            <option value="2">2 Sao </option>
            <option value="1">1 Sao </option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-text">Đang tải dữ liệu đánh giá...</div>
      ) : displayedReviews.length === 0 ? (
        // nếu k có thì sẽ có 2 trường hợp, là tất cả sao k có và từng sao k có
        <div className="empty-state">
          {starFilter === "all" 
            ? "Bạn chưa có bài đánh giá nào từ khách hàng." 
            : `Không có đánh giá ${starFilter} sao nào.`}
        </div>
      ) : (
        <div className="review-grid">
          {displayedReviews.map((item) => (
            <div key={item.id} className="review-card">
              {/* Cột Trái: Thông tin khách hàng & Thời gian */}
              <div className="review-info">
                {/* HIỂN THỊ TÊN DỊCH VỤ */}
                <div style={{ fontWeight: 'bold', color: '#1890ff', fontSize: '15px', marginBottom: '6px' }}>
                  {item.serviceNames}
                </div>
                
                <div className="customer-name">{item.customerName}</div>
                <div className="customer-phone">{item.customerPhone}</div>
                
                {/* HIỂN THỊ ĐỊA CHỈ KHÁCH HÀNG  */}
                <div style={{ fontSize: '16px', color: '#666', marginTop: '4px' }}>
                   {item.address}
                </div>
                
                <div className="shift-time" style={{ marginTop: '6px' }}>
                  Ca làm: {formatTime(item.scheduledTime)}
                </div>
              </div>
              
              {/* Cột Phải: Số sao & Nội dung đánh giá */}
              <div className="review-content">
                <div className="stars-wrapper">
                  {renderStars(item.rating)}
                </div>
                <div className="review-text">
                  "{item.reviewText || "Khách hàng không để lại bình luận"}"
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportReview;