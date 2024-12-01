import React from "react";
import { Routes, Route } from "react-router-dom";
import {
  CATEGORY_SERVICE,
  DASHBOARD,
  HOME,
  LOGIN,
  MANAGER,
  MY_SERVICES,
  PROMOTION,
  REWARD_POINTS,
  SERVICE_DETAIL_URL,
  TREATMENTS,
  EMPLOYEE_PATH,
  EMPLOYEE_SCHEDULE,
  EMPLOYEE_SALARY,
  PRODUCTS,
  EMPLOYEE_STATISTICS,
} from "./routes";
import Authenticate from "./modules/Authenticate/pages/auth";
import ManagerLayout from "./modules/Manager/pages/ManagerLayout";
import Dashboard from "./modules/Manager/pages/Dashboard";
import HomepageLayout from "./modules/Customer/pages/HomepageLayout";
import Homepage from "./modules/Customer/pages/Homepage";
import ServicesPage from "./modules/Customer/pages/ServicesPage";
import TreatmentsPage from "./modules/Customer/pages/TreatmentsPage";
import ServiceDetail from "./modules/Customer/pages/ServiceDetail";
import RewardPage from "./modules/Customer/pages/RewardPage";
import MyServicePlanPage from "./modules/Customer/pages/MyServicePlanPage";
import PromotionPage from "./modules/Customer/pages/PromotionPage";
import {
  ACCOUNT,
  APPOINTMENT,
  ATTENDANCE_CHECKING,
  CUSTOMER,
  EMPLOYEE,
  EVENT,
  GIFT,
  MANAGE_SCHEDULE,
  PRODUCT,
  SERVICE,
  SERVICE_CATEGORY,
  VOUCHER,
  WAGE,
} from "./utils/constants";
import CustomerPage from "./modules/Manager/pages/Customer";
import AccountPage from "./modules/Manager/pages/Account";
import EmployeePage from "./modules/Manager/pages/Employee";
import ServicePage from "./modules/Manager/pages/Service";
import AppointmentPage from "./modules/Manager/pages/Appointment";
import ServiceCategoryPage from "./modules/Manager/pages/ServiceCategory";
import ManageSchedule from "./modules/Manager/pages/ManageSchedule";
import EventPage from "./modules/Manager/pages/Event";
import ProductPage from "./modules/Manager/pages/Product";
import AttendanceChecking from "./modules/Manager/pages/AttendanceChecking";
import WagePage from "./modules/Manager/pages/Wage";
import VoucherPage from "./modules/Manager/pages/Voucher";
import GiftPage from "./modules/Manager/pages/Gift";
import EmployeeLayout from "./modules/Employee/layout/EmployeeLayout";
import SchedulePage from "./modules/Employee/pages/Schedule";
import SalaryPage from "./modules/Employee/pages/Salary";
import Products from "./modules/Customer/pages/Products";
import EmployeeStatisticsPage from "./modules/Employee/pages/EmployeeStatisticsPage";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path={LOGIN} element={<Authenticate />} />
      <Route path={HOME} element={<HomepageLayout />}>
        <Route index element={<Homepage />} />
        <Route path={CATEGORY_SERVICE} element={<ServicesPage />} />
        <Route path={TREATMENTS} element={<TreatmentsPage />} />
        <Route path={SERVICE_DETAIL_URL} element={<ServiceDetail />} />
        <Route path={REWARD_POINTS} element={<RewardPage />} />
        <Route path={MY_SERVICES} element={<MyServicePlanPage />} />
        <Route path={PROMOTION} element={<PromotionPage />} />
        <Route path={PRODUCTS} element={<Products />} />
      </Route>

      <Route path={MANAGER} element={<ManagerLayout />}>
        <Route path={DASHBOARD} element={<Dashboard />} />
        <Route path={ACCOUNT} element={<AccountPage />} />
        <Route path={CUSTOMER} element={<CustomerPage />} />
        <Route path={EMPLOYEE} element={<EmployeePage />} />
        <Route path={SERVICE} element={<ServicePage />} />
        <Route path={APPOINTMENT} element={<AppointmentPage />} />
        <Route path={SERVICE_CATEGORY} element={<ServiceCategoryPage />} />
        <Route path={MANAGE_SCHEDULE} element={<ManageSchedule />} />
        <Route path={EVENT} element={<EventPage />} />
        <Route path={PRODUCT} element={<ProductPage />} />
        <Route path={ATTENDANCE_CHECKING} element={<AttendanceChecking />} />
        <Route path={WAGE} element={<WagePage />} />
        <Route path={VOUCHER} element={<VoucherPage />} />
        <Route path={GIFT} element={<GiftPage />} />
      </Route>

      <Route path={EMPLOYEE_PATH} element={<EmployeeLayout />}>
        <Route path={EMPLOYEE_SCHEDULE} element={<SchedulePage />} />
        <Route path={EMPLOYEE_SALARY} element={<SalaryPage />} />
        <Route path={EMPLOYEE_STATISTICS} element={<EmployeeStatisticsPage />} />
      </Route>
    </Routes>
  );
};

export default App;
