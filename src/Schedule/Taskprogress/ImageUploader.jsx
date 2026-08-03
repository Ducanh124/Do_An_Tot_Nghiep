import React from 'react';
import { FiX } from 'react-icons/fi';
import './ImageUploader.css';

const ImageUploader = ({ images, onAddImage, onRemoveImage }) => {
  // Hàm xử lý ngay khi người dùng chọn xong file từ thẻ input
const handleFileChange = (e) => {
  const files = Array.from(e.target.files); // Chuyển FileList thành Array
  
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      onAddImage({ 
        file: file, 
        preview: reader.result 
      });
    };
    reader.readAsDataURL(file);
  });
  
  // Reset input để có thể chọn lại cùng 1 file
  e.target.value = null; 
};

  return (
    <div className="image-uploader-container">
      <div className="uploader-header">
        <h3>Ảnh minh chứng</h3>
        <p>Tải lên hình ảnh không gian sau khi hoàn thành</p>
      </div>

      {/*  THẺ INPUT GỐC CỦA TRÌNH DUYỆT */}
      {/* Chỉ hiển thị input nếu số ảnh hiện tại nhỏ hơn 10 */}
      {images.length < 10 && (
        <div className="native-input-wrapper ">
          <input
            id='anh'
            type="file"  multiple
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
  
          />
          <label htmlFor="anh" className="btn-upload-avatar" style={{fontWeight:"100px"}}>Ảnh</label>
        </div>
      )}

      {/* Khu vực hiển thị danh sách ảnh đã chọn */}
      <div className="image-gallery">
        {images.map((imgObj, index) => (
          <div key={index} className="image-preview-box">
            <img src={imgObj.preview} alt={`Minh chứng ${index + 1}`} />
            <button 
              type="button" 
              className="btn-remove-image"
              onClick={() => onRemoveImage(index)}
            >
              <FiX />
            </button>
          </div>
        ))}
      </div>

      <div >
        Tối đa 4 ảnh. Định dạng JPG, PNG.
      </div>
    </div>
  );
};

export default ImageUploader;