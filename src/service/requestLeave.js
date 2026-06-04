import { api } from "../libs/axios.js";
//  API TẠO ĐƠN XIN NGHỈ PHÉP (Dạng hàm độc lập)
export const request = async (data) => {
  const response = await api.post("/request-leave", data);
  return response.data;
};
// API LẤY DANH SÁCH ĐƠN NGHỈ PHÉP THEO ID NHÂN VIÊN
// export const getLeaveRequests = async (staffId) => {
//   const response = await api.get(`/request-leave/${staffId}`);
//   return response.data;
// };
// Thay vì nối chuỗi bằng dấu /
// export const getLeaveRequests = async (staffId) => {
//   // Sửa lại thành truyền params (Axios sẽ tự động tạo dấu ?staffId=...)
//   const response = await api.get("/request-leave", {
//      params: {
//          staffId } });
//   return response.data;
// };
// ĐÃ SỬA API LẤY DANH SÁCH: Dùng "params" để thư viện Axios tự động tạo dấu ? và &
//  THÊM page và limit vào tham số (mặc định page=1, limit=8)
export const getLeaveRequests = async (staffId, page = 1, limit = 8) => {
  const response = await api.get("/request-leave", {
    params: {
      staffId: staffId,
      page: page, // Nhận biến từ ngoài truyền vào
      limit: limit, // Nhận biến từ ngoài truyền vào
    },
  });
  return response.data;
};
