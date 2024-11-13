import axios from "axios";
import {
  ACCOUNT,
  API_URL,
  APPOINTMENT,
  BED,
  BONUS,
  BRANCH,
  CATEGORY,
  CUSTOMER,
  CUSTOMER_GIFT,
  CUSTOMER_POINT,
  DETAIL_SERVICE,
  DISCOUNT,
  EMPLOYEE,
  EVENT,
  GIFT,
  INTERNAL_EXPENSE,
  PRICES,
  ROOM,
  SCHEDULE,
  SERVICE,
  SERVICE_CATEGORY,
  TIME,
  VOUCHER,
  WAGE,
  WORKING_TIME,
} from "../utils/constants";
import { Account, Employee } from "../modules/Manager/types";

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

export const getInfoEmpByAccountId = async (
  token: string | null,
  id: string
) => {
  const response = await axios.get(`${API_URL}/${EMPLOYEE}/${ACCOUNT}/${id}`, {
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

export const getServiceByCategory = async (
  serviceCategoryId: number,
  page: number,
  limit: number
) => {
  const response = await axios.get(
    `${API_URL}/${SERVICE}/${CATEGORY}/${serviceCategoryId}`,
    { params: { page, limit } }
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
  branchId: number,
  page: number,
  limit: number
) => {
  const response = await axios.get(`${API_URL}/${EMPLOYEE}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { branchId, page, limit },
  });
  return response.data;
};

export const getRevenueOfServiceByDate = async (
  // token: string | null,
  branchId: number,
  month: number,
  year: number
) => {
  const response = await axios.get(
    `${API_URL}/${SERVICE}/revenues/${branchId}`,
    {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
      params: { month, year },
    }
  );
  return response.data;
};

export const getSalaryOfEmployeeByMonthYear = async (
  // token: string | null,
  branchId: number,
  month: number,
  year: number
) => {
  const response = await axios.get(
    `${API_URL}/${EMPLOYEE}/salary/${branchId}`,
    {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
      params: { month, year },
    }
  );
  return response.data;
};

export const getExpenseByMonthYear = async (
  // token: string | null,
  branchId: number,
  month: number,
  year: number
) => {
  const response = await axios.get(
    `${API_URL}/${INTERNAL_EXPENSE}/expense/${branchId}`,
    {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
      params: { month, year },
    }
  );
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

export const getPricesByForeignKeyId = async (id: number) => {
  const response = await axios.get(`${API_URL}/${PRICES}/foreign-key/${id}`);
  return response.data;
};

export const cancelBookAppointment = async (id: number) => {
  const response = await axios.delete(`${API_URL}/${APPOINTMENT}/${id}`);
  return response.data;
};

export const getAllServiceDiscount = async (page: number, limit: number) => {
  const response = await axios.get(`${API_URL}/${SERVICE}/${DISCOUNT}`, {
    params: { page, limit },
  });
  return response.data;
};

export const getIdBonus = async () => {
  const response = await axios.get(`${API_URL}/${BONUS}/newest/active`);
  return response.data;
};

export const updateInfoCustomer = async (
  token: string | null,
  formData: FormData,
  id: number
) => {
  const response = await axios.put(`${API_URL}/${CUSTOMER}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getDetailServiceByServiceId = async (serviceId: number) => {
  const response = await axios.get(
    `${API_URL}/${DETAIL_SERVICE}/${SERVICE}/${serviceId}`
  );
  return response.data;
};

export const getOutStandingServices = async () => {
  const response = await axios.get(`${API_URL}/${SERVICE}/out-standings`);
  return response.data;
};

export const getBonusPointByCustomerId = async (id: number) => {
  const response = await axios.get(`${API_URL}/${BONUS}/${CUSTOMER}/${id}`);
  return response.data;
};

export const getAllGift = async (page: number, limit: number) => {
  const response = await axios.get(`${API_URL}/${GIFT}`, {
    params: { page, limit },
  });
  return response.data;
};

export const getAllVoucher = async (page: number, limit: number) => {
  const response = await axios.get(`${API_URL}/${VOUCHER}`, {
    params: { page, limit },
  });
  return response.data;
};

export const giftExchange = async (token: string | null, data: any) => {
  const response = await axios.post(`${API_URL}/${CUSTOMER_GIFT}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getPointByCustomerId = async (
  token: string | null,
  id: number
) => {
  const response = await axios.get(
    `${API_URL}/${CUSTOMER_POINT}/${CUSTOMER}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const updatePointOfCustomer = async (
  token: string | null,
  id: number,
  data: any
) => {
  const response = await axios.put(`${API_URL}/${CUSTOMER_POINT}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getGiftByCustomerId = async (token: string | null, id: number) => {
  const response = await axios.get(
    `${API_URL}/${CUSTOMER_GIFT}/${CUSTOMER}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getGiftById = async (id: number) => {
  const response = await axios.get(`${API_URL}/${GIFT}/${id}`);
  return response.data;
};

export const getVoucherById = async (id: number) => {
  const response = await axios.get(`${API_URL}/${VOUCHER}/${id}`);
  return response.data;
};

//manage
export const getAllAccount = async (
  token: string | null,
  branchId: number,
  page: number,
  limit: number
) => {
  const response = await axios.get(`${API_URL}/${ACCOUNT}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { branchId, page, limit },
  });
  return response.data;
};

export const getAllCustomer = async (
  token: string | null,
  page: number,
  limit: number
) => {
  const response = await axios.get(`${API_URL}/${CUSTOMER}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { page, limit },
  });
  return response.data;
};

export const createAccount = async (account: Account) => {
  const response = await axios.post(`${API_URL}/${ACCOUNT}`, account);
  return response.data;
};

export const createEmployee = async (
  token: string | null,
  formData: FormData
) => {
  const response = await axios.post(`${API_URL}/${EMPLOYEE}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getAllEvent = async (page: number, limit: number) => {
  const response = await axios.get(`${API_URL}/${EVENT}`, {
    params: { page, limit },
  });
  return response.data;
};

export const registerEmployee = async (data: FormData) => {
  const response = await axios.post(`${API_URL}/${ACCOUNT}/register`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const registerCustomer = async (data: FormData) => {
  const response = await axios.post(`${API_URL}/${ACCOUNT}/register`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const createService = async (data: FormData) => {
  const response = await axios.post(`${API_URL}/${SERVICE}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateService = async (id: number, data: FormData) => {
  const response = await axios.put(`${API_URL}/${SERVICE}/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getWagesByRole = async (token: string | null, role: string) => {
  const response = await axios.get(`${API_URL}/${WAGE}/role/${role}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getAllService = async (page: number, limit: number) => {
  const response = await axios.get(`${API_URL}/${SERVICE}`, {
    params: { page, limit },
  });
  return response.data;
};

export const getAllAppointment = async (
  token: string | null,
  page: number,
  limit: number,
  branchId: number
) => {
  const response = await axios.get(`${API_URL}/${APPOINTMENT}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { branchId, page, limit },
  });
  return response.data;
};

export const getAllBed = async (
  token: string | null,
  page: number,
  limit: number
) => {
  const response = await axios.get(`${API_URL}/${BED}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { page, limit },
  });
  return response.data;
};

export const getAllRoom = async (
  token: string | null,
  page: number,
  limit: number
) => {
  const response = await axios.get(`${API_URL}/${ROOM}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { page, limit },
  });
  return response.data;
};

export const createServiceCategory = async (serviceCategory: any) => {
  const response = await axios.post(
    `${API_URL}/${SERVICE_CATEGORY}`,
    serviceCategory
  );
  return response.data;
};

export const updateServiceCategory = async (
  token: string | null,
  serviceCategory: any,
  id: number
) => {
  const response = await axios.put(
    `${API_URL}/${SERVICE_CATEGORY}/${id}`,
    serviceCategory,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const deleteServiceCategory = async (
  token: string | null,
  id: number
) => {
  const response = await axios.delete(`${API_URL}/${SERVICE_CATEGORY}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getAllSchedule = async (
  token: string | null,
  page: number,
  limit: number
) => {
  const response = await axios.get(`${API_URL}/${SCHEDULE}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { page, limit },
  });
  return response.data;
};

export const createSchedule = async (schedule) => {
  const response = await axios.post(`${API_URL}/${SCHEDULE}`, schedule);
  return response.data;
};

export const deleteSchedule = async (token: string | null, id: number) => {
  const response = await axios.delete(`${API_URL}/${SCHEDULE}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
