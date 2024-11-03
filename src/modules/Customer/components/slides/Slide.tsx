import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "./Slide.scss";

interface EventItem {
  id: number;
  image: string;
  startDate: string;
  expiryDate: string;
}

interface SlideProps {
  event: EventItem[];
}

const Slide: React.FC<SlideProps> = ({ event }) => {
  const now = new Date();

  // Lọc ra các mục đang hoạt động theo thời gian hiện tại
  const activeData = event?.filter(item => {
    const startDate = new Date(item.startDate);
    const expiryDate = new Date(item.expiryDate);
    return now >= startDate && now <= expiryDate;
  });


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
        {activeData?.map((item) => (
          <SwiperSlide key={item.id}>
            <img className="slide" alt={item.name} src={item.image} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slide;
