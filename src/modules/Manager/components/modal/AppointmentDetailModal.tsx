import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Select,
  Button,
  message,
  Row,
  Col,
} from "antd";
import moment from "moment";
import { MODE } from "../../../../utils/constants";
import {
  createAppointmentDetail,
  getAllProduct,
  getAllServiceCategory,
  getBedByServiceIdAndDate,
  getCategoryServiceById,
  getEmployeeByDateTime,
  getPricesByForeignKeyId,
  getServiceByCategory,
} from "../../../../services/api";
import { useBranch } from "../../../../hooks/branchContext";
import { Appointment } from "../../types";

interface UpdateAppointmentModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  mode: string;
  appointmentData?: Appointment | null;
  appointmentId: number;
  onSuccess?: () => void;
}

const AppointmentDetailModal: React.FC<UpdateAppointmentModalProps> = ({
  visible,
  setVisible,
  mode,
  appointmentData,
  appointmentId,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [serviceList, setServiceList] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );
  const [expense, setExpense] = useState(0);
  const [serviceCategory, setServiceCategory] = useState<any[]>([]);
  const [servicesByCategory, setServicesByCategory] = useState<any>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [room, setRoom] = useState(null);
  const { branchId, setBranchId } = useBranch();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [employees, setEmployees] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [bed, setBed] = useState<any[]>([]);
  // Lấy ngày và giờ hiện tại
  const currentDateTime = new Date();
  const currentDate = currentDateTime.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  const currentHour = currentDateTime.getHours();
  const dateTimeString = `${currentDate} ${currentHour.toString().padStart(2, '0')}:00:00`;
  const token = localStorage.getItem("accessToken");


  useEffect(() => {
    if (visible) {
      getServiceCategory();
      fetchProduct();
      if (mode === MODE.ADD) {
        form.resetFields();
        form.setFieldsValue({ status: "confirmed" });
      } else if (mode === MODE.EDIT && appointmentData) {
        const formattedData = {
          ...appointmentData,
          appointmentDate: moment(appointmentData.appointmentDate),
        };
        form.setFieldsValue(formattedData);
      }
    }
  }, [visible, mode, appointmentData, form]);

  useEffect(() => {
    if (selectedCategoryId) {
      fetchCategoryById();
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    if (room?.roomId) {
      getBedByServiceAndDate();
    }
  }, [room, dateTimeString]);

  useEffect(() => {
    getEmployees();
  }, [selectedDate, selectedServiceId]);


  const getEmployees = async () => {
    const response = await getEmployeeByDateTime(
      Number(branchId),
      dateTimeString
    );
    const filteredEmployees = response?.data?.filter(emp => emp.role === "employee");
    setEmployees(filteredEmployees);
  };

  const fetchProduct = async () => {
    try {
      const response = await getAllProduct(1, 200);
      const productsWithPrices = await Promise.all(
        response.data.map(async (product) => {
          const priceResponse = await getPricesByForeignKeyId(product.id);
          const price = priceResponse.data[0]?.specialPrice || 0; 
          return {
            ...product,
            price: price
          };
        })
      );

      console.log("Products with their prices:", productsWithPrices);
      setProducts(productsWithPrices);

    } catch (error) {
      console.error("Error fetching products with prices:", error);
      message.error("Có lỗi khi lấy thông tin sản phẩm!");
    }
  };


  const onFinish = async (values: any) => {
    try {
      if (mode === MODE.ADD) {
        let foreignKeyId, expense;

        if (values.category === 'services') {
          // Xử lý cho dịch vụ
          const [serviceId, price] = values.service.split(" - ");
          foreignKeyId = Number(serviceId);
          expense = Number(price);
        } else if (values.category === 'products') {
          // Xử lý cho sản phẩm
          const [productId, price] = values.productId.split(" - ");
          foreignKeyId = Number(productId);
          expense = Number(price);
        }

        const appointmentData = {
          appointmentId: appointmentId,
          category: values.category,
          status: values.status,
          foreignKeyId: foreignKeyId,
          expense: expense,
          // Chỉ thêm bedId và employeeId nếu là dịch vụ
          ...(values.category === 'services' && {
            bedId: values.bedId,
            employeeId: values.employeeId,
          })
        };

        console.log("Data to submit:", appointmentData);
        const response = await createAppointmentDetail(token, appointmentData);
        console.log(response);
        
        if (response.data) {
          message.success("Thêm chi tiết thành công!");
          onSuccess?.(); // Gọi callback để refresh table
          setVisible(false);
        } else {
          message.error("Thêm chi tiết thất bại!");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Có lỗi xảy ra khi thêm chi tiết!");
    }
  };

  const getServiceCategory = async () => {
    const response = await getAllServiceCategory(1, 10);
    setServiceCategory(response?.data);

    // Fetch services for each category
    const services = {};
    for (const category of response?.data) {
      const servicesResponse = await getServiceByCategory(category.id, 1, 100);
      services[category.id] = servicesResponse?.data;
    }
    setServicesByCategory(services);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    // Reset các trường liên quan khi thay đổi category
    form.resetFields(["productId", "serviceId", "bedId", "employeeId"]);
  };

  const getBedByServiceAndDate = async () => {
    const response = await getBedByServiceIdAndDate(
      dateTimeString,
      Number(branchId),
      room?.roomId
    );
    setBed(response?.data);
  };

  const fetchCategoryById = async () => {
    try {
      const response = await getCategoryServiceById(selectedCategoryId);
      setRoom(response?.data);
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  const handleServiceChange = (value: string) => {
    const [serviceId, price] = value.split(" - ");
    setSelectedServiceId(Number(serviceId));
    setSelectedService(Number(serviceId));
    setExpense(Number(price));
    
    // Tìm categoryId
    const categoryId = Object.keys(servicesByCategory).find(
      (categoryId) =>
        servicesByCategory[categoryId].some(
          (service) => service.id === Number(serviceId)
        )
    );
    
    setSelectedCategoryId(Number(categoryId));
  };

  return (
    <Modal
      title={mode === MODE.ADD ? "Thêm chi tiết" : "Chỉnh sửa chi tiết"}
      open={visible}
      onCancel={() => setVisible(false)}
      width={800}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Dòng 1: Phân loại và Trạng thái */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="category"
              label="Phân loại"
              rules={[{ required: true, message: "Vui lòng chọn phân loại!" }]}
            >
              <Select
                placeholder="Chọn phân loại"
                onChange={handleCategoryChange}
                options={[
                  { value: "services", label: "Dịch vụ" },
                  { value: "products", label: "Sản phẩm" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Select.Option value="confirmed">Đã xác nhận</Select.Option>
                <Select.Option value="implement">Đang thực hiện</Select.Option>
                <Select.Option value="finished">Hoàn thành</Select.Option>
                <Select.Option value="canceled">Đã hủy</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Dòng 2: Sản phẩm */}
        {selectedCategory === "products" && (
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="productId"
                label="Sản phẩm"
                rules={[{ required: true, message: "Vui lòng chọn sản phẩm!" }]}
              >
                <Select
                  placeholder="Chọn sản phẩm"
                  options={products?.map((product) => ({
                    value: `${product.id} - ${product.price}`,
                    label: `${product.name} - ${product.price.toLocaleString('vi-VN')}đ`
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
        )}

        {/* Dòng 3: Dịch vụ */}
        {selectedCategory === "services" && (
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Chọn dịch vụ:"
                name="service"
                rules={[{ required: true, message: "Vui lòng chọn dịch vụ" }]}
              >
                <Select
                  placeholder="Chọn dịch vụ"
                  onChange={handleServiceChange}
                >
                  {serviceCategory?.map((category) => (
                    <Select.OptGroup key={category.id} label={category.name}>
                      {servicesByCategory[category.id]?.map((service) => (
                        <Select.Option
                          key={service.id}
                          value={`${service.id} - ${service.specialPrice}`}
                        >
                          {service.name} -{" "}
                          {service.specialPrice.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </Select.Option>
                      ))}
                    </Select.OptGroup>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        )}

        {/* Dòng 4: Giường và Nhân viên - chỉ hiển thị khi đã chọn dịch vụ */}
        {selectedCategory === "services" && selectedServiceId && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="bedId"
                label="Giường"
                rules={[{ required: true, message: "Vui lòng chọn giường!" }]}
              >
                <Select
                  placeholder="Chọn giường"
                  options={bed?.map((bed) => ({
                    value: bed.id,
                    label: bed.name,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="employeeId"
                label="Nhân viên"
                rules={[{ required: true, message: "Vui lòng chọn nhân viên!" }]}
              >
                <Select
                  placeholder="Chọn nhân viên"
                  options={employees?.map((employee) => ({
                    value: employee.id,
                    label: employee.fullName,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
        )}
        <Form.Item>
        <Row justify="end" gutter={8}>
          <Col>
            <Button onClick={() => setVisible(false)}>
              Hủy
            </Button>
          </Col>
          <Col>
            <Button type="primary" htmlType="submit">
              {mode === MODE.ADD ? "Thêm" : "Cập nhật"}
            </Button>
          </Col>
        </Row>
      </Form.Item>
      </Form>
    </Modal>
  );
};

export default AppointmentDetailModal;
