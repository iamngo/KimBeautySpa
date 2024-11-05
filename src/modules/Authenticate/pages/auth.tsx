import React, { useState } from "react";
import "../styles.scss";
import { FaGoogle, FaFacebookF, FaGithub, FaInstagram } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { DASHBOARD, HOME, MANAGER } from "../../../routes";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { CgSpinner } from "react-icons/cg";
import { Input, DatePicker, Radio, Button, message, Form, Row } from "antd";
import "leaflet/dist/leaflet.css";
import { auth } from "../../../config/firebase.config";
import { checkAccountByPhone, login, register } from "../../../services/api";
import OTP from "antd/es/input/OTP";
interface Account {
  phone: string;
  password: string;
  type: string;
  status: string;
}

interface Customer {
  fullName: string;
  gender: boolean;
  dob: string;
  phone: string;
  email: string;
  address: string;
}

const Authenticate: React.FC = () => {
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(location.state.signUp);
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [ph, setPh] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState("male");
  const [address, setAddress] = useState(null); // To store the selected address from the map
  const [showFormRegister, setShowFormRegister] = useState(false);
  const [form] = Form.useForm();

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
        "recaptcha-container", // ID của thẻ HTML chứa Recaptcha
        {
          size: "invisible", // Invisible hoặc normal
          callback: (response) => {
            console.log("Recaptcha verified successfully");
          },
          "expired-callback": () => {
            console.log("Recaptcha expired, please verify again.");
          },
        }
      );
      window.recaptchaVerifier.render().then((widgetId) => {
        console.log(`Recaptcha widget ID: ${widgetId}`);
      });
    }
  }

  const onSignup = async () => {
    if (!isValidPhoneNumber(ph)) {
      message.error("Số điện thoại không hợp lệ!");
    } else {
      const response = await checkAccountByPhone(ph);
      if (response.data !== null) {
        message.error("Số điện thoại đã được đăng ký!");
      } else {
        setLoading(true);
        onCaptchVerify();
        setShowOTP(true);
        try {
          const formatPh = "+84" + ph.slice(1);
          const appVerifier = window.recaptchaVerifier;
          const confirmationResult = await signInWithPhoneNumber(
            auth,
            formatPh,
            appVerifier
          );
          setLoading(false);
          console.log("OTP sent successfully:", confirmationResult);
          message.success("Gửi OTP thành công!");
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      }
    }
  };

  const handleLogin = async () => {
    if (!isValidPhoneNumber(ph)) {
      message.error("Số điện thoại không hợp lệ!");
    } else {
      setLoading(true);
      try {
        const response = await login(ph, password);
        if (response.data?.error) {
          const errorCode = response.data.error.code;

          // Xử lý mã lỗi cụ thể
          if (errorCode === "401_PASSWORD_INCORRECT") {
            message.error("Sai mật khẩu. Vui lòng kiểm tra lại.");
          } else {
            const errorMessage =
              response.data.error.message || "Đăng nhập thất bại!";
            message.error(`${errorCode}: ${errorMessage}`);
          }
        } else {
          const payload = response.data.data.access_token.split(".")[1];
          const decodedPayload = JSON.parse(atob(payload));
          console.log(decodedPayload);
          
          message.success("Đăng nhập thành công!");
          localStorage.setItem("accessToken", response.data.data.access_token);
          navigate(`${HOME}`);
          // if (decodedPayload.type === "customer") {
          //   navigate(`${HOME}`);
          // } else {
          //   navigate(`${MANAGER}/${DASHBOARD}`);
          // }
        }
      } catch (error) {
        console.error(
          "Lỗi khi đăng nhập:",
          error.response ? error.response.data : error
        );
        const errorMessage =
          error.response?.data?.error?.message ||
          "Đã có lỗi xảy ra, vui lòng thử lại.";
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  function onOTPVerify() {
    setShowFormRegister(true);
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  const onRegisterAccount = async () => {
    try {
      const values = await form.validateFields();
      console.log("Form values:", values);
      const account = {
        phone: ph,
        password: values.password,
        type: "customer",
        status: "active",
      };
      const customer = {
        fullName: values.fullName,
        gender: values.gender === "male" ? true : false,
        dob: values.dob.format("YYYY-MM-DD"),
        phone: ph,
        email: values.email,
        address: values.address,
      };
      const dataToSend = {
        account: account,
        customer: customer,
      };
      console.log(dataToSend);
      const response = await register(dataToSend);
      console.log(response);

      if (response.data !== null) {
        message.success("Đăng ký thành công!");
        navigate(`${HOME}`);
      }
    } catch (errorInfo) {
      console.log("Validation failed:", errorInfo);
    }
  };

  const isValidPhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^(?:\+84|0)\d{9}$/; // Kiểm tra định dạng số điện thoại Việt Nam
    return phoneRegex.test(phoneNumber);
  };

  return (
    <div className={`container ${isSignUp ? "active" : ""}`} id="container">
      <div id="recaptcha-container"></div>
      <div className="form-container sign-up">
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <h1>Tạo tài khoản</h1>
          {showFormRegister ? (
            <Form
              layout="vertical"
              style={{ height: "auto", padding: " 0px" }}
              form={form}
            >
              <Row style={{ width: "100%" }}>
                <Form.Item
                  name="fullName"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên" },
                  ]}
                  style={{ marginBottom: "-4px" }}
                >
                  <Input placeholder="Họ và tên" style={{ width: "300px" }} />
                </Form.Item>
              </Row>

              <Row>
                <Form.Item
                  name="gender"
                  required
                  style={{ marginBottom: "-4px" }}
                >
                  <Radio.Group
                    onChange={(e) => setGender(e.target.value)}
                    value={gender}
                    name="gender"
                    style={{ width: "300px" }}
                  >
                    <Radio value="male">Nam</Radio>
                    <Radio value="female">Nữ</Radio>
                  </Radio.Group>
                </Form.Item>
              </Row>

              <Row>
                <Form.Item
                  name="address"
                  rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
                  style={{ marginBottom: "-8px" }}
                >
                  <Input placeholder="Địa chỉ" style={{ width: "300px" }} />
                </Form.Item>
              </Row>
              <Row>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email" },
                    { type: "email", message: "Email không hợp lệ" },
                  ]}
                  style={{ marginBottom: "0px" }}
                >
                  <Input
                    type="email"
                    placeholder="Email"
                    style={{ width: "300px" }}
                  />
                </Form.Item>
              </Row>
              <Row>
                <Form.Item
                  name="dob"
                  rules={[
                    { required: true, message: "Vui lòng chọn ngày sinh" },
                  ]}
                  style={{ marginBottom: "8px" }}
                >
                  <DatePicker
                    placeholder="Chọn ngày sinh"
                    style={{ width: "300px" }}
                  />
                </Form.Item>
              </Row>

              <Row>
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu" },
                    { min: 6, message: "Mật khẩu phải dài ít nhất 6 ký tự" },
                  ]}
                  style={{ marginBottom: "8px" }}
                >
                  <Input.Password
                    placeholder="Mật khẩu"
                    style={{ width: "300px" }}
                  />
                </Form.Item>
              </Row>
              <Row>
                <Form.Item
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập xác nhận mật khẩu",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Mật khẩu xác nhận không khớp")
                        );
                      },
                    }),
                  ]}
                  style={{ marginBottom: "0px" }}
                >
                  <Input.Password
                    placeholder="Xác nhận mật khẩu"
                    style={{ width: "300px" }}
                  />
                </Form.Item>
              </Row>

              <Row>
                <Form.Item>
                  <Button
                    block
                    onClick={onRegisterAccount}
                    className="btn-signup"
                  >
                    Đăng ký
                  </Button>
                </Form.Item>
              </Row>
            </Form>
          ) : showOTP ? (
            <div
              className="content-otp-register"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <label htmlFor="otp">Nhập mã OTP</label>
              <OTP
                value={otp}
                onChange={setOtp}
                disabled={false}
                autoFocus
              ></OTP>
              <button onClick={onOTPVerify}>
                {loading && (
                  <CgSpinner size={20} className="mt-1 animate-spin" />
                )}
                <span>Xác thực OTP</span>
              </button>
            </div>
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
          <input
            type="text"
            placeholder="Số điện thoại"
            onChange={(e) => setPh(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            onChange={(e) => setPassword(e.target.value)}
          />
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
              Nhập thông tin cá nhân của bạn để sử dụng các tính năng của trang
              web
            </p>
            <button className="hidden" id="login" onClick={handleSignInClick}>
              Đăng nhập
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Chào bạn!</h1>
            <p>
              Đăng ký thông tin cá nhân của bạn để sử dụng các tính năng của
              trang web
            </p>
            <button
              className="hidden"
              id="register"
              onClick={handleSignUpClick}
            >
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authenticate;
