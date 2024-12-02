import React, { useEffect, useMemo, useState, useRef } from "react";
import { Button, Input, Pagination } from "antd";
import "../styles.scss";
import CustomCard from "../components/card/Card";
import { useLocation, useNavigate } from "react-router-dom";
import { HOME, SERVICE } from "../../../routes";
import { getServiceByCategory } from "../../../services/api";
import ChatboxAI from "../components/chatbox/ChatboxAI";
import { ChatboxAIRef } from '../components/chatbox/ChatboxAI';

const { Search } = Input;

const ServicesPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1); 
  const [pageSize, setPageSize] = useState<number>(12); // Số lượng dịch vụ mỗi trang
  const [searchKeyword, setSearchKeyword] = useState<string>(""); 
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>(""); 
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [services, setServices] = useState<any[]>([]); 
  const chatboxRef = useRef<ChatboxAIRef>(null);
  const [selectedService, setSelectedService] = useState<string>('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    getServiceByServiceCategory(location.state.category);
  }, [location]);

  const getServiceByServiceCategory = async (serviceCategory: any) => {
    const response = await getServiceByCategory(serviceCategory.id, 1, 200);
    setServices(response.data);
    console.log(response.data);
    
  };

  const handleConsultClick = (service: any) => {
    const consultMessage = `Dịch vụ bạn quan tâm là "${service.name}".
Thông tin chi tiết:
- Chi phí dịch vụ: ${new Intl.NumberFormat('vi-VN').format(service.price)} VNĐ
- Thời gian thực hiện: ${service.duration} phút
${service.specialPrice ? `- Khuyến mãi còn: ${new Intl.NumberFormat('vi-VN').format(service.specialPrice)} VNĐ` : ''}
Bạn có thể đặt lịch ngay hoặc tìm hiểu thêm thông tin chi tiết.`;

    chatboxRef.current?.openChatbox(consultMessage);
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
        <h1>{location.state.category?.name}</h1>
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
                onDetailClick={() =>
                  navigate(`${HOME}${SERVICE}/${service?.id}`, {
                    state: { category: location.state.category },
                  })
                }
                onConsultClick={() => handleConsultClick(service)}
                price={service?.price}
                specialPrice={Number(service?.finalPrice)}
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
    </div>
  );
};

export default ServicesPage;
