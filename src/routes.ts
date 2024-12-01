export const LOGIN = "/login";
export const HOME = "/";
export const MANAGER = "/manager";
export const DASHBOARD = "dashboard";
export const SERVICE = "services";
export const CATEGORY_SERVICE = "category-services/:id";
export const TREATMENTS = "treatments";
export const PRODUCTS = "products";
export const PROMOTION = "promotion";
export const SERVICE_DETAIL_URL = "services/:id";
export const SERVICE_DETAIL = "service";
export const REWARD_POINTS = "reward-points";
export const MY_SERVICES = "my-services";
export const EMPLOYEE_PATH = "/employee";
export const EMPLOYEE_SCHEDULE = "schedule";
export const EMPLOYEE_SALARY = "salary";
export const EMPLOYEE_STATISTICS = "statistics";
export const employeeRoutes = {
  schedule: EMPLOYEE_PATH + EMPLOYEE_SCHEDULE,
  salary: EMPLOYEE_PATH + EMPLOYEE_SALARY,
  statistics: EMPLOYEE_PATH + EMPLOYEE_STATISTICS,
};