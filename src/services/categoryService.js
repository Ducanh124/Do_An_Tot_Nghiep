import axiosClient from "../api/axiosClient";

const categoryService = {
  getCategories: async () => {
    try {
      const response = await axiosClient.get("/Categories");

      // TỐI ƯU: Dùng Optional Chaining (?.) để đào sâu vào object mà không sợ lỗi undefined
      // Ưu tiên lấy response.data.data (theo đúng ảnh của bạn)
      // Nếu Backend có đổi cấu trúc thành response.data thì nó tự động lấy cái thứ 2
      const items = response?.data?.data || response?.data || [];

      // Đảm bảo kết quả trả về luôn là 1 mảng để React .map() không bị sập
      return Array.isArray(items) ? items : [];
    } catch (error) {
      console.error("Lỗi khi gọi API danh mục:", error);
      return []; // Lỗi mạng thì trả về mảng rỗng
    }
  },

  getById: async (id) => {
    try {
      const response = await axiosClient.get(`/Categories/${id}`);
      return response?.data?.data || response?.data || null;
    } catch (error) {
      console.error(`Lỗi khi lấy chi tiết dịch vụ ${id}:`, error);
      return null;
    }
  },
};

export default categoryService;
