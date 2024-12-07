import React, { useEffect, useMemo, useState } from "react";
import { Button, message, Modal, Skeleton } from "antd";
import { TiPlusOutline } from "react-icons/ti";
import DataTable from "../components/table/DataTable";
import "../styles.scss";
import { deleteEvent, getAllEvent } from "../../../services/api";
import { Event } from "../types";
import { MdDeleteForever } from "react-icons/md";
import Search from "antd/es/input/Search";
import { BiEdit } from "react-icons/bi";
import EventModal from "../components/modal/EventModal";
import { MODE } from "../../../utils/constants";
import { useBranch } from "../../../hooks/branchContext";
import moment from "moment";

const EventPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedColumns, setSelectedColumns] = useState([
    "id",
    "name",
    "startDate",
    "expiryDate",
    "discount",
    "image",
    "actions",
  ]);
  const token = localStorage.getItem("accessToken") || "";
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [mode, setMode] = useState("");
  const [dataEdit, setDataEdit] = useState<Event>();
  const [refreshPage, setRefreshPage] = useState<boolean>(false);

  useEffect(() => {
    fetchEvents();
  }, [refreshPage]);

  const toggleRefresh = () => {
    setRefreshPage((prev) => !prev); // Correct usage
  };

  const fetchEvents = async () => {
    setLoading(true);
    const response = await getAllEvent();
    console.log(response?.data);
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
        ? [
            "id",
            "name",
            "startDate",
            "expiryDate",
            "discount",
            "image",
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
      width: "100px",
      align: "center" as "center",
      sorter: (a: Event, b: Event) => a.id - b.id,
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "name",
      key: "name",
      sorter: (a: Event, b: Event) => a.name.localeCompare(b.name),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (dateTime: string) => {
        const date = new Date(dateTime);
        return date
          .toLocaleString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .replace(",", "");
      },
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (dateTime: string) => {
        const date = new Date(dateTime);
        return date
          .toLocaleString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .replace(",", "");
      },
    },
    {
      title: "Chiết khấu",
      dataIndex: "discount",
      key: "discount",
      render: (text: number) => <span>{text > 0 ? `${text}%` : ""}</span>,
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
      width: "200px",
      align: "center",
      render: (text: string, record: Event) => (
        <div>
          <div>
            <Button type="link" onClick={() => handleEditEvent(record)}>
              <BiEdit />
            </Button>
            <Button type="link" danger>
              <MdDeleteForever onClick={() => handleDeleteEvent(record.id)} />
            </Button>
          </div>
        </div>
      ),
    },
  ];

  const handleDeleteEvent = (eventId: number) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa sự kiện này?",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk: async () => {
        try {
          const response = await deleteEvent(token, eventId);
          if (response?.data) {
            message.success("Xóa sự kiện thành công!");
            fetchEvents();
          } else {
            message.error("Xóa sự kiện thất bại!");
          }
        } catch (error) {
          console.error("Error deleting event:", error);
          message.error("Đã có lỗi xảy ra khi xóa sự kiện!");
        }
      },
    });
  };

  const handleAddEvent = () => {
    setVisibleModal(true);
    setMode(MODE.ADD);
  };
  const handleEditEvent = (event: Event) => {
    console.log(event);

    setVisibleModal(true);
    setMode(MODE.EDIT);
    setDataEdit({
      id: event.id,
      name: event.name,
      startDate: moment(event.startDate),
      expiryDate: moment(event.expiryDate),
      image: event.image,
    });
  };

  return (
    <div className="manage-account">
      <EventModal
        visible={visibleModal}
        setVisible={setVisibleModal}
        mode={mode}
        event={dataEdit}
        toggleRefresh={toggleRefresh}
      />
      <div className="header-container">
        <h2>Quản lý sự kiện</h2>
        <Search
          placeholder="Tìm kiếm sự kiện theo tên"
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
          onClick={handleAddEvent}
        >
          Thêm sự kiện mới
        </Button>
      </div>
      {loading ? (
        <Skeleton active />
      ) : (
        <DataTable<Event>
          columns={columns}
          data={filteredEvents}
          loading={loading}
          selectedColumns={selectedColumns}
          onColumnChange={handleColumnChange}
          tableName="Event"
          haveImport={false}
        />
      )}
    </div>
  );
};

export default EventPage;
