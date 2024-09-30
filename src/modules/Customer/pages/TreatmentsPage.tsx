import React, { useEffect, useState } from "react";
import { Button, Input, Pagination, Select } from "antd";
import "../styles.scss";
import CustomCard from "../components/card/Card";

const { Search } = Input;
const { Option } = Select;

// Treatments data mockup
const treatments = [
  {
    id: 1,
    name: "Chăm sóc tóc",
    image: "/public/images/service/image1.png",
    category: "Hair Care",
  },
  {
    id: 2,
    name: "Chăm sóc da",
    image: "/public/images/service/image1.png",
    category: "Facial Care",
  },
  {
    id: 3,
    name: "Dịch vụ tạo kiểu tóc",
    image: "/public/images/service/image1.png",
    category: "Hair Care",
  },
  {
    id: 4,
    name: "Dịch vụ dưỡng tóc",
    image: "/public/images/service/image1.png",
    category: "Hair Care",
  },
  {
    id: 5,
    name: "Mặt nạ dưỡng da",
    image: "/public/images/service/image1.png",
    category: "Facial Care",
  },
  {
    id: 6,
    name: "Dịch vụ xông mặt",
    image: "/public/images/service/image1.png",
    category: "Facial Care",
  },
  {
    id: 7,
    name: "Dịch vụ xông mặt",
    image: "/public/images/service/image1.png",
    category: "Facial Care",
  },
  {
    id: 8,
    name: "Dịch vụ xông mặt",
    image: "/public/images/service/image1.png",
    category: "Facial Care",
  },
  {
    id: 9,
    name: "Dịch vụ xông mặt",
    image: "/public/images/service/image1.png",
    category: "Facial Care",
  },
];

const categories = ["Tất cả", "Hair Care", "Facial Care"];

const handleDetailClick = () => {
  console.log("Xem chi tiết");
};

const handleConsultClick = () => {
  console.log("Nhận tư vấn");
};

const TreatmentsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");
  const [visibleCount, setVisibleCount] = useState<number>(4); // Số lượng dịch vụ hiển thị

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Lọc dịch vụ theo loại đã chọn, nếu là "Tất cả" thì không lọc
  const filteredTreatments =
    selectedCategory === "Tất cả"
      ? treatments
      : treatments.filter((treatment) => treatment.category === selectedCategory);

  const handleShowMore = () => {
    setVisibleCount(visibleCount + 4); // Tăng số lượng dịch vụ khi nhấn nút "Xem thêm"
  };

  // Nhóm dịch vụ theo loại
  const groupedTreatments = filteredTreatments.reduce((acc, treatment) => {
    const category = acc[treatment.category] || [];
    category.push(treatment);
    acc[treatment.category] = category;
    return acc;
  }, {} as Record<string, typeof treatments>);

  return (
    <div className="treatments-page">
      {/* Treatments Utils */}
      <div className="treatments-utils">
        <h1>Danh sách liệu trình</h1>
        <Search placeholder="Tìm kiếm..." enterButton className="search" />
        <Select
          defaultValue="Tất cả"
          className="filter-select"
          onChange={(value) => setSelectedCategory(value)}
        >
          {categories.map((category) => (
            <Option key={category} value={category}>
              {category}
            </Option>
          ))}
        </Select>
      </div>

      {/* Treatments List */}
      <div className="treatment-list">
        {Object.entries(groupedTreatments).map(([category, treatments]) => (
          <div key={category} className="treatment-category">
            <h2>{category}</h2>
            <div className="treatment-row">
              {treatments.slice(0, visibleCount).map((treatment) => (
                <CustomCard
                  key={treatment.id}
                  title={treatment.name}
                  imageUrl={treatment.image}
                  onDetailClick={handleDetailClick}
                  onConsultClick={handleConsultClick}
                />
              ))}
            </div>
            {/* Show More Button */}
            <div className="show-more-container">
              {/* Show More Button */}
              {visibleCount < filteredTreatments.length && (
                <Button onClick={handleShowMore} className="btn-showmore">
                  Xem thêm
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Pagination defaultCurrent={1} total={50}/>
    </div>
  );
};

export default TreatmentsPage;
