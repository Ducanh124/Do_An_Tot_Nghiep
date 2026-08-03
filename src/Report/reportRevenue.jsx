import React, { useState, useEffect } from "react";
import Swal from "sweetalert2"; 
import "./reportRevenue.css";
import { getRevenue } from "../service/reportRevenue.js"; 

const ReportRevenue = () => {
  // 1. Khởi tạo ngày mặc định (Từ đầu tháng đến ngày hiện tại)
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // Hàm chuyển Date sang chuỗi YYYY-MM-DD
  const formatDateForInput = (dateObj) => {
    // Lưu ý: getTimezoneOffset để tránh bị lùi 1 ngày do múi giờ VN
    const offset = dateObj.getTimezoneOffset() * 60000;
    const localISOTime = new Date(dateObj - offset).toISOString().split("T")[0];
    return localISOTime;
  };

  // State cho bộ lọc
  const [fromDate, setFromDate] = useState(formatDateForInput(firstDayOfMonth));
  const [toDate, setToDate] = useState(formatDateForInput(today));
  const [groupBy, setGroupBy] = useState("day");

  // State cho dữ liệu
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  // State tính tổng
  const [summary, setSummary] = useState({ totalAmount: 0, totalBookings: 0 });

  // 2. Hàm gọi API lấy dữ liệu
  const fetchReport = async () => {
    if (!fromDate || !toDate) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        html: '<span style="color: #faad14; font-weight: 500;">Vui lòng chọn đầy đủ thời gian bắt đầu và kết thúc!</span>',
        confirmButtonColor: "#faad14",
        confirmButtonText: "Đã hiểu"
      });
      return;
    }

    if (new Date(fromDate) > new Date(toDate)) {
      Swal.fire({
        icon: "warning",
        title: "Ngày không hợp lệ",
        html: '<span style="color: #faad14; font-weight: 500;">Ngày bắt đầu không được lớn hơn ngày kết thúc!</span>',
        confirmButtonColor: "#faad14",
        confirmButtonText: "Sửa lại"
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        from: fromDate, 
        to: toDate,     
        groupBy: groupBy 
      };

      const res = await getRevenue(payload);
      const data = res.data || [];
      
      setReportData(data);


      const sumAmount = data.reduce((acc, curr) => acc + Number(curr.totalCompletedAmount || 0), 0);
      const sumBookings = data.reduce((acc, curr) => acc + Number(curr.totalCompletedBookings || 0), 0);
      // cur là Đại diện cho dữ liệu của từng ngày khi vòng lặp chạy qua.
      //tạo 1 biến tổng = 0, sau đó cộng dữ liệu của từng ngày vào tổng
      setSummary({ totalAmount: sumAmount, totalBookings: sumBookings });

    } catch (error) {
      console.error("Lỗi khi tải báo cáo:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi dữ liệu",
        html: '<span style="color: #ff4d4f; font-weight: 500;">Không thể tải dữ liệu báo cáo! Vui lòng thử lại.</span>',
        confirmButtonColor: "#ff4d4f",
        confirmButtonText: "Đóng"
      });
    } finally {
      setLoading(false);
    }
  };
  //sau khi gọi api sẽ lấy đc dữ liệu bên dưới, và dữ liệu tổng


  // Tự động load dữ liệu lần đầu khi vào trang
  useEffect(() => {
    fetchReport();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Hàm định dạng tiền tệ VNĐ
  const formatCurrency = (amount) => {
    return Number(amount).toLocaleString("vi-VN") + " đ";
  };

  return (
    <div className="report-container">
      <h2 className="report-title">Hiệu suất và Thu nhập</h2>

      {/* --- BỘ LỌC  gồm 2 ô nhập liệu và 1 ô lọc--- */}
      <div className="report-filters">
        <div className="filter-group">
          <label>Từ ngày</label>
          <input 
            type="date" 
            value={fromDate} 
            onChange={(e) => setFromDate(e.target.value)} 
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>Đến ngày</label>
          <input 
            type="date" 
            value={toDate} 
            onChange={(e) => setToDate(e.target.value)} 
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>Nhóm theo</label>
          <select 
            value={groupBy} 
            onChange={(e) => setGroupBy(e.target.value)}
            className="filter-input"
          >
            <option value="day">Ngày</option>
            <option value="month">Tháng</option>
            <option value="year">Năm</option>
          </select>
        </div>

        <button className="btn-filter" onClick={fetchReport} disabled={loading} style={{marginLeft:"150px"}}>
          {loading ? "Đang lọc..." : "Lọc dữ liệu"}
        </button>
      </div>

      {/* --- THẺ TÓM TẮT --- */}
      <div className="summary-cards">
        <div className="card summary-card-blue">
          <h3>Tổng doanh thu (Hoàn thành)</h3>
          <p style={{color:"#1890ff",fontWeight:600}}>{formatCurrency(summary.totalAmount)}</p>
        </div>
        <div className="card summary-card-green">
          <h3>Tổng số đơn (Hoàn thành)</h3>
          <p style={{color:"#00b96b",fontWeight:"600"}}>{summary.totalBookings} <span style={{fontSize: '16px', fontWeight: "600"}}>đơn</span></p>
        </div>
      </div>

      {/* --- BẢNG CHI TIẾT --- */}
      <div className="card table-card">
        <h3>Chi tiết doanh thu</h3>
        {loading ? (
          <p style={{ textAlign: "center", padding: "20px" }}>Đang tải dữ liệu...</p>
        ) : reportData.length === 0 ? (
          <p style={{ textAlign: "center", padding: "20px", color: "#888" }}>
            Không có dữ liệu trong khoảng thời gian này.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="report-table">
              <thead>
                <tr>
                  <th style={{textAlign: "left"}}>Thời gian</th>
                  <th style={{textAlign: "center"}}>Doanh thu hoàn thành</th>
                  <th style={{textAlign: "center"}}>Số đơn hoàn thành</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, index) => (
                  <tr key={index}>
                    <td style={{fontWeight:600}}>{row.recordDate}</td>
                    <td style={{textAlign: "center", color: "#00b96b", fontWeight: "bold"}}>
                      {formatCurrency(row.totalCompletedAmount)}
                    </td>
                    <td style={{textAlign: "center"}}>{row.totalCompletedBookings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportRevenue;