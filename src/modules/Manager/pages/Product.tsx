import React, { useEffect, useMemo, useState } from "react";
import { Button, Select, Skeleton, Switch, message } from "antd";
import { TiPlusOutline } from "react-icons/ti";
import DataTable from "../components/table/DataTable";
import "../styles.scss";
import {
  getAllEvent,
  getAllProduct,
  getAllServiceCategory,
  getPricesByForeignKeyId,
  updateStatusProduct,
} from "../../../services/api";
import { Event, Product } from "../types";
import { MdDeleteForever } from "react-icons/md";
import Search from "antd/es/input/Search";
import { BiEdit } from "react-icons/bi";
import { MODE } from "../../../utils/constants";
import { useBranch } from "../../../hooks/branchContext";
import ProductModal from "../components/modal/ProductModal";

const { Option } = Select;

const ProductPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [objects, setObjects] = useState<Product[]>([]);
  const [selectedColumns, setSelectedColumns] = useState([
    "id",
    "name",
    "status",
    "originalPrice",
    "price",
    "specialPrice",
    "eventId",
    "image",
    "actions",
  ]);
  const token = localStorage.getItem("accessToken") || "";
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [mode, setMode] = useState("");
  const [dataEdit, setDataEdit] = useState<Product>();
  const [serviceCategories, setServiceCategories] = useState<any[]>([]);
  const [refreshPage, setRefreshPage] = useState<boolean>(false);
  const [categories, setCategories] = useState<[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [prices, setPrices] = useState<{ [key: string]: any }>({});
  const [event, setEvent] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchObjects();
    fetchEvent();
    const getApiAllServiceCategory = async () => {
      const response = await getAllServiceCategory(1, 100);
      setServiceCategories([...response.data]);
    };
    getApiAllServiceCategory();
    fetchCategory();
  }, [refreshPage]);

  const toggleRefresh = () => {
    setRefreshPage((prev) => !prev); // Correct usage
  };

  const fetchCategory = async () => {
    const response = await getAllServiceCategory(1, 200);
    setCategories(response?.data);
  };

  const fetchObjects = async () => {
    setLoading(true);
    try {
      const response = await getAllProduct(1, 200);
      setObjects(response?.data);

      const pricePromises = response.data.map(async (product: Product) => {
        const priceResponse = await getPricesByForeignKeyId(product.id);
        return { productId: product.id, prices: priceResponse?.data };
      });

      const pricesArray = await Promise.all(pricePromises);
      const pricesMap = pricesArray.reduce((acc, { productId, prices }) => {
        acc[productId] = prices;
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

  const filteredObjects = useMemo(() => {
    return objects?.filter((object: Product) =>
      selectedCategory ? object.serviceCategoryId === selectedCategory : true
    );
  }, [selectedCategory, objects]);

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

  const handleColumnChange = (value: string[]) => {
    setSelectedColumns(
      value.includes("all")
        ? [
            "id",
            "name",
            "status",
            "originalPrice",
            "price",
            "specialPrice",
            "eventId",
            "image",
            "actions",
          ]
        : value
    );
  };

  const handleStatusChange = async (checked: boolean, record: any) => {
    try {
      const newStatus = checked ? "active" : "inactive";
      const response = await updateStatusProduct(token, record.id, newStatus);
      if (response.data) {
        message.success(
          `${checked ? "Kích hoạt" : "Vô hiệu hóa"} sản phẩm thành công`
        );
        fetchObjects();
      } else {
        message.error("Cập nhật trạng thái thất bại");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Đã có lỗi xảy ra khi cập nhật trạng thái");
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === "all" ? undefined : value);
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
      sorter: (a: Product, b: Product) => a.id - b.id,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      sorter: (a: Product, b: Product) => a.name.localeCompare(b.name),
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      align: "center" as "center",
      render: (image: string) => (
        <img
          src={image}
          alt="Sự kiện"
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Giá Gốc",
      dataIndex: "id",
      key: "originalPrice",
      render: (id: string) => {
        const servicePrices = prices[id] || [];
        const price =
          servicePrices.length > 0 ? servicePrices[0].originalPrice : 0; // Lấy giá bán
        return formatCurrency(price); // Định dạng giá theo tiền Việt Nam
      },
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
        const specialPrice =
          servicePrices.length > 0 ? servicePrices[0].specialPrice : 0; // Lấy giá khuyến mãi
        return formatCurrency(specialPrice); // Định dạng giá khuyến mãi theo tiền Việt Nam
      },
    },
    {
      title: "Sự Kiện",
      dataIndex: "id",
      key: "eventId",
      render: (id: string) => {
        const servicePrices = prices[id] || [];
        const eventId =
          servicePrices.length > 0 ? servicePrices[0].eventId : "Không có"; // Lấy eventId
        return eventId ? event[eventId] || "Không có" : "Không có";
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "150px",
      align: "center" as "center",
      render: (status: string, record: any) => (
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
      align: "center" as "center",
      render: (text: string, record: Event) => (
        <div>
          <Button type="link" onClick={() => handleEditObject(record)}>
            <BiEdit />
          </Button>
        </div>
      ),
    },
  ];

  const handleAddObject = () => {
    setVisibleModal(true);
    setMode(MODE.ADD);
  };
  const handleEditObject = (object: Product) => {
    console.log(object);

    setVisibleModal(true);
    setMode(MODE.EDIT);
    setDataEdit({
      id: object.id,
      name: object.name,
      status: object.status,
      image: object.image,
      serviceCategoryId: object.serviceCategoryId,
      priceId: prices[object.id]?.[0]?.id || 0,
      originalPrice: prices[object.id]?.[0]?.originalPrice || 0,
      price: prices[object.id]?.[0]?.price || 0,
      specialPrice: prices[object.id]?.[0]?.specialPrice || 0,
      commission: prices[object.id]?.[0]?.commission || 0,
      eventId: prices[object.id]?.[0]?.eventId || null,
    });
  };

  return (
    <div className="manage-account">
      <ProductModal
        visible={visibleModal}
        setVisible={setVisibleModal}
        mode={mode}
        object={dataEdit}
        toggleRefresh={toggleRefresh}
        serviceCategories={serviceCategories}
      />
      <div className="header-container">
        <h2>Quản lý sản phẩm</h2>
        <Select
          placeholder="Chọn phân loại dịch vụ"
          onChange={handleCategoryChange}
          style={{ width: "600px" }}
        >
          <Option value="all">Tất cả</Option>
          {categories.map((category) => (
            <Option key={category.id} value={category.id}>
              {category.name}
            </Option>
          ))}
        </Select>
        <Button
          type="primary"
          className="btn-add"
          icon={<TiPlusOutline />}
          size="large"
          onClick={handleAddObject}
        >
          Thêm sản phẩm mới
        </Button>
      </div>
      {loading ? (
        <Skeleton active />
      ) : (
        <DataTable<Product>
          columns={columns}
          data={filteredObjects}
          loading={loading}
          selectedColumns={selectedColumns}
          onColumnChange={handleColumnChange}
          tableName="Product"
          haveImport={false}
        />
      )}
    </div>
  );
};

export default ProductPage;
