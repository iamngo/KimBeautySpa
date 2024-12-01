import React, { useEffect, useState, useMemo } from "react";
import { DatePicker } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import {
  getAllSchedule,
  getScheduleByDate,
  getScheduleByDateAndEmployeeId,
} from "../../../services/api";
import "../styles.scss";

interface ISchedule {
  id: number;
  date: string;
  shift: string;
  checkInTime: string;
  checkOutTime: string;
  employeeId: number;
}

const Schedule: React.FC = () => {
  const [schedules, setSchedules] = useState<ISchedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [currentTime, setCurrentTime] = useState<Dayjs>(dayjs());
  const token = localStorage.getItem("accessToken") || "";
  const employeeId = Number(localStorage.getItem("employeeId"));

  const shifts = [
    { shifts: "morning", time: "7h - 15h", label: "Ca sáng" },
    { shifts: "afternoon", time: "15h - 23h", label: "Ca chiều" },
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

  const weekDays = useMemo(() => {
    if (!selectedDate) return [];
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
      return (
        schedule.employeeId === employeeId &&
        weekDays.some((day) => scheduleDate.isSame(day, "day"))
      );
    });
  }, [schedules, weekDays, employeeId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchSchedules(selectedDate.format("YYYY-MM-DD"));
    }
  }, [selectedDate]);

  const fetchSchedules = async (date: string) => {
    try {
      const response = await getScheduleByDateAndEmployeeId(employeeId, date);
      setSchedules(response.data);
      console.log(date);
      
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  return (
    <div className="manage-schedule">
      <div className="schedule-header">
        <div className="left-section">
          <h2>Lịch làm việc</h2>
          <DatePicker
            value={selectedDate}
            onChange={(date) => setSelectedDate(date || dayjs())}
            format="DD/MM/YYYY"
            allowClear={false}
          />
        </div>
        <div className="current-time">
          <div className="time">{currentTime.format("HH:mm:ss")}</div>
          <div className="date">{currentTime.format("DD/MM/YYYY")}</div>
        </div>
      </div>
      <div className="schedule">
        <div className="days-container">
          {weekDays.map((day, index) => {
            const formattedDate = weekDays[index].format("DD/MM/YYYY");
            return (
              <div key={daysOfWeek[index]} className="day">
                <h2>
                  {daysOfWeek[index]} {formattedDate}
                </h2>
                {shifts.map((shift) => {
                  const hasShift = filteredSchedules.some(
                    (schedule) =>
                      schedule.shift === shift.shifts &&
                      dayjs(schedule.date).isSame(weekDays[index], "day")
                  );
                  return (
                    <div
                      key={shift.time}
                      className={`shiftEmployee ${
                        hasShift ? "has-shift" : "no-shift"
                      }`}
                    >
                      <p>{shift.label}</p>
                      <p>{shift.time}</p>
                      {hasShift && <span className="status">Có lịch làm</span>}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
