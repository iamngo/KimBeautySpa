import React, { useState } from "react";
import "../styles.scss";
import { FaGoogle, FaFacebookF, FaGithub, FaInstagram } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { DASHBOARD, MANAGER } from "../../../routes";

const Authenticate: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();


  const handleSignUpClick = () => {
    setIsSignUp(true);
  };

  const handleSignInClick = () => {
    setIsSignUp(false);
  };

  return (
    <div className={`container ${isSignUp ? "active" : ""}`} id="container">
      <div className="form-container sign-up">
        <form>
          <h1>Create Account</h1>
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
          <span>or use your email for registration</span>
          <input type="text" placeholder="Name..." />
          <input type="text" placeholder="Phone..." />
          <input type="password" placeholder="Password..." />
          <button type="button">Sign Up</button>
        </form>
      </div>
      <div className="form-container sign-in">
        <form>
          <h1>Sign In</h1>
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
          <span>or use your email password</span>
          <input type="text" placeholder="Phone..." />
          <input type="password" placeholder="Password..." />
          <a href="#">Forget Your Password?</a>
          <button type="button" onClick={()=>navigate(`${MANAGER}/${DASHBOARD}`)}>Sign In</button>
        </form>
      </div>
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of site features</p>
            <button className="hidden" id="login" onClick={handleSignInClick}>
              Sign In
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <p>
              Register with your personal details to use all of site features
            </p>
            <button
              className="hidden"
              id="register"
              onClick={handleSignUpClick}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authenticate;
