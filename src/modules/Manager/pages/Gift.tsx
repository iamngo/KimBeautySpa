import React, { useEffect, useMemo, useState } from "react";
import { Button, Skeleton, message, Switch } from "antd";
import { TiPlusOutline } from "react-icons/ti";
import DataTable from "../components/table/DataTable";
import "../styles.scss";
import { getAllGift, deleteGift } from "../../../services/api";
import Search from "antd/es/input/Search";
import { MdDeleteForever } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import { MODE } from "../../../utils/constants";
import GiftModal from "../components/modal/GiftModal";
import { Modal as AntModal } from "antd";

interface IGift {
  id: number;
  name: string;
  point: number;
  image: string;
  status: boolean;
}

const GiftPage: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [mode, setMode] = useState<string>("");
  const [dataEdit, setDataEdit] = useState<IGift>();
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [gifts, setGifts] = useState<IGift[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'id',
    "name",
    "point",
    "image",
    "status",
    "actions",
  ]);

  const token = localStorage.getItem("accessToken") || "";

  useEffect(() => {
    fetchGifts();
  }, [visibleModal]);

  const fetchGifts = async () => {
    try {
      setLoading(true);
      const response = await getAllGift(1, 100);
      setGifts(response?.data);
    } catch (error) {
      message.error("Không thể tải dữ liệu quà tặng");
    } finally {
      setLoading(false);
    }
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

  const filteredGifts = useMemo(() => {
    return gifts.filter((gift: IGift) =>
      gift.name.toLowerCase().includes(debouncedKeyword.toLowerCase())
    );
  }, [debouncedKeyword, gifts]);

  const handleColumnChange = (value: string[]) => {
    setSelectedColumns(
      value.includes("all")
        ? ["id", "name", "point", "image", "status", "actions"]
        : value
    );
  };

  const handleDeleteGift = async (gift: IGift) => {
    try {
      AntModal.confirm({
        title: 'Xác nhận xóa',
        content: `Bạn có chắc chắn muốn xóa quà tặng này?`,
        okText: 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
        async onOk() {
          setLoading(true);
          await deleteGift(token, gift.id);
          message.success('Xóa quà tặng thành công');
          fetchGifts();
        },
      });
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa quà tặng');
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a: IGift, b: IGift) => a.id - b.id,
    },
    {
      title: "Tên quà tặng",
      dataIndex: "name",
      key: "name",
      sorter: (a: IGift, b: IGift) => a.name.localeCompare(b.name),
    },
    {
      title: "Điểm đổi",
      dataIndex: "point",
      key: "point",
      sorter: (a: IGift, b: IGift) => a.point - b.point,
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (
        <img
          src={image}
          alt="Gift"
          style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }}
        />
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Switch
          checked={status === "active"}
          checkedChildren="Hoạt động"
          unCheckedChildren="Tạm dừng"
          disabled
        />
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: string, record: IGift) => (
        <div className="action-buttons">
          <Button type="link" onClick={() => handleEditGift(record)}>
            <BiEdit />
          </Button>
          <Button 
            type="link" 
            danger 
            onClick={() => handleDeleteGift(record)}
          >
            <MdDeleteForever />
          </Button>
        </div>
      ),
    },
  ];

  const handleAddGift = () => {
    setVisibleModal(true);
    setMode(MODE.ADD);
    setDataEdit(undefined);
  };

  const handleEditGift = (gift: IGift) => {
    setVisibleModal(true);
    setMode(MODE.EDIT);
    setDataEdit(gift);
  };

  return (
    <div className="manage-account">
      <GiftModal
        visible={visibleModal}
        setVisible={setVisibleModal}
        mode={mode}
        gift={dataEdit}
      />
      <div className="header-container">
        <h2>Quản lý Quà tặng</h2>
        <Search
          placeholder="Tìm kiếm theo tên quà tặng"
          onChange={(e) => handleSearchChange(e.target.value)}
          className="ant-input-search"
          size="large"
          style={{width: '600px'}}
        />
        <Button
          className="btn-add"
          type="primary"
          icon={<TiPlusOutline />}
          size="large"
          onClick={handleAddGift}
        >
          Thêm quà tặng
        </Button>
      </div>
      {loading ? (
        <Skeleton active />
      ) : (
        <DataTable<IGift>
          columns={columns}
          data={filteredGifts}
          loading={loading}
          selectedColumns={selectedColumns}
          onColumnChange={handleColumnChange}
          tableName="Gift"
          haveImport={false}
        />
      )}
    </div>
  );
};

export default GiftPage;