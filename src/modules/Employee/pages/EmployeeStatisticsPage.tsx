import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  DatePicker,
  Typography,
  Table,
  Statistic,
  message,
} from "antd";
import { Line, Column } from "@ant-design/plots";
import moment from "moment";
import locale from "antd/es/date-picker/locale/vi_VN";
import { getEmployeeStatistics } from "../../../services/api";
import { useLocation } from "react-router-dom";
import { useBranch } from "../../../hooks/branchContext";

const { Title } = Typography;

const EmployeeStatisticsPage: React.FC = () => {
  const [statistics, setStatistics] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [totalSalary, setTotalSalary] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);
  const [totalHours, setTotalHours] = useState(0);

  const location = useLocation();
  const employeeId = location.state?.employeeId;
  const { branchId, setBranchId } = useBranch();

  useEffect(() => {
    fetchStatistics(selectedDate);
  }, [selectedDate, employeeId, branchId]);

  const fetchStatistics = async (date: moment.Moment) => {
    try {
      const month = date.month() + 1; 
      const year = date.year();

      const response = await getEmployeeStatistics(
        1,
        Number(branchId),
        month,
        year
      );
      console.log(response);

      if (response && response.data) {
        setStatistics(response.data);
        calculateTotals(response.data);
      } else {
        setStatistics([]);
        calculateTotals([]);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
      message.error("Không thể tải dữ liệu thống kê");
      setStatistics([]);
      calculateTotals([]);
    }
  };

  const calculateTotals = (data: any[]) => {
    const salary = data.reduce(
      (sum, item) => sum + parseInt(item.salary || 0),
      0
    );
    const commission = data.reduce(
      (sum, item) => sum + parseInt(item.commission || 0),
      0
    );
    const hours = data.reduce((sum, item) => sum + (item.hours || 0), 0);

    setTotalSalary(salary);
    setTotalCommission(commission);
    setTotalHours(hours);
  };

  // Chuẩn bị dữ liệu cho biểu đồ đường
  const lineData = statistics.flatMap(item => ([
    {
      dateTime: item.dateTime,
      type: 'Lương',
      value: parseInt(item.salary || 0)  // Thêm fallback value 0
    },
    {
      dateTime: item.dateTime,
      type: 'Hoa hồng',
      value: parseInt(item.commission || 0)  // Thêm fallback value 0
    }
  ])).filter(item => !isNaN(item.value));  // Lọc bỏ các giá trị NaN

  // Config cho biểu đồ đường
  const lineConfig = {
    data: lineData,
    xField: 'dateTime',
    yField: 'value',
    seriesField: 'type',
    color: ['#c471ed', '#ff9966'],  // Màu phù hợp với card
    smooth: true,
    xAxis: {
      type: 'time',
      label: {
        formatter: (v: string) => moment(v).format('DD/MM'),
        style: {
          fill: '#666',
          fontSize: 14  // Tăng kích thước chữ
        }
      }
    },
    yAxis: {
      label: {
        formatter: (v: string) => `${parseInt(v).toLocaleString()}đ`,
        style: {
          fill: '#666',
          fontSize: 14  // Tăng kích thước chữ
        }
      }
    },
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: datum.type,
          value: `${parseInt(datum.value).toLocaleString()}đ`,
        };
      }
    },
    legend: {
      position: 'top',
      itemName: {
        style: {
          fontSize: 14  // Tăng kích thước chữ cho legend
        }
      }
    }
  };

  // Config cho biểu đồ cột
  const columnConfig = {
    data: statistics,
    xField: "dateTime",
    yField: "hours",
    xAxis: {
      label: {
        formatter: (v: string) => moment(v).format("DD/MM"),
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: "Số giờ làm việc",
          value: `${datum.hours} giờ`,
        };
      },
    },
  };

  return (
    <div className="employee-statistics-page">
      <div className="header-section">
        <Title level={2}>Thống kê nhân viên</Title>
        <DatePicker
          defaultValue={selectedDate}
          onChange={(date) => setSelectedDate(date || moment())}
          picker="month"
          format="MM/YYYY"
          locale={locale}
        />
      </div>

      <Row gutter={[16, 16]} className="statistics-cards">
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng lương"
              value={totalSalary}
              precision={0}
              suffix="đ"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng hoa hồng"
              value={totalCommission}
              precision={0}
              suffix="đ"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng giờ làm việc"
              value={totalHours}
              suffix="giờ"
            />
          </Card>
        </Col>
      </Row>

      
      <Card title="Chi tiết theo ngày" className="table-section">
        <Table
          columns={[
            {
              title: "Ngày",
              dataIndex: "dateTime",
              key: "dateTime",
              render: (text) => moment(text).format("DD/MM/YYYY"),
            },
            {
              title: "Giờ làm việc",
              dataIndex: "hours",
              key: "hours",
              render: (hours) => `${hours} giờ`,
            },
            {
              title: "Lương",
              dataIndex: "salary",
              key: "salary",
              render: (salary) => `${parseInt(salary).toLocaleString()}đ`,
            },
            {
              title: "Hoa hồng",
              dataIndex: "commission",
              key: "commission",
              render: (commission) =>
                `${parseInt(commission).toLocaleString()}đ`,
            },
          ]}
          dataSource={statistics}
          rowKey="dateTime"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default EmployeeStatisticsPage;
