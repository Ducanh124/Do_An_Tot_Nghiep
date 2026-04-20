// src/pages/Profile/PersonalInfo.jsx
import React, { useState, useEffect } from "react";
import Skills from "./Skills";
import "./PersonalInfo.css";
import { FiSave } from "react-icons/fi";
import { profileService } from "../service/profileService.js";

const PersonalInfo = () => {
  const [userId, setUserId] = useState(null);

  // 👉 BƯỚC 1: Gom tất cả dữ liệu vào 1 cục formData duy nhất
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    cardNumber: "",
    skills: "",       // Nhập chữ bình thường
    experience: "",   // Select box
    review: "",       // Textarea
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- GỌI API LẤY DỮ LIỆU KHI VÀO TRANG ---
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userRes = await profileService.getProfile();
        const userData = userRes.data || userRes;
        
        setUserId(userData._id || userData.id);

        setFormData({
          fullName: userData.name || userData.fullName || "",
          phone: userData.phone || "",
          email: userData.email || "",
          cardNumber: userData.cardNumber || "",
          skills: userData.skills || "", 
          experience: userData.experience || "",
          review: userData.review || "",
        });

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu hồ sơ:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Hàm dùng chung để bắt sự kiện thay đổi cho TẤT CẢ các ô nhập
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- HÀM SUBMIT ĐÓNG GÓI DỮ LIỆU VÀ GỌI API ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("Không tìm thấy ID người dùng. Vui lòng tải lại trang!");
      return;
    }

    // 👉 BƯỚC 2: Đóng gói đúng 4 trường Backend cần
    const payload = {
      cardNumber: formData.cardNumber,
      skills: formData.skills,
      experience: formData.experience,
      review: formData.review,
    };

    console.log("Đang gửi dữ liệu lên:", `/staff/${userId}/add-profile`, payload);
    setIsSaving(true);

    try {
      await profileService.addProfile(userId, payload);
      alert("Đã cập nhật hồ sơ thành công!");
    } catch (error) {
      console.error("Lỗi khi lưu profile:", error);
      const backendError = error.response?.data?.message || "Lỗi không xác định từ server";
      alert(`Backend báo lỗi: ${backendError}`); 
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: "24px", color: "#666" }}>
        Đang tải thông tin...
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      <form onSubmit={handleSubmit}>
        <div className="profile-section">
          <div className="section-header">
            <h2>Thông tin cá nhân</h2>
          </div>

          <div className="personal-info-content">
            <div className="form-section">
              <div className="info-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Họ và tên</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      readOnly
                      className="read-only-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Số điện thoại</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      readOnly
                      className="read-only-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      readOnly
                      className="read-only-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Số tài khoản / Thẻ ngân hàng{" "}
                      <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="Nhập số tài khoản ngân hàng của bạn"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 👉 BƯỚC 3: Truyền 3 giá trị xuống Component Skills */}
        <Skills
          skills={formData.skills}
          experience={formData.experience}
          review={formData.review}                
          onInputChange={handleInputChange}
        />

        <div className="form-actions-global">
          <button type="submit" className="btn-save" disabled={isSaving}>
            <FiSave /> {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfo;