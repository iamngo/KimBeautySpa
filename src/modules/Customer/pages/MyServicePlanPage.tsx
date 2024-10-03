import React, { useState } from "react";
import { Button, Calendar, Badge, Input, CalendarProps, List } from "antd";
import type { Moment } from "moment";
import moment from "moment";
import "../styles.scss";

const MyServicePlanPage: React.FC = () => {
  const [date, setDate] = useState(moment());
  const [searchValue, setSearchValue] = useState("");
  const { Search } = Input;

  // Các sự kiện mẫu
  const getListData = (value: Moment) => {
    let listData;
    switch (value.date()) {
      case 10:
        listData = [{ type: "success", content: "Lịch thực hiện dịch vụ A" }];
        break;
      case 15:
        listData = [{ type: "warning", content: "Lịch thực hiện dịch vụ B" }];
        break;
      case 21:
        listData = [{ type: "error", content: "Hủy lịch dịch vụ C" }];
        break;
      case 25:
        listData = [{ type: "success", content: "Lịch thực hiện dịch vụ D" }];
        break;
      default:
        listData = [];
    }
    return listData || [];
  };

  const dateCellRender = (value: Moment) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge status={item.type as any} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  return (
    <div className="service-plan-page">
      <div className="header-section">
        <h1>Dịch vụ - Liệu trình của bạn</h1>
        <div className="search-bar">
          <Search
            placeholder="Tìm kiếm dịch vụ..."
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <div className="calendar-section">
      <div className="legend">
        <p>
          <div className="red-box"></div> Lịch đã đặt hẹn
        </p>
        <p>
          <div className="green-box"></div> Lịch đang thực hiện
        </p>
        <p>
          <div className="blue-box"></div> Lịch đã hoàn thành
        </p>
      </div>
        <div className="calendar">
        <Calendar fullscreen={false} onPanelChange={onPanelChange} />
        </div>
      </div>

      <div className="service-details">
        <h2>Chi tiết dịch vụ - Liệu trình của bạn</h2>
        <div className="details-card">
          <div className="info-card">
            <img
              src="https://via.placeholder.com/200"
              alt="Service"
              className="service-image"
            />
            <div className="info-section">
              <p>
                <strong>Dịch vụ:</strong> Tên dịch vụ
              </p>
              <p>
                <strong>Chi nhánh:</strong> Tên chi nhánh
              </p>
              <p>
                <strong>Thời gian:</strong> <span style={{color: 'red'}}><b>10:00 AM - 01:00 PM - T4 21/09/2024</b></span>
              </p>
              <p>
                <strong>Nhân viên:</strong> Tên nhân viên
              </p>
              <p>
                <strong>Giá tiền:</strong> 1.000.000đ
              </p>
            </div>
          </div>
          <div className="actions">
          <Button type="default">Hủy lịch</Button>
          <Button type="primary" className="btn-payment">Thanh toán</Button>
        </div>
        </div>
        
      </div>
    </div>
  );
};

export default MyServicePlanPage;
