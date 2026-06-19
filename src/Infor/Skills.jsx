// src/pages/Profile/Skills.jsx
import React from 'react';

const Skills = ({ 
  skills, 
  experience,
  review,            
  onInputChange,
  formErrors = {} 
}) => {
  
  return (
    <div className='additional-info-grid'>
      <div className="section-header">
        <h2>Kỹ năng chuyên môn & Kinh nghiệm</h2>
      </div>
        
   
        <div className="form-group ">
          <label>Kỹ năng</label>
          <input 
            type="text"
            name="skills" 
            value={skills || ''} 
            onChange={onInputChange}
            required
            style={{ borderColor: formErrors.skills ? "#ff4d4f" : "" }} // Đổi màu viền nếu có lỗi
          />
   
          {formErrors.skills && (
            <span style={{ color: '#ff4d4f', fontSize: '13px', marginTop: '4px', display: 'block' }}>
              {formErrors.skills}
            </span>
          )}
        </div>

  
        <div className="form-group ">
          <label>Kinh nghiệm</label>
          <select 
            name="experience" 
            value={experience || ''} 
            onChange={onInputChange}
            required
            style={{ borderColor: formErrors.experience ? "#ff4d4f" : "" }}
          >

            <option value="" disabled>-- Chọn khoảng kinh nghiệm --</option>
            <option value="< 1 năm">&lt; 1 năm</option>
            <option value="1 năm > 2 năm">1 năm - 2 năm</option>
            <option value="< 2 năm > 5 năm">2 năm - 5 năm</option>
            <option value="> 5 năm">Trên 5 năm</option>
          </select>
          {formErrors.experience && (
            <span style={{ color: '#ff4d4f', fontSize: '13px', marginTop: '4px', display: 'block' }}>
              {formErrors.experience}
            </span>
          )}
        </div>

 
        <div className="form-group ">
          <label>Giới thiệu bản thân</label>
          <textarea 
            name="review" 
            value={review || ''} 
            onChange={onInputChange}
            rows="4"
            required
            style={{ borderColor: formErrors.review ? "#ff4d4f" : "" }}
          ></textarea>
          {formErrors.review && (
            <span style={{ color: '#ff4d4f', fontSize: '13px', marginTop: '4px', display: 'block' }}>
              {formErrors.review}
            </span>
          )}
        </div>

      </div>
  );
};

export default Skills;