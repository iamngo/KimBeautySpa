import React from "react";
import { Modal, Button, Form, Input } from "antd";

interface RoomModalProps {
  visible: boolean;
  onOk: (roomName: string) => void;
  onCancel: () => void;
}

const RoomModal: React.FC<RoomModalProps> = ({ visible, onOk, onCancel }) => {
  const [form] = Form.useForm();
  const handleOk = () => {
    form.validateFields().then(values => {
      onOk(values.roomName); 
      form.resetFields(); 
    });
  };
  return (
    <Modal
      title="Thêm Phòng"
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
    >
     <Form form={form} layout="vertical">
        <Form.Item
          label="Tên Phòng"
          name="roomName"
          rules={[{ required: true, message: 'Vui lòng nhập tên phòng!' }]} // Quy tắc xác thực
        >
          <Input placeholder="Nhập tên phòng" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoomModal; 