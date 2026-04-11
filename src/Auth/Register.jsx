import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUser, FiMail, FiLock, FiPhone, 
  FiMapPin, FiMap, FiUsers, 
  FiEye, FiEyeOff 
} from 'react-icons/fi';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();

  // Khởi tạo state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    areaId: '',     
    gender: 'Nam',  
    role: 'customer' // Mặc định là khách hàng
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Xử lý thay đổi các ô text/select
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Xử lý gửi Form
  const handleRegister = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Giả lập độ trễ API
    setTimeout(() => {
      setIsLoading(false);
      console.log("Dữ liệu đăng ký gửi đi:", formData);
      alert('Đăng ký tài khoản thành công!');
      navigate('/login'); // Chuyển về trang đăng nhập sau khi thành công
    }, 1200);
  };

  return (
    <div className="register-page-container">
      <div className="register-card">
        
        <div className="register-header">
          <h2>Tạo tài khoản mới</h2>
          <p>Điền thông tin bên dưới để trải nghiệm dịch vụ.</p>
        </div>

        <form onSubmit={handleRegister} className="register-form">
          <div className="form-grid">
            {/* --- CỘT TRÁI --- */}
            <div className="form-column">
              <div className="form-group">
                <label>Họ và tên <span className="required">*</span></label>
                <div className="input-wrapper">
                  <FiUser className="input-icon" />
                  <input type="text" name="name" placeholder="Ví dụ: Nguyễn Văn A" value={formData.name} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="form-group">
                <label>Email <span className="required">*</span></label>
                <div className="input-wrapper">
                  <FiMail className="input-icon" />
                  <input type="email" name="email" placeholder="email@example.com" value={formData.email} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="form-group">
                <label>Mật khẩu <span className="required">*</span></label>
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input type={showPassword ? "text" : "password"} name="password" placeholder="Tối thiểu 6 ký tự" value={formData.password} onChange={handleInputChange} required />
                  <button type="button" className="btn-toggle-password" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Số điện thoại <span className="required">*</span></label>
                <div className="input-wrapper">
                  <FiPhone className="input-icon" />
                  <input type="tel" name="phone" placeholder="0912xxx888" value={formData.phone} onChange={handleInputChange} required />
                </div>
              </div>
            </div>

            {/* --- CỘT PHẢI --- */}
            <div className="form-column">
              <div className="form-group">
                <label>Địa chỉ <span className="required">*</span></label>
                <div className="input-wrapper">
                  <FiMapPin className="input-icon" />
                  <input type="text" name="address" placeholder="Số nhà, tên đường..." value={formData.address} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="form-group">
                <label>Khu vực (Area ID) <span className="required">*</span></label>
                <div className="input-wrapper">
                  <FiMap className="input-icon" />
                  <select name="areaId" value={formData.areaId} onChange={handleInputChange} required>
                    <option value="" disabled>-- Chọn khu vực --</option>
                    <option value="area_01">Quận Hoàn Kiếm (area_01)</option>
                    <option value="area_02">Quận Cầu Giấy (area_02)</option>
                    <option value="area_03">Quận Đống Đa (area_03)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Giới tính <span className="required">*</span></label>
                <div className="input-wrapper">
                  <FiUser className="input-icon" />
                  <select name="gender" value={formData.gender} onChange={handleInputChange} required>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Vai trò hệ thống <span className="required">*</span></label>
                <div className="input-wrapper">
                  <FiUsers className="input-icon" />
                  <select 
                    name="role" 
                    value={formData.role} 
                    onChange={handleInputChange}
                    required
                  >
                    <option value="customer">Khách hàng (Customer)</option>
                    <option value="staff">Nhân viên (Staff)</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="btn-register" disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : 'Hoàn tất Đăng ký'}
          </button>

        </form>

        <div className="register-footer" style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          {/* Đã loại bỏ textDecoration: 'underline' thành 'none' */}
          <p>Đã có tài khoản? <span style={{ color: 'blue', cursor: 'pointer', textDecoration: 'none' }} onClick={() => navigate('/login')}>Đăng nhập ngay</span></p>
        </div>

      </div>
    </div>
  );
};

export default Register;