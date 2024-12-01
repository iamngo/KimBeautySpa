import React, { useEffect, useMemo, useState } from "react";
import { Button, DatePicker, message, Skeleton, Tabs, Tag } from "antd";
import { TiPlusOutline } from "react-icons/ti";
import DataTable from "../components/table/DataTable";
import "../styles.scss";
import {
  getAllAppointment,
  getAllBed,
  getAllCustomer,
  getAllEmployee,
  getAllProduct,
  getAllService,
  getAppointmentDetailById,
} from "../../../services/api";
import { Appointment, Customer, Employee, Product, Service } from "../types";
import { MdDeleteForever } from "react-icons/md";
import Search from "antd/es/input/Search";
import { BiEdit } from "react-icons/bi";
import { MODE } from "../../../utils/constants";
import AppointmentModal from "../components/modal/AppointmentModal";
import { useBranch } from "../../../hooks/branchContext";
import dayjs from "dayjs";
import AppointmentDetailModal from "../components/modal/AppointmentDetailModal";
import InvoiceModal from "../components/modal/InvoiceModal";
import { io } from "socket.io-client";

const AppointmentPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [visibleModalDetail, setVisibleModalDetail] = useState<boolean>(false);
  const [mode, setMode] = useState("");
  const [dataEdit, setDataEdit] = useState<Appointment>();
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedColumns, setSelectedColumns] = useState([
    "id",
    "status",
    "dateTime",
    "customerName",
    "payment",
    "actions",
  ]);
  const [selectedDetailColumns, setSelectedDetailColumns] = useState([
    "time",
    "status",
    "category",
    "serviceName",
    "expense",
    "employeeName",
    "bedName",
    "actions",
  ]);
  const token = localStorage.getItem("accessToken") || "";
  const [services, setServices] = useState<Service[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [beds, setBeds] = useState<[]>([]);
  const [selectedTab, setSelectedTab] = useState("all");
  const { branchId, setBranchId } = useBranch();
  const [searchDate, setSearchDate] = useState<string>(
    dayjs().format("YYYY-MM-DD")
  );
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null);
  const [products, setProducts] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [visibleInvoiceModal, setVisibleInvoiceModal] =
    useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [refreshPage, setRefreshPage] = useState(false);

  useEffect(() => {
    const socket = io("http://localhost:3000");
    // // Nhận tin nhắn từ server
    socket.on("notify-payment", (response) => {
      console.log("Socket : ", response);
      if (response.message === "success") {
        message.success("Thanh toán thành công");
        console.log("Thanh toán thành công");

        setRefreshPage((pre) => !pre);
      } else {
        message.error("Thanh toán thất bại");
      }
    });
    return () => {
      socket.off("notify-payment");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (branchId) {
      fetchServicesAndAppointments();
    }
  }, [branchId, visibleModal, refreshPage]);

  const fetchServicesAndAppointments = async () => {
    setLoading(true);

    // Fetch all services

    const customerResponse = await getAllCustomer(token, 1, 100);
    setCustomers(customerResponse?.data);

    const employeeResponse = await getAllEmployee(token, branchId, 1, 100);

    setEmployees(employeeResponse?.data);

    // Fetch appointments and map service and employee names
    const appointmentsResponse = await getAllAppointment(
      token,
      1,
      100,
      Number(branchId)
    );

    const appointmentsWithDetails = await Promise.all(
      appointmentsResponse?.data?.map(async (appointment: Appointment) => {
        const updatedAppointment = { ...appointment };

        const customer = customerResponse?.data?.find(
          (customer: Customer) => customer.id === appointment.customerId
        );
        const employee = employeeResponse?.data?.find(
          (employee: Employee) => employee.id === appointment.employeeId
        );

        updatedAppointment.customerName = customer ? customer.fullName : "";
        updatedAppointment.employeeName = employee ? employee.fullName : "";

        return updatedAppointment;
      })
    );

    setAppointments(appointmentsWithDetails);

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
    let filtered = appointments;

    if (searchDate) {
      filtered = filtered.filter((appointment) => {
        const appointmentDate = new Date(
          appointment.dateTime
        ).toLocaleDateString();
        const selectedDate = new Date(searchDate).toLocaleDateString();
        return appointmentDate === selectedDate;
      });
    }
    if (debouncedKeyword) {
      filtered = filtered.filter((appointment: Appointment) =>
        appointment.customerName
          ?.toLowerCase()
          .includes(debouncedKeyword.toLowerCase())
      );
    }

    return filtered;
  }, [debouncedKeyword, appointments, searchDate]);

  const filteredAppointmentDetail = useMemo(() => {
    let filtered = appointmentDetails;

    if (selectedTab === "booked") {
      filtered = filtered.filter(
        (appointment) => appointment.status === "confirmed"
      );
    }
    if (selectedTab === "in-progress") {
      filtered = filtered.filter(
        (appointment) => appointment.status === "implement"
      );
    }
    if (selectedTab === "completed") {
      filtered = filtered.filter(
        (appointment) => appointment.status === "finished"
      );
    }
    if (selectedTab === "canceled") {
      filtered = filtered.filter(
        (appointment) => appointment.status === "canceled"
      );
    }

    return filtered;
  }, [debouncedKeyword, appointmentDetails, selectedTab]);

  const handleColumnChange = (value: string[]) => {
    setSelectedColumns(
      value.includes("all")
        ? ["id", "dateTime", "customerName", "payment", "actions"]
        : value
    );
  };

  const handleDetailColumnChange = (value: string[]) => {
    setSelectedDetailColumns(
      value.includes("all")
        ? ["time",
            "status",
            "category",
            "serviceName",
            "expense",
            "employeeName",
            "bedName",
            "actions",
          ]
        : value
    );
  };

  const handleClickPayment = (id: number) => {
    const appointmentData = appointments.find((app) => app.id === id);
    if (appointmentData) {
      setSelectedAppointment(appointmentData);
      setVisibleInvoiceModal(true);
    }
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
        return date
          .toLocaleString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            
          })
          .replace(",", "");
      },
      sorter: (a: Appointment, b: Appointment) =>
        new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      sorter: (a: Appointment, b: Appointment) =>
        a.customerName?.localeCompare(b.customerName),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color;
        let displayText;

        switch (status) {
          case 'paid':
            color = 'green';
            displayText = 'Đã thanh toán';
            break;
          case 'unpaid':
            color = 'volcano';
            displayText = 'Chưa thanh toán';
            break;
          case 'canceled':
            color = 'red';
            displayText = 'Đã hủy';
            break;
          default:
            color = 'default';
            displayText = status; // Hiển thị trạng thái gốc nếu không khớp
        }

        return (
          <Tag color={color}>
            {displayText}
          </Tag>
        );
      },
    },
    {
      title: "Thanh Toán",
      key: "payment",
      render: (text, record) => (
        <div>
          <div>
            <Button
              type="primary"
              onClick={() => handleClickPayment(record.id)}
              disabled={record.status === "unpaid" ? false : true}
            >
              Thanh Toán
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: "150px",
      align: "center" as "center",
      render: (text: string, record: Employee) => (
        <div>
          <div>
            <Button type="link" onClick={() => handleEditEmployee(record)}>
              <BiEdit />
            </Button>
          </div>
        </div>
      ),
    },
  ];
  const detailColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a: Appointment, b: Appointment) => a.id - b.id,
    },
    {
      title: "Thời gian",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color;
        let displayText;

        switch (status) {
          case 'confirmed':
            color = 'blue';
            displayText = 'Đã xác nhận';
            break;
          case 'implement':
            color = 'orange';
            displayText = 'Đang thực hiện';
            break;
          case 'finished':
            color = 'green';
            displayText = 'Hoàn thành';
            break;
          case 'canceled':
            color = 'red';
            displayText = 'Đã hủy';
            break;
          case 'paid':
            color = 'success';
            displayText = 'Đã thanh toán';
            break;
          default:
            color = 'default';
            displayText = status; // Hiển thị trạng thái gốc nếu không khớp
        }

        return (
          <Tag color={color}>
            {displayText}
          </Tag>
        );
      },
    },
    {
      title: "Tên dịch vụ/sản phẩm",
      dataIndex: "serviceName",
      key: "serviceName",
      render: (serviceName: string, record: any) => {
        return serviceName || record.productName || "";
      },
      sorter: (a: Appointment, b: Appointment) => {
        const aName = a.serviceName || a.productName || "";
        const bName = b.serviceName || b.productName || "";
        return aName.localeCompare(bName);
      },
    },
    {
      title: "Giá tiền",
      dataIndex: "expense",
      key: "expense",
      sorter: (a: Appointment, b: Appointment) => a.expense - b.expense,
      render: (expense: number) => {
        return expense.toLocaleString('vi-VN', {
          style: 'currency',
          currency: 'VND',
        });
      },
    },
    {
      title: "Nhân viên",
      dataIndex: "employeeName",
      key: "employeeName",
      sorter: (a: Appointment, b: Appointment) =>
        a.employeeName?.localeCompare(b.employeeName),
    },
    {
      title: "Giường",
      dataIndex: "bedName",
      key: "bedName",
      sorter: (a: Appointment, b: Appointment) =>
        a.bedName?.localeCompare(b.bedName),
    },
    {
      title: "Phân loại",
      dataIndex: "category",
      key: "category",
      render: (category: string) => {
        let color;
        let displayText;

        switch (category) {
          case 'services':
            color = 'red';
            displayText = 'Dịch vụ';
            break;
          case 'products':
            color = 'blue';
            displayText = 'Sản phẩm';
            break;
          default:
            color = 'default';
            displayText = category; // Hiển thị phân loại gốc nếu không khớp
        }

        return (
          <Tag color={color}>
            {displayText}
          </Tag>
        );
      },
    },
    {
      title: "Hành động",
      key: "actions",
      width: "150px",
      align: "center" as "center",
      render: (text: string, record: Appointment) => (
        <div>
          <div>
            <Button
              type="link"
              onClick={() => handleEditAppointmentDetail(record)}
            >
              <BiEdit />
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
  const handleAddAppointmentDetail = () => {
    setVisibleModalDetail(true);
    setMode(MODE.ADD);
  };
  const handleEditEmployee = (appointment: Appointment) => {
    setVisibleModal(true);
    setMode(MODE.EDIT);
    setDataEdit(appointment);
  };
  const handleEditAppointmentDetail = (appointmentDetail) => {
    setVisibleModalDetail(true);
    setMode(MODE.EDIT);
    setDataEdit(appointmentDetail);
  };

  const handleTabChange = (key: string) => {
    setSelectedTab(key);
  };

  const handleDateChange = (date: any, dateString: string) => {
    setSearchDate(dateString);
  };

  const handleRowClick = async (record: Appointment) => {
    setSelectedRow(record.id);
    setSelectedAppointment(record);
    setLoadingDetails(true);
    setSelectedRecord(record); // Lưu record đã chọn
    const servicesResponse = await getAllService(1, 100);
    setServices(servicesResponse?.data);
    const bedResponse = await getAllBed(token, 1, 200);
    setBeds(bedResponse?.data);
    const employeeResponse = await getAllEmployee(token, branchId, 1, 200);
    setEmployees(employeeResponse);
    const productsReponse = await getAllProduct(1, 200);
    setProducts(productsReponse.data);
    try {
      const response = await getAppointmentDetailById(token, record.id);
      const appointmentDetails = await Promise.all(
        response?.data.map(async (appointment) => {
          const updatedAppointment = { ...appointment };

          const service = servicesResponse?.data.find(
            (service: Service) => service.id === appointment.foreignKeyId
          );
          const product = productsReponse?.data.find(
            (product: Product) => product.id === appointment.foreignKeyId
          );
          const employee = employeeResponse?.data.find(
            (emp: Employee) => emp.id === appointment.employeeId
          );
          const bed = bedResponse?.data.find(
            (bed) => bed.id === appointment.bedId
          );

          updatedAppointment.serviceName = service ? service.name : "";
          updatedAppointment.productName = product ? product.name : "";
          updatedAppointment.bedName = bed ? bed.name : "";
          updatedAppointment.employeeName = employee ? employee.fullName : "";

          return updatedAppointment;
        })
      );
      setAppointmentDetails(appointmentDetails);
    } catch (error) {
      console.error("Error fetching appointment details:", error);
    } finally {
      setLoadingDetails(false);
    }
  };
  const handleRefreshDetail = () => {
    if (selectedRecord) {
      handleRowClick(selectedRecord);
    }
  };
  return (
    <div className="manage-account">
      <AppointmentModal
        visible={visibleModal}
        setVisible={setVisibleModal}
        mode={mode}
        appointment={dataEdit}
        branchId={branchId}
      />
      <AppointmentDetailModal
        visible={visibleModalDetail}
        setVisible={setVisibleModalDetail}
        mode={mode}
        appointmentData={dataEdit}
        appointment={selectedAppointment}
        appointmentId={selectedAppointment?.id}
        onSuccess={handleRefreshDetail}
      />
      <InvoiceModal
        visible={visibleInvoiceModal}
        onClose={() => setVisibleInvoiceModal(false)}
        appointmentData={selectedAppointment}
        onPaymentSuccess={() => {
          fetchServicesAndAppointments();
          setVisibleInvoiceModal(false);
        }}
      />
      <div className="header-container">
        <h2>Quản lý lịch hẹn</h2>
        <Search
          placeholder="Tìm kiếm lịch hẹn theo tên khách hàng"
          onChange={(e) => handleSearchChange(e.target.value)}
          className="ant-input-search"
          size="large"
          style={{ width: "500px" }}
        />
        <DatePicker
          placeholder="Tìm kiếm theo ngày"
          onChange={handleDateChange}
          style={{ width: "200px" }}
          defaultValue={dayjs()}
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
      <div className="appointment">
        {loading ? (
          <Skeleton active />
        ) : (
          <DataTable<Appointment>
            scrolly={120}
            columns={columns}
            data={filteredAppointments}
            loading={loading}
            selectedColumns={selectedColumns}
            onColumnChange={handleColumnChange}
            tableName="Appointment"
            haveImport={false}
            rowClassName={(record) =>
              record.id === selectedRow ? "selected-row" : ""
            }
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
            })}
          />
        )}
      </div>
      <div className="appointment-detail">
        <h3>Chi tiết lịch hẹn</h3>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Tabs
            defaultActiveKey="all"
            onChange={handleTabChange}
            style={{
              opacity: selectedAppointment ? 1 : 0.5,
              pointerEvents: selectedAppointment ? "auto" : "none",
            }}
          >
            <Tabs.TabPane
              tab="Tất cả"
              key="all"
              disabled={!selectedAppointment}
            />
            <Tabs.TabPane
              tab="Đã đặt hẹn"
              key="booked"
              disabled={!selectedAppointment}
            />
            <Tabs.TabPane
              tab="Đang thực hiện"
              key="in-progress"
              disabled={!selectedAppointment}
            />
            <Tabs.TabPane
              tab="Đã hoàn thành"
              key="completed"
              disabled={!selectedAppointment}
            />
            <Tabs.TabPane
              tab="Đã hủy"
              key="canceled"
              disabled={!selectedAppointment}
            />
          </Tabs>
          <Button
            type="primary"
            className="btn-add"
            icon={<TiPlusOutline />}
            size="large"
            onClick={handleAddAppointmentDetail}
            style={{
              opacity: selectedAppointment ? 1 : 0.5,
              pointerEvents: selectedAppointment ? "auto" : "none",
            }}
          >
            Thêm chi tiết
          </Button>
        </div>
        {loadingDetails ? (
          <Skeleton active />
        ) : (
          <DataTable<Appointment>
            scrolly={120}
            columns={detailColumns}
            data={filteredAppointmentDetail}
            loading={loadingDetails}
            selectedColumns={selectedDetailColumns}
            onColumnChange={handleDetailColumnChange}
            tableName="Appointment Detail"
            haveImport={false}
          />
        )}
      </div>
    </div>
  );
};

export default AppointmentPage;
