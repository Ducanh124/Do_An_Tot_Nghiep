// import axios from "axios";
// const baseURL = "https://bookingfamily.onrender.com/api/v1";
// export const api = axios.create({
//   baseURL,
//   withCredentials: true,
//   validateStatus: (status) => status >= 200 && status < 300,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// api.interceptors.request.use(async (config) => {
//   const accessToken = "";
//   if (accessToken) {
//     config.headers.Authorization = `Bearer ${accessToken}`;
//   }
//   return config;
// });
import axios from "axios";

const baseURL = "https://bookingfamily.onrender.com/api/v1";
export const api = axios.create({
  baseURL,
  withCredentials: true,
  validateStatus: (status) => status >= 200 && status < 300,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  // Lấy token trực tiếp từ localStorage mỗi khi gọi API
  const accessToken = localStorage.getItem("access_token"); 
  
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
