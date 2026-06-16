// src/pages/Register/Register.jsx
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
    gender: "",
    role: "staff",
    avatar: "",
  });

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

    // Xóa lỗi của city và areaId nếu người dùng chọn lại Thành phố
    setFormErrors((prev) => ({ ...prev, city: "", areaId: "" }));

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        avatarFile: file, 
        avatarPreview: previewUrl, 
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // 1. KIỂM TRA LỖI THÀNH PHỐ VÀ QUẬN HUYỆN (FRONTEND)
    let hasLocalError = false;
    const localErrors = {};

    if (!selectedCity) {
      localErrors.city = "Vui lòng chọn Thành phố";
      hasLocalError = true;
    }
    if (selectedCity && !formData.areaId) {
      localErrors.areaId = "Vui lòng chọn Quận/Huyện";
      hasLocalError = true;
    }

    if (hasLocalError) {
      setFormErrors(localErrors);
      return; // Chặn không cho gửi API
    }

    setIsLoading(true);
    setFormErrors({});

    // 2. ĐÓNG GÓI DỮ LIỆU
    //tạo 1 biến formdatasend  kiể formdata
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("areaId", Number(formData.areaId));
    formDataToSend.append("role", formData.role);
    formDataToSend.append("gender", formData.gender);

    if (formData.avatarFile) {
      formDataToSend.append("avatar", formData.avatarFile);
    }

    // 3. GỌI API VÀ XỬ LÝ LỖI (BACKEND)
    try {
      await regis(formDataToSend);
      alert("Đăng ký tài khoản thành công!");
      navigate("/login");
    } catch (error) {
      const backendError = error.response?.data;

      // Xử lý riêng biệt lỗi "Email đã tồn tại" (Vì backend trả về dạng Object chứ không phải Array)
      if (backendError?.message === "Email đã tồn tại") {
        setFormErrors({ email: "Email này đã được sử dụng, vui lòng chọn email khác" });
        setIsLoading(false);
        return;
      }

      // Xử lý các lỗi Validation (Backend trả về Array)
      if (backendError && backendError.errors && Array.isArray(backendError.errors)) {
        const errorsObj = {};
        
        // Từ điển biên dịch tên trường tiếng Anh sang tiếng Việt
        const dictionary = {
          name: "Họ và tên",
          email: "Email",
          password: "Mật khẩu",
          phone: "Số điện thoại",
          address: "Địa chỉ"
        };

        backendError.errors.forEach((err) => {
          if (!errorsObj[err.field]) {
            let msg = err.message;
            const fieldNameVN = dictionary[err.field] || err.field;

            // Dịch các câu báo lỗi máy móc sang tiếng Việt thân thiện
            if (msg.includes("không được để trống")) {
              msg = `${fieldNameVN} không được để trống`;
            } else if (msg.includes("phải có ít nhất 6 ký tự")) {
              msg = `${fieldNameVN} phải có ít nhất 6 ký tự`;
            } else if (msg.includes("length must be 10 characters long")) {
              msg = `${fieldNameVN} phải có đúng 10 chữ số`;
            } else if (msg.includes("fails to match the required pattern")) {
              msg = `${fieldNameVN} không hợp lệ (vui lòng chỉ nhập số)`;
            } else {
              // Nếu gặp lỗi lạ, tự động thay tên tiếng anh trong ngoặc kép bằng tiếng việt
              msg = msg.replace(`"${err.field}"`, fieldNameVN);
            }

            errorsObj[err.field] = msg;
          }
        });

        // Cập nhật State để in lỗi ra giao diện
        setFormErrors(errorsObj);
      } else {
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

        <form onSubmit={handleRegister} autoComplete="off" encType="multipart/formdata" noValidate>
          <div className="avatar-upload-container">
            <div className="avatar-preview">
              {/* kiểm tra xem có ava chưa,nếu có thì hiển thị ảnh , nếu chứa có thì hiển thị label */}
              {formData.avatarPreview ? (
                <img src={formData.avatarPreview} alt="Avatar Preview" />
              ) : (
                <span className="avatar-placeholder" >
                  Ảnh đại diện (Tùy chọn)
                </span>
              )}
            </div>
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
            />
            {/* thay thể button */}
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
                {/* nếu có lỗi thì in ra thẻ span */}
                {formErrors.name && (
                  <span className="error-message">{formErrors.name}</span>
                )}
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
                {formErrors.email && (
                  <span className="error-message">{formErrors.email}</span>
                )}
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
                {formErrors.password && (
                  <span className="error-message">{formErrors.password}</span>
                )}
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
                {formErrors.phone && (
                  <span className="error-message">{formErrors.phone}</span>
                )}
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
                    style={{ borderColor: formErrors.city ? "#ff4d4f" : "" }}
                    // nếu có lỗi thì viền sang màu đỏ
                  >
                    <option value="" disabled>-- Chọn Thành phố --</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* HIỂN THỊ LỖI THÀNH PHỐ */}
                {formErrors.city && (
                  <span className="error-message">{formErrors.city}</span>
                )}
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
                {formErrors.areaId && (
                  <span className="error-message">{formErrors.areaId}</span>
                )}
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
                {formErrors.address && (
                  <span className="error-message">{formErrors.address}</span>
                )}
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
                     <option value="" disabled >-- Chọn giới tính --</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                {formErrors.gender && (
                  <span className="error-message">{formErrors.gender}</span>
                )}
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