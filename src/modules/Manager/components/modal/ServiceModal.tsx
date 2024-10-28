import { Button, Form, Input, Modal, Select, DatePicker, Radio, Upload } from "antd";
import React, { useEffect } from "react";
import { Service } from "../../types";
import { MODE } from "../../../../utils/constants";
import type { FormInstance } from "antd";
import moment from "moment";

interface ServiceModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  mode: string;
  service?: Service;
}

const ServiceModal: React.FC<ServiceModalProps> = ({
  visible,
  setVisible,
  mode,
  service,
}) => {
  const [form] = Form.useForm<FormInstance>();

  useEffect(() => {
    if (visible) {
      if (mode === MODE.ADD) {
        form.resetFields(); 
      } else if (mode === MODE.EDIT && service) {
        const formattedService = {
            ...service,
            dob: service.dob ? moment(service.dob) : null,
          };
          form.setFieldsValue(formattedService);
      }
    }
  }, [visible, mode, service, form]);

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values:Service) => {
    if (mode === MODE.ADD) {
      console.log(values);
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
      title={mode === MODE.ADD ? "Thêm dịch vụ" : "Cập nhật thông tin dịch vụ"}
    >
      <Form key={mode} layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item label="ID" name="id">
          <Input type="number" placeholder="ID khách hàng" disabled />
        </Form.Item>
        <Form.Item
          label="Account ID"
          name="accountId"
          rules={[{ required: true, message: "Vui lòng nhập Account ID" }]}
        >
          <Input type="number" placeholder="Nhập Account ID" />
        </Form.Item>
        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
        >
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>
        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
        >
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>
        <Form.Item
          label="Ngày sinh"
          name="dob"
          rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
        >
          <DatePicker style={{ width: "100%" }} placeholder="Chọn ngày sinh" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>
        <Form.Item
          label="Giới tính"
          name="gender"
          rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
        >
          <Radio.Group>
            <Radio value={true}>Nam</Radio>
            <Radio value={false}>Nữ</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Ảnh" name="image">
          <Upload listType="picture-card">
            <div>Upload</div>
          </Upload>
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
        >
          <Input placeholder="Nhập số điện thoại" />
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

export default ServiceModal;