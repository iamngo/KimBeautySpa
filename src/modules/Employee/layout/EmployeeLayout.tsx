import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaMoneyBillWave,
} from "react-icons/fa";
import "../styles.scss";
import { EMPLOYEE_PATH, EMPLOYEE_SALARY, EMPLOYEE_SCHEDULE } from "../../../routes";
import CustomHeader from "../../Manager/components/header/CustomHeader";


const { Content, Sider } = Layout;

const EmployeeLayout: React.FC = () => {
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState("1");

  const handleMenuClick = (key: string, path: string) => {
    setSelectedKey(key);
    navigate(`${EMPLOYEE_PATH}/${path}`);
  };

  return (
    <Layout className="manager-layout">
      <div className="background"></div>
      <Sider collapsible className="sider">
        <img
          className="logo"
          src="/public/logo-name.svg"
          alt="kim-beauty-spa-logo"
        />
        <Menu mode="inline" selectedKeys={[selectedKey]}>
          {/* Lịch làm việc */}
          <Menu.Item
            key="1"
            onClick={() => handleMenuClick("1", EMPLOYEE_SCHEDULE)}
          >
            <FaCalendarAlt />
            <span>Lịch làm việc</span>
          </Menu.Item>

          {/* Xem lương */}
          <Menu.Item
            key="2"
            onClick={() => handleMenuClick("2", EMPLOYEE_SALARY)}
          >
            <FaMoneyBillWave />
            <span>Xem lương</span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Content>
          <CustomHeader />
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default EmployeeLayout;
