import React, { useState } from "react";
import { Button, Calendar, Badge, Input, CalendarProps, List, Tabs } from "antd";
import "../styles.scss";
import TabPane from "antd/es/tabs/TabPane";

const MyServicePlanPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const { Search } = Input;
  const [activeTab, setActiveTab] = useState("scheduled");

  const services = [
    { id: 1, type: "success", status: "completed", content: "Dịch vụ A - Đã hoàn thành" },
    { id: 2, type: "warning", status: "scheduled", content: "Dịch vụ B - Đã đặt hẹn" },
    { id: 3, type: "error", status: "ongoing", content: "Dịch vụ C - Đang thực hiện" },
    { id: 4, type: "success", status: "completed", content: "Dịch vụ D - Đã hoàn thành" },
  ];

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const filteredServices = services.filter((service) => service.status === activeTab);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
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
      <div className="tabs-section">
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane tab="Đã đặt hẹn" key="scheduled" />
          <TabPane tab="Đang thực hiện" key="ongoing" />
          <TabPane tab="Đã hoàn thành" key="completed" />
        </Tabs>

        <List
          itemLayout="horizontal"
          dataSource={filteredServices}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.content}
                description={item.content}
              />
              <div className="actions">
                {item.status === "scheduled" && (
                  <Button type="default">Hủy lịch</Button>
                )}
                {item.status === "ongoing" && (
                  <Button type="primary">Thanh toán</Button>
                )}
              </div>
            </List.Item>
          )}
        />
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
