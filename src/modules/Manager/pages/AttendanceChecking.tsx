import React, { useEffect, useState } from "react";
import { Table, Button, message, Tag, DatePicker } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
  getAllEmployee,
  getAllSchedule,
  updateSchedule,
} from "../../../services/api";
import { useBranch } from "../../../hooks/branchContext";
import { Employee } from "../types";

interface Schedule {
  id: number;
  employeeId: number;
  shift: "morning" | "afternoon";
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
}
interface Employee {
  id: number;
  fullName: string;
}

const AttendanceChecking: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const { branchId } = useBranch();
  const token = localStorage.getItem("accessToken");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentTime, setCurrentTime] = useState(dayjs());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchTodaySchedules = async () => {
    try {
      setLoading(true);
      const selectedDateStr = selectedDate.format("YYYY-MM-DD");

      const response = await getAllSchedule(token, 1, 100);

      if (response?.data) {
        const filteredSchedules = response.data.filter(
          (schedule: Schedule) => schedule.date === selectedDateStr
        );

        setAttendanceRecords(
          filteredSchedules.map((schedule: Schedule) => {
            const employee = employees.find(
              (emp) => emp.id === schedule.employeeId
            );

            const checkInTime =
              schedule.checkInTime === "00:00:00" ? null : schedule.checkInTime;
            const checkOutTime =
              schedule.checkOutTime === "00:00:00"
                ? null
                : schedule.checkOutTime;

            return {
              id: schedule.id,
              employeeId: schedule.employeeId,
              employeeName:
                employee?.fullName || `Nhân viên ${schedule.employeeId}`,
              shift: schedule.shift,
              date: schedule.date,
              checkInTime: checkInTime,
              checkOutTime: checkOutTime,
              scheduledCheckIn:
                schedule.shift === "morning" ? "07:00:00" : "15:00:00",
              scheduledCheckOut:
                schedule.shift === "morning" ? "15:00:00" : "23:00:00",
              status:
                checkInTime && checkOutTime
                  ? "checked_out"
                  : checkInTime
                  ? "checked_in"
                  : "pending",
            };
          })
        );
      }
    } catch (error) {
      message.error("Không thể tải dữ liệu chấm công");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployee = async () => {
    const response = await getAllEmployee(token, branchId, 1, 1000);
    setEmployees(response?.data);
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  useEffect(() => {
    fetchTodaySchedules();
  }, [selectedDate, employees]);

  const handleCheckIn = async (record: Schedule) => {
    try {
      setLoading(true);
      const response = await updateSchedule(token, record.id, {
        date: record.date,
        checkOutTime: "00:00:00",
        day: record.date,
        checkInTime: dayjs().format("HH:mm:ss"),
        shift: record.shift,
        employeeId: record.employeeId,
      });
      if (response.data) {
        message.success("Đã check-in thành công!");
        fetchTodaySchedules();
      } else {
        message.error("Lỗi check-in!");
      }
    } catch (error) {
      console.error("Error during check-in:", error);
      message.error("Không thể check-in");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async (record: Schedule) => {
    try {
      setLoading(true);
      const response = await updateSchedule(token, record.id, {
        date: record.date,
        checkInTime: record.checkInTime,
        day: record.date,
        checkOutTime: dayjs().format("HH:mm:ss"),
        shift: record.shift,
        employeeId: record.employeeId,
      });
      if (response.data) {
        message.success("Đã check-in thành công!");
        fetchTodaySchedules();
      } else {
        message.error("Lỗi check-in!");
      }
    } catch (error) {
      console.error("Error during check-out:", error);
      message.error("Không thể check-out");
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceStatus = (record: Schedule) => {
    const currentTime = dayjs();
    const shiftEndTime = dayjs(record.scheduledCheckOut, "HH:mm:ss");

    if (record.checkInTime && record.checkOutTime) {
      return <Tag color="success">Đầy đủ</Tag>;
    }

    if (!record.checkInTime && currentTime.isAfter(shiftEndTime)) {
      return <Tag color="error">Thiếu check-in</Tag>;
    }

    if (
      record.checkInTime &&
      !record.checkOutTime &&
      currentTime.isAfter(shiftEndTime)
    ) {
      return <Tag color="warning">Thiếu check-out</Tag>;
    }

    if (!record.checkInTime && !record.checkOutTime) {
      return <Tag color="default">Chưa chấm công</Tag>;
    }

    return <Tag color="processing">Đang làm việc</Tag>;
  };

  const columns: ColumnsType<Schedule> = [
    {
      title: "Nhân viên",
      dataIndex: "employeeName",
      key: "employeeName",
    },
    {
      title: "Ca làm việc",
      dataIndex: "shift",
      key: "shift",
      render: (shift: string) =>
        shift === "morning" ? "Ca sáng (7h-15h)" : "Ca chiều (15h-23h)",
    },
    {
      title: "Giờ check-in",
      dataIndex: "checkInTime",
      key: "checkInTime",
      render: (checkInTime: string | null) => checkInTime || "-",
    },
    {
      title: "Giờ check-out",
      dataIndex: "checkOutTime",
      key: "checkOutTime",
      render: (checkOutTime: string | null) => checkOutTime || "-",
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => getAttendanceStatus(record),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => {
        if (record.checkInTime === "00:00:00" || !record.checkInTime) {
          return (
            <Button type="primary" onClick={() => handleCheckIn(record)}>
              Check-in
            </Button>
          );
        }

        if (record.checkOutTime === "00:00:00" || !record.checkOutTime) {
          return (
            <Button onClick={() => handleCheckOut(record)}>Check-out</Button>
          );
        }

        return null;
      },
    },
  ];

  return (
    <div className="attendance-checking">
      <div className="attendance-header">
        <div className="left-section">
          <h2>Chấm công nhân viên</h2>
          <DatePicker
            value={selectedDate}
            onChange={(date) => setSelectedDate(date || dayjs())}
            format="DD/MM/YYYY"
            allowClear={false}
          />
        </div>
        <div className="current-time">
          <div className="time">{currentTime.format('HH:mm:ss')}</div>
          <div className="date">{currentTime.format('DD/MM/YYYY')}</div>
        </div>
      </div>

      <div className="attendance-content">
        <Table
          columns={columns}
          dataSource={attendanceRecords}
          loading={loading}
          rowKey="id"
          pagination={false}
          bordered
          className="attendance-table"
        />
      </div>
    </div>
  );
};

export default AttendanceChecking;
