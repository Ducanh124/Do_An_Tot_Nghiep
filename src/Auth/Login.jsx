import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import "./Login.css";
import { login } from "../service/authService.js";

const Login = () => {
  const navigate = useNavigate();

  // State quản lý form đăng nhập
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // State quản lý việc ẩn/hiện mật khẩu
  const [showPassword, setShowPassword] = useState(false);

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
      // Gọi API đăng nhập thực tế
      const data = await login(formData);

      // IN LOG ĐỂ KIỂM TRA DỮ LIỆU BACKEND TRẢ VỀ
      console.log("Dữ liệu Login trả về từ Backend:", data);

      // Cách lấy token an toàn: Cover nhiều trường hợp đặt tên biến của Backend
      // (Bao gồm cả trường hợp data bọc trong một object data khác)
      const token = data?.data?.accessToken;
      if (token) {
        // Lưu token vào localStorage để file axios.js có thể lấy và gắn vào header
        localStorage.setItem("access_token", token);
        console.log("Đã lưu token vào trình duyệt thành công!");

        alert("Đăng nhập thành công!");
        // Điều hướng người dùng sang trang profile
        navigate("/profile");
      } else {
        // Cảnh báo nếu Backend trả về OK nhưng không có cấu trúc chứa token
        alert(
          "Đăng nhập thành công nhưng không tìm thấy Token. Vui lòng bật F12 (Console) để kiểm tra cấu trúc dữ liệu!",
        );
      }
    } catch (err) {
      // Ưu tiên hiển thị message lỗi từ backend trả về
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Đăng nhập thất bại. Vui lòng thử lại!";
      alert(errorMessage);
    } finally {
      // Dù thành công hay thất bại cũng phải tắt trạng thái loading
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        {/* Form Đăng nhập */}
        <form onSubmit={handleLogin} className="login-form">
          {/* Ô nhập Email/Số điện thoại */}
          <div className="form-group">
            <label>Email hoặc Số điện thoại</label>
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input
                type="text"
                name="email"
                placeholder="Nhập email của bạn"
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
              <FiLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              {/* Nút bật/tắt con mắt */}
              <button
                type="button"
                className="btn-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
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
