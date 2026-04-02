// frontend/src/components/layout/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        {/* Logo - Chuyển sang màu xanh nước biển */}
        <Link className="navbar-brand fw-bold fs-3 text-primary" to="/">
          DoAn<span className="text-dark">GiupViec</span>
        </Link>

        {/* ĐÃ SỬA LỖI Ở DÒNG NÀY: Thay data-bs-toggle="target=..." thành data-bs-target="..." */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu chính */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto fw-medium">
            <li className="nav-item">
              <Link className="nav-link text-dark px-3" to="/">
                Trang chủ
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark px-3" to="#services">
                Dịch vụ cung cấp
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark px-3" to="#news">
                Tin tức
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark px-3" to="#commitment">
                Cam kết
              </Link>
            </li>
          </ul>

          {/* Nút Đặt dịch vụ */}
          <Link
            to="/booking/1"
            className="btn btn-primary fw-bold px-4 py-2 rounded-pill"
          >
            Đặt dịch vụ ngay
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;
