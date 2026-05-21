import axiosClient from "../api/axiosClient";

const staffService = {
  // Hàm gọi API lấy hồ sơ nhân viên theo ID
  getStaffProfile: async (id) => {
    try {
      const response = await axiosClient.get(`/Staff/${id}/profile`);
      return response?.data?.data || response?.data || response;
    } catch (error) {
      console.error(`Lỗi lấy hồ sơ nhân viên ${id}:`, error);
      return null;
    }
  },
};

export default staffService;
