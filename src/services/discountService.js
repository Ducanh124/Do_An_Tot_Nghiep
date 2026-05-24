import axiosClient from "../api/axiosClient";
const discountService = {
  getAllDiscounts: async () => {
    try {
      // Gọi thẳng API, interceptor của axiosClient sẽ tự động bóc tách vỏ data giúp bạn
      const response = await axiosClient.get("/discounts");
      return response?.data?.data || response?.data || response;
    } catch (error) {
      console.error("Lỗi khi tải danh sách mã giảm giá:", error);
      return [];
    }
  },
};

export default discountService;
