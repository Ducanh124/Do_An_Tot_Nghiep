// frontend/src/components/service/ServiceList.jsx
import React, { useState } from "react";
import SliderComponent from "react-slick";
import ServiceCard from "./ServiceCard";
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

      imageUrl: "/images/theoh .jpg",
    },
    {
      id: 2,
      categoryName: "Tổng vệ sinh",
      serviceName: "Giúp việc định kỳ",

      imageUrl: "/images/toanbo.jpg",
    },
    {
      id: 3,
      categoryName: "Giặt ủi",
      serviceName: "Vệ sinh sofa, đệm",

      imageUrl: "/images/sofa.jpg",
    },
    {
      id: 5,
      categoryName: "Bảo dưỡng sửa chữa đồ công nghệ",
      serviceName: "Bảo dưỡng điều hoà",

      imageUrl: "/images/suamaylanh.jpg",
    },
    {
      id: 5,
      categoryName: "Vệ sinh",
      serviceName: "Phun diệt côn trùng ",

      imageUrl: "/images/dietcontrung.jpg",
    },
    {
      id: 6,
      categoryName: "Vận chuyển ",
      serviceName: "Dịch vụ chuyển đồ ",

      imageUrl: "/images/chuyennha.jpg",
    },
  ]);

  // Cấu hình thanh trượt cho Dịch vụ
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
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
