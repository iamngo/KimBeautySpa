import React, { useEffect, useState } from "react";
import { Layout, Menu, Avatar, Dropdown, Button, message } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import "./Header.scss";
import { FaGift, FaSpa } from "react-icons/fa";
import ModalRegister from "../modal/ModalRegister";
import { useNavigate } from "react-router-dom";
import {
  DASHBOARD,
  EMPLOYEE_SCHEDULE,
  EMPLOYEE_PATH,
  HOME,
  LOGIN,
  MANAGER,
  MY_SERVICES,
  PROMOTION,
  REWARD_POINTS,
  SERVICE,
  TREATMENTS,
  PRODUCTS,
} from "../../../../routes";
import {
  getAllServiceCategory,
  getInfoByAccountId,
  getInfoEmpByAccountId,
  getServiceByCategory,
} from "../../../../services/api";
import ModalUpdateProfile from "../modal/ModalUpdateProfile";
import { GrFormSchedule, GrSystem } from "react-icons/gr";
import { AiFillSchedule } from "react-icons/ai";
import { useBranch } from "../../../../hooks/branchContext";

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
  const [customer, setCustomer] = useState();
  const [employee, setEmployee] = useState();
  const { branchId, setBranchId } = useBranch();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken") || "";
    if (accessToken !== "") {
      const payload = accessToken.split(".")[1];
      const decodedPayload = JSON.parse(atob(payload));
      setUserId(decodedPayload.id);

      if (decodedPayload.role === "customer") {
        const getCustomer = async () => {
          const response = await getInfoByAccountId(token, decodedPayload.id);
          setCustomer(response?.data);
        };
        getCustomer();
      }
      if (
        decodedPayload.role === "admin" ||
        decodedPayload.role === "manager" ||
        decodedPayload.role === "employee"
      ) {
        const getEmployee = async () => {
          const response = await getInfoEmpByAccountId(
            token,
            decodedPayload.id
          );
          setEmployee(response?.data);
          setBranchId(response?.data?.branchId);
          console.log(response?.data);
        };
        getEmployee();
      }
    }
    getServiceCategory();
  }, [userId, visible, updateProfileVisible]);

  const getServiceCategory = async () => {
    const response = await getAllServiceCategory(1, 100);
    setServiceCategory(response?.data);
  };

  const getServiceByServiceCategory = async (serviceCategory: any) => {
    const response = await getServiceByCategory(serviceCategory.id, 1, 200);
    setServicesByCategory((prevServicesByCategory) => ({
      ...prevServicesByCategory,
      [serviceCategory.id]: response?.data,
    }));
    setCategory(serviceCategory);
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "gifts") {
      navigate(`${REWARD_POINTS}`, { state: { userId: userId } });
    }
    if (key === "services") {
      navigate(`${MY_SERVICES}`, { state: { userId: userId } });
    }
    if (key === "profile") {
      setUpdateProfileVisible(true);
    }
    if (key === "logout") {
      localStorage.removeItem("accessToken");
      setUserId(null);
      message.success("Đăng xuất thành công!");
    }
    if (key === "manage") {
      navigate(`${MANAGER}/${DASHBOARD}`, { state: { branchId: branchId } });
    }
    if (key === "schedule") {
      navigate(`${EMPLOYEE_PATH}/${EMPLOYEE_SCHEDULE}`);
      localStorage.setItem("employeeId", employee?.id);
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
      {employee?.role === "employee" ||
      employee?.role === "admin" ||
      employee?.role === "manager" ? (
        <Menu.Item key="schedule" icon={<AiFillSchedule />}>
          Xem lịch làm
        </Menu.Item>
      ) : (
        ""
      )}
      {employee?.role === "admin" || employee?.role === "manager" ? (
        <Menu.Item key="manage" icon={<GrSystem />}>
          Quản lý hệ thống
        </Menu.Item>
      ) : (
        ""
      )}
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
    } else if (key === "products") {
      navigate(`${PRODUCTS}`);
    } else if (key === "promotion") {
      navigate(`${PROMOTION}`);
    }
  };

  const handleSubmenuCategoryServiceClick = (category: any) => {
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

          {/* <Menu.Item key="treatments">Liệu trình</Menu.Item> */}
          <Menu.Item key="products">Sản phẩm</Menu.Item>
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
              src={customer ? customer.image : employee?.image}
              icon={
                customer?.image || employee?.image ? undefined : (
                  <UserOutlined />
                )
              }
              style={{
                cursor: "pointer",
                border: "1px solid black",
                background: "white",
              }}
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
        categoryId={null}
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
