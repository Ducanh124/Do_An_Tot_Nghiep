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
