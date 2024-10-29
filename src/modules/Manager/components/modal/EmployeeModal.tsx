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
import { Employee } from "../../types";
import { MODE } from "../../../../utils/constants";
import type { FormInstance } from "antd";
import moment from "moment";
import { createEmployee } from "../../../../services/api";

interface EmployeeModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  mode: string;
  employee?: Employee;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
  visible,
  setVisible,
  mode,
  employee,
}) => {
  const [form] = Form.useForm<FormInstance>();
  const [fileList, setFileList] = useState<any[]>([]);
  const token = localStorage.getItem("accessToken");


  useEffect(() => {
    if (visible) {
      if (mode === MODE.ADD) {
        form.resetFields();
      } else if (mode === MODE.EDIT && employee) {
        const formattedEmployee = {
          ...employee,
          dob: employee.dob ? moment(employee.dob) : null,
        };
        if (employee.image) {
          setFileList([
            {
              uid: '-1',
              name: 'Ảnh nhân viên',
              status: 'done',
              url: employee.image, 
            },
          ]);
        }
        form.setFieldsValue(formattedEmployee);
      }
    }
  }, [visible, mode, employee, form]);

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values: Employee) => {
    if (mode === MODE.ADD) {
      const formData = new FormData();
      if (fileList[0]?.originFileObj) {
        formData.append("file", fileList[0].originFileObj);
      }
      formData.append(
        "data",
        JSON.stringify({
          ...values,
          accountId: Number(values.accountId),
          gender: values.gender,
          dob: values.dob.format("YYYY-MM-DD"),
          wageId: Number(values.wageId)
        })
      );
      try {
        const response = await createEmployee(token, formData);
        console.log(response);
        if(response.data){
          message.success('Thêm nhân viên thành công!');
          form.resetFields();
          setVisible(false);
        }
        else
          message.error('Thêm thất bại!');
      } catch (error) {
        console.error(error);
        
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
      title={
        mode === MODE.ADD ? "Thêm nhân viên" : "Cập nhật thông tin nhân viên"
      }
    >
      <Form key={mode} layout="vertical" form={form} onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="ID" name="id">
              <Input type="number" placeholder="ID nhân viên" disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Account ID"
              name="accountId"
              rules={[{ required: true, message: "Vui lòng nhập Account ID" }]}
            >
              <Input type="number" placeholder="Nhập Account ID" />
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
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
            >
              <Input placeholder="Nhập địa chỉ" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
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
          <Col span={12}>
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
              label="Chọn vai trò:"
              name="role"
              rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
            >
              <Select placeholder="Chọn vai trò">
                <Select.Option key={1} value="manage">
                  Manager
                </Select.Option>
                <Select.Option key={2} value="admin">
                  Admin
                </Select.Option>
                <Select.Option key={3} value="employee">
                  Employee
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Chọn trạng thái:"
              name="status"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Select.Option key={1} value="active">
                  Active
                </Select.Option>
                <Select.Option key={2} value="inactive">
                  Inactive
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Wage ID"
              name="wageId"
              rules={[{ required: true, message: "Vui lòng nhập Wage ID" }]}
            >
              <Input type="number" placeholder="Nhập Wage ID" />
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

export default EmployeeModal;
