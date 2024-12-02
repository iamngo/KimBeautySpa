import React, { useEffect, useState, useMemo } from "react";
import { DatePicker, Checkbox, Modal, Button, message } from "antd";
import "../styles.scss";
import {
  createSchedule,
  deleteSchedule,
  getAllEmployee,
  getAllSchedule,
  getScheduleByDate,
} from "../../../services/api";
import dayjs, { Dayjs } from "dayjs";
import { useBranch } from "../../../hooks/branchContext";

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
  const [selectedDateSchedule, setSelectedDateSchedule] =
    useState<Dayjs | null>(dayjs());
  const [selectedShift, setSelectedShift] = useState();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const token = localStorage.getItem("accessToken");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const { branchId, setBranchId } = useBranch();

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
    if (selectedDate) {
      fetchSchedule(selectedDate.format("YYYY-MM-DD"));
    }
    fetchEmployee();
  }, [isModalVisible, selectedDate]);

  const fetchSchedule = async (date: string) => {
    try {
      const response = await getScheduleByDate(date);
      if (response && response.data) {
        setSchedules(response.data);
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
      message.error("Không thể tải lịch làm việc");
    }
  };

  const fetchEmployee = async () => {
    try {
      const response = await getAllEmployee(token, branchId, 1, 1000);
      if (response && response.data) {
        setEmployees(response.data);
      }
      console.log("Employee response:", response?.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      message.error("Không thể tải danh sách nhân viên");
    }
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
      const schedulesForShift = filteredSchedules.filter(
        (schedule) =>
          dayjs(schedule.date).isSame(day, "day") && schedule.shift === shift
      );
      const employeeIds = schedulesForShift.flatMap(
        (schedule) => schedule.employeeId
      );
      setSelectedEmployees(Array.from(new Set(employeeIds)));
      setSelectedDateSchedule(day);
      setSelectedShift(shift);
      setIsModalVisible(true);
    } else {
      message.warning(
        "Bạn chỉ có thể chỉnh sửa lịch làm việc từ ngày hiện tại."
      );
    }
  };

  const handleOk = async () => {
    const checkInTime = selectedShift === "morning" ? "00:00:00" : "00:00:00";
    const checkOutTime = selectedShift === "morning" ? "00:00:00" : "00:00:00";
    const selectedDateStr = selectedDateSchedule?.format("YYYY-MM-DD");

    for (const employeeId of selectedEmployees) {
      const existingSchedule = filteredSchedules.find(
        (schedule) =>
          schedule.date === selectedDateStr &&
          schedule.shift === selectedShift &&
          schedule.employeeId === employeeId
      );
      if (!existingSchedule) {
        // Tạo lịch mới nếu không tồn tại
        const schedule = {
          date: selectedDateStr,
          day: selectedDateStr,
          shift: selectedShift,
          checkInTime,
          checkOutTime,
          employeeId: employeeId,
        };

        try {
          const response = await createSchedule(token, schedule);
          console.log(`Created schedule for employee ${employeeId}:`, response);
        } catch (error) {
          console.error(
            `Error creating schedule for employee ${employeeId}:`,
            error
          );
          message.error(
            `Có lỗi khi tạo lịch làm cho nhân viên có ID ${employeeId}`
          );
        }
      } else {
        console.log(
          `Employee ${employeeId} already has a schedule for this shift and day.`
        );
      }
    }

    // Xóa lịch làm của những nhân viên không có trong selectedEmployees
    const schedulesToDelete = schedules.filter(
      (schedule) =>
        schedule.date === selectedDateStr &&
        schedule.shift === selectedShift &&
        !selectedEmployees.includes(schedule.employeeId)
    );

    for (const schedule of schedulesToDelete) {
      try {
        await deleteSchedule(token, schedule.id); // Thực hiện xóa lịch làm
        console.log(`Deleted schedule for employee ${schedule.employeeId}`);
      } catch (error) {
        console.error(
          `Error deleting schedule for employee ${schedule.employeeId}:`,
          error
        );
        message.error(
          `Có lỗi khi xóa lịch làm của nhân viên có ID ${schedule.employeeId}`
        );
      }
    }
    setIsModalVisible(false);
    message.success("Đã cập nhật lịch làm cho các nhân viên.");
  };

  return (
    <div className="manage-schedule">
      <div className="utils-schedule">
        <div className="date-picker">
          <h2>Quản lý lịch làm việc</h2>
          <DatePicker
            value={selectedDate}
            onChange={(date) => setSelectedDate(date)}
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
                          {employees?.map((employee) => {
                            if (filteredSchedule.employeeId === employee.id) {
                              return (
                                <div key={employee.id}>
                                  {employee.fullName}{" "}
                                  {employee.role === "manager"
                                    ? "(QL)"
                                    : employee.role === "admin"
                                    ? "(AD)"
                                    : ""}
                                </div>
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
        {employees?.map((employee) => (
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
