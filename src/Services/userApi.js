  import axiosClient from "./axios/config";

  export const getAllAccount = async (pageIndex = 0, pageSize = 0, search = '') => {
    try {
      const response = await axiosClient.get(`/api/User?pageIndex=${pageIndex}&pageSize=${pageSize}&searchQuery=${search}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('An error occurred');
    }
  };

  export const updateAccountAdmin = async (id, fullname, phoneNumber) => {
    try {
      const response = await axiosClient.put(`/api/User/admin/update?id=${id}`, { fullname, phoneNumber });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('An error occurred');
    }
  };

  export const login = async (username, password) => {
  try {
    const response = await axiosClient.post('/api/User/login', { username, password });
    
    const { token, role } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('An error occurred');
  }
};
