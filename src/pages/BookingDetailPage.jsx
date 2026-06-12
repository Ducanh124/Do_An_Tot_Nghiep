import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import bookingService from "../services/bookingService";
import staffService from "../services/staffService";
import progressService from "../services/progressService";
import reviewService from "../services/reviewService";
import areaService from "../services/areaService";
import "./BookingDetailPage.css";

const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const [staffInfo, setStaffInfo] = useState(null);
  const [progressList, setProgressList] = useState([]);

  // STATE QUẢN LÝ FORM ĐÁNH GIÁ
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  // STATE QUẢN LÝ FORM SỬA ĐƠN
  const [showEditModal, setShowEditModal] = useState(false);
  const [areas, setAreas] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [editData, setEditData] = useState({
    cityId: "",
    districtId: "",
    address: "",
    scheduledTime: "",
    note: "",
  });

  // Khởi tạo danh sách Tỉnh/Thành
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const areaData = await areaService.getAll();
        setAreas(areaData);
      } catch (error) {
        console.error("Lỗi tải danh sách Thành phố:", error);
      }
    };
    fetchAreas();
  }, []);

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
          console.error("Lỗi khi tải tiến độ", progressError);
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

  useEffect(() => {
    fetchDetails();
  }, [id, navigate]);

  // Bật modal đánh giá nếu URL có action=review
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("action") === "review") {
      setShowReviewModal(true);
    }
  }, [location]);

  const handleSubmitReview = async () => {
    try {
      const staffId = details?.staffAssignments?.[0]?.staffId;
      const payload = {
        bookingId: String(id),
        customerId: String(details?.customerId || ""),
        staffId: String(staffId || ""),
        rating: Number(rating),
        review: reviewComment || "Không có bình luận",
        type: "customer",
      };

      await reviewService.createReview(payload);
      alert("Đánh giá thành công! Cảm ơn bạn.");
      setShowReviewModal(false);
      navigate("/history", { replace: true });
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      alert("Có lỗi xảy ra, vui lòng kiểm tra lại dữ liệu đầu vào!");
    }
  };

  const handleCityChangeEdit = async (e) => {
    const cityId = Number(e.target.value);
    setEditData({ ...editData, cityId: cityId, districtId: "" });

    if (!cityId) {
      setDistricts([]);
      return;
    }

    try {
      const cityData = await areaService.getById(cityId);
      if (cityData && cityData.children) {
        setDistricts(cityData.children);
      } else {
        setDistricts([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách Quận/Huyện:", error);
      setDistricts([]);
    }
  };

  const handleOpenEditModal = async () => {
    const savedAreaId = Number(details?.areaId || 0);
    let foundCityId = "";
    let foundDistricts = [];

    try {
      foundCityId = details?.area?.parentId || details?.area?.cityId || "";

      if (!foundCityId && savedAreaId) {
        const districtInfo = await areaService.getById(savedAreaId);
        foundCityId = districtInfo?.parentId || districtInfo?.cityId || "";
      }

      if (foundCityId) {
        const cityData = await areaService.getById(foundCityId);
        if (cityData && cityData.children) {
          foundDistricts = cityData.children;
        }
      }
    } catch (error) {
      console.error("Lỗi khi tự động tải địa điểm cũ:", error);
    }

    setDistricts(foundDistricts);
    setEditData({
      cityId: foundCityId,
      districtId: savedAreaId,
      address: details?.address || "",
      scheduledTime: details?.scheduledTime
        ? new Date(details.scheduledTime).toISOString().slice(0, 16)
        : "",
      note: details?.note || "",
    });

    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editData.districtId) return alert("Vui lòng chọn Quận/Huyện!");
    if (!editData.address || !editData.scheduledTime)
      return alert("Vui lòng nhập đủ địa chỉ và thời gian!");

    try {
      const serviceIds =
        details?.bookingDetails?.map((item) => Number(item.serviceId)) || [];
      const payload = {
        customerId: String(details?.customerId || ""),
        areaId: Number(editData.districtId),
        address: editData.address,
        scheduledTime: new Date(editData.scheduledTime).toISOString(),
        status: details?.status || "pending",
        note: editData.note,
        serviceId: serviceIds,
      };

      await bookingService.updateBooking(id, payload);
      alert("Cập nhật thông tin đơn hàng thành công!");
      setShowEditModal(false);
      fetchDetails();
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Lỗi khi cập nhật đơn hàng. Vui lòng thử lại!");
    }
  };

  const handleCancelBooking = async () => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn huỷ đơn hàng này không? Hành động này không thể hoàn tác.",
      )
    ) {
      try {
        await bookingService.cancelBooking(id);
        alert("Đã huỷ đơn hàng thành công!");
        navigate("/history", { replace: true });
      } catch (error) {
        console.error("Lỗi huỷ đơn:", error);
        alert(
          "Lỗi khi huỷ đơn. Có thể đơn hàng đã được tiếp nhận và không thể huỷ!",
        );
      }
    }
  };

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
      <h3 className="bd-page-title">
        Chi tiết mã đơn #{String(details.id).substring(0, 8).toUpperCase()}
      </h3>

      <div className="bd-layout-grid">
        {/* CỘT TRÁI: NHÂN VIÊN */}
        <div className="bd-card">
          <div className="bd-card-header">
            <i className="bi bi-person-badge"></i> Nhân viên phụ trách
          </div>
          <div className="bd-card-body bd-staff-content">
            {staffInfo ? (
              <>
                <img
                  src={
                    staffInfo?.staff?.avatarUrl ||
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

        {/* CỘT PHẢI: TIẾN ĐỘ */}
        <div className="bd-card">
          <div className="bd-card-header">
            <i className="bi bi-card-checklist"></i> Tiến độ công việc
          </div>
          <div className="bd-card-body">
            <div className="bd-note-box">
              <h6 className="text-primary fw-bold mb-3">
                <i className="bi bi-box-seam me-2"></i> Dịch vụ đã đặt:
              </h6>
              {details?.bookingDetails && details.bookingDetails.length > 0 ? (
                details.bookingDetails.map((item, index) => (
                  <div key={item.id || index} className="mb-3">
                    <div className="fw-bold fs-6">
                      {item.service?.name || "Tên dịch vụ trống"}
                    </div>
                    <div className="text-muted small">
                      {item.service?.description || "Không có mô tả."}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted">Không có thông tin dịch vụ.</p>
              )}
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

      {/* HEADER NÚT QUAY LẠI, ĐÁNH GIÁ VÀ CÁC THAO TÁC SỬA/HUỶ */}
      <div className="bd-header-actions">
        <button className="bd-action-btn" onClick={() => navigate("/history")}>
          <i className="bi bi-arrow-left"></i> Quay lại Lịch sử
        </button>

        <div style={{ display: "flex", gap: "12px" }}>
          {["assigned", "no_staff_available"].includes(
            details?.status?.toLowerCase(),
          ) && (
            <>
              <button
                className="bd-action-btn"
                style={{ borderColor: "#000", color: "#fff" }}
                onClick={handleOpenEditModal}
              >
                <i className="bi bi-pencil"></i> Sửa đơn
              </button>

              <button
                className="bd-action-btn"
                style={{
                  borderColor: "#000",
                  color: "#fff",
                  backgroundColor: "#dc3545",
                }}
                onClick={handleCancelBooking}
              >
                <i className="bi bi-x-circle"></i> Huỷ đơn
              </button>
            </>
          )}

          {details?.status?.toLowerCase() === "completed" && (
            <button
              className="bd-action-btn"
              onClick={() => setShowReviewModal(true)}
            >
              <i className="bi bi-star"></i> Đánh giá dịch vụ
            </button>
          )}
        </div>
      </div>

      {/* MODAL SỬA ĐƠN HÀNG */}
      {showEditModal && (
        <div className="bd-modal-overlay">
          <div className="bd-modal-content">
            <div className="bd-modal-header">
              <h5 className="bd-modal-title">Sửa thông tin đơn hàng</h5>
              <button
                className="bd-btn-close"
                onClick={() => setShowEditModal(false)}
              >
                &times;
              </button>
            </div>

            <div className="bd-modal-body">
              <div className="row mb-3">
                <div className="col-6 bd-form-group mb-0">
                  <label className="bd-form-label">Tỉnh/Thành phố *</label>
                  <select
                    className="bd-form-input"
                    value={editData.cityId}
                    onChange={handleCityChangeEdit}
                  >
                    <option value="">-- Chọn --</option>
                    {areas.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-6 bd-form-group mb-0">
                  <label className="bd-form-label">Quận/Huyện *</label>
                  <select
                    className="bd-form-input"
                    value={editData.districtId}
                    onChange={(e) =>
                      setEditData({ ...editData, districtId: e.target.value })
                    }
                    disabled={!editData.cityId}
                  >
                    <option value="">-- Chọn --</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bd-form-group">
                <label className="bd-form-label">Địa chỉ thực hiện:</label>
                <input
                  type="text"
                  className="bd-form-input"
                  value={editData.address}
                  onChange={(e) =>
                    setEditData({ ...editData, address: e.target.value })
                  }
                  placeholder="Nhập địa chỉ của bạn..."
                />
              </div>

              <div className="bd-form-group">
                <label className="bd-form-label">Thời gian làm việc:</label>
                <input
                  type="datetime-local"
                  className="bd-form-input"
                  value={editData.scheduledTime}
                  onChange={(e) =>
                    setEditData({ ...editData, scheduledTime: e.target.value })
                  }
                />
              </div>

              <div className="bd-form-group">
                <label className="bd-form-label">Ghi chú cho nhân viên:</label>
                <textarea
                  className="bd-form-input"
                  value={editData.note}
                  onChange={(e) =>
                    setEditData({ ...editData, note: e.target.value })
                  }
                  placeholder="Ví dụ: Mang theo thang chữ A..."
                ></textarea>
              </div>
            </div>

            <div className="bd-modal-footer">
              <button
                className="bd-btn-cancel"
                onClick={() => setShowEditModal(false)}
              >
                Hủy
              </button>
              <button className="bd-btn-submit" onClick={handleSaveEdit}>
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ĐÁNH GIÁ */}
      {showReviewModal && (
        <div className="bd-modal-overlay">
          <div className="bd-modal-content">
            <div className="bd-modal-header">
              <h5 className="bd-modal-title">Đánh giá dịch vụ</h5>
              <button
                className="bd-btn-close"
                onClick={() => setShowReviewModal(false)}
              >
                &times;
              </button>
            </div>

            <div className="bd-modal-body text-center">
              <p className="text-muted mb-4">
                Vui lòng chọn số sao để đánh giá chất lượng dịch vụ của chúng
                tôi
              </p>

              <div className="bd-star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    style={{
                      color: star <= rating ? "#ffc107" : "#e4e5e9",
                      cursor: "pointer",
                      fontSize: "3rem",
                      lineHeight: "1",
                    }}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>

              <textarea
                className="bd-review-textarea"
                placeholder="Chia sẻ trải nghiệm của bạn (không bắt buộc)..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
              ></textarea>
            </div>

            <div className="bd-modal-footer">
              <button
                className="bd-btn-cancel"
                onClick={() => setShowReviewModal(false)}
              >
                Hủy
              </button>
              <button className="bd-btn-submit" onClick={handleSubmitReview}>
                Gửi đánh giá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetailPage;
