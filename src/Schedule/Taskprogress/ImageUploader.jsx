import React, { useRef } from 'react';
import { FiCamera, FiX, FiImage } from 'react-icons/fi';
import './ImageUploader.css';

// Nhận mảng images và hàm onAddImage từ component Cha
// Tôi thêm prop onRemoveImage để xử lý việc người dùng muốn xóa ảnh chụp hỏng
const ImageUploader = ({ images, onAddImage, onRemoveImage }) => {
  const fileInputRef = useRef(null);

  // Kích hoạt thẻ <input type="file"> đang bị ẩn khi bấm vào nút
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Xử lý khi người dùng chọn file hoặc chụp ảnh xong
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Sử dụng FileReader để đọc file ảnh và chuyển thành dạng chuỗi Base64 
      // giúp hiển thị preview (xem trước) ngay lập tức mà chưa cần gửi lên Server
      const reader = new FileReader();
      reader.onloadend = () => {
        onAddImage(reader.result); // Gửi chuỗi ảnh lên cho Component Cha giữ
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="image-uploader-container">
      <div className="uploader-header">
        <h3>Ảnh minh chứng</h3>
        <p>Chụp lại không gian sau khi hoàn thành (Bếp, Sàn nhà, Toilet...)</p>
      </div>

      <div className="image-gallery">
        {/* Render danh sách ảnh đã chụp */}
        {images.map((imgSrc, index) => (
          <div key={index} className="image-preview-box">
            <img src={imgSrc} alt={`Minh chứng ${index + 1}`} />
            <button 
              type="button" 
              className="btn-remove-image"
              onClick={() => onRemoveImage(index)} // Gọi hàm xóa ảnh
            >
              <FiX />
            </button>
          </div>
        ))}

        {/* Nút bấm để thêm ảnh mới (Chỉ hiện nếu chưa quá 4 ảnh để tránh lag) */}
        {images.length < 4 && (
          <button 
            type="button" 
            className="btn-add-image" 
            onClick={handleButtonClick}
          >
            <FiCamera className="camera-icon" />
            <span>Chụp ảnh</span>
          </button>
        )}
      </div>

      {/* Thẻ input ẩn làm nhiệm vụ thực sự */}
      <input
        type="file"
        accept="image/*"
        capture="environment" // Bật camera sau trên Mobile (iOS/Android)
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }} // Ẩn đi để dùng nút custom cho đẹp
      />
      
      <div className="uploader-hint">
        Tối đa 4 ảnh. Định dạng JPG, PNG.
      </div>
    </div>
  );
};

export default ImageUploader;