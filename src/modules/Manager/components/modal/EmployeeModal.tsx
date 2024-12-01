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
import {
  createEmployee,
  getWagesByRole,
  registerEmployee,
} from "../../../../services/api";

interface EmployeeModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  mode: string;
  employee?: Employee;
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
  wageId?: number; // Thêm wageId ở đây
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
  visible,
  setVisible,
  mode,
  employee,
}) => {
  const [form] = Form.useForm<EmployeeFormValues>();
  const [fileList, setFileList] = useState<any[]>([]);
  const token = localStorage.getItem("accessToken");
  const [wageId, setWageId] = useState(0);

  useEffect(() => {
    if (visible) {
      if (mode === MODE.ADD) {
        form.resetFields();
        form.setFieldsValue({ status: "active", gender: true });
      } else if (mode === MODE.EDIT && employee) {
        const formattedEmployee = {
          ...employee,
          dob: employee.dob ? moment(employee.dob) : null,
        };
        if (employee.image) {
          setFileList([
            {
              uid: "-1",
              name: "Ảnh nhân viên",
              status: "done",
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

  const handleWageByRole = async (role: string) => {
    try {
      const response = await getWagesByRole(token, role);

      if (response?.data && response?.data[0].id) {
        form.setFieldsValue({ wageId: response?.data[0].id });
        setWageId(response?.data[0].id);
      }
    } catch (error) {
      console.error("Error fetching wage by role:", error);
      message.error("Không thể lấy Wage ID cho vai trò đã chọn.");
    }
  };

  const onFinish = async (values: Employee) => {
    if (mode === MODE.ADD) {
      try {
        const formData = new FormData();
        const account = {
          phone: values.phone,
          password: "123456",
          type: "employee",
          status: "active",
        };
        const employee = {
          fullName: values.fullName,
          gender: values.gender,
          dob: values.dob.format("YYYY-MM-DD"),
          phone: values.phone,
          email: values.email,
          address: values.address,
          role: values.role,
          status: values.status,
          image: "image.png",
          wageId: wageId,
        };
        const dataToSend = {
          account: account,
          employee: employee,
        };
        formData.append(
          "file",
          fileList[0]?.originFileObj ? fileList[0].originFileObj : null
        );
        formData.append("data", JSON.stringify(dataToSend));
        const response = await registerEmployee(formData);
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
              <Select
                placeholder="Chọn vai trò"
                onChange={(value) => handleWageByRole(value)}
              >
                <Select.Option key={1} value="manager">
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
              <Input disabled type="number" placeholder="Wage ID" />
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
