
import axiosClient from "../api/axiosClient";

const progressService = {
  getProgress: async (filters = {}) => {
    try {
      const response = await axiosClient.get("/progress", {
        params: filters,
      });
      return response?.data?.data || response?.data || [];
    } catch (error) {
      console.error("Lỗi khi tải API tiến độ:", error);
      throw error;
    }
  },
};

export default progressService;
