import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import categoryService from "../services/categoryService";
import serviceService from "../services/serviceService";
import "./AllServices.css";
const categoryIcons = {
  1: "/icons/choi.png",
  2: "/icons/thucung.png",
  6: "/icons/chamsoc.png",
  3: "/icons/vuon.png",
  4: "/icons/muoi.jpg",
  5: "/icons/oto.png",
};
const defaultIcon = "/icons/default.png";

const AllServices = () => {
  const navigate = useNavigate();
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // lấy thông tin ủl hiện tại

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const categories = await categoryService.getCategories();
        const sortedCategories = categories.sort((a, b) => a.id - b.id);

        const servicesPromises = sortedCategories.map((cat) =>
          serviceService.getByCategoryId(cat.id),
        );
        const servicesResults = await Promise.all(servicesPromises);

        const combinedData = sortedCategories.map((cat, index) => ({
          ...cat,
          services: servicesResults[index] || [],
        }));

        setDataList(combinedData);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu gộp:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);
  useEffect(() => {
    // Chỉ thực hiện cuộn khi đã load xong dữ liệu (loading === false)
    // và trên URL có chứa mã hash (ví dụ: #category-1)
    if (!loading && location.hash) {
      // location.hash có dạng '#category-1', hàm substring(1) để cắt bỏ dấu '#'
      const elementId = location.hash.substring(1);
      const element = document.getElementById(elementId);

      if (element) {
        // Cuộn mượt mà đến đúng vị trí thẻ đó
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [loading, location.hash]); // Lắng nghe sự thay đổi của loading và URL

  if (loading) {
    return (
      <div className="as-loading-screen">
        <div className="as-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="as-page-wrapper">
      <div className="as-container">
        {/* Nút Quay Lại */}
        <button className="btn-back" onClick={() => navigate("/")}>
          <i className="bi bi-arrow-left"></i>
          <span>Về trang chủ</span>
        </button>

        {/* Tiêu đề trang */}
        <div className="as-page-header">
          <h2>Dịch vụ của chúng tôi</h2>
          <p>Lựa chọn dịch vụ chuyên nghiệp, tận tâm cho gia đình bạn</p>
        </div>

        {/* Bố cục chính: Trái (Menu) - Phải (Danh sách) */}
        <div className="as-main-layout">
          {/* CỘT TRÁI: MENU ĐIỀU HƯỚNG */}
          <aside className="as-sidebar-wrapper">
            <div className="sticky-sidebar">
              <h3>Danh mục dịch vụ</h3>
              <ul className="sidebar-menu">
                {dataList.map((cat) => (
                  <li key={cat.id}>
                    <a href={`#category-${cat.id}`} className="sidebar-link">
                      <img
                        src={categoryIcons[cat.id] || defaultIcon}
                        alt="icon"
                        className="sidebar-icon"
                      />
                      {cat.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* CỘT PHẢI: NỘI DUNG DANH SÁCH */}
          <main className="as-content-wrapper">
            {dataList.map((category) => (
              <div
                id={`category-${category.id}`}
                key={category.id}
                className="category-section-box"
              >
                {/* Header Danh mục */}
                <div className="category-box-header">
                  <img
                    src={categoryIcons[category.id] || defaultIcon}
                    alt={category.name}
                    className="category-box-icon"
                  />
                  <div className="category-box-title">
                    <h4>{category.name}</h4>
                    <span>{category.description}</span>
                  </div>
                </div>

                {/* Kiểm tra nếu Danh mục trống */}
                {category.services.length === 0 ? (
                  <div className="as-empty-alert">
                    <i className="bi bi-emoji-frown"></i>
                    <p>Hiện tại chưa có dịch vụ nào trong danh mục này.</p>
                  </div>
                ) : (
                  /* Lưới thẻ Dịch vụ */
                  <div className="as-services-grid">
                    {category.services.map((service) => (
                      <div
                        key={service.id}
                        className="service-item-card"
                        onClick={() => navigate(`/booking/${service.id}`)}
                      >
                        <div className="service-card-body">
                          <h5 className="service-title">{service.name}</h5>
                          <p className="service-desc line-clamp-2">
                            {service.description}
                          </p>

                          <div className="service-price-box">
                            <div className="price-info">
                              <span className="price-label">Giá chỉ từ</span>
                              <span className="price-value">
                                {Number(service.price).toLocaleString("vi-VN")}{" "}
                                ₫
                              </span>
                            </div>
                            <div className="as-btn-book">
                              Đặt lịch <i className="bi bi-arrow-right"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AllServices;
