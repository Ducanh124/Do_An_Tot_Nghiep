// src/service/scheduleService.js
import { api } from "../libs/axios.js";

export const scheduleService = {
  getStaffJobs: async (staffId) => {
    const response = await api.get(`/staff/${staffId}/jobs`);
    return response.data;
  },

  getBookingDetails: async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },

  updateAssigment: async (status, id) => {
    const response = await api.patch(`/staff/${id}/update-job`, { status });
    return response.data;
  },

  // 👉 BỔ SUNG API GỬI BÁO CÁO TIẾN ĐỘ
  postProgress: async (data) => {
    const response = await api.post("/progress", data);
    return response.data;
  }
};