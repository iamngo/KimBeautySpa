import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import { Product, ServiceCategory } from "../../types";
import { MODE } from "../../../../utils/constants";
import {
  createPrice,
  createProduct,
  getAllEvent,
  updatePrice,
  updateProduct,
} from "../../../../services/api";
import moment from "moment";

interface ObjectModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  mode: string;
  object?: Product;
  toggleRefresh: () => void;
  serviceCategories: ServiceCategory[];
}

interface ObjectFormValues {
  id?: number;
  name?: string;
  status?: string;
  image?: string;
  serviceCategoryId?: number;
}

const { Option } = Select;

const ProductModal: React.FC<ObjectModalProps> = ({
  visible,
  setVisible,
  mode,
  object,
  toggleRefresh,
  serviceCategories,
}) => {
  const [form] = Form.useForm<ObjectFormValues>();
  const [fileList, setFileList] = useState<any[]>([]);
  const token = localStorage.getItem("accessToken");
  const [event, setEvent] = useState<[]>([]);

  useEffect(() => {
    if (visible) {
      fetchEvent();
      if (mode === MODE.ADD) {
        form.resetFields(); // Reset form khi ở chế độ add
        setFileList([]);
        form.setFieldsValue({
          status: "active",
          price: 0,
          specialPrice: 0,
          commission: 0,
          originalPrice: 0,
        });
      } else if (mode === MODE.EDIT && object) {
        form.setFieldsValue(object);
        if (object.image) {
          setFileList([
            {
              uid: "-1",
              name: "Ảnh sản phẩm",
              status: "done",
              url: object.image,
            },
          ]);
        }
      }
    }
  }, [visible, mode, object, form]);

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
    if (typeof setVisible === "function") {
      setVisible(false);
    }
  };

  const handleSelectServiceCategory = async (value) => {
    form.setFieldsValue({ serviceCategoryId: value });
  };

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append(
      "file",
      fileList[0]?.originFileObj ? fileList[0].originFileObj : null
    );
    formData.append(
      "data",
      JSON.stringify({
        name: values.name,
        status: values.status,
        image: values.image,
        serviceCategoryId: values.serviceCategoryId,
      })
    );
    if (mode === MODE.ADD) {
      try {
        const response = await createProduct(token, formData);
        if (response?.data !== null) {
          const priceService = {
            originalPrice: Number(values.originalPrice),
            price: Number(values.price),
            specialPrice: Number(values.specialPrice),
            commission: Number(values.commission),
            applicableDate: moment().format("YYYY-MM-DD"),
            type: "product",
            status: "active",
            foreignKeyId: response.data.id,
            eventId: values.eventId ? Number(values.eventId) : null,
          };
          const responsePrice = await createPrice(token, priceService);
          if (responsePrice.data) {
            message.success("Thêm sản phẩm thành công!");
            setVisible(!visible);
            toggleRefresh();
          } else {
            message.error("Lỗi thêm sản phẩm!");
            console.log(response.error);
          }
        } else {
          console.log(response.error);
        }
      } catch (error) {
        console.log("Validation failed:", error);
      }
    }
    if (mode === MODE.EDIT) {
      try {
        const response = await updateProduct(
          token,
          formData,
          Number(values.id)
        );
        if (response?.data !== null) {
          const priceService = {
            originalPrice: Number(values.originalPrice),
            price: Number(values.price),
            specialPrice: Number(values.specialPrice),
            commission: Number(values.commission),
            applicableDate: moment().format("YYYY-MM-DD"),
            type: "product",
            status: "active",
            foreignKeyId: values.id,
            eventId: values.eventId ? Number(values.eventId) : null,
          };
          const responsePrice = await updatePrice(
            token,
            priceService,
            object?.priceId
          );
          if (responsePrice.data) {
            message.success("Cập nhật sản phẩm thành công!");
            setVisible(!visible);
            toggleRefresh();
          } else {
            message.error("Lỗi cập nhật sản phẩm!");
            console.log(response.error);
          }
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
      width={700}
      title={mode === MODE.ADD ? "Thêm sản phẩm" : "Cập nhật sản phẩm"}
    >
      <Form
        key={mode}
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={{
          status: "active",
        }}
      >
        <Row gutter={16}>
          <Col span={10}>
            <Form.Item
              label="Ảnh"
              name="image"
              rules={[{ required: true, message: "Vui lòng chọn hình ảnh" }]}
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
          <Col span={7}>
            <Form.Item label="ID:" name="id">
              <Input disabled placeholder="ID sản phẩm" />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item label="Trạng thái" name="status">
              <Select placeholder="Chọn trạng thái">
                <Select.Option key={1} value={"active"}>
                  Hoạt động
                </Select.Option>
                <Select.Option key={2} value={"inactive"}>
                  Ngưng hoạt động
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Tên sản phẩm:"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm" },
              ]}
            >
              <Input placeholder="Nhập tên sản phẩm" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Chọn loại dịch vụ"
              name="serviceCategoryId"
              rules={[
                { required: true, message: "Vui lòng chọn loại dịch vụ" },
              ]}
            >
              <Select
                placeholder="Chọn loại dịch vụ"
                showSearch
                onChange={(value) => {
                  handleSelectServiceCategory(value);
                }}
                filterOption={(input, option) =>
                  option && option.children
                    ? option.children.includes(input)
                    : false
                }
                allowClear
              >
                {serviceCategories?.map((sc) => (
                  <Select.Option key={sc.id} value={sc.id}>
                    {sc.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Giá Gốc"
              name="originalPrice"
              rules={[{ required: true, message: "Vui lòng nhập giá gốc!" }]}
            >
              <Input type="number" placeholder="Nhập giá gốc" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Giá Bán"
              name="price"
              rules={[{ required: true, message: "Vui lòng nhập giá bán!" }]}
            >
              <Input type="number" placeholder="Nhập giá bán" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Giá Khuyến Mãi" name="specialPrice">
              <Input type="number" placeholder="Nhập giá khuyến mãi" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Hoa Hồng" name="commission">
              <Input type="number" placeholder="Nhập hoa hồng" />
            </Form.Item>
          </Col>
          <Col span={8}>
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

export default ProductModal;
