import React, { useEffect, useMemo, useState } from "react";
import { Button, Input, Pagination } from "antd";
import "../styles.scss";
import CustomCard from "../components/card/Card";
import { useLocation, useNavigate } from "react-router-dom";
import { HOME, SERVICE } from "../../../routes";
import { getServiceByCategory } from "../../../services/api";

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    getServiceByServiceCategory(location.state.category);
  }, [location]);

  const getServiceByServiceCategory = async (serviceCategory: any) => {
    const response = await getServiceByCategory(serviceCategory.id);
    setServices(response.data);
  };

  const handleConsultClick = () => {
    console.log("Nhận tư vấn");
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
                onConsultClick={handleConsultClick}
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
