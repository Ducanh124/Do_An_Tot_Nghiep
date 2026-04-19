// frontend/src/components/service/ServiceList.jsx
import React, { useState, useEffect } from "react";
import SliderComponent from "react-slick";
import ServiceCard from "./ServiceCard";
import categoryService from "../../services/categoryService";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ServiceList.css";

const Slider = SliderComponent.default || SliderComponent;

// --- TỪ ĐIỂN HÌNH ẢNH ---
const imageMapping = {
  1: "/images/theoh1 .jpg",
  2: "/images/toanbo.jpg",
  3: "/images/sofa.jpg",
  4: "/images/donvuon.jpg",
  5: "/images/dietcontrung.jpg",
  6: "/images/chuyennha.jpg",
};

const ServiceList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Gọi ĐÚNG tên hàm getCategories() trong file cũ của bạn
        const data = await categoryService.getCategories();
        const sortedData = data.sort((a, b) => a.id - b.id); // sắp xếp lại data theo id từ bé đến lớn chứ không thro danh sách của backend
        setCategories(sortedData);
      } catch (error) {
        console.error("Lỗi tải danh mục:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const settings = {
    dots: true,
    infinite: categories.length > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="service-slider-section" id="services">
      <div className="container">
        <h2 className="text-center fw-bold">Danh mục dịch vụ</h2>

        <div className="mt-5">
          {loading ? (
            <div className="text-center">Đang tải danh sách dịch vụ...</div>
          ) : categories.length === 0 ? (
            <div className="text-center text-muted">Chưa có danh mục nào.</div>
          ) : (
            <Slider {...settings}>
              {categories.map((category) => (
                <div key={category.id} className="service-slide-wrapper">
                  <ServiceCard
                    id={category.id}
                    name={category.name}
                    imageUrl={
                      imageMapping[category.id] || "/images/default.jpg"
                    }
                  />
                </div>
              ))}
            </Slider>
          )}
        </div>
      </div>
    </section>
  );
};

export default ServiceList;
