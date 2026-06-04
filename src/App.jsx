import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./layout/Sidebar.jsx";
import PersonalInfo from "./Infor/PersonalInfo.jsx";
import Schedule from "./Schedule/ScheduleList.jsx";
import TaskProgress from "./Schedule/Taskprogress/Taskprogress.jsx";
import Login from "./Auth/Login.jsx";
import Register from "./Auth/Register.jsx"; 
import RegisterArea from "./RegisterArea/RegisterArea.jsx";
import Leaves from "./Leaves/LeaveList.jsx"; 
import Report from "./Report/reportRevenue.jsx";
//từ Appjsx vào import


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
                  <Route path="/schedule" element={<Schedule />} />
                  <Route
                    path="/schedule/progress/:id"
                    element={<TaskProgress />}
                  />
                  <Route path="/profile" element={<PersonalInfo />} />
                  <Route path="/register-area" element={<RegisterArea />} />
                  <Route path="/leaves" element={<Leaves/>} />
                  <Route path="/performance" element={<Report/>} />
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
