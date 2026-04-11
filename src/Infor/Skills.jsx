import React from 'react';
import './Skills.css';

const Skills = ({ 
  selectedSkills, 
  onSkillChange, 
  experience,     // Nhận từ cha
  bio,            // Nhận từ cha
  onInputChange   // Nhận hàm xử lý nhập liệu từ cha
}) => {
  const availableSkills = [
    { id: 'cleaning', label: 'Dọn dẹp nhà cửa' },
    { id: 'cooking', label: 'Nấu ăn' },
    { id: 'childcare', label: 'Chăm sóc trẻ em' },
    { id: 'eldercare', label: 'Chăm sóc người lớn tuổi' },
    { id: 'laundry', label: 'Giặt ủi' },
    { id: 'petcare', label: 'Chăm sóc thú cưng' }
  ];

  return (
    <div className="profile-section">
      <div className="section-header">
        <h2>Kỹ năng chuyên môn</h2>
        <p>Lựa chọn các kỹ năng mà bạn có thể đảm nhận để nhận được các ca làm việc phù hợp.</p>
      </div>

      <div className="skills-grid">
        {availableSkills.map((skill) => {
          const isSelected = selectedSkills.includes(skill.id);
          return (
            <button
              key={skill.id}
              type="button"
              className={`skill-pill ${isSelected ? 'selected' : ''}`}
              onClick={() => onSkillChange(skill.id)}
            >
              {skill.label}
            </button>
          );
        })}
      </div>

      {/* --- PHẦN BỔ SUNG: KINH NGHIỆM VÀ GIỚI THIỆU --- */}
      <div className="additional-info-grid">
        <div className="form-group">
          <label>Kinh nghiệm làm việc <span className="required">*</span></label>
          <select 
            name="experience" 
            value={experience} 
            onChange={onInputChange}
            required
          >
            <option value="" disabled>Chọn số năm kinh nghiệm</option>
            <option value="Chưa có kinh nghiệm">Chưa có kinh nghiệm</option>
            <option value="Dưới 1 năm">Dưới 1 năm</option>
            <option value="1 - 3 năm">1 - 3 năm</option>
            <option value="Trên 3 năm">Trên 3 năm</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label>Giới thiệu bản thân</label>
          <textarea 
            name="bio" 
            value={bio} 
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

// import React from "react";
// import "./Skills.css";

// // Nhận 2 props từ component cha (PersonalInfo) truyền xuống:
// // 1. selectedSkills: Mảng chứa các ID kỹ năng đang được chọn
// // 2. onSkillChange: Hàm xử lý khi click vào 1 kỹ năng
// const Skills = ({ selectedSkills, onSkillChange }) => {
//   // Danh sách kỹ năng có sẵn
//   const availableSkills = [
//     { id: "cleaning", label: "Dọn dẹp nhà cửa" },
//     { id: "cooking", label: "Nấu ăn" },
//     { id: "childcare", label: "Chăm sóc trẻ em" },
//     { id: "eldercare", label: "Chăm sóc người lớn tuổi" },
//     { id: "laundry", label: "Giặt ủi" },
//     { id: "petcare", label: "Chăm sóc thú cưng" },
//   ];

//   return (
//     <div className="profile-section">
//       <div className="section-header">
//         <h2>Kỹ năng chuyên môn</h2>
//         <p>
//           Lựa chọn các kỹ năng mà bạn có thể đảm nhận để nhận được các ca làm
//           việc phù hợp.
//         </p>
//       </div>

//       <div className="skills-grid">
//         {availableSkills.map((skill) => {
//           // Kiểm tra xem kỹ năng có nằm trong mảng được chọn không
//           const isSelected = selectedSkills.includes(skill.id);

//           return (
//             <button
//               key={skill.id}
//               type="button" // Ngăn chặn hành vi submit form mặc định
//               className={`skill-pill ${isSelected ? "selected" : ""}`}
//               onClick={() => onSkillChange(skill.id)} // Gọi hàm từ component cha
//             >
//               {skill.label}
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// };
// export default Skills;

// import React, { useState } from "react";
// import "./Skills.css";
// import { FiSave } from "react-icons/fi";

// const Skills = () => {
//   // Danh sách toàn bộ các kỹ năng có sẵn trong hệ thống
//   const availableSkills = [
//     { id: "cleaning", label: "Dọn dẹp nhà cửa" },
//     { id: "cooking", label: "Nấu ăn" },
//     { id: "childcare", label: "Chăm sóc trẻ em" },
//     { id: "eldercare", label: "Chăm sóc người già" },
//     { id: "laundry", label: "Giặt ủi" },
//     { id: "petcare", label: "Chăm sóc thú cưng" },
//   ];

//   // State lưu trữ các kỹ năng người giúp việc đã chọn (lưu theo id)
//   // Giả sử ban đầu họ đã có sẵn kỹ năng dọn dẹp và nấu ăn
//   const [selectedSkills, setSelectedSkills] = useState(["cleaning", "cooking"]);

//   // Hàm xử lý khi click vào một kỹ năng (Bật/Tắt chọn)
//   const toggleSkill = (skillId) => {
//     if (selectedSkills.includes(skillId)) {
//       // Nếu đã chọn rồi -> Bỏ chọn (Lọc ra khỏi mảng)
//       setSelectedSkills(selectedSkills.filter((id) => id !== skillId));
//     } else {
//       // Nếu chưa chọn -> Thêm vào mảng
//       setSelectedSkills([...selectedSkills, skillId]);
//     }
//   };

//   // Hàm xử lý khi bấm Lưu thay đổi
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Danh sách kỹ năng đã chọn:", selectedSkills);
//     alert("Đã cập nhật kỹ năng chuyên môn thành công!");
//     // Tích hợp API tại đây
//   };

//   // Hàm xử lý Hủy bỏ (Khôi phục lại ban đầu hoặc quay về trang trước)
//   const handleCancel = () => {
//     setSelectedSkills(["cleaning", "cooking"]); // Reset về giá trị ban đầu (Mock)
//   };

//   return (
//     <div className="skills-container">
//       <div className="section-header">
//         <h2>Kỹ năng chuyên môn</h2>
//         <p>
//           Lựa chọn các kỹ năng mà bạn có thể đảm nhận để nhận được các ca làm
//           việc phù hợp.
//         </p>
//       </div>

//       <form onSubmit={handleSubmit}>
//         <div className="skills-grid">
//           {availableSkills.map((skill) => {
//             // Kiểm tra xem kỹ năng này có đang được chọn hay không
//             const isSelected = selectedSkills.includes(skill.id);

//             return (
//               <button
//                 key={skill.id}
//                 type="button" // Type button để không bị submit form khi click
//                 className={`skill-pill ${isSelected ? "selected" : ""}`}
//                 onClick={() => toggleSkill(skill.id)}
//               >
//                 {skill.label}
//               </button>
//             );
//           })}
//         </div>

//         <div className="form-actions">
//           {/* <button type="button" className="btn-cancel" onClick={handleCancel}>
//             Hủy bỏ
//           </button> */}
//           <button type="submit" className="btn-save">
//             <FiSave /> Lưu thay đổi
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Skills;
