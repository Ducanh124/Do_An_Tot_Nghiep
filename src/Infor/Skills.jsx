// src/pages/Profile/Skills.jsx
import React from 'react';
import './Skills.css';

const Skills = ({ 
  skills, 
  experience,
  review,            
  onInputChange   
}) => {
  
  return (
    <div className="profile-section">
      <div className="section-header">
        <h2>Kỹ năng chuyên môn & Kinh nghiệm</h2>
        <p>Vui lòng điền các dịch vụ bạn có thể làm và kinh nghiệm của bạn.</p>
      </div>

      <div className="additional-info-grid" style={{ marginTop: '16px' }}>
        
        {/* Ô NHẬP KỸ NĂNG */}
        <div className="form-group full-width">
          <label>Kỹ năng (Dịch vụ) <span className="required">*</span></label>
          <input 
            type="text"
            name="skills" 
            value={skills || ''} 
            onChange={onInputChange}
            placeholder="Ví dụ: Dọn dẹp nhà cửa, Nấu ăn, Sửa điện nước..."
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>

        {/* SELECT BOX KINH NGHIỆM ĐƯỢC CHUYỂN XUỐNG ĐÂY */}
        <div className="form-group full-width" style={{ marginTop: '16px' }}>
          <label>Kinh nghiệm <span className="required">*</span></label>
          <select 
            name="experience" 
            value={experience || ''} 
            onChange={onInputChange}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="" disabled>-- Chọn số năm kinh nghiệm --</option>
            <option value="< 1 năm">&lt; 1 năm</option>
            <option value="1 năm > 2 năm">1 năm - 2 năm</option>
            <option value="< 2 năm > 5 năm">2 năm - 5 năm</option>
            <option value="> 5 năm">Trên 5 năm</option>
          </select>
        </div>

        {/* Ô NHẬP REVIEW */}
        <div className="form-group full-width" style={{ marginTop: '16px' }}>
          <label>Giới thiệu bản thân <span className="required">*</span></label>
          <textarea 
            name="review" 
            value={review || ''} 
            onChange={onInputChange}
            placeholder="Viết một vài dòng giới thiệu về bản thân, điểm mạnh..."
            rows="4"
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          ></textarea>
        </div>

      </div>
    </div>
  );
};

export default Skills;