import React, { useState } from "react";
import { Layout, Menu, Avatar, Dropdown, Button } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import "./Header.scss"; 
import { FaGift, FaSpa } from "react-icons/fa";
import ModalRegister from "../modal/ModalRegister";

const { Header } = Layout;

const HeaderHomepage: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleMenuClick = ({ key }: { key: string }) => {
    // Xử lý khi click vào menu con
    if (key === "logout") {
      // Đăng xuất
      console.log("Logout clicked");
    }
  };

  const avatarMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="services" icon={<FaSpa />}>
        Dịch vụ - Liệu trình của bạn
      </Menu.Item>
      <Menu.Item key="gifts" icon={<FaGift />}>
        Tích điểm - Quà tặng
      </Menu.Item>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Cập nhật thông tin
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const handleRegisterClick = () => {
    setVisible(true); 
  };

  return (
    <Header className="custom-header">
      <div className="header-left">
        <img className="logo" src="/public/logo-homepage.svg" alt="Logo" />
        
      </div>

      <div className="header-right">
      <Menu mode="horizontal" className="main-menu" defaultSelectedKeys={['home']}>
          <Menu.Item key="home" >
            Trang chủ
          </Menu.Item>
          <Menu.Item key="services">
            Dịch vụ
          </Menu.Item>
          <Menu.Item key="treatments">
            Liệu trình
          </Menu.Item>
          <Menu.Item key="offer">
            Khuyến mãi
          </Menu.Item>
        </Menu>
        <Button onClick={handleRegisterClick}>Đăng ký ngay</Button>
        <Dropdown overlay={avatarMenu} trigger={['click']} visible={menuVisible} onVisibleChange={setMenuVisible}>
          <Avatar size="large" icon={<UserOutlined />} style={{ cursor: "pointer" }} />
        </Dropdown>
      </div>
      <ModalRegister visible={visible} setVisible={setVisible} />
    </Header>
  );
};

export default HeaderHomepage;
