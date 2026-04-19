import React, { useState, useEffect } from "react";
import authService from "../../services/authService.js";
import areaService from "../../services/areaService.js";
import "./Login.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  // --- STATE CHO KHU VỰC (Giống trang Booking) ---
  const [areas, setAreas] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState("");

  // --- STATE CHO NÚT GHI NHỚ MẬT KHẨU ---
  const [rememberMe, setRememberMe] = useState(false);
  const savedEmail = localStorage.getItem("rememberedEmail") || "";

  const [formData, setFormData] = useState({
    name: "",
    email: savedEmail,
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    gender: "male",
  });

  // Gọi API lấy danh sách Tỉnh/Quận ngay khi mở trang
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const data = await areaService.getAll();
        setAreas(data);
      } catch (error) {
        console.error("Lỗi lấy danh sách khu vực:", error);
      }
    };
    fetchAreas();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Hàm xử lý khi chọn Tỉnh/Thành
  const handleCityChange = (e) => {
    const cityId = Number(e.target.value);
    setSelectedCityId(cityId);
    setSelectedDistrictId(""); // Reset quận khi đổi tỉnh

    const selectedCity = areas.find((area) => area.id === cityId);
    if (selectedCity && selectedCity.children) {
      setDistricts(selectedCity.children);
    } else {
      setDistricts([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      // --- LUỒNG ĐĂNG NHẬP ---
      try {
        const response = await authService.login(
          formData.email,
          formData.password,
        );
        const userData = response.user || response;

        // Xử lý nút Ghi nhớ mật khẩu khi đăng nhập
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", formData.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }
        alert("Đăng nhập thành công! Chào bạn " + (userData.name || ""));

        window.location.href = "/";
      } catch (error) {
        //toast.error("Đăng nhập thất bại");
        console.log(error);
        alert("Sai email hoặc mật khẩu. Vui lòng thử lại!");
      }
    } else {
      // --- LUỒNG ĐĂNG KÝ ---
      if (formData.password !== formData.confirmPassword) {
        return alert("Mật khẩu xác nhận không khớp!");
      }

      // Bắt buộc phải chọn Quận/Huyện
      if (!selectedDistrictId) {
        return alert("Vui lòng chọn Tỉnh/Thành và Quận/Huyện!");
      }

      try {
        const newUserData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
          areaId: Number(selectedDistrictId), // Lấy ID Quận/Huyện từ Combobox
          role: "customer",
          gender: formData.gender,
        };

        await authService.register(newUserData);

        // Xử lý nút Ghi nhớ khi đăng ký (Tự động điền email sang form Login cho tiện)
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", formData.email);
        }

        alert("Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.");

        // Dọn dẹp form và tự động chuyển sang tab Đăng nhập
        setFormData({ ...formData, password: "", confirmPassword: "" });
        setIsLogin(true);
      } catch (error) {
        console.error("Lỗi đăng ký:", error);
        const errorMsg =
          error.response?.data?.message ||
          "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin!";
        alert(errorMsg);
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: "550px" }}>
        {" "}
        <div className="auth-toggle-box">
          <div
            className={`auth-toggle-slider ${!isLogin ? "right" : ""}`}
          ></div>
          <div
            className={`auth-toggle-btn ${isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Đăng Nhập
          </div>
          <div
            className={`auth-toggle-btn ${!isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Đăng Ký
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="fade-in"
          key={isLogin ? "login" : "register"}
        >
          {/* CÁC TRƯỜNG CHỈ HIỆN KHI ĐĂNG KÝ */}
          {!isLogin && (
            <>
              <div className="mb-3">
                <label className="form-label">Họ và tên *</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label">Số điện thoại *</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label">Giới tính *</label>
                  <select
                    className="form-select"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>

              {/* --- CHỌN TỈNH QUẬN TỰ ĐỘNG --- */}
              <div className="row mb-3">
                <div className="col-6">
                  <label className="form-label">Tỉnh/Thành phố *</label>
                  <select
                    className="form-select"
                    value={selectedCityId}
                    onChange={handleCityChange}
                    required={!isLogin}
                  >
                    <option value="">-- Chọn Thành phố --</option>
                    {areas.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label">Quận/Huyện *</label>
                  <select
                    className="form-select"
                    value={selectedDistrictId}
                    onChange={(e) => setSelectedDistrictId(e.target.value)}
                    required={!isLogin}
                    disabled={!selectedCityId}
                  >
                    <option value="">-- Chọn Quận/Huyện --</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Số nhà, Tên đường *</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  placeholder="123 Đường B..."
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          {/* EMAIL VÀ MẬT KHẨU (Dùng chung) */}
          <div className="mb-3">
            <label className="form-label">Email của bạn *</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mật khẩu *</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
            <small className="note">
              * Chú ý : Mật khẩu cần có ít nhất 7 kí tự trong đó có 1 chữ viết
              thường , 1 chữ viết hoa và 1 kí tự đặc biệt.
            </small>
          </div>

          {!isLogin && (
            <div className="mb-3">
              <label className="form-label">Xác nhận mật khẩu *</label>
              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {/* --- NÚT CHECK GHI NHỚ MẬT KHẨU --- */}
          <div className="mb-3 form-check d-flex align-items-center">
            <input
              type="checkbox"
              className="form-check-input mt-0 me-2"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ cursor: "pointer" }}
            />
            <label
              className="form-check-label text-muted"
              htmlFor="rememberMe"
              style={{ cursor: "pointer", fontSize: "0.9rem" }}
            >
              {isLogin
                ? "Ghi nhớ thông tin đăng nhập"
                : "Ghi nhớ thông tin cho lần đăng nhập sau"}
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-auth border-0 mt-2 w-100 py-2"
          >
            {isLogin ? "ĐĂNG NHẬP" : "TẠO TÀI KHOẢN"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
