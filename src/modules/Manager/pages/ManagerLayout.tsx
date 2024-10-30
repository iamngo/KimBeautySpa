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
  FaBriefcase,
  FaMoneyBill,
  FaGift,
  FaClipboard,
  FaBuilding,
  FaDoorOpen,
  FaBed,
  FaChartLine,
} from "react-icons/fa";
import "../styles.scss";
import { DASHBOARD, MANAGER } from "../../../routes";
import CustomHeader from "../components/header/CustomHeader";
import { ACCOUNT, CUSTOMER, EMPLOYEE } from "../../../utils/constants";

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
          <Menu.Item className='dashboard' key="1" onClick={() => handleMenuClick("1", DASHBOARD)}>
            <FaHome />
            <span>Dashboard</span>
          </Menu.Item>

          {/* Quản lý Nhân sự */}
          <SubMenu key="2" icon={<FaUserTie />} title="QL Nhân sự">
            <Menu.Item key="2-1" onClick={() => handleMenuClick("2-1", EMPLOYEE)}>
              <FaUsers />
              <span>Nhân viên</span>
            </Menu.Item>
            <Menu.Item key="2-2" onClick={() => handleMenuClick("2-2", "working-time")}>
              <FaBriefcase />
              <span>Giờ làm việc</span>
            </Menu.Item>
            <Menu.Item key="2-3" onClick={() => handleMenuClick("2-3", "wage")}>
              <FaMoneyBill />
              <span>Lương</span>
            </Menu.Item>
            <Menu.Item key="2-4" onClick={() => handleMenuClick("2-4", "bonus")}>
              <FaGift />
              <span>Thưởng</span>
            </Menu.Item>
          </SubMenu>

          {/* Quản lý Khách hàng */}
          <SubMenu key="3" icon={<FaUser />} title="QL Khách hàng">
            <Menu.Item key="3-1" onClick={() => handleMenuClick("3-1", CUSTOMER)}>
              <FaUsers />
              <span>Khách hàng</span>
            </Menu.Item>
            <Menu.Item key="3-2" onClick={() => handleMenuClick("3-2", "prepaid-card")}>
              <FaClipboard />
              <span>Thẻ trả trước</span>
            </Menu.Item>
            <Menu.Item key="3-3" onClick={() => handleMenuClick("3-3", "card-history")}>
              <FaClipboardList />
              <span>Lịch sử thẻ</span>
            </Menu.Item>
            <Menu.Item key="3-4" onClick={() => handleMenuClick("3-4", "voucher")}>
              <FaGift />
              <span>Voucher</span>
            </Menu.Item>
            <Menu.Item key="3-5" onClick={() => handleMenuClick("3-5", "voucher-category")}>
              <FaClipboardList />
              <span>Loại voucher</span>
            </Menu.Item>
          </SubMenu>

          {/* Quản lý Sản phẩm & Dịch vụ */}
          <SubMenu key="4" icon={<FaClipboardList />} title="QL Sản phẩm & Dịch vụ">
            <Menu.Item key="4-1" onClick={() => handleMenuClick("4-1", "product")}>
              <FaBoxes />
              <span>Sản phẩm</span>
            </Menu.Item>
            <Menu.Item key="4-2" onClick={() => handleMenuClick("4-2", "service")}>
              <FaClipboard />
              <span>Dịch vụ</span>
            </Menu.Item>
            <Menu.Item key="4-3" onClick={() => handleMenuClick("4-3", "service-category")}>
              <FaClipboardList />
              <span>Loại dịch vụ</span>
            </Menu.Item>
            <Menu.Item key="4-4" onClick={() => handleMenuClick("4-4", "treatment-package")}>
              <FaBoxes />
              <span>Gói điều trị</span>
            </Menu.Item>
            <Menu.Item key="4-5" onClick={() => handleMenuClick("4-5", "treatment-service")}>
              <FaClipboard />
              <span>Dịch vụ điều trị</span>
            </Menu.Item>
          </SubMenu>

          {/* Quản lý Lịch Hẹn */}
          <SubMenu key="5" icon={<FaCalendarAlt />} title="QL Lịch Hẹn">
            <Menu.Item key="5-1" onClick={() => handleMenuClick("5-1", "appointment")}>
              <FaCalendarAlt />
              <span>Lịch hẹn</span>
            </Menu.Item>
            <Menu.Item key="5-2" onClick={() => handleMenuClick("5-2", "details-appointment")}>
              <FaClipboardList />
              <span>Chi tiết lịch hẹn</span>
            </Menu.Item>
            <Menu.Item key="5-3" onClick={() => handleMenuClick("5-3", "schedule")}>
              <FaChartLine />
              <span>Lịch làm việc</span>
            </Menu.Item>
          </SubMenu>

          {/* Quản lý Cơ sở & Phòng */}
          <SubMenu key="6" icon={<FaBuilding />} title="QL Cơ sở & Phòng">
            <Menu.Item key="6-1" onClick={() => handleMenuClick("6-1", "branch")}>
              <FaBuilding />
              <span>Chi nhánh</span>
            </Menu.Item>
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
            <Menu.Item key="7-1" onClick={() => handleMenuClick("7-1", "events")}>
              <FaCalendarAlt />
              <span>Sự kiện</span>
            </Menu.Item>
            <Menu.Item key="7-2" onClick={() => handleMenuClick("7-2", "detail-event")}>
              <FaClipboardList />
              <span>Chi tiết sự kiện</span>
            </Menu.Item>
            <Menu.Item key="7-3" onClick={() => handleMenuClick("7-3", "prices")}>
              <FaMoneyBill />
              <span>Giá</span>
            </Menu.Item>
          </SubMenu>

          {/* Quản lý Sản phẩm Sử dụng */}
          <SubMenu key="8" icon={<FaShoppingCart />} title="QL Sản phẩm Sử dụng">
            <Menu.Item key="8-1" onClick={() => handleMenuClick("8-1", "consumed-product")}>
              <FaBoxes />
              <span>Sản phẩm tiêu thụ</span>
            </Menu.Item>
            <Menu.Item key="8-2" onClick={() => handleMenuClick("8-2", "internal-expense")}>
              <FaMoneyBill />
              <span>Chi phí nội bộ</span>
            </Menu.Item>
          </SubMenu>
          
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
