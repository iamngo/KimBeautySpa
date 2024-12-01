import React, { useEffect, useMemo, useState } from "react";
import { Button, Skeleton, Tag, Switch, message } from "antd";
import { TiPlusOutline } from "react-icons/ti";
import DataTable from "../components/table/DataTable";
import "../styles.scss";
import { getAllService, getAllServiceCategory, updateStatusService } from "../../../services/api";
import { Service } from "../types";
import { MdDeleteForever } from "react-icons/md";
import Search from "antd/es/input/Search";
import { BiEdit } from "react-icons/bi";
import { MODE } from "../../../utils/constants";
import ServiceModal from "../components/modal/ServiceModal";

const ServicePage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [mode, setMode] = useState("");
  const [dataEdit, setDataEdit] = useState<Service>();
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<[]>([]);
  const [selectedColumns, setSelectedColumns] = useState([
    "id",
    "name",
    "image",
    "serviceCategoryId",
    "duration",
    "status",
    "actions",
  ]);
  const token = localStorage.getItem("accessToken") || "";

  useEffect(() => {
    fetchServices();
    fetchCategory();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    const response = await getAllService(1, 200);
    setServices(response?.data);
    console.log(response?.data);

    setLoading(false);
  };

  const fetchCategory = async () => {
    const response = await getAllServiceCategory(1, 100);
    setCategories(response?.data);
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
    return services.filter((service: Service) =>
      service.name.toLowerCase().includes(debouncedKeyword.toLowerCase())
    );
  }, [debouncedKeyword, services]);

  const handleColumnChange = (value: string[]) => {
    setSelectedColumns(
      value.includes("all")
        ? [
            "id",
            "name",
            "image",
            "serviceCategoryId",
            "duration",
            "status",
            "actions",
          ]
        : value
    );
  };

  const handleDeleteServiceFromLocalStorage = (name: string) => {
    const storedServices = localStorage.getItem("importedDataService");
    if (storedServices) {
      const servicesArray = JSON.parse(storedServices);
      const updatedServices = servicesArray.filter(
        (service: Service) => service.name !== name
      );
      localStorage.setItem(
        "importedDataService",
        JSON.stringify(updatedServices)
      );
      setServices(updatedServices);
    }
  };


  const handleStatusChange = async (checked: boolean, record: any) => {
    try {
      const newStatus = checked ? 'active' : 'inactive';
      const response = await updateStatusService(token, record.id, newStatus);
      if (response.data) {
        message.success(`${checked ? 'Kích hoạt' : 'Vô hiệu hóa'} dịch vụ thành công`);
        fetchServices(); // Refresh lại danh sách
      } else {
        message.error('Cập nhật trạng thái thất bại');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Đã có lỗi xảy ra khi cập nhật trạng thái');
    }
  };


  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "100px",
      align: "center" as "center",
      sorter: (a: Service, b: Service) => a.id - b.id,
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "name",
      key: "name",
      sorter: (a: Service, b: Service) => a.name.localeCompare(b.name),
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: "100px",
      align: "center" as "center",
      render: (image: string) => (
        <img
          src={image}
          alt="Dịch vụ"
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Phân loại",
      dataIndex: "serviceCategoryId",
      key: "serviceCategoryId",
      render: (serviceCategoryId: number) => {
        const category = categories.find((cat) => cat.id === serviceCategoryId);
        return category ? category.name : "Không xác định";
      },
      sorter: (a: Service, b: Service) =>
        a.serviceCategoryId - b.serviceCategoryId,
    },
    {
      title: "Thời gian",
      dataIndex: "duration",
      key: "duration",
      width: "150px",
      align: "center" as "center",
      sorter: (a: Service, b: Service) => a.duration - b.duration,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "150px",
      align: "center" as "center",
      render: (status: string, record: any) => (
        <Switch
          checked={status === 'active'}
          onChange={(checked) => handleStatusChange(checked, record)}
          checkedChildren="Hoạt động"
          unCheckedChildren="Ngừng"
          loading={loading}
        />
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: "200px",
      align: "center" as "center",
      render: (text: string, record: Service) => (
        <div>
          {record.isNew ? (
            <div>
              <Button type="link">
                <TiPlusOutline />
              </Button>
              <Button type="link" danger>
                <MdDeleteForever
                  onClick={() =>
                    handleDeleteServiceFromLocalStorage(record.name)
                  }
                />
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
      <ServiceModal
        visible={visibleModal}
        setVisible={setVisibleModal}
        mode={mode}
        service={dataEdit}
      />
      <div className="header-container">
        <h2>Quản lý dịch vụ</h2>
        <Search
          placeholder="Tìm kiếm dịch vụ bằng tên"
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
          Thêm dịch vụ
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

export default ServicePage;
