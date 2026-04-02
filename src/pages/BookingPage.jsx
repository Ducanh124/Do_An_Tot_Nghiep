// frontend/src/pages/BookingPage.jsx
import React from "react";
import { useParams } from "react-router-dom";

const BookingPage = () => {
  // Lấy ID dịch vụ từ thanh địa chỉ URL (ví dụ: /booking/1 -> id = 1)
  const { id } = useParams();

  return (
    <div className="container mt-5 text-center">
      <h2>Trang Đặt Lịch</h2>
      <p className="text-muted">
        Bạn đang tiến hành đặt lịch cho dịch vụ có ID: <strong>{id}</strong>
      </p>
      <div className="alert alert-info">
        Form chọn ngày giờ và điền thông tin khách hàng sẽ được xây dựng ở đây.
      </div>
    </div>
  );
};

export default BookingPage;
