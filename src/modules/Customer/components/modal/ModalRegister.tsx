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
  categoryId
}) => {
  const [form] = Form.useForm<FormInstance>();
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
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
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  useEffect(() => {
    setVisibleModal(visible);
    getInfoCustomer();
    getBranch();
    getServiceCategory();
    getEmployees();
  }, [visible, userId]);

  useEffect(() => {
    getTimeByServiceIdAndDate();
  }, [selectedBranch, selectedDate, selectedServiceId]);

  useEffect(() => {
    fetchCategoryById();
  }, [selectedServiceId]);

  useEffect(() => {
    getBedByServiceAndDate();
    console.log(`${selectedDate} ${time}:00`);
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
    setCustomer(response.data);
  };

  const getBranch = async () => {
    const response = await getAllBranch(token, 1, 5);
    setBranch(response.data);
  };

  const getServiceCategory = async () => {
    const response = await getAllServiceCategory( 1, 10);
    setServiceCategory(response.data);

    // Fetch services for each category
    const services = {};
    for (const category of response.data) {
      const servicesResponse = await getServiceByCategory( category.id);
      services[category.id] = servicesResponse.data;
    }
    setServicesByCategory(services); // Save all services categorized
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
      token,
      selectedServiceId,
      selectedDate,
      selectedBranch
    );
    
    const currentDate = moment();
    const selectedDateMoment = moment(selectedDate, "YYYY-MM-DD");
  
    // Nếu ngày được chọn là ngày hiện tại, chỉ hiển thị các giờ sau thời gian hiện tại cộng thêm 1 giờ
    if (selectedDateMoment.isSame(currentDate, "day")) {
      const oneHourLater = currentDate.add(1, "hours").format("HH:mm");
      const filteredTimes = response.data.filter(
        (timeSlot: { time: string }) => timeSlot.time > oneHourLater
      );
      setListTime(filteredTimes);
    } else {
      setListTime(response.data);
    }
  };

  const getBedByServiceAndDate = async () => {
    const response = await getBedByServiceIdAndDate(
      selectedServiceId,
      `${selectedDate} ${time}:00`,
      selectedBranch,
      room?.roomId
    );
    setBed(response.data);
    console.log(response.data);
    
  };

  const getEmployees = async () => {
    const response = await getAllEmployee(token, 1, 10);
    setEmployees(response.data);
  };

  const fetchCategoryById = async () => {
    const response = await getCategoryServiceById( selectedCategoryId);
    setRoom(response.data);
    // console.log(response.data.roomId);
    
  }

  const disabledDate = (current) => {
    return current && current < moment().startOf("day");
  };

  useEffect(() => {
    if (customer) {
      form.setFieldsValue({
        fullName: customer.fullName,
        phone: customer.phone,
      });
    }
  }, [customer, form]);

  const handleCancel = () => {
    form.resetFields();
    setVisibleModal(false);
    if (typeof setVisible === "function") {
      setVisible(false);
    }
  };

  const onFinish = async (values: any) => {
    try {
      const appointment = {
        dateTime: `${values.date.format('YYYY-MM-DD')} ${values.time}:00`,
        status: 'confirmed',
        category: 'services', 
        serviceOrTreatmentId: values.service,
        employeeId: values.staff,
        customerId: customer?.id,
        branchId: values.branch,
        bedId: values.bed
      }
      console.log("Appointment payload being sent:", JSON.stringify(appointment));
      const response = await registerAppointment(appointment);
      if (response.data !== null) {
        message.success("Đăng ký thành công!");
    setVisibleModal(false);
      }else{
        console.log(response.error);
        
      }
    } catch (error) {
      console.log("Validation failed:", error);
    }
    console.log("Form values:", values);
  };

  return (
    <Modal open={visibleModal} onCancel={handleCancel} footer={null}>
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
        <Form.Item label="Chọn dịch vụ:" name="service">
          <Select
            placeholder="Chọn dịch vụ"
            onChange={(value) => {
              setSelectedServiceId(value); 
              const categoryId = Object.keys(servicesByCategory).find(categoryId => 
                servicesByCategory[categoryId].some((service) => service.id === value)
              );
              setSelectedCategoryId(Number(categoryId)); // Lưu ID của category
            }}
          >
            {/* Sử dụng OptGroup để nhóm dịch vụ theo phân loại */}
            {serviceCategory.map((category) => (
              <Select.OptGroup key={category.id} label={category.name}>
                {servicesByCategory[category.id]?.map((service) => (
                  <Select.Option key={service.id} value={service.id}>
                    {service.name}
                  </Select.Option>
                ))}
              </Select.OptGroup>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Hoặc chọn liệu trình:" name="treatment">
          <Select placeholder="Chọn liệu trình">
            <Select.Option value="therapy">Trị liệu cổ vai gáy</Select.Option>
            <Select.Option value="bodycare">Chăm sóc body</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Chọn chi nhánh:"
          name="branch"
          rules={[{ required: true, message: "Vui lòng chọn chi nhánh" }]}
        >
          <Select
            placeholder="Chọn chi nhánh"
            onChange={(value) => setSelectedBranch(value)}
          >
            {branch.map((item) => (
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
                listTime.map(
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
      {bed.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
    </Select>
  </Form.Item>
)}
        <Form.Item label="Chọn nhân viên:" name="staff">
          <Select placeholder="Chọn nhân viên">
            {employees.map((item) => (
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
