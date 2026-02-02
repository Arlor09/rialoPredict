import React from 'react';
import { Database, TrendingUp, Brain, LineChart, Clock, Shield } from 'lucide-react';
import '../styles/Architecture.css';

const Architecture = () => {
  return (
    <section className="architecture" id="features">
      <div className="architecture-container">
        <h2 className="section-title">System Architecture</h2>
        <p className="section-subtitle">
          How we process and predict stock movements
        </p>

        <div className="architecture-diagram">
          <div className="arch-node">
            <div className="node-icon">
              <Database size={32} />
            </div>
            <h3>Data Historis</h3>
            <p>Collection of stock data from various sources</p>
          </div>

          <div className="arch-arrow">→</div>

          <div className="arch-node">
            <div className="node-icon">
              <Brain size={32} />
            </div>
            <h3>AI Processing</h3>
            <p>Machine learning for pattern analysis</p>
          </div>

          <div className="arch-arrow">→</div>

          <div className="arch-node">
            <div className="node-icon">
              <TrendingUp size={32} />
            </div>
            <h3>Prediksi</h3>
            <p>Accurate price prediction results</p>
          </div>

          <div className="arch-arrow">→</div>

          <div className="arch-node">
            <div className="node-icon">
              <LineChart size={32} />
            </div>
            <h3>Dashboard</h3>
            <p>Real-time visualization for users</p>
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <Clock size={40} />
            <h3>Real-time Updates</h3>
            <p>Stock data is updated every second for accurate analysis</p>
          </div>

          <div className="feature-card">
            <Brain size={40} />
            <h3>AI Powered</h3>
            <p>Using deep learning for more precise predictions</p>
          </div>

          <div className="feature-card">
            <Shield size={40} />
            <h3>Secure & Reliable</h3>
            <p>Data security is guaranteed with end-to-end encryption</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Architecture;
