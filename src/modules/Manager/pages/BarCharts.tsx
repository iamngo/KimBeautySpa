import { Modal, Tag } from "antd";
import { useEffect, useState } from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid } from "recharts";
import PieCharts from "./PieCharts";
import {
  getStatisticAppointmentDetailByEmployeeId,
  getStatisticAppointmentDetailByProductId,
  getStatisticAppointmentDetailByServiceId,
} from "../../../services/api";
import { useBranch } from "../../../hooks/branchContext";

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

export default function BarCharts({ datas, dateFormat }) {
  const token = localStorage.getItem("accessToken") || "";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [color, setColor] = useState("blue");
  const [max, setMax] = useState(
    Math.max(...datas.map((dt) => Number(dt.revenue)))
  );
  const [modalContent, setModalContent] = useState(null);
  const [informations, setInformations] = useState([]);
  const { branchId, setBranchId } = useBranch();

  useEffect(() => {
    setMax(Math.max(...datas.map((dt) => Number(dt.revenue))));
  }, [JSON.stringify(datas)]);

  const showModal = (data, color) => {
    setIsModalOpen(true);
    setData(data);
    setColor(color);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setModalContent(null);
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

  useEffect(() => {
    if (data) {
      const fetchDetails = async () => {
        const content = await renderDetails(data);
        setModalContent(content);
      };
      fetchDetails();
    }
  }, [data]);

  const generateRandomColors = (count: number) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const randomColor = `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}`;
      colors.push(randomColor);
    }
    return colors;
  };

  const renderDetails = async (item) => {
    switch (item.category) {
      case "service": {
        const response = await getStatisticAppointmentDetailByServiceId(
          token,
          item.id,
          branchId,
          dateFormat[1],
          dateFormat[0]
        );
        const COLORS = generateRandomColors(response?.data?.length);
        const datas = response?.data?.map((o, index: number) => {
          return {
            ...o,
            quantities: Number(o.quantities),
            color: COLORS[index % COLORS.length],
          };
        });
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                border: `1px solid ${color}`,
                padding: "10px",
                margin: "10px",
                borderRadius: "10px",
              }}
            >
              <p>
                <Tag
                  color={color}
                  style={{ width: "80px", marginRight: "16px" }}
                >
                  Tên dịch vụ:
                </Tag>
                <Tag color={color}>{item.name}</Tag>
              </p>
              <p>
                <Tag color={color} style={{ width: "80px" }}>
                  Doanh thu:
                </Tag>{" "}
                <Tag color={color}>
                  {Number(item.revenue).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Tag>
              </p>
              <p>
                <Tag
                  color={color}
                  style={{ width: "80px", marginRight: "16px" }}
                >
                  Số lần thực hiện:
                </Tag>
                <Tag color={color}>{item.quantities}</Tag>
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <PieCharts data={datas} />
              <div
                className="information-chart"
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {datas?.map((info) => {
                  return (
                    <div
                      key={JSON.stringify(info)}
                      style={{
                        border: `1px solid ${info.color}`,
                        padding: "10px",
                        margin: "10px",
                        borderRadius: "10px",
                      }}
                    >
                      <div className="content">
                        <Tag
                          color={info.color}
                          style={{
                            width: "110px",
                          }}
                        >
                          Ngày thực hiện :{" "}
                        </Tag>
                        <Tag color={info.color}>
                          {info.dateTime.slice(0, 10)}
                        </Tag>
                      </div>
                      <div className="content">
                        <Tag
                          color={info.color}
                          style={{
                            width: "110px",
                          }}
                        >
                          Số lần thực hiện :{" "}
                        </Tag>
                        <Tag color={info.color}>{Number(info.quantities)}</Tag>
                      </div>
                      <div className="content">
                        <Tag
                          color={info.color}
                          style={{
                            width: "110px",
                          }}
                        >
                          Doanh thu :{" "}
                        </Tag>
                        <Tag color={info.color}>
                          {Number(info.revenue).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </Tag>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }

      case "employee": {
        const response = await getStatisticAppointmentDetailByEmployeeId(
          token,
          item.id,
          branchId,
          dateFormat[1],
          dateFormat[0]
        );
        const COLORS = generateRandomColors(response?.data?.length);
        const datas = response?.data?.map((o, index: number) => {
          return {
            ...o,
            quantities: Number(o.quantities),
            color: COLORS[index % COLORS.length],
          };
        });
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                border: `1px solid ${color}`,
                padding: "10px",
                margin: "10px",
                borderRadius: "10px",
              }}
            >
              <p>
                <Tag
                  color={color}
                  style={{ width: "85px", marginRight: "16px" }}
                >
                  Họ và tên:
                </Tag>
                <Tag color={color}>{item.fullName}</Tag>
              </p>
              <p>
                <Tag color={color} style={{ width: "85px" }}>
                  Vai trò:
                </Tag>{" "}
                {getRoleName(item.role)}
              </p>
              <p>
                <Tag
                  color={color}
                  style={{ width: "85px", marginRight: "16px" }}
                >
                  Giờ làm việc:
                </Tag>
                <Tag color={color}>{item.hours} giờ</Tag>
              </p>
              <p>
                <Tag color={color} style={{ width: "85px" }}>
                  Lương:
                </Tag>{" "}
                <Tag color={color}>
                  {Number(item.salary).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Tag>
              </p>
              <p>
                <Tag color={color} style={{ width: "85px" }}>
                  Hoa hồng:
                </Tag>{" "}
                <Tag color={color}>
                  {Number(item.commissions).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Tag>
              </p>
              <p>
                <Tag color={color} style={{ width: "85px" }}>
                  Doanh thu:
                </Tag>{" "}
                <Tag color={color}>
                  {Number(item.revenue).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Tag>
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <PieCharts data={datas} />
              <div
                className="information-chart"
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {datas?.map((info) => {
                  return (
                    <div
                      key={JSON.stringify(info)}
                      style={{
                        border: `1px solid ${info.color}`,
                        padding: "10px",
                        margin: "10px",
                        borderRadius: "10px",
                      }}
                    >
                      <div className="content">
                        <Tag
                          color={info.color}
                          style={{
                            width: "110px",
                          }}
                        >
                          Ngày thực hiện :{" "}
                        </Tag>
                        <Tag color={info.color}>
                          {info.dateTime.slice(0, 10)}
                        </Tag>
                      </div>
                      <div className="content">
                        <Tag
                          color={info.color}
                          style={{
                            width: "110px",
                          }}
                        >
                          Số lần thực hiện :{" "}
                        </Tag>
                        <Tag color={info.color}>{Number(info.quantities)}</Tag>
                      </div>
                      <div className="content">
                        <Tag
                          color={info.color}
                          style={{
                            width: "110px",
                          }}
                        >
                          Giờ làm việc :{" "}
                        </Tag>
                        <Tag color={info.color}>{Number(info.hours)} giờ</Tag>
                      </div>
                      <div className="content">
                        <Tag
                          color={info.color}
                          style={{
                            width: "110px",
                          }}
                        >
                          Hoa hồng :{" "}
                        </Tag>
                        <Tag color={info.color}>
                          {Number(info.commission).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </Tag>
                      </div>
                      <div className="content">
                        <Tag
                          color={info.color}
                          style={{
                            width: "110px",
                          }}
                        >
                          Lương :{" "}
                        </Tag>
                        <Tag color={info.color}>
                          {Number(info.salary).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </Tag>
                      </div>
                      <div className="content">
                        <Tag
                          color={info.color}
                          style={{
                            width: "110px",
                          }}
                        >
                          Doanh thu :{" "}
                        </Tag>
                        <Tag color={info.color}>
                          {(
                            Number(info.commission) + Number(info.salary)
                          ).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </Tag>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }

      case "product": {
        const response = await getStatisticAppointmentDetailByProductId(
          token,
          item.id,
          branchId,
          dateFormat[1],
          dateFormat[0]
        );
        const COLORS = generateRandomColors(response?.data?.length);
        const datas = response?.data?.map((o, index: number) => {
          return {
            ...o,
            quantities: Number(o.quantities),
            color: COLORS[index % COLORS.length],
          };
        });
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                border: `1px solid ${color}`,
                padding: "10px",
                margin: "10px",
                borderRadius: "10px",
              }}
            >
              <p>
                <Tag color={color} style={{ width: "90px" }}>
                  Tên sản phẩm:
                </Tag>{" "}
                <Tag color={color}>{item.name}</Tag>
              </p>
              <p>
                <Tag color={color} style={{ width: "90px" }}>
                  Doanh thu:
                </Tag>{" "}
                <Tag color={color}>
                  {Number(item.revenue).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Tag>
              </p>
              <p>
                <Tag color={color} style={{ width: "90px" }}>
                  Số lượng bán:
                </Tag>{" "}
                <Tag color={color}>{item.quantities}</Tag>
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <PieCharts data={datas} />
              <div
                className="information-chart"
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {datas?.map((info) => {
                  return (
                    <div
                      key={JSON.stringify(info)}
                      style={{
                        border: `1px solid ${info.color}`,
                        padding: "10px",
                        margin: "10px",
                        borderRadius: "10px",
                      }}
                    >
                      <div className="content">
                        <Tag
                          color={info.color}
                          style={{
                            width: "110px",
                          }}
                        >
                          Ngày thực hiện :{" "}
                        </Tag>
                        <Tag color={info.color}>
                          {info.dateTime.slice(0, 10)}
                        </Tag>
                      </div>
                      <div className="content">
                        <Tag
                          color={info.color}
                          style={{
                            width: "110px",
                          }}
                        >
                          Số lượng bán :{" "}
                        </Tag>
                        <Tag color={info.color}>{Number(info.quantities)}</Tag>
                      </div>
                      <div className="content">
                        <Tag
                          color={info.color}
                          style={{
                            width: "110px",
                          }}
                        >
                          Doanh thu :{" "}
                        </Tag>
                        <Tag color={info.color}>
                          {Number(info.revenue).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </Tag>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }

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
          top: 30,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" width={200} />
        <YAxis dataKey={"revenue"} type="number" domain={[0, max]} />
        <Bar
          dataKey="revenue"
          fill="#8884d8"
          shape={<TriangleBar />}
          label={{ position: "top" }}
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
        width={800}
      >
        {modalContent || <p>Đang tải dữ liệu...</p>}
      </Modal>
    </>
  );
}
