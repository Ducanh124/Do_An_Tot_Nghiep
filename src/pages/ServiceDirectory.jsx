import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import serviceService from "../services/serviceService"; // Import sứ giả gọi API
import "./ServiceDirectory.css";

const ServiceDirectory = () => {
  const navigate = useNavigate();

  // 1. Khởi tạo mảng rỗng để chứa data thật từ DB
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Gọi API lấy dữ liệu ngay khi vừa vào trang
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await serviceService.getAll();
        setServices(data); // Đổ dữ liệu từ Backend vào State
      } catch (error) {
        console.error("Lỗi khi tải danh sách dịch vụ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // 3. Hiển thị Loading trong lúc đợi mạng
  if (loading) {
    return (
      <div className="text-center py-5">Đang tải danh sách dịch vụ...</div>
    );
  }

  return (
    <div className="directory-container py-5">
      <div className="container text-center">
        <h3 className="fw-bold mb-5 text-secondary">Chọn dịch vụ bạn cần</h3>
        <div className="row g-4 justify-content-center">
          {/* 4. Render danh sách thật */}
          {services.length === 0 ? (
            <p>Hiện chưa có dịch vụ nào hoạt động.</p>
          ) : (
            services.map((s) => (
              // Dùng service_id theo đúng thiết kế DB của bạn
              <div key={s.service_id} className="col-6 col-md-4 col-lg-3">
                <div
                  className="service-circle-card"
                  onClick={() => navigate(`/booking/${s.service_id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="circle-icon shadow-sm d-flex align-items-center justify-content-center mx-auto">
                    <img
                      // Trong DB bạn đặt là image_url. Nếu DB chưa có ảnh, nó sẽ lấy ảnh mặc định
                      src={s.image_url || "/icons/choi.png"}
                      alt={s.name}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <p className="circle-text mt-3 mb-1 fw-bold">{s.name}</p>
                  {/* Bổ sung thêm giá tiền từ DB cho xịn xò */}
                  <p className="text-primary small fw-semibold">
                    {Number(s.price).toLocaleString("vi-VN")} đ
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDirectory;
