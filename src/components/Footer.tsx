import React from "react";
import { FaFacebookF, FaTwitter, FaDiscord, FaMapMarkerAlt, FaPhoneAlt, FaRegEnvelope } from "react-icons/fa";

interface IFooter {}

const Footer = (props: IFooter) => {
  return (
    <div className="footer-component">
      <div className="footer-items">
        <div className="footer-item description">
          <h2>IPP Blog</h2>
          <div className="description-text">
            Far far away, behind the word mountains, far from the countries
            Vokalia and Consonantia, there live the blind texts.
          </div>
          <div className="social-icons">
            <a href="#" className="social-icon">
             <FaFacebookF color="#ccc" size={25} />
            </a>
            <a href="#" className="social-icon">
             <FaTwitter color="#ccc" size={25} />
             </a>
            <a href="#" className="social-icon">
             <FaDiscord color="#ccc" size={25} />
             </a>
          </div>
        </div>
        <div className="footer-item policy">
          <h2>Policy</h2>
          <ul>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Terms and Police</a>
            </li>
          </ul>
        </div>
        <div className="footer-item policy">
          <h2>Information</h2>
          <ul>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Terms and Police</a>
            </li>
          </ul>
        </div>
        <div className="footer-item contact-us">
          <h2>Contact Us</h2>
          <div className="item">
            <span>
              <FaMapMarkerAlt />
            </span>
            <div>
              203 Fake St. Mountain View, San Francisco, California, USA
            </div>
          </div>
          <div className="item">
            <span>
              <FaPhoneAlt />
            </span>
            <div>
             +1 000 000 0000
            </div>
          </div>
          <div className="item">
            <span>
              <FaRegEnvelope />
            </span>
            <div>
              info@yourdomain.com
            </div>
          </div>
        </div>
      </div>
      <div className="copyright">
        Copyright ©2022 All rights reserved | This template is made with
        xxx@xxx.xxx
      </div>
    </div>
  );
};

export default Footer;
