import React, { useState, useEffect } from "react";
import ShiftCard from "./components/ShiftCard.jsx";
import CompletedCard from "./components/CompletedCard.jsx";
import { FiCalendar, FiFilter } from "react-icons/fi";
import "./ScheduleList.css";

const ScheduleList = () => {
  // State lưu trữ danh sách toàn bộ ca làm việc
  const [shifts, setShifts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Giả lập việc gọi API từ Backend khi trang vừa được tải (ComponentDidMount)
  useEffect(() => {
    // Dữ liệu giả lập (Mock Data) thường được Backend trả về
    const mockData = [
      {
        id: "101",
        status: "pending", // Trạng thái: Chờ bắt đầu
        serviceName: "Dọn dẹp nhà cửa định kỳ",
        startTime: "08:00",
        endTime: "11:00",
        customerName: "Trần Thị Bích",
        phone: "0912.345.678",
        address: "Căn 12A05, Tòa S2.02, Vinhomes Ocean Park, Gia Lâm, Hà Nội",
        note: "Nhà có chó nhỏ, chú ý khi hút bụi.",
      },
      {
        id: "102",
        status: "in_progress", // Trạng thái: Đang làm việc (đã bấm Bắt đầu)
        serviceName: "Nấu ăn gia đình",
        startTime: "16:00",
        endTime: "18:00",
        customerName: "Lê Văn Hoàng",
        phone: "0988.765.432",
        address: "Số 15, Ngõ 42, Phố Láng Hạ, Đống Đa, Hà Nội",
        note: "Khách dị ứng hải sản.",
      },
      {
        id: "103",
        status: "completed", // Trạng thái: Đã hoàn thành
        serviceName: "Tổng vệ sinh sau xây dựng",
        startTime: "13:00",
        endTime: "15:30",
        customerName: "Phạm Thu Thủy",
        phone: "0909.112.233",
        address: "Biệt thự 04, Khu đô thị Ciputra, Tây Hồ, Hà Nội",
        actualFinishTime: "15:45",
        rating: 5,
      },
    ];

    // Giả lập độ trễ mạng 1 giây để thấy hiệu ứng loading
    setTimeout(() => {
      setShifts(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);

  // PHÂN LOẠI DỮ LIỆU: Tách mảng lớn thành 2 mảng nhỏ dựa vào status
  const pendingShifts = shifts.filter(
    (shift) => shift.status === "pending" || shift.status === "in_progress",
  );

  const completedShifts = shifts.filter(
    (shift) => shift.status === "completed",
  );

  // Lấy ngày hiện tại để hiển thị lên tiêu đề
  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (isLoading) {
    return <div className="loading-screen">Đang tải lịch làm việc...</div>;
  }

  return (
    <div className="schedule-page-container">
      {/* --- HEADER --- */}
      <div className="schedule-header">
        <div className="header-title">
          <h2>Lịch làm việc của bạn</h2>
          <div className="current-date">
            <FiCalendar className="icon-date" />
            <span>Hôm nay: {today}</span>
          </div>
        </div>
        <button className="btn-filter">
          <FiFilter /> Lọc ca làm
        </button>
      </div>

      {/* --- PHẦN 1: CA LÀM VIỆC HÔM NAY --- */}
      <div className="schedule-section">
        <div className="section-title">
          <h3>
            Hôm nay <span className="count-badge">{pendingShifts.length}</span>
          </h3>
        </div>

        <div className="shifts-list">
          {pendingShifts.length > 0 ? (
            // Dùng vòng lặp map để truyền dữ liệu xuống component ShiftCard
            pendingShifts.map((shift) => (
              <ShiftCard key={shift.id} shift={shift} />
            ))
          ) : (
            <div className="empty-state">
              <p>Bạn không có ca làm việc nào đang chờ xử lý.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- PHẦN 2: CÔNG VIỆC ĐÃ HOÀN THÀNH --- */}
      <div className="schedule-section completed-section">
        <div className="section-title">
          <h3>
            Đã hoàn thành{" "}
            <span className="count-badge completed">
              {completedShifts.length}
            </span>
          </h3>
        </div>

        <div className="shifts-list">
          {completedShifts.length > 0 ? (
            // Dùng vòng lặp map để truyền dữ liệu xuống component CompletedCard
            completedShifts.map((shift) => (
              <CompletedCard key={shift.id} shift={shift} />
            ))
          ) : (
            <div className="empty-state">
              <p>Bạn chưa hoàn thành ca làm việc nào trong hôm nay.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleList;
