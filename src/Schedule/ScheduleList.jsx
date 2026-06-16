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
        //lấy danh sách các đơn hàng của nhân viên đấy
        const jobsRes = await scheduleService.getStaffJobs(user.id);
        const assignments = jobsRes.data?.data || [];
        
        //lấy chi tiết các đơn hàng đấy
        let detailedShifts = await Promise.all(
          assignments.map(async (assignment) => {
            const detailRes = await scheduleService.getBookingDetails(assignment.bookingId);
            const bookingDetail = detailRes.data;

           //lấy chi tiết các dịch vụ(bookingDetails) của đơn hàng(là 1 mảng) để từ đó lấy được tên của các dịch vụ nằm trong đơn hàng đó
            const combinedServiceNames = bookingDetail.bookingDetails
              ?.map(detail => detail.service?.name)
              .join(" + ") || "Không có dịch vụ nào";

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
              unitPrice: combinedTotalPrice, 
              serviceName: combinedServiceNames, 
              paymentStatus: bookingDetail.paymentStatus, 
            };
          })
        );

        // THÊM MỚI: LOGIC SẮP XẾP ĐƠN HÀNG
        detailedShifts.sort((a, b) => {
          // Định nghĩa các trạng thái đã đóng (sẽ bị đẩy xuống dưới)
          const closedStatuses = ['completed', 'cancelled', 'rejected'];
          
          const isAClosed = closedStatuses.includes(a.status);
          const isBClosed = closedStatuses.includes(b.status);

          // 1. Phân loại trên - dưới
          // Nếu a ĐÃ ĐÓNG mà b CHƯA ĐÓNG -> a bị đẩy xuống dưới b (trả về 1)
          if (isAClosed && !isBClosed) return 1;
          // Nếu a CHƯA ĐÓNG mà b ĐÃ ĐÓNG -> a được nổi lên trên b (trả về -1)
          if (!isAClosed && isBClosed) return -1;

          // 2. Nếu cả 2 cùng nằm trong nhóm ĐÃ ĐÓNG, xếp theo thời gian (cũ xếp trước, mới xếp sau)
          if (isAClosed && isBClosed) {
            return new Date(a.scheduledTime) - new Date(b.scheduledTime);
          }

          // 3. Nếu cả 2 cùng nằm trong nhóm ĐANG MỞ, xếp theo thời gian đến gần nhất
          return new Date(a.scheduledTime) - new Date(b.scheduledTime);
        });

        setShifts(detailedShifts);
      } catch (error) {
        console.error("Lỗi khi tải lịch làm việc:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [user, refreshKey]);

  // LOGIC PHÂN TRANG
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