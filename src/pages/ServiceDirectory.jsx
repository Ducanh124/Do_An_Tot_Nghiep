import React from "react";
import { useNavigate } from "react-router-dom";
import "./ServiceDirectory.css";

const ServiceDirectory = () => {
  const navigate = useNavigate();

  // Danh sách các dịch vụ (Đã đổi TOÀN BỘ thành link ảnh)
  const services = [
    { id: 1, name: "Giúp việc theo giờ", icon: "/icons/choi.png" },
    { id: 2, name: "Giúp việc định kỳ", icon: "/icons/lich.png" },
    { id: 3, name: "Vệ sinh sofa, nệm", icon: "/icons/sofa.png" },
    { id: 4, name: "Vệ sinh đồ dùng công nghệ", icon: "/icons/maylanh.png" },
    { id: 5, name: "Phun diệt côn trùng", icon: "/icons/muoi.jpg" },
    { id: 6, name: "Dịch vụ vận chuyển", icon: "/icons/oto.png" },
  ];

  return (
    <div className="directory-container py-5">
      <div className="container text-center">
        <h3 className="fw-bold mb-5 text-secondary">Chọn dịch vụ bạn cần</h3>
        <div className="row g-4 justify-content-center">
          {services.map((s) => (
            <div key={s.id} className="col-6 col-md-4 col-lg-3">
              <div
                className="service-circle-card"
                onClick={() => navigate(`/booking/${s.id}`)}
              >
                <div className="circle-icon shadow-sm d-flex align-items-center justify-content-center">
                  <img
                    src={s.icon}
                    alt={s.name}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <p className="circle-text mt-3">{s.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceDirectory;
