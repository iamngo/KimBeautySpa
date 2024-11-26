import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
// import { getEmployeeSalaries } from "../../../services/api";

interface ISalary {
  id: number;
  month: string;
  workingDays: number;
  basicSalary: number;
  bonus: number;
  deduction: number;
  totalSalary: number;
}

const SalaryPage: React.FC = () => {
  const [salaries, setSalaries] = useState<ISalary[]>([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("accessToken") || "";

  const columns: ColumnsType<ISalary> = [
    {
      title: "Tháng",
      dataIndex: "month",
      key: "month",
    },
    {
      title: "Số ngày làm việc",
      dataIndex: "workingDays",
      key: "workingDays",
    },
    {
      title: "Lương cơ bản",
      dataIndex: "basicSalary",
      key: "basicSalary",
      render: (value) => value.toLocaleString("vi-VN") + " đ",
    },
    {
      title: "Thưởng",
      dataIndex: "bonus",
      key: "bonus",
      render: (value) => value.toLocaleString("vi-VN") + " đ",
    },
    {
      title: "Khấu trừ",
      dataIndex: "deduction",
      key: "deduction",
      render: (value) => value.toLocaleString("vi-VN") + " đ",
    },
    {
      title: "Tổng lương",
      dataIndex: "totalSalary",
      key: "totalSalary",
      render: (value) => value.toLocaleString("vi-VN") + " đ",
    },
  ];

  useEffect(() => {
    fetchSalaries();
  }, []);

  const fetchSalaries = async () => {
    try {
      setLoading(true);
    //   const response = await getEmployeeSalaries(token);
    //   setSalaries(response.data);
    } catch (error) {
      message.error("Không thể tải thông tin lương");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="salary-page">
      <h2>Bảng lương</h2>
      <Table
        columns={columns}
        dataSource={salaries}
        loading={loading}
        rowKey="id"
      />
    </div>
  );
};

export default SalaryPage; 