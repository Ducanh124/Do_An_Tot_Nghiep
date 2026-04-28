import React from "react";
import SliderComponent from "react-slick";
import { Link } from "react-router-dom"; // Công cụ giúp chuyển trang không cần reload

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./HeroSlider.css";
const Slider = SliderComponent.default || SliderComponent;

const HeroSlider = () => {
  const settings = {
    dots: true, // Bật dấu chấm bên dưới
    infinite: true, // Trượt lặp vòng vô tận
    speed: 500, // Tốc độ lướt
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    pauseOnHover: true,
  };

  const banners = [
    {
      id: 1,
      imageUrl: "/images/banner khuyenmai.png",
      alt: "Khuyến mãi dọn nhà",
      linkTo: "/danh-muc",
    },
    {
      id: 2,
      imageUrl: "/images/banner sofa.png",
      alt: "Dịch vụ tổng vệ sinh",
      linkTo: "/danh-muc",
    },
    {
      id: 3,
      imageUrl: "/images/banner nhabep.png",
      alt: "Tải app nhận quà",
      linkTo: "/danh-muc",
    },
  ];

  return (
    <div className="hero-slider-container mb-5">
      <Slider {...settings}>
        {banners.map((banner) => (
          <div key={banner.id}>
            {/* bức ảnh cx chính là đg dẫn */}
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
