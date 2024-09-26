import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import './Slide.scss';


import slide1 from '../../../../../public/images/slide/slide1.png';
import slide2 from '../../../../../public/images/slide/slide2.png';
import slide3 from '../../../../../public/images/slide/slide3.png';

const Slide: React.FC = () => {
  return (
    <div className="slides">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img className="slide" alt="Slide 1" src={slide1} />
        </SwiperSlide>
        <SwiperSlide>
          <img className="slide" alt="Slide 2" src={slide2} />
        </SwiperSlide>
        <SwiperSlide>
          <img className="slide" alt="Slide 3" src={slide3} />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Slide;
