import axiosClient from "../api/axiosClient";

const serviceService = {
  // Hàm lấy toàn bộ danh sách dịch vụ từ Database
  getAll: () => {
    return axiosClient.get("/services");
  },

  // (Tùy chọn) Hàm lấy chi tiết 1 dịch vụ nếu Backend của bạn có hỗ trợ
  getById: (id) => {
    return axiosClient.get(`/services/${id}`);
  },
};

export default serviceService;
