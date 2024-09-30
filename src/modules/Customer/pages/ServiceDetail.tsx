import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Carousel, Rate, Tooltip } from "antd";
import { useParams, useNavigate } from "react-router-dom"; // Để lấy ID của dịch vụ từ URL và điều hướng
import "../styles.scss";
import { RxHeartFilled } from "react-icons/rx";
import { IoHeartOutline } from "react-icons/io5";

// Dữ liệu dịch vụ mẫu
const services = [
  {
    id: 1,
    name: "Chăm sóc tóc",
    image: "/public/images/service/image1.png",
    additionalImages: [
      "/public/images/service/image1.png",
      "/public/images/service/image2.png",
      "/public/images/service/image3.png",
      "/public/images/service/image4.png",
      "/public/images/service/image1.png",
    ],
    category: "Hair Care",
    price: "59.000.000 ₫",
    discount: "10%",
    finalPrice: "53.000.000 ₫",
    description: `Bước vào quy trình điều trị, chuyên viên sẽ  dùng khăn thấm nước muối sinh lý để lau sạch vùng da đầu trước khi thực hiện. Kế tiếp, chuyên viên sẽ tiến hành xịt tê để giảm cảm giác khó chịu cho khách hàng trong quá trình phi kim điều trị. Sau đó, chuyên viên sẽ tiến hành phi kim Nano tinh chất huyết thanh kích mọc tóc vào vùng nang tóc cần điều trị.  Chưa hết, khách hàng sẽ được sát khuẩn lại vùng điều trị bằng cồn và thoa tinh chất huyết thanh mọc tóc lên vùng điều trị. Cuối cùng, chuyên viên sẽ chiếu ánh sáng sinh học đỏ lên vùng da điều trị để hỗ trợ tinh chất thẩm thấu tốt hơn.`,
  },
  // Thêm các dịch vụ khác
];

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Lấy ID của dịch vụ từ URL
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  // Toggle yêu thích
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Tìm kiếm dịch vụ theo ID
  const service = services.find((s) => s.id === parseInt(id!));
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
        <Breadcrumb.Item onClick={() => navigate(-1)}>Dịch vụ</Breadcrumb.Item>
        <Breadcrumb.Item>{service.category}</Breadcrumb.Item>
        <Breadcrumb.Item>{service.name}</Breadcrumb.Item>
      </Breadcrumb>

      <div className="service-detail-content">
        {/* Hình ảnh dịch vụ */}
        <div className="service-image">
          <img src={selectedImage} alt={service.name} />
          <div className="image-carousel">
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
