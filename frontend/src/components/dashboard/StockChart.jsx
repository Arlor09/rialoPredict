import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import '../../styles/StockChart.css';

const StockChart = ({ data, symbol, prediction }) => {
  const [timeRange, setTimeRange] = useState('1M');

  // Filter data based on time range
  const getFilteredData = () => {
    if (!data || data.length === 0) return [];

    const now = new Date();
    let startDate;

    switch (timeRange) {
      case '1W':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '1M':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '3M':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '6M':
        startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      case '1Y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        return data;
    }

    return data.filter(item => new Date(item.date) >= startDate);
  };

  const filteredData = getFilteredData();

  // Prepare chart data
  const chartData = filteredData.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    price: item.close,
    fullDate: item.date
  }));

  // Add prediction data if available
  if (prediction && prediction.allPredictions) {
    const lastDate = new Date(filteredData[filteredData.length - 1]?.date || new Date());
    
    prediction.allPredictions.forEach((price, index) => {
      const predDate = new Date(lastDate);
      predDate.setDate(predDate.getDate() + index + 1);
      
      chartData.push({
        date: predDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        prediction: price,
        fullDate: predDate.toISOString()
      });
    });
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-date">{payload[0].payload.fullDate?.split('T')[0]}</p>
          {payload.map((entry, index) => (
            <p key={index} className="tooltip-value" style={{ color: entry.color }}>
              {entry.name === 'price' ? 'Actual' : 'Predicted'}: ${entry.value?.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="stock-chart">
      <div className="chart-header">
        <h3>Price History - {symbol}</h3>
        <div className="time-range-buttons">
          {['1W', '1M', '3M', '6M', '1Y', 'ALL'].map((range) => (
            <button
              key={range}
              className={`range-btn ${timeRange === range ? 'active' : ''}`}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis 
              dataKey="date" 
              stroke="#999"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#999"
              tick={{ fontSize: 12 }}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Actual price line */}
            <Line
              type="monotone"
              dataKey="price"
              stroke="#4CAF50"
              strokeWidth={2}
              dot={false}
              name="Actual Price"
              connectNulls
            />
            
            {/* Prediction line */}
            {prediction && (
              <Line
                type="monotone"
                dataKey="prediction"
                stroke="#FF9800"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#FF9800', r: 4 }}
                name="Predicted Price"
                connectNulls
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {prediction && (
        <div className="chart-legend-info">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#4CAF50' }}></div>
            <span>Actual Price (Historical)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color dashed" style={{ backgroundColor: '#FF9800' }}></div>
            <span>Predicted Price (ML Model)</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockChart;
