import React from "react";
import { Layout } from "antd";
import HeaderHomepage from "../components/header/Header"; 
import { Outlet } from "react-router-dom";
import "../styles.scss";

const { Content } = Layout;

const HomepageLayout: React.FC = () => {
  return (
    <Layout className="customer-layout">
      <HeaderHomepage />
      <Layout className="site-layout">
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default HomepageLayout;
