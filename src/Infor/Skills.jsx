import React from 'react';
import { FiCheck } from 'react-icons/fi';
import './Skills.css';

const Skills = ({ 
  availableSkills = [], // 👉 BƯỚC 1: Nhận danh sách dịch vụ từ API do Cha truyền xuống
  selectedSkills = [], 
  onSkillChange, 
  bio,            
  onInputChange   
}) => {
  
  // 👉 BƯỚC 2: Đã xóa mảng availableSkills fix cứng ở đây!

  return (
    <div className="profile-section">
      <div className="section-header">
        <h2>Kỹ năng chuyên môn</h2>
        <p>Lựa chọn các dịch vụ mà bạn có thể đảm nhận để nhận được các ca làm việc phù hợp.</p>
      </div>

      <div className="skills-grid">
        {/* Kiểm tra xem API đã trả về dữ liệu chưa */}
        {availableSkills.length > 0 ? (
          availableSkills.map((skill) => {
            const isSelected = selectedSkills.includes(skill.id);
            return (
              <button
                key={skill.id}
                type="button"
                className={`skill-pill ${isSelected ? 'selected' : ''}`}
                onClick={() => onSkillChange(skill.id)}
              >
                {/* Thêm dấu tick nhỏ bên cạnh chữ khi chọn */}
                {isSelected && <FiCheck className="check-icon" style={{ marginRight: '6px' }} />}
                <span>{skill.label}</span>
              </button>
            );
          })
        ) : (
          <p style={{ color: '#888', fontSize: '14px', fontStyle: 'italic' }}>
            Đang tải danh sách dịch vụ từ hệ thống...
          </p>
        )}
      </div>

      {/* --- PHẦN GIỚI THIỆU BẢN THÂN --- */}
      <div className="additional-info-grid" style={{ marginTop: '24px' }}>
        <div className="form-group full-width">
          <label>Giới thiệu bản thân</label>
          <textarea 
            name="bio" 
            value={bio || ''} 
            onChange={onInputChange}
            placeholder="Viết một vài dòng giới thiệu về bản thân, điểm mạnh, hoặc mong muốn của bạn để khách hàng hiểu rõ hơn về bạn..."
            rows="4"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default Skills;