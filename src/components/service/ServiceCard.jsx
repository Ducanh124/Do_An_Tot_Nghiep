// frontend/src/components/service/ServiceCard.jsx
import React from "react";
// ĐÃ SỬA: Import thêm thành phần Link để chuyển trang
import { Link } from "react-router-dom";

// ĐÃ SỬA: Thêm 'id' vào danh sách nhận dữ liệu (props)
const ServiceCard = ({ id, imageUrl, categoryName, serviceName }) => {
  return (
    <div className="card shadow-sm h-100">
      {/* Hình ảnh dịch vụ */}
      <img
        src={imageUrl}
        className="card-img-top"
        alt={serviceName}
        style={{ height: "200px", objectFit: "cover" }}
      />

      <div className="card-body d-flex flex-column">
        {/* Badge danh mục */}
        <div className="mb-2">
          <span className="badge bg-primary">{categoryName}</span>
        </div>

        {/* Tên và Giá dịch vụ */}
        <h5 className="card-title fw-bold">{serviceName}</h5>
        <p className="card-text text-danger fw-bold fs-5 mb-4"></p>

        {/* ĐÃ SỬA: Thay thế <button> bằng <Link> và nối thêm 'id' vào URL */}
        <Link
          to={`/booking/${id}`}
          className="btn btn-outline-primary mt-auto w-100"
        >
          Đặt ngay
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
