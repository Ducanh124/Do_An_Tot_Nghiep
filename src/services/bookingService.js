import axiosClient from "../api/axiosClient";

const bookingService = {
  // Gửi gói dữ liệu đặt lịch lên API
  createBooking: async (bookingData) => {
    try {
      // Bạn check lại link API tạo đơn hàng của Backend nhé. Thường là POST /bookings
      const response = await axiosClient.post("/bookings", bookingData);
      return response;
    } catch (error) {
      // Bắt lỗi chi tiết để dễ debug
      console.error(
        "Lỗi khi gọi API tạo Booking:",
        error.response?.data || error,
      );
      throw error;
    }
  },
  getMyBookings: async (customerId, page = 1) => {
    try {
      const response = await axiosClient.get("/bookings", {
        params: {
          customerId: customerId,
          page: page,
          limit: 10,
        },
      });
      const items = response?.data?.data || response?.data || response;
      return Array.isArray(items) ? items : [];
    } catch (error) {
      console.error("Lỗi khi tải lịch sử đơn hàng:", error);
      return [];
    }
  },
};

export default bookingService;
