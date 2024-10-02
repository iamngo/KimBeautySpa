import React from "react";
import { Card, Button, SliderSingleProps, Slider } from "antd";
import "../styles.scss";
import { FaCalendar, FaGift } from "react-icons/fa";

const RewardPage: React.FC = () => {
  const marks: SliderSingleProps["marks"] = {
    0: "Thành viên",
    20000000: "KH thân thiết",
    100000000: "KH VIP",
  };

  return (
    <div className="reward-page">
      <div className="header-reward-page">
        <h1>Tích điểm - Quà tặng</h1>
        <div className="tabs-section">
          <div className="my-gift">
            <FaGift className="icon" />
            <span> Quà của tôi</span>
          </div>
          <div className="history-trans">
            <FaCalendar className="icon" />
            <span>Lịch sử giao dịch</span>
          </div>
        </div>
      </div>
      <div className="points-section">
        <div className="user-info">
          <img
            className="profile-image"
            src="https://via.placeholder.com/200"
            alt="User Avatar"
          />
          <div className="points-info">
            <Slider marks={marks} defaultValue={11000000} max={100000000} />
            <p>
              <i>
                Bạn cần tích lũy thêm <span>9.000.000đ</span> để nâng hạng KH
                thân thiết
              </i>
            </p>
          </div>
          <div className="current-points">
            Tích lũy: <strong>10 điểm</strong>
          </div>
        </div>
      </div>

      <div className="rewards-section">
        <h2>Quà bạn có thể đổi</h2>
        <div className="rewards-list">
          {Array(7)
            .fill(0)
            .map((_, index) => (
              <Card
                key={index}
                cover={
                  <img alt="gift" src="/public/images/service/image1.png" />
                }
                actions={[<Button type="primary">Đổi quà</Button>]}
              >
                <Card.Meta title="Tên quà tặng" />
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RewardPage;
