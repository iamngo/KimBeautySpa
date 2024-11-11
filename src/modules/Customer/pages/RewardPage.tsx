import React, { useEffect, useState } from "react";
import { Card, Button, SliderSingleProps, Slider, Pagination } from "antd";
import "../styles.scss";
import { FaCalendar, FaGift } from "react-icons/fa";
import {
  getAllGift,
  getAllVoucher,
  getBonusPointByCustomerId,
  getInfoByAccountId,
} from "../../../services/api";
import { useLocation } from "react-router-dom";

const RewardPage: React.FC = () => {
  const marks: SliderSingleProps["marks"] = {
    0: "Thành viên",
    5000000: "KH thân thiết",
    10000000: "KH VIP",
  };

  const location = useLocation();
  const [expense, setExpense] = useState<number | undefined>(undefined);
  const [points, setPoints] = useState<number | undefined>(undefined);
  const [customer, setCustomer] = useState<any>(null);
  const [gifts, setGifts] = useState<any[]>([]);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [giftPagination, setGiftPagination] = useState<any>(null);
  const [voucherPagination, setVoucherPagination] = useState<any>(null);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchBonusPoint();
    fetchGift(1); // default page
    fetchVoucher(1); // default page
  }, []);

  const fetchBonusPoint = async () => {
    const customer = await getInfoByAccountId(token, location.state.userId);
    setCustomer(customer.data);
    if (customer.data) {
      const response = await getBonusPointByCustomerId(customer.data.id);
      setExpense(Number(response.data.expense));
      setPoints(Number(response.data.points));
      console.log(response.data);
    }
  };

  const fetchGift = async (page: number) => {
    const response = await getAllGift(page, 4);
    setGifts(response.data);
    setGiftPagination(response.pagination);
    console.log(response);
  };

  const fetchVoucher = async (page: number) => {
    const response = await getAllVoucher(page, 4);
    setVouchers(response.data);
    setVoucherPagination(response.pagination);
    console.log(response);
  };

  const remainingAmount = expense
    ? expense < 5000000
      ? 5000000 - expense
      : expense < 10000000
      ? 10000000 - expense
      : 0
    : 0;

  const handleGiftPaginationChange = (page: number) => {
    fetchGift(page);
  };

  const handleVoucherPaginationChange = (page: number) => {
    fetchVoucher(page);
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
            src={customer?.image}
            alt="User Avatar"
          />
          <div className="points-info">
            <Slider marks={marks} value={expense ?? 0} max={10000000} />
            <p>
              <i>
                Bạn cần tích lũy thêm{" "}
                <span>
                  {remainingAmount > 0
                    ? `${remainingAmount.toLocaleString()}đ`
                    : "0đ"}
                </span>{" "}
                để nâng hạng KH{" "}
                {expense! >= 5000000 && expense! < 10000000
                  ? "VIP"
                  : "thân thiết"}
              </i>
            </p>
          </div>
          <div className="current-points">
            Tích lũy: <strong>{points} điểm</strong>
          </div>
        </div>
      </div>

      <div className="rewards-section">
        <h2>Quà bạn có thể đổi</h2>
        <div className="rewards-list">
          {gifts?.map((gift, index) => (
            <Card
              key={index}
              cover={
                <img
                  alt="gift"
                  src={gift.image || "/public/images/service/image1.png"}
                />
              }
              actions={[
                <Button type="primary" disabled={points! < gift.point}>
                  Đổi quà
                </Button>,
              ]}
            >
              <Card.Meta title={gift.name} />
              <p>Điểm: {gift.point}</p>
            </Card>
          ))}
        </div>
        <Pagination
          current={giftPagination?.currentPage}
          pageSize={giftPagination?.itemsPerPage}
          total={giftPagination?.totalItems}
          onChange={handleGiftPaginationChange}
        />
      </div>

      <div className="rewards-section">
        <h2>Voucher bạn có thể đổi</h2>
        <div className="rewards-list">
          {vouchers?.map((voucher, index) => (
            <Card
              key={index}
              cover={
                <img
                  alt="voucher"
                  src={voucher.image || "/public/images/service/image1.png"}
                />
              }
              actions={[
                <Button type="primary" disabled={points! < voucher.point}>
                  Đổi voucher
                </Button>,
              ]}
            >
              <Card.Meta title={`Voucher giảm ${voucher.discount}%`} />
              <p>Điểm: {voucher.point}</p>
              <p>Giảm tối đa: {voucher.maximumDiscount.toLocaleString()}đ</p>
              <p>Đơn hàng tối thiểu: {voucher.minimumOrder.toLocaleString()}đ</p>
              <p>Ngày hết hạn: {new Date(voucher.expiryDate).toLocaleDateString()}</p>
            </Card>
          ))}
        </div>
        <Pagination
          current={voucherPagination?.currentPage}
          pageSize={voucherPagination?.itemsPerPage}
          total={voucherPagination?.totalItems}
          onChange={handleVoucherPaginationChange}
        />
      </div>
    </div>
  );
};

export default RewardPage;
