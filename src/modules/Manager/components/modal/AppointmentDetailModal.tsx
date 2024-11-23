import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, message, Row, Col } from 'antd';
import moment from 'moment';
import { MODE } from '../../../../utils/constants';

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

  useEffect(() => {
    if (visible) {
      fetchServices();
      fetchStaff();
      
      if (mode === MODE.ADD) {
        form.resetFields();
        form.setFieldsValue({ status: 'PENDING' });
      } else if (mode === MODE.EDIT && appointmentData) {
        // Format data for edit mode
        const formattedData = {
          ...appointmentData,
          appointmentDate: moment(appointmentData.appointmentDate),
        };
        form.setFieldsValue(formattedData);
        
        // Fetch time slots based on selected date
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

  return (
    <Modal
      title={mode === MODE.ADD ? "Thêm lịch hẹn" : "Cập nhật lịch hẹn"}
      open={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ status: 'PENDING' }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="customerName"
              label="Tên khách hàng"
              rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
            >
              <Input placeholder="Nhập tên khách hàng" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="serviceId"
              label="Dịch vụ"
              rules={[{ required: true, message: 'Vui lòng chọn dịch vụ!' }]}
            >
              <Select
                placeholder="Chọn dịch vụ"
                onChange={(value) => setSelectedService(value)}
              >
                {serviceList.map(service => (
                  <Select.Option key={service.id} value={service.id}>
                    {service.name} - {service.price.toLocaleString('vi-VN')}đ
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="appointmentDate"
              label="Ngày hẹn"
              rules={[{ required: true, message: 'Vui lòng chọn ngày hẹn!' }]}
            >
              <DatePicker 
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
                onChange={handleDateChange}
                disabledDate={(current) => {
                  return current && current < moment().startOf('day');
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="time"
              label="Thời gian"
              rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
            >
              <Select placeholder="Chọn thời gian">
                {timeSlots.map(slot => (
                  <Select.Option key={slot.id} value={slot.time}>
                    {slot.time}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="staffId"
              label="Nhân viên thực hiện"
              rules={[{ required: true, message: 'Vui lòng chọn nhân viên!' }]}
            >
              <Select placeholder="Chọn nhân viên">
                {staffList.map(staff => (
                  <Select.Option key={staff.id} value={staff.id}>
                    {staff.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Select.Option value="PENDING">Chờ xác nhận</Select.Option>
                <Select.Option value="CONFIRMED">Đã xác nhận</Select.Option>
                <Select.Option value="CANCELLED">Đã hủy</Select.Option>
                <Select.Option value="COMPLETED">Hoàn thành</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="note" label="Ghi chú">
          <Input.TextArea rows={4} placeholder="Nhập ghi chú nếu có" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {mode === MODE.ADD ? 'Thêm lịch hẹn' : 'Cập nhật lịch hẹn'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AppointmentDetailModal;