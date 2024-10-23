import React, { useEffect, useState } from "react";
import { List, Card, message, Empty } from "antd";
// import { getPromotionalServices } from "../../../services/api"; // Thay đổi đường dẫn nếu cần
import "../styles.scss";

const PromotionPage: React.FC = () => {
  const [promotionalServices, setPromotionalServices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchPromotionalServices();
  }, []);

  const fetchPromotionalServices = async () => {
    // setLoading(true);
    // try {
    //   const response = await getPromotionalServices();
    //   if (response.data) {
    //     setPromotionalServices(response.data);
    //   } else {
    //     message.warning("Không có dịch vụ nào trong khuyến mãi!");
    //   }
    // } catch (error) {
    //   message.error("Đã xảy ra lỗi khi lấy dữ liệu!");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="promotion-page">
      <h1>Dịch Vụ Khuyến Mãi</h1>
      {loading ? (
        <p>Loading...</p>
      ) : promotionalServices.length > 0 ? (
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={promotionalServices}
          renderItem={(service) => (
            <List.Item>
              <Card title={service.name}>
                <p>{service.description}</p>
                <p>
                  Giá:{" "}
                  <span style={{ color: "red" }}>
                    {service.specialPrice.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </p>
                <p>
                  <del>
                    {service.price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </del>
                </p>
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <Empty description="Không có dịch vụ nào trong khuyến mãi." />
      )}
    </div>
  );
};

export default PromotionPage;
