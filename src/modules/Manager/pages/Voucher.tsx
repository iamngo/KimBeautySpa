import React, { useEffect, useMemo, useState } from "react";
import { Button, Skeleton, message } from "antd";
import { TiPlusOutline } from "react-icons/ti";
import DataTable from "../components/table/DataTable";
import "../styles.scss";
import { getAllVoucher, deleteVoucher } from "../../../services/api";
import Search from "antd/es/input/Search";
import { MdDeleteForever } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import { MODE } from "../../../utils/constants";
import VoucherModal from "../components/modal/VoucherModal";
import { useBranch } from "../../../hooks/branchContext";
import dayjs from "dayjs";
import { IVoucher } from "../types";
import { Modal as AntModal } from "antd";

interface IProps {}

const VoucherPage: React.FC<IProps> = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [mode, setMode] = useState<string>("");
  const [dataEdit, setDataEdit] = useState<IVoucher>();
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [vouchers, setVouchers] = useState<IVoucher[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'id',
    "discount",
    "minimumOrder",
    "maximumDiscount",
    "expiryDate",
    "point",
    "image",
    "actions",
  ]);

  const token = localStorage.getItem("accessToken") || "";
  const { branchId } = useBranch();

  useEffect(() => {
    fetchVouchers();
  }, [visibleModal]);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const response = await getAllVoucher(1, 100);
      setVouchers(response?.data);
    } catch (error) {
      message.error("Không thể tải dữ liệu voucher");
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

  const filteredVouchers = useMemo(() => {
    return vouchers.filter((voucher: IVoucher) =>
      voucher.point.toString().includes(debouncedKeyword.toLowerCase())
    );
  }, [debouncedKeyword, vouchers]);

  const handleColumnChange = (value: string[]) => {
    setSelectedColumns(
      value.includes("all")
        ? ["id", "discount", "minimumOrder", "maximumDiscount", "expiryDate", "point", "image", "actions"]
        : value
    );
  };

  const handleDeleteVoucher = async (voucher: IVoucher) => {
    try {
      AntModal.confirm({
        title: 'Xác nhận xóa',
        content: `Bạn có chắc chắn muốn xóa voucher này?`,
        okText: 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
        async onOk() {
          setLoading(true);
          await deleteVoucher(token, voucher.id);
          message.success('Xóa voucher thành công');
          fetchVouchers();
        },
      });
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa voucher');
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a: IVoucher, b: IVoucher) => a.id - b.id,
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      key: "discount",
      render: (discount: number) => `${discount}%`,
      sorter: (a: IVoucher, b: IVoucher) => a.discount - b.discount,
    },
    {
      title: "Đơn tối thiểu",
      dataIndex: "minimumOrder",
      key: "minimumOrder",
      render: (minimumOrder: number) => 
        new Intl.NumberFormat('vi-VN', { 
          style: 'currency', 
          currency: 'VND' 
        }).format(minimumOrder),
      sorter: (a: IVoucher, b: IVoucher) => a.minimumOrder - b.minimumOrder,
    },
    {
      title: "Giảm tối đa",
      dataIndex: "maximumDiscount",
      key: "maximumDiscount",
      render: (maximumDiscount: number) => 
        new Intl.NumberFormat('vi-VN', { 
          style: 'currency', 
          currency: 'VND' 
        }).format(maximumDiscount),
      sorter: (a: IVoucher, b: IVoucher) => a.maximumDiscount - b.maximumDiscount,
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
      sorter: (a: IVoucher, b: IVoucher) => 
        dayjs(a.expiryDate).unix() - dayjs(b.expiryDate).unix(),
    },
    {
      title: "Điểm đổi",
      dataIndex: "point",
      key: "point",
      sorter: (a: IVoucher, b: IVoucher) => a.point - b.point,
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (
        <img
          src={image}
          alt="Voucher"
          style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }}
        />
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: string, record: IVoucher) => (
        <div className="action-buttons">
          <Button type="link" onClick={() => handleEditVoucher(record)}>
            <BiEdit />
          </Button>
          <Button 
            type="link" 
            danger 
            onClick={() => handleDeleteVoucher(record)}
          >
            <MdDeleteForever />
          </Button>
        </div>
      ),
    },
  ];

  const handleAddVoucher = () => {
    setVisibleModal(true);
    setMode(MODE.ADD);
    setDataEdit(undefined);
  };

  const handleEditVoucher = (voucher: IVoucher) => {
    setVisibleModal(true);
    setMode(MODE.EDIT);
    setDataEdit(voucher);
  };

  return (
    <div className="manage-account">
      <VoucherModal
        visible={visibleModal}
        setVisible={setVisibleModal}
        mode={mode}
        voucher={dataEdit}
      />
      <div className="header-container">
        <h2>Quản lý Voucher</h2>
        <Search
          placeholder="Tìm kiếm theo điểm đổi"
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
          onClick={handleAddVoucher}
        >
          Thêm voucher
        </Button>
      </div>
      {loading ? (
        <Skeleton active />
      ) : (
        <DataTable<IVoucher>
          columns={columns}
          data={filteredVouchers}
          loading={loading}
          selectedColumns={selectedColumns}
          onColumnChange={handleColumnChange}
          tableName="Voucher"
          haveImport={false}
        />
      )}
    </div>
  );
};

export default VoucherPage; 