import React, { useEffect, useMemo, useState } from "react";
import { List, Card, message, Empty, Pagination } from "antd";
// import { getPromotionalServices } from "../../../services/api"; // Thay đổi đường dẫn nếu cần
import "../styles.scss";
import { getAllServiceDiscount, getCategoryServiceById } from "../../../services/api";
import CustomCard from "../components/card/Card";
import { useNavigate } from "react-router-dom";
import { HOME, SERVICE } from "../../../routes";
import Search from "antd/es/input/Search";

const PromotionPage: React.FC = () => {
  const [promotionalServices, setPromotionalServices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [category, setCategory] = useState();
  const [currentPage, setCurrentPage] = useState<number>(1); 
  const [pageSize, setPageSize] = useState<number>(12); // Số lượng dịch vụ mỗi trang
  const [searchKeyword, setSearchKeyword] = useState<string>(""); 
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>(""); 
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchPromotionalServices();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const fetchPromotionalServices = async () => {
    setLoading(true);
    try {
      const response = await getAllServiceDiscount(1,100);
      if (response.data) {
        setPromotionalServices(response.data);
        console.log(response.data);
      } else {
        message.warning("Không có dịch vụ nào trong khuyến mãi!");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi lấy dữ liệu!");
      console.log(error);
      
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = useMemo(() => {
    return promotionalServices.filter((service: any) =>
      service.name.toLowerCase().includes(debouncedKeyword.toLowerCase())
    );
  }, [debouncedKeyword, promotionalServices]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentServices = filteredServices.slice(startIndex, endIndex);

   const handleConsultClick = () => {
    console.log("Nhận tư vấn");
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

  const handleDetailClick = async(id : number, categoryId: number) => {
    const response = await getCategoryServiceById(categoryId);
    if(response.data){
      setCategory(response.data);
      navigate(`${HOME}${SERVICE}/${id}`, {
        state: { category: response.data },
      })
      
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page); 
  };

  return (
    <div className="promotion-page">
      <div className="promotion-utils">
      <h1>Dịch Vụ Khuyến Mãi</h1>
      <Search
          placeholder="Tìm kiếm..." 
          enterButton 
          className="search" 
          onChange={(e) => handleSearchChange(e.target.value)} 
        />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : filteredServices.length > 0 ? (
        <div className="service-list">
        <div className="service-category">
          <div className="service-row">
            {currentServices ?.map((service: any) => (
              <CustomCard
                key={service?.id}
                title={service?.name}
                imageUrl={service?.image}
                price={service?.price}
                specialPrice={service?.specialPrice}
                onDetailClick={() =>
                  handleDetailClick(service?.id, service.serviceCategoryId)
                }
                onConsultClick={handleConsultClick}
              />
            ))}
          </div>
        </div>
      </div>
      ) : (
        <Empty description="Không có dịch vụ nào trong khuyến mãi." />
      )}
      <Pagination
        current={currentPage}
        pageSize={pageSize} 
        total={filteredServices?.length || 0}
        onChange={handlePageChange}
      />
    </div>
  );
};

export default PromotionPage;
