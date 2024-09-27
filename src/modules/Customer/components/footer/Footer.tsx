import React from 'react'
import './Footer.scss'
import { FaFacebookF, FaGithub, FaGoogle, FaInstagram, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'

const Footer: React.FC = () => {
  return (
    <footer className="footer">
        <img className="logo" src="/public/logo-homepage.svg" alt="Logo" />
        <div className="footer-content">
          <h4>Thông tin liên hệ</h4>
          <p><FaMapMarkerAlt /><span>Số 4, đường Nguyễn Văn Bảo, phường 4, quận Gò Vấp, tp. Hồ Chí Minh</span></p>
          <p><FaPhoneAlt /><span>Điện thoại: 0373959802</span></p>
          <p><MdEmail /><span>Email: kimbeautyspa.vn</span></p>
          <p>
              <div className="social-icons">
                <a href="#" className="icon">
                  <FaGoogle />
                </a>
                <a href="#" className="icon">
                  <FaFacebookF/>
                </a>
                <a href="#" className="icon">
                  <FaGithub />
                </a>
                <a href="#" className="icon">
                  <FaInstagram />
                </a>
              </div>
          </p>
        </div>
      </footer>
  )
}

export default Footer