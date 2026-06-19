import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2"; 
import "./Taskprogress.css";
import ImageUploader from "./ImageUploader.jsx";
import { scheduleService } from "../../service/scheduleService.js";
import { useAuth } from "../../AuthContext.jsx";
import { TbBackground } from "react-icons/tb";

const TaskProgress = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  //  Nhận bookingId được truyền ngầm từ trang ShiftCard sang
  const bookingId = location.state?.bookingId;

  const [uploadedImages, setUploadedImages] = useState([]);// mảng lưu trữ các ảnh
  const [note, setNote] = useState(""); // State mới lưu Ghi chú
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddImage = (imageUrl) =>//ảnh mà người dùng muốn thêm
    setUploadedImages([...uploadedImages, imageUrl]);
  const handleRemoveImage = (indexToRemove) => {
    setUploadedImages(
      uploadedImages.filter((_, index) => index !== indexToRemove),
    );
  };
// duyệt qua mảng chứa ảnh rồi chỉ giữ lại những ảnh có vị trí khác với vị trí cần xoá
  const handleBack = () => navigate(-1);

  const handleSubmitReport = async () => {
    if (!bookingId || !user?.id) {
      //  Báo lỗi bằng Swal
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Thiếu ID Booking hoặc ID Nhân viên!",
        confirmButtonColor: "#ff4d4f"
      });
      return;
    }

    setIsSubmitting(true);

   try {
    const formData = new FormData();
    formData.append("bookingId", bookingId);
    formData.append("staffId", user.id);
    formData.append("note", note);
    formData.append("recordAt", new Date().toISOString());

  //  Lặp qua mảng uploadedImages để append tất cả
    uploadedImages.forEach((imgObj) => {
      formData.append("images", imgObj.file); // Cùng key "images", gọi nhiều lần
    });

    await scheduleService.postProgress(formData);

    //  Thông báo thành công tự đóng và chuyển trang
    Swal.fire({
      icon: "success",
      title: '<span style="color: #28a745;">Thành công!</span>',
      html: '<span style="color: #1890ff;">Đã gửi báo cáo tiến độ thành công!</span>',
      timer: 1500,
      showConfirmButton: false
    }).then(() => {
      // Chờ Swal đóng xong mới điều hướng
      navigate("/schedule");
    });
    
  } catch (error) {
    console.error("Lỗi gửi báo cáo:", error);
    // Báo lỗi bằng Swal
    Swal.fire({
      icon: "error",
      title: "Gửi báo cáo thất bại",
      html: '<span style="color: #ff4d4f; font-weight: 500;">Lỗi gửi báo cáo, vui lòng thử lại!</span>',
      confirmButtonColor: "#ff4d4f",
      confirmButtonText: "Đóng"
    });
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div >
      <div >
        <button
          className="btn-back"
          onClick={handleBack}
          style={{ border: "1px solid #ff2734" , borderRadius: "10%", padding:"10px 10px",margin: "10px"}}
        >
          Quay lại
        </button>
      </div>

      <div className="progress-content">
        <h2 style={{ marginBottom: "15px" }}>Báo cáo tiến độ công việc</h2>

        {/* ghi chú */}
        <div style={{ marginBottom: "20px" }}>
          <label>Ghi chú tiến độ </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows="5"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <ImageUploader
          images={uploadedImages}
          onAddImage={handleAddImage}
          onRemoveImage={handleRemoveImage}
        />
      </div>
      <div className="progress-footer">
      <button className="btn-submit-report"  onClick={handleSubmitReport} disabled={isSubmitting}> {/* vô hiệu hoá nếu isSubmitting:true  */}
        {isSubmitting ? "Đang gửi..." : "Gửi báo cáo tiến độ"}
      </button>
      </div>
    </div>
  );
};

export default TaskProgress;