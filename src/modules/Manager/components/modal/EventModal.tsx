import {
  Button,
  DatePicker,
  Form,
  FormInstance,
  Input,
  message,
  Modal,
  Select,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import { Event } from "../../types";
import { MODE } from "../../../../utils/constants";
import moment from "moment";
import { createEvent, updateEvent } from "../../../../services/api";

interface EventModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  mode: string;
  event?: Event;
  toggleRefresh: () => void;
}

interface EventFormValues {
  id?: number;
  name?: string;
  startDate?: moment.Moment;
  expiryDate?: moment.Moment;
  image?: string;
}

const EventModal: React.FC<EventModalProps> = ({
  visible,
  setVisible,
  mode,
  event,
  toggleRefresh,
}) => {
  const [form] = Form.useForm<EventFormValues>();
  const [fileList, setFileList] = useState<any[]>([]);
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(
    null
  );
  const [selectedExpiryDate, setSelectedExpiryDate] = useState<string | null>(
    null
  );
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (visible) {
      if (mode === MODE.ADD) {
        form.resetFields(); // Reset form khi ở chế độ add
        setFileList([]);
      } else if (mode === MODE.EDIT && event) {
        form.setFieldsValue(event); // Điền dữ liệu khi ở chế độ edit
        if (event.image) {
          setFileList([
            {
              uid: "-1",
              name: "Ảnh nhân viên",
              status: "done",
              url: event.image,
            },
          ]);
        }
      }
    }
  }, [visible, mode, event, form]);

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
    if (typeof setVisible === "function") {
      setVisible(false);
    }
  };

  const disabledDate = (current) => {
    return current && current < moment().startOf("day");
  };

  const handleStartDateChange = (date: any) => {
    if (date) {
      const formattedDate = date.format("YYYY-MM-DD");
      setSelectedStartDate(formattedDate);
    } else {
      setSelectedStartDate(null);
    }
  };

  const handleExpiryDateChange = (date: any) => {
    if (date) {
      const formattedDate = date.format("YYYY-MM-DD");
      setSelectedExpiryDate(formattedDate);
    } else {
      setSelectedExpiryDate(null);
    }
  };

  const onFinish = async (values: Event) => {
    const formData = new FormData();
    formData.append(
      "file",
      fileList[0]?.originFileObj ? fileList[0].originFileObj : null
    );
    formData.append(
      "data",
      JSON.stringify({
        name: values.name,
        startDate: `${values.startDate.format("YYYY-MM-DD")}`,
        expiryDate: `${values.expiryDate.format("YYYY-MM-DD")}`,
        image: values.image,
      })
    );
    if (mode === MODE.ADD) {
      try {
        const response = await createEvent(token, formData);
        console.log(response.data);
        if (response?.data !== null) {
          message.success("Thêm thành công!");
          setVisible(!visible);
          toggleRefresh();
        } else {
          console.log(response.error);
        }
      } catch (error) {
        console.log("Validation failed:", error);
      }
    }
    if (mode === MODE.EDIT) {
      console.log(values);
      try {
        const response = await updateEvent(token, formData, Number(values.id));
        console.log(response.data);
        if (response?.data !== null) {
          message.success("Cập nhật thành công!");
          setVisible(!visible);
          toggleRefresh();
        } else {
          console.log(response.error);
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
      title={mode === MODE.ADD ? "Thêm sự kiện" : "Cập nhật sự kiện"}
    >
      <Form key={mode} layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="ID:"
          name="id"
          style={{
            display: "none",
          }}
        >
          <Input placeholder="Nhập ID sự kiện" />
        </Form.Item>
        <Form.Item
          label="Tên sự kiện:"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên sự kiện" }]}
        >
          <Input placeholder="Nhập tên sự kiện" />
        </Form.Item>
        <Form.Item
          label="Ngày bắt đầu:"
          name="startDate"
          rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            onChange={handleStartDateChange}
            disabledDate={disabledDate}
          />
        </Form.Item>
        <Form.Item
          label="Ngày hết hạn:"
          name="expiryDate"
          rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            onChange={handleExpiryDateChange}
            disabledDate={disabledDate}
          />
        </Form.Item>
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
        <Form.Item>
          <Button htmlType="submit" block className="btn-custom">
            Xác nhận
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EventModal;
