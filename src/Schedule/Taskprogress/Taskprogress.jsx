import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./TaskProgress.css";
import ImageUploader from "./ImageUploader.jsx";
import { scheduleService } from "../../service/scheduleService.js";
import { useAuth } from "../../AuthContext.jsx"; // Để lấy staffId
import { TbBackground } from "react-icons/tb";

const TaskProgress = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  //  Nhận bookingId được truyền ngầm từ trang ShiftCard sang
  const bookingId = location.state?.bookingId;

  const [uploadedImages, setUploadedImages] = useState([]);
  const [note, setNote] = useState(""); // State mới lưu Ghi chú
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddImage = (imageUrl) =>
    setUploadedImages([...uploadedImages, imageUrl]);
  const handleRemoveImage = (indexToRemove) => {
    setUploadedImages(
      uploadedImages.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleBack = () => navigate(-1);

  const handleSubmitReport = async () => {
    if (!bookingId || !user?.id) {
      alert("Lỗi: Thiếu ID Booking hoặc ID Nhân viên!");
      return;
    }

    setIsSubmitting(true);

    try {
      //  Sử dụng FormData (Gói bưu phẩm chuyên dụng để gửi File)
      const formData = new FormData();
      formData.append("bookingId", bookingId);
      formData.append("staffId", user.id);
      formData.append("note", note);
      formData.append("recordAt", new Date().toISOString());

      // Lấy cái file gốc từ bức ảnh đầu tiên (nếu có) nhét vào gói bưu phẩm
      if (uploadedImages.length > 0) {
        formData.append("image", uploadedImages[0].file);
      }

      // Gọi API Progress và truyền cục formData này đi
      await scheduleService.postProgress(formData);

      alert("Đã gửi báo cáo tiến độ thành công!");
      navigate("/schedule");
    } catch (error) {
      console.error("Lỗi gửi báo cáo:", error);
      alert("Lỗi gửi báo cáo, vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="progress-header">
        <button
          className="btn-back"
          onClick={handleBack}
          style={{ backgroundColor: "#aaa" }}
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
            rows="3"
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

      <button onClick={handleSubmitReport} disabled={isSubmitting}>
        {isSubmitting ? "Đang gửi..." : "Gửi báo cáo tiến độ"}
      </button>
    </div>
  );
};

export default TaskProgress;
