import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Select,
  Button,
  message,
  Row,
  Col,
  Typography,
  Divider,
  Space,
} from "antd";
import { Appointment, Product, Service } from "../../types";
import {
  getAllService,
  getAppointmentDetailById,
  getCustomerById,
  getGiftByCustomerId,
  getInfoByAccountId,
  getVoucherById,
  getGiftById,
  paymentMomo,
  paymentCash,
  getAllProduct,
} from "../../../../services/api";
import moment from "moment";
import {
  UserOutlined,
  ShoppingOutlined,
  GiftOutlined,
  WalletOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { Table } from "antd";

const { Title, Text } = Typography;

interface InvoiceModalProps {
  visible: boolean;
  onClose: () => void;
  appointmentData: Appointment | null;
  onPaymentSuccess: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({
  visible,
  onClose,
  appointmentData,
  onPaymentSuccess,
}) => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const token = localStorage.getItem("accessToken");
  const [customer, setCustomer] = useState();
  const [form] = Form.useForm();
  const [appointmentDetails, setAppointmentDetails] = useState();
  const [gifts, setGifts] = useState();
  const [selectedRewards, setSelectedRewards] = useState<string[]>([]);

  useEffect(() => {
    if (visible && appointmentData) {
      fetchInfoCustomer();
      fetchAppointmentDetail();
      fetchGiftByCustomer();
    }
  }, [visible, appointmentData]);

  useEffect(() => {
    if (appointmentDetails) {
      calculateTotal();
    }
  }, [appointmentDetails, selectedRewards]);

  const fetchInfoCustomer = async () => {
    const response = await getCustomerById(token, appointmentData?.customerId);
    if (response?.data) {
      setCustomer(response?.data);
      form.setFieldsValue({
        fullName: response?.data.fullName,
        phone: response?.data.phone,
      });
    }
  };

  const fetchGiftByCustomer = async () => {
    const response = await getGiftByCustomerId(
      token,
      appointmentData?.customerId
    );
    const notUsedGifts = response?.data.filter(
      (item) => item.status === "notused"
    );

    // Xử lý thêm thông tin cho voucher và gift
    const giftsWithDetails = await Promise.all(
      notUsedGifts.map(async (item) => {
        if (item.category === "voucher") {
          const voucherResponse = await getVoucherById(item.giftId);
          return {
            ...item,
            value: voucherResponse?.data?.discount,
            name: `Voucher giảm ${voucherResponse?.data?.discount}%`,
            maximumDiscount: voucherResponse?.data?.maximumDiscount,
            minimumOrder: voucherResponse?.data?.minimumOrder,
            expiryDate: voucherResponse?.data?.expiryDate,
          };
        } else if (item.category === "gift") {
          const giftResponse = await getGiftById(item.giftId);
          return {
            ...item,
            name: giftResponse?.data?.name,
          };
        }
        return item;
      })
    );
    setGifts(giftsWithDetails);
  };

  const fetchAppointmentDetail = async () => {
    const servicesResponse = await getAllService(1, 200);
    const productResponse = await getAllProduct(1, 1000);
    const response = await getAppointmentDetailById(token, appointmentData.id);
    const appointmentDetails = await Promise.all(
      response?.data
        .filter((appointment) => appointment.status === "finished")
        .map(async (appointment) => {
          const updatedAppointment = { ...appointment };

          const service = servicesResponse?.data.find(
            (service: Service) => service.id === appointment.foreignKeyId
          );
          const product = productResponse?.data.find(
            (product: Product) => product.id === appointment.foreignKeyId
          );
          updatedAppointment.serviceName = service ? service.name : null;

          updatedAppointment.productName = product ? product.name : null;

          return updatedAppointment;
        })
    );
    setAppointmentDetails(appointmentDetails);
    console.log(appointmentDetails);
  };

  const calculateTotal = () => {
    const total = appointmentDetails?.reduce(
      (sum, detail) => sum + detail.expense,
      0
    );
    setTotalAmount(total);

    let totalDiscount = 0;
    selectedRewards?.forEach((rewardId) => {
      const reward = gifts?.find((g) => g.id === rewardId);
      if (reward?.category === "voucher" && total >= reward.minimumOrder) {
        const discountAmount = Math.min(
          (total * reward.value) / 100,
          reward.maximumDiscount
        );
        totalDiscount += discountAmount;
      }
    });

    setDiscountAmount(totalDiscount);
  };

  const handleVoucherChange = (value: string[]) => {
    setSelectedRewards(value);
  };

  const handleMomoPayment = async () => {
    try {
      const response = await paymentMomo(
        token,
        appointmentData?.id,
        totalAmount - discountAmount,
        selectedRewards,
        appointmentDetails.map((ad: { id: number }) => ad.id)
      );
      if (response?.data?.shortLink) {
        window.open(response.data.shortLink, "_blank");
        message.success("Đang chuyển đến trang thanh toán MoMo...");
        onClose();
      } else {
        message.error("Không nhận được link thanh toán từ MoMo!");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi tạo thanh toán MoMo!");
    }
  };

  const handleCashPayment = async () => {
    console.log(appointmentData);

    try {
      const data = {
        status: "paid",
        voucherId: selectedRewards,
        bonusId: appointmentData?.bonusId,
        branchId: appointmentData?.branchId,
        customerId: appointmentData?.customerId,
        dateTime: moment(appointmentData?.dateTime).format("YYYY-MM-DD"),
      };
      const response = await paymentCash(
        token,
        appointmentData?.id,
        selectedRewards,
        appointmentDetails?.map((ad: { id: number }) => ad.id)
      );
      if (response.data) {
        // message.success("Thanh toán thành công!");
        onPaymentSuccess();
        onClose();
      } else {
        message.error("Lỗi thanh toán!");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi thanh toán!");
    }
  };

  const availableRewards = gifts?.map((item) => ({
    label:
      item.category === "voucher"
        ? `🎫 ${item.name} (Giảm ${
            item.value
          }% - Tối đa ${item.maximumDiscount?.toLocaleString("vi-VN")}đ)`
        : `🎁 ${item.name}`,
    value: item.id,
    category: item.category,
    minimumOrder: item.minimumOrder,
    maximumDiscount: item.maximumDiscount,
  }));

  return (
    <Modal
      title={
        <Title level={3} style={{ margin: 0 }}>
          Hóa đơn thanh toán
        </Title>
      }
      open={visible}
      onCancel={onClose}
      width={800}
      footer={null}
      className="invoice-modal"
    >
      <Form form={form} layout="vertical">
        <div className="invoice-content" style={{ padding: "0 20px" }}>
          {/* Phần thông tin khách hàng */}
          <div
            className="section-container"
            style={{
              backgroundColor: "#f8f9fa",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "24px",
            }}
          >
            <Title level={4} style={{ marginTop: 0 }}>
              <UserOutlined style={{ marginRight: 8 }} />
              Thông tin khách hàng
            </Title>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="Họ và tên" style={{ marginBottom: 12 }}>
                  <Text strong>{appointmentData?.customerName}</Text>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Số điện thoại" style={{ marginBottom: 12 }}>
                  <Text strong>{form.getFieldValue("phone")}</Text>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Ngày thực hiện" style={{ marginBottom: 12 }}>
                  <Text strong>
                    {appointmentData?.dateTime
                      ? moment(appointmentData.dateTime).format("DD/MM/YYYY")
                      : ""}
                  </Text>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Giờ thực hiện" style={{ marginBottom: 12 }}>
                  <Text strong>
                    {appointmentData?.dateTime
                      ? moment(appointmentData.dateTime).format("HH:mm")
                      : ""}
                  </Text>
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Phần chi tiết dịch vụ */}
          <div
            className="section-container"
            style={{
              backgroundColor: "#f8f9fa",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "24px",
            }}
          >
            <Title level={4} style={{ marginTop: 0 }}>
              <ShoppingOutlined style={{ marginRight: 8 }} />
              Chi tiết dịch vụ
            </Title>
            <Table
              dataSource={appointmentDetails}
              pagination={false}
              style={{ marginBottom: 16 }}
            >
              <Table.Column
                title="STT"
                dataIndex="index"
                render={(_, __, index) => index + 1}
                width={60}
              />
              <Table.Column title="Dịch vụ" dataIndex="serviceName" />
              <Table.Column title="Sản phẩm" dataIndex="productName" />
              <Table.Column
                title="Giá tiền"
                dataIndex="expense"
                align="right"
                render={(value) => `${value.toLocaleString("vi-VN")}đ`}
              />
            </Table>
          </div>

          {/* Phần quà tặng/voucher */}
          <div
            className="section-container"
            style={{
              backgroundColor: "#f8f9fa",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "24px",
            }}
          >
            <Title level={4} style={{ marginTop: 0 }}>
              <GiftOutlined style={{ marginRight: 8 }} />
              Quà tặng & Voucher
            </Title>
            <Form.Item name="rewards">
              <Select
                mode="multiple"
                placeholder="Chọn quà tặng hoặc voucher"
                value={selectedRewards}
                onChange={(value) => handleVoucherChange(value)}
                style={{ width: "100%" }}
                options={availableRewards}
                optionLabelProp="label"
              />
            </Form.Item>
          </div>

          {/* Phần tổng tiền */}
          <div
            className="section-container"
            style={{
              backgroundColor: "#f8f9fa",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "24px",
            }}
          >
            <Row justify="end">
              <Col span={12}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Row justify="space-between">
                    <Text>Tổng tiền:</Text>
                    <Text strong>{totalAmount.toLocaleString("vi-VN")}đ</Text>
                  </Row>
                  {discountAmount > 0 && (
                    <Row justify="space-between">
                      <Text>Giảm giá:</Text>
                      <Text type="success">
                        -{discountAmount.toLocaleString("vi-VN")}đ
                      </Text>
                    </Row>
                  )}
                  <Divider style={{ margin: "12px 0" }} />
                  <Row justify="space-between">
                    <Title level={4} style={{ margin: 0 }}>
                      Thành tiền:
                    </Title>
                    <Title level={4} type="danger" style={{ margin: 0 }}>
                      {(totalAmount - discountAmount).toLocaleString("vi-VN")}đ
                    </Title>
                  </Row>
                </Space>
              </Col>
            </Row>
          </div>

          {/* Phần nút thanh toán */}
          <Row justify="end" gutter={16}>
            <Col>
              <Space size="middle">
                <Button onClick={onClose}>Hủy bỏ</Button>
                <Button
                  onClick={handleMomoPayment}
                  type="primary"
                  danger
                  icon={<WalletOutlined />}
                >
                  Thanh toán MoMo
                </Button>
                <Button
                  onClick={handleCashPayment}
                  type="primary"
                  icon={<DollarOutlined />}
                >
                  Thanh toán tiền mặt
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      </Form>
    </Modal>
  );
};

export default InvoiceModal;
