// src/services/profileService.js
import { api } from "../libs/axios";
import ShiftCard from "../Schedule/components/ShiftCard";

export const profileService = {
  // Lấy thông tin cá nhân của user đang đăng nhập
  getProfile: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },



  // GỌI API ĐỂ ĐÓNG GÓI CARD NUMBER VÀ SKILLS GỬI LÊN BACKEND
  addProfile: async (userId, data) => {
    // Lưu ý: Dùng api.post hoặc api.put tùy thuộc vào cấu hình Backend của bạn
    const response = await api.post(`/staff/${userId}/add-profile`, data);
    return response.data;
  },
};


