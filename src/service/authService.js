// src/service/authService.js (hoặc thư mục tương ứng của bạn)
import { api } from "../libs/axios.js";

// Đăng nhập
export const login = async (data) => {
  const res = await api.post('/auth/sign-in', data);
  return res.data;
};

// Đăng ký
export const regis = async (data) => {
  const res = await api.post('/auth/sign-up', data);
  return res.data;
};

// ==========================================
// CÁC API PHỤ TRỢ CHO QUÁ TRÌNH ĐĂNG KÝ
// ==========================================

// Lấy danh sách toàn bộ Thành phố (Khu vực gốc)
export const getCities = async () => {
  const res = await api.get('/areas');
  return res.data;
};

// Lấy danh sách Quận/Huyện dựa vào ID của Thành phố
export const getDistricts = async (cityId) => {
  const res = await api.get(`/areas/${cityId}/get`);
  return res.data;
};