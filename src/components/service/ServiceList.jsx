// frontend/src/components/service/ServiceList.jsx
import React, { useState } from "react";
import SliderComponent from "react-slick"; // Import thư viện Slider
import ServiceCard from "./ServiceCard";

// Import CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ServiceList.css";

// Mẹo xử lý lỗi Vite
const Slider = SliderComponent.default || SliderComponent;

const ServiceList = () => {
  // Dữ liệu dịch vụ
  const [services] = useState([
    {
      id: 1,
      categoryName: "Giúp việc lẻ",
      serviceName: "Giúp việc theo giờ",
      price: 120000,
      imageUrl:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 2,
      categoryName: "Tổng vệ sinh",
      serviceName: "Giúp việc định kỳ",
      price: 500000,
      imageUrl:
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 3,
      categoryName: "Nấu ăn",
      serviceName: "Tổng vệ sinh nhà cửa",
      price: 150000,
      imageUrl:
        "https://images.unsplash.com/photo-1527515637-ed06478d103b?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 4,
      categoryName: "Giặt ủi",
      serviceName: "Vệ sinh sofa, đệm",
      price: 300000,
      imageUrl:
        "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=600&auto=format&fit=crop",
    },
  ]);

  // Cấu hình thanh trượt cho Dịch vụ
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Máy tính hiện 3 dịch vụ cùng lúc
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    pauseOnHover: true,
    // Responsive: Tự động thu nhỏ số lượng thẻ trên điện thoại/tablet
    responsive: [
      {
        breakpoint: 992, // Màn hình tablet
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768, // Màn hình điện thoại
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section className="service-slider-section" id="services">
      <div className="container">
        <h2 className="text-center fw-bold">Dịch vụ của chúng tôi</h2>

        {/* THANH TRƯỢT DỊCH VỤ */}
        <div className="mt-5">
          <Slider {...settings}>
            {services.map((service) => (
              // Dùng class service-slide-wrapper để tạo khoảng trống giữa các thẻ
              <div key={service.id} className="service-slide-wrapper">
                <ServiceCard
                  id={service.id}
                  imageUrl={service.imageUrl}
                  categoryName={service.categoryName}
                  serviceName={service.serviceName}
                  price={service.price}
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default ServiceList;
