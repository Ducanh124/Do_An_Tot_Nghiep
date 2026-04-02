// frontend/src/components/common/HeroSlider.jsx
import React from "react";
import SliderComponent from "react-slick";
import { Link } from "react-router-dom"; // Công cụ giúp chuyển trang không cần reload

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./HeroSlider.css";

// Mẹo xử lý lỗi import của Vite
const Slider = SliderComponent.default || SliderComponent;

const HeroSlider = () => {
  const settings = {
    dots: true, // Bật dấu chấm bên dưới
    infinite: true, // Trượt lặp vòng vô tận
    speed: 500, // Tốc độ lướt
    slidesToShow: 1, // Hiện 1 ảnh
    slidesToScroll: 1, // Trượt 1 ảnh
    autoplay: true, // Tự động chạy
    autoplaySpeed: 3000, // Đợi 3 giây rồi trượt tiếp
    arrows: false, // Tắt nút mũi tên 2 bên
    pauseOnHover: true, // Tạm dừng khi rê chuột vào ảnh hoặc dấu chấm
  };

  const banners = [
    {
      id: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop",
      alt: "Khuyến mãi dọn nhà",
      linkTo: "/booking/1", // CLICK VÀO ẢNH NÀY SẼ SANG TRANG ĐẶT LỊCH SỐ 1
    },
    {
      id: 2,
      imageUrl:
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200&auto=format&fit=crop",
      alt: "Dịch vụ tổng vệ sinh",
      linkTo: "/booking/2", // CLICK VÀO ẢNH NÀY SẼ SANG TRANG ĐẶT LỊCH SỐ 2
    },
    {
      id: 3,
      imageUrl:
        "https://images.unsplash.com/photo-1527515637-ed06478d103b?q=80&w=1200&auto=format&fit=crop",
      alt: "Tải app nhận quà",
      linkTo: "/booking/3", // CLICK VÀO ẢNH NÀY SẼ SANG TRANG ĐẶT LỊCH SỐ 3
    },
  ];

  return (
    <div className="hero-slider-container mb-5">
      <Slider {...settings}>
        {banners.map((banner) => (
          <div key={banner.id}>
            {/* THẺ LINK: Biến bức ảnh thành một nút bấm khổng lồ */}
            <Link to={banner.linkTo} className="d-block">
              <img
                src={banner.imageUrl}
                alt={banner.alt}
                className="hero-slide-img"
                style={{
                  cursor: "pointer",
                }} /* Hiện hình bàn tay khi đưa chuột vào */
              />
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSlider;
