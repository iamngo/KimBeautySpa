import React from "react";
import { Routes, Route } from "react-router-dom";
import { DASHBOARD, HOME, LOGIN, MANAGER, SERVICE, SERVICE_DETAIL, SERVICE_DETAIL_URL, TREATMENTS } from "./routes";
import Authenticate from "./modules/Authenticate/pages/auth";
import ManagerLayout from "./modules/Manager/pages/ManagerLayout";
import Dashboard from "./modules/Manager/pages/Dashboard";
import HomepageLayout from "./modules/Customer/pages/HomepageLayout";
import Homepage from "./modules/Customer/pages/Homepage";
import ServicesPage from "./modules/Customer/pages/ServicesPage";
import TreatmentsPage from "./modules/Customer/pages/TreatmentsPage";
import ServiceDetail from "./modules/Customer/pages/ServiceDetail";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path={LOGIN} element={<Authenticate />} />
      <Route path={HOME} element={<HomepageLayout />} >
        <Route index element={<Homepage />} />
        <Route path={SERVICE} element={<ServicesPage />} />
        <Route path={TREATMENTS} element={<TreatmentsPage />} />
        <Route path={SERVICE_DETAIL_URL} element={<ServiceDetail />} />
      </Route>

      <Route path={MANAGER} element={<ManagerLayout />}>
        <Route path={DASHBOARD} element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default App;
