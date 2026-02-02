import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Architecture from '../components/Architecture';
import Partners from '../components/Partners';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Navbar />
      <Hero />
      <Architecture />
      <Partners />
      <Footer />
    </div>
  );
};

export default LandingPage;
