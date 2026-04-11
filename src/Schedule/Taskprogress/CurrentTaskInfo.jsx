import React from 'react';
import { FiClock, FiUser, FiMapPin } from 'react-icons/fi';
import './CurrentTaskInfo.css';

// Nhận dữ liệu 'shift' từ component cha (TaskProgress.jsx) truyền xuống
const CurrentTaskInfo = ({ shift }) => {
  // Phòng hờ trường hợp dữ liệu chưa kịp tải
  if (!shift) return null;

  return (
    <div className="current-task-info">
      <h2 className="task-title">
        <span className="label">Đang thực hiện:</span> {shift.serviceName}
      </h2>

      <div className="task-details-box">
        {/* Hàng 1: Thời gian (Được highlight nổi bật) */}
        <div className="detail-row time-highlight">
          <FiClock className="detail-icon" />
          <span>
            Thời gian: <strong>{shift.startTime} - {shift.endTime}</strong>
          </span>
        </div>

        {/* Hàng 2: Khách hàng */}
        <div className="detail-row">
          <FiUser className="detail-icon" />
          <span>Khách hàng: <strong>{shift.customerName}</strong></span>
        </div>

        {/* Hàng 3: Địa chỉ */}
        <div className="detail-row">
          <FiMapPin className="detail-icon" />
          <span>Địa chỉ: {shift.address}</span>
        </div>
      </div>
    </div>
  );
};

export default CurrentTaskInfo;