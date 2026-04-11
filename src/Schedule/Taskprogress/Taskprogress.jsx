import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiSend } from "react-icons/fi";
import "./TaskProgress.css";

// Import 3 component con mà chúng ta vừa tạo
import CurrentTaskInfo from "./CurrentTaskInfo";
import TaskChecklist from "./TaskChecklist.jsx";
import ImageUploader from "./ImageUploader.jsx";

const TaskProgress = () => {
  const navigate = useNavigate();
  // Lấy ID ca làm việc từ URL (Ví dụ URL là: /schedule/progress/102 thì shiftId sẽ là '102')
  const { shiftId } = useParams();

  // --- 1. STATE QUẢN LÝ DỮ LIỆU ---
  const [shiftData, setShiftData] = useState(null); // Thông tin ca làm
  const [completedTasks, setCompletedTasks] = useState([]); // Danh sách ID công việc đã tick
  const [uploadedImages, setUploadedImages] = useState([]); // Danh sách ảnh đã chụp

  // Giả lập việc gọi API để lấy thông tin ca làm việc dựa vào shiftId
  useEffect(() => {
    // Trong thực tế, bạn sẽ dùng fetch() hoặc axios() để gọi API ở đây.
    // Tạm thời tạo mock data để giao diện có dữ liệu hiển thị.
    const mockData = {
      id: shiftId,
      serviceName: "Dọn dẹp nhà cửa định kỳ",
      customerName: "Trần Thị Bích",
      address: "Căn 12A05, Tòa S2.02, Vinhomes Ocean Park, Hà Nội",
      startTime: "08:00",
      endTime: "11:00",
    };

    // Giả lập độ trễ mạng 0.5s
    setTimeout(() => {
      setShiftData(mockData);
    }, 500);
  }, [shiftId]);

  // --- 2. CÁC HÀM XỬ LÝ (Truyền xuống component con) ---

  // Hàm xử lý tick/bỏ tick công việc
  const handleTaskToggle = (taskId) => {
    if (completedTasks.includes(taskId)) {
      // Nếu đã tick rồi thì bỏ tick
      setCompletedTasks(completedTasks.filter((id) => id !== taskId));
    } else {
      // Nếu chưa tick thì thêm vào mảng
      setCompletedTasks([...completedTasks, taskId]);
    }
  };

  // Hàm xử lý thêm ảnh mới
  const handleAddImage = (imageUrl) => {
    setUploadedImages([...uploadedImages, imageUrl]);
  };

  // Hàm xử lý xóa ảnh (Dựa vào vị trí index của ảnh trong mảng)
  const handleRemoveImage = (indexToRemove) => {
    setUploadedImages(
      uploadedImages.filter((_, index) => index !== indexToRemove),
    );
  };

  // --- 3. XỬ LÝ NÚT BẤM CỦA COMPONENT CHA ---

  // Xử lý nút quay lại
  const handleBack = () => {
    navigate(-1); // Quay lại trang trước đó trong lịch sử trình duyệt
  };

  // Xử lý nút Gửi Báo Cáo
  const handleSubmitReport = () => {
    if (completedTasks.length === 0) {
      alert(
        "Vui lòng đánh dấu ít nhất 1 công việc đã hoàn thành trước khi gửi báo cáo!",
      );
      return;
    }

    // Gom toàn bộ dữ liệu để chuẩn bị gửi lên Server
    const finalReport = {
      shiftId: shiftId,
      tasksDone: completedTasks,
      images: uploadedImages,
      reportedAt: new Date().toISOString(),
    };

    console.log("Dữ liệu đã sẵn sàng để gửi lên Server:", finalReport);
    alert("Đã gửi báo cáo tiến độ thành công!");

    // Sau khi gửi báo cáo xong, đẩy người dùng quay lại trang Lịch làm việc
    navigate("/schedule");
  };

  // Hiển thị màn hình chờ nếu dữ liệu ca làm việc chưa tải xong
  if (!shiftData) {
    return <div className="loading">Đang tải dữ liệu ca làm việc...</div>;
  }

  return (
    <div className="task-progress-page">
      {/* Góc trên cùng bên trái: Nút Quay Lại */}
      <div className="progress-header">
        <button className="btn-back" onClick={handleBack}>
          <FiArrowLeft className="icon" />
          Quay lại Lịch làm việc
        </button>
      </div>

      <div className="progress-content">
        {/* COMPONENT 1: Thông tin ca làm việc hiện tại */}
        <CurrentTaskInfo shift={shiftData} />

        <div className="divider"></div>

        {/* COMPONENT 2: Danh sách các nút bấm công việc */}
        <TaskChecklist
          completedTasks={completedTasks}
          onToggleTask={handleTaskToggle}
        />

        {/* COMPONENT 3: Khu vực chụp và tải ảnh */}
        <ImageUploader
          images={uploadedImages}
          onAddImage={handleAddImage}
          onRemoveImage={handleRemoveImage}
        />
      </div>

      {/* Góc dưới cùng bên trái: Nút Gửi Báo Cáo */}
      <div className="progress-footer">
        <button className="btn-submit-report" onClick={handleSubmitReport}>
          <FiSend className="icon" />
          Gửi báo cáo tiến độ
        </button>
      </div>
    </div>
  );
};

export default TaskProgress;
