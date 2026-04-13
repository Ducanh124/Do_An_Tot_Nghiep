// src/pages/Profile/PersonalInfo.jsx
import React, { useState, useEffect } from "react";
import Skills from "./Skills";
import "./PersonalInfo.css";
import { FiSave } from "react-icons/fi";
import { profileService } from "../service/profileService.js";

const PersonalInfo = () => {
  // State lưu ID của user đang đăng nhập
  const [userId, setUserId] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    cardNumber: "",
    bio: "",
  });

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false); // State quản lý lúc đang bấm Lưu

  // --- GỌI API LẤY DỮ LIỆU KHI VÀO TRANG ---
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userRes = await profileService.getProfile();
        const userData = userRes.data || userRes;
        console.log("Dữ liệu API /auth/me trả về là:", userData);
        
        // Lưu lại ID người dùng để lát nữa dùng cho API add-profile
        setUserId(userData._id || userData.id);

        setFormData({
          fullName: userData.name || userData.fullName || "",
          phone: userData.phone || "",
          email: userData.email || "",
          cardNumber: userData.cardNumber || "",
          bio: userData.bio || "", // Bổ sung ánh xạ bio từ API nếu có
        });

        const categoriesRes = await profileService.getCategories();
        console.log("Dữ liệu Danh sách Dịch vụ từ Backend:", categoriesRes);

        // ĐÃ SỬA CHỖ NÀY: Trỏ chính xác vào mảng nằm trong 2 lớp data (categoriesRes.data.data)
        const rawCategories = categoriesRes?.data?.data || [];

        if (rawCategories.length > 0) {
          const formattedSkills = rawCategories.map((cat) => ({
            id: cat.id,
            label: cat.name,
          }));
          setAvailableSkills(formattedSkills);
        } else {
          console.warn("Không có dịch vụ nào được trả về hoặc sai cấu trúc.");
        }

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu hồ sơ:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSkillToggle = (skillId) => {
    if (selectedSkills.includes(skillId)) {
      setSelectedSkills(selectedSkills.filter((id) => id !== skillId));
    } else {
      setSelectedSkills([...selectedSkills, skillId]);
    }
  };

  // --- HÀM SUBMIT ĐÓNG GÓI DỮ LIỆU VÀ GỌI API ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate nhỏ: Bắt buộc chọn ít nhất 1 dịch vụ
    if (selectedSkills.length === 0) {
      alert("Vui lòng chọn ít nhất 1 dịch vụ mà bạn có thể đảm nhận!");
      return;
    }

    if (!userId) {
      alert("Không tìm thấy ID người dùng. Vui lòng tải lại trang!");
      return;
    }

    // Đóng gói dữ liệu theo đúng yêu cầu Backend
    const payload = {
      cardNumber: formData.cardNumber,
      // Dùng .join(',') để nối các ID trong mảng thành 1 chuỗi. 
      // Ví dụ: Mảng [24, 25] sẽ biến thành chuỗi "24,25" đúng ý Backend!
      skills: selectedSkills.join(","),
    };

    console.log(
      "Đang gửi dữ liệu lên:",
      `/staff/${userId}/add-profile`,
      payload,
    );
    setIsSaving(true);

    try {
      // Gọi API sang profileService
      await profileService.addProfile(userId, payload);
      alert("Đã cập nhật số tài khoản và kỹ năng thành công!");
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
                  {/* Các trường Read-only (Chỉ đọc) lấy từ API */}
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

                  {/* Trường nhập Card Number */}
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

        <Skills
          availableSkills={availableSkills}
          selectedSkills={selectedSkills}
          onSkillChange={handleSkillToggle}
          bio={formData.bio}                 
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