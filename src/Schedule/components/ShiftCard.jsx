// src/pages/Schedule/components/ShiftCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShiftCard.css';
import { scheduleService } from '../../service/scheduleService.js';

const ShiftCard = ({ shift, onRefresh }) => {
  const navigate = useNavigate();

  // State cho Modal Từ chối
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectType, setRejectType] = useState("rejected"); // 'rejected' (mới nhận) hoặc 'cancelled' (đang làm)
  const [isRejecting, setIsRejecting] = useState(false);//xác thực đang gửi dữ liệu

  // State cho Modal Tiến độ
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressData, setProgressData] = useState([]);
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);

  // Mở popup từ chối
  const handleOpenReject = (type) => {
    setRejectType(type);
    setRejectReason("");
    setShowRejectModal(true);
  };

  // Submit từ chối lên Backend
  const submitReject = async (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      alert("Vui lòng nhập lý do!");
      return;
    }

    const payload = {
      id: shift.id,
      bookingId: shift.bookingId,
      staffId: shift.staffId,
      status: rejectType, // "rejected" hoặc "cancelled"
      assignedAt: new Date().toISOString(),
      reason: rejectReason,
      note: shift.note || "" 
    };

    try {
      setIsRejecting(true);
      await scheduleService.updateAssignment(shift.id, payload);
      alert("Đã gửi lý do từ chối thành công!");
      setShowRejectModal(false);
      onRefresh(); // Tải lại danh sách
    } catch (error) {
      console.log(error);
      alert("Từ chối thất bại, vui lòng thử lại!");
    } finally {
      setIsRejecting(false);
    }
  };

  // Xử lý nút Chấp nhận
  const handleStartShift = async () => {
    try {
      await scheduleService.updateAssignment(shift.id, { 
        status: "accepted",
        note: shift.note || "" 
      });
      onRefresh();
    } catch (error) {
      console.log(error);
      alert("Cập nhật trạng thái thất bại");
    }
  };

  // Nút điều hướng sang trang Báo cáo Tiến độ (Chụp ảnh)
  const handleReportProgress = () => {
    navigate(`/schedule/progress/${shift.id}`, { state: { bookingId: shift.bookingId } });
  };

  // Mở Popup xem lịch sử tiến độ
  const handleOpenProgressHistory = async () => {
    setShowProgressModal(true);
    try {
      setIsLoadingProgress(true);
      const res = await scheduleService.getProgressByBooking(shift.bookingId);
      let pData = res.data?.data || res.data || [];
      
      // Sắp xếp tiến độ theo thời gian (cũ nhất -> mới nhất)
      pData.sort((a, b) => new Date(a.recordedAt) - new Date(b.recordedAt));
      setProgressData(pData);
    } catch (error) {
      console.error("Lỗi lấy tiến độ:", error);
    } finally {
      setIsLoadingProgress(false);
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return "Chưa xác định";
    const date = new Date(isoString);
    return date.toLocaleString('vi-VN', { 
      hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' 
    });
  };

  // Dịch StepName tiếng Anh sang tiếng Việt
  const translateStep = (step) => {
    switch (step) {
      case 'is_coming': return "Bắt đầu di chuyển";
      case 'arrived': return "Đã đến nơi";
      case 'is_working': return "Bắt đầu làm việc";
      case 'completed': return "Hoàn thành công việc";
      default: return step;
    }
  };

  // THÊM MỚI: Hàm dịch phương thức thanh toán
  const formatPayment = (paymentStatus) => {
    if (paymentStatus === "PAID") return "Chuyển khoản";
    if (paymentStatus === "CAST") return "Tiền mặt";
    return "Chưa xác định";
  };

  // Render các Nút Bấm tùy theo Status
  const renderActionButtons = () => {// có css là shift-card-footer để điều chỉnh lịch sử tiến độ
    switch (shift.status) {
      case 'assigned':
        return (
          <div className="action-group">
            <button className="btn-action btn-start" onClick={handleStartShift}>Chấp nhận</button>
            <button className="btn-action btn-reject-secondary" onClick={() => handleOpenReject("rejected")}>Từ chối</button>
          </div>
        );
      case 'accepted':
        return (
          <div className="action-group">
            <button className="btn-action btn-report" onClick={handleReportProgress}>Bắt đầu di chuyển</button>
            <button className="btn-action btn-reject-secondary" onClick={() => handleOpenReject("cancelled")}>Từ chối (Sự cố)</button>
          </div>
        );
      case 'is_coming':
        return (
          <div className="action-group">
            <button className="btn-action btn-report" onClick={handleReportProgress}>Đã đến nơi</button>
            <button className="btn-action btn-reject-secondary" onClick={() => handleOpenReject("cancelled")}>Từ chối (Sự cố)</button>
          </div>
        );
      case 'arrived':
        return (
          <div className="action-group">
            <button className="btn-action btn-report" onClick={handleReportProgress}>Bắt đầu làm việc</button>
            <button className="btn-action btn-reject-secondary" onClick={() => handleOpenReject("cancelled")}>Từ chối (Sự cố)</button>
          </div>
        );
      case 'is_working':
        return (
          <div className="action-group">
            <button className="btn-action btn-report" onClick={handleReportProgress}>Hoàn thành công việc</button>
            <button className="btn-action btn-reject-secondary"  onClick={() => handleOpenReject("cancelled")}>Từ chối (Sự cố)</button>
          </div>
        );
      case 'completed':
        return (
          <button className="btn-action btn-history" onClick={handleOpenProgressHistory}>
            Lịch sử tiến độ
          </button>
        );
      // rejected và cancelled thì không hiện nút gì cả
      default:
        return null;
    }
  };

  // Render Badge trạng thái 
  const renderTopBadge = () => {
    if (['accepted', 'is_coming', 'arrived', 'is_working'].includes(shift.status)) {
      return <span className="top-badge badge-accepted">Đã chấp nhận</span>;
    }
    if (['rejected', 'cancelled'].includes(shift.status)) {
      return <span className="top-badge badge-rejected">Đã từ chối</span>;
    }
    if (shift.status === 'completed') {
      return <span className="top-badge badge-completed">Đã hoàn thành</span>;
    }
    return null;
  };

  return (
    <>
      <div className={`shift-card ${['rejected', 'cancelled'].includes(shift.status) ? 'card-dimmed' : ''}`}>
        
        {/* HUY HIỆU GÓC TRÊN CÙNG */}
        {renderTopBadge()}

        <div className="shift-card-header">
          <div className="shift-time">
            {formatTime(shift.scheduledTime)}
          </div>
        </div>

        <div className="shift-card-body">
          <h3 className="service-type">{shift.serviceName}</h3>
          <div className="info-row">
            {shift.customerName} • {shift.phone}
          </div>
          <div className="info-row">
            Giá: {Number(shift.unitPrice).toLocaleString('vi-VN')} đ
          </div>
          
          <div className="info-row">
            Thanh toán: <strong>{formatPayment(shift.paymentStatus)}</strong>
          </div>

          <div className="info-row">
            {shift.address}
          </div>
          <div className="task-preview">
            Ghi chú: {shift.note || 'Không có'}
          </div>
        </div>

        {/* NẾU ĐÃ TỪ CHỐI THÌ HIỆN LÝ DO Ở DƯỚI */}
        {['rejected', 'cancelled'].includes(shift.status) && (
          <div className="reject-reason-display">
            <strong>Lý do từ chối:</strong> {shift.reason || 'Không rõ'}
          </div>
        )}

        <div className="shift-card-footer">
          {renderActionButtons()}
        </div>
      </div>

      {/* --- MODAL 1: FORM NHẬP LÝ DO TỪ CHỐI --- */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Nhập lý do từ chối</h3>
            <form onSubmit={submitReject} noValidate>
              <textarea
                className="reject-textarea"
                rows="10"
                placeholder="Nhập lý do chi tiết..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                required
              ></textarea>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowRejectModal(false)}>Hủy</button>
                <button type="submit" className=" btn-danger" disabled={isRejecting}>
                  {isRejecting ? "Đang gửi..." : "Xác nhận từ chối"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: XEM LỊCH SỬ TIẾN ĐỘ --- */}
      {showProgressModal && (
        <div className="modal-overlay">
          <div className="modal-content history-modal">
            <div className="history-header">
              <h3>Lịch sử tiến độ công việc</h3>
              <button className="btn-close" onClick={() => setShowProgressModal(false)}>✖</button>
            </div>
            
            <div className="history-body">
              {isLoadingProgress ? (
                <p style={{textAlign:"center"}}>Đang tải lịch sử...</p>
              ) : progressData.length === 0 ? (
                <p style={{textAlign:"center", color:"#888"}}>Chưa có dữ liệu tiến độ.</p>
              ) : (
                <ul className="timeline">
                  {progressData.map((step) => (
                    <li key={step.id} className="timeline-item">
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <h4>{translateStep(step.stepName)}</h4>
                        <span className="timeline-time">{formatTime(step.recordedAt)}</span>
                        
                        {step.note && <p className="timeline-note">Ghi chú: {step.note}</p>}
                        
                        {/* 1. XỬ LÝ TRƯỜNG HỢP TRẢ VỀ LÀ MẢNG CÁC ẢNH (ARRAY) */}
                        {Array.isArray(step.evidenceImageUrl) && step.evidenceImageUrl.length > 0 && (
                          <div className="evidence-image-gallery">
                            {step.evidenceImageUrl.map((url, idx) => (
                              <img 
                                key={idx} 
                                src={url} 
                                alt={`Báo cáo ${idx + 1}`} 
                                className=" evidence-thumbnail" 
                                onClick={() => window.open(url, '_blank')}
                                title="Nhấn vào để xem ảnh gốc"
                              />
                            ))}
                          </div>
                        )}

                        {/* 2. XỬ LÝ DỰ PHÒNG CHO CÁC BẢN GHI CŨ TRẢ VỀ DẠNG CHUỖI (STRING) */}
                        {typeof step.evidenceImageUrl === 'string' && step.evidenceImageUrl !== "" && (
                          <div className="evidence-image-gallery">
                            <img 
                              src={step.evidenceImageUrl} 
                              alt="Báo cáo" 
                              className="evidence-thumbnail" 
                              onClick={() => window.open(step.evidenceImageUrl, '_blank')}
                              title="Nhấn vào để xem ảnh gốc"
                            />
                          </div>
                        )}
                        
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShiftCard;