import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./RegisterArea.css";
import {
  getCities,
  getDistricts,
  addWorkingArea,
  getAreas
} from "../service/authService.js";
import { useAuth } from "../AuthContext.jsx"; 

const RegisterArea = () => {
  const { user } = useAuth(); 
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
  
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setIsLoading(true);
        const responseData = await getCities();
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
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không tìm thấy thông tin nhân viên. Vui lòng đăng nhập lại!",
        confirmButtonColor: "#ff4d4f"
      });
      return;
    }

    if (!selectedCity) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Vui lòng chọn ít nhất một Thành phố!",
        confirmButtonColor: "#faad14"
      });
      return;
    }


    const finalAreaId = selectedDistrict ? selectedDistrict : selectedCity;


    const payload = {
      staffId: user.id,
      areaId: finalAreaId.toString(), // Ép kiểu thành string theo mẫu của Backend
      primaryArea: isPrimary,
    };

    console.log("Dữ liệu gửi lên Backend:", payload);

    try {
      setIsSubmitting(true);
      await addWorkingArea(payload);
      
      
      Swal.fire({
        icon: "success",
        title: '<span style="color: #28a745;">Thành công!</span>',
        html: '<span style="color: #1890ff;">Đăng ký khu vực làm việc thành công!</span>',
        timer: 1500, // Tự động đóng sau 1.5 giây
        showConfirmButton: false,
      });
      
      fetchRegisteredAreas(); // Tải lại danh sách

    } catch (error) {
      console.error("Lỗi gửi dữ liệu:", error);
      const errorMsg =
        error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!";
      

      Swal.fire({
        icon: "error",
        title: "Đăng ký thất bại",
        html: `<span style="color: #ff4d4f; font-weight: 500;">${errorMsg}</span>`, 
        confirmButtonColor: "#ff4d4f",
        confirmButtonText: "Đóng"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-area-container">
      {/* Form Đăng ký (Bên trái) */}
      <div className="register-area-card">
        <h2>Đăng ký nơi làm việc</h2>
        <p style={{ color: "#666",
                    fontsize: "14px",
                    marginbottom: "24px"}}>
                      Chọn khu vực bạn muốn nhận công việc</p>

        {isLoading ? (
          <div>Đang tải dữ liệu khu vực...</div>
        ) : (
          <form onSubmit={handleSubmit} className="register-area-form"  noValidate>
            {/* Các trường input giữ nguyên ... */}
            <div className="form-group">
              <label>Thành phố <span  style={{color:"blue"}}>*</span></label>
              <select value={selectedCity} onChange={handleCityChange}  className="area-selectt">
                <option value="" disabled>-- Chọn Thành phố --</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Quận/Huyện</label>
              <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} disabled={!selectedCity} className="area-selectt">
                <option value="">-- Toàn thành phố (Không chọn quận) --</option>
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>{district.name}</option>
                ))}
              </select>
            </div>

            <div >
              <label >
                <input type="checkbox" checked={isPrimary} onChange={(e) => setIsPrimary(e.target.checked)} />
                <span >Khu vực làm việc chính</span>
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