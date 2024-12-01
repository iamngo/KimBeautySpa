import React, { useEffect, useMemo, useState } from "react";
import { Button, Skeleton, message, Tag } from "antd";
import { TiPlusOutline } from "react-icons/ti";
import DataTable from "../components/table/DataTable";
import "../styles.scss";
import Search from "antd/es/input/Search";
import { MdDeleteForever } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import { MODE } from "../../../utils/constants";
import WageModal from "../components/modal/WageModal";
import { useBranch } from "../../../hooks/branchContext";
import dayjs from "dayjs";
import { IWage } from "../types";
import { deleteWage, getAllWage } from "../../../services/api";
import { Modal as AntModal } from "antd";

interface IProps {}

const getRoleName = (role: string): string => {
  switch (role) {
    case 'manager':
      return 'Quản lý';
    case 'employee':
      return 'Nhân viên';
    case 'admin':
      return 'Quản trị viên';
    default:
      return role;
  }
};

const WagePage: React.FC<IProps> = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [mode, setMode] = useState<string>("");
  const [dataEdit, setDataEdit] = useState<IWage>();
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [wages, setWages] = useState<IWage[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "id",
    "hourlyRate",
    "effectiveDate",
    "role",
    "actions",
  ]);

  const token = localStorage.getItem("accessToken") || "";
  const { branchId } = useBranch();

  useEffect(() => {
    fetchWages();
  }, [visibleModal]);

  const fetchWages = async () => {
    try {
      setLoading(true);
      const response = await getAllWage(token, 1, 100);
      setWages(response.data);
    } catch (error) {
      message.error("Không thể tải dữ liệu mức lương");
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

  const filteredWages = useMemo(() => {
    return wages.filter((wage: IWage) =>
      wage.role.toLowerCase().includes(debouncedKeyword.toLowerCase())
    );
  }, [debouncedKeyword, wages]);

  const handleColumnChange = (value: string[]) => {
    setSelectedColumns(
      value.includes("all")
        ? ["id", "hourlyRate", "effectiveDate", "role", "actions"]
        : value
    );
  };

  const handleDeleteWage = async (wage: IWage) => {
    try {
      AntModal.confirm({
        title: 'Xác nhận xóa',
        content: `Bạn có chắc chắn muốn xóa mức lương của ${getRoleName(wage.role)}?`,
        okText: 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
        async onOk() {
          setLoading(true);
          await deleteWage(token, wage.id);
          message.success('Xóa mức lương thành công');
          fetchWages();
        },
      });
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa mức lương');
    }
  };

  const getRoleTag = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'employee':
        return <Tag color="blue">Nhân viên</Tag>;
      case 'manager':
        return <Tag color="green">Quản lý</Tag>;
      case 'admin':
        return <Tag color="red">Quản trị viên </Tag>;
      default:
        return <Tag color="default">{role}</Tag>;
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a: IWage, b: IWage) => a.id - b.id,
    },
    {
      title: "Mức lương theo giờ",
      dataIndex: "hourlyRate",
      key: "hourlyRate",
      render: (hourlyRate: number) => 
        new Intl.NumberFormat('vi-VN', { 
          style: 'currency', 
          currency: 'VND' 
        }).format(hourlyRate),
      sorter: (a: IWage, b: IWage) => a.hourlyRate - b.hourlyRate,
    },
    {
      title: "Ngày hiệu lực",
      dataIndex: "effectiveDate",
      key: "effectiveDate",
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
      sorter: (a: IWage, b: IWage) => 
        dayjs(a.effectiveDate).unix() - dayjs(b.effectiveDate).unix(),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role: string) => getRoleTag(role),
      sorter: (a: IWage, b: IWage) => a.role.localeCompare(b.role),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: string, record: IWage) => (
        <div className="action-buttons">
          <Button type="link" onClick={() => handleEditWage(record)}>
            <BiEdit />
          </Button>
          <Button 
            type="link" 
            danger 
            onClick={() => handleDeleteWage(record)}
          >
            <MdDeleteForever />
          </Button>
        </div>
      ),
    },
  ];

  const handleAddWage = () => {
    setVisibleModal(true);
    setMode(MODE.ADD);
  };

  const handleEditWage = (wage: IWage) => {
    setVisibleModal(true);
    setMode(MODE.EDIT);
    setDataEdit(wage);
  };

  return (
    <div className="manage-account">
      <WageModal
        visible={visibleModal}
        setVisible={setVisibleModal}
        mode={mode}
        wage={dataEdit}
      />
      <div className="header-container">
        <h2>Quản lý Mức lương</h2>
        <Search
          placeholder="Tìm kiếm theo vai trò"
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
          onClick={handleAddWage}
        >
          Thêm mức lương
        </Button>
      </div>
      {loading ? (
        <Skeleton active />
      ) : (
        <DataTable<IWage>
          columns={columns}
          data={filteredWages}
          loading={loading}
          selectedColumns={selectedColumns}
          onColumnChange={handleColumnChange}
          haveImport={false}
          tableName="Wage"
        />
      )}
    </div>
  );
};

export default WagePage;
