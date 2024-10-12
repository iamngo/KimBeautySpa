import React, { useState } from "react";
import "../styles.scss";
import { FaGoogle, FaFacebookF, FaGithub, FaInstagram } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { DASHBOARD, HOME, MANAGER } from "../../../routes";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { CgSpinner } from "react-icons/cg";
import { Input, DatePicker, Radio, Button, message } from "antd";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { auth } from "../../../config/firebase.config";
import axios from "axios";
import { login } from "../../../services/api";

const LocationPicker = ({ setAddress }) => {
  const [position, setPosition] = useState(null);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        setAddress(e.latlng); // Update the selected address
      },
    });
    return position === null ? null : <Marker position={position}></Marker>;
  };

  return (
    <MapContainer center={[21.0285, 105.8542]} zoom={13} style={{ height: "300px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapClickHandler />
    </MapContainer>
  );
};

const Authenticate: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const [isClickSendOTP, setIsClickSendOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState(null);
  const [address, setAddress] = useState(null); // To store the selected address from the map
  
  const handleSignUpClick = () => {
    setIsSignUp(true);
  };

  const handleSignInClick = () => {
    setIsSignUp(false);
  };

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container', // ID của thẻ HTML chứa Recaptcha
        {
          size: "invisible", // Invisible hoặc normal
          callback: (response) => {
            console.log('Recaptcha verified successfully');
          },
          "expired-callback": () => {
            console.log('Recaptcha expired, please verify again.');
          },
        },
      );
      window.recaptchaVerifier.render().then((widgetId) => {
        console.log(`Recaptcha widget ID: ${widgetId}`);
      });
    }
  }

  const onSignup = async () => {
    setIsClickSendOTP(true);
    setLoading(true);
    onCaptchVerify();
    try {
    const formatPh = "+84" + ph.slice(1);
    const appVerifier = window.recaptchaVerifier;
    const confirmationResult = await signInWithPhoneNumber(auth, formatPh, appVerifier)
    setLoading(false);
    console.log("OTP sent successfully:", confirmationResult);
    message.success("Gửi OTP thành công!");
  } catch (error) {
    console.log(error);
    setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await login(ph, password);
      console.log(response.data.data.access_token);

      
      
      // Kiểm tra nếu có lỗi trong phần response.data.error
      if (response.data?.error) {
        const errorCode = response.data.error.code;
        
        // Xử lý mã lỗi cụ thể
        if (errorCode === '401_PASSWORD_INCORRECT') {
          message.error("Sai mật khẩu. Vui lòng kiểm tra lại.");
        } else {
          const errorMessage = response.data.error.message || "Đăng nhập thất bại!";
          message.error(`${errorCode}: ${errorMessage}`);
        }
      } else {
        const payload = response.data.data.access_token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      message.success("Đăng nhập thành công!");
      console.log(decodedPayload);
      if(decodedPayload.type === 'customer'){
        navigate(`${HOME}`);
      } else{
        navigate(`${MANAGER}/${DASHBOARD}`);

      }
      }
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error.response ? error.response.data : error);
      const errorMessage = error.response?.data?.error?.message || "Đã có lỗi xảy ra, vui lòng thử lại.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className={`container ${isSignUp ? "active" : ""}`} id="container">
      <div id="recaptcha-container"></div>
      <div className="form-container sign-up">
        <form>
          <h1>Tạo tài khoản</h1>
          {isClickSendOTP ? (
            <>
              {loading && <CgSpinner size={20} className="mt-1 animate-spin" />}
              <Input type="text" placeholder="Họ và tên" />
              <Input.Password placeholder="Mật khẩu" />
              <Input.Password placeholder="Xác nhận mật khẩu" />
              <DatePicker placeholder="Ngày sinh" style={{ width: "100%" }} />

              <div style={{ marginBottom: "16px" }}>
                <label>Chọn địa chỉ trên bản đồ:</label>
                <LocationPicker setAddress={setAddress} />
              </div>

              {address && (
                <Input
                  value={`Latitude: ${address.lat}, Longitude: ${address.lng}`}
                  readOnly
                  style={{ marginBottom: "16px" }}
                />
              )}

              <Radio.Group onChange={(e) => setGender(e.target.value)} value={gender}>
                <Radio value="male">Nam</Radio>
                <Radio value="female">Nữ</Radio>
              </Radio.Group>

              <Button type="primary" onClick={onSignup}>
                Đăng ký
              </Button>
            </>
          ) : (
            <>
              <div className="social-icons">
                <a href="#" className="icon">
                  <FaGoogle />
                </a>
                <a href="#" className="icon">
                  <FaFacebookF />
                </a>
                <a href="#" className="icon">
                  <FaGithub />
                </a>
                <a href="#" className="icon">
                  <FaInstagram />
                </a>
              </div>
              <span>hoặc sử dụng số điện thoại để đăng ký</span>
              <input
                type="text"
                placeholder="Số điện thoại"
                onChange={(e) => setPh(e.target.value)}
              />
              <button type="button" onClick={onSignup}>
                Gửi mã OTP
              </button>
            </>
          )}
        </form>
      </div>
      <div className="form-container sign-in">
        <form>
          <h1>Đăng nhập</h1>
          <div className="social-icons">
            <a href="#" className="icon">
              <FaGoogle />
            </a>
            <a href="#" className="icon">
              <FaFacebookF />
            </a>
            <a href="#" className="icon">
              <FaGithub />
            </a>
            <a href="#" className="icon">
              <FaInstagram />
            </a>
          </div>
          <span>hoặc sử dụng số điện thoại và mật khẩu</span>
          <input type="text" placeholder="Số điện thoại" onChange={(e) => setPh(e.target.value)} />
          <input type="password" placeholder="Mật khẩu" onChange={(e)=> setPassword(e.target.value)}/>
          <a href="#">Quên mật khẩu?</a>
          <button type="button" onClick={handleLogin}>
            Đăng nhập
          </button>
        </form>
      </div>
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Chào mừng bạn trở lại!</h1>
            <p>
              Nhập thông tin cá nhân của bạn để sử dụng các tính năng của trang web
            </p>
            <button className="hidden" id="login" onClick={handleSignInClick}>
              Đăng nhập
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Chào bạn!</h1>
            <p>
              Đăng ký thông tin cá nhân của bạn để sử dụng các tính năng của trang web
            </p>
            <button className="hidden" id="register" onClick={handleSignUpClick}>
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authenticate;
