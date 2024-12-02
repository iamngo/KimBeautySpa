import React, { useEffect, useMemo, useState, useRef } from "react";
import { Input, Pagination } from "antd";
import "../styles.scss";
import CustomCard from "../components/card/Card";
import { getAllProductWithPrice, getInfoByAccountId } from "../../../services/api";
import ChatboxAI from "../components/chatbox/ChatboxAI";
import { ChatboxAIRef } from "../components/chatbox/ChatboxAI";
import OrderForm from "../components/modal/OrderForm";

const { Search } = Input;

const ServicesPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12); // Số lượng dịch vụ mỗi trang
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const chatboxRef = useRef<ChatboxAIRef>(null);
  
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [customer, setCustomer] = useState<any>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    fetchProduct();
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken") || "";
    if (accessToken !== "") {
      const payload = accessToken.split(".")[1];
      const decodedPayload = JSON.parse(atob(payload));
      
      if (decodedPayload.role === "customer") {
        const getCustomer = async () => {
          const response = await getInfoByAccountId(accessToken, decodedPayload.id);
          setCustomer(response?.data);
        };
        getCustomer();
      }
    }
  }, []);

  const fetchProduct = async () => {
    const response = await getAllProductWithPrice();
    setServices(response.data);
  };

  const handleConsultClick = (service: any) => {
    const consultMessage = `Sản phẩm bạn quan tâm là "${service.name}".
Thông tin chi tiết:
- Giá sản phẩm là: ${new Intl.NumberFormat("vi-VN").format(service.price)} VNĐ
${
  service.specialPrice
    ? `- Khuyến mãi còn: ${new Intl.NumberFormat("vi-VN").format(
        service.specialPrice
      )} VNĐ`
    : ""
}
Bạn có thể đặt hàng ngay hoặc tìm hiểu thêm thông tin chi tiết.`;

    chatboxRef.current?.openChatbox(consultMessage);
  };

  const handleOrderClick = (product: any) => {
    setSelectedProduct(product);
    setIsOrderModalVisible(true);
  };

  const handleOrderCancel = () => {
    setIsOrderModalVisible(false);
    setSelectedProduct(null);
  };

  //lọc dịch vụ dựa trên từ khóa tìm kiếm đã debounce
  const filteredServices = useMemo(() => {
    return services.filter((service: any) =>
      service.name.toLowerCase().includes(debouncedKeyword.toLowerCase())
    );
  }, [debouncedKeyword, services]);

  // Tính toán các dịch vụ hiển thị cho trang hiện tại
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentServices = filteredServices.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchKeyword(value);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const newTimeoutId = setTimeout(() => {
      setDebouncedKeyword(value);
      setCurrentPage(1);
    }, 1000);

    setTimeoutId(newTimeoutId);
  };

  return (
    <div className="services-page">
      <ChatboxAI ref={chatboxRef} />
      {/* Service Utils */}
      <div className="services-utils">
        <h1>Danh sách sản phẩm</h1>
        <Search
          placeholder="Tìm kiếm..."
          enterButton
          className="search"
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      {/* Service List */}
      <div className="service-list">
        <div className="service-category">
          <div className="service-row">
            {currentServices?.map((service: any) => (
              <CustomCard
                key={service?.id}
                title={service?.name}
                imageUrl={service?.image}
                price={service?.price}
                specialPrice={Number(service?.finalPrice)}
                onOrderClick={() => handleOrderClick(service)}
                onConsultClick={() => handleConsultClick(service)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={filteredServices?.length || 0}
        onChange={handlePageChange}
      />

      {selectedProduct && (
        <OrderForm
          visible={isOrderModalVisible}
          onCancel={handleOrderCancel}
          product={{
            id: selectedProduct.id,
            name: selectedProduct.name,
            price: selectedProduct.price || 0,
            specialPrice: selectedProduct.specialPrice
          }}
          customer={customer}
        />
      )}
    </div>
  );
};

export default ServicesPage;
