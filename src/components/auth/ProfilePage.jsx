import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import areaService from "../../services/areaService";

const ProfilePage = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const [loading, setLoading] = useState(true);

  // state adữ liệu khu vực
  const [areas, setAreas] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "male",
    areaId: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    if (!currentUser?.id) {
      navigate("/login");
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        // Tải danh sách Tỉnh/Thành
        const areaData = await areaService.getAll();
        setAreas(areaData);
        // Tải thông tin User
        const userData = await authService.getUserById(currentUser.id);
        if (userData) {
          // Đổ dữ liệu text vào form
          setFormData({
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
            address: userData.address || "",
            gender: userData.gender || "male",
            areaId: userData.areaId || "",
          });
          if (userData.areaId) {
            setSelectedDistrictId(userData.areaId);
            // Tìm tỉnh chứa quận này (Mô phỏng logic tìm kiếm)
            // Lưu ý: Cần điều chỉnh nếu cấu trúc mảng areas của bạn khác
            for (let city of areaData) {
              const hasDistrict = city.children?.some(
                (d) => d.id === userData.areaId,
              );
              if (hasDistrict) {
                setSelectedCityId(city.id);
                setDistricts(city.children); // Đổ quận ra luôn
                break;
              }
            }
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu trang profile:", error);
        alert("Không thể tải thông tin. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser?.id, navigate]);
  // 2. XỬ LÝ NHẬP LIỆU TEXT/COMBOBOX CHUNG
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // chọn ảnh
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
    }
  };
  // chọn tỉnh thành
  const handleCityChange = async (e) => {
    const cityId = Number(e.target.value);
    setSelectedCityId(cityId);
    setSelectedDistrictId("");
    setFormData({ ...formData, areaId: "" }); // Reset areaId trong form

    if (!cityId) {
      setDistricts([]);
      return;
    }

    try {
      const cityData = await areaService.getById(cityId);
      if (cityData && cityData.children) {
        setDistricts(cityData.children);
      } else {
        setDistricts([]);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách Quận:", error);
      setDistricts([]);
    }
  };

  // chọn quận
  const handleDistrictChange = (e) => {
    const districtId = Number(e.target.value);
    setSelectedDistrictId(districtId);
    // Gắn cái ID quận này vào formData để lát gửi lên API
    setFormData({ ...formData, areaId: districtId });
  };

  // nút thay đổi
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = { ...formData };

      // Nếu có chọn ảnh mới thì thêm vào
      if (avatarFile) {
        submitData.avatar = avatarFile;
      }
      await authService.updateProfile(currentUser.id, submitData);
      // Cập nhật lại localStorage để Header nhận diện tên mới
      const updatedUser = { ...currentUser, name: formData.name };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Cập nhật thông tin thành công!");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Cập nhật thất bại. Vui lòng kiểm tra lại!");
    }
  };

  if (loading) return <div className="text-center mt-5">Đang tải hồ sơ...</div>;

  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow mx-auto" style={{ maxWidth: "650px" }}>
        <div className="card-header bg-primary text-white text-center py-3">
          <h4 className="mb-0">Chỉnh sửa hồ sơ cá nhân</h4>
        </div>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            {/* Ảnh đại diện */}
            <div className="mb-4">
              <label className="form-label fw-bold">Ảnh đại diện</label>
              <input
                type="file"
                className="form-control"
                name="avatar"
                accept="image/*"
                onChange={handleFileChange}
              />
              <small className="text-muted">
                Bỏ trống nếu không muốn đổi ảnh.
              </small>
            </div>
            <div className="row mb-3">
              <div className="col-md-8">
                <label className="form-label fw-bold">Họ và tên *</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold">Giới tính</label>
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
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">Email</label>
                <input
                  type="email"
                  className="form-control bg-light"
                  name="email"
                  value={formData.email}
                  disabled // Thường email là tài khoản nên không cho sửa
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Số điện thoại *</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">Tỉnh/Thành phố *</label>
                <select
                  className="form-select"
                  value={selectedCityId}
                  onChange={handleCityChange}
                  required
                >
                  <option value="">-- Chọn Thành phố --</option>
                  {areas.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Quận/Huyện *</label>
                <select
                  className="form-select"
                  value={selectedDistrictId}
                  onChange={handleDistrictChange}
                  required
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
            <div className="mb-4">
              <label className="form-label fw-bold">Số nhà, Tên đường</label>
              <input
                type="text"
                className="form-control"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            {/* Các nút hành động */}
            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                onClick={() => navigate("/")}
              >
                Hủy bỏ
              </button>
              <button type="submit" className="btn btn-primary px-4">
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
