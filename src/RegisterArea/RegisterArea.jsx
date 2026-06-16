import React, { useState, useEffect } from "react";
import "./RegisterArea.css";
// Import các hàm API từ authService (hoặc profileService tùy bạn đặt)
import {
  getCities,
  getDistricts,
  addWorkingArea,
  getAreas
} from "../service/authService.js";
import { useAuth } from "../AuthContext.jsx"; // Để lấy thông tin user.id

const RegisterArea = () => {
  const { user } = useAuth(); // Lấy thông tin nhân viên đang đăng nhập
  const [registeredAreas, setRegisteredAreas] = useState([]);
  // State lưu trữ danh sách  dữ liệu từ API
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);

  // State lưu trữ lựa chọn của người dùng
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [isPrimary, setIsPrimary] = useState(false); // Nút tick mặc định là false

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hàm lấy danh sách khu vực đã đăng ký
  const fetchRegisteredAreas = async () => {
    if (user?.id) {
      try {
        const response = await getAreas(user.id);
        if (response.success) {
          setRegisteredAreas(response.data);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách khu vực:", error);
      }
    }
  };
  // 1. Gọi API lấy danh sách Thành phố khi vừa vào trang
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setIsLoading(true);
        const responseData = await getCities();
        // Trích xuất dữ liệu mảng thành phố từ cấu trúc Backend trả về
        const cityData = responseData.data?.data || [];
        setCities(cityData);
      } catch (error) {
        console.error("Lỗi khi tải danh sách thành phố:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCities();
    fetchRegisteredAreas();
  }, [user]);

  // 2. Xử lý khi người dùng chọn Thành phố
  const handleCityChange = async (e) => {
    const cityId = e.target.value;
    setSelectedCity(cityId);

    // Reset lại lựa chọn quận/huyện cũ
    setSelectedDistrict("");
    setDistricts([]);

    if (cityId) {
      try {
        const responseData = await getDistricts(cityId);
        const districtData =
          responseData.children || responseData.data?.children || [];
        setDistricts(districtData);
      } catch (error) {
        console.error("Lỗi khi tải danh sách quận/huyện:", error);
      }
    }
  };

  // 3. Xử lý Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      alert("Không tìm thấy thông tin nhân viên. Vui lòng đăng nhập lại!");
      return;
    }

    if (!selectedCity) {
      alert("Vui lòng chọn ít nhất một Thành phố!");
      return;
    }

    // LOGIC LẤY AREA_ID:
    // Nếu có chọn Quận (selectedDistrict) thì lấy ID Quận.
    // Nếu không chọn Quận (bỏ trống) thì lấy ID Thành phố (selectedCity).
    const finalAreaId = selectedDistrict ? selectedDistrict : selectedCity;

    // Đóng gói Payload theo đúng yêu cầu
    const payload = {
      staffId: user.id,
      areaId: finalAreaId.toString(), // Ép kiểu thành string theo mẫu của Backend
      primaryArea: isPrimary,
    };

    console.log("Dữ liệu gửi lên Backend:", payload);

    try {
      setIsSubmitting(true);
      await addWorkingArea(payload);
      alert("Đăng ký khu vực làm việc thành công!");
      fetchRegisteredAreas(); // Tải lại danh sách

      // Có thể reset form sau khi đăng ký thành công nếu muốn
      // setSelectedCity("");
      // setSelectedDistrict("");
      // setIsPrimary(false);
    } catch (error) {
      console.error("Lỗi gửi dữ liệu:", error);
      const errorMsg =
        error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!";
      alert(`Lỗi: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-area-container">
      {/* Form Đăng ký (Bên trái) */}
      <div className="register-area-card">
        <h2>Đăng ký nơi làm việc</h2>
        <p>Chọn khu vực bạn muốn nhận công việc</p>

        {isLoading ? (
          <div>Đang tải dữ liệu khu vực...</div>
        ) : (
          <form onSubmit={handleSubmit} className="register-area-form">
            {/* Các trường input giữ nguyên ... */}
            <div className="form-group">
              <label>Thành phố <span className="required">*</span></label>
              <select value={selectedCity} onChange={handleCityChange} required className="area-select">
                <option value="" disabled>-- Chọn Thành phố --</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Quận/Huyện</label>
              <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} disabled={!selectedCity} className="area-select">
                <option value="">-- Toàn thành phố (Không chọn quận) --</option>
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>{district.name}</option>
                ))}
              </select>
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" checked={isPrimary} onChange={(e) => setIsPrimary(e.target.checked)} />
                <span className="checkbox-text">Khu vực làm việc chính</span>
              </label>
            </div>

            <button type="submit" className="btn-submit-area" disabled={isSubmitting}>
              {isSubmitting ? "Đang gửi..." : "Gửi đăng ký"}
            </button>
          </form>
        )}
      </div>

      {/* Danh sách (Bên phải) */}
      <div className="area-list-section">
        <h3>Danh sách khu vực đã đăng ký</h3>
        <ul>
          {registeredAreas.map((item) => (
            <li key={item.areaId}>
              <strong>{item.area.join(", ")}</strong>
              {item.isPrimary && <span style={{ color: 'red', marginLeft: '10px' }}>(Khu vực làm chính)</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RegisterArea;
