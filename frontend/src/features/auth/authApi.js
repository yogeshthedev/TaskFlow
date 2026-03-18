import axiosClient from "../../api/axiosClient";

export const loginUser = async (credentials) => {
  const response = await axiosClient.post("/login", credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axiosClient.post("/register", userData);
  return response.data;
};
