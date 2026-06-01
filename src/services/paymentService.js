import axiosClient from "../api/axiosClient";

const paymentService = {
  createPaymentUrl: async (payload) => {
    const response = await axiosClient.post("/payments/create-url", payload);
    return response;
  },
};

export default paymentService;
