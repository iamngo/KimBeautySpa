import {
  Button,
  DatePicker,
  Form,
  FormInstance,
  Input,
  Modal,
  Select,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import { Account } from "../../types";
import { MODE } from "../../../../utils/constants";
import moment from "moment";

interface EventModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  mode: string;
  account?: Account;
}

const EventModal: React.FC<EventModalProps> = ({
  visible,
  setVisible,
  mode,
  account,
}) => {
  const [form] = Form.useForm<FormInstance>();
  const [fileList, setFileList] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

  const disabledDate = (current) => {
    return current && current < moment().startOf("day");
  };

  const handleStartDateChange = (date: any) => {
    if (date) {
      const formattedDate = date.format("YYYY-MM-DD");
      setSelectedDate(formattedDate);
    } else {
      setSelectedDate(null);
    }
  };

  const handleEndDateChange = (date: any) => {
    if (date) {
      const formattedDate = date.format("YYYY-MM-DD");
      setSelectedDate(formattedDate);
    } else {
      setSelectedDate(null);
    }
  };

  const onFinish = async (values: Account) => {
    if (mode === MODE.ADD) {
      console.log(values);
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
      title={mode === MODE.ADD ? "Thêm sự kiện" : "Cập nhật sự kiện"}
    >
      <Form key={mode} layout="vertical" form={form} onFinish={onFinish}>
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
          name="endDate"
          rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            onChange={handleEndDateChange}
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
