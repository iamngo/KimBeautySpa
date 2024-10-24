import axios from "axios";
import {
  ACCOUNT,
  API_URL,
  APPOINTMENT,
  BED,
  BRANCH,
  CATEGORY,
  CUSTOMER,
  EMPLOYEE,
  PRICES,
  SERVICE,
  SERVICE_CATEGORY,
  TIME,
  WORKING_TIME,
} from "../utils/constants";

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
  const response = await axios.get(`${API_URL}/${CUSTOMER}/${ACCOUNT}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getAllBranch = async (
  token: string | null,
  page: number,
  limit: number
) => {
  const response = await axios.get(`${API_URL}/${BRANCH}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { page, limit },
  });
  return response.data;
};

export const getBranchById = async (token: string | null, id: number) => {
  const response = await axios.get(`${API_URL}/${BRANCH}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getAllServiceCategory = async (page: number, limit: number) => {
  const response = await axios.get(`${API_URL}/${SERVICE_CATEGORY}`, {
    params: { page, limit },
  });
  return response.data;
};

export const getServiceByCategory = async (serviceCategory: number) => {
  const response = await axios.get(
    `${API_URL}/${SERVICE}/${CATEGORY}/${serviceCategory}`,
    {}
  );
  return response.data;
};

export const getWorkingTimeByServiceIdAndDate = async (
  token: string | null,
  serviceId: number | null,
  date: string | null,
  branchId: number | null
) => {
  const response = await axios.get(
    `${API_URL}/${WORKING_TIME}/${SERVICE}/${TIME}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { serviceId, date, branchId },
    }
  );
  return response.data;
};

export const getAllEmployee = async (
  token: string | null,
  page: number,
  limit: number
) => {
  const response = await axios.get(`${API_URL}/${EMPLOYEE}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { page, limit },
  });
  return response.data;
};

export const getEmployeeById = async (token: string | null, id: number) => {
  const response = await axios.get(`${API_URL}/${EMPLOYEE}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getServiceById = async (id: number) => {
  const response = await axios.get(`${API_URL}/${SERVICE}/${id}`, {});
  return response.data;
};

export const getBedByServiceIdAndDate = async (
  serviceId: number | null,
  date: string | null,
  branchId: number | null,
  roomId: number | null
) => {
  const response = await axios.get(`${API_URL}/${BED}/${SERVICE}/beds`, {
    params: { branchId, serviceId, date, roomId },
  });
  return response.data;
};

export const getCategoryServiceById = async (
  categoryServiceId: number | null
) => {
  const response = await axios.get(
    `${API_URL}/${SERVICE}-${CATEGORY}/${categoryServiceId}`
  );
  return response.data;
};

export const registerAppointment = async (data: any) => {
  const response = await axios.post(`${API_URL}/${APPOINTMENT}`, data);
  return response.data;
};

export const getAppointmentByCustomerId = async (
  token: string | null,
  id: number
) => {
  const response = await axios.get(
    `${API_URL}/${APPOINTMENT}/${CUSTOMER}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getPricesByForeignKeyId = async (
  id: number
) => {
  const response = await axios.get(`${API_URL}/${PRICES}/foreign-key/${id}`);
  return response.data;
};

export const cancelBookAppointment = async (id: number) => {
  const response = await axios.delete(`${API_URL}/${APPOINTMENT}/${id}`);
  return response.data;
};
