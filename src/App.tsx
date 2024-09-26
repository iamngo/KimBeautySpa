import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { DASHBOARD, HOME, LOGIN, MANAGER } from "./routes";
import Authenticate from "./modules/Authenticate/pages/auth";
import ManagerLayout from "./modules/Manager/pages/ManagerLayout";
import Dashboard from "./modules/Manager/pages/Dashboard";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path={LOGIN} element={<Authenticate />} />
      <Route path={HOME} element={<Navigate to={LOGIN} />} />
      <Route path={MANAGER} element={<ManagerLayout />}>
        <Route path={DASHBOARD} element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default App;
