import React, { useState } from 'react';
import { Brain, TrendingUp, TrendingDown, AlertCircle, RefreshCw } from 'lucide-react';
import { predictStock } from '../../utils/api';
import '../../styles/PredictionCard.css';

const PredictionCard = ({ symbol, currentPrice, prediction, onPredict, predicting, setPredicting }) => {
  const [days, setDays] = useState(7);
  const [error, setError] = useState(null);

  const handlePredict = async () => {
    try {
      setPredicting(true);
      setError(null);

      const response = await predictStock(symbol, days);
      
      if (response.success) {
        onPredict(response.data);
      } else {
        setError(response.error || 'Failed to generate prediction');
      }
    } catch (err) {
      setError('Failed to connect to prediction service. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setPredicting(false);
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'bullish':
        return <TrendingUp className="trend-icon bullish" />;
      case 'bearish':
        return <TrendingDown className="trend-icon bearish" />;
      default:
        return <TrendingUp className="trend-icon neutral" />;
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'high';
    if (confidence >= 60) return 'medium';
    return 'low';
  };

  return (
    <div className="prediction-section">
      <h2>AI Rialo Prediction</h2>
      
      {!prediction && !predicting && (
        <div className="prediction-prompt">
          <div className="prediction-icon">
            <Brain size={48} />
          </div>
          <h3>Generate Price Prediction</h3>
          <p>Use our machine learning model to predict future stock prices based on historical data.</p>
          
          <div className="prediction-controls">
            <label>
              Prediction Period:
              <select value={days} onChange={(e) => setDays(Number(e.target.value))}>
                <option value={1}>1 Day</option>
                <option value={3}>3 Days</option>
                <option value={7}>1 Week</option>
                <option value={14}>2 Weeks</option>
                <option value={30}>1 Month</option>
              </select>
            </label>
            
            <button className="predict-button" onClick={handlePredict}>
              <Brain size={20} />
              Generate Prediction
            </button>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}

      {predicting && (
        <div className="prediction-loading">
          <RefreshCw className="spin" size={48} />
          <h3>Training AI Model...</h3>
          <p>Analyzing historical data and generating predictions. This may take 30-60 seconds.</p>
          <div className="loading-steps">
            <div className="step">📊 Fetching historical data Wen yah</div>
            <div className="step">🧠 Training LSTM model Soon</div>
            <div className="step">🔮 Generating predictions Skuyy</div>
          </div>
        </div>
      )}

      {prediction && !predicting && (
        <div className="prediction-results">
          <div className="prediction-header">
            <h3>Prediction Results</h3>
            <button className="regenerate-button" onClick={handlePredict}>
              <RefreshCw size={16} />
              Regenerate
            </button>
          </div>

          <div className="prediction-cards">
            {/* Tomorrow Prediction */}
            <div className="pred-card">
              <span className="pred-label">Tomorrow</span>
              <span className="pred-value">${prediction.predictions.tomorrow}</span>
              <span className={`pred-change ${prediction.predictions.tomorrow >= currentPrice ? 'positive' : 'negative'}`}>
                {prediction.predictions.tomorrow >= currentPrice ? '+' : ''}
                {((prediction.predictions.tomorrow - currentPrice) / currentPrice * 100).toFixed(2)}%
              </span>
            </div>

            {/* 3-Day Average */}
            <div className="pred-card">
              <span className="pred-label">3-Day Avg</span>
              <span className="pred-value">${prediction.predictions.threeDay}</span>
              <span className={`pred-change ${prediction.predictions.threeDay >= currentPrice ? 'positive' : 'negative'}`}>
                {prediction.predictions.threeDay >= currentPrice ? '+' : ''}
                {((prediction.predictions.threeDay - currentPrice) / currentPrice * 100).toFixed(2)}%
              </span>
            </div>

            {/* Week Prediction */}
            <div className="pred-card">
              <span className="pred-label">Next Week</span>
              <span className="pred-value">${prediction.predictions.nextWeek}</span>
              <span className={`pred-change ${prediction.predictions.nextWeek >= currentPrice ? 'positive' : 'negative'}`}>
                {prediction.predictions.nextWeek >= currentPrice ? '+' : ''}
                {((prediction.predictions.nextWeek - currentPrice) / currentPrice * 100).toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="prediction-analysis">
            <div className="analysis-row">
              <div className="analysis-item">
                <span className="analysis-label">Trend</span>
                <div className="trend-value">
                  {getTrendIcon(prediction.trend)}
                  <span className={`trend-text ${prediction.trend}`}>
                    {prediction.trend.charAt(0).toUpperCase() + prediction.trend.slice(1)}
                  </span>
                </div>
              </div>

              <div className="analysis-item">
                <span className="analysis-label">Confidence</span>
                <div className="confidence-value">
                  <div className="confidence-bar">
                    <div 
                      className={`confidence-fill ${getConfidenceColor(prediction.confidence)}`}
                      style={{ width: `${prediction.confidence}%` }}
                    ></div>
                  </div>
                  <span className="confidence-text">{prediction.confidence}%</span>
                </div>
              </div>
            </div>

            <div className="recommendation">
              <AlertCircle size={18} />
              <span>{prediction.recommendation}</span>
            </div>
          </div>

          <div className="prediction-disclaimer">
            <p><strong>Disclaimer:</strong> This prediction is generated by an AI model based on historical data. 
            Stock prices are influenced by many factors and predictions may not be accurate. 
            Always do your own research before making investment decisions.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionCard;
