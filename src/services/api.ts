import axios from "axios";
import { ACCOUNT, API_URL } from "../utils/constants";


export const login = async (phone: string, password: string) => {
    const response = await axios.post(`${API_URL}/${ACCOUNT}/login`, {
      phone,
      password,
    });
    return response;
};

export const checkAccountByPhone = async (phone: string) => {
  const response = await axios.get(`${API_URL}/${ACCOUNT}/phone/${phone}`);
  return response.data;
};

export const register = async (data: { account: any; customer: any }) => {
  const response = await axios.post(`${API_URL}/${ACCOUNT}/register`, data);
  return response.data;
};