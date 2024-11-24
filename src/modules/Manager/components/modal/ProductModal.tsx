import { Button, Form, Input, message, Modal, Select, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { Product, ServiceCategory } from "../../types";
import { MODE } from "../../../../utils/constants";
import { createProduct, updateProduct } from "../../../../services/api";

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

  useEffect(() => {
    if (visible) {
      if (mode === MODE.ADD) {
        form.resetFields(); // Reset form khi ở chế độ add
        setFileList([]);
      } else if (mode === MODE.EDIT && object) {
        form.setFieldsValue(object); // Điền dữ liệu khi ở chế độ edit
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

  const onFinish = async (values: Product) => {
    console.log(values);
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
      try {
        const response = await updateProduct(
          token,
          formData,
          Number(values.id)
        );
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
      title={mode === MODE.ADD ? "Thêm sản phẩm" : "Cập nhật sản phẩm"}
    >
      <Form key={mode} layout="vertical" form={form} onFinish={onFinish} initialValues={{
        status: 'active' 
      }}>
        <Form.Item
          label="ID:"
          name="id"
          style={{
            display: "none",
          }}
        >
          <Input disabled placeholder="ID sản phẩm" />
        </Form.Item>
        <Form.Item
          label="Tên sản phẩm:"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
        >
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>
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
        <Form.Item
          label="Chọn loại dịch vụ"
          name="serviceCategoryId"
          rules={[{ required: true, message: "Vui lòng chọn loại dịch vụ" }]}
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

export default ProductModal;
