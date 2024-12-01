import React, { useEffect, useState } from "react";
import { Modal, Form, Select, Button, message, Row, Col, Divider } from "antd";
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
  getWorkingTimeByServiceIdAndDate,
  updateStatusAppointmentDetail,
} from "../../../../services/api";
import { useBranch } from "../../../../hooks/branchContext";
import { Appointment } from "../../types";
import moment from "moment";

interface UpdateAppointmentModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  mode: string;
  appointmentData?: Appointment | null;
  appointment?: Appointment | null;
  appointmentId: number;
  onSuccess?: () => void;
}

const AppointmentDetailModal: React.FC<UpdateAppointmentModalProps> = ({
  visible,
  setVisible,
  mode,
  appointmentData,
  appointment,
  appointmentId,
  onSuccess,
}) => {
  const [form] = Form.useForm();
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
  const dateTimeString = `${currentDate} ${currentHour
    .toString()
    .padStart(2, "0")}:00:00`;
  const token = localStorage.getItem("accessToken");
  const [listTime, setListTime] = useState(null);
  const [time, setTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState<moment.Moment>(moment());

  useEffect(() => {
    getServiceCategory();
    if (mode === MODE.ADD) {
      form.resetFields();
      form.setFieldsValue({ status: "confirmed" });
    } else if (mode === MODE.EDIT && appointmentData) {
      form.setFieldsValue({
        status: appointmentData.status,
        id: appointmentData.id,
      });
    }
  }, [visible, mode, appointmentData]);

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
    if (
      selectedCategory === "products" ||
      (mode === MODE.EDIT && appointmentData?.category === "products")
    ) {
      fetchProduct();
    }
  }, [selectedCategory, mode]);

  useEffect(() => {
    if (room?.roomId) {
      getEmployees();
    getTimeByServiceIdAndDate();
    }
  }, [room, selectedServiceId]);

  useEffect(() => {
      getEmployees();
    
  }, [time, selectedServiceId]);


  const getEmployees = async () => {
    const response = await getEmployeeByDateTime(
      Number(branchId),
      `${appointment?.dateTime} ${time}:00`
    );
    const filteredEmployees = response?.data?.filter(
      (emp) => emp.role === "employee"
    );
    setEmployees(filteredEmployees);
  };

  const getTimeByServiceIdAndDate = async () => {
    const response = await getWorkingTimeByServiceIdAndDate(
      room?.roomId,
      appointment?.dateTime,
      branchId
    );
    setListTime(response?.data);    
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
            price: price,
          };
        })
      );
      setProducts(productsWithPrices);
    } catch (error) {
      console.error("Error fetching products with prices:", error);
      message.error("Có lỗi khi lấy thông tin sản phẩm!");
    }
  };

  const onFinish = async (values: any) => {
    try {
      let foreignKeyId, expense;
      if (values.category === "services") {
        const [serviceId, price] = values.service.split(" - ");
        foreignKeyId = Number(serviceId);
        expense = Number(price);
      } else if (values.category === "products") {
        const [productId, price] = values.productId.split(" - ");
        foreignKeyId = Number(productId);
        expense = Number(price);
      }

      const appointmentData = {
        appointmentId: appointmentId,
        category: values.category,
        status: values.status,
        foreignKeyId: foreignKeyId,
        time: values.time ? `${values.time}:00`: moment().format('HH:mm:ss'),
        expense: expense,
        ...(values.category === "services" && {
          bedId: values.bedId,
          employeeId: values.employeeId,
        }),
      };

      if (mode === MODE.ADD) {
        const response = await createAppointmentDetail(token, appointmentData);
        console.log(response);

        if (response.data) {
          message.success("Thêm chi tiết thành công!");
          onSuccess?.();
          setVisible(false);
        }
      } else if (mode === MODE.EDIT) {
        const response = await updateStatusAppointmentDetail(token, values.id, {
          status: values.status,
        });
        if (response.data) {
          message.success("Cập nhật chi tiết thành công!");
          onSuccess?.();
          setVisible(false);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error(
        mode === MODE.ADD
          ? "Có lỗi xảy ra khi thêm chi tiết!"
          : "Có lỗi xảy ra khi cập nhật chi tiết!"
      );
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
    setExpense(Number(price));

    // Tìm categoryId
    const categoryId = Object.keys(servicesByCategory).find((categoryId) =>
      servicesByCategory[categoryId].some(
        (service) => service.id === Number(serviceId)
      )
    );

    setSelectedCategoryId(Number(categoryId));
  };

  return (
    <Modal
      title={mode === MODE.ADD ? "Thêm chi tiết" : "Cập nhật trạng thái"}
      open={visible}
      onCancel={() => setVisible(false)}
      width={600}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {mode === MODE.ADD && (
          <div>
            {/* Dòng 1: Phân loại và Trạng thái */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="category"
                  label="Phân loại"
                  rules={[
                    { required: true, message: "Vui lòng chọn phân loại!" },
                  ]}
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
                  rules={[
                    { required: true, message: "Vui lòng chọn trạng thái!" },
                  ]}
                >
                  <Select placeholder="Chọn trạng thái">
                    <Select.Option value="confirmed">Đã xác nhận</Select.Option>
                    <Select.Option value="implement">
                      Đang thực hiện
                    </Select.Option>
                    <Select.Option value="finished">Hoàn thành</Select.Option>
                    <Select.Option value="canceled">Đã hủy</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Dòng 2: Sản phẩm */}
            {(selectedCategory === "products" ||
              (mode === MODE.EDIT &&
                appointmentData?.category === "products")) && (
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="productId"
                    label="Sản phẩm"
                    rules={[
                      { required: true, message: "Vui lòng chọn sản phẩm!" },
                    ]}
                  >
                    <Select
                      placeholder="Chọn sản phẩm"
                      options={products?.map((product) => ({
                        value: `${product.id} - ${product.price}`,
                        label: `${
                          product.name
                        } - ${product.price.toLocaleString("vi-VN")}đ`,
                      }))}
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}

            {/* Dòng 3: Dịch vụ */}
            {(selectedCategory === "services" ||
              (mode === MODE.EDIT &&
                appointmentData?.category === "services")) && (
              <>
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      label="Chọn dịch vụ:"
                      name="service"
                      rules={[
                        { required: true, message: "Vui lòng chọn dịch vụ" },
                      ]}
                    >
                      <Select
                        placeholder="Chọn dịch vụ"
                        onChange={handleServiceChange}
                      >
                        {serviceCategory?.map((category) => (
                          <Select.OptGroup
                            key={category.id}
                            label={category.name}
                          >
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

                {/* Dòng 4: Giường và Nhân viên */}
                {(selectedServiceId ||
                  (mode === MODE.EDIT &&
                    appointmentData?.category === "services")) && (
                  <Row gutter={16}>
                     <Col span={6}>
                    <Form.Item
                      label="Chọn giờ:"
                      name="time"
                      rules={[
                        { required: true, message: "Vui lòng chọn thời gian" },
                      ]}
                    >
                      <Select
                        placeholder="Chọn thời gian"
                        onChange={(value) => setTime(value)}
                      >
                        {listTime &&
                          listTime?.map(
                            (timeSlot: {
                              id: number;
                              time: string;
                              status: string;
                            }) => (
                              <Select.Option
                                key={timeSlot.id}
                                value={timeSlot.time}
                              >
                                {timeSlot.time}
                              </Select.Option>
                            )
                          )}
                      </Select>
                    </Form.Item>
                  </Col>
                    <Col span={6}>
                      <Form.Item
                        name="bedId"
                        label="Giường"
                        rules={[
                          { required: true, message: "Vui lòng chọn giường!" },
                        ]}
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
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn nhân viên!",
                          },
                        ]}
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
              </>
            )}
          </div>
        )}
        {mode === MODE.EDIT && (
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="id" style={{ display: "none" }}></Form.Item>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[
                  { required: true, message: "Vui lòng chọn trạng thái!" },
                ]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Select.Option value="confirmed">Đã xác nhận</Select.Option>
                  <Select.Option value="implement">
                    Đang thực hiện
                  </Select.Option>
                  <Select.Option value="finished">Hoàn thành</Select.Option>
                  <Select.Option value="paid">Đã thanh toán</Select.Option>
                  <Select.Option value="canceled">Đã hủy</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        )}
        <Form.Item>
          <Row justify="end" gutter={8}>
            <Col>
              <Button onClick={() => setVisible(false)}>Hủy</Button>
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
