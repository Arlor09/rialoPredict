/**
 * API Utility for connecting to Stock Prediction Backend
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for ML predictions
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// STOCK DATA API
// ============================================

/**
 * Get all available stocks
 */
export const getAllStocks = async () => {
  try {
    const response = await api.get('/stocks');
    return response.data;
  } catch (error) {
    console.error('Error fetching stocks:', error);
    throw error;
  }
};

/**
 * Get detailed information for a specific stock
 * @param {string} symbol - Stock symbol (e.g., 'AAPL')
 */
export const getStockDetail = async (symbol) => {
  try {
    const response = await api.get(`/stocks/${symbol}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${symbol} details:`, error);
    throw error;
  }
};

/**
 * Get historical data for a stock
 * @param {string} symbol - Stock symbol
 * @param {string} period - Time period (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)
 * @param {string} interval - Data interval (1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo)
 */
export const getStockHistory = async (symbol, period = '1y', interval = '1d') => {
  try {
    const response = await api.get(`/stocks/${symbol}/history`, {
      params: { period, interval },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${symbol} history:`, error);
    throw error;
  }
};

/**
 * Get today's intraday data (5-minute intervals)
 * @param {string} symbol - Stock symbol
 */
export const getStockIntraday = async (symbol) => {
  try {
    const response = await api.get(`/stocks/${symbol}/intraday`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${symbol} intraday data:`, error);
    throw error;
  }
};

/**
 * Get current prices for multiple stocks
 * @param {array} symbols - Array of stock symbols
 */
export const getMultipleStocks = async (symbols) => {
  try {
    const response = await api.post('/stocks/batch', { symbols });
    return response.data;
  } catch (error) {
    console.error('Error fetching multiple stocks:', error);
    throw error;
  }
};

// ============================================
// PREDICTION API
// ============================================

/**
 * Predict future stock prices using ML model
 * @param {string} symbol - Stock symbol
 * @param {number} days - Number of days to predict (1-30)
 */
export const predictStock = async (symbol, days = 7) => {
  try {
    const response = await api.post(`/predict/${symbol}`, { days });
    return response.data;
  } catch (error) {
    console.error(`Error predicting ${symbol}:`, error);
    throw error;
  }
};

/**
 * Predict multiple stocks at once
 * @param {array} symbols - Array of stock symbols
 * @param {number} days - Number of days to predict
 */
export const predictMultipleStocks = async (symbols, days = 7) => {
  try {
    const response = await api.post('/predict/batch', { symbols, days });
    return response.data;
  } catch (error) {
    console.error('Error predicting multiple stocks:', error);
    throw error;
  }
};

// ============================================
// HEALTH CHECK
// ============================================

/**
 * Check if backend API is healthy
 */
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Backend health check failed:', error);
    throw error;
  }
};

export default api;
