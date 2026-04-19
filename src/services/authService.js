import axiosClient from "../api/axiosClient";

const authService = {
  login: async (email, password) => {
    const response = await axiosClient.post("/auth/sign-in", {
      email,
      password,
    });
    console.log(response);
    // Nếu Backend trả về Token, tự động lưu vào trình duyệt
    if (response.accessToken) {
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("user", JSON.stringify(response.user));
    }
    return response;
  },

  register: (userData) => {
    return axiosClient.post("/auth/sign-up", userData);
  },
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  // Hàm lấy riêng ID người dùng
  getCurrentUserId: () => {
    const user = authService.getCurrentUser();
    return user ? user.id : null;
  },

  // Hàm kiểm tra xem đã đăng nhập chưa
  isLoggedIn: () => {
    return !!localStorage.getItem("accessToken");
  },

  // Hàm Đăng xuất
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },
};

export default authService;
