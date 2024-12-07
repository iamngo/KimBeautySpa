import { Modal, Tag } from "antd";
import { useState } from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid } from "recharts";
import PieCharts from "./PieCharts";

const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "red", "pink"];

const getPath = (x, y, width, height) => {
  return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${
    y + height / 3
  }
  ${x + width / 2}, ${y}
  C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${
    x + width
  }, ${y + height}
  Z`;
};

const TriangleBar = (props) => {
  const { fill, x, y, width, height } = props;

  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

export default function BarCharts({ datas }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [color, setColor] = useState("blue");

  const showModal = (data, color) => {
    setIsModalOpen(true);
    setData(data);
    setColor(color);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getRoleName = (role: string) => {
    switch (role?.toLowerCase()) {
      case "employee":
        return <Tag color="blue">Nhân viên</Tag>;
      case "manager":
        return <Tag color="green">Quản lý</Tag>;
      case "admin":
        return <Tag color="red">Quản trị viên</Tag>;
      default:
        return <Tag color="default">{role}</Tag>;
    }
  };

  const renderDetails = (item) => {
    switch (item.category) {
      case "service":
        return (
          <div>
            <p>
              <b>Tên dịch vụ:</b>
              <Tag color={color}>{item.name}</Tag>
            </p>
            <p>
              <b>Doanh thu:</b>{" "}
              <Tag color={color}>
                {Number(item.revenue).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </Tag>
            </p>
            <p>
              <b>Số lượng:</b>
              <Tag color={color}>{item.quantities}</Tag>
            </p>
          </div>
        );

      case "employee":
        return (
          <div>
            <p>
              <b>Họ và tên:</b>
              <Tag color={color}>{item.fullName}</Tag>
            </p>
            <p>
              <b>Vai trò:</b> {getRoleName(item.role)}
            </p>
            <p>
              <b>Giờ làm việc:</b>
              <Tag color={color}>{item.hours} giờ</Tag>
            </p>
            <p>
              <b>Lương:</b>{" "}
              <Tag color={color}>
                {Number(item.salary).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </Tag>
            </p>
            <p>
              <b>Hoa hồng:</b>{" "}
              <Tag color={color}>
                {Number(item.commissions).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </Tag>
            </p>
            <p>
              <b>Doanh thu:</b>{" "}
              <Tag color={color}>
                {Number(item.revenue).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </Tag>
            </p>
          </div>
        );

      case "product":
        return (
          <div>
            <p>
              <b>Tên sản phẩm:</b> <Tag color={color}>{item.name}</Tag>
            </p>
            <p>
              <b>Doanh thu:</b>{" "}
              <Tag color={color}>
                {Number(item.revenue).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </Tag>
            </p>
            <p>
              <b>Số lượng bán:</b> <Tag color={color}>{item.quantities}</Tag>
            </p>
          </div>
        );

      default:
        return <Tag color={color}>{"Thông tin không xác định"}</Tag>;
    }
  };

  return (
    <>
      <BarChart
        width={1230}
        height={500}
        data={datas}
        margin={{
          top: 50,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" width={200} />
        <YAxis />
        <Bar
          dataKey="revenue"
          fill="#8884d8"
          shape={<TriangleBar />}
          label={{ position: "top" }}
          onClick={() => console.log("Hello")}
        >
          {datas?.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors[index % 20]}
              onClick={() => showModal(entry, colors[index % 20])}
            />
          ))}
        </Bar>
      </BarChart>
      <Modal
        title="Chi Tiết Thống Kê"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {data ? renderDetails(data) : <p>Không có dữ liệu</p>}
        {/* <PieCharts data={data} /> */}
      </Modal>
    </>
  );
}
