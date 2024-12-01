import React, { useEffect, useState } from "react";
import { Layout, Button, Select, Avatar, Dropdown, Menu, message } from "antd";
import "./Header.scss";
import { FaBell, FaCodeBranch, FaFacebookMessenger } from "react-icons/fa";
import { TiUserOutline } from "react-icons/ti";
import { IoLogOutOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { HOME, LOGIN } from "../../../../routes";
import { getAllBranch, getInfoEmpByAccountId } from "../../../../services/api";
import { useBranch } from "../../../../hooks/branchContext";
import { BiHome } from "react-icons/bi";
const { Header } = Layout;
const { Option } = Select;

const CustomHeader: React.FC = () => {
  const [userId, setUserId] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const navigate = useNavigate();
  const [branches, setBranches] = useState();
  const { branchId, setBranchId } = useBranch();
  const location = useLocation();
  const [employee, setEmployee] = useState();
  const token = localStorage.getItem("accessToken");

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "backHome") {
      navigate(`${HOME}`);
    }
    if (key === "logout") {
      localStorage.removeItem("accessToken");
      setUserId(null);
      navigate(`${LOGIN}`, { state: { signUp: false } });
      message.success("Đăng xuất thành công!");
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken") || "";
    if (accessToken !== "") {
      const payload = accessToken.split(".")[1];
      const decodedPayload = JSON.parse(atob(payload));
      setUserId(decodedPayload.id);
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
        };
        getEmployee();
      }
    }
  }, [userId]);

  useEffect(() => {
    fetchBranch();
  }, []);

  const fetchBranch = async () => {
    const response = await getAllBranch(1, 10);
    setBranches(response.data);
  };

  const handleBranchChange = (value: string) => {
    setBranchId(value);
  };

  const avatarMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="backHome" icon={<BiHome />}>
        Quay lại trang chủ
      </Menu.Item>
      <Menu.Item key="logout" icon={<IoLogOutOutline />}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );
  return (
    <Header className="custom-header-admin">
      <div className="branch-info">
        <Select
          defaultValue={location.state?.branchId}
          value={branchId}
          onChange={handleBranchChange}
          style={{ width: "250px" }}
          suffixIcon={<FaCodeBranch />}
        >
          {branches?.map((branch) => (
            <Option key={branch.id} value={branch.id}>
              {branch.name} - {branch.address}
            </Option>
          ))}
        </Select>
      </div>
      <div className="actions">
        <Dropdown
          overlay={avatarMenu}
          trigger={["hover"]}
          visible={menuVisible}
          onVisibleChange={(flag) => setMenuVisible(flag)}
        >
          <Avatar
            size="large"
            src={employee?.image}
            icon={employee?.image ? undefined : <TiUserOutline />}
            style={{
              cursor: "pointer",
              border: "1px solid black",
              background: "white",
            }}
          />
        </Dropdown>
      </div>
    </Header>
  );
};

export default CustomHeader;
