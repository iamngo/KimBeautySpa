import React, { useEffect, useMemo, useState } from "react";
import { Button, DatePicker, Skeleton, Tabs } from "antd";
import { TiPlusOutline } from "react-icons/ti";
import DataTable from "../components/table/DataTable";
import "../styles.scss";
import {
  getAllAppointment,
  getAllBed,
  getAllCustomer,
  getAllEmployee,
  getAllService,
  getEmployeeById,
  updateStatusAppointment,
} from "../../../services/api";
import { Appointment, Customer, Employee, Service } from "../types";
import { MdDeleteForever } from "react-icons/md";
import Search from "antd/es/input/Search";
import { BiEdit } from "react-icons/bi";
import { MODE } from "../../../utils/constants";
import AppointmentModal from "../components/modal/AppointmentModal";
import { useBranch } from "../../../hooks/branchContext";

const AppointmentPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [mode, setMode] = useState("");
  const [dataEdit, setDataEdit] = useState<Appointment>();
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedColumns, setSelectedColumns] = useState([
    "dateTime",
    "status",
    "category",
    "serviceName",
    "employeeName",
    "customerName",
    "bedName",
    // "performing",
    "actions",
  ]);
  const token = localStorage.getItem("accessToken") || "";
  const [services, setServices] = useState<Service[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [beds, setBeds] = useState<[]>([]);
  const [selectedTab, setSelectedTab] = useState("all");
  const { branchId, setBranchId } = useBranch();
  const [searchDate, setSearchDate] = useState<string>("");

  useEffect(() => {
    if (branchId) {
      fetchServicesAndAppointments();
    }
  }, [branchId, visibleModal]);

  const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const MM = String(today.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const dd = String(today.getDate()).padStart(2, "0");

    return `${yyyy}-${MM}-${dd}`;
  };

  const fetchServicesAndAppointments = async () => {
    setLoading(true);

    // Fetch all services
    const servicesResponse = await getAllService(1, 100);
    setServices(servicesResponse.data);

    const customerResponse = await getAllCustomer(token, 1, 100);
    setCustomers(customerResponse.data);

    const employeeResponse = await getAllEmployee(
      token,
      branchId,
      getCurrentDate()
    );

    setEmployees(employeeResponse.data);

    const bedResponse = await getAllBed(token, 1, 200);
    setBeds(bedResponse.data);

    // Fetch appointments and map service and employee names
    const appointmentsResponse = await getAllAppointment(
      token,
      1,
      100,
      branchId
    );
    const appointmentsWithDetails = await Promise.all(
      appointmentsResponse.data.map(async (appointment: Appointment) => {
        const updatedAppointment = { ...appointment };

        // Find service name from the list of services
        const service = servicesResponse.data.find(
          (service: Service) => service.id === appointment.serviceOrTreatmentId
        );
        const customer = customerResponse.data.find(
          (customer: Customer) => customer.id === appointment.customerId
        );
        const employee = employeeResponse.data.find(
          (employee: Employee) => employee.id === appointment.employeeId
        );
        const bed = bedResponse.data.find(
          (bed) => bed.id === appointment.bedId
        );
        updatedAppointment.serviceName = service
          ? service.name
          : "Unknown Service";
        updatedAppointment.customerName = customer
          ? customer.fullName
          : "Unknown Customer";
        updatedAppointment.employeeName = employee
          ? employee.fullName
          : "Unknown Employee";
        updatedAppointment.bedName = bed ? bed.name : "Unknown Bed";
        console.log(bed);

        return updatedAppointment;
      })
    );

    setAppointments(appointmentsWithDetails);
    console.log(appointmentsWithDetails);

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

  const filteredAppointments = useMemo(() => {
    let filtered = appointments.filter((appointment: Appointment) =>
      appointment.customerName
        ?.toLowerCase()
        .includes(debouncedKeyword.toLowerCase())
    );

    if (searchDate) {
      filtered = filtered.filter((appointment) => {
        const appointmentDate = new Date(
          appointment.dateTime
        ).toLocaleDateString();
        const selectedDate = new Date(searchDate).toLocaleDateString();
        return appointmentDate === selectedDate;
      });
    }

    // Nếu tab là "booked", lọc các cuộc hẹn có status là "confirmed"
    if (selectedTab === "booked") {
      filtered = filtered.filter(
        (appointment) => appointment.status === "confirmed"
      );
    }
    if (selectedTab === "in-progress") {
      filtered = filtered.filter(
        (appointment) => appointment.status === "performing"
      );
    }
    if (selectedTab === "completed") {
      filtered = filtered.filter(
        (appointment) => appointment.status === "finished"
      );
    }

    return filtered;
  }, [debouncedKeyword, appointments, selectedTab, searchDate]);

  const handleColumnChange = (value: string[]) => {
    setSelectedColumns(
      value.includes("all")
        ? [
            "id",
            "dateTime",
            "status",
            "category",
            "serviceName",
            "employeeName",
            "customerName",
            "bedName",
            // "bonusId",
            "actions",
          ]
        : value
    );
  };

  const handleClickPerforming = async (id) => {
    const response = await updateStatusAppointment(id);
    console.log(response);
    
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a: Appointment, b: Appointment) => a.id - b.id,
    },
    {
      title: "Thời gian",
      dataIndex: "dateTime",
      key: "dateTime",
      render: (dateTime: string) => {
        const date = new Date(dateTime);
        return date
          .toLocaleString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })
          .replace(",", ""); // Remove the comma between date and time
      },
      sorter: (a: Appointment, b: Appointment) =>
        new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      sorter: (a: Appointment, b: Appointment) =>
        a.status.localeCompare(b.status),
    },
    {
      title: "Phân loại",
      dataIndex: "category",
      key: "category",
      sorter: (a: Appointment, b: Appointment) =>
        a.category.localeCompare(b.category),
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
      sorter: (a: Appointment, b: Appointment) =>
        a.serviceName?.localeCompare(b.serviceName),
    },
    {
      title: "Nhân viên",
      dataIndex: "employeeName",
      key: "employeeName",
      sorter: (a: Appointment, b: Appointment) =>
        a.employeeName?.localeCompare(b.employeeName),
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      sorter: (a: Appointment, b: Appointment) =>
        a.customerName?.localeCompare(b.customerName),
    },
    {
      title: "Giường",
      dataIndex: "bedName",
      key: "bedName",
      sorter: (a: Appointment, b: Appointment) =>
        a.bedName?.localeCompare(b.bedName),
    },
    // {
    //   title: "Thực hiện",
    //   key: "performing",
    //   render: (record: Appointment) => (<button onClick={() => handleClickPerforming(record.id)}>Thực hiện</button>)      
    // },
    {
      title: "Hành động",
      key: "actions",
      render: (text: string, record: Employee) => (
        <div>
          <div>
            <Button type="link" onClick={() => handleEditEmployee(record)}>
              <BiEdit />
            </Button>
            <Button type="link" danger>
              <MdDeleteForever />
            </Button>
          </div>
        </div>
      ),
    },
  ];

  const handleAddAppointment = () => {
    setVisibleModal(true);
    setMode(MODE.ADD);
  };
  const handleEditEmployee = (employee: Employee) => {
    setVisibleModal(true);
    setMode(MODE.EDIT);
    setDataEdit(employee);
  };

  const handleTabChange = (key: string) => {
    setSelectedTab(key);
  };

  const handleDateChange = (date: any, dateString: string) => {
    setSearchDate(dateString); // Lưu ngày đã chọn dưới dạng chuỗi
  };

  return (
    <div className="manage-account">
      <AppointmentModal
        visible={visibleModal}
        setVisible={setVisibleModal}
        mode={mode}
        appointment={dataEdit}
      />
      <div className="header-container">
        <Search
          placeholder="Tìm kiếm lịch hẹn theo tên khách hàng"
          onChange={(e) => handleSearchChange(e.target.value)}
          className="ant-input-search"
          size="large"
        />
        <DatePicker
          placeholder="Tìm kiếm theo ngày"
          onChange={handleDateChange}
          style={{ width: 200 }}
        />
        <Button
          type="primary"
          className="btn-add"
          icon={<TiPlusOutline />}
          size="large"
          onClick={handleAddAppointment}
        >
          Thêm lịch hẹn
        </Button>
      </div>
      <Tabs defaultActiveKey="all" onChange={handleTabChange}>
        <Tabs.TabPane tab="Tất cả" key="all" />
        <Tabs.TabPane tab="Đã đặt hẹn" key="booked" />
        <Tabs.TabPane tab="Đang thực hiện" key="in-progress" />
        <Tabs.TabPane tab="Đã hoàn thành" key="completed" />
      </Tabs>
      {loading ? (
        <Skeleton active />
      ) : (
        <DataTable<Appointment>
          columns={columns}
          data={filteredAppointments}
          loading={loading}
          selectedColumns={selectedColumns}
          onColumnChange={handleColumnChange}
          tableName="Appointment"
          haveImport={false}
        />
      )}
    </div>
  );
};

export default AppointmentPage;
