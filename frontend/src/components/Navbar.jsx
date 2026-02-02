import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <TrendingUp size={24} />
          <span>RialoPredict</span>
        </div>
        
        <div className="navbar-menu">
          <a href="#home" className="nav-link">HOME</a>
          <a href="https://www.rialo.io/news" className="nav-link">NEWS</a>
          <a href="https://www.rialo.io/blog" className="nav-link">BLOG</a>
          <a href="https://learn.rialo.io/" className="nav-link">LEARN</a>
        </div>

        <div className="navbar-actions">
          <button
            className="btn-signup"
            onClick={() => window.open('https://x.com/Arlor09', '_blank')}
          >
            Grialo
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
