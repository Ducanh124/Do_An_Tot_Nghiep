import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
        window.location.href = '/schedule';
        console.log("Đã lưu token vào trình duyệt thành công!");

        alert("Đăng nhập thành công!");
        navigate("/schedule");
      } else {
        alert(
          "Đăng nhập thành công nhưng không tìm thấy Token. Vui lòng bật F12 (Console) để kiểm tra cấu trúc dữ liệu!",
        );
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Đăng nhập thất bại. Vui lòng thử lại!";
      alert(errorMessage);
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
              {/* Đã xóa nút bấm con mắt, cố định type là password */}
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
            Bạn chưa có tài khoản?{" "}
            <span
              style={{
                color: "blue",
                cursor: "pointer",
                textDecoration: "underline",
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