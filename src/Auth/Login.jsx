// src/pages/Login/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; 
import "./Login.css";
import { login } from "../service/authService.js";

const Login = () => {
  const navigate = useNavigate();

  // State quản lý form đăng nhập
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // State quản lý hiệu ứng loading khi bấm nút
  const [isLoading, setIsLoading] = useState(false);

  // Xử lý khi người dùng gõ vào ô input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Xử lý sự kiện Đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await login(formData);
      console.log("Dữ liệu Login trả về từ Backend:", data);

      const token = data?.data?.accessToken;
      if (token) {
        localStorage.setItem("access_token", token);
        console.log("Đã lưu token vào trình duyệt thành công!");

        Swal.fire({
          icon: "success",
              // title: '<span style="color: #28a745;">Thành công!</span>',
              // html: '<span style="color: #1890ff;">Đăng nhập thành công!</span>',
          title: "Thành công!",
          text : "Đăng nhập thành công!",
          timer: 1500, // Tự động đóng sau 1.5 giây
          showConfirmButton: false,
        }).then(() => {
          // Đợi Swal chạy xong hiệu ứng rồi mới chuyển trang
          window.location.href = '/schedule';
        });

      } else {
   
        Swal.fire({
          icon: "warning",
          title: "Cảnh báo",
          text: "Đăng nhập thành công nhưng không tìm thấy Token. Vui lòng bật F12 (Console) để kiểm tra cấu trúc dữ liệu!",
        });
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Đăng nhập thất bại. Vui lòng thử lại!";
      
  
      Swal.fire({
        icon: "error",
        title: "Đăng nhập thất bại",
        html: `<span style="color: #ff4d4f; font-weight: 500;">${errorMessage}</span>`, 
        //Nút xác nhận
        confirmButtonColor: "blue",
       confirmButtonText: "Thử lại ngay"
      });
    } finally {
      setIsLoading(false);
    }
  };   

  return (
    <div className="login-page-container">
      <div className="login-card">
        {/* Form Đăng nhập */}
        <form onSubmit={handleLogin} className="login-form">
          {/* Ô nhập Email */}
          <div className="form-group">
            <label>Nhập Email</label>
            <div className="input-wrapper">
              <input 
                type="text"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Ô nhập Mật khẩu */}
          <div className="form-group">
            <label>Mật khẩu</label>
            <div className="input-wrapper">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Nút Submit */}
          <button type="submit" className="btn-login" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        {/* Chuyển sang trang Đăng ký */}
        <div className="login-footer">
          <p>
            Bạn chưa có tài khoản?
            <span
              style={{
                color: "blue",
                cursor: "pointer",
                textDecoration: "underline",
                marginLeft: "5px"
              }}
              onClick={() => navigate("/register")}
            >
              Đăng ký ngay
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;