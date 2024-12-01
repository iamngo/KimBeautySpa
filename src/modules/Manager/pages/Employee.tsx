import React, { useEffect, useMemo, useState } from "react";
import { Button, message, Skeleton, Modal, Tag } from "antd";
import { TiPlusOutline } from "react-icons/ti";
import DataTable from "../components/table/DataTable";
import "../styles.scss";
import { getAllEmployee, updateStatusEmployee } from "../../../services/api";
import { Employee } from "../types";
import { MdDeleteForever } from "react-icons/md";
import Search from "antd/es/input/Search";
import { BiEdit } from "react-icons/bi";
import { MODE } from "../../../utils/constants";
import EmployeeModal from "../components/modal/EmployeeModal";
import { useBranch } from "../../../hooks/branchContext";
import { ExclamationCircleFilled } from '@ant-design/icons';

const { confirm } = Modal;

const EmployeePage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [mode, setMode] = useState("");
  const [dataEdit, setDataEdit] = useState<Employee>();
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedColumns, setSelectedColumns] = useState([
    "fullName",
    "dob",
    "address",
    "phone",
    "gender",
    "image",
    "email",
    "role",
    "actions",
  ]);
  const token = localStorage.getItem("accessToken") || "";
  const storedEmployees = localStorage.getItem("importedDataEmployee");
  const { branchId, setBranchId } = useBranch();

  useEffect(() => {
    fetchEmployees();
  }, [storedEmployees, visibleModal]);

  const fetchEmployees = async () => {
    try {
      const response = await getAllEmployee(token, branchId, 1, 100);
      if (response.data) {
        const activeEmployees = response.data.filter((emp: any) => emp.status === 'active');
        setEmployees(activeEmployees);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Đã có lỗi xảy ra khi tải danh sách nhân viên');
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

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee: Employee) =>
      employee.phone.toLowerCase().includes(debouncedKeyword.toLowerCase())
    );
  }, [debouncedKeyword, employees]);

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
            "role",
            "status",
            "wageId",
            "actions",
          ]
        : value
    );
  };

  const handleDeleteEmployeeFromLocalStorage = (phone: string) => {
    if (storedEmployees) {
      console.log(storedEmployees);

      const employeesArray = JSON.parse(storedEmployees);
      const updatedEmployees = employeesArray.filter(
        (employee: Employee) => employee.phone !== phone
      );
      localStorage.setItem(
        "importedDataEmployee",
        JSON.stringify(updatedEmployees)
      );
      setEmployees(updatedEmployees);
    }
  };


  const handleDeleteEmployee = (employee: Employee) => {
    confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleFilled />,
      content: 'Bạn có chắc chắn muốn xóa nhân viên này không?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      async onOk() {
        try {
          const response = await updateStatusEmployee(token, employee.id, 'inactive');
          if (response.data) {
            message.success('Xóa nhân viên thành công');
            fetchEmployees(); 
          } else {
            message.error('Xóa nhân viên thất bại');
          }
        } catch (error) {
          console.error('Error:', error);
          message.error('Đã có lỗi xảy ra khi xóa nhân viên');
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const getRoleName = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'employee':
        return <Tag color="blue">Nhân viên</Tag>;
      case 'manager':
        return <Tag color="green">Quản lý</Tag>;
      case 'admin':
        return <Tag color="red">Quản trị viên</Tag>;
      default:
        return <Tag color="default">{role}</Tag>;
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a: Employee, b: Employee) => a.id - b.id,
    },
    {
      title: "AccountId",
      dataIndex: "accountId",
      key: "accountId",
      sorter: (a: Employee, b: Employee) => a.accountId - b.accountId,
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a: Employee, b: Employee) =>
        a.fullName.localeCompare(b.fullName),
    },
    { title: "Ngày sinh", dataIndex: "dob", key: "dob" },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      sorter: (a: Employee, b: Employee) => a.address.localeCompare(b.address),
    },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender: boolean) => (gender ? "Nam" : "Nữ"),
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (
        <img
          src={image}
          alt="Employee"
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      ),
    },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => getRoleName(role),
    },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    { title: "WageID", dataIndex: "wageId", key: "wageId" },
    {
      title: "Hành động",
      key: "actions",
      render: (text: string, record: Employee) => (
        <div>
          {record.isNew ? (
            <div>
              <Button type="link">
                <TiPlusOutline />
              </Button>
              <Button type="link" danger>
                <MdDeleteForever
                  onClick={() =>
                    handleDeleteEmployeeFromLocalStorage(record.phone)
                  }
                />
              </Button>
            </div>
          ) : (
            <div>
              <Button type="link" onClick={() => handleEditEmployee(record)}>
                <BiEdit />
              </Button>
              <Button type="link" danger onClick={() => handleDeleteEmployee(record)}>
                <MdDeleteForever />
              </Button>
            </div>
          )}
        </div>
      ),
    },
  ];

  const handleAddEmployee = () => {
    setVisibleModal(true);
    setMode(MODE.ADD);
  };
  const handleEditEmployee = (employee: Employee) => {
    setVisibleModal(true);
    setMode(MODE.EDIT);
    setDataEdit(employee);
  };

  return (
    <div className="manage-account">
      <EmployeeModal
        visible={visibleModal}
        setVisible={setVisibleModal}
        mode={mode}
        employee={dataEdit}
      />
      <div className="header-container">
        <h2>Quản lý nhân viên</h2>
        <Search
          placeholder="Tìm kiếm nhân viên bằng số điện thoại"
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
          onClick={handleAddEmployee}
        >
          Thêm nhân viên
        </Button>
      </div>
      {loading ? (
        <Skeleton active />
      ) : (
        <DataTable<Employee>
          columns={columns}
          data={filteredEmployees}
          loading={loading}
          selectedColumns={selectedColumns}
          onColumnChange={handleColumnChange}
          tableName="Employee"
          haveImport={false}
        />
      )}
    </div>
  );
};

export default EmployeePage;
