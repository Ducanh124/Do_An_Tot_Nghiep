import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://bookingfamily.onrender.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. KỂM SOÁT ĐẦU RA (Tự động nhét Token vào mọi API)
axiosClient.interceptors.request.use(
  (config) => {
    // Tìm chìa khóa (token) trong bộ nhớ trình duyệt
    const token = localStorage.getItem("accessToken");
    if (token) {
      // Nếu có, tự động đeo thẻ VIP vào cho request
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 3. KIỂM SOÁT ĐẦU VÀO (Tự động bóc tách dữ liệu và bắt lỗi)
axiosClient.interceptors.response.use(
  (response) => {
    // Vì Backend của bạn trả về cấu trúc lồng nhau (data.data), ta bóc luôn 1 lớp ở đây
    if (response.data && response.data.data) {
      return response.data.data;
    }
    // Nếu API nào không lồng data, cứ trả về bình thường
    return response.data;
  },
  (error) => {
    // BẮT LỖI BẢO MẬT: Nếu bị Server từ chối (Lỗi 401 - Hết hạn token hoặc chưa đăng nhập)
    if (error.response && error.response.status === 401) {
      console.warn("Phiên đăng nhập hết hạn. Đang chuyển về trang Login...");

      // Xóa thông tin cũ đi
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      // Đá văng người dùng về trang đăng nhập
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
