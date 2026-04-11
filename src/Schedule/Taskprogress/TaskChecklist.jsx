import React from 'react';
import { FiCheck } from 'react-icons/fi';
import './TaskChecklist.css';

// Nhận mảng các công việc đã tick và hàm xử lý từ component Cha truyền xuống
const TaskChecklist = ({ completedTasks, onToggleTask }) => {
  // Danh sách công việc mẫu (Trong thực tế, Backend sẽ trả về danh sách này 
  // dựa trên gói dịch vụ khách hàng đã đặt. Ví dụ: gói Dọn dẹp sẽ khác gói Nấu ăn)
  const taskList = [
    { id: 'task_1', label: 'Quét và lau sàn nhà' },
    { id: 'task_2', label: 'Lau bụi bề mặt nội thất' },
    { id: 'task_3', label: 'Dọn dẹp nhà vệ sinh' },
    { id: 'task_4', label: 'Rửa bát / Dọn dẹp bếp' },
    { id: 'task_5', label: 'Gấp gọn quần áo' },
    { id: 'task_6', label: 'Thu gom và đổ rác' }
  ];

  return (
    <div className="task-checklist-container">
      {/* Phần Tiêu đề và Bộ đếm tiến độ */}
      <div className="checklist-header">
        <div className="title-group">
          <h3>Công việc cần hoàn thành</h3>
          <p>Chạm vào các mục bên dưới để đánh dấu đã xong.</p>
        </div>
        <div className="progress-counter">
          <span className="current">{completedTasks.length}</span>
          <span className="total">/{taskList.length}</span>
        </div>
      </div>

      {/* Lưới hiển thị các nút công việc (Pills) */}
      <div className="tasks-grid">
        {taskList.map((task) => {
          // Kiểm tra xem công việc này đã nằm trong mảng completedTasks chưa
          const isCompleted = completedTasks.includes(task.id);

          return (
            <button
              key={task.id}
              type="button" // Rất quan trọng để không kích hoạt submit form
              className={`task-pill ${isCompleted ? 'completed' : ''}`}
              onClick={() => onToggleTask(task.id)}
            >
              {/* Nếu đã hoàn thành thì hiện thêm icon dấu Tick */}
              {isCompleted && <FiCheck className="check-icon" />}
              <span>{task.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TaskChecklist;