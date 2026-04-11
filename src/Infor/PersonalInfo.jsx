import React, { useState, useRef } from "react"; // Thêm useRef
import Skills from "./Skills";
import "./PersonalInfo.css";
import { FiUploadCloud, FiSave } from "react-icons/fi";

const PersonalInfo = () => {
  // --- STATE QUẢN LÝ THÔNG TIN CÁ NHÂN ---
  const [formData, setFormData] = useState({
    fullName: "Nguyễn Thị Hoa",
    dob: "1990-05-15",
    gender: "Nữ",
    cccd: "",
    phone: "0987654321",
    email: "hoanguyen.maid@gmail.com",
    address: "123 Đường Láng, Đống Đa, Hà Nội",
    experience: "",
    bio: "",
    avatarFile: null, // Thêm state để lưu file ảnh thật nếu cần gửi lên server
  });

  // Chuyển state này thành rỗng hoặc ảnh mặc định
  const [avatarPreview, setAvatarPreview] = useState(
    "https://i.pravatar.cc/150?img=47" 
  );

  // --- STATE QUẢN LÝ KỸ NĂNG CHUYÊN MÔN ---
  const [selectedSkills, setSelectedSkills] = useState(["cleaning", "cooking"]);

  // --- REF CHO INPUT FILE ẨN ---
  const fileInputRef = useRef(null);

  // --- CÁC HÀM XỬ LÝ ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Hàm kích hoạt input file ẩn khi click vào nút "Chọn ảnh mới"
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Hàm xử lý khi người dùng chọn ảnh avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Lưu file thật vào formData để sau này gửi API (multipart/form-data)
      setFormData({ ...formData, avatarFile: file });

      // Dùng FileReader để tạo chuỗi Base64 hiển thị Preview ngay lập tức
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSkillToggle = (skillId) => {
    if (selectedSkills.includes(skillId)) {
      setSelectedSkills(selectedSkills.filter((id) => id !== skillId));
    } else {
      setSelectedSkills([...selectedSkills, skillId]);
    }
  };

  const handleCancel = () => {
    console.log("Đã hủy thay đổi");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      skills: selectedSkills,
    };
    console.log("Dữ liệu toàn bộ hồ sơ gửi lên Server:", finalData);
    alert("Đã lưu toàn bộ thông tin hồ sơ thành công!");
  };

  return (
    <div className="profile-page-container">
      <form onSubmit={handleSubmit}>
        {/* ================= PHẦN 1: THÔNG TIN CÁ NHÂN ================= */}
        <div className="profile-section">
          <div className="section-header">
            <h2>Thông tin cá nhân</h2>
          </div>

          <div className="personal-info-content">
            {/* Phần bên trái: Ảnh đại diện */}
            <div className="avatar-section">
              <div className="avatar-preview">
                <img src={avatarPreview} alt="Avatar" />
              </div>
              
              {/* Nút bấm để gọi input ẩn */}
              <button 
                type="button" 
                className="btn-upload" 
                onClick={handleUploadClick}
              >
                <FiUploadCloud /> Chọn ảnh mới
              </button>

              {/* Thẻ input type="file" bị ẩn đi */}
              <input
                type="file"
                accept="image/jpeg, image/png"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                style={{ display: "none" }}
              />

              <p className="upload-hint">Định dạng JPEG, PNG. Tối đa 2MB.</p>
            </div>

            {/* Phần bên phải: Form nhập liệu */}
            <div className="form-section">
              <div className="info-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>
                      Họ và tên <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      placeholder="Nhập họ và tên"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Ngày sinh <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      Số điện thoại <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="nguyenvana@email.com"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>
                      Địa chỉ hiện tại <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= PHẦN 2: KỸ NĂNG ================= */}
        <Skills
          selectedSkills={selectedSkills}
          onSkillChange={handleSkillToggle}
          experience={formData.experience}
          bio={formData.bio}
          onInputChange={handleInputChange}
        />

        {/* ================= CỤM NÚT LƯU ================= */}
        <div className="form-actions-global">
          <button type="button" className="btn-cancel" onClick={handleCancel}>
            Hủy bỏ
          </button>
          <button type="submit" className="btn-save">
            <FiSave /> Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfo;