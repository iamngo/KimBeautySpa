import React, { useEffect, useState } from "react";
import { Button, Input, Collapse, List, Tabs, Empty, message } from "antd";
import "../styles.scss";
import TabPane from "antd/es/tabs/TabPane";
import {
  cancelBookAppointment,
  getAppointmentByCustomerId,
  getBranchById,
  getEmployeeById,
  getInfoByAccountId,
  getPricesByForeignKeyId,
  getServiceById,
} from "../../../services/api";
import { useLocation } from "react-router-dom";

const { Panel } = Collapse;

const MyServicePlanPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const { Search } = Input;
  const [activeTab, setActiveTab] = useState("confirmed");
  const location = useLocation();
  const token = localStorage.getItem("accessToken");
  const [appointment, setAppointment] = useState<any[]>([]);

  useEffect(() => {
    fetchAppointment();
  }, [location.state.userId]);

  const fetchAppointment = async () => {
    const customer = await getInfoByAccountId(token, location.state.userId);
    if (customer.data !== null) {
      const response = await getAppointmentByCustomerId(
        token,
        customer.data.id
      );

      if (response.data !== null) {
        const appointmentsWithService = await Promise.all(
          response.data.map(async (appointment) => {
            const service = await getServiceById(
              appointment.serviceOrTreatmentId
            );
            const branch = await getBranchById(token, appointment.branchId);
            const employee = await getEmployeeById(
              token,
              appointment.employeeId
            );
            const price = await getPricesByForeignKeyId(
              token,
              appointment.serviceOrTreatmentId
            );
            return {
              ...appointment,
              service: service.data,
              branch: branch.data,
              employee: employee.data,
              price: price.data[0],
            };
          })
        );

        setAppointment(appointmentsWithService);
        console.log(appointmentsWithService);
      }
    }
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const filteredAppointment = appointment?.filter(
    (service) => service.status === activeTab
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const formatDateTime = (dateTime: string | Date) => {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleCancelBookingAppointment = async (id: number, date: Date) => {
    const currentDate = new Date();
    const twoDaysLater = new Date(currentDate.setDate(currentDate.getDate() + 2));
  
    if (new Date(date) > twoDaysLater) {
      const response = await cancelBookAppointment(id);
      if (response.data !== null) {
        message.success('Hủy lịch hẹn thành công!');
        
        await fetchAppointment();
      }
    } else {
      message.warning('Bạn chỉ có thể hủy lịch trước 2 ngày!');
    }
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
          <TabPane tab="Đã đặt hẹn" key="confirmed" />
          <TabPane tab="Đang thực hiện" key="performing" />
          <TabPane tab="Đã hoàn thành" key="finished" />
        </Tabs>

        <Collapse accordion>
          {filteredAppointment.length > 0 ? (
            filteredAppointment.map((item, index) => (
              <Panel
                header={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>
                      {item.service?.name || "Tên dịch vụ không xác định"}{" "}
                    </span>
                    <div className="actions">
                      {item.status === "confirmed" && (
                        <Button type="default" size="small" onClick={() => handleCancelBookingAppointment(item.id, item.dateTime)}>
                          Hủy lịch
                        </Button>
                      )}
                      {item.status === "performing" && (
                        <Button type="primary" size="small">
                          Thanh toán
                        </Button>
                      )}
                    </div>
                  </div>
                }
                key={index}
              >
                <div className="info-card">
                  <img
                    src="https://via.placeholder.com/200"
                    alt="Service"
                    className="service-image"
                  />
                  <div className="info-section">
                    <p>
                      <strong>Dịch vụ:</strong> {item.service?.name}
                    </p>
                    <p>
                      <strong>Chi nhánh:</strong>{" "}
                      {`${item.branch?.name} - ${item.branch?.address}`}
                    </p>
                    <p>
                      <strong>Thời gian:</strong>{" "}
                      <span style={{ color: "red" }}>
                        <b>{formatDateTime(item.dateTime)}</b>
                      </span>
                    </p>
                    <p>
                      <strong>Nhân viên:</strong> {item.employee?.fullName}
                    </p>
                    <p>
                      <strong>Giá tiền:</strong>&nbsp;
                      <s>
                       <small>
                          {item.price?.price?.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                       </small>
                      </s>&nbsp;&nbsp;
                      <span style={{ color: "red" }}>
                        <b>
                          {item.price?.specialPrice?.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </b>
                      </span>
                    </p>
                  </div>
                </div>
              </Panel>
            ))
          ) : (
            <Empty description="Không có dữ liệu" />
          )}
        </Collapse>
      </div>

      {/* <div className="service-details">
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
      </div> */}
    </div>
  );
};

export default MyServicePlanPage;
