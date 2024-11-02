import React, { useEffect, useMemo, useState } from "react";
import { Button, Skeleton } from "antd";
import { TiPlusOutline } from "react-icons/ti";
import DataTable from "../components/table/DataTable";
import "../styles.scss";
import { getAllAppointment, getAllBed, getAllCustomer, getAllEmployee, getAllService, getEmployeeById } from "../../../services/api";
import { Appointment, Customer, Employee, Service } from "../types";
import { MdDeleteForever } from "react-icons/md";
import Search from "antd/es/input/Search";
import { BiEdit } from "react-icons/bi";
import { MODE } from "../../../utils/constants";
import AppointmentModal from "../components/modal/AppointmentModal";

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
    // "bonusId",
    "actions",
  ]);
  const token = localStorage.getItem("accessToken") || "";
  const [services, setServices] = useState<Service[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [beds, setBeds] = useState<[]>([]);

  useEffect(() => {
    fetchServicesAndAppointments();
  }, [visibleModal]);

  const fetchServicesAndAppointments = async () => {
    setLoading(true);

    // Fetch all services
    const servicesResponse = await getAllService(1,100);
    setServices(servicesResponse.data);

    const customerResponse = await getAllCustomer(token, 1, 100);
    setCustomers(customerResponse.data);

    const employeeResponse = await getAllEmployee(token, 1, 100);
    setEmployees(employeeResponse.data);

    const bedResponse = await getAllBed(token, 1, 200);
    setBeds(bedResponse.data);

    // Fetch appointments and map service and employee names
    const appointmentsResponse = await getAllAppointment(token, 1, 100);
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
        )
        updatedAppointment.serviceName = service ? service.name : "Unknown Service";
        updatedAppointment.customerName = customer ? customer.fullName : "Unknown Customer";
        updatedAppointment.employeeName = employee ? employee.fullName : "Unknown Employee";
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
    return appointments.filter((appointment: Appointment) =>
      appointment.customerName?.toLowerCase()
        .includes(debouncedKeyword.toLowerCase())
    );
  }, [debouncedKeyword, appointments]);

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
          return date.toLocaleString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          }).replace(',', ''); // Remove the comma between date and time
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
        a.serviceName?.localeCompare(b.serviceName)
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
    // {
    //   title: "Chi nhánh",
    //   dataIndex: "branchId",
    //   key: "branchId",
    //   sorter: (a: Appointment, b: Appointment) =>
    //     a.branch.localeCompare(b.branch),
    // },
    {
      title: "Giường",
      dataIndex: "bedName",
      key: "bedName",
      sorter: (a: Appointment, b: Appointment) =>
        a.bedName?.localeCompare(b.bedName),
    },
    // {
    //   title: "Điểm thưởng",
    //   dataIndex: "bonusId",
    //   key: "bonusId",
    //   sorter: (a: Appointment, b: Appointment) =>
    //     a.bonusId.localeCompare(b.bonusId),
    // },
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
                //   onClick={() =>
                //     handleDeleteEmployeeFromLocalStorage(record.phone)
                //   }
                />
              </Button>
            </div>
          ) : (
            <div>
              <Button type="link" onClick={() => handleEditEmployee(record)}>
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

  const handleAddAppointment = () => {
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
      {loading ? (
        <Skeleton active />
      ) : (
        <DataTable<Appointment>
          columns={columns}
          data={filteredAppointments}
          loading={loading}
          selectedColumns={selectedColumns}
          onColumnChange={handleColumnChange}
          tableName="Employee"
        />
      )}
    </div>
  );
};

export default AppointmentPage;
