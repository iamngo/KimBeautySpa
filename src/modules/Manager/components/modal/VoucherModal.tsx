import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Upload,
  Row,
  Col,
} from "antd";
import { MODE } from "../../../../utils/constants";
import { createVoucher, updateVoucher } from "../../../../services/api";
import dayjs from "dayjs";
import { IVoucher } from "../../types";

interface IProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  mode: string;
  voucher?: IVoucher;
}

const disabledDate = (current: dayjs.Dayjs) => {
  return current && current < dayjs().startOf("day");
};

const VoucherModal: React.FC<IProps> = ({
  visible,
  setVisible,
  mode,
  voucher,
}) => {
  const [form] = Form.useForm();
  const token = localStorage.getItem("accessToken") || "";
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    if (visible) {
      if (mode === MODE.ADD) {
        form.resetFields();
      } else if (mode === MODE.EDIT && voucher) {
        form.setFieldsValue({
          ...voucher,
          expiryDate: dayjs(voucher.expiryDate),
        });
        if (voucher.image) {
          setFileList([
            {
              uid: "-1",
              name: "Ảnh voucher",
              status: "done",
              url: voucher.image,
            },
          ]);
        }
      }
    }
  }, [visible, mode, voucher]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();

      const voucherData = {
        ...values,
        discount: Number(values.discount),
        minimumOrder: Number(values.minimumOrder),
        maximumDiscount: Number(values.maximumDiscount),
        point: Number(values.point),
        expiryDate: values.expiryDate.format("YYYY-MM-DD"),
        image:
          mode === MODE.EDIT && !fileList[0]?.originFileObj
            ? voucher?.image
            : "image.png",
      };

      if (fileList[0]?.originFileObj) {
        formData.append("file", fileList[0].originFileObj);
      }
      formData.append("data", JSON.stringify(voucherData));

      console.log("Data being sent:", voucherData);

      if (mode === MODE.ADD) {
        const response = await createVoucher(token, formData);
        console.log(response);

        if (response.data) {
          message.success("Thêm voucher thành công!");
        } else {
          message.error("Thêm voucher thất bại!");
        }
      } else {
        const response = await updateVoucher(token, formData, voucher?.id!);
        if (response.data) {
          message.success("Cập nhật voucher thành công!");
        } else {
          message.error("Cập nhật voucher thất bại!");
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
      title={mode === MODE.ADD ? "Thêm voucher" : "Cập nhật voucher"}
      open={visible}
      onOk={handleSubmit}
      onCancel={() => {
        setVisible(false);
        form.resetFields();
        setFileList([]);
      }}
      className="voucher-modal"
      width={600}
      centered
    >
      <Form form={form} layout="vertical" className="voucher-form">
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
              <Input type="number" disabled placeholder="ID voucher" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="discount"
              label="Phần trăm giảm giá"
              className="form-col"
              rules={[
                { required: true, message: "Vui lòng nhập phần trăm giảm giá" },
                {
                  validator: async (_, value) => {
                    const num = Number(value);
                    if (isNaN(num)) {
                      throw new Error("Vui lòng nhập số");
                    }
                    if (num < 0 || num > 100) {
                      throw new Error("Phần trăm giảm giá phải từ 0 đến 100");
                    }
                  },
                },
              ]}
            >
              <Input
                type="number"
                placeholder="Nhập phần trăm giảm giá"
                suffix="%"
                min={0}
                max={100}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="minimumOrder"
              label="Đơn hàng tối thiểu"
              className="form-col"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập giá trị đơn hàng tối thiểu",
                },
                {
                  validator: async (_, value) => {
                    const num = Number(value);
                    if (isNaN(num)) {
                      throw new Error("Vui lòng nhập số");
                    }
                    if (num < 0) {
                      throw new Error("Giá trị phải lớn hơn hoặc bằng 0");
                    }
                  },
                },
              ]}
            >
              <Input
                type="number"
                placeholder="Nhập giá trị đơn hàng tối thiểu"
                min={0}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="maximumDiscount"
              label="Giảm giá tối đa"
              className="form-col"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập giá trị giảm tối đa",
                },
                {
                  validator: async (_, value) => {
                    const num = Number(value);
                    if (isNaN(num)) {
                      throw new Error("Vui lòng nhập số");
                    }
                    if (num < 0) {
                      throw new Error("Giá trị phải lớn hơn hoặc bằng 0");
                    }
                  },
                },
              ]}
            >
              <Input
                type="number"
                placeholder="Nhập giá trị giảm tối đa"
                min={0}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="expiryDate"
              label="Ngày hết hạn"
              className="form-col"
              rules={[
                { required: true, message: "Vui lòng chọn ngày hết hạn" },
              ]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                placeholder="Chọn ngày hết hạn"
                style={{ width: "100%" }}
                disabledDate={disabledDate}
              />
            </Form.Item>
          </Col>

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
        </Row>
      </Form>
    </Modal>
  );
};

export default VoucherModal;
