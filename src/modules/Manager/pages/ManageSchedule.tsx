import React, { useEffect, useState, useMemo } from "react";
import { DatePicker, Checkbox, Modal, Button, message } from "antd";
import "../styles.scss";
import { getAllEmployee, getAllSchedule } from "../../../services/api";
import dayjs, { Dayjs } from "dayjs";

interface Schedule {
  id: number;
  date: string; // Ngày dưới dạng chuỗi
  shift: string;
  employees: number[];
}

interface Employee {
  id: number;
  name: string;
}

const ManageSchedule: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const token = localStorage.getItem("accessToken");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);

  const shifts = [
    { shifts: "morning", time: "7h - 15h", label: "Ca sáng" },
    { shifts: "afternoon", time: "15h - 23h", label: "Ca tối" },
  ];

  const daysOfWeek = [
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
    "Chủ Nhật",
  ];

  useEffect(() => {
    fetchSchedule();
    fetchEmployee();
  }, []);

  const fetchSchedule = async () => {
    let allData: Schedule[] = [];
    let currentPage = 1;
    const itemsPerPage = 10;

    while (true) {
      const response = await getAllSchedule(token, currentPage, itemsPerPage);
      if (response?.data) {
        allData = [...allData, ...response.data];
        if (currentPage >= response.pagination.totalPages) {
          break;
        }
        currentPage++;
      } else {
        console.error("Error fetching data:", response?.error);
        break;
      }
    }
    setSchedules(allData);
    console.log(allData);
  };

  const fetchEmployee = async () => {
    const response = await getAllEmployee(token, 1, 1000);
    setEmployees(response.data);
    console.log(response.data);
  };

  const weekDays = useMemo(() => {
    if (!selectedDate) {
      return [];
    }
    const startOfWeek = selectedDate.startOf("week");

    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(startOfWeek.add(i + 1, "day"));
    }
    return days;
  }, [selectedDate]);

  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => {
      const scheduleDate = dayjs(schedule.date);
      return weekDays.some((day) => scheduleDate.isSame(day, "day"));
    });
  }, [schedules, weekDays]);

  const handleShiftClick = (day: Dayjs, shift: string) => {
    if (day.isAfter(dayjs().subtract(1, "day"))) {
      const schedule = filteredSchedules.find(
        (schedule) =>
          dayjs(schedule.date).isSame(day, "day") && schedule.shift === shift
      );
      setSelectedEmployees(schedule ? [schedule.employeeId] : []);
      setIsModalVisible(true);
    } else {
      message.warning(
        "Bạn chỉ có thể chỉnh sửa lịch làm việc từ ngày hiện tại."
      );
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
    console.log("Selected Employees:", selectedEmployees);
  };

  return (
    <div className="manage-schedule">
      <div className="utils-schedule">
        <div className="date-picker">
          <DatePicker
            value={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
            }}
            format="DD/MM/YYYY"
            allowClear={false}
          />
        </div>
        <div className="week-navigation">
          <button
            onClick={() => setSelectedDate(selectedDate?.subtract(1, "week"))}
          >
            Tuần trước
          </button>
          <span>Tuần {selectedDate?.week()}</span>
          <button onClick={() => setSelectedDate(selectedDate?.add(1, "week"))}>
            Tuần sau
          </button>
        </div>
      </div>
      <div className="schedule">
        <div className="days-container">
          {weekDays.map((day, index) => {
            const formattedDate = day.format("DD/MM/YYYY");
            return (
              <div key={daysOfWeek[index]} className="day">
                <h2>
                  {daysOfWeek[index]} {formattedDate}
                </h2>
                {shifts.map((shift) => (
                  <div
                    key={shift.time}
                    className="shift"
                    onClick={() => handleShiftClick(day, shift.shifts)}
                  >
                    <p>{shift.label}</p>
                    {filteredSchedules
                      .filter(
                        (schedule) =>
                          schedule.shift === shift.shifts &&
                          dayjs(schedule.date).isSame(day, "day")
                      )
                      .map((filteredSchedule) => (
                        <div
                          key={filteredSchedule.id}
                          style={{ padding: "5px 10px" }}
                        >
                          {employees.map((employee) => {
                            if (filteredSchedule.employeeId === employee.id) {
                              return (
                                <div key={employee.id}>{employee.fullName}</div>
                              );
                            }
                          })}
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      <Modal
        title="Chọn nhân viên cho lịch trình"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        {employees.map((employee) => (
          <div key={employee.id}>
            <Checkbox
              id={`employee-${employee.id}`}
              value={employee.id}
              checked={
                Array.isArray(selectedEmployees) &&
                selectedEmployees.includes(employee.id)
              }
              onChange={(e) => {
                setSelectedEmployees((prev) => {
                  if (Array.isArray(prev)) {
                    if (e.target.checked) {
                      return [...prev, employee.id];
                    } else {
                      return prev.filter((id) => id !== employee.id);
                    }
                  } else {
                    return e.target.checked ? [employee.id] : [];
                  }
                });
              }}
            >
              {employee.fullName}
            </Checkbox>
          </div>
        ))}
      </Modal>
    </div>
  );
};

export default ManageSchedule;
