import React, { useState } from "react";
import { Layout, Button, Select, Avatar, Dropdown, Menu, message } from "antd";
import "./Header.scss";
import { FaBell, FaCodeBranch, FaFacebookMessenger } from "react-icons/fa";
import { TiUserOutline } from "react-icons/ti";
import { IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { LOGIN } from "../../../../routes";
const { Header } = Layout;
const { Option } = Select;

const CustomHeader: React.FC = () => {
  const [userId, setUserId] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const navigate = useNavigate();


  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "profile") {
      // setUpdateProfileVisible(true);
    }
    if (key === "logout") {
      localStorage.removeItem("accessToken");
      setUserId(null);
      navigate(`${LOGIN}`, { state: { signUp: false } });
      message.success("Đăng xuất thành công!");
      
    }
  };
  const avatarMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile" icon={<TiUserOutline />}>
        Cập nhật thông tin
      </Menu.Item>
      <Menu.Item key="logout" icon={<IoLogOutOutline />}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );
  return (
    <Header className="custom-header-admin">
      <div className="branch-info">
      <Select defaultValue="Chi nhánh số 1" style={{ width: 200 }} suffixIcon={<FaCodeBranch />}>
          <Option value="1">Chi nhánh số 1</Option>
          <Option value="2">Chi nhánh số 2</Option>
        </Select>
      </div>
      <div className="actions">
        <Button icon={<FaBell />} type="text" />
        <Button icon={<FaFacebookMessenger />} type="text" />
        <Dropdown
            overlay={avatarMenu}
            trigger={["hover"]}
            visible={menuVisible}
            onVisibleChange={(flag) => setMenuVisible(flag)}
          >
            <Avatar
              size="large"
              icon={<TiUserOutline />}
              style={{ cursor: "pointer" }}
            />
          </Dropdown>
      </div>
    </Header>
  );
};

export default CustomHeader;
