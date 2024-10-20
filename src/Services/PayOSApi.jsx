import axiosClient from "./axios/config";

export const viewPaymentResult = async (orderCode) => {
  try {
    const response = await axiosClient.get('/api/Payos', { params: { orderCode } });

    // Log the response data
    console.log("Response from viewPaymentResult:", response.data);

    return response;
  } catch (error) {
    console.error("Error fetching payment result:", error);
    throw error;
  }
};
