import React, { useEffect, useState } from "react";
import { Modal, Form, Input, DatePicker, Radio, Upload, Button, FormInstance } from "antd";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
import { getInfoByAccountId, updateInfoCustomer } from "../../../../services/api";
import moment from "moment";

interface ModalUpdateProfileProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  userId: number | null;
}

const ModalUpdateProfile: React.FC<ModalUpdateProfileProps> = ({
  visible,
  setVisible,
  userId
}) => {
  const [form] = Form.useForm<FormInstance>();
  const token = localStorage.getItem("accessToken");
  const [customer, setCustomer] = useState(null);
  const [fileList, setFileList] = useState<any[]>([]);
  
  useEffect(() => {
    getInfoCustomer();
  }, [userId])

  useEffect(() => {
    if (customer) {
      form.setFieldsValue({
        fullName: customer.fullName,
        phone: customer.phone,
        gender: customer.gender ? 'male' : 'female',
        dob: moment(customer.dob),
        address: customer.address,
        email: customer.email
      });
      if (customer.image) {
        setFileList([
          {
            uid: '-1', // ID duy nhất cho ảnh
            name: 'avatar.png',
            status: 'done',
            url: customer.image, // URL ảnh từ dữ liệu customer
          }
        ]);
      }
    }
  }, [customer, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await handleUploadImage(values);
      setVisible(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
    }
  };

  const handleUploadImage = async (values) => {
    const formData = new FormData();
    if (fileList[0]?.originFileObj) {
      formData.append("file", fileList[0].originFileObj);
    }
    formData.append(
      "data",
      JSON.stringify({
        ...values,
        gender: values.gender === 'male', 
        dob: values.dob.format("YYYY-MM-DD"),
        accountId: userId,
      })
    );

    try {
      const response = await updateInfoCustomer(token, formData);
      console.log("Kết quả cập nhật:", response.data);
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const getInfoCustomer = async () => {
    const response = await getInfoByAccountId(token, userId);
    setCustomer(response.data);
    console.log(response.data);
    
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
        <Upload
            name="avatar"
            listType="picture"
            fileList={fileList} 
            onChange={({ fileList }) => setFileList(fileList)} 
            beforeUpload={() => false}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          name="fullName"
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
