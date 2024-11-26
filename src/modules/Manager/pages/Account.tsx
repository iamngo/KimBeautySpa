import React, { useEffect, useMemo, useState } from "react";
import { Button, Skeleton } from "antd";
import { TiPlusOutline } from "react-icons/ti";
import DataTable from "../components/table/DataTable";
import "../styles.scss";
import { getAllAccount } from "../../../services/api";
import { Account } from "../types";
import { MdDeleteForever } from "react-icons/md";
import Search from "antd/es/input/Search";
import { BiEdit } from "react-icons/bi";
import AccountModal from "../components/modal/AccountModal";
import { MODE } from "../../../utils/constants";
import { useBranch } from "../../../hooks/branchContext";

const AccountPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedColumns, setSelectedColumns] = useState([
    "id",
    "phone",
    "type",
    "status",
    "actions",
  ]);
  const token = localStorage.getItem("accessToken") || "";
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [mode, setMode] = useState("");
  const [dataEdit, setDataEdit] = useState<Account>();
  const { branchId, setBranchId } = useBranch();

  useEffect(() => {
    console.log(branchId);

    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    console.log(token);

    setLoading(true);
    const response = await getAllAccount(token, 1, 1, 100);
    setAccounts(response?.data);
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

  const filteredAccounts = useMemo(() => {
    return accounts?.filter((account: Account) =>
      account.phone.toLowerCase().includes(debouncedKeyword.toLowerCase())
    );
  }, [debouncedKeyword, accounts]);

  const handleColumnChange = (value: string[]) => {
    setSelectedColumns(
      value.includes("all")
        ? ["id", "phone", "type", "status", "actions"]
        : value
    );
  };

  const handleDeleteAccountFromLocalStorage = (phone: string) => {
    const storedAccounts = localStorage.getItem("importedDataAccount");
    if (storedAccounts) {
      const accountsArray = JSON.parse(storedAccounts);
      const updatedAccounts = accountsArray.filter(
        (account: Account) => account.phone !== phone
      );
      localStorage.setItem(
        "importedDataAccount",
        JSON.stringify(updatedAccounts)
      );
      setAccounts(updatedAccounts);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a: Account, b: Account) => a.id - b.id,
    },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      sorter: (a: Account, b: Account) => a.type.localeCompare(b.type),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      sorter: (a: Account, b: Account) => a.status.localeCompare(b.status),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (text: string, record: Account) => (
        <div>
          {record.isNew ? (
            <div>
              <Button type="link" onClick={() => handleEditAccount(record)}>
                <TiPlusOutline />
              </Button>
              <Button type="link" danger>
                <MdDeleteForever
                  onClick={() =>
                    handleDeleteAccountFromLocalStorage(record.phone)
                  }
                />
              </Button>
            </div>
          ) : (
            <div>
              <Button type="link" onClick={() => handleEditAccount(record)}>
                <BiEdit />
              </Button>
              <Button type="link" danger>
                <MdDeleteForever />
              </Button>
            </div>
          )}
        </div>
      ),
    },
  ];

  const handleAddAccount = () => {
    setVisibleModal(true);
    setMode(MODE.ADD);
  };
  const handleEditAccount = (account: Account) => {
    setVisibleModal(true);
    setMode(MODE.EDIT);
    setDataEdit(account);
  };

  return (
    <div className="manage-account">
      <AccountModal
        visible={visibleModal}
        setVisible={setVisibleModal}
        mode={mode}
        account={dataEdit}
      />
      <div className="header-container">
        <h2>Quản lý tài khoản</h2>
        <Search
          placeholder="Tìm kiếm tài khoản bằng số điện thoại"
          onChange={(e) => handleSearchChange(e.target.value)}
          className="ant-input-search"
          size="large"
          style={{ width: "600px" }}
        />
        <Button
          type="primary"
          className="btn-add"
          icon={<TiPlusOutline />}
          size="large"
          onClick={handleAddAccount}
        >
          Thêm tài khoản mới
        </Button>
      </div>
      {loading ? (
        <Skeleton active />
      ) : (
        <DataTable<Account>
          columns={columns}
          data={filteredAccounts}
          loading={loading}
          selectedColumns={selectedColumns}
          onColumnChange={handleColumnChange}
          tableName="Account"
        />
      )}
    </div>
  );
};

export default AccountPage;
