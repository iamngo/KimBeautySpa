import React, { useEffect, useState } from "react";
import { Button, Input, Pagination, Select } from "antd";
import "../styles.scss";
import CustomCard from "../components/card/Card";
import { useLocation, useNavigate } from "react-router-dom";
import { HOME, SERVICE, SERVICE_DETAIL } from "../../../routes";
import { getServiceByCategory } from "../../../services/api";

const { Search } = Input;
const { Option } = Select;




const ServicesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");
  const [visibleCount, setVisibleCount] = useState<number>(4); // Số lượng dịch vụ hiển thị
  const navigate = useNavigate();
  const location = useLocation();
  const [services, setServices] = useState();
  const token = localStorage.getItem("accessToken");


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    getServiceByServiceCategory(location.state.category);    
  }, [location])

  const getServiceByServiceCategory = async (serviceCategory: any) => {
    const response = await getServiceByCategory(serviceCategory.id);
    setServices(response.data);
    
  };

  const handleConsultClick = () => {
    console.log("Nhận tư vấn");
  };



  return (
    <div className="services-page">
      {/* Service Utils */}
      <div className="services-utils">
        <h1>{location.state.category?.name}</h1>
        <Search placeholder="Tìm kiếm..." enterButton className="search" />
       
      </div>

      {/* Service List */}
      <div className="service-list">
       
          <div className="service-category">
            <h2></h2>
            <div className="service-row">
              {services?.map((service: any)=>(
                <CustomCard
                  key={service?.id}
                  title={service?.name}
                  imageUrl={service?.image}
                  onDetailClick={()=> navigate(`${HOME}${SERVICE}/${service?.id}`, {state: {category: location.state.category}})}
                  onConsultClick={handleConsultClick}
                />
              ))}
                
            </div>
          </div>
      </div>

      <Pagination defaultCurrent={1} total={services?.length || 0}/>
    </div>
  );
};

export default ServicesPage;
