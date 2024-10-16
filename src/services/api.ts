import axios from "axios";
import { ACCOUNT, API_URL, BRANCH, CATEGORY, CUSTOMER, EMPLOYEE, SERVICE, SERVICE_CATEGORY, TIME, WORKING_TIME } from "../utils/constants";


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

export const getInfoByAccountId = async (token: string | null, id: string) => {
  const response = await axios.get(`${API_URL}/${CUSTOMER}/${ACCOUNT}/${id}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  );
  return response.data;
};

export const getAllBranch = async (token: string | null, page: number, limit: number) => {
  const response = await axios.get(`${API_URL}/${BRANCH}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { page, limit },
  }
  );
  return response.data;
};

export const getAllServiceCategory = async (token: string | null, page: number, limit: number) => {
  const response = await axios.get(`${API_URL}/${SERVICE_CATEGORY}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { page, limit },
  }
  );
  return response.data;
};

export const getServiceByCategory = async (token: string | null, serviceCategory: number) => {
  const response = await axios.get(`${API_URL}/${SERVICE}/${CATEGORY}/${serviceCategory}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  );
  return response.data;
};

export const getWorkingTimeByServiceIdAndDate = async (token: string | null, serviceId: number | null, date: string | null, branchId: number | null) => {
  const response = await axios.get(`${API_URL}/${WORKING_TIME}/${SERVICE}/${TIME}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { serviceId, date, branchId },
  }
  );
  return response.data;
};

export const getAllEmployee = async (token: string | null, page: number, limit: number) => {
  const response = await axios.get(`${API_URL}/${EMPLOYEE}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { page, limit },
  }
  );
  return response.data;
};

export const getServiceById = async (token: string | null, id: number) => {
  const response = await axios.get(`${API_URL}/${SERVICE}/${id}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  );
  return response.data;
};