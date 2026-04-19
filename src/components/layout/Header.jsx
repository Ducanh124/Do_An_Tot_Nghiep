import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();

  // 1. SỬA Ở ĐÂY: Khởi tạo dữ liệu đồng bộ ngay từ đầu thay vì chờ useEffect
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  // 2. SỬA Ở ĐÂY: Soi thẳng vào LocalStorage cho "chắc cú"
  const handleBookingClick = () => {
    // Kiểm tra trực tiếp trong bộ nhớ trình duyệt xem có thật sự đăng nhập chưa
    const isLogged = localStorage.getItem("user");

    if (!isLogged) {
      navigate("/login");
    } else {
      navigate("/danh-muc");
    }
  };

  const handleLogout = () => {
    // Xóa sạch dấu vết khi thoát
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top py-2">
      <div className="container">
        <Link className="navbar-brand d-flex flex-column" to="/">
          <span className="fw-bold text-primary">Booking Family</span>
          <small className="brand-slogan">Thay đổi cuộc sống phụ nữ Việt</small>
        </Link>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link className="nav-link my-custom-link" to="/">
                Trang chủ
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link my-custom-link" href="/danh-muc">
                Dịch vụ
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link my-custom-link" href="/policy">
                Cam kết
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link my-custom-link" href="/history">
                Lịch sử đặt lịch
              </a>
            </li>
          </ul>

          <div className="nav-actions d-flex align-items-center gap-3">
            <button
              onClick={handleBookingClick}
              className="btn btn-primary px-4 py-2 rounded btn-booking"
            >
              Đặt dịch vụ ngay
            </button>

            {/* PHẦN TÊN USER: Chỉ hiện khi đã đăng nhập */}
            {user && (
              <div className="d-flex align-items-center gap-2 border-start ps-3">
                <span className="user-display">
                  <i className="bi bi-person-circle me-1"></i> {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-primary px-4 py-2 rounded"
                >
                  Thoát
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
