// src/context/AuthContext.jsx
// import React, { createContext, useState, useEffect } from 'react';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { profileService } from './service/profileService.js'; // Sửa lại đường dẫn cho đúng dự án của bạn

// 1. Tạo cái kho
const AuthContext = createContext();

// 2. Tạo người quản lý kho
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Biến lưu toàn bộ thông tin user
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Chỉ gọi API nếu trong trình duyệt có token
        const token = localStorage.getItem('access_token'); 
        if (token) {
          const res = await profileService.getProfile();
          // API của bạn trả về { data: { id: ..., name: ... } }
          // Nên chúng ta lấy res.data
          setUser(res.data); 
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng ở Context:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Tạo một cái móc (hook) để các trang khác dễ dàng chọc vào kho lấy dữ liệu
export const useAuth = () => useContext(AuthContext);