import { useNavigate } from 'react-router-dom';
import { FiClock, FiMapPin, FiUser, FiCheckCircle } from 'react-icons/fi';
import './ShiftCard.css';
import { scheduleService } from '../../service/scheduleService.js'

const ShiftCard = ({ shift, onRefresh }) => {
  const navigate = useNavigate();

  // Xử lý nút Chấp nhận / Từ chối
  const handleStartShift = async (type) => {
    try {
      await scheduleService.updateAssigment(type, shift.id);
      onRefresh(); // Cập nhật lại danh sách ngay lập tức
    } catch (error) {
      console.log(error);
      alert("Cập nhật trạng thái thất bại");
    }
  };

  // Nút điều hướng sang trang Tiến độ, GỬI KÈM BOOKING ID
  const handleReportProgress = () => {
    navigate(`/schedule/progress/${shift.id}`, { state: { bookingId: shift.bookingId } });
  };

  const formatTime = (isoString) => {
    if (!isoString) return "Chưa xác định";
    const date = new Date(isoString);
    return date.toLocaleString('vi-VN', { 
      hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' 
    });
  };

  // 👉 DÙNG SWITCH CASE ĐỂ QUẢN LÝ NÚT BẤM DỰA VÀO STATUS
  const renderActionButtons = () => {
    switch (shift.status) {
      case 'assigned':
        return (
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="btn-action btn-start" onClick={() => handleStartShift("accepted")}>Chấp nhận</button>
            <button className="btn-action" style={{backgroundColor: "#ff4d4f"}} onClick={() => handleStartShift("rejected")}>Từ chối</button>
          </div>
        );
      case 'accepted':
        return <button className="btn-action btn-report" onClick={handleReportProgress}>Bắt đầu di chuyển</button>;
      case 'is_coming':
        return <button className="btn-action btn-report" onClick={handleReportProgress}>Đã đến nơi</button>;
      case 'arrived':
        return <button className="btn-action btn-report" onClick={handleReportProgress}>Bắt đầu làm việc</button>;
      case 'is_working':
        return <button className="btn-action btn-report" onClick={handleReportProgress}>Hoàn thành công việc</button>;
      case 'completed':
        return <button className="btn-action" style={{backgroundColor: "#aaa", cursor: "not-allowed"}} disabled>Đã hoàn thành</button>;
      default:
        return null;
    }
  };

  return (
    <div className="shift-card">
      <div className="shift-card-header">
        <div className="shift-time">
          <FiClock className="icon" />
          <span>{formatTime(shift.scheduledTime)}</span>
        </div>
        <div className={`status-badge ${shift.status}`}>
          {shift.status === 'completed' ? 'Hoàn thành' : (shift.status === 'assigned' ? 'Chờ xác nhận' : 'Đang thực hiện')}
        </div>
      </div>

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
          <span>Ghi chú: {shift.note || 'Không có'}</span>
        </div>
      </div>

      <div className="shift-card-footer">
        {renderActionButtons()}
      </div>
    </div>
  );
};

export default ShiftCard;