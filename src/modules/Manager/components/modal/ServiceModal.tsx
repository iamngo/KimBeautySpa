import { Button, Form, Input, Modal, Select, DatePicker, Radio, Upload, Row, Col } from "antd";
import React, { useEffect, useState } from "react";
import { Service } from "../../types";
import { MODE } from "../../../../utils/constants";
import type { FormInstance } from "antd";
import moment from "moment";
import { getAllServiceCategory } from "../../../../services/api";

interface ServiceModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  mode: string;
  service?: Service;
}

const ServiceModal: React.FC<ServiceModalProps> = ({
  visible,
  setVisible,
  mode,
  service,
}) => {
  const [form] = Form.useForm<FormInstance>();
  const [fileList, setFileList] = useState<any[]>([]);
  const [categories, setCategories] = useState<[]>([]);



  useEffect(() => {
    if (visible) {
      fetchCategory();
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

  const fetchCategory = async () => {
    const response = await getAllServiceCategory(1, 100);
    setCategories(response.data);
  };

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onFinish = async (values:Service) => {
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
      title={mode === MODE.ADD ? "Thêm dịch vụ" : "Cập nhật thông tin dịch vụ"}
    >
     <Form key={mode} layout="vertical" form={form} onFinish={onFinish}>
      
     <Row gutter={16}>
          <Col span={12}>
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
              name="category"
              rules={[{ required: true, message: "Vui lòng chọn phân loại dịch vụ" }]}
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
                { required: true, message: "Vui lòng nhập thời gian thực hiện" },
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
