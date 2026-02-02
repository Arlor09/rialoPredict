import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StockList from '../components/dashboard/StockList';
import StockChart from '../components/dashboard/StockChart';
import PredictionCard from '../components/dashboard/PredictionCard';
import { getAllStocks, getStockDetail, getStockHistory } from '../utils/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [stockDetail, setStockDetail] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState(null);
  const [predicting, setPredicting] = useState(false);

  // Fetch all stocks on mount
  useEffect(() => {
    fetchStocks();
  }, []);

  // Fetch stock details when selected stock changes
  useEffect(() => {
    if (selectedStock) {
      fetchStockDetails(selectedStock);
    }
  }, [selectedStock]);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const response = await getAllStocks();
      if (response.success) {
        setStocks(response.stocks);
        // Select first stock by default
        if (response.stocks.length > 0) {
          setSelectedStock(response.stocks[0].symbol);
        }
      }
    } catch (error) {
      console.error('Error fetching stocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStockDetails = async (symbol) => {
    try {
      setLoading(true);
      setPrediction(null); // Clear previous prediction

      // Fetch current price and details
      const detailResponse = await getStockDetail(symbol);
      if (detailResponse.success) {
        setStockDetail(detailResponse.data);
      }

      // Fetch historical data (1 year, daily)
      const historyResponse = await getStockHistory(symbol, '1y', '1d');
      if (historyResponse.success) {
        setHistoricalData(historyResponse.data);
      }
    } catch (error) {
      console.error('Error fetching stock details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStockSelect = (symbol) => {
    setSelectedStock(symbol);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (loading && !stockDetail) {
    return (
      <div className="dashboard-loading">
        <RefreshCw className="spin" size={48} />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <button className="back-button" onClick={handleBackToHome}>
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </button>
        <h1>Rialo Prediction Dashboard</h1>
        <div className="header-actions">
          <button className="refresh-button" onClick={() => fetchStockDetails(selectedStock)}>
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </header>

      <div className="dashboard-container">
        {/* Sidebar - Stock List */}
        <aside className="dashboard-sidebar">
          <StockList
            stocks={stocks}
            selectedStock={selectedStock}
            onSelectStock={handleStockSelect}
          />
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          {stockDetail && (
            <>
              {/* Stock Info Card */}
              <div className="stock-info-card">
                <div className="stock-header">
                  <div>
                    <h2>{stockDetail.symbol}</h2>
                    <p className="stock-name">{stockDetail.name}</p>
                  </div>
                  <div className="stock-price">
                    <h1>${stockDetail.currentPrice}</h1>
                    <div className={`price-change ${stockDetail.change >= 0 ? 'positive' : 'negative'}`}>
                      {stockDetail.change >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                      <span>{stockDetail.change >= 0 ? '+' : ''}{stockDetail.change} ({stockDetail.changePercent}%)</span>
                    </div>
                  </div>
                </div>

                <div className="stock-stats">
                  <div className="stat-item">
                    <span className="stat-label">Previous Close</span>
                    <span className="stat-value">${stockDetail.previousClose}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Day Range</span>
                    <span className="stat-value">${stockDetail.dayLow} - ${stockDetail.dayHigh}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">52 Week Range</span>
                    <span className="stat-value">${stockDetail.fiftyTwoWeekLow} - ${stockDetail.fiftyTwoWeekHigh}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Volume</span>
                    <span className="stat-value">{stockDetail.volume?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="chart-section">
                <StockChart
                  data={historicalData}
                  symbol={selectedStock}
                  prediction={prediction}
                />
              </div>

              {/* Prediction Section */}
              <PredictionCard
                symbol={selectedStock}
                currentPrice={stockDetail.currentPrice}
                prediction={prediction}
                onPredict={setPrediction}
                predicting={predicting}
                setPredicting={setPredicting}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
