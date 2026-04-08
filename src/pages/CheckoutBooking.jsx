// frontend/src/pages/CheckoutPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Bắt dữ liệu orderData truyền từ trang trước sang
  const orderData = location.state;
  const handlePayment = () => {
    // Lấy danh sách lịch sử cũ từ localStorage (nếu chưa có thì tạo mảng rỗng)
    const existingHistory = JSON.parse(
      localStorage.getItem("bookingHistory") || "[]",
    );

    // Tạo đơn hàng mới với mã ID và ngày giờ hiện tại
    const newOrder = {
      ...orderData,
      id: "DH-" + Date.now().toString().slice(-4), // Tạo mã ID 4 số cuối ngẫu nhiên
      createdAt: new Date().toLocaleString("vi-VN"), // Lấy giờ Việt Nam hiện tại
      status: "pending",
    };
    // Thêm đơn hàng mới lên đầu danh sách
    const updatedHistory = [newOrder, ...existingHistory];
    // Lưu lại vào localStorage
    localStorage.setItem("bookingHistory", JSON.stringify(updatedHistory));
    // Chuyển hướng sang trang lịch sử
    alert("Thanh toán thành công! Chuyển đến lịch sử đơn hàng.");
    navigate("/history");
  };

  // Nếu người dùng vào thẳng trang này mà chưa chọn dịch vụ thì đẩy về trang chủ
  if (!orderData) {
    return (
      <div className="text-center mt-5">
        <h4>Chưa có thông tin đơn hàng!</h4>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
          Về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4 theme-text-blue">Xác nhận thanh toán</h2>

      <div className="card shadow-sm p-4">
        <h4 className="fw-bold border-bottom pb-3 mb-3">Thông tin đơn hàng</h4>

        <p>
          <strong>Dịch vụ:</strong> {orderData.serviceTitle}
        </p>
        <p>
          <strong>Địa chỉ làm việc:</strong>{" "}
          <span className="text-primary">{orderData.address}</span>
        </p>
        <p>
          <strong>Số lượng:</strong> {orderData.staffCount} nhân viên
        </p>
        <p>
          <strong>Gói dọn dẹp:</strong> {orderData.durationDesc} (
          {orderData.durationHours})
        </p>

        {/* Chỉ hiện ghi chú nếu khách có nhập */}
        {orderData.note && (
          <p>
            <strong>Ghi chú:</strong> {orderData.note}
          </p>
        )}

        <hr />
        <h3 className="text-end fw-bold text-danger">
          Tổng thanh toán: {orderData.totalPrice.toLocaleString("vi-VN")} ₫
        </h3>

        <div className="d-flex justify-content-end gap-3 mt-4">
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            Quay lại sửa
          </button>
          <button className="btn btn-success px-4" onClick={handlePayment}>
            Thanh toán ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
