import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Carousel, Rate, Tooltip } from "antd";
import { useParams, useNavigate, useLocation } from "react-router-dom"; // Để lấy ID của dịch vụ từ URL và điều hướng
import "../styles.scss";
import { RxHeartFilled } from "react-icons/rx";
import { IoHeartOutline } from "react-icons/io5";
import {
  getDetailServiceByServiceId,
  getPricesByForeignKeyId,
  getServiceById,
} from "../../../services/api";
import { HOME } from "../../../routes";
import ModalRegister from "../components/modal/ModalRegister";

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { category } = location.state || {};
  const [isFavorite, setIsFavorite] = useState(false);
  const [service, setService] = useState<any>(null);
  const token = localStorage.getItem("accessToken");
  const [price, setPrice] = useState();
  const [visible, setVisible] = useState(false);
  const [userId, setUserId] = useState(null);
  const [details, setDetails] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");

  // Toggle yêu thích
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken") || "";
    if (accessToken !== "") {
      const payload = accessToken.split(".")[1];
      const decodedPayload = JSON.parse(atob(payload));
      setUserId(decodedPayload.id);
    }
  }, [userId]);

  useEffect(() => {
    fetchServiceDetail();
  }, [id]);

  const fetchServiceDetail = async () => {
    const response = await getServiceById(id); // Gọi API để lấy thông tin chi tiết dịch vụ
    if (response.data !== null) {
      const price = await getPricesByForeignKeyId(id);
      const detailsResponse = await getDetailServiceByServiceId(id);
      const mergedDetails = [
      { image: response.data.image },
      ...detailsResponse.data,
    ];
      setService(response.data);
      setPrice(price.data[0]);
      setDetails(mergedDetails);
      setSelectedImage(response.data.image);
    }
  };


  if (!service) {
    return <div>Dịch vụ không tồn tại!</div>;
  }

  const handleBookingClick = () => {
    setVisible(true);
  };

  return (
    <div className="service-detail-page">
      <ModalRegister
        visible={visible}
        setVisible={setVisible}
        userId={userId}
        serviceId={service.id}
        categoryId={category?.id}
      />
      <Breadcrumb className="breadcrumb">
        <Breadcrumb.Item
          onClick={() =>
            navigate(`${HOME}category-services/${category.id}`, {
              state: { category: category },
            })
          }
        >
          {category?.name}
        </Breadcrumb.Item>
        <Breadcrumb.Item>{service.name}</Breadcrumb.Item>
      </Breadcrumb>

      <div className="service-detail-content">
        {/* Hình ảnh dịch vụ */}
        <div className="service-image">
          <img
            style={{ border: "1px solid black" }}
            src={selectedImage}
            alt={service.name}
          />
          <div className="image-carousel">
            <Carousel
              slidesToShow={3}
              arrows
              dotPosition="left"
              infinite={false}
            >
              {details
                .filter((detail) => detail.image !== 'null')
                .map((detail, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(detail.image)}
                  >
                    <img
                      className="carousel-image"
                      src={detail.image}
                      alt={`Thumbnail ${index + 1}`}
                    />
                  </div>
                ))}
            </Carousel>
          </div>
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
            Giá dịch vụ:{" "}
            <strong>
              {price?.price.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </strong>
          </p>
          <p>
            Giảm giá:
            <strong>
              {" "}
              <i>
                {price?.price > 0
                  ? Math.round(
                      ((price.price - (price?.specialPrice ?? 0)) /
                        price.price) *
                        100
                    )
                  : 0}
                %
              </i>
            </strong>
          </p>
          <p>
            Thành tiền:{" "}
            <strong className="finalPrice">
              {price?.specialPrice.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </strong>
          </p>

          <div className="service-actions">
            <Button onClick={handleBookingClick} className="btn-book-now">
              Đặt lịch ngay
            </Button>
            <Tooltip title={isFavorite ? "Bỏ yêu thích" : "Thả yêu thích"}>
              <Button
                style={{ border: "none", background: "#ffbcd2" }}
                size="large"
                onClick={toggleFavorite}
                icon={
                  isFavorite ? (
                    <RxHeartFilled style={{ color: "red" }} />
                  ) : (
                    <IoHeartOutline style={{ color: "red" }} />
                  )
                }
              ></Button>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="disc">
        {details.map((detail, index) => (
          <div key={index} className="service-step">
            <h3>{detail.title}</h3>
            <p>{detail.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceDetail;
