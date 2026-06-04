import { api } from "../libs/axios.js"; // Nhớ import đúng đường dẫn axios của bạn

export const getReport = async (filters) => {
  // filters sẽ chứa { from: "YYYY-MM-DD", to: "YYYY-MM-DD", groupBy: "day" }
  const response = await api.get("/report/revenue-by-partner", {
    params: filters,
  });
  return response.data;
};
