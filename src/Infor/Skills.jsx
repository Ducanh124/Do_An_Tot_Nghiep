// src/pages/Profile/Skills.jsx
import React from 'react';
const Skills = ({ 
  skills, 
  experience,
  review,            
  onInputChange   
}) => {
  
  return (
    <div >
      <div className="section-header">
        <h2>Kỹ năng chuyên môn & Kinh nghiệm</h2>
      </div>

        
        {/* Ô NHẬP KỸ NĂNG */}
        <div className="form-group input">
          <label>Kỹ năng  </label>
          <input 
            type="text"
            name="skills" 
            value={skills || ''} 
            onChange={onInputChange}
            required
 
          />
        </div>

        {/* SELECT BOX KINH NGHIỆM ĐƯỢC CHUYỂN XUỐNG ĐÂY */}
        <div className="form-group select" >
          <label>Kinh nghiệm </label>
          <select 
            name="experience" 
            value={experience || ''} 
            onChange={onInputChange}
            required
          >
            <option value="< 1 năm">&lt; 1 năm</option>
            <option value="1 năm > 2 năm">1 năm - 2 năm</option>
            <option value="< 2 năm > 5 năm">2 năm - 5 năm</option>
            <option value="> 5 năm">Trên 5 năm</option>
          </select>
        </div>

        {/* Ô NHẬP REVIEW */}
        <div className="form-group textarea">
          <label>Giới thiệu bản thân </label>
          <textarea 
            name="review" 
            value={review || ''} 
            onChange={onInputChange}
            rows="4"
            required
          ></textarea>
        </div>

      </div>

  );
};

export default Skills;