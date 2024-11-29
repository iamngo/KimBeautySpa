import React, { useEffect, useState } from "react";
import { Button, Input, Collapse, List, Tabs, Empty, message } from "antd";
import "../styles.scss";
import TabPane from "antd/es/tabs/TabPane";
import {
  cancelBookAppointment,
  getAppointmentByCustomerId,
  getAppointmentDetailById,
  getBranchById,
  getEmployeeById,
  getInfoByAccountId,
  getPricesByForeignKeyId,
  getProductById,
  getServiceById,
  updateStatusAppointmentDetail,
} from "../../../services/api";
import { useLocation } from "react-router-dom";
import { ShoppingOutlined, CustomerServiceOutlined } from "@ant-design/icons";
import { RiCustomerServiceFill } from "react-icons/ri";
import { FaServicestack } from "react-icons/fa";

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
    try {
      const customer = await getInfoByAccountId(token, location.state.userId);
      if (!customer.data) {
        setAppointment([]);
        return;
      }
      const response = await getAppointmentByCustomerId(
        token,
        customer.data.id
      );
      if (!response.data || response.data.length === 0) {
        setAppointment([]);
        return;
      }
      const appointmentsWithDetails = await Promise.all(
        response.data.map(async (appointment) => {
          try {
            const appointmentDetails = await getAppointmentDetailById(
              token,
              appointment.id
            );
            if (
              !appointmentDetails.data ||
              appointmentDetails.data.length === 0
            )
              return null;

            const detailsWithInfo = await Promise.all(
              appointmentDetails.data.map(async (detail) => {
                const [branch, employee, prices, service, product] =
                  await Promise.all([
                    getBranchById(token, appointment.branchId),
                    getEmployeeById(token, detail.employeeId),
                    getPricesByForeignKeyId(detail.foreignKeyId),
                    getServiceById(detail.foreignKeyId),
                    getProductById(detail.foreignKeyId),
                  ]);

                return {
                  ...detail,
                  branch: branch.data,
                  employee: employee?.data,
                  prices: prices.data[0],
                  service: service?.data,
                  dateTime: appointment.dateTime,
                  product: product?.data,
                };
              })
            );

            return detailsWithInfo;
          } catch (error) {
            console.error("Lỗi khi xử lý chi tiết lịch hẹn:", error);
            return null;
          }
        })
      );
      const flattenedAppointments = appointmentsWithDetails
        .flat()
        .filter((item) => item !== null);
      setAppointment(flattenedAppointments);
      console.log(flattenedAppointments);
    } catch (error) {
      console.error("Lỗi khi lấy lịch hẹn:", error);
      message.error("Không thể tải lịch hẹn, vui lòng thử lại sau!");
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
    const twoDaysLater = new Date(
      currentDate.setDate(currentDate.getDate() + 2)
    );

    if (new Date(date) > twoDaysLater) {
      const response = await updateStatusAppointmentDetail(
        token,
        id,
        "canceled"
      );

      if (response.data !== null) {
        message.success("Hủy lịch hẹn thành công!");

        await fetchAppointment();
      }
    } else {
      message.warning("Bạn chỉ có thể hủy lịch trước 2 ngày!");
    }
  };

  return (
    <div className="service-plan-page">
      <div className="header-section">
        <h1>Dịch vụ - Sản phẩm của bạn</h1>
        <div className="search-bar">
          <Search
            placeholder="Tìm kiếm..."
            value={searchValue}
            onChange={handleSearchChange}
            style={{opacity:0}}
          />
        </div>
      </div>
      <div className="tabs-section">
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane tab="Đã đặt hẹn" key="confirmed" />
          <TabPane tab="Đang thực hiện" key="implement" />
          <TabPane tab="Đã hoàn thành" key="finished" />
          <TabPane tab="Đã hủy" key="canceled" />
        </Tabs>

        <Collapse accordion>
          {filteredAppointment.length > 0 ? (
            filteredAppointment.map((item, index) => (
              <Panel
                header={
                  <div className="panel-header">
                    <div className="left-section">
                      {item.category === "services" ? (
                        <FaServicestack className="type-icon service" />
                      ) : (
                        <ShoppingOutlined className="type-icon product" />
                      )}
                      <span className="item-name">
                        {item.service?.name ||
                          item.product?.name ||
                          "Không xác định"}
                      </span>
                    </div>
                    <div className="actions">
                      {item.status === "confirmed" && (
                        <Button
                          type="default"
                          size="small"
                          onClick={() =>
                            handleCancelBookingAppointment(
                              item.id,
                              item.dateTime
                            )
                          }
                        >
                          Hủy lịch
                        </Button>
                      )}
                    </div>
                  </div>
                }
                key={index}
              >
                <div
                  className={`info-card ${
                    item.service ? "service-card" : "product-card"
                  }`}
                >
                  <img
                    src={item.service?.image || item.product?.image}
                    alt={item.service?.name || item.product?.name}
                    className="item-image"
                  />
                  <div className="info-section">
                    <div className="type-badge">
                      {item.service ? "Dịch vụ" : "Sản phẩm"}
                    </div>
                    <p>
                      <strong>
                        {item.service ? "Tên dịch vụ:" : "Tên sản phẩm:"}
                      </strong>{" "}
                      {item.service?.name || item.product?.name}
                    </p>
                    <p>
                      <strong>Chi nhánh:</strong>{" "}
                      {`${item.branch?.name} - ${item.branch?.address}`}
                    </p>
                    <p>
                      <strong>Thời gian:</strong>{" "}
                      <span className="datetime">
                        {formatDateTime(item.dateTime)}
                      </span>
                    </p>
                    {item.service && (
                      <p>
                        <strong>Nhân viên:</strong> {item.employee?.fullName}
                      </p>
                    )}
                    <p className="price-section">
                      <strong>Giá tiền:</strong>{" "}
                      <s className="original-price">
                        {item.prices?.price?.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </s>
                      <span className="special-price">
                        {item.prices?.specialPrice?.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
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
    </div>
  );
};

export default MyServicePlanPage;
