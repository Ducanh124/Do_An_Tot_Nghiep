import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { regis, getCities, getDistricts } from "../service/authService.js";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    areaId: "",
    gender: "male", //  Cập nhật mặc định là 'male' để thẻ select không bị rỗng ban đầu
    role: "customer",
    avatar: "", 
  });

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //  State lưu trữ lỗi của từng ô input
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const responseData = await getCities();
        const cityData = responseData.data.data || [];
        setCities(cityData);
      } catch (error) {
        console.error("Lỗi khi tải danh sách thành phố:", error);
      }
    };
    fetchCities();
  }, []);

  const handleCityChange = async (e) => {
    const cityId = e.target.value;
    setSelectedCity(cityId);
    setDistricts([]);
    setFormData({ ...formData, areaId: "" });
    
    // Xóa lỗi của areaId nếu người dùng chọn lại Thành phố
    if (formErrors.areaId) {
      setFormErrors({ ...formErrors, areaId: "" });
    }

    if (cityId) {
      try {
        const responseData = await getDistricts(cityId);
        const districtData = responseData.children || responseData.data?.children || [];
        setDistricts(districtData);
      } catch (error) {
        console.error("Lỗi khi tải danh sách quận/huyện:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Xóa dòng lỗi màu đỏ ngay khi người dùng bắt đầu gõ lại vào ô đó
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  //  THÊM MỚI: Xử lý sự kiện khi người dùng chọn ảnh
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Dùng FileReader để mã hóa ảnh thành chuỗi Base64 (string $binary)
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result }); // reader.result chính là chuỗi Base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.areaId) {
      setFormErrors({ ...formErrors, areaId: "Vui lòng chọn Quận/Huyện" });
      return;
    }

    setIsLoading(true);
    setFormErrors({}); // Reset lại toàn bộ lỗi trước khi gửi form mới

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      address: formData.address,
      areaId: Number(formData.areaId),
      role: formData.role,
      gender: formData.gender,
      //  THÊM MỚI: Đóng gói trường avatar gửi xuống Backend (Nếu ko chọn ảnh thì gửi chuỗi rỗng "")
      avatar: formData.avatar,
    };

    try {
      await regis(payload);
      alert("Đăng ký tài khoản thành công!");
      navigate("/login");
    } catch (error) {
      const backendError = error.response?.data;
      
      // Logic bóc tách mảng lỗi từ Backend
      if (backendError && backendError.errors && Array.isArray(backendError.errors)) {
        const errorsObj = {};
        backendError.errors.forEach((err) => {
          // Nếu 1 trường (ví dụ gender) trả về 2 lỗi, ta chỉ lấy lỗi đầu tiên hiển thị cho gọn
          if (!errorsObj[err.field]) {
            errorsObj[err.field] = err.message;
          }
        });
        // Đẩy toàn bộ cục lỗi vừa nhặt được vào State để hiển thị ra màn hình
        setFormErrors(errorsObj); 
      } else {
        // Lỗi chung chung (không phải lỗi do điền sai form)
        const errorMsg = backendError?.message || "Đăng ký thất bại. Vui lòng thử lại!";
        alert(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page-container">
      <div className="register-card">
        <div className="register-header">
          <h2>Tạo tài khoản mới</h2>
          <p>Điền thông tin bên dưới để trải nghiệm dịch vụ.</p>
        </div>

        {/* Thêm autoComplete="off" để tắt gợi ý khó chịu của trình duyệt */}
        <form onSubmit={handleRegister} autoComplete="off">
          
          {/* 👉 THÊM MỚI: GIAO DIỆN UPLOAD ẢNH ĐẠI DIỆN */}
          <div className="avatar-upload-container">
            <div className="avatar-preview">
              {formData.avatar ? (
                <img src={formData.avatar} alt="Avatar Preview" />
              ) : (
                <span className="avatar-placeholder">Ảnh đại diện (Tùy chọn)</span>
              )}
            </div>
            {/* Input file bị ẩn đi, dùng label bọc lại để tạo nút bấm đẹp hơn */}
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
            />
            <label htmlFor="avatar-upload" className="btn-upload-avatar">
              Chọn ảnh
            </label>
          </div>

          <div className="form-grid">
            {/* --- CỘT TRÁI --- */}
            <div className="form-column">
              <div className="form-group">
                <label>Họ và tên</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    style={{ borderColor: formErrors.name ? "#ff4d4f" : "" }}
                  />
                </div>
                {/* HIỂN THỊ LỖI */}
                {formErrors.name && <span className="error-message">{formErrors.name}</span>}
              </div>

              <div className="form-group">
                <label>Email</label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    style={{ borderColor: formErrors.email ? "#ff4d4f" : "" }}
                  />
                </div>
                {/* HIỂN THỊ LỖI */}
                {formErrors.email && <span className="error-message">{formErrors.email}</span>}
              </div>

              <div className="form-group">
                <label>Mật khẩu</label>
                <div className="input-wrapper">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    style={{ borderColor: formErrors.password ? "#ff4d4f" : "" }}
                  />
                </div>
                {/* HIỂN THỊ LỖI */}
                {formErrors.password && <span className="error-message">{formErrors.password}</span>}
              </div>

              <div className="form-group">
                <label>Số điện thoại</label>
                <div className="input-wrapper">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    style={{ borderColor: formErrors.phone ? "#ff4d4f" : "" }}
                  />
                </div>
                {/* HIỂN THỊ LỖI */}
                {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
              </div>
            </div>

            {/* --- CỘT PHẢI --- */}
            <div className="form-column">
              <div className="form-group">
                <label>Thành phố</label>
                <div className="input-wrapper">
                  <select
                    value={selectedCity}
                    onChange={handleCityChange}
                    required
                  >
                    <option value="" disabled>-- Chọn Thành phố --</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Quận/Huyện</label>
                <div className="input-wrapper">
                  <select
                    name="areaId"
                    value={formData.areaId}
                    onChange={handleInputChange}
                    required
                    disabled={!selectedCity}
                    style={{ borderColor: formErrors.areaId ? "#ff4d4f" : "" }}
                  >
                    <option value="" disabled>-- Chọn Quận/Huyện --</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* HIỂN THỊ LỖI */}
                {formErrors.areaId && <span className="error-message">{formErrors.areaId}</span>}
              </div>

              <div className="form-group">
                <label>Địa chỉ nhà</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    style={{ borderColor: formErrors.address ? "#ff4d4f" : "" }}
                  />
                </div>
                {/* HIỂN THỊ LỖI */}
                {formErrors.address && <span className="error-message">{formErrors.address}</span>}
              </div>

              <div className="form-group">
                <label>Giới tính</label>
                <div className="input-wrapper">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    style={{ borderColor: formErrors.gender ? "#ff4d4f" : "" }}
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                {/* HIỂN THỊ LỖI */}
                {formErrors.gender && <span className="error-message">{formErrors.gender}</span>}
              </div>
            </div>
          </div>

          <button type="submit" className="btn-register" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Hoàn tất Đăng ký"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;