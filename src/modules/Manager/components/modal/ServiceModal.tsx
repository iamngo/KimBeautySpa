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
  createPrice,
  createService,
  getAllEvent,
  getAllServiceCategory,
  updatePrice,
  updateService,
} from "../../../../services/api";
import moment from "moment";

interface ServiceModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  mode: string;
  service?: Service & {
    originalPrice?: number;
    price?: number;
    specialPrice?: number;
    commission?: number;
    status?: string;
    eventId?: string;
  };
}
const { Option } = Select;

const ServiceModal: React.FC<ServiceModalProps> = ({
  visible,
  setVisible,
  mode,
  service,
}) => {
  const [form] = Form.useForm<FormInstance>();
  const [fileList, setFileList] = useState<any[]>([]);
  const [categories, setCategories] = useState<[]>([]);
  const [event, setEvent] = useState<[]>([]);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (visible) {
      fetchCategory();
      fetchEvent();
      if (mode === MODE.ADD) {
        form.resetFields();
        setFileList([]);
        form.setFieldsValue({
          status: "active",
          price: 0,
          specialPrice: 0,
          commission: 0,
          originalPrice: 0,
        });
      } else if (mode === MODE.EDIT && service) {
        const formattedService = {
          ...service,
          originalPrice: service?.originalPrice,
          price: service?.price,
          specialPrice: service?.specialPrice,
          commission: service?.commission,
          eventId: service?.eventId || null,
        };
        if (service.image) {
          setFileList([
            {
              uid: "-1",
              name: "Ảnh dịch vụ",
              status: "done",
              url: service.image,
            },
          ]);
        }
        form.setFieldsValue(formattedService);
      }
    }
  }, [visible, mode, service, form]);

  const fetchCategory = async () => {
    const response = await getAllServiceCategory(1, 100);
    setCategories(response?.data);
  };

  const fetchEvent = async () => {
    try {
      const response = await getAllEvent();
      setEvent(response?.data);
    } catch (error) {
      console.error("Lỗi khi lấy sự kiện:", error);
      message.error("Lỗi khi lấy sự kiện!");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values) => {
    if (mode === MODE.ADD) {
      try {
        const formData = new FormData();
        formData.append(
          "file",
          fileList[0]?.originFileObj ? fileList[0].originFileObj : null
        );
        formData.append(
          "data",
          JSON.stringify({
            name: values.name,
            duration: Number(values.duration),
            status: values.status,
            image: values.image ? values.image : null,
            serviceCategoryId: Number(values.serviceCategoryId),
          })
        );
        const response = await createService(token, formData);
        if (response.data) {
          const priceService = {
            originalPrice: 0,
            price: Number(values.price),
            specialPrice: Number(values.specialPrice),
            commission: Number(values.commission),
            applicableDate: moment().format("YYYY-MM-DD"),
            type: "service",
            status: "active",
            foreignKeyId: response.data.id,
            eventId: values.eventId ? Number(values.eventId) : null,
          };
          const responsePrice = await createPrice(token, priceService);
          console.log(responsePrice);
          if (responsePrice.data) {
            message.success("Thêm dịch vụ thành công!");
            setVisible(false);
          } else {
            message.error("Lỗi thêm dịch vụ!");
            console.log(response.error);
          }
        }
      } catch (error) {
        console.log("Validation failed:", error);
      }
    }
    if (mode === MODE.EDIT) {
      try {
        const formData = new FormData();
        formData.append(
          "file",
          fileList[0]?.originFileObj ? fileList[0].originFileObj : null
        );
        formData.append(
          "data",
          JSON.stringify({
            name: values.name,
            duration: Number(values.duration),
            status: values.status,
            image: values.image,
            serviceCategoryId: Number(values.serviceCategoryId),
          })
        );
        const response = await updateService(token, values.id, formData);
        console.log(response);
        
        if (response.data) {
          const priceService = {
            originalPrice: 0,
            price: Number(values.price),
            specialPrice: Number(values.specialPrice),
            commission: Number(values.commission),
            applicableDate: moment().format("YYYY-MM-DD"),
            type: "service",
            status: "active",
            foreignKeyId: values.id,
            eventId: values.eventId ? Number(values.eventId) : null,
          };
          const responsePrice = await updatePrice(token, priceService, service.priceId);
          console.log(responsePrice);
          if (responsePrice.data) {
            message.success("Cập nhật dịch vụ thành công!");
            setVisible(false);
          } else {
            message.error("Lỗi cập nhật dịch vụ!");
            console.log(response.error);
          }
        }
      } catch (error) {
        console.log("Validation failed:", error);
      }
    }
  };

  return (
    <Modal
      width={700}
      centered
      open={visible}
      onCancel={handleCancel}
      footer={null}
      title={mode === MODE.ADD ? "Thêm dịch vụ" : "Cập nhật thông tin dịch vụ"}
    >
      <Form key={mode} layout="vertical" form={form} onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Ảnh"
              name="image"
              rules={[{ required: true, message: "Vui lòng chọn ảnh dịch vụ" }]}
            >
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
          <Col span={12}>
            <Form.Item label="ID" name="id">
              <Input type="number" placeholder="ID" disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Tên dịch vụ"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ" }]}
            >
              <Input placeholder="Nhập tên dịch vụ" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Chọn phân loại dịch vụ"
              name="serviceCategoryId"
              rules={[
                { required: true, message: "Vui lòng chọn phân loại dịch vụ" },
              ]}
            >
              <Select placeholder="Chọn phân loại dịch vụ">
                {categories.map((category: any) => (
                  <Select.Option key={category.id} value={category.id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Thời gian thực hiện"
              name="duration"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập thời gian thực hiện",
                },
              ]}
            >
              <Input placeholder="Nhập thời gian thực hiện" />
            </Form.Item>
          </Col>
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
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Giá Bán"
              name="price"
              rules={[{ required: true, message: "Vui lòng nhập giá bán!" }]}
            >
              <Input type="number" placeholder="Nhập giá bán" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Giá Khuyến Mãi" name="specialPrice">
              <Input type="number" placeholder="Nhập giá khuyến mãi" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Hoa Hồng" name="commission">
              <Input type="number" placeholder="Nhập hoa hồng" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Sự Kiện" name="eventId">
              <Select placeholder="Chọn sự kiện" allowClear>
                {event.map((event) => (
                  <Option key={event.id} value={event.id}>
                    {event.name}
                  </Option>
                ))}
              </Select>
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

export default ServiceModal;
