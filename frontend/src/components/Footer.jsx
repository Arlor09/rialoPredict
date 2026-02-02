import React from 'react';
import { TrendingUp, Mail, Phone, MapPin} from 'lucide-react';
import '../styles/Footer.css';
import { FaDiscord, FaTelegramPlane } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import arlorImg from '../assets/arlor.svg';
import Rialoo from '../assets/rialofot.svg';


const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <TrendingUp size={30} />
              <span>RialoPredict</span>
            </div>
            <p className="footer-description">
              A trusted Rialo prediction platform powered by AI to support smarter investment decisions.
            </p>
            <p className="footer-description">
              This platform provides analytical insights only and does not constitute financial advice.
            </p>

          <div className="social-links">
            <a href="https://discord.com/invite/RialoProtocol" target='blank'><FaDiscord size={20} /></a>
            <a href="https://discord.com/invite/RialoProtocol" target='_blank'><FaTelegramPlane size={20} /></a>
            <a href="https://x.com/RialoHQ" target='_blank'><FaXTwitter size={20} /></a>
          </div> 
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="https://www.rialo.io/docs">Docs</a></li>
              <li><a href="https://www.rialo.io/blog">Blog</a></li>
              <li><a href="https://learn.rialo.io/">Learn</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Explore Tutorials</h3>
            <ul>
              <li><a href="https://learn.rialo.io/tutorials/concurrency/">Concurrency Control</a></li>
              <li><a href="https://learn.rialo.io/tutorials/reactive/">Reactive Transactions</a></li>
              <li><a href="https://massive.com/">Souce Data</a></li>
              <li><a href="#">Metodology (soon)</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <ul className="contact-info">
                  <img
                    href="https://x.com/Arlor09"
                    src={Rialoo}
                    alt="arlor Illustration"
                    className="hero-image"
                  />     
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 RialoPredict. All rights reserved.</p>
          <div className="footer-legal">
            <a href="https://www.rialo.io/privacy-policy">Privacy Policy</a>
            <a href="https://www.rialo.io/terms-of-service">Terms of Use</a>
            <a href="https://www.rialo.io/brand-assets">Brand</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
