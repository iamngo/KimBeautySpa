import { SCHEDULE } from "./../utils/constants";
import axios from "axios";
import {
  ACCOUNT,
  API_URL,
  APPOINTMENT,
  APPOINTMENT_DETAIL,
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
  PRODUCT,
  ROOM,
  SCHEDULE,
  SERVICE,
  SERVICE_CATEGORY,
  TIME,
  VOUCHER,
  WAGE,
  WORKING_TIME,
} from "../utils/constants";
import { Account } from "../modules/Manager/types";

export const login = async (phone: string, password: string) => {
  if (!phone || !password) return;
  const response = await axios.post(`${API_URL}/${ACCOUNT}/login`, {
    phone,
    password,
  });
  return response;
};

export const checkAccountByPhone = async (phone: string) => {
  if (!phone) return;
  const response = await axios.get(`${API_URL}/${ACCOUNT}/phone/${phone}`);
  return response?.data;
};

export const register = async (data: { account: any; customer: any }) => {
  if (!data) return;
  const response = await axios.post(`${API_URL}/${ACCOUNT}/register`, data);
  return response?.data;
};

export const getInfoByAccountId = async (token: string | null, id: number) => {
  if (!token || !id) {
    return;
  }
  const response = await axios.get(`${API_URL}/${CUSTOMER}/${ACCOUNT}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data;
};

export const getInfoEmpByAccountId = async (
  token: string | null,
  id: string
) => {
  if (!token || !id) return;
  const response = await axios.get(`${API_URL}/${EMPLOYEE}/${ACCOUNT}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data;
};

export const getAllBranch = async (page: number, limit: number) => {
  if (!page || !limit) return;
  const response = await axios.get(`${API_URL}/${BRANCH}`, {
    params: { page, limit },
  });
  return response?.data;
};

export const getBranchById = async (token: string | null, id: number) => {
  if (!token || !id) return;
  const response = await axios.get(`${API_URL}/${BRANCH}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data;
};

export const getAllServiceCategory = async (page: number, limit: number) => {
  if (!page || !limit) return;
  const response = await axios.get(`${API_URL}/${SERVICE_CATEGORY}`, {
    params: { page, limit },
  });
  return response?.data;
};

export const getServiceByCategory = async (
  serviceCategoryId: number,
  page: number,
  limit: number
) => {
  if (!serviceCategoryId || !page || !limit) return;
  const response = await axios.get(
    `${API_URL}/${SERVICE}/${CATEGORY}/${serviceCategoryId}`,
    { params: { page, limit } }
  );
  return response?.data;
};

export const getWorkingTimeByServiceIdAndDate = async (
  roomId: number | null,
  date: string | null,
  branchId: number | null
) => {
  if (!roomId || !date || !branchId) return;
  const response = await axios.get(
    `${API_URL}/${WORKING_TIME}/${SERVICE}/${TIME}`,
    {
      params: { roomId, date, branchId },
    }
  );
  return response?.data;
};

export const getEmployeeByDateTime = async (
  branchId: number,
  dateTime: string
) => {
  if (!branchId || dateTime.includes("null")) return;
  const response = await axios.get(`${API_URL}/${EMPLOYEE}/appointments`, {
    params: { branchId, dateTime },
  });
  console.log(response.data);

  return response?.data;
};

export const getAllEmployee = async (
  token: string,
  branchId: number,
  page: number,
  limit: number
) => {
  if (!branchId) return;
  const response = await axios.get(`${API_URL}/${EMPLOYEE}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { branchId, page, limit },
  });
  return response?.data;
};

export const getAppointmentDetailById = async (
  token: string | null,
  appointmentId: number
) => {
  if (!token || !appointmentId) return;
  const response = await axios.get(`${API_URL}/${APPOINTMENT_DETAIL}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { appointmentId },
  });
  return response?.data;
};

export const getRevenueOfServiceByDate = async (
  token: string | null,
  branchId: number,
  month: number,
  year: number
) => {
  if (!branchId || !month || !year) return;
  const response = await axios.get(
    `${API_URL}/${SERVICE}/revenues/${branchId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { month, year },
    }
  );
  return response?.data;
};

export const getSalaryOfEmployeeByMonthYear = async (
  token: string | null,
  branchId: number,
  month: number,
  year: number
) => {
  if (!branchId || !month || !year) return;
  const response = await axios.get(
    `${API_URL}/${EMPLOYEE}/salary/${branchId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { month, year },
    }
  );
  return response?.data;
};

export const getExpenseByMonthYear = async (
  // token: string | null,
  branchId: number,
  month: number,
  year: number
) => {
  if (!branchId || !month || !year) return;
  const response = await axios.get(
    `${API_URL}/${INTERNAL_EXPENSE}/expense/${branchId}`,
    {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
      params: { month, year },
    }
  );
  return response?.data;
};

export const getEmployeeById = async (token: string | null, id: number) => {
  if (!token || !id) return;
  const response = await axios.get(`${API_URL}/${EMPLOYEE}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data;
};

export const getServiceById = async (id: number) => {
  if (!id) return;
  const response = await axios.get(`${API_URL}/${SERVICE}/${id}`, {});
  return response?.data;
};

export const getBedByServiceIdAndDate = async (
  date: string | null,
  branchId: number | null,
  roomId: number | null
) => {
  if (!branchId || !date || !roomId) return;
  const response = await axios.get(`${API_URL}/${BED}/${SERVICE}/beds`, {
    params: { branchId, date, roomId },
  });
  return response?.data;
};

export const getCategoryServiceById = async (
  categoryServiceId: number | null
) => {
  if (!categoryServiceId) return;
  const response = await axios.get(
    `${API_URL}/${SERVICE}-${CATEGORY}/${categoryServiceId}`
  );
  return response?.data;
};

export const registerAppointment = async (data: any) => {
  if (!data) return;
  const response = await axios.post(`${API_URL}/${APPOINTMENT}`, data);
  return response?.data;
};

export const getAppointmentByCustomerId = async (
  token: string | null,
  id: number
) => {
  if (!token || !id) return;
  const response = await axios.get(
    `${API_URL}/${APPOINTMENT}/${CUSTOMER}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response?.data;
};

export const getPricesByForeignKeyId = async (id: number) => {
  if (!id) return;
  const response = await axios.get(`${API_URL}/${PRICES}/foreign-key/${id}`);
  return response?.data;
};

export const cancelBookAppointment = async (id: number) => {
  if (!id) return;
  const response = await axios.delete(`${API_URL}/${APPOINTMENT}/${id}`);
  return response?.data;
};

export const getAllServiceDiscount = async (page: number, limit: number) => {
  if (!page || !limit) return;
  const response = await axios.get(`${API_URL}/${SERVICE}/${DISCOUNT}`, {
    params: { page, limit },
  });
  return response?.data;
};

export const getIdBonus = async () => {
  const response = await axios.get(`${API_URL}/${BONUS}/newest/active`);
  return response?.data;
};

export const updateInfoCustomer = async (
  token: string | null,
  formData: FormData,
  id: number
) => {
  if (!token || !id || !formData) return;
  const response = await axios.put(`${API_URL}/${CUSTOMER}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data;
};

export const getDetailServiceByServiceId = async (serviceId: number) => {
  if (!serviceId) return;
  const response = await axios.get(
    `${API_URL}/${DETAIL_SERVICE}/${SERVICE}/${serviceId}`
  );
  return response?.data;
};

export const getOutStandingServices = async () => {
  const response = await axios.get(`${API_URL}/${SERVICE}/out-standings`);
  return response?.data;
};

export const getBonusPointByCustomerId = async (id: number) => {
  if (!id) return;
  const response = await axios.get(`${API_URL}/${BONUS}/${CUSTOMER}/${id}`);
  return response?.data;
};

export const getAllGift = async (page: number, limit: number) => {
  if (!page || !limit) return;
  const response = await axios.get(`${API_URL}/${GIFT}`, {
    params: { page, limit },
  });
  return response?.data;
};

export const getAllVoucher = async (page: number, limit: number) => {
  if (!page || !limit) return;
  const response = await axios.get(`${API_URL}/${VOUCHER}`, {
    params: { page, limit },
  });
  return response?.data;
};

export const giftExchange = async (token: string | null, data: any) => {
  if (!token || !data) return;
  const response = await axios.post(`${API_URL}/${CUSTOMER_GIFT}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data;
};

export const getPointByCustomerId = async (
  token: string | null,
  id: number
) => {
  if (!token || !id) return;
  const response = await axios.get(
    `${API_URL}/${CUSTOMER_POINT}/${CUSTOMER}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response?.data;
};

export const updatePointOfCustomer = async (
  token: string | null,
  id: number,
  data: any
) => {
  if (!token || !id || !data) return;
  const response = await axios.put(`${API_URL}/${CUSTOMER_POINT}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data;
};

export const getGiftByCustomerId = async (token: string | null, id: number) => {
  if (!token || !id) return;
  const response = await axios.get(
    `${API_URL}/${CUSTOMER_GIFT}/${CUSTOMER}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response?.data;
};

export const getGiftById = async (id: number) => {
  if (!id) return;
  const response = await axios.get(`${API_URL}/${GIFT}/${id}`);
  return response?.data;
};

export const getVoucherById = async (id: number) => {
  if (!id) return;
  const response = await axios.get(`${API_URL}/${VOUCHER}/${id}`);
  return response?.data;
};

//manage
export const getAllAccount = async (
  token: string | null,
  branchId: number,
  page: number,
  limit: number
) => {
  if (!token || !branchId || !page || !limit) return;
  const response = await axios.get(`${API_URL}/${ACCOUNT}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { branchId, page, limit },
  });
  return response?.data;
};

export const getAllCustomer = async (
  token: string | null,
  page: number,
  limit: number
) => {
  if (!token || !page || !limit) return;
  const response = await axios.get(`${API_URL}/${CUSTOMER}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { page, limit },
  });
  return response?.data;
};

export const createAccount = async (account: Account) => {
  const response = await axios.post(`${API_URL}/${ACCOUNT}`, account);
  return response?.data;
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
  return response?.data;
};

export const createEvent = async (token: string | null, formData: FormData) => {
  const response = await axios.post(`${API_URL}/${EVENT}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data;
};

export const createProduct = async (
  token: string | null,
  formData: FormData
) => {
  const response = await axios.post(`${API_URL}/${PRODUCT}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data;
};

export const updateEvent = async (
  token: string | null,
  formData: FormData,
  id: number
) => {
  const response = await axios.put(`${API_URL}/${EVENT}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data;
};

export const updateProduct = async (
  token: string | null,
  formData: FormData,
  id: number
) => {
  const response = await axios.put(`${API_URL}/${PRODUCT}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data;
};

export const getAllEvent = async () => {
  const response = await axios.get(`${API_URL}/${EVENT}`);
  return response?.data;
};

export const getAllProduct = async (page: number, limit: number) => {
  const response = await axios.get(`${API_URL}/${PRODUCT}`, {
    params: { page, limit },
  });
  return response?.data;
};

export const registerEmployee = async (data: FormData) => {
  const response = await axios.post(`${API_URL}/${ACCOUNT}/register`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response?.data;
};

export const registerCustomer = async (data: FormData) => {
  const response = await axios.post(`${API_URL}/${ACCOUNT}/register`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response?.data;
};

export const createService = async (token: string | null, data: FormData) => {
  const response = await axios.post(`${API_URL}/${SERVICE}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response?.data;
};

export const updateService = async (
  token: string | null,
  id: number,
  data: FormData
) => {
  const response = await axios.put(`${API_URL}/${SERVICE}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response?.data;
};

export const getWagesByRole = async (token: string | null, role: string) => {
  if (!token || !role) return;
  const response = await axios.get(`${API_URL}/${WAGE}/role/${role}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data;
};

export const getAllService = async (page: number, limit: number) => {
  if (!page || !limit) return;
  const response = await axios.get(`${API_URL}/${SERVICE}`, {
    params: { page, limit },
  });
  return response?.data;
};

export const getAllAppointment = async (
  token: string | null,
  page: number,
  limit: number,
  branchId: number
) => {
  if (!token || !page || !limit || !branchId) return;
  const response = await axios.get(`${API_URL}/${APPOINTMENT}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { branchId, page, limit },
  });
  return response?.data;
};

export const getAllBed = async (
  token: string | null,
  page: number,
  limit: number
) => {
  if (!token || !page || !limit) return;
  const response = await axios.get(`${API_URL}/${BED}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { page, limit },
  });
  return response?.data;
};

export const getAllRoom = async (page: number, limit: number) => {
  if (!page || !limit) return;
  const response = await axios.get(`${API_URL}/${ROOM}`, {
    params: { page, limit },
  });
  return response?.data;
};

export const createServiceCategory = async (
  token: string | null,
  serviceCategory: any
) => {
  const response = await axios.post(
    `${API_URL}/${SERVICE_CATEGORY}`,
    serviceCategory,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response?.data;
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
  return response?.data;
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
  return response?.data;
};

export const getAllSchedule = async (
  token: string | null,
  page: number,
  limit: number
) => {
  if (!token || !page || !limit) return;
  const response = await axios.get(`${API_URL}/${SCHEDULE}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { page, limit },
  });
  return response?.data;
};

export const createSchedule = async (token: string | null, schedule) => {
  if (!token) return;
  const response = await axios.post(`${API_URL}/${SCHEDULE}`, schedule, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data;
};

export const deleteSchedule = async (token: string | null, id: number) => {
  const response = await axios.delete(`${API_URL}/${SCHEDULE}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data;
};

export const updateStatusAppointmentDetail = async (
  token: string | null,
  id: number,
  status
) => {
  const response = await axios.put(
    `${API_URL}/${APPOINTMENT_DETAIL}/${id}/status`,
    status,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response?.data;
};

export const getCustomerById = async (token: string | null, id: number) => {
  if (!token || !id) return;
  const response = await axios.get(`${API_URL}/${CUSTOMER}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data;
};

export const paymentMomo = async (
  token: string | null,
  appointmentId: number,
  amount: number,
  voucherId: Array<number> = [],
  appointmentDetails: Array<number> = []
) => {
  if (!token || !appointmentId || !appointmentDetails) return;
  const response = await axios.get(`${API_URL}/${APPOINTMENT}/payments/momo`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      appointmentId: appointmentId,
      amount: amount,
      voucherId,
      appointmentDetails,
    },
  });
  return response?.data;
};

export const paymentCash = async (
  token: string | null,
  appointmentId: number,
  voucherId: Array<number> = [],
  appointmentDetails: Array<number> = []
) => {
  if (!token || !appointmentId || !appointmentDetails) return;
  const response = await axios.post(
    `${API_URL}/${APPOINTMENT}/receive-notify/momo`,
    {
      orderId: `${appointmentId}_:_${appointmentDetails.join(
        "_"
      )}_:_${voucherId.join("_")}`,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response?.data;
};

export const createAppointmentDetail = async (
  token: string | null,
  appointmentDetail
) => {
  if (!token) return;
  const response = await axios.post(
    `${API_URL}/${APPOINTMENT_DETAIL}`,
    appointmentDetail,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response?.data;
};

export const updateAppointmentDetail = async (
  token: string | null,
  id: number,
  data
) => {
  const response = await axios.put(
    `${API_URL}/${APPOINTMENT_DETAIL}/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response?.data;
};

export const updateSchedule = async (
  token: string | null,
  id: number,
  data
) => {
  const response = await axios.put(`${API_URL}/${SCHEDULE}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data;
};

export const getAllWage = async (
  token: string | null,
  page: number,
  limit: number
) => {
  if (!token || !page || !limit) return;
  const response = await axios.get(`${API_URL}/${WAGE}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page: page,
      limit: limit,
    },
  });
  return response?.data;
};

export const createWage = async (token: string | null, wage) => {
  if (!token) return;
  const response = await axios.post(`${API_URL}/${WAGE}`, wage, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data;
};

export const updateWage = async (
  token: string | null,
  wage,
  wageId: number
) => {
  if (!token) return;
  const response = await axios.put(`${API_URL}/${WAGE}/${wageId}`, wage, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data;
};

export const deleteWage = async (token: string | null, wageId: number) => {
  if (!token) return;
  const response = await axios.delete(`${API_URL}/${WAGE}/${wageId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data;
};

export const createVoucher = async (token: string | null, voucher) => {
  if (!token) return;
  const response = await axios.post(`${API_URL}/${VOUCHER}`, voucher, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data;
};

export const updateVoucher = async (
  token: string | null,
  voucher,
  voucherId: number
) => {
  if (!token) return;
  const response = await axios.put(
    `${API_URL}/${VOUCHER}/${voucherId}`,
    voucher,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response?.data;
};

export const deleteVoucher = async (
  token: string | null,
  voucherId: number
) => {
  if (!token) return;
  const response = await axios.delete(`${API_URL}/${VOUCHER}/${voucherId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data;
};

export const createGift = async (token: string | null, gift) => {
  if (!token) return;
  const response = await axios.post(`${API_URL}/${GIFT}`, gift, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data;
};

export const updateGift = async (
  token: string | null,
  gift,
  giftId: number
) => {
  if (!token) return;
  const response = await axios.put(`${API_URL}/${GIFT}/${giftId}`, gift, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data;
};

export const deleteGift = async (token: string | null, giftId: number) => {
  if (!token) return;
  const response = await axios.delete(`${API_URL}/${GIFT}/${giftId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data;
};

export const getAllProductWithPrice = async () => {
  const response = await axios.get(`${API_URL}/${PRODUCT}/all/with-prices`);
  return response?.data;
};

export const getScheduleByDate = async (date: string) => {
  const response = await axios.get(`${API_URL}/${SCHEDULE}/date/week`, {
    params: { date },
  });
  return response?.data;
};

export const getProductById = async (id: number) => {
  if (!id) return;
  try {
    const response = await axios.get(`${API_URL}/${PRODUCT}/${id}`);
    return response?.data;
  } catch (error) {
    console.error("Error getting product by id:", error);
    throw error;
  }
};

export const getScheduleByDateAndEmployeeId = async (
  id: number,
  date: string
) => {
  if (!id || !date) return;
  try {
    const response = await axios.get(
      `${API_URL}/${SCHEDULE}/date/week/employee/${id}`,
      {
        params: { date },
      }
    );
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getEmployeeStatistics = async (
  id: number,
  branchId: number,
  month: number,
  year: number
) => {
  if (!id || !branchId || !month || !year) return;
  try {
    const response = await axios.get(`${API_URL}/${EMPLOYEE}/statistic/${id}`, {
      params: { branchId: branchId, month: month, year: year },
    });
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateStatusEmployee = async (
  token: string | null,
  id: number,
  status: string
) => {
  if (!token || !id || !status) return;
  const response = await axios.post(
    `${API_URL}/${EMPLOYEE}/update-status`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        id: id,
        status: status,
      },
    }
  );
  return response?.data;
};

export const deleteCustomer = async (token: string | null, id: number) => {
  if (!token || !id) return;
  const response = await axios.delete(`${API_URL}/${CUSTOMER}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data;
};

export const updateStatusService = async (
  token: string | null,
  id: number,
  status: string
) => {
  if (!token || !id || !status) return;
  const response = await axios.post(
    `${API_URL}/${SERVICE}/update-status`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        id: id,
        status: status,
      },
    }
  );
  return response?.data;
};

export const updateStatusProduct = async (
  token: string | null,
  id: number,
  status: string
) => {
  if (!token || !id || !status) return;
  const response = await axios.post(
    `${API_URL}/${PRODUCT}/update-status`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        id: id,
        status: status,
      },
    }
  );
  return response?.data;
};

export const updateStatusAppointment = async (
  token: string | null,
  id: number,
  status: string
) => {
  if (!token || !id || !status) return;
  const response = await axios.put(
    `${API_URL}/${APPOINTMENT}/${id}/status`,
    status,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response?.data;
};
