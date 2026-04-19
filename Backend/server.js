const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// Middleware giúp Frontend (port 5173) có thể gọi Backend (port 5000) mà không bị lỗi CORS
app.use(cors());
app.use(express.json());

// 1. CẤU HÌNH KẾT NỐI VỚI XAMPP (MySQL)
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Tài khoản mặc định của XAMPP là 'root'
  password: "", // XAMPP mặc định không có mật khẩu (để trống)
  database: "doantotnghiep", // Tên Database bạn vừa tạo
});

// 2. KIỂM TRA KẾT NỐI
db.connect((err) => {
  if (err) {
    console.error(" Lỗi kết nối Cơ sở dữ liệu:", err.message);
    return;
  }
  console.log(" Đã kết nối thành công đến MySQL (XAMPP)!");
});

// ==========================================
// CÁC ĐƯỜNG DẪN API (ROUTING)
// ==========================================

// API: Lấy danh sách dịch vụ đang hoạt động
app.get("/api/services", (req, res) => {
  // Câu lệnh SQL lấy tất cả dịch vụ có trạng thái active = 1 (TRUE)
  const sqlQuery = "SELECT * FROM Services WHERE active = 1";

  db.query(sqlQuery, (err, results) => {
    if (err) {
      console.error("Lỗi lấy dữ liệu:", err);
      return res
        .status(500)
        .json({ error: "Lỗi Server khi lấy danh sách dịch vụ" });
    }
    // Gửi kết quả về cho Frontend dưới dạng JSON
    res.json(results);
  });
});

// ==========================================
// KHỞI ĐỘNG SERVER
// ==========================================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(
    ` Server Backend đang chạy thành công tại: http://localhost:${PORT}`,
  );
  console.log(
    `Bấm vào đây để xem dữ liệu API: http://localhost:${PORT}/api/services`,
  );
});
