import React from "react";
import { Card, Button, Tooltip } from "antd";
import "./Card.scss";

interface ServiceCardProps {
  title: string;
  imageUrl: string;
  onDetailClick: () => void;
  onConsultClick: () => void;
}

const CustomCard: React.FC<ServiceCardProps> = ({
  title,
  imageUrl,
  onDetailClick,
  onConsultClick,
}) => {
  return (
    
    <Card className="card" cover={<img alt={title} src={imageUrl} />} hoverable>
      <div className="card-content">
      <Tooltip title={title} placement="rightTop"><h3>{title}</h3> </Tooltip>
        <div className="card-actions">
          <Button type="default" onClick={onConsultClick}>
            Nhận tư vấn
          </Button>
          <Button onClick={onDetailClick} className="btn-detail">Xem chi tiết</Button>
        </div>
      </div>
    </Card>
   
  );
};

export default CustomCard;
