import axiosClient from "./axios/config";

export const getAllSub = async (pageIndex = 0, pageSize = 0, search = '') => {
  try {
    const response = await axiosClient.get(`/api/Subscription?pageIndex=${pageIndex}&pageSize=${pageSize}&searchQuery=${search}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('An error occurred');
  }
};

export const toggleSubscriptionStatus = async (subscriptionId) => {
  try {
    const response = await axiosClient.patch(`/api/Subscription/${subscriptionId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('An error occurred');
  }
};

export const updateSubscription = async (subscriptionId, requestData) => {
  try {
    const response = await axiosClient.put(`/api/Subscription/update/${subscriptionId}`, requestData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('An error occurred');
  }
};
