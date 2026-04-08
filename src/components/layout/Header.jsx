import React, { useState, useEffect } from "react"; // Đã sửa lỗi useState
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Quản lý trạng thái đăng nhập

  // Lấy thông tin user từ localStorage khi trang load
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);
  const handleBookingClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/danh-muc");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top py-2">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand d-flex flex-column" to="/">
          <span className="fw-bold text-primary">DoAnGiupViec</span>
          <small
            style={{ fontSize: "0.65rem", marginTop: "-5px" }}
            className="text-secondary"
          >
            Thay đổi cuộc sống phụ nữ Việt
          </small>
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
              <a className="nav-link my-custom-link" href="#commitment">
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
              className="btn btn-primary px-4 py-2 rounded"
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
