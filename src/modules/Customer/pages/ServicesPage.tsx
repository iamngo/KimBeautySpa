import React, { useEffect, useState } from "react";
import { Button, Input, Pagination, Select } from "antd";
import "../styles.scss";
import CustomCard from "../components/card/Card";
import { useNavigate } from "react-router-dom";
import { HOME, SERVICE_DETAIL } from "../../../routes";

const { Search } = Input;
const { Option } = Select;

// Service data mockup
const services = [
  {
    id: 1,
    name: "Chăm sóc tóc",
    image: "/public/images/service/image1.png",
    category: "Hair Care",
  },
  {
    id: 2,
    name: "Chăm sóc da",
    image: "/public/images/service/image1.png",
    category: "Facial Care",
  },
  {
    id: 3,
    name: "Dịch vụ tạo kiểu tóc",
    image: "/public/images/service/image1.png",
    category: "Hair Care",
  },
  {
    id: 4,
    name: "Dịch vụ dưỡng tóc",
    image: "/public/images/service/image1.png",
    category: "Hair Care",
  },
  {
    id: 5,
    name: "Mặt nạ dưỡng da",
    image: "/public/images/service/image1.png",
    category: "Facial Care",
  },
  {
    id: 6,
    name: "Dịch vụ xông mặt",
    image: "/public/images/service/image1.png",
    category: "Facial Care",
  },
  {
    id: 7,
    name: "Dịch vụ xông mặt",
    image: "/public/images/service/image1.png",
    category: "Facial Care",
  },
  {
    id: 8,
    name: "Dịch vụ xông mặt",
    image: "/public/images/service/image1.png",
    category: "Facial Care",
  },
  {
    id: 9,
    name: "Dịch vụ xông mặt",
    image: "/public/images/service/image1.png",
    category: "Facial Care",
  },
];

const categories = ["Tất cả", "Hair Care", "Facial Care"];



const ServicesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");
  const [visibleCount, setVisibleCount] = useState<number>(4); // Số lượng dịch vụ hiển thị
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Lọc dịch vụ theo loại đã chọn, nếu là "Tất cả" thì không lọc
  const filteredServices =
    selectedCategory === "Tất cả"
      ? services
      : services.filter((service) => service.category === selectedCategory);

  const handleShowMore = () => {
    setVisibleCount(visibleCount + 4); // Tăng số lượng dịch vụ khi nhấn nút "Xem thêm"
  };

  
  const handleConsultClick = () => {
    console.log("Nhận tư vấn");
  };

  // Nhóm dịch vụ theo loại
  const groupedServices = filteredServices.reduce((acc, service) => {
    const category = acc[service.category] || [];
    category.push(service);
    acc[service.category] = category;
    return acc;
  }, {} as Record<string, typeof services>);

  return (
    <div className="services-page">
      {/* Service Utils */}
      <div className="services-utils">
        <h1>Danh sách dịch vụ</h1>
        <Search placeholder="Tìm kiếm..." enterButton className="search" />
        <Select
          defaultValue="Tất cả"
          className="filter-select"
          onChange={(value) => setSelectedCategory(value)}
        >
          {categories.map((category) => (
            <Option key={category} value={category}>
              {category}
            </Option>
          ))}
        </Select>
      </div>

      {/* Service List */}
      <div className="service-list">
        {Object.entries(groupedServices).map(([category, services]) => (
          <div key={category} className="service-category">
            <h2>{category}</h2>
            <div className="service-row">
              {services.slice(0, visibleCount).map((service) => (
                <CustomCard
                  key={service.id}
                  title={service.name}
                  imageUrl={service.image}
                  onDetailClick={()=> navigate(`${HOME}${SERVICE_DETAIL}/${service.id}`)}
                  onConsultClick={handleConsultClick}
                />
              ))}
            </div>
            {/* Show More Button */}
            <div className="show-more-container">
              {/* Show More Button */}
              {visibleCount < filteredServices.length && (
                <Button onClick={handleShowMore} className="btn-showmore">
                  Xem thêm
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Pagination defaultCurrent={1} total={50}/>
    </div>
  );
};

export default ServicesPage;
