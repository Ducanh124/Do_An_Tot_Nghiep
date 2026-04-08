import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Dùng cái này để chuyển trang xịn hơn
import authService from "../services/authService"; // Import Sứ giả API
import "./Login.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate(); // Khởi tạo hàm chuyển trang

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // BIẾN HÀM NÀY THÀNH ASYNC ĐỂ GỌI API CHỜ PHẢN HỒI TỪ SERVER
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      // ==========================================
      // LUỒNG 1: ĐĂNG NHẬP (GỌI API TỪ DATABASE)
      // ==========================================
      try {
        // Gửi email và pass lên Backend
        const response = await authService.login(
          formData.email,
          formData.password,
        );

        // Nếu thành công, lấy thông tin User từ Database để hiện lời chào
        const userData = response.user;
        alert("Đăng nhập thành công! Chào bạn " + userData.name);

        // Chuyển hướng về trang chủ một cách mượt mà (Không làm tải lại toàn bộ trang web như window.location.href)
        navigate("/");
      } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        // Lấy thông báo lỗi từ Backend (nếu có) hoặc báo lỗi chung
        const errorMsg =
          error.response?.data?.message ||
          "Sai email hoặc mật khẩu. Vui lòng thử lại!";
        alert(errorMsg);
      }
    } else {
      // ==========================================
      // LUỒNG 2: ĐĂNG KÝ MỚI VÀO DATABASE
      // ==========================================
      if (formData.password !== formData.confirmPassword) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
      }

      try {
        // Gom dữ liệu đúng chuẩn bảng 1.1 Users của bạn
        const newUserData = {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
          // (Backend sẽ tự lo việc mã hóa pass thành password_hash)
        };

        // Gửi lên Backend để lưu vào Database
        await authService.register(newUserData);

        alert("Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.");

        // Xóa trắng form mật khẩu để an toàn
        setFormData({ ...formData, password: "", confirmPassword: "" });

        // Tự động gạt thẻ sang tab Đăng Nhập cho người dùng tiện thao tác
        setIsLogin(true);
      } catch (error) {
        console.error("Lỗi đăng ký:", error);
        const errorMsg =
          error.response?.data?.message ||
          "Đăng ký thất bại. Email có thể đã tồn tại!";
        alert(errorMsg);
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* THANH CHUYỂN ĐỔI (TOGGLE) */}
        <div className="auth-toggle-box">
          <div
            className={`auth-toggle-slider ${!isLogin ? "right" : ""}`}
          ></div>
          <div
            className={`auth-toggle-btn ${isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Đăng Nhập
          </div>
          <div
            className={`auth-toggle-btn ${!isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Đăng Ký
          </div>
        </div>

        {/* NỘI DUNG FORM SẼ THAY ĐỔI THEO TRẠNG THÁI */}
        <form
          onSubmit={handleSubmit}
          className="fade-in"
          key={isLogin ? "login" : "register"}
        >
          {/* Những trường này CHỈ HIỆN khi ở chế độ ĐĂNG KÝ (!isLogin) */}
          {!isLogin && (
            <>
              <div className="mb-3">
                <label className="form-label">Họ và tên</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder="Nhập họ và tên"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Số điện thoại</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  placeholder="Nhập số điện thoại"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          {/* Email và Mật khẩu: Chế độ nào cũng cần */}
          <div className="mb-3">
            <label className="form-label">Email của bạn</label>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          {/* Xác nhận mật khẩu: CHỈ HIỆN khi ở chế độ ĐĂNG KÝ */}
          {!isLogin && (
            <div className="mb-3">
              <label className="form-label">Xác nhận mật khẩu</label>
              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <button type="submit" className="btn btn-auth border-0">
            {isLogin ? "ĐĂNG NHẬP" : "TẠO TÀI KHOẢN"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
