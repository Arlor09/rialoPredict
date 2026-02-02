import React from 'react';
import { ArrowRight } from 'lucide-react';
import rialoImg from '../assets/rialo.svg';
import { useNavigate } from 'react-router-dom';
import '../styles/Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  return (
    <section className="hero" id="home">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Making Market Complexity Understandable
          </h1>
          <p className="hero-subtitle">
            Real-time stock price prediction with high accuracy using 
            machine learning and historical data analysis
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={handleGetStarted}>
              Get Started <ArrowRight size={20} />
            </button>
            <button className="btn-secondary" onClick={() => window.open('https://www.rialo.io/', '_blank')}>
              Learn More
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-card">
            <img
              src={rialoImg}
              alt="Rialo Illustration"
              className="hero-image"
            />
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="hero-decoration decoration-1"></div>
      <div className="hero-decoration decoration-2"></div>
    </section>
  );
};

export default Hero;
