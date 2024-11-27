import React, { useEffect, useState, useRef } from "react";
import { Input, Pagination } from "antd";
import "../styles.scss";
import CustomCard from "../components/card/Card";
import { useNavigate } from "react-router-dom";
import { HOME, SERVICE } from "../../../routes";
import { getAllProduct } from "../../../services/api";
import { Product } from "../../Manager/types";

const { Search } = Input;

const ProductPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 12;
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const fetchProducts = async (page: number) => {
    setLoading(true);
    try {
      const response = await getAllProduct(page, itemsPerPage);
      console.log("API Response:", response);
      if (response && response.data) {
        setProducts(response.data);
        setTotalItems(response.pagination?.totalItems || 0);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setTotalItems(0);
    }
    setLoading(false);
  };


  //lọc dịch vụ dựa trên từ khóa tìm kiếm đã debounce
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(debouncedKeyword.toLowerCase())
  );
  console.log("Filtered Products:", filteredProducts);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchKeyword(value);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const newTimeoutId = setTimeout(() => {
      setDebouncedKeyword(value);
      setCurrentPage(1);
    }, 1000);

    setTimeoutId(newTimeoutId);
  };

  return (
    <div className="services-page">
      {/* Service Utils */}
      <div className="services-utils">
        <h1>Danh sách sản phẩm</h1>
        <Search
          placeholder="Tìm kiếm..."
          enterButton
          className="search"
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      {/* Service List */}
      <div className="service-list">
        <div className="service-category">
          <div className="service-row">
            {filteredProducts?.map((service: any) => (
              <CustomCard
                key={service?.id}
                title={service?.name}
                imageUrl={service?.image}
                onDetailClick={() =>
                  navigate(`${HOME}${SERVICE}/${service?.id}`, {
                    state: { category: location.state.category },
                  })
                }
                onConsultClick={() => handleConsultClick(service)}
              />
            ))}
          </div>
        </div>
      </div>

      {filteredProducts.length > 0 && (
        <Pagination
          current={currentPage}
          total={totalItems}
          pageSize={itemsPerPage}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      )}
    </div>
  );
};

export default ProductPage;
