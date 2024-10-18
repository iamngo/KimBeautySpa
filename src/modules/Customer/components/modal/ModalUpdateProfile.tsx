import React, { useState } from "react";
import { Modal, Form, Input, DatePicker, Radio, Upload, Button } from "antd";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";

interface ModalUpdateProfileProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const ModalUpdateProfile: React.FC<ModalUpdateProfileProps> = ({
  visible,
  setVisible,
}) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      console.log("Updated values: ", values);
      // Gửi dữ liệu cập nhật đến server
      setVisible(false);
    });
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <Modal
      visible={visible}
      title="Cập nhật thông tin tài khoản"
      onCancel={handleCancel}
      onOk={handleOk}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="avatar" label="Ảnh đại diện">
          <Upload name="avatar" listType="picture" beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          name="name"
          label="Họ và tên"
          rules={[{ required: true, message: "Vui lòng nhập tên" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
        </Form.Item>
        <Form.Item
          name="gender"
          label="Giới tính"
          rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
        >
          <Radio.Group>
            <Radio value="male">Nam</Radio>
            <Radio value="female">Nữ</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="dob"
          label="Ngày sinh"
          rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
        >
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ type: "email" }]}>
          <Input placeholder="Nhập email" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalUpdateProfile;
