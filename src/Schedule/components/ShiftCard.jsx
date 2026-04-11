import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiMapPin, FiUser, FiCheckCircle } from 'react-icons/fi';
import './ShiftCard.css';

// Component nhận vào tham số 'shift' chứa dữ liệu của 1 ca làm việc
const ShiftCard = ({ shift }) => {
  const navigate = useNavigate();
  
  // State quản lý trạng thái của ca làm việc này
  // Giả sử ban đầu là 'pending' (chờ bắt đầu)
  const [status, setStatus] = useState(shift.initialStatus || 'pending');

  // Hàm xử lý khi bấm nút "Bắt đầu"
  const handleStartShift = () => {
    // Trong thực tế, bạn sẽ gọi API ở đây để báo Backend cập nhật giờ check-in
    console.log(`Đã bắt đầu ca làm việc ID: ${shift.id}`);
    
    // Đổi trạng thái thành 'in_progress' để UI cập nhật nút bấm
    setStatus('in_progress');
  };

  // Hàm xử lý khi bấm nút "Báo cáo tiến độ"
  const handleReportProgress = () => {
    // Chuyển hướng sang trang TaskProgress kèm theo ID của ca làm việc
    navigate(`/schedule/progress/${shift.id}`);
  };

  return (
    <div className="shift-card">
      {/* Phần Header: Thời gian và Trạng thái */}
      <div className="shift-card-header">
        <div className="shift-time">
          <FiClock className="icon" />
          <span>{shift.startTime} - {shift.endTime}</span>
        </div>
        <div className={`status-badge ${status}`}>
          {status === 'pending' ? 'Sắp diễn ra' : 'Đang làm việc'}
        </div>
      </div>

      {/* Phần Body: Thông tin khách hàng và công việc */}
      <div className="shift-card-body">
        <h3 className="service-type">{shift.serviceName}</h3>
        
        <div className="info-row">
          <FiUser className="icon text-gray" />
          <span>{shift.customerName} • {shift.phone}</span>
        </div>
        
        <div className="info-row address">
          <FiMapPin className="icon text-gray" />
          <span>{shift.address}</span>
        </div>

        <div className="task-preview">
          <FiCheckCircle className="icon text-gray" />
          <span>Ghi chú: {shift.note || 'Không có ghi chú đặc biệt'}</span>
        </div>
      </div>

      {/* Phần Footer: Khu vực Nút bấm có Logic chuyển đổi */}
      <div className="shift-card-footer">
        {status === 'pending' ? (
          <button 
            className="btn-action btn-start" 
            onClick={handleStartShift}
          >
            Bắt đầu
          </button>
        ) : (
          <button 
            className="btn-action btn-report" 
            onClick={handleReportProgress}
          >
            Báo cáo tiến độ
          </button>
        )}
      </div>
    </div>
  );
};

export default ShiftCard;