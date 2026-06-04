import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  // Danh sách các chức năng bám sát sơ đồ phân rã 
  const menuItems = [

    { path: "/schedule", name: "Lịch làm việc" },
    

    { path: "/performance", name: "Hiệu suất & Thu nhập" },
    { path: "/reviews", name: "Đánh giá khách hàng" },
    { path: "/leaves", name: "Quản lý nghỉ phép" },
    { path: "/profile", name: "Hồ sơ năng lực" },
    { path: "/register-area", name: "Đăng ký nơi làm việc" },
    { path: "/incidents", name: "Báo cáo sự cố" },
  ];

  return (
    <aside className="sidebar">
      {/* Phần Logo Hệ thống */}
      <div className="sidebar-logo">
        <h2>BookingFamily</h2> 
      </div>

      {/* Phần Menu Điều hướng */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item, index) => (
            <li key={index} >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                    {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Phần Nút Đăng xuất ở cuối */}
      <div className="sidebar-footer">
        <button className="logout-btn">
          Đăng xuất
        </button>
      </div>
      
    </aside>
  );
};

export default Sidebar;