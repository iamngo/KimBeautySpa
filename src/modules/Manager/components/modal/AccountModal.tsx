import { Button, Form, FormInstance, Input, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import { Account } from "../../types";
import { MODE } from "../../../../utils/constants";

interface AccountModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  mode: string;
  account?: Account;
}

const AccountModal: React.FC<AccountModalProps> = ({
  visible,
  setVisible,
  mode,
  account,
}) => {
  const [form] = Form.useForm<FormInstance>();

  useEffect(() => {
    if (visible) {
      if (mode === MODE.ADD) {
        form.resetFields(); // Reset form khi ở chế độ add
      } else if (mode === MODE.EDIT && account) {
        form.setFieldsValue(account); // Điền dữ liệu khi ở chế độ edit
      }
    }
  }, [visible, mode, account, form]);

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
    if (typeof setVisible === "function") {
      setVisible(false);
    }
  };

  const onFinish = async (values: Account) => {
    if(mode === MODE.ADD){
        console.log(values);   
    } 
    if(mode === MODE.EDIT){
        console.log(values);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={handleCancel}
      footer={null}
      title={mode === MODE.ADD ? "Thêm tài khoản" : "Cập nhật tài khoản"}
    >
      <Form key={mode} layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="Số điện thoại:"
          name="phone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
        <Form.Item
          label="Chọn loại tài khoản:"
          name="type"
          rules={[{ required: true, message: "Vui lòng chọn loại tài khoản" }]}
        >
          <Select
            placeholder="Chọn loại tài khoản"
            // onChange={(value) => setSelectedBranch(value)}
          >
            <Select.Option key={1} value={'customer'}>
              Customer
            </Select.Option>
            <Select.Option key={2} value={'employee'}>
              Employee
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Chọn trạng thái:"
          name="status"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select
            placeholder="Chọn trạng thái"
            // onChange={(value) => setSelectedBranch(value)}
          >
            <Select.Option key={1} value={'active'}>
              Active
            </Select.Option>
            <Select.Option key={2} value={'inactive'}>
              Inactive
            </Select.Option>
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

export default AccountModal;
