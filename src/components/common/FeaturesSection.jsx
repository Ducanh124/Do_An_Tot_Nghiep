// frontend/src/components/common/FeaturesSection.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./FeaturesSection.css";

const FeaturesSection = () => {
  return (
    <section className="features-section">
      <div className="container text-center">
        <div className="row mt-5">
          {/* Cột 1 */}
          <div className="col-12 col-md-4 mb-4">
            {/* Dùng ảnh minh họa có tông màu xanh nhạt */}
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Chuyên nghiệp"
              className="feature-icon"
            />
            <h3 className="feature-title">Chuyên nghiệp - Tận tâm</h3>
            <p className="feature-desc">
              Đội ngũ Tư vấn viên & Chăm sóc Khách hàng kinh nghiệm, chuyên
              nghiệp, tận tâm. Chúng tôi cam kết bảo hành dịch vụ khi Khách hàng
              chưa hài lòng.
            </p>
          </div>

          {/* Cột 2 */}
          <div className="col-12 col-md-4 mb-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3256/3256783.png"
              alt="Tiện lợi"
              className="feature-icon"
            />
            <h3 className="feature-title">Ứng dụng tiện lợi</h3>
            <p className="feature-desc">
              Tìm Người giúp việc nhà nhanh chóng qua vài thao tác. Ứng dụng
              cung cấp đầy đủ thông tin về dịch vụ, tiện lợi trong việc chủ động
              lựa chọn và đánh giá.
            </p>
          </div>

          {/* Cột 3 */}
          <div className="col-12 col-md-4 mb-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1904/1904112.png"
              alt="Tiêu chuẩn"
              className="feature-icon"
            />
            <h3 className="feature-title">Người giúp việc tiêu chuẩn</h3>
            <p className="feature-desc">
              Người giúp việc nhà tiêu chuẩn, đáng tin cậy, có đầy đủ hồ sơ.
              Công ty chịu trách nhiệm tuyển chọn, đào tạo và quản lý trực tiếp.
            </p>
          </div>
        </div>
        <div className="mt-5">
          <Link
            to="/danh-muc"
            className="btn btn-primary fw-bold px-5 py-3 rounded-pill fs-5 shadow-sm"
          >
            Đặt dịch vụ ngay
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
