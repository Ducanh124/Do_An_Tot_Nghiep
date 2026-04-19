import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import serviceService from "../services/categoryService";
import "./ListCategory.css";

const categoryIcons = {
  1: "/icons/choi.png",
  2: "/icons/lich.png",
  3: "/icons/sofa.png",
  4: "/icons/vuon.png",
  5: "/icons/muoi.jpg",
  6: "/icons/oto.png",
};
const defaultIcon = "/icons/default.png";
const ListCategory = () => {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await serviceService.getCategories();
        const sortedData = data.sort((a, b) => a.id - b.id);
        setServices(sortedData);
      } catch (error) {
        console.error("Lỗi khi tải danh sách dịch vụ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

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
          {services.length === 0 ? (
            <p>Hiện chưa có dịch vụ nào hoạt động.</p>
          ) : (
            services.map((s) => (
              <div key={s.id} className="col-6 col-md-4 col-lg-3">
                <div
                  className="service-circle-card"
                  onClick={() => navigate(`/dich-vu/${s.id}`)}
                >
                  <div className="service-hover-card">
                    <div className="circle-icon shadow-sm">
                      <img
                        src={categoryIcons[s.id] || defaultIcon}
                        alt={s.name}
                        style={{
                          width: "55px",
                          height: "55px",
                          objectFit: "contain",
                        }}
                      />
                    </div>

                    <p className="circle-text mt-3">{s.name}</p>
                    <p className="circle-text mt-3">{s.description}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ListCategory;
