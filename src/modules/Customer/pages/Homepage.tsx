import React from "react";
import Slide from "../components/slides/Slide";
import "../styles.scss"; // Nếu bạn đã có style chung

const Homepage = () => {
  return (
    <div className="home-page">
      {/* Phần Slide */}
      <Slide />

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
          <button className="btn-primary">Đặt lịch ngay</button>
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
          <div className="service-item">
            <img
              src="/public/images/service/image1.png"
              alt="Gội đầu dưỡng sinh"
            />
            <div>
              <h3>Gội đầu dưỡng sinh</h3>
              <p>
                Là một liệu pháp thư giãn và chăm sóc sức khỏe khá phổ biến, kết
                hợp giữa việc gội đầu, massage, và bấm huyệt nhằm thúc đẩy tuần
                hoàn máu và giảm căng thẳng. Liệu pháp này thường bao gồm các
                bước làm sạch da đầu, chăm sóc tóc, và các kỹ thuật massage nhẹ
                nhàng kết hợp với tinh dầu thảo mộc hoặc các sản phẩm tự nhiên.
              </p>
            </div>
          </div>
          <div className="service-item">
            <img src="/public/images/service/image2.png" alt="Massage body" />
            <div>
              <h3>Massage body</h3>
              <p>
                Là một phương pháp trị liệu toàn thân phổ biến, giúp thư giãn cơ
                thể, giảm căng thẳng và cải thiện sức khỏe tổng quát. Phương
                pháp này bao gồm việc sử dụng các kỹ thuật xoa bóp, ấn huyệt,
                kéo giãn cơ và mô mềm trên cơ thể, giúp cải thiện tuần hoàn máu
                và giải tỏa căng thẳng tinh thần.
              </p>
            </div>
          </div>
          <div className="service-item">
            <div>
              <h3>Trị liệu cổ vai gáy</h3>
              <p>
                Là một phương pháp điều trị chuyên sâu giúp giảm đau và căng
                thẳng tại khu vực cổ, vai và gáy – nơi thường xuyên bị ảnh hưởng
                bởi các yếu tố như công việc ngồi lâu, tư thế sai hoặc căng
                thẳng kéo dài.
              </p>
            </div>
            <img
              src="/public/images/service/image3.png"
              alt="Trị liệu cổ vai gáy"
            />
          </div>

          <div className="service-item">
            <div>
              <h3>Chăm sóc da</h3>
              <p>
                Là một quá trình quan trọng để duy trì và cải thiện sức khỏe và
                vẻ đẹp của làn da. Một chế độ chăm sóc da đúng cách không chỉ
                giúp bạn giữ gìn làn da tươi trẻ mà còn bảo vệ da khỏi các tác
                động tiêu cực từ môi trường, ô nhiễm và lão hóa.
              </p>
            </div>
            <img src="/public/images/service/image4.png" alt="Chăm sóc da" />
          </div>
        </div>
      </section>

      {/* Phần Cam Kết Dịch Vụ */}
      <section className="commitment-section">
        <h2>Cam kết dịch vụ</h2>
        <h3>Kim Beauty Spa cam kết dịch vụ hài lòng cho Quý Khách khi sử dụng tất cả dịch vụ tại Spa</h3>
        <div className="commitment-items">
          <div className="commitment-item">
            <img src="/public/images/commitment/image 7.png" alt="" />
            <h3>Cam kết</h3>
            <p>Kim Beauty Spa cam kết mang đến những dịch vụ chăm sóc sức khỏe tốt nhất và những trải nghiệm hài lòng cho khách hàng của chúng tôi.</p>
          </div>
          <div className="commitment-item">
          <img src="/public/images/commitment/image 6.png" alt="" />
            <h3>Sứ mệnh</h3>
            <p>Chăm sóc sức khỏe khách hàng chính là sứ mệnh của chúng tôi. Chúng tôi không ngừng nâng cao chất lượng dịch vụ và sự hài lòng của khách hàng.</p>
          </div>
          <div className="commitment-item">
            <img src="/public/images/commitment/image 8.png" alt="" />
            <h3>Dịch vụ</h3>
            <p>Chúng tôi luôn phát triển dịch vụ để đáp ứng đầy đủ nhu cầu của khách hàng.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
