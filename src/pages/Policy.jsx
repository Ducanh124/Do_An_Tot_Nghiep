// src/pages/CommitmentPolicy.jsx
import React from "react";
import "./Policy.css";

const Policy = () => {
  const COMPANY_NAME = "Booking Family";

  return (
    <div className="commitment-wrapper py-5">
      <div className="container">
        <div className="commitment-container">
          <h1 className="main-title">Cam Kết Của Chúng Tôi</h1>

          {/* PHẦN I */}
          <h2 className="section-title">I. CHÍNH SÁCH BẢO HÀNH</h2>
          <p className="policy-paragraph">
            <span className="brand-name">{COMPANY_NAME}</span> cam kết tất cả
            các đơn hàng giúp việc theo giờ được cung cấp bởi{" "}
            <span className="brand-name">{COMPANY_NAME}</span> là đơn hàng được
            đảm bảo về chất lượng.
          </p>

          <h3 className="sub-section-title">
            1. Chính sách bảo hành chất lượng dịch vụ
          </h3>
          <p className="policy-paragraph">
            Khi Quý khách không hài lòng về chất lượng ca làm việc của nhân viên
            giúp việc, <span className="brand-name">{COMPANY_NAME}</span> sẽ bảo
            hành toàn bộ ca làm.{" "}
            <span className="brand-name">{COMPANY_NAME}</span> sẵn sàng làm sạch
            lại các khu vực Quý khách chưa hài lòng và không tính thêm phí.
          </p>
          <p className="policy-paragraph">
            <span className="condition-text">Điều kiện bảo hành:</span> Khách
            hàng phản hồi dịch vụ trong vòng 24h, kể từ thời điểm kết thúc ca
            làm và đánh giá 1 sao hoặc 2 sao về ca làm đó trên ứng dụng{" "}
            {COMPANY_NAME}.
          </p>

          <h3 className="sub-section-title">
            2. Chính sách hỗ trợ đền bù tổn thất tài sản
          </h3>
          <p className="policy-paragraph">
            <span className="condition-text">
              Về tổn thất do hư hỏng và đổ vỡ:
            </span>{" "}
            Trong trường hợp nhân viên thực hiện dịch vụ của{" "}
            <span className="brand-name">{COMPANY_NAME}</span> làm hư hỏng hoặc
            đổ vỡ tài sản của Khách hàng,{" "}
            <span className="brand-name">{COMPANY_NAME}</span> sẽ xác định trách
            nhiệm đền bù theo các thông tin được xác thực.
          </p>
          <p className="policy-paragraph">
            <span className="condition-text">
              Về tổn thất do mất trộm, mất cắp:
            </span>{" "}
            Trường hợp có xác nhận bằng văn bản của cơ quan chức năng về việc
            nhân viên thực hiện dịch vụ lấy trộm đồ của Khách hàng. Nhân viên
            giúp việc có trách nhiệm đền bù tổn thất theo Quy định của Pháp
            luật. <span className="brand-name">{COMPANY_NAME}</span> cam kết
            cung cấp đầy đủ thông tin và các trách nhiệm liên quan theo yêu cầu
            của Cơ quan chức năng.
          </p>

          {/* PHẦN II */}
          <h2 className="section-title">
            II. CHÍNH SÁCH ĐỔI NHÂN VIÊN VÀ HOÀN TIỀN
          </h2>

          <h3 className="sub-section-title">
            1. Hỗ trợ đổi nhân viên giúp việc khi chất lượng dịch vụ không đáp
            ứng
          </h3>
          <p className="policy-paragraph">
            Khách hàng được đổi Nhân viên trong gói Giúp việc Định kỳ khi không
            hài lòng với chất lượng của Nhân viên, dù đã thực hiện bảo hành.
          </p>
          <p className="policy-paragraph mb-2">
            <span className="condition-text">Điều kiện đổi nhân viên:</span>
          </p>
          <ul className="custom-list">
            <li>
              Khách hàng phản hồi dịch vụ và đánh giá 1 sao hoặc 2 sao trên ứng
              dụng {COMPANY_NAME} sau khi kết thúc ca làm của nhân viên muốn
              đổi.
            </li>
            <li>
              Thời gian tuyển và đào tạo nhân viên thay thế để đổi Nhân viên từ
              7-10 ngày. Trong thời gian này,{" "}
              <span className="brand-name">{COMPANY_NAME}</span> sẽ sắp xếp Nhân
              viên lẻ đến làm việc tại nhà Khách hàng.
            </li>
          </ul>

          <h3 className="sub-section-title">2. Chính sách hoàn tiền</h3>
          <p className="policy-paragraph">
            Tất cả các đơn hàng của{" "}
            <span className="brand-name">{COMPANY_NAME}</span> mặc định là đơn
            hàng không hoàn tiền.
          </p>
          <p className="policy-paragraph mb-2">
            Đơn hàng được hoàn lại toàn bộ hoặc một phần số tiền đã thanh toán
            trong các trường hợp:
          </p>
          <ul className="custom-list">
            <li>
              <span className="brand-name">{COMPANY_NAME}</span> không thể cung
              cấp nhân viên theo thời gian Quý khách yêu cầu (nằm trong khung
              giờ quy định của {COMPANY_NAME}: 8h-12h; 13h-17h; 17h-21h hàng
              ngày).
            </li>
          </ul>
          <p className="policy-paragraph">
            Khách hàng sử dụng dịch vụ bị đổi Nhân viên cố định quá số lần quy
            định theo cam kết chất lượng của {COMPANY_NAME} (quá 02 lần với hợp
            đồng 6 tháng, quá 03 lần với hợp đồng 12 tháng).
          </p>

          <p className="policy-paragraph mb-2 mt-4">
            <span className="condition-text">Thời gian hoàn tiền:</span>
          </p>
          <p className="policy-paragraph mb-2">
            Thời gian hoàn tiền phụ thuộc vào phương thức thanh toán của Khách
            hàng (tính từ thời điểm{" "}
            <span className="brand-name">{COMPANY_NAME}</span> xác nhận đơn hàng
            đủ điều kiện hoàn tiền)
          </p>
          <ul className="custom-list">
            <li>
              <strong>Chuyển khoản:</strong> 1-3 ngày làm việc
            </li>
            <li>
              <strong>Thanh toán online qua ứng dụng ví điện tử MoMo:</strong>{" "}
              3-5 ngày làm việc
            </li>
            <li>
              <strong>Thanh toán online qua Viettel Pay & VNPay:</strong> 9-12
              ngày làm việc
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Policy;
