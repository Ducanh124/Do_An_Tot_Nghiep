// frontend/src/components/service/ServiceCard.jsx
import React from "react";
import { Link } from "react-router-dom";

// ĐÃ SỬA: Chỉ nhận id, imageUrl và name (từ file ServiceList truyền xuống)
const ServiceCard = ({ id, imageUrl, name }) => {
  return (
    <div className="card shadow-sm h-100 service-card-hover">
      {/* Hình ảnh danh mục */}
      <img
        src={imageUrl}
        className="card-img-top"
        alt={name}
        style={{ height: "200px", objectFit: "cover" }}
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
        }}
      />

      <div className="card-body d-flex flex-column text-center p-4">
        {/* Tên Danh mục (Thay cho tên dịch vụ) */}
        <h5 className="card-title fw-bold mb-4 text-dark">{name}</h5>
        <Link
          to={`/dich-vu/${id}`}
          className="btn btn-outline-primary mt-auto w-100 rounded-pill fw-bold"
        >
          Khám phá ngay <i className="bi bi-arrow-right ms-1"></i>
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
