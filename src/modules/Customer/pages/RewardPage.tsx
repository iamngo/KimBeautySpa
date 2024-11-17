import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  SliderSingleProps,
  Slider,
  Pagination,
  message,
  Menu,
  Dropdown,
} from "antd";
import "../styles.scss";
import { FaCalendar, FaGift } from "react-icons/fa";
import {
  getAllGift,
  getAllVoucher,
  getBonusPointByCustomerId,
  getGiftByCustomerId,
  getGiftById,
  getInfoByAccountId,
  getPointByCustomerId,
  getVoucherById,
  giftExchange,
  updatePointOfCustomer,
} from "../../../services/api";
import { useLocation } from "react-router-dom";
import { current } from "@reduxjs/toolkit";

const RewardPage: React.FC = () => {
  const marks: SliderSingleProps["marks"] = {
    0: "Thành viên",
    20000000: "KH thân thiết",
    50000000: "KH VIP",
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
  const [pointOfCustomer, setPointOfCustomer] = useState();
  const [myGifts, setMyGifts] = useState([]);

  useEffect(() => {
    fetchPoint();
    fetchGift(1); // default page
    fetchVoucher(1); // default page
  }, []);

  const fetchPoint = async () => {
    const customer = await getInfoByAccountId(token, location.state.userId);
    setCustomer(customer.data);
    if (customer.data) {
      const response = await getPointByCustomerId(token, customer.data.id);
      setExpense(Number(response.data[0].expenditures));
      setPoints(Number(response.data[0].accumulationPoints));
      setPointOfCustomer(response.data[0]);
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
    ? expense < 20000000
      ? 20000000 - expense
      : expense < 50000000
      ? 50000000 - expense
      : 0
    : 0;

  const handleGiftPaginationChange = (page: number) => {
    fetchGift(page);
  };

  const handleVoucherPaginationChange = (page: number) => {
    fetchVoucher(page);
  };

  const handleGiftExchange = async (
    giftId,
    status,
    customerId,
    category,
    giftPoint
  ) => {
    const data = {
      status: status,
      giftId: giftId,
      customerId: customerId,
      category: category,
    };
    try {
      const response = await giftExchange(token, data);
      if (response.data) {
        const data = {
          expenditures: pointOfCustomer?.expenditures,
          accumulationPoints: pointOfCustomer?.accumulationPoints,
          currentPoints: pointOfCustomer?.currentPoints - giftPoint,
          customerId: pointOfCustomer?.customerId,
        };
        const updatePoint = await updatePointOfCustomer(
          token,
          pointOfCustomer?.id,
          data
        );
        if (updatePoint.data) {
          message.success("Đổi quà thành công!");
          fetchPoint();
        }
      } else {
        message.error("Lỗi khi đổi quà");
        console.log(response);
      }
    } catch (error) {
      console.log("Lỗi ", error);
    }
  };

  const fetchGiftByCustomerId = async () => {
    try {
      const response = await getGiftByCustomerId(token, customer.id);
      const giftsWithDetails = await Promise.all(
        response.data.map(async (gift) => {
          if (gift.category === "gift") {
            const giftDetails = await getGiftById(gift.giftId);

            return {
              ...gift,
              name: giftDetails?.data.name,
            };
          } else {
            const giftDetails = await getVoucherById(gift.giftId);
            console.log(giftDetails.data);
            return {
              ...gift,
              discount: giftDetails?.data.discount,
              expiryDate: giftDetails?.data.expiryDate,
            };
          }
        })
      );
      setMyGifts(giftsWithDetails);
      console.log(giftsWithDetails);
    } catch (error) {
      console.error("Error fetching gifts:", error);
    }
  };
  const handleGetMyGift = () => {
    fetchGiftByCustomerId();
  };

  const myGiftMenu = (
    <Menu>
      {Array.isArray(myGifts) &&
        myGifts.map((gift) => (
          <Menu.Item key={gift.id}>
            {gift.category === "voucher" ? (
              <div>
                <p>
                  <strong>Voucher giảm giá {gift.discount} %</strong>
                </p>
                <p>
                  Thời hạn sử dụng:{" "}
                  {new Date(gift.expiryDate).toLocaleDateString()}
                </p>
                
              </div>
            ) : (
              <div>
                <p><strong>Quà: {gift.name}</strong></p>
                
              </div>
            )}
          </Menu.Item>
        ))}
    </Menu>
  );

  return (
    <div className="reward-page">
      <div className="header-reward-page">
        <h1>Tích điểm - Quà tặng</h1>
        <div className="tabs-section">
          <Dropdown overlay={myGiftMenu} trigger={["click"]}>
            <div className="my-gift" onClick={handleGetMyGift}>
              <FaGift className="icon" />
              <span> Quà của tôi</span>
            </div>
          </Dropdown>
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
            <Slider marks={marks} value={expense ?? 0} max={50000000} />
            <p>
              <i>
                Bạn cần tích lũy thêm{" "}
                <span>
                  {remainingAmount > 0
                    ? `${remainingAmount.toLocaleString()}đ`
                    : "0đ"}
                </span>{" "}
                để nâng hạng KH{" "}
                {expense! >= 20000000 && expense! < 50000000
                  ? "VIP"
                  : "thân thiết"}
              </i>
            </p>
          </div>
          <div className="current-points">
            <p>
              {" "}
              Điểm tích lũy: <strong>{points}</strong>
            </p>
            <p> Điểm hiện tại: {pointOfCustomer?.currentPoints}</p>
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
                <Button
                  type="primary"
                  disabled={pointOfCustomer?.currentPoints! < gift.point}
                  onClick={() =>
                    handleGiftExchange(
                      gift.id,
                      "notused", // status
                      customer?.id,
                      "gift", // category
                      gift.point
                    )
                  }
                >
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
                <Button
                  type="primary"
                  disabled={pointOfCustomer?.currentPoints! < voucher.point}
                  onClick={() =>
                    handleGiftExchange(
                      voucher.id,
                      "notused", // status
                      customer?.id,
                      "voucher", // category
                      voucher.point
                    )
                  }
                >
                  Đổi voucher
                </Button>,
              ]}
            >
              <Card.Meta title={`Voucher giảm ${voucher.discount}%`} />
              <p>Điểm: {voucher.point}</p>
              <p>Giảm tối đa: {voucher.maximumDiscount.toLocaleString()}đ</p>
              <p>
                Đơn hàng tối thiểu: {voucher.minimumOrder.toLocaleString()}đ
              </p>
              <p>
                Ngày hết hạn:{" "}
                {new Date(voucher.expiryDate).toLocaleDateString()}
              </p>
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
