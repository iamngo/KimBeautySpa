import React, { useEffect, useState } from "react";
import "./statistic.scss";
import {
  getExpenseByMonthYear,
  getRevenueOfServiceByDate,
  getSalaryOfEmployeeByMonthYear,
} from "../../../services/api";
import { useBranch } from "../../../hooks/branchContext";
import BarCharts from "./BarCharts";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";

const Dashboard: React.FC = () => {
  const { branchId, setBranchId } = useBranch();
  const [services, setServices] = useState([]);
  const [totalServices, setTotalServices] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [products, setProduct] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const token = localStorage.getItem("accessToken") || "";
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

  useEffect(() => {
    const dateFormat = selectedDate.format("YYYY-MM-DD").split("-");
    console.log(dateFormat);

    const getApiRevenueOfServiceByDate = async () => {
      const response = await getRevenueOfServiceByDate(
        token,
        branchId,
        Number(dateFormat[1]),
        Number(dateFormat[0])
      );
      setTotalServices(
        response?.data?.reduce((total, o) => total + Number(o.revenue), 0)
      );

      setServices([
        ...response?.data?.map((o) => {
          return {
            ...o,
            category: "service",
          };
        }),
      ]);
    };

    const getApiSalaryOfEmployeeByMonthYear = async () => {
      const response = await getSalaryOfEmployeeByMonthYear(
        token,
        branchId,
        Number(dateFormat[1]),
        Number(dateFormat[0])
      );
      console.log(response?.data);
      setTotalEmployees(
        response?.data?.reduce(
          (total, o) => total + Number(o.salary) + Number(o.commissions),
          0
        )
      );
      setEmployees([
        ...response?.data?.map((o) => {
          return {
            ...o,
            name: o.fullName,
            revenue: Number(o.salary) + Number(o.commissions),
            category: "employee",
          };
        }),
      ]);
    };

    const getApiExpenseByMonthYear = async () => {
      const response = await getExpenseByMonthYear(
        branchId,
        Number(dateFormat[1]),
        Number(dateFormat[0])
      );
      console.log(
        response?.data?.map((o) => {
          return {
            ...o,
            category: "product",
          };
        })
      );
      setTotalExpenses(
        response?.data?.reduce((total, o) => total + Number(o.revenue), 0)
      );
      setProduct([
        ...response?.data?.map((o) => {
          return {
            ...o,
            category: "product",
          };
        }),
      ]);
    };

    getApiRevenueOfServiceByDate();
    getApiSalaryOfEmployeeByMonthYear();
    getApiExpenseByMonthYear();
  }, [branchId, selectedDate]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <DatePicker
          value={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          format="DD/MM/YYYY"
          allowClear={false}
        />
        <div className="stat-card">
          <div className="statistic-basic">
            <div
              className="statistic-basic-content"
              style={{ backgroundColor: "#C280FF" }}
            >
              <span className="title-statsitic-basic">DỊCH VỤ</span>
              <span className="value-statistic-basic">
                {totalServices.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            </div>
            <div
              className="statistic-basic-content"
              style={{ backgroundColor: "#FF9D9C" }}
            >
              <span className="title-statsitic-basic">NHÂN VIÊN</span>
              <span className="value-statistic-basic">
                {totalEmployees.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            </div>
            <div
              className="statistic-basic-content"
              style={{ backgroundColor: "#FFC96C" }}
            >
              <span className="title-statsitic-basic">SẢN PHẨM</span>
              <span className="value-statistic-basic">
                {totalExpenses.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="chart-section">
        <h2>Thống Kê Dịch Vụ</h2>
        <BarCharts datas={services} />
      </div>

      <div className="chart-section">
        <h2>Thống Kê Nhân Viên</h2>
        <BarCharts datas={employees} />
      </div>

      <div className="chart-section">
        <h2>Thống Kê Sản Phẩm</h2>
        <BarCharts datas={products} />
      </div>
    </div>
  );
};

export default Dashboard;
