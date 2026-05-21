import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import bookingService from "../services/bookingService";
import staffService from "../services/staffService";

const BookingDetailPage = () => {
  const { id } = useParams(); // Lấy ID đơn hàng từ đường dẫn URL
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const [staffInfo, setStaffInfo] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        // 1. Lấy chi tiết đơn
        const detailData = await bookingService.getBookingById(id);
        setDetails(detailData);
        const staffId = detailData?.staffAssignments?.[0]?.staffId;
        console.log(staffId);
        if (staffId) {
          // HIỂN THỊ TRƯỚC THÔNG TIN CƠ BẢN (Cho người dùng đỡ phải chờ loading lâu)
          setStaffInfo(detailData.staff);

          // 3. GỌI API LẤY HỒ SƠ CHI TIẾT
          try {
            const staffProfile = await staffService.getStaffProfile(staffId);
            // Gộp thông tin cơ bản (Tên, SĐT) với thông tin Hồ sơ (Kinh nghiệm, Đánh giá...)
            if (staffProfile) {
              setStaffInfo((prev) => ({ ...prev, ...staffProfile }));
            }
            console.log(staffProfile);
          } catch (profileError) {
            console.warn(
              "Không lấy được hồ sơ chi tiết, dùng tạm thông tin cơ bản.",
              profileError,
            );
          }
        }
      } catch (error) {
        console.error("Lỗi lấy chi tiết:", error);
        alert("Không thể tải thông tin. Đang quay lại trang lịch sử...");
        navigate("/history");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, navigate]);

  if (loading)
    return (
      <div className="text-center mt-5 py-5">
        <div className="spinner-border text-primary"></div>
        <h5 className="mt-3">Đang tải dữ liệu...</h5>
      </div>
    );
  if (!details)
    return <div className="text-center mt-5">Không tìm thấy đơn hàng!</div>;

  return (
    <div className="container mt-4 mb-5">
      {/* Nút quay lại */}
      <button
        className="btn btn-outline-secondary mb-4"
        onClick={() => navigate("/history")}
      >
        <i className="bi bi-arrow-left me-2"></i>Quay lại Lịch sử
      </button>

      <h3 className="fw-bold text-primary mb-4">
        Chi tiết mã đơn #{String(details.id).substring(0, 8).toUpperCase()}
      </h3>

      <div className="row g-4">
        {/* CỘT TRÁI: THÔNG TIN NHÂN VIÊN */}
        <div className="col-md-5">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-header bg-primary text-white fw-bold">
              <i className="bi bi-person-badge me-2"></i>Nhân viên phụ trách
            </div>
            <div className="card-body text-center p-4">
              {staffInfo ? (
                <>
                  <img
                    src={
                      staffInfo.avatar ||
                      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    }
                    alt="Avatar"
                    className="rounded-circle mb-3 border shadow-sm"
                    style={{
                      width: "130px",
                      height: "130px",
                      objectFit: "cover",
                    }}
                  />
                  <h4 className="fw-bold mb-1">{staffInfo?.staff?.name}</h4>
                  <p className="text-muted fs-5 mb-3">
                    <i className="bi bi-telephone-fill me-2"></i>
                    {staffInfo?.staff?.phone}
                  </p>
                  <span className="badge bg-success px-4 py-2 fs-6 rounded-pill">
                    Nhân viên đã xác minh
                  </span>
                </>
              ) : (
                <div className="text-muted py-5">
                  <i className="bi bi-person-x display-1 text-warning mb-3"></i>
                  <p>Chưa có thông tin nhân viên hoặc hệ thống đang sắp xếp.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: TIẾN ĐỘ VÀ BÁO CÁO */}
        <div className="col-md-7">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-header bg-primary text-white fw-bold">
              <i className="bi bi-card-checklist me-2"></i>Tiến độ công việc
            </div>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3 text-secondary border-bottom pb-2">
                Nhật ký cập nhật:
              </h6>

              {details.reports && details.reports.length > 0 ? (
                <div className="timeline">
                  {details.reports.map((report, index) => (
                    <div
                      key={index}
                      className="d-flex mb-3 align-items-start p-3 bg-white border rounded shadow-sm"
                    >
                      <i className="bi bi-check-circle-fill text-success fs-4 me-3"></i>
                      <div>
                        <h6 className="mb-1 fw-bold">{report.message}</h6>
                        <small className="text-muted">
                          <i className="bi bi-clock me-1"></i>
                          {new Date(report.time).toLocaleString("vi-VN")}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="alert alert-secondary text-center">
                  Chưa có cập nhật tiến độ nào từ nhân viên.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;
