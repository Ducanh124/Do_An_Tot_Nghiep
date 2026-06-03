import axiosClient from "../api/axiosClient";

const reviewService = {
  getReviews: async (params) => {
    try {
      const response = await axiosClient.get("/reviews", { params });
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy đánh giá:", error);
      return null;
    }
  },

  // Hàm tiện ích: Lấy đánh giá của 1 đơn hàng cụ thể
  getReviewByBookingId: async (bookingId) => {
    const res = await reviewService.getReviews({ bookingId: bookingId });
    const items =
      res?.data?.data ||
      res?.data ||
      res?.items ||
      (Array.isArray(res) ? res : []);

    // Nếu mảng có phần tử tức là đã đánh giá, lấy cái đầu tiên
    return items.length > 0 ? items[0] : null;
  },
  createReview: async (payload) => {
    const response = await axiosClient.post("/reviews", payload);
    return response;
  },
};

export default reviewService;
