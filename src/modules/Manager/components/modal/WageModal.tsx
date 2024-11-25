import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select, message } from "antd";
import { MODE } from "../../../../utils/constants";
import dayjs from "dayjs";
import { createWage, updateWage } from "../../../../services/api";

interface IProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  mode: string;
  wage?: any;
}

const WageModal: React.FC<IProps> = ({
  visible,
  setVisible,
  mode,
  wage,
}) => {
  const [form] = Form.useForm();
  const token = localStorage.getItem("accessToken") || "";

  useEffect(() => {
    if (wage && mode === MODE.EDIT) {
      form.setFieldsValue({
        ...wage,
        effectiveDate: dayjs(wage.effectiveDate),
      });
    }
  }, [wage, mode]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        effectiveDate: values.effectiveDate.format('YYYY-MM-DD'),
        hourlyRate: parseFloat(values.hourlyRate),
      };

      if (mode === MODE.ADD) {
        const response = await createWage(token, formattedValues);
        if(response.data){
          message.success("Thêm mức lương thành công!");
        } else {
          message.error("Thêm mức lương thất bại!");
        }
      } else {
        const response = await updateWage(token, formattedValues, wage?.id);
        if(response.data){
          message.success("Cập nhật mức lương thành công!");
        } else {
          message.error("Cập nhật mức lương thất bại!");
        }
      }
      setVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Có lỗi xảy ra");
    }
  };
  const disabledDate = (current: dayjs.Dayjs) => {
    // Không cho phép chọn ngày trước ngày hiện tại
    return current && current < dayjs().startOf('day');
  };
  return (
    <Modal
      title={mode === MODE.ADD ? "Thêm mức lương" : "Cập nhât mức lương"}
      open={visible}
      onOk={handleSubmit}
      onCancel={() => {
        setVisible(false);
        form.resetFields();
      }}
      className="wage-modal"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="hourlyRate"
          label="Mức lương theo giờ"
          rules={[{ required: true, message: "Vui lòng nhập mức lương" }]}
        >
          <Input type="number" placeholder="Nhập mức lương theo giờ" />
        </Form.Item>

        <Form.Item
          name="effectiveDate"
          label="Ngày hiệu lực"
          rules={[{ required: true, message: "Vui lòng chọn ngày hiệu lực" }]}
        >
          <DatePicker 
            format="DD/MM/YYYY"
            placeholder="Chọn ngày hiệu lực"
            style={{ width: '100%' }}
            disabledDate={disabledDate}
          />
        </Form.Item>

        <Form.Item
          name="role"
          label="Vai trò"
          rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
        >
          <Select placeholder="Chọn vai trò">
            <Select.Option value="employee">Nhân viên</Select.Option>
            <Select.Option value="manager">Quản lý</Select.Option>
            <Select.Option value="admin">Quản trị viên</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default WageModal;
