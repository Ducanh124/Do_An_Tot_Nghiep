import React, { useState, useEffect } from "react";
import "./LeaveList.css";
// Import API
import { request, getLeaveRequests } from "../service/requestLeave.js"; 
import { useAuth } from "../AuthContext.jsx"; 

const LeaveList = () => {
  const { user } = useAuth();
  
  // State quản lý danh sách và phân trang
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Số lượng đơn/trang
  
  //  State lưu tổng số trang lấy từ Backend
  const [totalPages, setTotalPages] = useState(1);

  // State quản lý Form Popup
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
    reason: "",
  });

  //  HÀM TẢI DANH SÁCH: Gọi API kèm theo Page và Limit
  const fetchLeaves = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      // Truyền currentPage và itemsPerPage (8) vào hàm API
      const res = await getLeaveRequests(user.id, currentPage, itemsPerPage); 
      
      // Bóc tách mảng dữ liệu (Logic bóc tách đa tầng)
      let leaveData = [];
      if (Array.isArray(res?.data?.data)) {
        leaveData = res.data.data;
      } else if (Array.isArray(res?.data)) {
        leaveData = res.data;
      } else if (Array.isArray(res)) {
        leaveData = res;
      }
      
      setLeaves(leaveData);

      // Lấy tổng số trang từ Backend trả về để vẽ thanh chuyển trang
      const totalPagesFromBackend = res?.data?.totalPages || res?.totalPages || 1;
      setTotalPages(totalPagesFromBackend);

    } catch (error) {
      console.error("Lỗi tải danh sách nghỉ phép:", error);
    } finally {
      setLoading(false);
    }
  };

  // Đưa currentPage vào mảng [] để tự động chạy lại API khi đổi trang
  useEffect(() => {
    fetchLeaves();
  }, [user, currentPage]);

  // HÀM XỬ LÝ KHI NHẬP FORM
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // HÀM GỬI ĐƠN XIN NGHỈ PHÉP
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      alert("Thời gian kết thúc phải lớn hơn thời gian bắt đầu!");
      return;
    }

    const payload = {
      staffId: user.id,
      startTime: new Date(formData.startTime).toISOString(),
      endTime: new Date(formData.endTime).toISOString(),
      reason: formData.reason,
      status: "pending" 
    };

    try {
      setIsSubmitting(true);
      await request(payload);
      alert("Gửi đơn xin nghỉ phép thành công!");
      
      setShowForm(false);
      setFormData({ startTime: "", endTime: "", reason: "" });
      
      // Nếu đang ở trang khác, nộp đơn xong có thể ép nó quay về trang 1
      setCurrentPage(1); 
      fetchLeaves(); 
    } catch (error) {
      console.error("Lỗi gửi đơn:", error);
      alert("Gửi đơn thất bại. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // HÀM FORMAT NGÀY THÁNG
  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  // HÀM TẠO BADGE TRẠNG THÁI
  const renderStatus = (status) => {
    switch (status) {
      case "pending":
        return <span className="status-badge pending">Đang chờ xác nhận</span>;
      case "approved":
        return <span className="status-badge approved">Đã duyệt</span>;
      case "rejected":
        return <span className="status-badge rejected">Từ chối</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };


  return (
    <div className="leave-container">
      {/* HEADER */}
      <div className="leave-header">
        <h2>Quản lý nghỉ phép</h2>
        <button className="btn-add-leave" onClick={() => setShowForm(true)}>
          + Xin nghỉ phép
        </button>
      </div>

      {/* BẢNG DANH SÁCH */}
      <div className="table-wrapper">
        {loading ? (
          <div style={{ padding: "20px", textAlign: "center" }}>Đang tải dữ liệu...</div>
        ) : leaves.length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>Bạn chưa có đơn xin nghỉ phép nào.</div>
        ) : (
          <>
            <table className="leave-table">
              <thead>
                <tr>
                  <th style={{ width: "35%" }}>THỜI GIAN NGHỈ PHÉP</th>
                  <th style={{ width: "40%" }}>LÝ DO</th>
                  <th style={{ width: "25%", textAlign: "center" }}>TRẠNG THÁI</th>
                </tr>
              </thead>
              <tbody>
                {/* Dùng trực tiếp mảng leaves vì Backend đã trả đúng 8 cái rồi */}
                {leaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>
                      <div className="time-col">
                        <span className="date-text">{formatDate(leave.startTime)}</span>
                        <span className="arrow"> ➔ </span>
                        <span className="date-text">{formatDate(leave.endTime)}</span>
                      </div>
                    </td>
                    <td className="reason-text">{leave.reason}</td>
                    <td style={{ textAlign: "center" }}>{renderStatus(leave.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ĐIỀU HƯỚNG PHÂN TRANG */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Trước
                </button>
                <span>Trang {currentPage} / {totalPages}</span>
                <button 
                  disabled={currentPage === totalPages} 
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* POPUP FORM XIN NGHỈ PHÉP */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Tạo đơn xin nghỉ phép</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Thời gian bắt đầu nghỉ <span className="required">*</span></label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Thời gian kết thúc nghỉ <span className="required">*</span></label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Lý do nghỉ phép <span className="required">*</span></label>
                <textarea
                  name="reason"
                  rows="4"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="Nhập lý do xin nghỉ chi tiết..."
                  required
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
                  Hủy bỏ
                </button>
                <button type="submit" className="btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? "Đang gửi..." : "Gửi đơn"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveList;