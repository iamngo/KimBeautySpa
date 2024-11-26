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
  FaMoneyBill,
  FaGift,
  FaClipboard,
  FaBuilding,
  FaDoorOpen,
  FaBed,
  FaChartLine,
  FaUserCheck,
} from "react-icons/fa";
import "../styles.scss";
import { DASHBOARD, MANAGER } from "../../../routes";
import CustomHeader from "../components/header/CustomHeader";
import {
  ACCOUNT,
  APPOINTMENT,
  ATTENDANCE_CHECKING,
  CUSTOMER,
  EMPLOYEE,
  GIFT,
  MANAGE_SCHEDULE,
  SERVICE,
  SERVICE_CATEGORY,
  VOUCHER,
  WAGE,
} from "../../../utils/constants";
import { MdAccountBox } from "react-icons/md";
import { FaGifts } from "react-icons/fa6";

const { Content, Sider } = Layout;
const { SubMenu } = Menu;

const ManagerLayout: React.FC = () => {
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState("1");

  const handleMenuClick = (key: string, path: string) => {
    setSelectedKey(key);
    navigate(`${MANAGER}/${path}`);
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
          {/* Dashboard */}
          <Menu.Item
            className="dashboard"
            key="1"
            onClick={() => handleMenuClick("1", DASHBOARD)}
          >
            <FaHome />
            <span>Dashboard</span>
          </Menu.Item>

          {/* Quản lý Nhân sự */}
          <SubMenu key="2" icon={<FaUserTie />} title="QL Nhân sự">
            <Menu.Item
              key="2-1"
              onClick={() => handleMenuClick("2-1", EMPLOYEE)}
            >
              <FaUsers />
              <span>Nhân viên</span>
            </Menu.Item>
            <Menu.Item
              key="2-2"
              onClick={() => handleMenuClick("2-2", MANAGE_SCHEDULE)}
            >
              <FaChartLine />
              <span>Lịch làm việc</span>
            </Menu.Item>
            <Menu.Item
              key="2-3"
              onClick={() => handleMenuClick("2-3", ATTENDANCE_CHECKING)}
            >
              <FaUserCheck />
              <span>Chấm công</span>
            </Menu.Item>
            <Menu.Item key="2-4" onClick={() => handleMenuClick("2-4", WAGE)}>
              <FaMoneyBill />
              <span>Mức lương</span>
            </Menu.Item>
          </SubMenu>

          {/* Quản lý Khách hàng */}
          <SubMenu key="3" icon={<FaUser />} title="QL Khách hàng">
            <Menu.Item
              key="3-1"
              onClick={() => handleMenuClick("3-1", CUSTOMER)}
            >
              <FaUsers />
              <span>Khách hàng</span>
            </Menu.Item>
            
            <Menu.Item
              key="3-4"
              onClick={() => handleMenuClick("3-4", VOUCHER)}
            >
              <FaGifts />
              <span>Voucher</span>
            </Menu.Item>
            <Menu.Item
              key="3-5"
              onClick={() => handleMenuClick("3-5", GIFT)}
            >
              <FaGift />
              <span>Quà tặng</span>
            </Menu.Item>
          </SubMenu>

          {/* Quản lý Sản phẩm & Dịch vụ */}
          <SubMenu
            key="4"
            icon={<FaClipboardList />}
            title="QL Sản phẩm & Dịch vụ"
          >
            <Menu.Item
              key="4-1"
              onClick={() => handleMenuClick("4-1", "product")}
            >
              <FaBoxes />
              <span>Sản phẩm</span>
            </Menu.Item>
            <Menu.Item
              key="4-2"
              onClick={() => handleMenuClick("4-2", SERVICE)}
            >
              <FaClipboard />
              <span>Dịch vụ</span>
            </Menu.Item>
            <Menu.Item
              key="4-3"
              onClick={() => handleMenuClick("4-3", SERVICE_CATEGORY)}
            >
              <FaClipboardList />
              <span>Loại dịch vụ</span>
            </Menu.Item>
            {/* <Menu.Item
              key="4-4"
              onClick={() => handleMenuClick("4-4", "treatment-package")}
            >
              <FaBoxes />
              <span>Gói điều trị</span>
            </Menu.Item>
            <Menu.Item
              key="4-5"
              onClick={() => handleMenuClick("4-5", "treatment-service")}
            >
              <FaClipboard />
              <span>Dịch vụ điều trị</span>
            </Menu.Item> */}
          </SubMenu>

          {/* Quản lý Lịch Hẹn */}
            <Menu.Item
            className="appointment"
              key="5"
              onClick={() => handleMenuClick("5", APPOINTMENT)}
            >
              <FaCalendarAlt />
              <span>Quản lý Lịch hẹn</span>
            </Menu.Item>

          {/* Quản lý Cơ sở & Phòng */}
          <SubMenu key="6" icon={<FaBuilding />} title="QL Cơ sở & Phòng">
           
            <Menu.Item key="6-2" onClick={() => handleMenuClick("6-2", "room")}>
              <FaDoorOpen />
              <span>Phòng</span>
            </Menu.Item>
            <Menu.Item key="6-3" onClick={() => handleMenuClick("6-3", "bed")}>
              <FaBed />
              <span>Giường</span>
            </Menu.Item>
          </SubMenu>

          {/* Quản lý Sự Kiện */}
          <SubMenu key="7" icon={<FaClipboard />} title="QL Sự Kiện">
            <Menu.Item
              key="7-1"
              onClick={() => handleMenuClick("7-1", "events")}
            >
              <FaCalendarAlt />
              <span>Sự kiện</span>
            </Menu.Item>
            <Menu.Item
              key="7-2"
              onClick={() => handleMenuClick("7-2", "detail-event")}
            >
              <FaClipboardList />
              <span>Chi tiết sự kiện</span>
            </Menu.Item>
            <Menu.Item
              key="7-3"
              onClick={() => handleMenuClick("7-3", "prices")}
            >
              <FaMoneyBill />
              <span>Giá</span>
            </Menu.Item>
          </SubMenu>

          {/* Quản lý Sản phẩm Sử dụng */}
          <SubMenu
            key="8"
            icon={<FaShoppingCart />}
            title="QL Sản phẩm Sử dụng"
          >
            <Menu.Item
              key="8-1"
              onClick={() => handleMenuClick("8-1", "consumed-product")}
            >
              <FaBoxes />
              <span>Sản phẩm tiêu thụ</span>
            </Menu.Item>
            <Menu.Item
              key="8-2"
              onClick={() => handleMenuClick("8-2", "internal-expense")}
            >
              <FaMoneyBill />
              <span>Chi phí nội bộ</span>
            </Menu.Item>
          </SubMenu>

          <Menu.Item
            className="account"
            key="9"
            onClick={() => handleMenuClick("9", ACCOUNT)}
          >
            <MdAccountBox />
            <span>QL Tài khoản</span>
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

export default ManagerLayout;
