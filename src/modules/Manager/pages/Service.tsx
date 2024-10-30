import React, { useEffect, useMemo, useState } from "react";
import { Button, Skeleton } from "antd";
import { TiPlusOutline } from "react-icons/ti";
import DataTable from "../components/table/DataTable";
import "../styles.scss";
import { getAllCustomer, getAllService } from "../../../services/api";
import { Service } from "../types";
import { MdDeleteForever } from "react-icons/md";
import Search from "antd/es/input/Search";
import { BiEdit } from "react-icons/bi";
import { MODE } from "../../../utils/constants";
import ServiceModal from "../components/modal/ServiceModal";

const  ServicePage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [mode, setMode] = useState("");
  const [dataEdit, setDataEdit] = useState<Service>();
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
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
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    const response = await getAllService(1, 200);
    setServices(response.data);
    console.log(response.data);

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
    return services.filter((service: Service) =>
      service.phone.toLowerCase().includes(debouncedKeyword.toLowerCase())
    );
  }, [debouncedKeyword, services]);


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

  const handleDeleteServiceFromLocalStorage = (phone: string) => {
    const storedServices = localStorage.getItem("importedDataService");
    if (storedServices) {
      const servicesArray = JSON.parse(storedServices);
      const updatedServices = servicesArray.filter(
        (service: Service) => service.phone !== phone
      );
      localStorage.setItem("importedDataService", JSON.stringify(updatedServices));
      setServices(updatedServices);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a: Service, b: Service) => a.id - b.id,
    },
    {
      title: "AccountId",
      dataIndex: "accountId",
      key: "accountId",
      sorter: (a: Service, b: Service) => a.accountId - b.accountId,
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a: Service, b: Service) =>
        a.fullName.localeCompare(b.fullName),
    },
    { title: "Ngày sinh", dataIndex: "dob", key: "dob" },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      sorter: (a: Service, b: Service) => a.address.localeCompare(b.address),
    },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    { title: "Giới tính", dataIndex: "gender", key: "gender", render: (gender: boolean) => (gender ? 'Nam' : 'Nữ')},
    { title: "Hình ảnh", dataIndex: "image", key: "image" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Hành động",
      key: "actions",
      render: (text: string, record: Service) => (
        <div>
          {record.isNew ? (
            <div>
              <Button type="link" >
                <TiPlusOutline />
              </Button>
               <Button type="link" danger>
               <MdDeleteForever onClick={() => handleDeleteServiceFromLocalStorage(record.phone)}/>
             </Button>
            </div>
          ) : (
            <div>
              <Button type="link" onClick={() => handleEditService(record)}>
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

  const handleAddService = () => {
    setVisibleModal(true);
    setMode(MODE.ADD);
  };
  const handleEditService= (service: Service) => {
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
        <Search
          placeholder="Tìm kiếm dịch vụ bằng số điện thoại"
          onChange={(e) => handleSearchChange(e.target.value)}
          className="ant-input-search"
          size="large"
        />
        <Button type="primary" icon={<TiPlusOutline />} size="large" onClick={handleAddService}>
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
        />
      )}
    </div>
  );
};

export default ServicePage;
