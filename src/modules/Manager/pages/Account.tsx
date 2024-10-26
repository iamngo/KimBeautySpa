import React, { useEffect, useMemo, useState } from "react";
import { Button, Skeleton } from "antd";
import { TiPlusOutline } from "react-icons/ti";
import DataTable from "./DataTable";
import "../styles.scss";
import { getAllAccount } from "../../../services/api";
import { Account } from "../types"; 
import { MdDeleteForever } from "react-icons/md";
import Search from "antd/es/input/Search";
import { BiEdit } from "react-icons/bi";
import AccountModal from "../components/modal/AccountModal";
import { MODE } from "../../../utils/constants";

const AccountPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedColumns, setSelectedColumns] = useState(["id", "phone", "type", "status", "actions"]);
  const token = localStorage.getItem("accessToken") || "";
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>(""); 
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [mode, setMode] = useState("");
  const [dataEdit, setDataEdit] = useState<Account>();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    const response = await getAllAccount(token, 1, 100);
    setAccounts(response.data);
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

  const filteredServices = useMemo(() => {
    return accounts.filter((account: Account) =>
      account.phone.toLowerCase().includes(debouncedKeyword.toLowerCase())
    );
  }, [debouncedKeyword, accounts]);

  const handleColumnChange = (value: string[]) => {
    setSelectedColumns(value.includes("all") ? ["id", "phone", "type", "status", "actions"] : value);
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", sorter: (a: Account, b: Account) => a.id - b.id},
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    { title: "Loại", dataIndex: "type", key: "type", sorter: (a: Account, b: Account) => a.type.localeCompare(b.type)},
    { title: "Trạng thái", dataIndex: "status", key: "status", sorter: (a: Account, b: Account) => a.status.localeCompare(b.status)}, 
    {
      title: "Hành động",
      key: "actions",
      render: (text: string, record: Account) => (
        <div>
          <Button type="link" onClick={() => handleEditAccount(record)}><BiEdit /></Button>
          <Button type="link" danger><MdDeleteForever /></Button>
        </div>
      ),
    },
  ];

  const handleAddAccount = () => {
    setVisibleModal(true);
    setMode(MODE.ADD);
  }
  const handleEditAccount = (account: Account) => {
    setVisibleModal(true);
    setMode(MODE.EDIT);
    setDataEdit(account);
    
  }

  return (
    <div className="manage-account">
      <AccountModal visible={visibleModal} setVisible={setVisibleModal} mode={mode} account={dataEdit}/>
      <div className="header-container">
        <Search placeholder="Search account by phone..." onChange={(e) => handleSearchChange(e.target.value)} className="ant-input-search" size="large" />
        <Button type="primary" icon={<TiPlusOutline />} size="large" onClick={handleAddAccount}>Thêm tài khoản mới</Button>
      </div>
      {loading ? (
        <Skeleton active />
      ) : (
        <DataTable<Account>
          columns={columns}
          data={filteredServices}
          loading={loading}
          selectedColumns={selectedColumns}
          onColumnChange={handleColumnChange}
        />
      )}
    </div>
  );
};

export default AccountPage;