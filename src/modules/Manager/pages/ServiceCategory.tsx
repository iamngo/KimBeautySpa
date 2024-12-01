import React, { useEffect, useMemo, useState } from "react";
import { Button, message, Skeleton } from "antd";
import { TiPlusOutline } from "react-icons/ti";
import DataTable from "../components/table/DataTable";
import "../styles.scss";
import {
  deleteServiceCategory,
  getAllRoom,
  getAllServiceCategory,
} from "../../../services/api";
import { Service } from "../types";
import { MdDeleteForever } from "react-icons/md";
import Search from "antd/es/input/Search";
import { BiEdit } from "react-icons/bi";
import { MODE } from "../../../utils/constants";
import ServiceModal from "../components/modal/ServiceModal";
import ServiceCategoryModal from "../components/modal/ServiceCategory";

const ServiceCategoryPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [mode, setMode] = useState("");
  const [dataEdit, setDataEdit] = useState<Service>();
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Service[]>([]);
  const [rooms, setRooms] = useState<[]>([]);
  const [selectedColumns, setSelectedColumns] = useState([
    "id",
    "name",
    "roomId",
    "actions",
  ]);
  const token = localStorage.getItem("accessToken") || "";

  useEffect(() => {
    fetchCategory();
  }, [visibleModal]);

  const fetchCategory = async () => {
    setLoading(true);
    const responseRoom = await getAllRoom(1, 200);
    setRooms(responseRoom.data);

    const response = await getAllServiceCategory(1, 100);
    const serviceCategoryDetail = response?.data?.map((serviceCategory) => {
      const room = responseRoom.data.find(
        (room) => room.id === serviceCategory.roomId
      );
      return {
        ...serviceCategory,
        roomName: room ? room.name : "N/A",
      };
    });

    setCategories(serviceCategoryDetail);
    setLoading(false);
  };

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    if (timeoutId) clearTimeout(timeoutId);

    const newTimeoutId = setTimeout(() => {
      setDebouncedKeyword(value);
    }, 1000);

    setTimeoutId(newTimeoutId);
  };

  const filteredServices = useMemo(() => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(debouncedKeyword.toLowerCase())
    );
  }, [debouncedKeyword, categories]);

  const handleColumnChange = (value: string[]) => {
    setSelectedColumns(
      value.includes("all") ? ["id", "name", "roomId", "actions"] : value
    );
  };

  const handleDeleteServiceCategory = async (id: number) => {
    const response = await deleteServiceCategory(token, id);
    if (response?.data !== null) {
      message.success("Xóa thành công!");
      fetchCategory();
    } else {
      message.error("Xóa thất bại");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "100px",
      align: "center" as "center",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Tên phân loại dịch vụ",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Phòng",
      dataIndex: "roomName", // Hiển thị roomName thay vì roomId
      key: "roomId",
      sorter: (a, b) => (a.roomName || "").localeCompare(b.roomName || ""),
    },
    {
      title: "Hành động",
      key: "actions",
      width: "200px",
      align: "center" as "center",
      render: (_: string, record: Service) => (
        <div>
          {record.isNew ? (
            <div>
              <Button type="link">
                <TiPlusOutline />
              </Button>
              <Button type="link" danger>
                <MdDeleteForever />
              </Button>
            </div>
          ) : (
            <div>
              <Button type="link" onClick={() => handleEditService(record)}>
                <BiEdit />
              </Button>
            </div>
          )}
        </div>
      ),
    },
  ];

  const handleAddService = () => {
    setVisibleModal(true);
    setMode(MODE.ADD);
  };

  const handleEditService = (service: Service) => {
    setVisibleModal(true);
    setMode(MODE.EDIT);
    setDataEdit(service);
  };

  return (
    <div className="manage-account">
      <ServiceCategoryModal
        visible={visibleModal}
        setVisible={setVisibleModal}
        mode={mode}
        service={dataEdit}
      />
      <div className="header-container">
        <h2>Quản lý phân loại dịch vụ</h2>
        <Search
          placeholder="Tìm kiếm phân loại dịch vụ theo tên"
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
          onClick={handleAddService}
        >
          Thêm phân loại
        </Button>
      </div>
      {loading ? (
        <Skeleton active />
      ) : (
        <DataTable<Service>
          columns={columns}
          data={filteredServices}
          loading={loading}
          selectedColumns={selectedColumns}
          onColumnChange={handleColumnChange}
          tableName="Service"
          haveImport={false}
        />
      )}
    </div>
  );
};

export default ServiceCategoryPage;
