import React from "react";
import { Modal, Form, Input, Select } from "antd";

interface BedModalProps {
  visible: boolean;
  onOk: (bedName: string, status: string, roomId: string) => void;
  onCancel: () => void;
  roomId: string; // Thêm roomId vào props
}

const BedModal: React.FC<BedModalProps> = ({ visible, onOk, onCancel, roomId }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then(values => {
      onOk(values.bedName, values.status, roomId); // Gọi hàm onOk với thông tin giường
      form.resetFields();
    });
  };

  return (
    <Modal
      title="Thêm Giường"
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên Giường"
          name="bedName"
          rules={[{ required: true, message: 'Vui lòng nhập tên giường!' }]}
        >
          <Input placeholder="Nhập tên giường" />
        </Form.Item>
        <Form.Item
          label="Trạng Thái"
          name="status"
          initialValue="active" // Mặc định là active
        >
          <Select>
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="inactive">Inactive</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BedModal; 