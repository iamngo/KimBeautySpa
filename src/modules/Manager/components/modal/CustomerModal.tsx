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
import { Customer } from "../../types";
import { MODE } from "../../../../utils/constants";
import type { FormInstance } from "antd";
import moment from "moment";
import { registerCustomer } from "../../../../services/api";

interface CustomerModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  mode: string;
  customer?: Customer;
}

const CustomerModal: React.FC<CustomerModalProps> = ({
  visible,
  setVisible,
  mode,
  customer,
}) => {
  const [form] = Form.useForm<FormInstance>();
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    if (visible) {
      if (mode === MODE.ADD) {
        form.resetFields();
        form.setFieldsValue({ gender: true });
      } else if (mode === MODE.EDIT && customer) {
        const formattedCustomer = {
          ...customer,
          dob: customer.dob ? moment(customer.dob) : null,
        };
        form.setFieldsValue(formattedCustomer);
      }
    }
  }, [visible, mode, customer, form]);

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: Customer) => {
    if (mode === MODE.ADD) {
      try {
        const formData = new FormData();
        const account = {
          phone: values.phone,
          password: "123456",
          type: "customer",
          status: "active",
        };
        const customer = {
          fullName: values.fullName,
          gender: values.gender,
          dob: values.dob.format("YYYY-MM-DD"),
          phone: values.phone,
          email: values.email ? values.email : null,
          address: values.address,
        };
        const dataToSend = {
          account: account,
          customer: customer,
        };
        formData.append(
          "file",
          fileList[0]?.originFileObj ? fileList[0].originFileObj : null
        );
        formData.append("data", JSON.stringify(dataToSend));

        const response = await registerCustomer(formData);
        console.log(response);

        if (response?.data !== null) {
          message.success("Đăng ký thành công!");
          setVisible(!visible);
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
    centered
      open={visible}
      onCancel={handleCancel}
      footer={null}
      title={
        mode === MODE.ADD ? "Thêm khách hàng" : "Cập nhật thông tin khách hàng"
      }
    >
      <Form key={mode} layout="vertical" form={form} onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="ID" name="id">
              <Input type="number" placeholder="ID" disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Account ID" name="accountId">
              <Input disabled type="number" placeholder="Account ID" />
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
              label="Ngày sinh"
              name="dob"
              rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Chọn ngày sinh"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ type: "email", message: "Email không hợp lệ" }]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
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
          </Col>
          <Col span={12}>
            <Form.Item label="Ảnh" name="image">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                beforeUpload={() => false}
                maxCount={1}
              >
                <div>Upload</div>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
        >
          <Input placeholder="Nhập địa chỉ" />
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

export default CustomerModal;
