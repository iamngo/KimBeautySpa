import { useState, useEffect } from "react";
import { Button, Form, Input, Modal, DatePicker, Select, message } from "antd";
import { FormInstance } from "antd/es/form";
import "./styles.scss";
import {
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
} from "../../../../services/api";
import moment from "moment";

interface ModalRegisterProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  userId: number | null;
  serviceId: number | null;
  categoryId: number | null;
}

const ModalRegister: React.FC<ModalRegisterProps> = ({
  visible,
  setVisible,
  userId,
  serviceId,
  categoryId,
}) => {
  const [form] = Form.useForm<FormInstance>();
  const token = localStorage.getItem("accessToken");
  const [customer, setCustomer] = useState(null);
  const [branch, setBranch] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [selectedBed, setSelectedBed] = useState<number | null>(null);
  const [serviceCategory, setServiceCategory] = useState<any[]>([]);
  const [servicesByCategory, setServicesByCategory] = useState<any>({});
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [listTime, setListTime] = useState(null);
  const [time, setTime] = useState(null);
  const [bed, setBed] = useState<any[]>([]);
  const [room, setRoom] = useState(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [idBonus, setIdBonus] = useState(0);

  useEffect(() => {
    getInfoCustomer();
    getBranch();
    getServiceCategory();
    getNewIdBonus();
  }, [userId]);

  useEffect(() => {
    getTimeByServiceIdAndDate();
    getEmployees();
  }, [selectedBranch, selectedDate, selectedServiceId]);

  useEffect(() => {
    getEmployees();
  }, [selectedBranch, selectedDate, selectedServiceId, time]);

  useEffect(() => {
    fetchCategoryById();
  }, [selectedServiceId]);

  useEffect(() => {
    getBedByServiceAndDate();
  }, [selectedBranch, selectedDate, selectedServiceId, time]);

  useEffect(() => {
    if (serviceId && categoryId) {
      form.setFieldsValue({
        service: serviceId,
      });
      setSelectedCategoryId(categoryId);
      setSelectedServiceId(serviceId);
    }
  }, [serviceId, categoryId, form]);

  const getInfoCustomer = async () => {
    const response = await getInfoByAccountId(token, userId);
    setCustomer(response?.data);
  };

  const getBranch = async () => {
    const response = await getAllBranch(1, 5);
    setBranch(response?.data);
  };

  const getServiceCategory = async () => {
    const response = await getAllServiceCategory(1, 10);
    setServiceCategory(response?.data);

    // Fetch services for each category
    const services = {};
    for (const category of response.data) {
      const servicesResponse = await getServiceByCategory(category?.id, 1, 100);
      services[category.id] = servicesResponse?.data;
    }
    setServicesByCategory(services);
    console.log(services);
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

  const getNewIdBonus = async () => {
    const response = await getIdBonus();
    setIdBonus(response?.data?.id);
  };
  const getTimeByServiceIdAndDate = async () => {
    const response = await getWorkingTimeByServiceIdAndDate(
      room?.roomId,
      selectedDate,
      selectedBranch
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

  const getBedByServiceAndDate = async () => {
    const response = await getBedByServiceIdAndDate(
      `${selectedDate} ${time}:00`,
      selectedBranch,
      room?.roomId
    );
    setBed(response?.data);
  };

  const getEmployees = async () => {
    const response = await getEmployeeByDateTime(
      selectedBranch,
      `${selectedDate} ${time}:00`
    );
    setEmployees(response?.data);
  };

  const fetchCategoryById = async () => {
    const response = await getCategoryServiceById(selectedCategoryId);
    console.log(response?.data);

    setRoom(response?.data);
  };

  const disabledDate = (current) => {
    return current && current < moment().startOf("day");
  };

  useEffect(() => {
    if (customer) {
      form.setFieldsValue({
        fullName: customer.fullName,
        phone: customer.phone,
      });
    } else {
      form.resetFields();
    }
  }, [visible, customer, form]);

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
    if (typeof setVisible === "function") {
      setVisible(false);
    }
  };

  const onFinish = async (values: any) => {
    try {
      const appointment = {
        dateTime: `${values.date.format("YYYY-MM-DD")} ${values.time}:00`,
        status: "confirmed",
        category: "services",
        foreignKeyId: values.service,
        employeeId: values.staff,
        customerId: customer?.id,
        branchId: values.branch,
        bedId: values.bed,
        bonusId: idBonus,
        fullName: values.fullName,
        phone: values.phone,
      };

      console.log(
        "Appointment payload being sent:",
        JSON.stringify(appointment)
      );
      const response = await registerAppointment(appointment);
      console.log(response);

      if (response?.data !== null) {
        message.success("Đăng ký thành công!");
        setVisible(false);
      } else {
        console.log(response.error);
      }
    } catch (error) {
      console.log("Validation failed:", error);
    }
    console.log("Form values:", values);
  };

  return (
    <Modal open={visible} onCancel={handleCancel} footer={null}>
      {/* Thêm logo vào form */}
      <div className="logo-container">
        <img
          src="/public/logo-homepage.svg"
          alt="Logo"
          className="modal-logo"
        />
        <h2>Đặt lịch hẹn</h2>
      </div>

      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="Họ và tên:"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
        >
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>
        <Form.Item
          label="Số điện thoại:"
          name="phone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
        <Form.Item
          label="Chọn dịch vụ:"
          name="service"
          rules={[{ required: true, message: "Vui lòng chọn dịch vụ" }]}
        >
          <Select
            placeholder="Chọn dịch vụ"
            onChange={(value) => {
              setSelectedServiceId(value);
              const categoryId = Object.keys(servicesByCategory).find(
                (categoryId) =>
                  servicesByCategory[categoryId].some(
                    (service) => service.id === value
                  )
              );
              setSelectedCategoryId(Number(categoryId)); // Lưu ID của category
            }}
          >
            {/* Sử dụng OptGroup để nhóm dịch vụ theo phân loại */}
            {serviceCategory?.map((category) => (
              <Select.OptGroup key={category.id} label={category.name}>
                {servicesByCategory[category.id]?.map((service) => (
                  <Select.Option key={service.id} value={service.id}>
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
        {/* <Form.Item label="Hoặc chọn liệu trình:" name="treatment">
          <Select placeholder="Chọn liệu trình">
            <Select.Option value="therapy">Trị liệu cổ vai gáy</Select.Option>
            <Select.Option value="bodycare">Chăm sóc body</Select.Option>
          </Select>
        </Form.Item> */}
        <Form.Item
          label="Chọn chi nhánh:"
          name="branch"
          rules={[{ required: true, message: "Vui lòng chọn chi nhánh" }]}
        >
          <Select
            placeholder="Chọn chi nhánh"
            onChange={(value) => setSelectedBranch(value)}
          >
            {branch?.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name} - {item.address}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Chọn ngày:"
          name="date"
          rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            onChange={handleDateChange}
            disabledDate={disabledDate}
          />
        </Form.Item>
        {selectedBranch && selectedServiceId && selectedDate && (
          <Form.Item
            label="Chọn thời gian:"
            name="time"
            rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}
          >
            <Select
              placeholder="Chọn thời gian"
              onChange={(value) => setTime(value)}
            >
              {listTime &&
                listTime?.map(
                  (timeSlot: { id: number; time: string; status: string }) => (
                    <Select.Option key={timeSlot.id} value={timeSlot.time}>
                      {timeSlot.time}
                    </Select.Option>
                  )
                )}
            </Select>
          </Form.Item>
        )}
        {selectedBranch && selectedServiceId && selectedDate && time && (
          <Form.Item
            label="Chọn giường:"
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
        )}
        <Form.Item
          label="Chọn nhân viên:"
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
        <Form.Item>
          <Button htmlType="submit" block className="btn-custom">
            Xác nhận
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalRegister;
