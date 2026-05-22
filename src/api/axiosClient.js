import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://bookingfamily.onrender.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Tự động chèn token vào request
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Các biến hnagf đợi trong lúc refresh token để gửi lại api cho be
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// tự động refresh token
axiosClient.interceptors.response.use(
  (response) => {
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 (Hết hạn) và chưa từng thử chạy lại API này
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      // Nếu có 1 API khác đang refresh token rồi, các API này phải vào hàng đợi
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // Đánh dấu là đang bắt đầu quá trình refresh
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Chú ý: Không truyền body, nhưng BẮT BUỘC có withCredentials để tự động gửi Cookie chứa Refresh Token
        const res = await axios.post(
          "https://bookingfamily.onrender.com/api/v1/auth/refresh-token",
          {},
          { withCredentials: true },
        );
        // Bóc tách token mới trả về
        const newAccessToken =
          res.data?.data?.accessToken || res.data?.accessToken;
        if (newAccessToken) {
          // Lưu token mới vào kho
          localStorage.setItem("accessToken", newAccessToken);
          // Cập nhật lại cấu hình cho cái API vừa bị xịt
          axiosClient.defaults.headers.common["Authorization"] =
            `${newAccessToken}`;
          originalRequest.headers["Authorization"] = `${newAccessToken}`;
          // Giải phóng hàng đợi, báo cho các API đang chờ biết là đã có token mới
          processQueue(null, newAccessToken);
          // Tự động chạy lại cái API vừa bị xịt lúc nãy (Người dùng sẽ không hề biết web vừa lỗi)
          return axiosClient(originalRequest);
        }
      } catch (refreshError) {
        // Nếu API Refresh Token cũng báo lỗi (Cookie hết hạn thật sự) -> ĐÁ VĂNG RA LOGIN
        processQueue(refreshError, null);
        console.warn(
          "Phiên đăng nhập hết hạn hoàn toàn. Đang chuyển về trang Login...",
        );

        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
