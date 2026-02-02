import React, { useState } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import '../../styles/StockList.css';

const StockList = ({ stocks, selectedStock, onSelectStock }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStocks = stocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="stock-list">
      <div className="stock-list-header">
        <h3>Available Stocks</h3>
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search stocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="stock-list-items">
        {filteredStocks.map((stock) => (
          <div
            key={stock.symbol}
            className={`stock-item ${selectedStock === stock.symbol ? 'active' : ''}`}
            onClick={() => onSelectStock(stock.symbol)}
          >
            <div className="stock-icon">
              <TrendingUp size={20} />
            </div>
            <div className="stock-info">
              <span className="stock-symbol">{stock.symbol}</span>
              <span className="stock-name">{stock.name}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredStocks.length === 0 && (
        <div className="no-results">
          <p>No stocks found</p>
        </div>
      )}
    </div>
  );
};

export default StockList;
