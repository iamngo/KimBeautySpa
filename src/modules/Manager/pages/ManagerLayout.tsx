import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaCalendarAlt,
  FaBoxes,
  FaClipboardList,
  FaShoppingCart,
  FaUsers,
  FaUserTie,
} from "react-icons/fa";
import "../styles.scss";
import { DASHBOARD, MANAGER } from "../../../routes";
import CustomHeader from "../components/header/CustomHeader";
import { ACCOUNT } from "../../../utils/constants";

const { Content, Sider } = Layout;

const ManagerLayout: React.FC = () => {
  const navigate = useNavigate();

    const [selectedKey, setSelectedKey] = useState("1"); 

  const handleMenuClick = (key: string) => {
    setSelectedKey(key); 
    if(key === '1'){
        navigate(`${MANAGER}/${DASHBOARD}`)
    }
    if(key === '2'){
      navigate(`${MANAGER}/${ACCOUNT}`)
  }
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
          <Menu.Item key="1" onClick={() => handleMenuClick("1")}>
            <FaHome />
            <span>Dashboard</span>
          </Menu.Item>
          <Menu.Item key="2" onClick={() => handleMenuClick("2")}>
            <FaUser />
            <span>Account</span>
          </Menu.Item>
          <Menu.Item key="3" onClick={() => handleMenuClick("3")}>
            <FaUsers />
            <span>Customer</span>
          </Menu.Item>
          <Menu.Item key="4" onClick={() => handleMenuClick("4")}>
            <FaUserTie />
            <span>Employee</span>
          </Menu.Item>
          <Menu.Item key="5" onClick={() => handleMenuClick("5")}>
            <FaClipboardList />
            <span>Service</span>
          </Menu.Item>
          <Menu.Item key="6" onClick={() => handleMenuClick("6")}>
            <FaBoxes />
            <span>Product</span>
          </Menu.Item>
          <Menu.Item key="7" onClick={() => handleMenuClick("7")}>
            <FaCalendarAlt />
            <span>Appointment</span>
          </Menu.Item>
          <Menu.Item key="8" onClick={() => handleMenuClick("8")}>
            <FaShoppingCart />
            <span>Order</span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Content>
        <CustomHeader/>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ManagerLayout;
