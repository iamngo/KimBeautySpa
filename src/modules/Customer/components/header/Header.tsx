import React, { useEffect, useState } from "react";
import { Layout, Menu, Avatar, Dropdown, Button, message } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import "./Header.scss";
import { FaGift, FaSpa } from "react-icons/fa";
import ModalRegister from "../modal/ModalRegister";
import { useNavigate } from "react-router-dom";
import {
  HOME,
  LOGIN,
  MY_SERVICES,
  PROMOTION,
  REWARD_POINTS,
  SERVICE,
  TREATMENTS,
} from "../../../../routes";
import {
  getAllServiceCategory,
  getServiceByCategory,
} from "../../../../services/api";
import ModalUpdateProfile from "../modal/ModalUpdateProfile";

const { Header } = Layout;
const { SubMenu } = Menu;

const HeaderHomepage: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [serviceCategory, setServiceCategory] = useState<any[]>([]);
  const [servicesByCategory, setServicesByCategory] = useState<any>({});
  const token = localStorage.getItem("accessToken");
  const [category, setCategory] = useState<string>("");
  const [updateProfileVisible, setUpdateProfileVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string>("home");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken") || "";
    if (accessToken !== "") {
      const payload = accessToken.split(".")[1];
      const decodedPayload = JSON.parse(atob(payload));
      setUserId(decodedPayload.id);
    }
    getServiceCategory();
  }, [userId]);

  const getServiceCategory = async () => {
    const response = await getAllServiceCategory(1, 100);
    setServiceCategory(response.data);
  };

  const getServiceByServiceCategory = async (serviceCategory: any) => {
    const response = await getServiceByCategory(serviceCategory.id, 1, 200);
    setServicesByCategory((prevServicesByCategory) => ({
      ...prevServicesByCategory,
      [serviceCategory.id]: response.data,
    }));
    setCategory(serviceCategory);
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "gifts") {
      navigate(`${REWARD_POINTS}`);
    }
    if (key === "services") {
      navigate(`${MY_SERVICES}`, {state: {userId: userId}});
    }
    if (key === "profile") {
      setUpdateProfileVisible(true);
    }
    if (key === "logout") {
      localStorage.removeItem("accessToken");
      setUserId(null);
      message.success("Đăng xuất thành công!");
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
    setSelectedKey(key);

    if (key === "home") {
      navigate(`${HOME}`);
    } else if (key === "services") {
      navigate(`${SERVICE}`);
    } else if (key.startsWith("service-")) {
      const serviceId = key.split("-")[1];
      navigate(`/${SERVICE}/${serviceId}`, {
        state: { category: category },
      });
    } else if (key === "treatments") {
      navigate(`${TREATMENTS}`);
    } else if (key === "promotion") {
      navigate(`${PROMOTION}`);
    }
  };

  const handleSubmenuCategoryServiceClick = (category: any) => {
    console.log(category);

    setSelectedKey(`service-category-${category.id}`);
    navigate(`category-services/${category.id}`, {
      state: { category: category },
    });
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
          selectedKeys={[selectedKey]}
          onClick={handleMenuSelect}
        >
          <Menu.Item key="home">Trang chủ</Menu.Item>

          {/* Submenu for service categories */}
          <SubMenu
            key="services"
            title="Dịch vụ"
            onTitleMouseEnter={() => getServiceCategory()}
          >
            {serviceCategory?.map((category) => (
              <SubMenu
                key={`service-category-${category.id}`}
                title={category.name}
                onTitleMouseEnter={() => getServiceByServiceCategory(category)}
                onTitleClick={() => handleSubmenuCategoryServiceClick(category)}
              >
                {(servicesByCategory[category.id] || []).map((service: any) => (
                  <Menu.Item key={`service-${service.id}`}>
                    {service.name}
                  </Menu.Item>
                ))}
              </SubMenu>
            ))}
          </SubMenu>

          <Menu.Item key="treatments">Liệu trình</Menu.Item>
          <Menu.Item key="promotion">Khuyến mãi</Menu.Item>
        </Menu>

        <Button onClick={handleRegisterClick}>Đặt lịch ngay</Button>
        {userId !== null ? (
          <Dropdown
            overlay={avatarMenu}
            trigger={["hover"]}
            visible={menuVisible}
            onVisibleChange={(flag) => setMenuVisible(flag)}
          >
            <Avatar
              size="large"
              icon={<UserOutlined />}
              style={{ cursor: "pointer" }}
            />
          </Dropdown>
        ) : (
          <div style={{ color: "var(--primaryColor)" }}>
            <Button
              size="small"
              className="btn-signup"
              onClick={() => navigate(`${LOGIN}`, { state: { signUp: false } })}
            >
              Đăng nhập
            </Button>{" "}
            /{" "}
            <Button
              size="small"
              className="btn-signup"
              onClick={() => navigate(`${LOGIN}`, { state: { signUp: true } })}
            >
              Đăng ký
            </Button>
          </div>
        )}
      </div>
      <ModalRegister
        visible={visible}
        setVisible={setVisible}
        userId={userId}
        serviceId={null}
        categoryId = {null}
      />
      <ModalUpdateProfile
        visible={updateProfileVisible}
        setVisible={setUpdateProfileVisible}
        userId={userId}
      />
    </Header>
  );
};

export default HeaderHomepage;
