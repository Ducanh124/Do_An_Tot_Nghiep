import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./layout/Sidebar.jsx";
import PersonalInfo from "./Infor/PersonalInfo.jsx";
import Schedule from "./Schedule/ScheduleList.jsx";
import TaskProgress from "./Schedule/Taskprogress/Taskprogress.jsx";
import Login from "./Auth/Login.jsx";
import Register from "./Auth/Register.jsx"; // 1. BẠN CẦN IMPORT THÊM FILE NÀY (Nhớ kiểm tra lại đường dẫn cho đúng)

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route không có Sidebar (Trang khách) */}
        <Route path="/login" element={<Login />} />

        {/* 2. THÊM ROUTE CHO TRANG REGISTER Ở ĐÂY */}
        <Route path="/register" element={<Register />} />

        {/* Route mặc định khi vào web sẽ chuyển hướng ra màn hình đăng nhập */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Các route có Sidebar (Dành cho sau khi đăng nhập thành công) */}
        <Route
          path="/*"
          element={
            <div className="app-container">
              <Sidebar />
              <div className="main-content">
                <Routes>
                  <Route path="/profile" element={<PersonalInfo />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route
                    path="/schedule/progress/:id"
                    element={<TaskProgress />}
                  />
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
