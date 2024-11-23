import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, message, Row, Col } from 'antd';
import moment from 'moment';
import { MODE } from '../../../../utils/constants';
import { getAllServiceCategory, getServiceByCategory } from '../../../../services/api';

interface UpdateAppointmentModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  mode: string;
  appointmentData?: Appointment | null;
}

const AppointmentDetailModal: React.FC<UpdateAppointmentModalProps> = ({
  visible,
  setVisible,
  mode,
  appointmentData,
}) => {
  const [form] = Form.useForm();
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [serviceList, setServiceList] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );
  const [expense, setExpense] = useState(0);
  const [serviceCategory, setServiceCategory] = useState<any[]>([]);
  const [servicesByCategory, setServicesByCategory] = useState<any>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    if (visible) {
      fetchServices();
      fetchStaff();
      getServiceCategory();
      if (mode === MODE.ADD) {
        form.resetFields();
        form.setFieldsValue({ status: 'Đã xác nhận' });
      } else if (mode === MODE.EDIT && appointmentData) {
        const formattedData = {
          ...appointmentData,
          appointmentDate: moment(appointmentData.appointmentDate),
        };
        form.setFieldsValue(formattedData);
        
        if (appointmentData.appointmentDate) {
          handleDateChange(moment(appointmentData.appointmentDate));
        }
      }
    }
  }, [visible, mode, appointmentData, form]);

  const fetchServices = async () => {
    try {
      // const response = await getAllServices();
      // setServiceList(response.data);
      setServiceList([
        { id: 1, name: 'Massage', price: 500000 },
        { id: 2, name: 'Facial', price: 600000 },
      ]);
    } catch (error) {
      message.error('Lỗi khi tải danh sách dịch vụ');
    }
  };

  const fetchStaff = async () => {
    try {
      // const response = await getAllStaff();
      // setStaffList(response.data);
      setStaffList([
        { id: 1, name: 'Nhân viên 1' },
        { id: 2, name: 'Nhân viên 2' },
      ]);
    } catch (error) {
      message.error('Lỗi khi tải danh sách nhân viên');
    }
  };

  const handleDateChange = async (date: moment.Moment | null) => {
    if (date) {
      const formattedDate = date.format('YYYY-MM-DD');
      setSelectedDate(formattedDate);
      try {
        // const response = await getTimeSlots(formattedDate);
        // setTimeSlots(response.data);
        setTimeSlots([
          { id: 1, time: '09:00' },
          { id: 2, time: '10:00' },
        ]);
      } catch (error) {
        message.error('Lỗi khi tải danh sách giờ trống');
      }
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (mode === MODE.ADD) {
        // const response = await createAppointment(values);
        message.success('Thêm lịch hẹn thành công!');
      } else {
        // const response = await updateAppointment(appointmentData?.id, values);
        message.success('Cập nhật lịch hẹn thành công!');
      }
      setVisible(false);
      onUpdateSuccess();
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    }
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

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    // Reset các trường liên quan khi thay đổi category
    form.resetFields(['productId', 'serviceId', 'bedId', 'employeeId']);
  };

  const handleServiceChange = (value: number) => {
    setSelectedService(value);
    // Reset giường và nhân viên khi đổi dịch vụ
    form.resetFields(['bedId', 'employeeId']);
  };

  return (
    <Modal
      title={mode === MODE.ADD ? "Thêm chi tiết" : "Chỉnh sửa chi tiết"}
      open={visible}
      onOk={handleSubmit}
      onCancel={() => setVisible(false)}
      width={800}
    >
      <Form form={form} layout="vertical">
        {/* Dòng 1: Phân loại và Trạng thái */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="category"
              label="Phân loại"
              rules={[{ required: true, message: "Vui lòng chọn phân loại!" }]}
            >
              <Select
                placeholder="Chọn phân loại"
                onChange={handleCategoryChange}
                options={[
                  { value: "services", label: "Dịch vụ" },
                  { value: "products", label: "Sản phẩm" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
            >
              <Select
                placeholder="Chọn trạng thái"
                options={[
                  { value: "confirmed", label: "Đã xác nhận" },
                  { value: "implement", label: "Đang thực hiện" },
                  { value: "finished", label: "Hoàn thành" },
                  { value: "canceled", label: "Đã hủy" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Dòng 2: Sản phẩm */}
        {selectedCategory === "products" && (
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="productId"
                label="Sản phẩm"
                rules={[{ required: true, message: "Vui lòng chọn sản phẩm!" }]}
              >
                <Select
                  placeholder="Chọn sản phẩm"
                  options={products?.map(product => ({
                    value: product.id,
                    label: `${product.name} - ${product.price.toLocaleString('vi-VN')}đ`
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
        )}

        {/* Dòng 3: Dịch vụ */}
        {selectedCategory === "services" && (
          <Row gutter={16}>
            <Col span={24}>
            <Form.Item
              label="Chọn dịch vụ:"
              name="service"
              rules={[{ required: true, message: "Vui lòng chọn dịch vụ" }]}
            >
              <Select
                placeholder="Chọn dịch vụ"
                onChange={(value) => {
                  setSelectedServiceId(Number(value.split(" - ")[0]));
                  setExpense(Number(value.split(" - ")[1]));
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
        )}

        {/* Dòng 4: Giường và Nhân viên - chỉ hiển thị khi đã chọn dịch vụ */}
        {selectedCategory === "services" && selectedService && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="bedId"
                label="Giường"
                rules={[{ required: true, message: "Vui lòng chọn giường!" }]}
              >
                <Select
                  placeholder="Chọn giường"
                  options={beds?.map(bed => ({
                    value: bed.id,
                    label: bed.name
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="employeeId"
                label="Nhân viên"
                rules={[{ required: true, message: "Vui lòng chọn nhân viên!" }]}
              >
                <Select
                  placeholder="Chọn nhân viên"
                  options={employees?.map(employee => ({
                    value: employee.id,
                    label: employee.fullName
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
        )}
      </Form>
    </Modal>
  );
};

export default AppointmentDetailModal;