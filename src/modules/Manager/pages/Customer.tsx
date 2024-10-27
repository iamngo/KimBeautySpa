import React, { useEffect, useState } from "react";
import { Button, Skeleton } from "antd";
import { TiPlusOutline } from "react-icons/ti";
import DataTable from "../components/table/DataTable";
import "../styles.scss";
import { getAllCustomer } from "../../../services/api";
import { Customer } from "../types";
import { MdDeleteForever } from "react-icons/md";
import Search from "antd/es/input/Search";
import { BiEdit } from "react-icons/bi";

const CustomerPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedColumns, setSelectedColumns] = useState([
    "id",
    "accountId",
    "fullName",
    "dob",
    "address",
    "phone",
    "gender",
    "image",
    "email",
    "actions",
  ]);
  const token = localStorage.getItem("accessToken") || "";

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    const response = await getAllCustomer(token, 1, 100);
    setCustomers(response.data);
    console.log(response.data);

    setLoading(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleColumnChange = (value: string[]) => {
    setSelectedColumns(
      value.includes("all")
        ? [
            "id",
            "accountId",
            "fullName",
            "dob",
            "address",
            "phone",
            "gender",
            "image",
            "email",
            "actions",
          ]
        : value
    );
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a: Customer, b: Customer) => a.id - b.id,
    },
    {
      title: "AccountId",
      dataIndex: "accountId",
      key: "accountId",
      sorter: (a: Customer, b: Customer) => a.accountId - b.accountId,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a: Customer, b: Customer) =>
        a.fullName.localeCompare(b.fullName),
    },
    { title: "Date Of Birth", dataIndex: "dob", key: "dob" },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      sorter: (a: Customer, b: Customer) => a.address.localeCompare(b.address),
    },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    { title: "Image", dataIndex: "image", key: "image" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Actions",
      key: "actions",
      render: (text: string, record: Customer) => (
        <div>
          <Button type="link">
            <BiEdit />
          </Button>
          <Button type="link" danger>
            <MdDeleteForever />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="manage-account">
      <div className="header-container">
        <Search
          placeholder="Search accounts"
          onChange={handleSearchChange}
          className="ant-input-search"
          size="large"
        />
        <Button type="primary" icon={<TiPlusOutline />} size="large">
          Add Account
        </Button>
      </div>
      {loading ? (
        <Skeleton active />
      ) : (
        <DataTable<Customer>
          columns={columns}
          data={customers}
          loading={loading}
          selectedColumns={selectedColumns}
          onColumnChange={handleColumnChange}
        />
      )}
    </div>
  );
};

export default CustomerPage;
