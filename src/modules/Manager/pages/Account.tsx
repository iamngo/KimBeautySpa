import React, { useEffect, useState } from "react";
import { Button, Skeleton } from "antd";
import { TiPlusOutline } from "react-icons/ti";
import DataTable from "./DataTable";
import "../styles.scss";
import { getAllAccount } from "../../../services/api";
import { Account } from "../types"; 
import { MdDeleteForever } from "react-icons/md";
import Search from "antd/es/input/Search";
import { BiEdit } from "react-icons/bi";

const AccountPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedColumns, setSelectedColumns] = useState(["id", "phone", "type", "status", "actions"]);
  const token = localStorage.getItem("accessToken") || "";

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    const response = await getAllAccount(token, 1, 100);
    setAccounts(response.data);
    setLoading(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleColumnChange = (value: string[]) => {
    setSelectedColumns(value.includes("all") ? ["id", "phone", "type", "status", "actions"] : value);
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", sorter: (a: Account, b: Account) => a.id - b.id},
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Type", dataIndex: "type", key: "type", sorter: (a: Account, b: Account) => a.type.localeCompare(b.type)},
    { title: "Status", dataIndex: "status", key: "status", sorter: (a: Account, b: Account) => a.status.localeCompare(b.status)}, 
    {
      title: "Actions",
      key: "actions",
      render: (text: string, record: Account) => (
        <div>
          <Button type="link"><BiEdit /></Button>
          <Button type="link" danger><MdDeleteForever /></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="manage-account">
      <div className="header-container">
        <Search placeholder="Search accounts" onChange={handleSearchChange} className="ant-input-search" size="large" />
        <Button type="primary" icon={<TiPlusOutline />} size="large">Add Account</Button>
      </div>
      {loading ? (
        <Skeleton active />
      ) : (
        <DataTable<Account>
          columns={columns}
          data={accounts}
          loading={loading}
          selectedColumns={selectedColumns}
          onColumnChange={handleColumnChange}
        />
      )}
    </div>
  );
};

export default AccountPage;
