import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FiArrowLeft, FiSend } from "react-icons/fi";
import "./TaskProgress.css";
import ImageUploader from "./ImageUploader.jsx";
import { scheduleService } from "../../service/scheduleService.js";
import { useAuth } from "../../AuthContext.jsx"; // Để lấy staffId

const TaskProgress = () => {
  const navigate = useNavigate();
  const { shiftId } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  
  // 👉 Nhận bookingId được truyền ngầm từ trang ShiftCard sang
  const bookingId = location.state?.bookingId;

  const [shiftData, setShiftData] = useState(null); 
  const [uploadedImages, setUploadedImages] = useState([]); 
  const [note, setNote] = useState(""); // State mới lưu Ghi chú
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // ... Giữ nguyên phần mock data của bạn
    const mockData = {
      id: shiftId,
      serviceName: "Ca làm việc ID: " + shiftId,
    };
    setTimeout(() => {
      setShiftData(mockData);
    }, 500);
  }, [shiftId]);

  const handleAddImage = (imageUrl) => setUploadedImages([...uploadedImages, imageUrl]);
  const handleRemoveImage = (indexToRemove) => {
    setUploadedImages(uploadedImages.filter((_, index) => index !== indexToRemove));
  };

  const handleBack = () => navigate(-1); 

  const handleSubmitReport = async () => {
    if (!bookingId || !user?.id) {
      alert("Lỗi: Thiếu ID Booking hoặc ID Nhân viên!");
      return;
    }

    // 👉 ĐÓNG GÓI PAYLOAD GỬI API 
    const payload = {
      bookingId: bookingId,
      staffId: user.id,
      note: note,
      recordAt: new Date().toISOString(),
      image: uploadedImages // Gửi mảng hình ảnh
    };

    try {
      setIsSubmitting(true);
      // Gọi API Progress
      await scheduleService.postProgress(payload);
      
      alert("Đã gửi báo cáo tiến độ thành công!");
      navigate("/schedule"); // Quay lại cập nhật trạng thái mới nhất
    } catch (error) {
      console.error("Lỗi gửi báo cáo:", error);
      alert("Lỗi gửi báo cáo, vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!shiftData) return <div className="loading">Đang tải dữ liệu ca làm việc...</div>;

  return (
    <div className="task-progress-page">
      <div className="progress-header">
        <button className="btn-back" onClick={handleBack}>
          <FiArrowLeft className="icon" /> Quay lại
        </button>
      </div>

      <div className="progress-content">
        <h2 style={{ marginBottom: '15px' }}>Báo cáo tiến độ công việc</h2>

        {/* 👉 COMPONENT MỚI: Nhập ghi chú */}
        <div className="form-group full-width" style={{ marginBottom: "20px" }}>
          <label>Ghi chú tiến độ <span className="required">*</span></label>
          <textarea 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Nhập tình trạng công việc hiện tại (Ví dụ: Đã đến nơi, đang lau tầng 1...)"
            rows="3"
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
          />
        </div>

        <ImageUploader
          images={uploadedImages}
          onAddImage={handleAddImage}
          onRemoveImage={handleRemoveImage}
        />
      </div>

      <div className="progress-footer">
        <button className="btn-submit-report" onClick={handleSubmitReport} disabled={isSubmitting}>
          <FiSend className="icon" />
          {isSubmitting ? "Đang gửi..." : "Gửi báo cáo tiến độ"}
        </button>
      </div>
    </div>
  );
};

export default TaskProgress;