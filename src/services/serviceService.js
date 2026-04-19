import axiosClient from "../api/axiosClient";

const serviceService = {
  // Lấy danh sách toàn bộ dịch vụ
  getAll: async () => {
    try {
      const response = await axiosClient.get("/services");

      // Nếu mảng bị kẹt trong thuộc tính 'data' (Cấu trúc phân trang)
      if (response && response.data && Array.isArray(response.data)) {
        return response.data;
      }
      if (Array.isArray(response)) {
        return response;
      }

      return [];
    } catch (error) {
      console.error("Lỗi khi gọi API dịch vụ:", error);
      return [];
    }
  },

  // 3. HÀM LẤY CHI TIẾT 1 DỊCH VỤ
  getById: async (id) => {
    try {
      const response = await axiosClient.get(`/services/${id}/get`);
      // axiosClient đã bóc vỏ, nên response bây giờ chính là OBJECT DỊCH VỤ {id: 16, name: ...}
      return response;
    } catch (error) {
      console.error(`Lỗi khi lấy chi tiết dịch vụ ${id}:`, error);
      return null;
    }
  },
  getByPage: async (pageNumber) => {
    try {
      const response = await axiosClient.get(`/services?page=${pageNumber}`);

      // Tương tự, chọc vào lấy đúng cái mảng ra
      if (response && response.data && Array.isArray(response.data)) {
        return response.data;
      }

      if (Array.isArray(response)) {
        return response;
      }

      return [];
    } catch (error) {
      console.error(`Lỗi khi gọi API dịch vụ trang ${pageNumber}:`, error);
      return [];
    }
  },
  getByCategoryId: async (categoryId) => {
    try {
      const response = await axiosClient.get("/services", {
        params: {
          categoryId: categoryId, // Truyền ID danh mục vào đây để Backend tự lọc
          limit: 100, // Ép Backend trả về tối đa 100 dịch vụ/trang để khỏi bị sót
        },
      });
      if (response && response.data && Array.isArray(response.data)) {
        return response.data;
      }
      if (Array.isArray(response)) {
        return response;
      }
      return [];
    } catch (error) {
      console.error(`Lỗi khi lấy dịch vụ của danh mục ${categoryId}:`, error);
      return [];
    }
  },
};

export default serviceService;
