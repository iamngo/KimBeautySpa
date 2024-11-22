import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Upload,
  Row,
  Col,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { Service } from "../../types";
import { MODE } from "../../../../utils/constants";
import type { FormInstance } from "antd";
import {
  createService,
  createServiceCategory,
  getAllRoom,
  getAllServiceCategory,
  updateService,
  updateServiceCategory,
} from "../../../../services/api";

interface ServiceModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  mode: string;
  service?: Service;
}

const ServiceCategoryModal: React.FC<ServiceModalProps> = ({
  visible,
  setVisible,
  mode,
  service,
}) => {
  const [form] = Form.useForm<FormInstance>();
  const [fileList, setFileList] = useState<any[]>([]);
  const [categories, setCategories] = useState<[]>([]);
  const token = localStorage.getItem("accessToken") || "";
  const [rooms, setRooms] = useState<[]>([]);

  useEffect(() => {
    if (visible) {
      fetchRoom();
      if (mode === MODE.ADD) {
        form.resetFields();
      } else if (mode === MODE.EDIT && service) {
        const formattedService = {
          ...service,
        };
        form.setFieldsValue(formattedService);
      }
    }
  }, [visible, mode, service, form]);

  const fetchRoom = async () => {
    const responseRoom = await getAllRoom(1, 200);
    setRooms(responseRoom.data);
  };

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values) => {
    if (mode === MODE.ADD) {
      try {
        const serviceCategory = {
          name: values.name,
          roomId: values.roomId,
        };
        const response = await createServiceCategory(token, serviceCategory);
        if (response?.data !== null) {
          message.success("Thêm phân loại dịch vụ thành công!");
          setVisible(!visible);
        } else {
          message.error("Thêm phân loại dịch vụ thất bại!");
        }
      } catch (error) {
        console.log("Validation failed:", error);
      }
    }
    if (mode === MODE.EDIT) {
      try {
        const serviceCategory = {
          name: values.name,
          roomId: values.roomId,
        };
        const response = await updateServiceCategory(
          token,
          serviceCategory,
          values.id
        );
        console.log(response);

        if (response?.data !== null) {
          message.success("Cập nhật phân loại dịch vụ thành công!");
          setVisible(!visible);
        } else {
          message.error("Cập nhật phân loại dịch vụ thất bại!");
        }
      } catch (error) {
        console.log("Validation failed:", error);
      }
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={handleCancel}
      footer={null}
      title={
        mode === MODE.ADD
          ? "Thêm phân loại dịch vụ"
          : "Cập nhật thông tin phân loại"
      }
    >
      <Form key={mode} layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item label="ID" name="id">
          <Input type="number" placeholder="ID" disabled />
        </Form.Item>
        <Form.Item
          label="Tên phân loại dịch vụ"
          name="name"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên phân loại dịch vụ",
            },
          ]}
        >
          <Input placeholder="Nhập tên phân loại dịch vụ" />
        </Form.Item>
        <Form.Item
          label="Chọn phòng dịch vụ"
          name="roomId"
          rules={[{ required: true, message: "Vui lòng chọn phòng dịch vụ" }]}
        >
          <Select placeholder="Chọn phòng dịch vụ">
            {rooms.map((room: any) => (
              <Select.Option key={room.id} value={room.id}>
                {room.name}
              </Select.Option>
            ))}
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

export default ServiceCategoryModal;
