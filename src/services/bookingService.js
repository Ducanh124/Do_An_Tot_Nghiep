import axiosClient from "../api/axiosClient";

const bookingService = {
  // Hàm tạo đơn hàng mới (Dùng cho trang Checkout)
  create: (bookingData) => {
    return axiosClient.post("/bookings/create", bookingData);
  },

  // HÀM MỚI: Lấy danh sách lịch sử của khách hàng
  getMyHistory: () => {
    // API này Backend sẽ tự dùng Token để biết user nào đang đăng nhập và trả về lịch sử của người đó
    return axiosClient.get("/bookings/my-history");
  },
};

export default bookingService;
