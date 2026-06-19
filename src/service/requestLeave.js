import { api } from "../libs/axios.js";
//  API TẠO ĐƠN XIN NGHỈ PHÉP (Dạng hàm độc lập)
export const request = async (data) => {
  const response = await api.post("/request-leave", data);
  return response.data;
};

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
