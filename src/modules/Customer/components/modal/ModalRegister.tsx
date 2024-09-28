import { useState, useEffect } from "react";
import { Button, Form, Input, Modal, DatePicker, Select } from "antd";
import { FormInstance } from "antd/es/form";
import './styles.scss';

// Định nghĩa kiểu cho props
interface ModalRegisterProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const ModalRegister: React.FC<ModalRegisterProps> = ({ visible, setVisible }) => {
  const [form] = Form.useForm<FormInstance>();
  const [visibleModal, setVisibleModal] = useState<boolean>(false);

  useEffect(() => {
    setVisibleModal(visible);
  }, [visible]);

  const handleCancel = () => {
    form.resetFields();
    setVisibleModal(false);
    if (typeof setVisible === "function") {
      setVisible(false);
    }
  };

  const onFinish = async (values: any) => {
    // Xử lý logic sau khi submit form tại đây
    console.log("Form values:", values);
  };

  return (
    <Modal
      open={visibleModal}
      onCancel={handleCancel}
      footer={null}
    >
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
          name="name"
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
          <Select placeholder="Chọn dịch vụ">
            <Select.Option value="massage">Massage</Select.Option>
            <Select.Option value="facial">Chăm sóc da</Select.Option>
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
          <Select placeholder="Chọn chi nhánh">
            <Select.Option value="branch1">Chi nhánh 1</Select.Option>
            <Select.Option value="branch2">Chi nhánh 2</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Chọn thời gian:"
          name="time"
          rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Chọn nhân viên:" name="staff">
          <Select placeholder="Chọn nhân viên">
            <Select.Option value="staff1">Nhân viên 1</Select.Option>
            <Select.Option value="staff2">Nhân viên 2</Select.Option>
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
