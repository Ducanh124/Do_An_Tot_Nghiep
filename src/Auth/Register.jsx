import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { regis, getCities, getDistricts } from "../service/authService.js";

const Register = () => {
  const navigate = useNavigate();

  // --- STATE QUẢN LÝ FORM ---
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    areaId: "",
    gender: "",
    role: "customer",
  });

  // --- STATE QUẢN LÝ THÀNH PHỐ VÀ QUẬN ---
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedCity, setSelectedCity] = useState(""); // Lưu ID thành phố đang chọn

  const [isLoading, setIsLoading] = useState(false);

  // 1. GỌI API LẤY DANH SÁCH THÀNH PHỐ KHI VÀO TRANG
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const responseData = await getCities(); // Dùng hàm từ Service
        const cityData = responseData.data.data || [];
        setCities(cityData);
      } catch (error) {
        console.error("Lỗi khi tải danh sách thành phố:", error);
      }
    };
    fetchCities();
  }, []);

  // 2. XỬ LÝ KHI NGƯỜI DÙNG CHỌN 1 THÀNH PHỐ
  const handleCityChange = async (e) => {
    const cityId = e.target.value;
    setSelectedCity(cityId);
    setDistricts([]);
    setFormData({ ...formData, areaId: "" });

    if (cityId) {
      try {
        const responseData = await getDistricts(cityId); // Dùng hàm từ Service
        const districtData =
          responseData.children || responseData.data?.children || [];
        setDistricts(districtData);
      } catch (error) {
        console.error("Lỗi khi tải danh sách quận/huyện:", error);
      }
    }
  };

  // 3. XỬ LÝ THAY ĐỔI CÁC Ô INPUT KHÁC
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 4. XỬ LÝ GỬI FORM LÊN BACKEND
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.areaId) {
      alert("Vui lòng chọn Quận/Huyện!");
      return;
    }

    setIsLoading(true);

    // Đóng gói dữ liệu theo đúng yêu cầu Backend: name, email, password, phone, address, areaid, role, gender
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      address: formData.address,
      areaId: Number(formData.areaId), // Chuyển sang số nếu Backend yêu cầu số nguyên
      role: formData.role,
      gender: formData.gender,
    };

    console.log("Dữ liệu đăng ký đóng gói gửi đi:", payload);

    try {
      // GỌI API ĐĂNG KÝ THẬT TỪ authService
      await regis(payload);

      alert("Đăng ký tài khoản thành công!");
      navigate("/login");
    } catch (error) {
      const backendError = error.response?.data;
      console.error("🚨 Chi tiết lỗi từ Backend:", backendError);
      console.error("Lỗi đăng ký:", error);
      const errorMsg =
        error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!";
      alert(errorMsg);
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

        <form onSubmit={handleRegister} className="register-form">
          <div className="form-grid">
            {/* --- CỘT TRÁI --- */}
            <div className="form-column">
              <div className="form-group">
                <label>
                  Họ và tên <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="name"
                    placeholder="Ví dụ: Nguyễn Văn A"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  Email <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    name="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  Mật khẩu <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="password"
                    name="password"
                    placeholder="Tối thiểu 6 ký tự"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  Số điện thoại <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="0912xxx888"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* --- CỘT PHẢI --- */}
            <div className="form-column">
              {/* CHỌN THÀNH PHỐ */}
              <div className="form-group">
                <label>
                  Thành phố <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <select
                    value={selectedCity}
                    onChange={handleCityChange}
                    required
                  >
                    <option value="" disabled>
                      -- Chọn Thành phố --
                    </option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* CHỌN QUẬN / HUYỆN */}
              <div className="form-group">
                <label>
                  Quận/Huyện <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <select
                    name="areaId"
                    value={formData.areaId}
                    onChange={handleInputChange}
                    required
                    disabled={!selectedCity} // Khóa lại nếu chưa chọn thành phố
                  >
                    <option value="" disabled>
                      -- Chọn Quận/Huyện --
                    </option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* NHẬP ĐỊA CHỈ NHÀ */}
              <div className="form-group">
                <label>
                  Địa chỉ nhà <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="address"
                    placeholder="Số nhà, tên đường..."
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div
                className="form-group"
                style={{ display: "flex", gap: "16px" }}
              >
                <div style={{ flex: 1 }}>
                  <label>
                    Giới tính <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>-- Chọn Giới tính --</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <label>
                    Vai trò <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="customer">Khách hàng</option>
                      <option value="staff">Nhân viên</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
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