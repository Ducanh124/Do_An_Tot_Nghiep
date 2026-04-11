import React from 'react';
import { FiClock, FiMapPin, FiUser, FiCheckCircle, FiStar } from 'react-icons/fi';
import './CompletedCard.css';

const CompletedCard = ({ shift }) => {
  return (
    <div className="completed-card">
      {/* Phần Header: Thời gian và Badge trạng thái */}
      <div className="completed-card-header">
        <div className="shift-time muted-text">
          <FiClock className="icon" />
          <span>{shift.startTime} - {shift.endTime}</span>
        </div>
        <div className="status-badge completed">
          <FiCheckCircle className="icon-small" />
          Đã hoàn thành
        </div>
      </div>

      {/* Phần Body: Thông tin khách hàng và công việc */}
      <div className="completed-card-body">
        <h3 className="service-type">{shift.serviceName}</h3>
        
        <div className="info-row">
          <FiUser className="icon text-gray" />
          <span className="muted-text">{shift.customerName} • {shift.phone}</span>
        </div>
        
        <div className="info-row address">
          <FiMapPin className="icon text-gray" />
          <span className="muted-text">{shift.address}</span>
        </div>
      </div>

      {/* Phần Footer: Hiển thị kết quả thay vì nút bấm */}
      <div className="completed-card-footer">
        <div className="completion-info">
          <span className="finish-time">
            Hoàn thành lúc: {shift.actualFinishTime || shift.endTime}
          </span>
          {/* Nếu khách hàng đã đánh giá thì hiển thị số sao */}
          {shift.rating && (
            <div className="rating">
              <FiStar className="star-icon filled" />
              <span>{shift.rating}.0</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompletedCard;