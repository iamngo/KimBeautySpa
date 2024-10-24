import React from "react";
import { Layout, Button, Select, Avatar } from "antd";
import "./Header.scss";
import { FaBell, FaCodeBranch, FaFacebookMessenger } from "react-icons/fa";
const { Header } = Layout;
const { Option } = Select;

const CustomHeader: React.FC = () => {
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
        <Avatar
          size="large"
        />
      </div>
    </Header>
  );
};

export default CustomHeader;
