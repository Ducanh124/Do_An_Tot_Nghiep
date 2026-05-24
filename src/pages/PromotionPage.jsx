import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import discountService from "../services/discountService";
import "./PromotionPage.css";

const PromotionsPage = () => {
  const navigate = useNavigate();
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        setLoading(true);
        const data = await discountService.getAllDiscounts();

        const now = new Date();
        const activeDiscounts = data.filter(
          (d) => d.isActive && new Date(d.endDate) > now,
        );

        setDiscounts(activeDiscounts);
      } catch (error) {
        console.error("Lỗi lấy danh sách mã giảm giá:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDiscounts();
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Đã sao chép mã thành công: ${code}`);
  };

  if (loading)
    return (
      <div className="promo-loading">
        <div className="promo-spinner"></div>
        <p>Đang tải danh sách voucher...</p>
      </div>
    );

  return (
    <div className="promo-container">
      <button className="promo-btn-back" onClick={() => navigate("/")}>
        <i className="bi bi-arrow-left"></i> Quay lại Trang chủ
      </button>

      <h2 className="promo-page-title">Kho Voucher Khuyến Mãi</h2>
      <p className="promo-page-subtitle">
        Nhấp sao chép mã và dán vào ô nhập mã tại trang đặt lịch để áp dụng ưu
        đãi
      </p>

      {discounts.length === 0 ? (
        <div className="promo-empty-state">
          <i className="bi bi-ticket-perforated"></i>
          <p>Hiện tại hệ thống chưa phát hành mã giảm giá nào mới.</p>
        </div>
      ) : (
        <div className="promo-grid-layout">
          {discounts.map((discount) => {
            // Lấy dữ liệu chuẩn xác từ API của bạn
            const type = discount.discountType; // "percentage" hoặc "fixed_amount"
            const value = Number(discount.discountValue || 0); // Ví dụ: 30 hoặc 50000
            const maxAmount = Number(discount.maxDiscountAmount || 0);
            const minAmount = Number(discount.minBookingAmount || 0);

            const isPercentage = type === "percentage";

            // XỬ LÝ KHỐI TO BÊN TRÁI
            // Nếu là %, in thẳng số đó. Nếu là tiền, chia 1000 để in chữ K (vd: 50K)
            const displayValue = isPercentage
              ? value
              : value >= 1000
                ? value / 1000
                : value;

            const displayUnit = isPercentage ? "%" : value >= 1000 ? "K" : "đ";

            return (
              <div className="promo-ticket-card" key={discount.id}>
                {/* PHẦN VÉ TRÁI */}
                <div className="promo-ticket-left">
                  <div className="promo-percentage-box">
                    <h3>
                      {displayValue}
                      <span>{displayUnit}</span>
                    </h3>
                    <small>GIẢM GIÁ</small>
                  </div>
                </div>

                {/* PHẦN VÉ PHẢI */}
                <div className="promo-ticket-right">
                  <div className="promo-ticket-header">
                    <span className="promo-code-label">MÃ:</span>
                    <span className="promo-code-text">{discount.code}</span>
                  </div>

                  <div className="promo-ticket-details">
                    <div className="promo-detail-item">
                      <i className="bi bi-info-circle"></i>
                      <span>
                        Đơn từ:{" "}
                        <strong>{minAmount.toLocaleString("vi-VN")}đ</strong>
                      </span>
                    </div>

                    <div className="promo-detail-item">
                      <i className="bi bi-arrow-down-square"></i>
                      <span>
                        {/* HIỂN THỊ ĐIỀU KIỆN DỰA THEO LOẠI MÃ */}
                        {isPercentage ? (
                          maxAmount > 0 ? (
                            <>
                              Giảm tối đa:{" "}
                              <strong>
                                {maxAmount.toLocaleString("vi-VN")}đ
                              </strong>
                            </>
                          ) : (
                            <>
                              Mức ưu đãi: <strong>{value}%</strong> (Không giới
                              hạn)
                            </>
                          )
                        ) : (
                          <>
                            Giảm trực tiếp:{" "}
                            <strong>{value.toLocaleString("vi-VN")}đ</strong>
                          </>
                        )}
                      </span>
                    </div>

                    <div className="promo-detail-item">
                      <i className="bi bi-calendar3"></i>
                      <span>
                        Hạn dùng:{" "}
                        {new Date(discount.endDate).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>

                  <div className="promo-ticket-actions">
                    <button
                      className="promo-btn-copy"
                      onClick={() => handleCopyCode(discount.code)}
                    >
                      <i className="bi bi-clipboard-plus"></i> Sao chép mã
                    </button>
                    <button
                      className="promo-btn-use"
                      onClick={() => navigate("/")}
                    >
                      Dùng ngay
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PromotionsPage;
