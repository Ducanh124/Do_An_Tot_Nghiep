import React, { useState } from "react";
import "./Login.css";

const AuthPage = () => {
  // Biến điều khiển: true = Form Đăng nhập | false = Form Đăng ký
  const [isLogin, setIsLogin] = useState(true);

  // State dùng chung để hứng dữ liệu
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

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (isLogin) {
  //     console.log("Đang gọi API Đăng nhập với:", {
  //       email: formData.email,
  //       password: formData.password,
  //     });
  //     alert("Test Đăng nhập thành công!");
  //   } else {
  //     if (formData.password !== formData.confirmPassword) {
  //       alert(" Mật khẩu xác nhận không khớp!");
  //       return;
  //     }
  //     console.log("Đang gọi API Đăng ký với toàn bộ dữ liệu:", formData);
  //     alert("Test Đăng ký thành công!");
  //   }
  // };

  // Tìm đến hàm handleSubmit trong file AuthPage.jsx của bạn và thay bằng đoạn này:

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      const userData = {
        name: "Đoàn Đức Anh",
        email: formData.email,
      };

      localStorage.setItem("user", JSON.stringify(userData));

      console.log("Đăng nhập với:", userData);
      alert("Đăng nhập thành công! Chào bạn " + userData.name);

      window.location.href = "/";
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
      }

      const userData = {
        name: formData.name,
        email: formData.email,
      };
      localStorage.setItem("user", JSON.stringify(userData));

      console.log("Đăng ký tài khoản mới:", userData);
      alert("Đăng ký thành công!");
      window.location.href = "/";
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
