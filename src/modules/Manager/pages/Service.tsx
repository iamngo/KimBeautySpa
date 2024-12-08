import React, { useEffect, useMemo, useState } from "react";
import { Button, Skeleton, Tag, Switch, message, Select } from "antd";
import { TiPlusOutline } from "react-icons/ti";
import DataTable from "../components/table/DataTable";
import "../styles.scss";
import {
  getAllEvent,
  getAllService,
  getAllServiceCategory,
  getPricesByForeignKeyId,
  updateStatusService,
} from "../../../services/api";
import { Service } from "../types";
import { MdDeleteForever } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import { MODE } from "../../../utils/constants";
import ServiceModal from "../components/modal/ServiceModal";

const { Option } = Select;

const ServicePage: React.FC = () => {
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [mode, setMode] = useState("");
  const [dataEdit, setDataEdit] = useState<Service>();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedColumns, setSelectedColumns] = useState([
    "id",
    "name",
    "image",
    'price',
    'specialPrice',
    'eventId',
    "status",
    "actions",
  ]);
  const token = localStorage.getItem("accessToken") || "";
  const [prices, setPrices] = useState<{ [key: string]: any }>({});
  const [event, setEvent] = useState<{ [key: string]: string }>({});


  useEffect(() => {
    fetchServices();
    fetchCategory();
    fetchEvent();
  }, [visibleModal]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await getAllService(1, 200);
      setServices(response?.data);

      const pricePromises = response.data.map(async (service: Service) => {
        const priceResponse = await getPricesByForeignKeyId(service.id); 
        return { serviceId: service.id, prices: priceResponse?.data };
      });

      const pricesArray = await Promise.all(pricePromises);
      const pricesMap = pricesArray.reduce((acc, { serviceId, prices }) => {
        acc[serviceId] = prices; 
        return acc;
      }, {} as { [key: string]: any });

      setPrices(pricesMap); 
      
    } catch (error) {
      console.error("Lỗi khi lấy dịch vụ:", error);
      message.error("Lỗi khi lấy dịch vụ!");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategory = async () => {
    const response = await getAllServiceCategory(1, 100);
    setCategories(response?.data);
  };

  const fetchEvent = async () => {
    try {
      const response = await getAllEvent(); // Gọi API để lấy tất cả sự kiện
      const eventsMap = response.data.reduce((acc: any, event: any) => {
        acc[event.id] = event.name; // Lưu tên sự kiện với ID làm key
        return acc;
      }, {});
      setEvent(eventsMap); // Cập nhật state sự kiện
    } catch (error) {
      console.error("Lỗi khi lấy sự kiện:", error);
      message.error("Lỗi khi lấy sự kiện!");
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === "all" ? undefined : value); 
  };

  const filteredServices = useMemo(() => {
    return services.filter((service: Service) =>
      selectedCategory ? service.serviceCategoryId === selectedCategory : true // Lọc theo phân loại dịch vụ
    );
  }, [selectedCategory, services]);

  const handleColumnChange = (value: string[]) => {
    setSelectedColumns(
      value.includes("all")
        ? [
           "id",
    "name",
    "image",
    'price',
    'specialPrice',
    'eventId',
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
      const newStatus = checked ? "active" : "inactive";
      const response = await updateStatusService(token, record.id, newStatus);
      if (response.data) {
        message.success(
          `${checked ? "Kích hoạt" : "Vô hiệu hóa"} dịch vụ thành công`
        );
        fetchServices(); // Refresh lại danh sách
      } else {
        message.error("Cập nhật trạng thái thất bại");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Đã có lỗi xảy ra khi cập nhật trạng thái");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
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
      title: "Giá Bán",
      dataIndex: "id",
      key: "price",
      render: (id: string) => {
        const servicePrices = prices[id] || [];
        const price = servicePrices.length > 0 ? servicePrices[0].price : 0; // Lấy giá bán
        return formatCurrency(price); // Định dạng giá theo tiền Việt Nam
      },
    },
    {
      title: "Giá Khuyến Mãi",
      dataIndex: "id",
      key: "specialPrice",
      render: (id: string) => {
        const servicePrices = prices[id] || [];
        const specialPrice = servicePrices.length > 0 ? servicePrices[0].specialPrice : 0; // Lấy giá khuyến mãi
        return formatCurrency(specialPrice); // Định dạng giá khuyến mãi theo tiền Việt Nam
      },
    },
            {
              title: "Sự Kiện",
              dataIndex: "id",
              key: "eventId",
              render: (id: string) => {
                const servicePrices = prices[id] || [];
                const eventId = servicePrices.length > 0 ? servicePrices[0].eventId : "Không có"; // Lấy eventId
                return eventId ? event[eventId] || "Không có" : "Không có";
              },
            },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "150px",
      align: "center" as "center",
      render: (status: string, record: object) => (
        <Switch
          checked={status === "active"}
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
      render: (_: string, record: Service) => (
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
    setDataEdit({
      ...service,
      priceId: prices[service.id]?.[0]?.id || 0,
      price: prices[service.id]?.[0]?.price || 0,
      specialPrice: prices[service.id]?.[0]?.specialPrice || 0,
      commission: prices[service.id]?.[0]?.commission || 0,
      status: prices[service.id]?.[0]?.status || "inactive",
      eventId: prices[service.id]?.[0]?.eventId || null,
    });
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
        <Select
          placeholder="Chọn phân loại dịch vụ"
          onChange={handleCategoryChange}
          style={{ width: "600px" }} // Thay đổi kích thước và khoảng cách
        >
        <Option value="all">Tất cả</Option>
          {categories.map((category) => (
            <Option key={category.id} value={category.id}>
              {category.name}
            </Option>
          ))}
        </Select>
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
