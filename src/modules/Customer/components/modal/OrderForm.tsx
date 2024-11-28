import React, { useEffect, useState } from "react";
import { Modal, Form, Input, DatePicker, Button, message, Select } from "antd";
import moment from "moment";
import "moment/locale/vi";
import locale from "antd/es/date-picker/locale/vi_VN";
import {
  getAllBranch,
  getIdBonus,
  registerAppointment,
} from "../../../../services/api";

interface OrderFormProps {
  visible: boolean;
  onCancel: () => void;
  product: {
    id: number;
    name: string;
    price: number;
    specialPrice?: number;
  };
  customer?: {
    fullName: string;
    phone: string;
  };
}

const OrderForm: React.FC<OrderFormProps> = ({
  visible,
  onCancel,
  product,
  customer,
}) => {
  const [form] = Form.useForm();
  const token = localStorage.getItem("accessToken");
  const [userId, setUserId] = useState(null);
  const [employee, setEmployee] = useState();
  const [idBonus, setIdBonus] = useState(0);
  const [branch, setBranch] = useState([]);
  useEffect(() => {
    if (customer) {
      form.setFieldsValue({
        customerName: customer.fullName,
        phone: customer.phone,
      });
    }
  }, [customer, form]);
  useEffect(() => {
    getNewIdBonus();
    fetchBranch();
  }, []);
  const getNewIdBonus = async () => {
    const response = await getIdBonus();
    setIdBonus(response?.data?.id);
  };
  const fetchBranch = async () => {
    const response = await getAllBranch(1, 10);
    setBranch(response?.data);
  };
  const onFinish = async (values: any) => {
    const appointment = {
      dateTime: values.pickupTime.format("YYYY-MM-DD HH:mm:ss"),
      status: "confirmed",
      category: "products",
      foreignKeyId: product.id,
      employeeId: null,
      customerId: customer?.id,
      branchId: values.branch,
      bedId: null,
      bonusId: idBonus,
      fullName: values.customerName,
      phone: values.phone,
      expense: product.specialPrice
    };
    const response = await registerAppointment(appointment);
    console.log(response);

    if (response?.data !== null) {
      message.success("Đặt hàng thành công!");
      form.resetFields();
      onCancel();
    } else {
      message.success("Đặt hàng thất bại!");
    }
  };

  const disabledDate = (current: moment.Moment) => {
    // Không cho phép chọn ngày trong quá khứ
    return current && current < moment().startOf("day");
  };

  const disabledTime = (date: moment.Moment) => {
    if (date && date.isSame(moment(), "day")) {
      const hours = moment().hours();
      return {
        disabledHours: () => Array.from({ length: hours }, (_, i) => i),
      };
    }
    return {};
  };

  return (
    <Modal
      title="Đặt sản phẩm"
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          productName: product.name,
          price: (product.specialPrice || product.price)?.toLocaleString(
            "vi-VN",
            {
              style: "currency",
              currency: "VND",
            }
          ),
          customerName: customer?.fullName,
          phone: customer?.phone,
        }}
      >
        <Form.Item
          name="customerName"
          label="Họ tên khách hàng"
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
        >
          <Input placeholder="Nhập họ tên" disabled={!!customer} />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            { pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ!" },
          ]}
        >
          <Input placeholder="Nhập số điện thoại" disabled={!!customer} />
        </Form.Item>

        <Form.Item name="productName" label="Tên sản phẩm">
          <Input disabled />
        </Form.Item>

        <Form.Item name="price" label="Giá">
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="pickupTime"
          label="Thời gian nhận hàng"
          rules={[
            { required: true, message: "Vui lòng chọn thời gian nhận hàng!" },
          ]}
        >
          <DatePicker
            format="DD/MM/YYYY HH:mm"
            showTime={{ format: "HH:mm" }}
            locale={locale}
            disabledDate={disabledDate}
            disabledTime={disabledTime}
            showNow={false}
            placeholder="Chọn ngày giờ nhận hàng"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          name="branch"
          label="Chi nhánh nhận hàng"
          rules={[{ required: true, message: "Vui lòng chọn chi nhánh!" }]}
        >
          <Select placeholder="Chọn chi nhánh">
            {branch.map((item: any) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name} - {item.address}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item className="form-actions">
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            Đặt hàng
          </Button>
          <Button onClick={onCancel}>Hủy</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OrderForm;
