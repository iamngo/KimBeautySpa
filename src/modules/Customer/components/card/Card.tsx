import React, { useRef } from 'react';
import { Card, Button, Tooltip } from "antd";
import "./Card.scss";

interface ServiceCardProps {
  title: string;
  imageUrl: string;
  price?: number;
  specialPrice?: number;
  onDetailClick: () => void;
  onConsultClick: (service: any) => void;
}

const CustomCard: React.FC<ServiceCardProps> = ({
  title,
  imageUrl,
  onDetailClick,
  onConsultClick,
  price,
  specialPrice,
}) => {
  return (
    <Tooltip title={title} placement="rightTop">
      <Card
        className="card"
        cover={<img alt={title} src={imageUrl} />}
        hoverable
      >
        <div className="card-content">
          <h3>{title}</h3>
          {price && (
            <p>
              Giá:{" "}
              <del>
                {(price ?? 0).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                } as Intl.NumberFormatOptions)}
              </del>
              &nbsp;&nbsp;
              <i>
                <b style={{ color: "red", fontSize: "16px" }}>
                  {(specialPrice ?? 0).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  } as Intl.NumberFormatOptions)}
                </b>
              </i>
            </p>
          )}

          <div className="card-actions">
            <Button type="default" onClick={() => onConsultClick({ name: title })}>
              Nhận tư vấn
            </Button>
            <Button onClick={onDetailClick} className="btn-detail">
              Xem chi tiết
            </Button>
          </div>
        </div>
      </Card>
    </Tooltip>
  );
};

export default CustomCard;
