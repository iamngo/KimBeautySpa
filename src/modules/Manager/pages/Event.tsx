import React, { useEffect, useMemo, useState } from "react";
import { Button, Skeleton } from "antd";
import { TiPlusOutline } from "react-icons/ti";
import DataTable from "../components/table/DataTable";
import "../styles.scss";
import { getAllAccount, getAllEvent } from "../../../services/api";
import { Account } from "../types";
import { MdDeleteForever } from "react-icons/md";
import Search from "antd/es/input/Search";
import { BiEdit } from "react-icons/bi";
import EventModal from "../components/modal/EventModal";
import { MODE } from "../../../utils/constants";
import { useBranch } from "../../../hooks/branchContext";

const EventPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<Account[]>([]);
  const [selectedColumns, setSelectedColumns] = useState([
    "id",
    "name",
    "startDate",
    "expiryDate",
    "image",
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

    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    console.log(token);

    setLoading(true);
    const response = await getAllEvent();
    setEvents(response?.data);
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

  const filteredEvents = useMemo(() => {
    return events?.filter((event: Event) =>
      event.name.toLowerCase().includes(debouncedKeyword.toLowerCase())
    );
  }, [debouncedKeyword, events]);

  const handleColumnChange = (value: string[]) => {
    setSelectedColumns(
      value.includes("all")
        ? ["id", "name", "startDate", "expiryDate", "image", "actions"]
        : value
    );
  };

  const handleDeleteEventFromLocalStorage = (phone: string) => {
    const storedEvents = localStorage.getItem("importedDataAccount");
    if (storedEvents) {
      const eventsArray = JSON.parse(storedEvents);
      const updatedEvents = eventsArray.filter(
        (account: Account) => account.phone !== phone
      );
      localStorage.setItem(
        "importedDataAccount",
        JSON.stringify(updatedEvents)
      );
      setEvents(updatedEvents);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a: Account, b: Account) => a.id - b.id,
    },
    { title: "Tên dịch vụ", dataIndex: "name", key: "name" },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      sorter: (a: Account, b: Account) => a.type.localeCompare(b.type),
      render: (dateTime: string) => {
        const date = new Date(dateTime);
        return date
          .toLocaleString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })
          .replace(",", "");
      },
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expiryDate",
      key: "expiryDate",
      sorter: (a: Account, b: Account) => a.status.localeCompare(b.status),
      render: (dateTime: string) => {
        const date = new Date(dateTime);
        return date
          .toLocaleString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })
          .replace(",", "");
      },
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (
        <img
          src={image}
          alt="Sự kiện"
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      ),
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
                    handleDeleteEventFromLocalStorage(record.phone)
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

  const handleAddEvent = () => {
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
      <EventModal
        visible={visibleModal}
        setVisible={setVisibleModal}
        mode={mode}
        account={dataEdit}
      />
      <div className="header-container">
        <Search
          placeholder="Tìm kiếm sự kiện theo tên"
          onChange={(e) => handleSearchChange(e.target.value)}
          className="ant-input-search"
          size="large"
        />
        <Button
          type="primary"
          className="btn-add"
          icon={<TiPlusOutline />}
          size="large"
          onClick={handleAddEvent}
        >
          Thêm sự kiện mới
        </Button>
      </div>
      {loading ? (
        <Skeleton active />
      ) : (
        <DataTable<Account>
          columns={columns}
          data={filteredEvents}
          loading={loading}
          selectedColumns={selectedColumns}
          onColumnChange={handleColumnChange}
          tableName="Account"
        />
      )}
    </div>
  );
};

export default EventPage;
