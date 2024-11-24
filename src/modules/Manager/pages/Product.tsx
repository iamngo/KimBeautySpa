import React, { useEffect, useMemo, useState } from "react";
import { Button, Skeleton } from "antd";
import { TiPlusOutline } from "react-icons/ti";
import DataTable from "../components/table/DataTable";
import "../styles.scss";
import { getAllProduct, getAllServiceCategory } from "../../../services/api";
import { Event, Product } from "../types";
import { MdDeleteForever } from "react-icons/md";
import Search from "antd/es/input/Search";
import { BiEdit } from "react-icons/bi";
import EventModal from "../components/modal/EventModal";
import { MODE } from "../../../utils/constants";
import { useBranch } from "../../../hooks/branchContext";
import moment from "moment";
import ProductModal from "../components/modal/ProductModal";

const ProductPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [objects, setObjects] = useState<Product[]>([]);
  const [selectedColumns, setSelectedColumns] = useState([
    "id",
    "name",
    "status",
    "image",
    "serviceCategoryId",
    "actions",
  ]);
  const token = localStorage.getItem("accessToken") || "";
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [mode, setMode] = useState("");
  const [dataEdit, setDataEdit] = useState<Product>();
  const { branchId, setBranchId } = useBranch();
  const [serviceCategories, setServiceCategories] = useState<any[]>([]);
  const [refreshPage, setRefreshPage] = useState<boolean>(false);

  useEffect(() => {
    fetchObjects();
    const getApiAllServiceCategory = async () => {
      const response = await getAllServiceCategory(1, 100);
      console.log(response.data);
      setServiceCategories([...response.data]);
    };
    getApiAllServiceCategory();
  }, [refreshPage]);

  const toggleRefresh = () => {
    setRefreshPage((prev) => !prev); // Correct usage
  };

  const fetchObjects = async () => {
    setLoading(true);
    const response = await getAllProduct(1, 100);
    console.log(response?.data);
    setObjects(response?.data);
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

  const filteredObjects = useMemo(() => {
    console.log(serviceCategories.find((sc) => sc.id === 1)?.name);

    return objects?.filter((object: Product) =>
      object.name.toLowerCase().includes(debouncedKeyword.toLowerCase())
    );
  }, [debouncedKeyword, objects]);

  const handleColumnChange = (value: string[]) => {
    setSelectedColumns(
      value.includes("all")
        ? ["id", "name", "status", "image", "serviceCategoryId", "actions"]
        : value
    );
  };

  const handleDeleteObjectFromLocalStorage = (name: string) => {
    const storeObjects = localStorage.getItem("importedDataObject");
    if (storeObjects) {
      const objectsArray = JSON.parse(storeObjects);
      const updatedObjects = objectsArray.filter(
        (object: Product) => object.name !== name
      );
      localStorage.setItem(
        "importedDataObject",
        JSON.stringify(updatedObjects)
      );
      setObjects(updatedObjects);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a: Product, b: Product) => a.id - b.id,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      sorter: (a: Product, b: Product) => a.name.localeCompare(b.name),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
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
      title: "Loại",
      dataIndex: "serviceCategoryId",
      key: "serviceCategoryId",
      sorter: (a: Product, b: Product) =>
        a.serviceCategoryId - b.serviceCategoryId,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (text: string, record: Event) => (
        <div>
          {record.isNew ? (
            <div>
              <Button type="link" onClick={() => handleEditObject(record)}>
                <TiPlusOutline />
              </Button>
              <Button type="link" danger>
                <MdDeleteForever
                  onClick={() =>
                    handleDeleteObjectFromLocalStorage(record.name)
                  }
                />
              </Button>
            </div>
          ) : (
            <div>
              <Button type="link" onClick={() => handleEditObject(record)}>
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
        />
      )}
    </div>
  );
};

export default ProductPage;
