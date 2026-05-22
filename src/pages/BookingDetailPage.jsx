import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import bookingService from "../services/bookingService";
import staffService from "../services/staffService";
import progressService from "../services/progressService";
import "./BookingDetailPage.css";

const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const [staffInfo, setStaffInfo] = useState(null);
  const [progressList, setProgressList] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const detailData = await bookingService.getBookingById(id);
        setDetails(detailData);

        const staffId = detailData?.staffAssignments?.[0]?.staffId;

        if (staffId) {
          setStaffInfo(detailData.staff);

          try {
            const staffProfile = await staffService.getStaffProfile(staffId);
            if (staffProfile) {
              setStaffInfo((prev) => ({ ...prev, ...staffProfile }));
            }
          } catch (profileError) {
            console.warn("Không lấy được hồ sơ chi tiết", profileError);
          }

          try {
            const progressData = await progressService.getProgress({
              bookingId: id,
              staffId: staffId,
            });
            setProgressList(progressData);
          } catch (progressError) {
            console.error("Lỗi khi tải API ", progressError);
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
      <div className="bd-loading">
        <div className="bd-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );

  if (!details) return <div className="bd-error">Không tìm thấy đơn hàng!</div>;

  return (
    <div className="bd-container">
      <button className="bd-btn-back" onClick={() => navigate("/history")}>
        Quay lại Lịch sử
      </button>

      <h3 className="bd-page-title">
        Chi tiết mã đơn #{String(details.id).substring(0, 8).toUpperCase()}
      </h3>

      <div className="bd-layout-grid">
        {/* CỘT TRÁI: THÔNG TIN NHÂN VIÊN */}
        <div className="bd-card">
          <div className="bd-card-header">
            <i className="bi bi-person-badge"></i> Nhân viên phụ trách
          </div>
          <div className="bd-card-body bd-staff-content">
            {staffInfo ? (
              <>
                <img
                  src={
                    staffInfo.avatar ||
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  }
                  alt="Avatar"
                  className="bd-avatar"
                />
                <h4 className="bd-staff-name">
                  {staffInfo?.staff?.name || "Đang cập nhật..."}
                </h4>
                <p className="bd-staff-phone">
                  <i className="bi bi-telephone-fill"></i>{" "}
                  {staffInfo?.staff?.phone || "Đang cập nhật..."}
                </p>
                <span className="bd-badge bd-badge-success">
                  Nhân viên đã xác minh
                </span>
              </>
            ) : (
              <div className="bd-empty-state">
                <i className="bi bi-person-x"></i>
                <p>Chưa có thông tin nhân viên hoặc hệ thống đang sắp xếp.</p>
              </div>
            )}
          </div>
        </div>

        {/* CỘT PHẢI: TIẾN ĐỘ VÀ BÁO CÁO */}
        <div className="bd-card">
          <div className="bd-card-header">
            <i className="bi bi-card-checklist"></i> Tiến độ công việc
          </div>
          <div className="bd-card-body">
            <div className="bd-note-box">
              <h6>
                <i className="bi bi-chat-left-text"></i> Ghi chú của bạn:
              </h6>
              <p>{details?.note || "Không có ghi chú nào."}</p>
            </div>

            <h6 className="bd-timeline-title">Nhật ký cập nhật:</h6>

            {progressList && progressList.length > 0 ? (
              <div className="bd-timeline">
                {progressList.map((report, index) => {
                  const translateStep = (step) => {
                    switch (step?.toLowerCase()) {
                      case "is_coming":
                        return "Nhân viên đang trên đường đến";
                      case "arrived":
                        return "Nhân viên đã đến nơi làm việc";
                      case "is_working":
                        return "Nhân viên đang tiến hành công việc";
                      case "completed":
                        return "Nhân viên đã hoàn thành công việc";
                      default:
                        return step;
                    }
                  };

                  return (
                    <div key={report.id || index} className="bd-timeline-item">
                      <i className="bi bi-check-circle-fill bd-timeline-icon"></i>
                      <div className="bd-timeline-content">
                        <h6 className="bd-step-name">
                          {translateStep(report.stepName)}
                        </h6>

                        {report.note && (
                          <p className="bd-step-note">Báo cáo: {report.note}</p>
                        )}

                        <span className="bd-step-time">
                          <i className="bi bi-clock"></i>
                          {new Date(report.recordedAt).toLocaleString("vi-VN")}
                        </span>

                        {report.evidenceImageUrl && (
                          <div className="bd-step-evidence">
                            <img
                              src={report.evidenceImageUrl}
                              alt="Bằng chứng công việc"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bd-empty-state-small">
                Chưa có cập nhật tiến độ nào từ nhân viên cho đơn hàng này.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;
