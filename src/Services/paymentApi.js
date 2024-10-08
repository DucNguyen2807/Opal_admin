import axiosClient from "./axios/config";


export const getAllPayment = async (pageIndex = 0, pageSize = 0, search = '') => {
  try {
    const response = await axiosClient.get(`/api/Payment?pageIndex=${pageIndex}&pageSize=${pageSize}&searchQuery=${search}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('An error occurred');
  }
};
