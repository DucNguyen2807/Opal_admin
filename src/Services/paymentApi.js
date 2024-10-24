import axiosClient from "./axios/config";


export const getAllPayment = async (pageIndex = 0, pageSize = 0, search = '') => {
  try {
    const response = await axiosClient.get(`/api/Payment`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('An error occurred');
  }
};

export const getAllPaymentOrderDate = async (pageIndex = 0, pageSize = 0, search = '') => {
  try {
    const response = await axiosClient.get(`/api/Payment/order-date?pageIndex=${pageIndex}&pageSize=${pageSize}&searchQuery=${search}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('An error occurred');
  }
};

export const UpdatePaymentSubscriptionStatus = async (paymentId, status) => {
    try {
        const paymentUpdateReqModel = {
            paymentId,
            status
        }
        const response = await apiClient.put("/api/subscription/subscribe", paymentUpdateReqModel, {}, true )

        return response.data;
    }catch(error) {
        throw error
    }
}