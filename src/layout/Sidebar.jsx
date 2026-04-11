import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  // Danh sách các chức năng bám sát sơ đồ phân rã 6.1 -> 6.7
  // Thay thế "•" bằng thẻ img chứa file icon xuất từ Figma của bạn
  // Ví dụ: icon: <img src="/icons/home.svg" alt="Home" width="20" height="20" />
  const menuItems = [
    // { path: "/dashboard", name: "Tổng quan", icon: "•" },
    { path: "/profile", name: "Hồ sơ năng lực", icon: "•" },
    { path: "/schedule", name: "Lịch làm việc", icon: "•" },
    // { path: "/task-progress", name: "Tiến độ công việc", icon: "•" },
    { path: "/performance", name: "Hiệu suất & Thu nhập", icon: "•" },
    { path: "/reviews", name: "Đánh giá khách hàng", icon: "•" },
    { path: "/leaves", name: "Quản lý nghỉ phép", icon: "•" },
    { path: "/incidents", name: "Báo cáo sự cố", icon: "•" },
  ];

  return (
    <aside className="sidebar">
      {/* Phần Logo Hệ thống */}
      <div className="sidebar-logo">
        <div className="logo-placeholder"></div>
        <h2>MaidManager</h2> {/* Đổi tên theo project trên Figma của bạn */}
      </div>

      {/* Phần Menu Điều hướng */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item, index) => (
            <li key={index} className="nav-item">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Phần Nút Đăng xuất ở cuối */}
      <div className="sidebar-footer">
        <button className="logout-btn">
          {/* Tự thêm thẻ <img> icon đăng xuất từ Figma vào đây */}
          <span className="nav-icon">•</span>
          <span className="nav-text">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;