// src/pages/Schedule/ScheduleList.jsx
import React, { useState, useEffect } from "react";
import ShiftCard from "./components/ShiftCard.jsx";
import { scheduleService } from "../service/scheduleService";
import { useAuth } from "../AuthContext.jsx"; 

const ScheduleList = () => {
  const { user } = useAuth(); 
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  //  State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Tối đa 5 ca làm việc 1 trang

 useEffect(() => {
    const fetchSchedule = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const jobsRes = await scheduleService.getStaffJobs(user.id);
        const assignments = jobsRes.data?.data || [];
        
const detailedShifts = await Promise.all(
  assignments.map(async (assignment) => {
    const detailRes = await scheduleService.getBookingDetails(assignment.bookingId);
    const bookingDetail = detailRes.data;

    // === FIX LOGIC Ở ĐÂY ===
    // 1. Tạo chuỗi gộp tên tất cả các dịch vụ (Ví dụ: "Đưa đón người thân, Bảo mẫu cho trẻ")
    const combinedServiceNames = bookingDetail.bookingDetails
      ?.map(detail => detail.service?.name)
      .join(" + ") || "Dịch vụ tổng hợp";

    // 2. Lấy đúng tổng tiền của cả đơn (Total Amount thay vì Unit Price của 1 dịch vụ)
    const combinedTotalPrice = bookingDetail.totalAmount || "0";
    // =======================

    return {
      id: assignment.id, 
      bookingId: bookingDetail.id,
      staffId: assignment.staffId || user.id,
      status: assignment.status, 
      reason: assignment.reason, 
      scheduledTime: bookingDetail.scheduledTime,
      address: bookingDetail.address,
      note: bookingDetail.note,
      customerName: bookingDetail.customer?.name || "Khách hàng ẩn danh",
      phone: bookingDetail.customer?.phone || "Không có SĐT",
      
      // Sử dụng biến đã gộp
      unitPrice: combinedTotalPrice, 
      serviceName: combinedServiceNames, 
    };
  })
);
        setShifts(detailedShifts);
      } catch (error) {
        console.error("Lỗi khi tải lịch làm việc:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [user, refreshKey]);

  // 👉LOGIC PHÂN TRANG
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentShifts = shifts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(shifts.length / itemsPerPage);

  if (loading) return <div>Đang tải lịch làm việc...</div>;

  if (shifts.length === 0) {
    return (
      <div>
        <h3 style={{ color: "#333", marginBottom: "10px" }}>Chưa có lịch làm việc</h3>
        <p style={{ color: "#666", fontSize: "14px" }}>
          Hiện tại bạn không có công việc nào được giao.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Render 5 Card mỗi trang */}
      {currentShifts.map((shift) => (
        <ShiftCard 
          key={shift.id} 
          shift={shift} 
          onRefresh={() => setRefreshKey(prev => prev + 1)} 
        />
      ))}

      {/* Giao diện Nút Phân Trang */}
      {totalPages > 1 && (
        <div className="schedule-pagination">
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Trước
          </button>
          <span>Trang {currentPage} / {totalPages}</span>
          <button 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default ScheduleList;