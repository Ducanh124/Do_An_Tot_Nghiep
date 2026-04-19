// frontend/src/components/layout/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

import { SiZalo } from "react-icons/si";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row">
          {/* CỘT 1: Thông tin công ty & Liên hệ */}
          <div className="col-12 col-lg-3 mb-4 mb-lg-0 pr-lg-4">
            {/* Logo */}
            <Link
              className="text-decoration-none fw-bold fs-2 text-primary d-block mb-2"
              to="/"
            >
              <span className="fw-bold text-primary">Booking Family</span>
            </Link>
            <p className="text-muted fst-italic mb-4">
              Thay đổi cuộc sống phụ nữ Việt
            </p>

            <h4 className="footer-company-name">
              CÔNG TY CỔ PHẦN PHÁT TRIỂN DỊCH VỤ NHÀ SẠCH
            </h4>

            <p className="mb-2">
              Tổng đài Phản hồi Chất lượng:{" "}
              <span className="footer-hotline">1900 6082</span>
            </p>

            <div className="social-icons">
              <a href="#" className="social-icon-link bg-facebook">
                <FaFacebookF />
              </a>
              <a href="#" className="social-icon-link bg-zalo">
                Zalo
              </a>{" "}
              {/* Tạm dùng text hoặc thay bằng icon ảnh sau */}
              <a href="#" className="social-icon-link bg-instagram">
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* CỘT 2: Địa chỉ Hà Nội & Hải Phòng */}
          <div className="col-12 col-md-4 col-lg-3 mb-4 mb-md-0">
            <h4 className="footer-title">Thành phố Hà Nội</h4>
            <ul className="footer-list">
              <li>
                Văn phòng:79 Hồ Tùng Mậu phường Mai Dịch thành phố Hà Nội{" "}
              </li>
            </ul>

            <h4 className="footer-title">Thành phố Hải Phòng</h4>
            <ul className="footer-list">
              <li>
                Văn phòng:387 Phủ Thượng Đoạn phường Đông Hải thành phố Hải
                Phòng
              </li>
            </ul>
          </div>

          {/* CỘT 3: Địa chỉ Hồ Chí Minh */}
          <div className="col-12 col-md-4 col-lg-3 mb-4 mb-md-0">
            <h4 className="footer-title">Thành phố Hồ Chí Minh </h4>
            <ul className="footer-list">
              <li>
                Văn phòng:38 Trần Khắc Chân phường Tân Định thành phố Hồ Chí
                Minh{" "}
              </li>
            </ul>
          </div>

          {/* CỘT 4: Menu Links */}
          <div className="col-12 col-md-4 col-lg-3">
            <h4 className="footer-title">Menu</h4>
            <ul className="footer-list">
              <li>
                <Link to="/about" className="footer-link">
                  Giới Thiệu
                </Link>
              </li>
              <li>
                <Link to="/faq" className="footer-link">
                  Câu Hỏi Thường Gặp
                </Link>
              </li>
              <li>
                <Link to="/careers" className="footer-link">
                  Tuyển Dụng
                </Link>
              </li>
              <li>
                <Link to="/blog" className="footer-link">
                  Tin Tức - Blog
                </Link>
              </li>
              <li>
                <Link to="/terms" className="footer-link">
                  Điều Khoản Sử Dụng
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="footer-link">
                  Cam Kết Bảo Vệ Dữ Liệu Cá Nhân
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Dòng Copyright cuối cùng */}
        <div className="footer-bottom">
          <p className="mb-0">
            © {new Date().getFullYear()} Bản quyền thuộc về Công ty CP Phát
            Triển Dịch Vụ Nhà Sạch. Thiết kế bởi Sinh viên Thực hiện Đồ án.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
