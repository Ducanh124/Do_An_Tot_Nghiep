import React from 'react';
import { FiX } from 'react-icons/fi';
import './ImageUploader.css';

const ImageUploader = ({ images, onAddImage, onRemoveImage }) => {
  // Hàm xử lý ngay khi người dùng chọn xong file từ thẻ input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
//  Đóng gói cả File gốc và Chuỗi Base64 (preview) gửi lên cho Cha
        onAddImage({ 
          file: file, 
          preview: reader.result 
        });      };
      reader.readAsDataURL(file);
    }
    
    // Reset lại ô input để người dùng có thể chọn lại chính bức ảnh đó nếu lỡ tay xóa
    e.target.value = null; 
  };

  return (
    <div className="image-uploader-container">
      <div className="uploader-header">
        <h3>Ảnh minh chứng</h3>
        <p>Tải lên hình ảnh không gian sau khi hoàn thành</p>
      </div>

      {/*  THẺ INPUT GỐC CỦA TRÌNH DUYỆT */}
      {/* Chỉ hiển thị input nếu số ảnh hiện tại nhỏ hơn 4 */}
      {images.length < 4 && (
        <div className="native-input-wrapper ">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="native-file-input "
            // k thay tên đc vì nó là mặc định
          />
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