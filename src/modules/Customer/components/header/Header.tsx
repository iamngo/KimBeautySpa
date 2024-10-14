import React, { useEffect, useState } from "react";
import { Layout, Menu, Avatar, Dropdown, Button, message } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import "./Header.scss";
import { FaGift, FaSpa } from "react-icons/fa";
import ModalRegister from "../modal/ModalRegister";
import { useNavigate } from "react-router-dom";
import { HOME, LOGIN, MY_SERVICES, REWARD_POINTS, SERVICE, TREATMENTS } from "../../../../routes";

const { Header } = Layout;

const HeaderHomepage: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken") || '';
    if(accessToken !== ''){
      const payload = accessToken.split(".")[1];
      const decodedPayload = JSON.parse(atob(payload));
      console.log(decodedPayload.id);
      setUserId(decodedPayload.id);
    }
  }, [userId]);
  
  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "gifts") {
      navigate(`${REWARD_POINTS}`);
    }if (key === "services") {
      navigate(`${MY_SERVICES}`);
    }
    if (key === "logout") {
      localStorage.removeItem('accessToken');
      setUserId(null);
      message.success('Đăng xuất thành công!');
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
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const handleRegisterClick = () => {
    setVisible(true);
  };

  // Handle Menu navigation
  const handleMenuSelect = ({ key }: { key: string }) => {
    if (key === "home") {
      navigate(`${HOME}`);
    } else if (key === "services") {
      navigate(`${SERVICE}`);
    } else if (key === "treatments") {
      navigate(`${TREATMENTS}`);
    } else if (key === "offer") {
      navigate("/offer");
    }
  };

  return (
    <Header className="custom-header">
      <div className="header-left">
        <img className="logo" src="/public/logo-homepage.svg" alt="Logo" />
      </div>

      <div className="header-right">
        <Menu
          mode="horizontal"
          className="main-menu"
          defaultSelectedKeys={["home"]}
          onClick={handleMenuSelect}
        >
          <Menu.Item key="home">Trang chủ</Menu.Item>
          <Menu.Item key="services">Dịch vụ</Menu.Item>
          <Menu.Item key="treatments">Liệu trình</Menu.Item>
          <Menu.Item key="offer">Khuyến mãi</Menu.Item>
        </Menu>
        <Button onClick={handleRegisterClick}>Đặt lịch ngay</Button>
        {
          userId !== null ? (<Dropdown
            overlay={avatarMenu}
            trigger={["click"]}
            visible={menuVisible}
            onVisibleChange={setMenuVisible}
          >
            <Avatar
              size="large"
              icon={<UserOutlined />}
              style={{ cursor: "pointer" }}
            />
          </Dropdown>): (
            <div style={{cursor: 'pointer', color: 'var(--primaryColor)'}} onClick={()=>navigate(`${LOGIN}`)}>Đăng nhập / Đăng ký</div>
          )
        }
        
      </div>
      <ModalRegister visible={visible} setVisible={setVisible} userId={userId}/>
    </Header>
  );
};

export default HeaderHomepage;
