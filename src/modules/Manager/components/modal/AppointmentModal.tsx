import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  DatePicker,
  Radio,
  Upload,
  Row,
  Col,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { Appointment, Employee } from "../../types";
import { MODE } from "../../../../utils/constants";
import moment from "moment";
import {
  getAllAccount,
  getAllBranch,
  getAllEmployee,
  getAllServiceCategory,
  getBedByServiceIdAndDate,
  getCategoryServiceById,
  getEmployeeByDateTime,
  getIdBonus,
  getInfoByAccountId,
  getServiceByCategory,
  getWorkingTimeByServiceIdAndDate,
  registerAppointment,
  updateStatusAppointment,
} from "../../../../services/api";

interface AppointmentModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  mode: string;
  appointment?: Appointment;
  branchId: number;
}

interface EmployeeFormValues {
  id?: number;
  accountId?: number;
  fullName?: string;
  address?: string;
  dob?: moment.Moment;
  email?: string;
  gender?: boolean;
  phone?: string;
  role?: string;
  status?: string;
  wageId?: number;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  visible,
  setVisible,
  mode,
  appointment,
  branchId,
}) => {
  const [form] = Form.useForm<EmployeeFormValues>();
  const token = localStorage.getItem("accessToken");
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );
  const [servicesByCategory, setServicesByCategory] = useState<any>({});
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [serviceCategory, setServiceCategory] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [listTime, setListTime] = useState(null);
  const [time, setTime] = useState(null);
  const [selectedBed, setSelectedBed] = useState<number | null>(null);
  const [bed, setBed] = useState<any[]>([]);
  const [room, setRoom] = useState(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [idBonus, setIdBonus] = useState(0);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [customer, setCustomer] = useState();
  const [expense, setExpense] = useState(0);

  useEffect(() => {
    if (visible) {
      getServiceCategory();
      getNewIdBonus();
      getAccountCustomer();
      if (mode === MODE.ADD) {
        form.resetFields();
        form.setFieldsValue({ status: "confirmed" });
      } else if (mode === MODE.EDIT && appointment) {
        getTimeByServiceIdAndDate();
        const formattedAppointment = {
          ...appointment,
          fullName: appointment.customerName,
          service: appointment.serviceOrTreatmentId,
          date: appointment.dateTime ? moment(appointment.dateTime) : null,
          time: appointment.dateTime
            ?.split("T")[1]
            ?.split(":")
            ?.slice(0, 2)
            ?.join(":"),
          bed: appointment.bedName,
          staff: appointment.employeeId,
        };

        form.setFieldsValue(formattedAppointment);
      }
    }
  }, [visible, mode, appointment, form]);

  useEffect(() => {
    getTimeByServiceIdAndDate();
    getEmployees();
  }, [selectedDate, selectedServiceId]);

  useEffect(() => {
    getBedByServiceAndDate();
  }, [selectedDate, selectedServiceId, time, listTime]);

  useEffect(() => {
    getEmployees();
  }, [selectedDate, selectedServiceId, time]);

  useEffect(() => {
    fetchCategoryById();
  }, [selectedServiceId]);

  const fetchCategoryById = async () => {
    const response = await getCategoryServiceById(selectedCategoryId);
    setRoom(response?.data);
  };
  const getEmployees = async () => {
    const response = await getEmployeeByDateTime(
      branchId,
      `${selectedDate} ${time}:00`
    );

    setEmployees(response?.data);
    console.log(`${selectedDate} ${time}:00`);
    
  };
  const getBedByServiceAndDate = async () => {
    const response = await getBedByServiceIdAndDate(
      `${selectedDate} ${time}:00`,
      branchId,
      room?.roomId
    );
    setBed(response?.data);
  };
  const getServiceCategory = async () => {
    const response = await getAllServiceCategory(1, 10);
    setServiceCategory(response?.data);

    // Fetch services for each category
    const services = {};
    for (const category of response?.data) {
      const servicesResponse = await getServiceByCategory(category.id, 1, 100);
      services[category.id] = servicesResponse?.data;
    }
    setServicesByCategory(services);
  };

  const disabledDate = (current) => {
    return current && current < moment().startOf("day");
  };

  const handleDateChange = (date: any) => {
    if (date) {
      const formattedDate = date.format("YYYY-MM-DD");
      setSelectedDate(formattedDate);

      if (moment().isSame(date, "day")) {
        getTimeByServiceIdAndDate();
      }
    } else {
      setSelectedDate(null);
    }
  };

  const getTimeByServiceIdAndDate = async () => {
    const response = await getWorkingTimeByServiceIdAndDate(
      room?.roomId,
      selectedDate,
      branchId
    );

    const currentDate = moment();
    const selectedDateMoment = moment(selectedDate, "YYYY-MM-DD");

    // Nếu ngày được chọn là ngày hiện tại, chỉ hiển thị các giờ sau thời gian hiện tại cộng thêm 1 giờ
    if (selectedDateMoment.isSame(currentDate, "day")) {
      const oneHourLater = currentDate.format("HH:mm");
      const filteredTimes = response?.data.filter(
        (timeSlot: { time: string }) => timeSlot.time > oneHourLater
      );
      setListTime(filteredTimes);
    } else {
      setListTime(response?.data);
    }
  };

  const getNewIdBonus = async () => {
    const response = await getIdBonus();
    setIdBonus(response?.data.id);
  };

  const getAccountCustomer = async () => {
    try {
      const response = await getAllAccount(token, branchId, 1, 200);
      const filteredAccounts = response?.data.filter(
        (acc) => acc.type === "customer"
      );
      setAccounts(filteredAccounts);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const handleSelectAccount = async (value) => {
    form.setFieldsValue({ accountId: value });
    const response = await getInfoByAccountId(token, value);
    if (response?.data) {
      setCustomer(response?.data);
      form.setFieldsValue({
        fullName: response?.data.fullName,
        phone: response?.data.phone,
      });
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values) => {
    if (mode === MODE.ADD) {
      try {
        const appointment = {
          dateTime: `${values.date.format("YYYY-MM-DD")}`,
          time: `${values.time}:00`,
          status: "confirmed",
          category: "services",
          foreignKeyId: selectedServiceId,
          employeeId: values.staff,
          fullName: values.fullName,
          phone: values.phone,
          customerId: customer?.id,
          branchId: branchId,
          bedId: values.bed,
          bonusId: idBonus,
          expense: expense,
        };
        const response = await registerAppointment(appointment);
        if (response?.data !== null) {
          message.success("Đăng ký thành công!");
          setVisible(!visible);
        } else {
          console.log(response.error);
        }
      } catch (error) {
        console.log("Validation failed:", error);
      }
    }
    if (mode === MODE.EDIT) {
      const response = await updateStatusAppointment(token, appointment?.id, {
        status: values.status,
      });
      console.log(response);
      
      if(response.data){
        message.success('Cập nhật trạng thái thành công!');
        setVisible(!visible);

      } else {
        message.error('Cập nhật trạng thái thất bại');
      }
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={handleCancel}
      footer={null}
      title={mode === MODE.ADD ? "Thêm lịch hẹn" : "Cập nhật lịch hẹn"}
    >
      <Form key={mode} layout="vertical" form={form} onFinish={onFinish}>
      {mode === MODE.ADD ? 
      <>
        <Row gutter={16}>
          <Col span={4}>
            <Form.Item label="ID" name="id">
              <Input type="number" placeholder="ID" disabled />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label="Trạng thái" name="status">
            <Select
                placeholder="Chọn trạng thái"
                disabled={mode === MODE.ADD ? true : false}
              >
                <Select.Option key={1} value={"unpaid"}>
                  Chưa thanh toán
                </Select.Option>
                <Select.Option key={2} value={"paid"}>
                  Đã thanh toán
                </Select.Option>
                <Select.Option key={3} value={"canceled"}>
                  Đã hủy
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              label="Chọn tài khoản"
              name="accountId"
              rules={[{ required: true, message: "Vui lòng chọn tài khoản" }]}
            >
              <Select
                placeholder="Chọn tài khoản"
                showSearch
                onChange={(value) => {
                  handleSelectAccount(value);
                }}
                filterOption={(input, option) =>
                  option && option.children
                    ? option.children.includes(input)
                    : false
                }
                allowClear
              >
                {accounts?.map((account) => (
                  <Select.Option key={account.id} value={account.id}>
                    ID{account.id} - {account.phone}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Họ và tên"
              name="fullName"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
            >
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Số điện thoại:"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="B1. Chọn dịch vụ:"
              name="service"
              rules={[{ required: true, message: "Vui lòng chọn dịch vụ" }]}
            >
              <Select
                placeholder="Chọn dịch vụ"
                onChange={(value) => {
                  setSelectedServiceId(Number(value.split(" - ")[0]));
                  setExpense(Number(value.split(" - ")[1]));
                  const categoryId = Object.keys(servicesByCategory).find(
                    (categoryId) =>
                      servicesByCategory[categoryId].some(
                        (service) =>
                          service.id === Number(value.split(" - ")[0])
                      )
                  );
                  setSelectedCategoryId(Number(categoryId)); // Lưu ID của category
                }}
              >
                {/* Sử dụng OptGroup để nhóm dịch vụ theo phân loại */}
                {serviceCategory?.map((category) => (
                  <Select.OptGroup key={category.id} label={category.name}>
                    {servicesByCategory[category.id]?.map((service) => (
                      <Select.Option
                        key={service.id}
                        value={`${service.id} - ${service.specialPrice}`}
                      >
                        {service.name} -{" "}
                        {service.specialPrice.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </Select.Option>
                    ))}
                  </Select.OptGroup>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="B2. Chọn ngày:"
              name="date"
              rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                onChange={handleDateChange}
                disabledDate={disabledDate}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="B3. Chọn thời gian:"
              name="time"
              rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}
            >
              <Select
                placeholder="Chọn thời gian"
                onChange={(value) => setTime(value)}
              >
                {listTime &&
                  listTime?.map(
                    (timeSlot: {
                      id: number;
                      time: string;
                      status: string;
                    }) => (
                      <Select.Option key={timeSlot.id} value={timeSlot.time}>
                        {timeSlot.time}
                      </Select.Option>
                    )
                  )}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="B4. Chọn giường:"
              name="bed"
              rules={[{ required: true, message: "Vui lòng chọn giường" }]}
            >
              <Select
                placeholder="Chọn giường"
                onChange={(value) => setSelectedBed(value)}
              >
                {bed?.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="B5. Chọn nhân viên:"
              name="staff"
              rules={[{ required: true, message: "Vui lòng chọn nhân viên" }]}
            >
              <Select placeholder="Chọn nhân viên">
                {employees?.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.fullName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row></>: <Form.Item label="Trạng thái" name="status">
              <Select
                placeholder="Chọn trạng thái"
                disabled={mode === MODE.ADD ? true : false}
              >
                <Select.Option key={1} value={"unpaid"}>
                  Chưa thanh toán
                </Select.Option>
                <Select.Option key={2} value={"paid"}>
                  Đã thanh toán
                </Select.Option>
                <Select.Option key={3} value={"canceled"}>
                  Đã hủy
                </Select.Option>
              </Select>
            </Form.Item>}

        <Form.Item>
          <Button htmlType="submit" block className="btn-custom">
            Xác nhận
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AppointmentModal;
