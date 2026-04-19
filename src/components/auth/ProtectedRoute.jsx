import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("user");

  if (!isLoggedIn) {
    // Nếu chưa đăng nhập, tự động đá về trang /login
    // Tham số replace giúp xóa lịch sử trang hiện tại, ấn nút Back không bị kẹt
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập, cho phép đi tiếp vào giao diện bên trong (children)
  return children;
};

export default ProtectedRoute;
