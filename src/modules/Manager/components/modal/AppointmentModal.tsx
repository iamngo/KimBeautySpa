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
  getAllBranch,
  getAllEmployee,
  getAllServiceCategory,
  getBedByServiceIdAndDate,
  getCategoryServiceById,
  getIdBonus,
  getServiceByCategory,
  getWagesByRole,
  getWorkingTimeByServiceIdAndDate,
  registerAppointment,
  registerEmployee,
} from "../../../../services/api";

interface AppointmentModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  mode: string;
  appointment?: Appointment;
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
}) => {
  const [form] = Form.useForm<EmployeeFormValues>();
  const [fileList, setFileList] = useState<any[]>([]);
  const token = localStorage.getItem("accessToken");
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );
  const [servicesByCategory, setServicesByCategory] = useState<any>({});
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [serviceCategory, setServiceCategory] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [branch, setBranch] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [listTime, setListTime] = useState(null);
  const [time, setTime] = useState(null);
  const [selectedBed, setSelectedBed] = useState<number | null>(null);
  const [bed, setBed] = useState<any[]>([]);
  const [room, setRoom] = useState(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [idBonus, setIdBonus] = useState(0);

  useEffect(() => {
    if (visible) {
      getBranch();
      getServiceCategory();
      getEmployees();
      getNewIdBonus();
      if (mode === MODE.ADD) {
        form.resetFields();
        form.setFieldsValue({ status: "confirmed" });
      } else if (mode === MODE.EDIT && appointment) {
        console.log(appointment.dateTime);
        const formattedAppointment = {
          ...appointment,
          fullName: appointment.customerName,
          service: appointment.serviceOrTreatmentId,
          date: appointment.dateTime ? moment(appointment.dateTime) : null,
          time: appointment.dateTime.split("T")[1].split(":").slice(0, 2).join(":"),
          bed: appointment.bedName,
          staff: appointment.employeeId
        };

        form.setFieldsValue(formattedAppointment);
      }
    }
  }, [visible, mode, appointment, form]);

  useEffect(() => {
    getBedByServiceAndDate();
    console.log(`${selectedDate} ${time}:00`);
  }, [selectedBranch, selectedDate, selectedServiceId, time]);

  useEffect(() => {
    fetchCategoryById();
  }, [selectedServiceId]);

  const getNewIdBonus = async () => {
    const response = await getIdBonus();
    setIdBonus(response.data.id);
  };

  const fetchCategoryById = async () => {
    const response = await getCategoryServiceById(selectedCategoryId);
    setRoom(response.data);
  };
  const getEmployees = async () => {
    const response = await getAllEmployee(token, 1, 10);
    setEmployees(response.data);
  };
  const getBedByServiceAndDate = async () => {
    const response = await getBedByServiceIdAndDate(
      selectedServiceId,
      `${selectedDate} ${time}:00`,
      selectedBranch,
      room?.roomId
    );
    setBed(response.data);
  };
  const getServiceCategory = async () => {
    const response = await getAllServiceCategory(1, 10);
    setServiceCategory(response.data);

    // Fetch services for each category
    const services = {};
    for (const category of response.data) {
      const servicesResponse = await getServiceByCategory(category.id, 1, 100);
      services[category.id] = servicesResponse.data;
    }
    setServicesByCategory(services);
  };

  const getBranch = async () => {
    const response = await getAllBranch(token, 1, 5);
    setBranch(response.data);
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
  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values) => {
    if (mode === MODE.ADD) {
      try {
        const appointment = {
          dateTime: `${values.date.format("YYYY-MM-DD")} ${values.time}:00`,
          status: values.status,
          category: "services",
          serviceOrTreatmentId: values.service,
          employeeId: values.staff,
            customerId: 7,
          branchId: values.branch,
          bedId: values.bed,
          bonusId: idBonus,
        };
        const response = await registerAppointment(appointment);

        if (response.data !== null) {
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
      console.log(values);
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
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="ID" name="id">
              <Input type="number" placeholder="ID" disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Trạng thái" name="status">
              <Select placeholder="Chọn trạng thái">
                <Select.Option key={1} value={"confirmed"}>
                  Đã xác nhận
                </Select.Option>
                <Select.Option key={2} value={"no-confirmed"}>
                  Chưa xác nhận
                </Select.Option>
                <Select.Option key={3} value={"performing"}>
                  Đang thực hiện
                </Select.Option>
                <Select.Option key={4} value={"finished"}>
                  Hoàn thành
                </Select.Option>
                <Select.Option key={5} value={"cancelled"}>
                  Đã hủy
                </Select.Option>
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
          <Col span={12}>
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
          </Col>
          <Col span={12}>
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
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
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
          </Col>
          <Col span={12}>
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
          </Col>
          <Col span={12}>
            <Form.Item label="Chọn nhân viên:" name="staff">
              <Select placeholder="Chọn nhân viên">
                {employees.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.fullName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

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
