/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2"; 
import Skills from "./Skills";
import "./PersonalInfo.css";
import { profileService } from "../service/profileService.js";

const PersonalInfo = () => {
  const [userId, setUserId] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);

  const [originalData, setOriginalData] = useState({});
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    cardNumber: "",   
    skills: "",       
    experience: "",   
    review: "",       
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userRes = await profileService.getProfile();
        const userData = userRes.data || userRes;
        const currentUserId = userData._id || userData.id;
        // lưu id để biết cập nhật hô sơ cho id người dùng nào
        setUserId(currentUserId);

        //kiểm tra xem đã điền bên dưới hay chưa
        let profileData = null;
        try {
          const infoRes = await profileService.getInfo(currentUserId);
          if (infoRes.data) {
            profileData = infoRes.data; 
            setHasProfile(true); 
          }
        } catch (err) {
          console.log("Người dùng chưa lưu hồ sơ chi tiết lần nào.");
          setHasProfile(false); 
        }

        const initialData = {
          fullName: profileData?.staff?.name || userData.name || userData.fullName || "",
          phone: profileData?.staff?.phone || userData.phone || "",
          email: profileData?.staff?.email || userData.email || "",
          //  Lúc GET về Backend trả `idCardNumber`, ta gán vào `cardNumber` của giao diện
          cardNumber: profileData?.idCardNumber || userData.idCardNumber || "",
          skills: profileData?.skills || "", 
          experience: profileData?.experience || "",
          review: profileData?.review || "",
        };
          //lưu vào formdata để hiển thị lên UI
        setFormData(initialData);
        // Lưu lại bản sao y hệt lúc vừa tải về để sau này so sánh
        setOriginalData(initialData);

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
    
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không tìm thấy ID người dùng. Vui lòng tải lại trang!",
      // html: `<span style="color: #ff4d4f; font-weight: 500;">${errorMsg}</span>`, 
        confirmButtonColor: "#ff4d4f"
      });
      return;
    }

    setFormErrors({});
    setIsSaving(true);
    //hàm submit sẽ kiểm tra bên dưới có dữ liệu hay k, nếu có thì kiểm tra có update hay k, nếu k update thì chờ ng dùng nhập rồi đóng gói dl gửi be
    try {
      if (hasProfile) {
        const payload = {};
        // So sánh từng trường, nếu khác với ban đầu thì mới nhét vào payload
        if (formData.cardNumber !== originalData.cardNumber)  payload.idCardNumber = formData.cardNumber;    
        if (formData.skills !== originalData.skills) payload.skills = formData.skills;
        if (formData.experience !== originalData.experience) payload.experience = formData.experience;
        if (formData.review !== originalData.review) payload.review = formData.review;

        // Nếu người dùng bấm Lưu nhưng chưa sửa gì cả thì chặn lại luôn
        if (Object.keys(payload).length === 0) {
          Swal.fire({
            icon: "info",
            title: "Thông báo",
            text: "Bạn chưa thay đổi thông tin nào!",
            confirmButtonText: "Đã hiểu"
          });
          setIsSaving(false);
          return;
        }

        await profileService.updateInfo(userId, payload);
        
        // Cập nhật thành công
        Swal.fire({
          icon: "success",
          title: '<span style="color: #28a745;">Thành công!</span>',
          html: '<span style="color: #1890ff;">Đã cập nhật hồ sơ thành công!</span>',
          timer: 1500,
          showConfirmButton: false,
        });
        
        // Cập nhật lại bản gốc sau khi lưu thành công (để có thể sửa tiếp mà không cần F5)
        setOriginalData({ ...originalData, ...payload });

      } else {

       
        const payload = {
          cardNumber: formData.cardNumber, 
          skills: formData.skills,
          experience: formData.experience,
          review: formData.review,
        };

        await profileService.addProfile(userId, payload);
        

        Swal.fire({
          icon: "success",
          title: '<span style="color: #28a745;">Thành công!</span>',
          html: '<span style="color: #1890ff;">Đã lưu hồ sơ thành công!</span>',
          timer: 1500,
          showConfirmButton: false,
        });

        setHasProfile(true); 
        // Cập nhật lại bản gốc
        setOriginalData({ ...formData });
      }

    } catch (error) {
      console.error("Lỗi khi lưu profile:", error);
      const backendError = error.response?.data;
      
      // Logic bóc tách mảng lỗi từ Backend
      if (backendError && backendError.errors && Array.isArray(backendError.errors)) {
        const errorsObj = {};
        backendError.errors.forEach((err) => {
          if (!errorsObj[err.field]) {
            let errorMessage = err.message;
            
            // Dịch câu lỗi Pattern RegEx khô khan sang tiếng Việt
            if (errorMessage.includes("fails to match the required pattern")) {
              errorMessage = "Chỉ được phép nhập chữ số (0-9)";
            }
            // Dịch câu lỗi độ dài
            if (errorMessage.includes("phải có ít nhất 9 ký tự")) {
              errorMessage = "Số tài khoản phải có ít nhất 9 chữ số";
            }
            // Dịch câu lỗi bỏ trống để giấu cái chữ tiếng Anh "cardNumber" đi cho đẹp
            if (errorMessage.includes("không được để trống") || errorMessage.includes("là bắt buộc")) {
              errorMessage = "Vui lòng không để trống thông tin này";
            }

            errorsObj[err.field] = errorMessage;
          }
        });
        setFormErrors(errorsObj); 
      } else {
        const errorMsg = backendError?.message || "Lỗi không xác định từ server";
        
        // Thông báo lỗi chung bằng Swal
        Swal.fire({
          icon: "error",
          title: "Cập nhật thất bại",
          html: `<span style="color: #ff4d4f; font-weight: 500;">${errorMsg}</span>`, 
          confirmButtonColor: "#ff4d4f",
          confirmButtonText: "Đóng"
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div style={{ padding: "24px", color: "#666" }}>Đang tải thông tin...</div>;
  }

  return (
    <div >
      <form onSubmit={handleSubmit} autoComplete="off" noValidate >
          <div className="section-header">
            <h2>Thông tin cá nhân</h2>
          </div>

          <div className="form-grid">
            <div className="form-group ">
              <label>Họ và tên</label>
              <input type="text" name="fullName" value={formData.fullName} readOnly />
            </div>

            <div className="form-group">
              <label>Số điện thoại</label>
              <input type="tel" name="phone" value={formData.phone} readOnly />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} readOnly />
            </div>

            <div className="form-group">
              <label>Số tài khoản / Thẻ ngân hàng </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                required
                style={{ borderColor: formErrors.cardNumber ? "#ff4d4f" : "" }}
              />
              {/* HIỂN THỊ LỖI */}
              {formErrors.cardNumber && (
                <span style={{ color: '#ff4d4f', fontSize: '13px', marginTop: '4px', display: 'block' }}>
                  {formErrors.cardNumber}
                </span>
              )}
            </div>
          </div>

        <Skills
          skills={formData.skills}
          experience={formData.experience}
          review={formData.review}                
          onInputChange={handleInputChange}
          formErrors={formErrors}
        />

        <div className="form-actions">
          <button type="submit" className="btn-save" disabled={isSaving}>
             {isSaving ? "Đang lưu..." : (hasProfile ? "Cập nhật" : "Lưu")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfo;