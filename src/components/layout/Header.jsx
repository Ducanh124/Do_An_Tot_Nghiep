import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();

  // State 1: Lưu thông tin người dùng
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // State 2 (MỚI): Công tắc bật/tắt menu xổ xuống
  const [showMenu, setShowMenu] = useState(false);

  const handleBookingClick = () => {
    const isLogged = localStorage.getItem("user");
    if (!isLogged) {
      navigate("/login");
    } else {
      navigate("/danh-muc");
    }
  };

  const handleLogout = () => {
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

            {/* --- KHU VỰC SỬA MỚI: MENU DROPDOWN --- */}
            {user && (
              <div className="position-relative border-start ps-3">
                {/* 1. Nút hiển thị tên */}
                <div
                  className="user-display d-flex align-items-center"
                  style={{ cursor: "pointer", userSelect: "none" }}
                  onClick={() => setShowMenu(!showMenu)}
                >
                  <i className="bi bi-person-circle me-1 fs-5"></i>
                  <span className="fw-bold">{user.name}</span>
                  <i
                    className={`bi bi-chevron-${showMenu ? "up" : "down"} ms-2`}
                    style={{ fontSize: "0.8rem" }}
                  ></i>
                </div>

                {/* 2. Khối Menu xổ xuống */}
                {showMenu && (
                  <div
                    className="dropdown-menu show position-absolute end-0 mt-3 shadow border-0 rounded"
                    style={{ minWidth: "180px", zIndex: 1050 }}
                  >
                    <button
                      className="dropdown-item py-2"
                      onClick={() => {
                        setShowMenu(false); // Cụp menu lại trước khi nhảy trang
                        navigate("/profile");
                      }}
                    >
                      <i className="bi bi-person-gear me-2 text-primary"></i>
                      Sửa hồ sơ
                    </button>

                    <div className="dropdown-divider my-1"></div>

                    <button
                      className="dropdown-item py-2 text-danger fw-bold"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Thoát
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
