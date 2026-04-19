// src/pages/ServiceListByCategory.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import serviceService from "../services/serviceService";
import "./ServiceListByCategory.css";

const ServiceListByCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const catId = Number(categoryId);
        const data = await serviceService.getByCategoryId(catId);

        setServices(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách dịch vụ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [categoryId]);

  if (loading) {
    return (
      <div
        className="service-list-container d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="service-list-container pt-4">
      <div className="container">
        {/* Nút Quay Lại */}
        <button className="btn-back mb-4" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left fs-5"></i>
          <span>Quay lại danh mục</span>
        </button>

        <h3 className="fw-bold mb-4 text-dark">Chọn gói dịch vụ phù hợp</h3>

        {/* Kiểm tra nếu danh mục trống */}
        {services.length === 0 ? (
          <div className="alert alert-warning text-center rounded-3 py-4 shadow-sm">
            <i className="bi bi-emoji-frown fs-1 d-block mb-2"></i>
            Hiện tại chưa có dịch vụ nào trong danh mục này. Bạn vui lòng quay
            lại sau nhé!
          </div>
        ) : (
          <div className="row g-4">
            {/* Lặp qua mảng dịch vụ và in ra màn hình */}
            {services.map((service) => (
              <div key={service.id} className="col-12 col-md-6 col-lg-4">
                <div
                  className="service-item-card"
                  onClick={() => navigate(`/booking/${service.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="service-card-body">
                    <h5 className="service-title fw-bold">{service.name}</h5>
                    <p className="service-desc text-muted line-clamp-2">
                      {service.description}
                    </p>

                    <div className="service-price-box mt-3 d-flex justify-content-between align-items-end">
                      <div>
                        <div
                          className="price-label text-muted"
                          style={{ fontSize: "0.85rem" }}
                        >
                          Giá chỉ từ
                        </div>
                        <div className="price-value fw-bold text-danger fs-5">
                          {Number(service.price).toLocaleString("vi-VN")} ₫
                        </div>
                      </div>
                      <div className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold">
                        Đặt lịch <i className="bi bi-arrow-right ms-1"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceListByCategory;
