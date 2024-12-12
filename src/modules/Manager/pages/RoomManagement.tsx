import React, { useEffect, useState } from "react";
import {
  Layout,
  List,
  Typography,
  Button,
  Collapse,
  Row,
  Col,
  Modal,
  message,
} from "antd";
import "../styles.scss";
import {
  getAllRoom,
  getBedByRoomId,
  createRoom,
  createBed,
  updateStatusBed,
  updateBed,
} from "../../../services/api";
import { TiPlusOutline } from "react-icons/ti";
import { MdMeetingRoom } from "react-icons/md";
import { FaBed, FaPlus } from "react-icons/fa";
import RoomModal from "../components/modal/RoomModal";
import { CgAdd } from "react-icons/cg";
import BedModal from "../components/modal/BedModal";

const { Content } = Layout;
const { Title } = Typography;

const RoomManagement: React.FC = () => {
  const [rooms, setRooms] = useState([]);
  const [beds, setBeds] = useState<{ [key: string]: any[] }>({});
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const token = localStorage.getItem("accessToken");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isBedModalVisible, setIsBedModalVisible] = useState(false); // State cho modal thêm giường
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null); // State cho roomId

  const colors = [
    "#FF9AA2", // Pastel Light Pink
    "#FFB3E6", // Pastel Light Purple
    "#FFCCB6", // Pastel Light Peach
    "#F9FBCB", // Pastel Light Cream
    "#D5AAFF", // Pastel Light Lavender
    "#B9FBC0", // Pastel Light Mint
    "#A0E7E5", // Pastel Light Teal
    "#FFC3A0", // Pastel Light Coral
    "#FFE156", // Pastel Light Yellow
    "#FFABAB", // Pastel Light Red
  ];

  useEffect(() => {
    const fetchRooms = async () => {
      const response = await getAllRoom(1, 100);
      setRooms(response.data);
    };
    fetchRooms();
  }, []);

  const handleRoomClick = async (roomId: string) => {
    if (selectedRoom === roomId) {
      setSelectedRoom(null);
    } else {
      const response = await getBedByRoomId(token, roomId);
      setBeds((prev) => ({ ...prev, [roomId]: response?.data }));
      setSelectedRoom(roomId);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async (roomName: string) => {
    try {
      const response = await createRoom(token, { name: roomName });
      console.log("Phòng đã được thêm:", response.data);
      if (response.data) {
        message.success("Phòng đã được thêm!");
        setRooms((prev) => [...prev, response.data]);
        setIsModalVisible(false);
      } else {
        message.error("Lỗi khi thêm phòng!");
        setIsModalVisible(false);
      }
    } catch (error) {
      console.error("Lỗi khi thêm phòng:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsBedModalVisible(false);
  };

  const showAddBedModal = (roomId: string) => {
    setCurrentRoomId(roomId);
    setIsBedModalVisible(true);
  };

  const handleAddBed = async (
    bedName: string,
    status: string,
    roomId: string
  ) => {
    console.log("Thêm giường:", bedName, status, roomId);
    const bed = {
      name: bedName,
      status: status,
      roomId: roomId,
    };
    const response = await createBed(token, bed);
    console.log(response);

    if (response.data) {
      setBeds((prev) => ({
        ...prev,
        [roomId]: [...(prev[roomId] || []), response.data],
      }));
      message.success("Thêm giường thành công!");
    } else {
      message.error("Lỗi thêm giường!");
    }
    setIsBedModalVisible(false);
  };

  const handleUpdateBedStatus = async (
    bed
  ) => {
    const newStatus = bed.status === "active" ? "inactive" : "active";
    const bedUpdate = {
      name: bed.name,
      status: newStatus,
      roomId: bed.roomId
    }
    try {
      const response = await updateBed(token, bedUpdate, bed.id);
      console.log("Cập nhật trạng thái giường:", response.data);
      if (response.data) {
        setBeds((prev) => ({
          ...prev,
          [currentRoomId]: prev[currentRoomId]?.map((b) =>
            b.id === bed.id ? { ...b, status: newStatus } : b
          ),
        }));
        handleRoomClick(currentRoomId);
        message.success("Cập nhật trạng thái giường thành công!");
      } else {
        message.error("Lỗi cập nhật giường");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái giường:", error);
      message.error("Lỗi khi cập nhật trạng thái giường!");
    }
  };

  return (
    <Content className="room-management">
      <div className="header-container">
        <h2>Quản lý phòng và giường</h2>
        <div className="status-indicators">
        <div className="status-item">
          <span className="status-color active"></span>
          <span>Giường đang hoạt động</span>
        </div>
        <div className="status-item">
          <span className="status-color inactive"></span>
          <span>Giường tạm ngưng</span>
        </div>
      </div>
        <Button
          className="btn-add"
          type="primary"
          icon={<TiPlusOutline />}
          size="large"
          onClick={showModal}
        >
          Thêm Phòng
        </Button>
      </div>
      <RoomModal
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      />
      <BedModal
        visible={isBedModalVisible}
        onOk={handleAddBed}
        onCancel={handleCancel}
        roomId={currentRoomId || ""}
      />
      <Row gutter={[16, 16]}>
        {rooms.map((room, index) => (
          <Col span={6} key={room.id}>
            <div
              className="room-card"
              onClick={() => handleRoomClick(room.id)}
              style={{
                backgroundColor: colors[index % colors.length],
                height: selectedRoom === room.id ? "auto" : "200px",
              }}
            >
              <div className="room-icon">
                <MdMeetingRoom size={40} />
              </div>
              <div className="room-title">{room.name}</div>
              {selectedRoom === room.id && (
                <div className="bed-list">
                  {beds[room.id]?.map((bed) => (
                    <div
                      className="bed-item"
                      key={bed.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentRoomId(bed.roomId);
                        handleUpdateBedStatus(bed);
                      }}
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          bed.status === "active" ? "#60ff85" : "#ff6874",
                      }} // Thay đổi màu nền dựa trên trạng thái
                    >
                      <FaBed style={{ marginRight: "5px" }} />
                      {bed.name}
                    </div>
                  ))}
                  <Button
                    className="bed-item"
                    type="dashed"
                    onClick={(e) => {
                      e.stopPropagation(); // Ngăn chặn sự kiện click lan truyền
                      showAddBedModal(room.id);
                    }}
                    icon={<FaPlus />}
                  ></Button>
                </div>
              )}
            </div>
          </Col>
        ))}
      </Row>
    </Content>
  );
};

export default RoomManagement;
