import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  message,
  Upload,
  Row,
  Col,
  Switch,
} from "antd";
import { MODE } from "../../../../utils/constants";
import { createGift, updateGift } from "../../../../services/api";
import { IGift } from "../../types";

interface IProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  mode: string;
  gift?: IGift;
}

const GiftModal: React.FC<IProps> = ({
  visible,
  setVisible,
  mode,
  gift,
}) => {
  const [form] = Form.useForm();
  const token = localStorage.getItem("accessToken") || "";
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    if (visible) {
      if (mode === MODE.ADD) {
        form.resetFields();
        form.setFieldsValue({
          status: true
        });
      } else if (mode === MODE.EDIT && gift) {
        form.setFieldsValue({
          ...gift,
          status: gift.status === "active"
        });
        if (gift.image) {
          setFileList([
            {
              uid: "-1",
              name: "Ảnh quà tặng",
              status: "done",
              url: gift.image,
            },
          ]);
        }
      }
    }
  }, [visible, mode, gift]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      
      const giftData = {
        ...values,
        status: values.status ? "active" : "inactive",
        point: Number(values.point),
        image:
          mode === MODE.EDIT && !fileList[0]?.originFileObj
            ? gift?.image
            : "image.png",
      };

      if (fileList[0]?.originFileObj) {
        formData.append("file", fileList[0].originFileObj);
      }
      formData.append("data", JSON.stringify(giftData));

      console.log("Data being sent:", giftData);

      if (mode === MODE.ADD) {
        const response = await createGift(token, formData);
        console.log(response);
        
        if (response.data) {
          message.success("Thêm quà tặng thành công!");
        } else {
          message.error("Thêm quà tặng thất bại!");
        }
      } else {
        const response = await updateGift(token, formData, gift?.id!);
        if (response.data) {
          message.success("Cập nhật quà tặng thành công!");
        } else {
          message.error("Cập nhật quà tặng thất bại!");
        }
      }
      setVisible(false);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      message.error("Có lỗi xảy ra");
    }
  };

  return (
    <Modal
      title={mode === MODE.ADD ? "Thêm quà tặng" : "Cập nhật quà tặng"}
      open={visible}
      onOk={handleSubmit}
      onCancel={() => {
        setVisible(false);
        form.resetFields();
        setFileList([]);
      }}
      className="gift-modal"
      width={600}
      centered
    >
      <Form form={form} layout="vertical" className="gift-form">
        <Row>
          <Col span={12}>
            <Form.Item
              name="image"
              label="Hình ảnh"
              className="form-col"
              rules={[{ required: true, message: "Vui lòng tải lên hình ảnh" }]}
            >
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                beforeUpload={() => false}
                maxCount={1}
              >
                {fileList.length < 1 && (
                  <div>
                    <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="id" label="ID">
              <Input type="number" disabled placeholder="ID quà tặng" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Tên quà tặng"
              className="form-col"
              rules={[
                { required: true, message: "Vui lòng nhập tên quà tặng" },
                { min: 3, message: "Tên phải có ít nhất 3 ký tự" },
              ]}
            >
              <Input placeholder="Nhập tên quà tặng" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="point"
              label="Điểm đổi"
              className="form-col"
              rules={[
                { required: true, message: "Vui lòng nhập số điểm cần đổi" },
                {
                  validator: async (_, value) => {
                    const num = Number(value);
                    if (isNaN(num)) {
                      throw new Error("Vui lòng nhập số");
                    }
                    if (num < 0) {
                      throw new Error("Số điểm phải lớn hơn hoặc bằng 0");
                    }
                    if (!Number.isInteger(num)) {
                      throw new Error("Số điểm phải là số nguyên");
                    }
                  },
                },
              ]}
            >
              <Input type="number" placeholder="Nhập số điểm cần đổi" min={0} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Trạng thái"
              className="form-col"
              valuePropName="checked"
            >
              <Switch 
                checkedChildren="Hoạt động" 
                unCheckedChildren="Tạm dừng"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default GiftModal;