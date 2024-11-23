import React, { useEffect, useState } from "react";
import Slide from "../components/slides/Slide";
import "../styles.scss";
import ModalRegister from "../components/modal/ModalRegister";
import { useLocation, useNavigate } from "react-router-dom";
import { DASHBOARD, HOME, MANAGER, SERVICE } from "../../../routes";
import {
  getAllEvent,
  getCategoryServiceById,
  getOutStandingServices,
} from "../../../services/api";
import ChatboxAI from "../components/chatbox/ChatboxAI";

const Homepage = () => {
  const [visible, setVisible] = useState(false);
  const [userId, setUserId] = useState(null);
  const [outStandingServices, setOutStandingServices] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken") || "";
    if (accessToken !== "") {
      const payload = accessToken.split(".")[1];
      const decodedPayload = JSON.parse(atob(payload));

      setUserId(decodedPayload.id);

      // if (decodedPayload.type !== "customer") {
      //   navigate(`${MANAGER}/${DASHBOARD}`);
      // }
    }
  }, [userId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleRegisterClick = () => {
    setVisible(true);
  };

  const [event, setEvent] = useState();
  useEffect(() => {
    fetchEvent();
    fetchOutStandingServices();
  }, []);

  const fetchEvent = async () => {
    const response = await getAllEvent(1, 100);
    setEvent(response?.data);
  };

  const fetchOutStandingServices = async () => {
    const response = await getOutStandingServices();
    setOutStandingServices(response?.data);
  };

  const handleClickService = async (categoryId, serviceId) => {
    const response = await getCategoryServiceById(categoryId);
    if (response?.data) {
      navigate(`${HOME}${SERVICE}/${serviceId}`, {
        state: { category: response?.data },
      });
    }
  };

  return (
    <div className="home-page">
      <ChatboxAI />
      <ModalRegister
        visible={visible}
        setVisible={setVisible}
        userId={userId}
        serviceId={null}
        categoryId={null}
      />
      {/* Phần Slide */}
      <Slide event={event} />

      {/* Phần Giới Thiệu */}
      <section className="intro-section">
        <div className="intro-section-left">
          <img
            src="/public/images/intro/image 1.png"
            alt="Spa Image 1"
            className="intro-image"
          />
          <p>
            Hãy để Kim Beauty & Spa trở thành điểm dừng chân lý tưởng giúp bạn
            lấy lại tinh thần, làm mới cơ thể và tràn đầy năng lượng sống. Đừng
            để những mệt mỏi hàng ngày làm bạn hao mòn, đến với Kim Beauty & Spa
            và cảm nhận sự khác biệt!
          </p>
          <button className="btn-primary" onClick={handleRegisterClick}>
            Đặt lịch ngay
          </button>
        </div>
        <div className="intro-section-right">
          <div className="background"></div>
          <h3>Sức khỏe & Sắc đẹp</h3>
          <h1>Kim Beauty & Spa</h1>
          <img
            src="/public/images/intro/image 2.png"
            alt="Spa Image 1"
            className="intro-image"
          />
        </div>
      </section>

      {/* Phần Dịch Vụ Nổi Bật */}
      <section className="services-section">
        <h2 className="section-title">Dịch vụ nổi bật</h2>
        <div className="services-grid">
          {outStandingServices?.map((item, index) => (
            <div
              className={`service-item ${index >= 2 ? "row-reverse" : ""}`}
              key={index}
              onClick={() =>
                handleClickService(item.serviceCategoryId, item.foreignKeyId)
              }
            >
              <img src={item.image} alt={item.name} />
              <div className="content">
                <h3>{item.name}</h3>
                <p>{item.content}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Phần Cam Kết Dịch Vụ */}
      <section className="commitment-section">
        <h2>Cam kết dịch vụ</h2>
        <h3>
          Kim Beauty Spa cam kết dịch vụ hài lòng cho Quý Khách khi sử dụng tất
          cả dịch vụ tại Spa
        </h3>
        <div className="commitment-items">
          <div className="commitment-item">
            <img src="/public/images/commitment/image 7.png" alt="" />
            <h3>Cam kết</h3>
            <p>
              Kim Beauty Spa cam kết mang đến những dịch vụ chăm sóc sức khỏe
              tốt nhất và những trải nghiệm hài lòng cho khách hàng của chúng
              tôi.
            </p>
          </div>
          <div className="commitment-item">
            <img src="/public/images/commitment/image 6.png" alt="" />
            <h3>Sứ mệnh</h3>
            <p>
              Chăm sóc sức khỏe khách hàng chính là sứ mệnh của chúng tôi. Chúng
              tôi không ngừng nâng cao chất lượng dịch vụ và sự hài lòng của
              khách hàng.
            </p>
          </div>
          <div className="commitment-item">
            <img src="/public/images/commitment/image 8.png" alt="" />
            <h3>Dịch vụ</h3>
            <p>
              Chúng tôi luôn phát triển dịch vụ để đáp ứng đầy đủ nhu cầu của
              khách hàng.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
