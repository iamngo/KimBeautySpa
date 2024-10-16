import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Carousel, Rate, Tooltip } from "antd";
import { useParams, useNavigate, useLocation } from "react-router-dom"; // Để lấy ID của dịch vụ từ URL và điều hướng
import "../styles.scss";
import { RxHeartFilled } from "react-icons/rx";
import { IoHeartOutline } from "react-icons/io5";
import { getServiceById } from "../../../services/api";


const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  const location = useLocation();
  const { category } = location.state || {};
  const [isFavorite, setIsFavorite] = useState(false);
  const [service, setService] = useState<any>(null);
  const token = localStorage.getItem("accessToken");

  // Toggle yêu thích
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  useEffect(() => {
    const fetchServiceDetail = async () => {
      const response = await getServiceById(token, id); // Gọi API để lấy thông tin chi tiết dịch vụ
      setService(response.data);
    };

    fetchServiceDetail();
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Tìm kiếm dịch vụ theo ID
  // const service = services.find((s) => s.id === parseInt(id!));
  const [selectedImage, setSelectedImage] = useState(service?.image || "");

  if (!service) {
    return <div>Dịch vụ không tồn tại!</div>;
  }

  const handleBookingClick = () => {
    console.log("Đặt lịch ngay");
  };

  return (
    <div className="service-detail-page">
      <Breadcrumb className="breadcrumb">
        <Breadcrumb.Item>{category}</Breadcrumb.Item>
        <Breadcrumb.Item>{service.name}</Breadcrumb.Item>
      </Breadcrumb>

      <div className="service-detail-content">
        {/* Hình ảnh dịch vụ */}
        <div className="service-image">
          <img style={{border: '1px solid black'}} src={service.image} alt={service.name} />
          {/* <div className="image-carousel">
            <Carousel
              slidesToShow={3}
              arrows
              dotPosition="left"
              infinite={false}
            >
              {service.additionalImages.map((img, index) => (
                <div key={index} onClick={() => setSelectedImage(img)}>
                  <img
                    className="carousel-image"
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                  />
                </div>
              ))}
            </Carousel>
          </div> */}
        </div>

        {/* Thông tin dịch vụ */}
        <div className="service-info">
          <p>
            <h1>{service.name}</h1>
            <span>
              <Rate />
            </span>
          </p>
          <p>
            Giá dịch vụ: <strong>{service.price}</strong>
          </p>
          <p>
            Giảm giá:
            <strong>
              {" "}
              <i>{service.discount}</i>
            </strong>
          </p>
          <p>
            Thành tiền:{" "}
            <strong className="finalPrice">{service.finalPrice}</strong>
          </p>

          <div className="service-actions">
            <Button onClick={handleBookingClick} className="btn-book-now">
              Đặt lịch ngay
            </Button>
            <Tooltip title={isFavorite ? "Bỏ yêu thích" : "Thả yêu thích"}>
              <Button
              style={{border: 'none', background:'#ffbcd2'}}
              size="large"
                onClick={toggleFavorite}
                icon={
                    isFavorite ? (
                      <RxHeartFilled style={{ color: 'red' }} />
                    ) : (
                      <IoHeartOutline style={{ color: 'red' }} />
                    )
                  }
              ></Button>
            </Tooltip>
          </div>
        </div>
      </div>
      <div>
        <p className="disc">
          <strong>
            <i>Mô tả</i>
          </strong>{" "}
          <br />
          {service.description}
        </p>
      </div>
    </div>
  );
};

export default ServiceDetail;
