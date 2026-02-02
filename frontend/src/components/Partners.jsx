import React from 'react';
import '../styles/Partners.css';
import Subzero from '../assets/sub.svg';
import Pantera from '../assets/pantera.svg';
import google from '../assets/google.jpg';
import Microsoft from '../assets/microsoft.jpg';
import redhat from '../assets/red.png';
import gen from '../assets/gen.jpg';
import moonpay from '../assets/moon.jpg';
import vibe from '../assets/vibe.jpg';
import rick from '../assets/rick.jpg';
import gufran from '../assets/gufran.jpg';
import rehan from '../assets/rehan.jpg';
import Linera from '../assets/linera.jpg';
import mbek from '../assets/mbek.jpg';
import Noparty from '../assets/Noparty.jpg';

const logoMap = {
  Subzero: Subzero,
  Pantera: Pantera,
  Google: google,
  Microsoft: Microsoft,
  RedHat: redhat,
  Gensyn: gen,
  MoonPay: moonpay,
  VibeVortex: vibe,
  RickTech: rick,
  GufranCorp: gufran,
  RehanCorp: rehan,
  Linera: Linera,
  MbekCorp: mbek,
  NoPartyCorp: Noparty,
};


const Partners = () => {
  const partners = [
    { name: 'Subzero', category: 'Banking' },
    { name: 'Pantera', category: 'Finance' },
    { name: 'Microsoft', category: 'Technology' },
    { name: 'Google', category: 'Technology' },
    { name: 'MoonPay', category: 'Payment' },
    { name: 'RedHat', category: 'Technology' },
    { name: 'Gensyn', category: 'Technology' },
    { name: 'Linera', category: 'Technology' },
    { name: 'GufranCorp', category: 'Helper' },
    { name: 'VibeVortex', category: 'Helper' },
    { name: 'RickTech', category: 'Adalah Pokoknya' },
    { name: 'RehanCorp', category: 'Ga tau siapa' },
    { name: 'MbekCorp', category: 'Ga punya akhlak' },
    { name: 'NoPartyCorp', category: 'Pen Ikutan' },

  ];

  return (
    <section className="partners" id="about">
      <div className="partners-container">
        <h2 className="section-title-dark">Contributors</h2>
        <p className="section-subtitle-dark">
          Our Contributors comprise experienced builders and researchers from leading organizations across blockchain infrastructure and hyper-growth companies. 
          Collectively, we have contributed to some of the most foundational projects in the ecosystem. 
          Today, we are focused on designing the next-generation of decentralized networks that transcend incremental innovation.
        </p>

        <div className="partners-grid">
          {partners.map((partner, index) => (
            <div key={index} className="partner-card">
            <div className="partner-logo">
              {logoMap[partner.name] ? (
                <img src={logoMap[partner.name]} alt={partner.name} />
              ) : (
                <span>{partner.name.charAt(0)}</span>
              )}
            </div>
              <h3>{partner.name}</h3>
              <p>{partner.category}</p>
            </div>
          ))}
        </div>

        <div className="stats-section">
          <div className="stat-item">
            <h3>10K+</h3>
            <p>Active Users</p>
          </div>
          <div className="stat-item">
            <h3>95%</h3>
            <p>Accuracy Rate</p>
          </div>
          <div className="stat-item">
            <h3>50+</h3>
            <p>Companies Trust Us</p>
          </div>
          <div className="stat-item">
            <h3>24/7</h3>
            <p>Real-time Monitoring</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
