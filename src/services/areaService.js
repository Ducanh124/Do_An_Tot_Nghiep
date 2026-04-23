import axiosClient from "../api/axiosClient";

const areaService = {
  // Hàm lấy danh sách toàn bộ khu vực (Tỉnh/Thành) kèm theo Quận/Huyện (children)
  getAll: async () => {
    try {
      const response = await axiosClient.get("/areas");
      if (response && response.data && Array.isArray(response.data)) {
        return response.data;
      }
      if (Array.isArray(response)) {
        return response;
      }
      return [];
    } catch (error) {
      console.error("Lỗi khi tải danh sách khu vực:", error);
      return [];
    }
  },
  getById: async (id) => {
    try {
      const response = await axiosClient.get(`/areas/${id}/get`);
      const result = response?.data?.data || response?.data || response;
      return result;
    } catch (error) {
      console.error(`Lỗi lấy chi tiết khu vực ${id}:`, error);
      return null;
    }
  },
};

export default areaService;
