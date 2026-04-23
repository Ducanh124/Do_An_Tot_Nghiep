import React, { useState, useEffect } from "react";
import ShiftCard from "./components/ShiftCard.jsx";
import { scheduleService } from "../service/scheduleService";
import { useAuth } from "../AuthContext.jsx"; 

const ScheduleList = () => {
  const { user } = useAuth(); 
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // Dùng để ép màn hình tải lại khi có thay đổi

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

            return {
              id: assignment.id, 
              bookingId: bookingDetail.id,
              status: assignment.status, 
              scheduledTime: bookingDetail.scheduledTime,
              address: bookingDetail.address,
              note: bookingDetail.note,
              customerName: bookingDetail.customer?.name || "Khách hàng ẩn danh",
              phone: bookingDetail.customer?.phone || "Không có SĐT",
              serviceName: bookingDetail.bookingDetails?.[0]?.service?.name || "Dịch vụ",
            };
          })
        );

        // 👉 LỌC VÀ SẮP XẾP DỮ LIỆU
        let filteredShifts = detailedShifts.filter(shift => shift.status !== 'rejected');
        
        filteredShifts.sort((a, b) => {
          if (a.status === 'completed' && b.status !== 'completed') return 1; // Đẩy completed xuống dưới
          if (a.status !== 'completed' && b.status === 'completed') return -1; // Đẩy cái khác lên trên
          return 0; 
        });

        setShifts(filteredShifts);
      } catch (error) {
        console.error("Lỗi khi tải lịch làm việc:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [user, refreshKey]); // Gọi lại API mỗi khi refreshKey thay đổi

  if (loading) return <div>Đang tải lịch làm việc...</div>;

  return (
    <div className="schedule-list">
      {shifts.map((shift) => (
        <ShiftCard 
          key={shift.id} 
          shift={shift} 
          // Truyền hàm báo cho Cha biết để tải lại dữ liệu
          onRefresh={() => setRefreshKey(prev => prev + 1)} 
        />
      ))}
    </div>
  );
};

export default ScheduleList;