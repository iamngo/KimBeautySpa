import React, { useEffect, useMemo, useState } from "react";
import { Button, Skeleton, Modal, message } from "antd";
import { TiPlusOutline } from "react-icons/ti";
import DataTable from "../components/table/DataTable";
import "../styles.scss";
import { deleteCustomer, getAllCustomer } from "../../../services/api";
import { Customer } from "../types";
import { MdDeleteForever } from "react-icons/md";
import Search from "antd/es/input/Search";
import { BiEdit } from "react-icons/bi";
import CustomerModal from "../components/modal/CustomerModal";
import { MODE } from "../../../utils/constants";
import { ExclamationCircleFilled } from '@ant-design/icons';

const { confirm } = Modal;

const CustomerPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [mode, setMode] = useState("");
  const [dataEdit, setDataEdit] = useState<Customer>();
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedColumns, setSelectedColumns] = useState([
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
  }, [visibleModal]);

  const fetchCustomers = async () => {
    setLoading(true);
    const response = await getAllCustomer(token, 1, 100);
    setCustomers(response?.data);
    console.log(response?.data);

    setLoading(false);
  };

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const newTimeoutId = setTimeout(() => {
      setDebouncedKeyword(value);
    }, 1000);

    setTimeoutId(newTimeoutId);
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer: Customer) =>
      customer.phone.toLowerCase().includes(debouncedKeyword.toLowerCase())
    );
  }, [debouncedKeyword, customers]);

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

  const handleDeleteCustomerFromLocalStorage = (phone: string) => {
    const storedCustomers = localStorage.getItem("importedDataCustomer");
    if (storedCustomers) {
      const customersArray = JSON.parse(storedCustomers);
      const updatedCustomers = customersArray.filter(
        (customer: Customer) => customer.phone !== phone
      );
      localStorage.setItem(
        "importedDataCustomer",
        JSON.stringify(updatedCustomers)
      );
      setCustomers(updatedCustomers);
    }
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
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a: Customer, b: Customer) =>
        a.fullName.localeCompare(b.fullName),
    },
    { title: "Ngày sinh", dataIndex: "dob", key: "dob" },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      sorter: (a: Customer, b: Customer) => a.address.localeCompare(b.address),
    },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender: boolean) => (gender ? "Nam" : "Nữ"),
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (
        <img
          src={image}
          alt="Employee"
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      ),
    },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Hành động",
      key: "actions",
      render: (text: string, record: Customer) => (
        <div>
          {record.isNew ? (
            <div>
              <Button type="link">
                <TiPlusOutline />
              </Button>
              <Button type="link" danger>
                <MdDeleteForever
                  onClick={() =>
                    handleDeleteCustomerFromLocalStorage(record.phone)
                  }
                />
              </Button>
            </div>
          ) : (
            <div>
              <Button type="link" onClick={() => handleEditCustomer(record)}>
                <BiEdit />
              </Button>
              
            </div>
          )}
        </div>
      ),
    },
  ];

  const handleAddCustomer = () => {
    setVisibleModal(true);
    setMode(MODE.ADD);
  };
  const handleEditCustomer = (customer: Customer) => {
    setVisibleModal(true);
    setMode(MODE.EDIT);
    setDataEdit(customer);
  };

  return (
    <div className="manage-account">
      <CustomerModal
        visible={visibleModal}
        setVisible={setVisibleModal}
        mode={mode}
        customer={dataEdit}
      />
      <div className="header-container">
        <h2>Quản lý khách hàng</h2>
        <Search
          placeholder="Tìm kiếm khách hàng bằng số điện thoại"
          onChange={(e) => handleSearchChange(e.target.value)}
          className="ant-input-search"
          size="large"
          style={{ width: "600px" }}
        />
        <Button
          className="btn-add"
          type="primary"
          icon={<TiPlusOutline />}
          size="large"
          onClick={handleAddCustomer}
        >
          Thêm khách hàng
        </Button>
      </div>
      {loading ? (
        <Skeleton active />
      ) : (
        <DataTable<Customer>
          columns={columns}
          data={filteredCustomers}
          loading={loading}
          selectedColumns={selectedColumns}
          onColumnChange={handleColumnChange}
          tableName="Customer"
          haveImport={false}
        />
      )}
    </div>
  );
};

export default CustomerPage;
