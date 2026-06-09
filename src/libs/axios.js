
import axios from 'axios';

export const api = axios.create({
  baseURL: "https://bookingfamily.onrender.com/api/v1", // Thay bằng URL Backend thực tế của bạn
});

// THÊM ĐOẠN NÀY: Tự động nhét Token vào mỗi Request gửi đi
api.interceptors.request.use(
  (config) => {
    // Lấy token từ LocalStorage
    const token = localStorage.getItem('access_token');
    
    // Nếu có token thì nhét vào Header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

