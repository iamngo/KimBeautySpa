import React, { useEffect, useState } from "react";
import "./statistic.scss";
import {
  getExpenseByMonthYear,
  getRevenueOfServiceByDate,
  getSalaryOfEmployeeByMonthYear,
} from "../../../services/api";
import { useBranch } from "../../../hooks/branchContext";
import BarCharts from "./BarCharts";

const Dashboard: React.FC = () => {
  const { branchId, setBranchId } = useBranch();
  const [services, setServices] = useState([]);
  const [totalServices, setTotalServices] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const token = localStorage.getItem("accessToken") || "";

  useEffect(() => {
    const getApiRevenueOfServiceByDate = async () => {
      const response = await getRevenueOfServiceByDate(
        token,
        branchId,
        11,
        2024
      );
      setTotalServices(
        response?.data?.reduce((total, o) => total + Number(o.revenue), 0)
      );
      console.log(response?.data);

      setServices([...response?.data]);
    };

    const getApiSalaryOfEmployeeByMonthYear = async () => {
      const response = await getSalaryOfEmployeeByMonthYear(
        token,
        branchId,
        11,
        2024
      );
      console.log(response?.data);
      setTotalEmployees(
        response?.data?.reduce(
          (total, o) => total + Number(o.salary) + Number(o.commissions),
          0
        )
      );
      setEmployees([...response?.data]);
    };

    const getApiExpenseByMonthYear = async () => {
      const response = await getExpenseByMonthYear(branchId, 11, 2024);
      console.log(response?.data);
      setTotalExpenses(
        response?.data?.reduce((total, o) => total + Number(o.expense), 0)
      );
      setExpenses([...response?.data]);
    };

    getApiRevenueOfServiceByDate();
    getApiSalaryOfEmployeeByMonthYear();
    getApiExpenseByMonthYear();
  }, [branchId]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="stat-card">
          <div className="statistic-basic">
            <div
              className="statistic-basic-content"
              style={{ backgroundColor: "#C280FF" }}
            >
              <span className="title-statsitic-basic">DỊCH VỤ</span>
              <span className="value-statistic-basic">{totalServices} VND</span>
            </div>
            <div
              className="statistic-basic-content"
              style={{ backgroundColor: "#FF9D9C" }}
            >
              <span className="title-statsitic-basic">NHÂN VIÊN</span>
              <span className="value-statistic-basic">
                {totalEmployees} VND
              </span>
            </div>
            <div
              className="statistic-basic-content"
              style={{ backgroundColor: "#FFC96C" }}
            >
              <span className="title-statsitic-basic">CHI TIÊU</span>
              <span className="value-statistic-basic">{totalExpenses} VND</span>
            </div>
          </div>
        </div>
      </div>

      <div className="chart-section">
        <h2>Thống kê dịch vụ</h2>
        <BarCharts services={services} />
      </div>
    </div>
  );
};

export default Dashboard;
