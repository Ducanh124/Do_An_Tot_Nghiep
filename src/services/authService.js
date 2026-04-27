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
  isLoggedIn: () => {
    return !!localStorage.getItem("accessToken");
  },
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },
  getUserById: async (id) => {
    try {
      const response = await axiosClient.get(`/auth/${id}`);
      return response?.data?.data || response?.data || response;
    } catch (error) {
      console.error("Lỗi khi tải thông tin cá nhân:", error);
      throw error;
    }
  },
  updateProfile: async (id, userData) => {
    try {
      const formData = new FormData();
      Object.keys(userData).forEach((key) => {
        if (userData[key] !== null && userData[key] !== "") {
          formData.append(key, userData[key]);
        }
      });

      const response = await axiosClient.put(`/auth/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response;
    } catch (error) {
      console.error("Lỗi cập nhật hồ sơ:", error);
      throw error;
    }
  },
};

export default authService;
