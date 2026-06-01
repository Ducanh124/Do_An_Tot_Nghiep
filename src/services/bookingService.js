import axiosClient from "../api/axiosClient";

const bookingService = {
  createBooking: async (bookingData) => {
    try {
      const response = await axiosClient.post("/bookings", bookingData);
      return response;
    } catch (error) {
      console.error(
        "Lỗi khi gọi API tạo Booking:",
        error.response?.data || error,
      );
      throw error;
    }
  },
  getMyBookings: async (customerId, page, limit) => {
    try {
      const response = await axiosClient.get("/bookings", {
        params: {
          customerId: customerId,
          page: page,
          limit: limit,
        },
      });

      // 👉 In ra để chắc chắn file này đã được chạy
      console.log("=== CHECK RESPONSE TRONG SERVICE ===", response);

      // 1. TÌM TỔNG SỐ TRANG (Lục soát ở mọi ngóc ngách)
      let total = 1;
      if (response.totalPages) {
        total = response.totalPages;
      } else if (response.data && response.data.totalPages) {
        total = response.data.totalPages;
      }

      // 2. TÌM MẢNG DỮ LIỆU ĐƠN HÀNG
      let items = [];
      if (Array.isArray(response)) {
        items = response;
      } else if (Array.isArray(response.data)) {
        items = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        items = response.data.data;
      }
      return {
        data: items,
        totalPages: total,
      };
    } catch (error) {
      console.error("Lỗi khi tải lịch sử đơn hàng:", error);
      return { data: [], totalPages: 1 };
    }
  },
  getBookingById: async (id) => {
    try {
      const response = await axiosClient.get(`/bookings/${id}`);
      return response?.data?.data || response?.data || response;
    } catch (error) {
      console.error("Lỗi lấy chi tiết đơn:", error);
      throw error;
    }
  },
};

export default bookingService;
