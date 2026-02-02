# RialoPredict Backend

Python-based REST API server for stock price prediction using machine learning and real-time market data.

## Overview

RialoPredict Backend provides a RESTful API that delivers real-time stock market data and AI-powered price predictions. Built with Flask and TensorFlow, it integrates with Massive API (formerly Polygon.io) for institutional-grade market data and uses LSTM neural networks for time series forecasting.

## Features

- **Real-time Market Data**: Integration with Massive API for up-to-date stock information
- **50+ Top Stocks**: Curated list of global market leaders across various sectors
- **Historical Data Access**: Retrieve price history with customizable periods and intervals
- **LSTM Predictions**: Deep learning model for multi-day price forecasting
- **Confidence Scoring**: Statistical confidence metrics for each prediction
- **Trend Analysis**: Automated bullish/bearish/neutral trend identification
- **Rate Limit Handling**: Automatic retry logic for API rate limits
- **CORS Enabled**: Cross-origin resource sharing for frontend integration

## Technology Stack

- **Framework**: Flask 3.0.0
- **ML Framework**: TensorFlow 2.15.0
- **Data Processing**: Pandas 2.1.3, NumPy 1.26.2
- **ML Utilities**: Scikit-learn 1.3.2
- **Market Data**: Massive API (Polygon.io)
- **HTTP Client**: Requests 2.31.0

## Project Structure

```
stock-backend/
├── app/
│   └── server.py          # Flask application and routes
├── models/
│   └── predictor.py       # LSTM prediction model
├── utils/
│   └── massive_api.py     # Massive API integration
├── data/                  # Data storage (optional)
├── requirements.txt       # Python dependencies
└── .env                   # Environment configuration
```

## Prerequisites

- Python 3.8 or higher
- pip package manager
- Massive API key (free tier available at https://massive.com)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd stock-backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
```bash
# Create .env file with your Massive API key
MASSIVE_API_KEY=your_api_key_here
PORT=5000
FLASK_DEBUG=True
```

## Running the Server

Start the Flask development server:
```bash
cd app
python server.py
```

The API will be available at http://localhost:5000

## API Endpoints

### Health Check

```http
GET /api/health
```

Returns server status and configuration.

**Response:**
```json
{
  "status": "healthy",
  "message": "Stock Prediction API is running",
  "apiMode": "Massive API (Polygon.io)",
  "freeTier": true
}
```

### Stock Data Endpoints

#### Get All Stocks

```http
GET /api/stocks
```

Returns list of all available stocks (50 top global companies).

**Response:**
```json
{
  "success": true,
  "count": 50,
  "stocks": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc."
    }
  ]
}
```

#### Get Stock Details

```http
GET /api/stocks/{symbol}
```

Returns current price and detailed information for a specific stock.

**Parameters:**
- `symbol` (path): Stock ticker symbol (e.g., AAPL, MSFT)

**Response:**
```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "currentPrice": 178.50,
    "previousClose": 180.00,
    "change": -1.50,
    "changePercent": -0.83,
    "volume": 50000000,
    "dayHigh": 179.00,
    "dayLow": 177.50
  }
}
```

#### Get Historical Data

```http
GET /api/stocks/{symbol}/history?period=1y&interval=1d
```

Retrieves historical price data with customizable parameters.

**Parameters:**
- `symbol` (path): Stock ticker symbol
- `period` (query): Time period (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, ALL)
- `interval` (query): Data interval (1d, 1wk, 1mo)

**Response:**
```json
{
  "success": true,
  "symbol": "AAPL",
  "count": 252,
  "data": [
    {
      "date": "2024-01-31 00:00:00",
      "open": 178.00,
      "high": 179.50,
      "low": 177.00,
      "close": 178.50,
      "volume": 50000000
    }
  ]
}
```

#### Get Multiple Stocks

```http
POST /api/stocks/batch
Content-Type: application/json

{
  "symbols": ["AAPL", "MSFT", "GOOGL"]
}
```

Retrieves current data for multiple stocks in a single request.

### Prediction Endpoints

#### Generate Stock Prediction

```http
POST /api/predict/{symbol}
Content-Type: application/json

{
  "days": 7
}
```

Generates AI-powered price predictions using LSTM neural network.

**Parameters:**
- `symbol` (path): Stock ticker symbol
- `days` (body): Number of days to predict (1-30)

**Response:**
```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "currentPrice": 178.50,
    "predictions": {
      "tomorrow": 179.20,
      "nextWeek": 181.50,
      "threeDay": 180.00
    },
    "allPredictions": [179.20, 179.80, 180.40, 180.90, 181.20, 181.30, 181.50],
    "confidence": 85.3,
    "trend": "bullish",
    "recommendation": "BUY - Strong upward trend expected",
    "timestamp": "2025-01-31T20:00:00"
  }
}
```

#### Batch Predictions

```http
POST /api/predict/batch
Content-Type: application/json

{
  "symbols": ["AAPL", "MSFT"],
  "days": 7
}
```

Generates predictions for multiple stocks.

## Machine Learning Model

### LSTM Architecture

The prediction model uses a Long Short-Term Memory (LSTM) neural network optimized for time series forecasting.

**Model Structure:**
- Input layer: 60-day price sequence
- LSTM layer 1: 50 units with return sequences
- Dropout layer 1: 0.2 rate
- LSTM layer 2: 50 units with return sequences
- Dropout layer 2: 0.2 rate
- LSTM layer 3: 50 units
- Dropout layer 3: 0.2 rate
- Dense layer 1: 25 units
- Output layer: 1 unit (predicted price)

**Training Process:**
1. Fetch 2 years of historical data
2. Normalize prices using MinMaxScaler
3. Create 60-day sequences for training
4. Split data (80/20 train/test)
5. Train for 15 epochs with Adam optimizer
6. Generate predictions for requested timeframe

**Confidence Calculation:**
Confidence scores are derived from prediction variance and price stability. Higher confidence indicates more reliable predictions based on historical patterns.

## Massive API Integration

### Free Tier Specifications

- Rate limit: 5 API calls per minute
- Data delay: 15 minutes (status: "DELAYED")
- Historical data: Up to 2 years
- Real-time quotes: Not available on free tier

### Supported Stock Symbols

The system includes 50 top global stocks across multiple sectors:

**Technology**: AAPL, MSFT, GOOGL, AMZN, NVDA, META, TSLA, AMD, INTC, ORCL, IBM, CSCO, ADBE, CRM, QCOM, TXN, AVGO, NOW, NFLX, UBER

**Financial**: V, MA, JPM, BAC, WFC, GS, MS, C

**Consumer/Retail**: WMT, HD, MCD, NKE, SBUX, DIS

**Healthcare**: JNJ, UNH, PFE, ABBV, TMO, LLY

**Industrial/Energy**: XOM, CVX, BA, CAT, GE

**Telecom/Media**: T, VZ, CMCSA

### Rate Limiting

The system automatically handles rate limits:
- Implements exponential backoff
- Waits 15 seconds on 429 status
- Retries failed requests
- Batch operations include delays

## Environment Variables

```env
# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
PORT=5000

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Massive API Configuration
MASSIVE_API_KEY=your_api_key_here
```

## Error Handling

The API provides detailed error responses:

```json
{
  "success": false,
  "error": "Error message describing the issue"
}
```

Common HTTP status codes:
- 200: Success
- 400: Bad request (invalid parameters)
- 404: Resource not found
- 429: Rate limit exceeded
- 500: Internal server error

## Performance Considerations

### Prediction Processing Time

- First prediction: 30-60 seconds (model training required)
- Data fetching: 2-5 seconds
- Model training: 20-40 seconds
- Prediction generation: 5-10 seconds

### Optimization Strategies

- Cache historical data for repeated requests
- Implement model persistence to avoid retraining
- Use connection pooling for API requests
- Batch similar requests when possible

## Troubleshooting

### Common Issues

**Issue**: API key not found
**Solution**: Ensure `.env` file exists with valid `MASSIVE_API_KEY`

**Issue**: Rate limit exceeded
**Solution**: Wait 60 seconds between request batches

**Issue**: Insufficient historical data
**Solution**: Verify stock symbol is correct and market data is available

**Issue**: Model training fails
**Solution**: Check that at least 61 days of historical data exists

### Debug Mode

Enable verbose logging:
```python
# In app/server.py
app.config['DEBUG'] = True
```

## Testing

Test individual endpoints:

```bash
# Health check
curl http://localhost:5000/api/health

# Get stock detail
curl http://localhost:5000/api/stocks/AAPL

# Get historical data
curl "http://localhost:5000/api/stocks/AAPL/history?period=1y&interval=1d"

# Generate prediction
curl -X POST http://localhost:5000/api/predict/AAPL \
  -H "Content-Type: application/json" \
  -d '{"days": 7}'
```

## Production Deployment

For production deployment:

1. Set environment variables:
```env
FLASK_ENV=production
FLASK_DEBUG=False
```

2. Use a production WSGI server (Gunicorn):
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app.server:app
```

3. Configure reverse proxy (Nginx):
```nginx
location /api {
    proxy_pass http://localhost:5000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

4. Implement caching and model persistence
5. Set up monitoring and logging
6. Configure SSL/TLS certificates

## Security Considerations

- Never commit `.env` file to version control
- Rotate API keys regularly
- Implement request rate limiting
- Validate all user inputs
- Use HTTPS in production
- Set proper CORS origins

## Contributing

When contributing to the backend:

1. Follow PEP 8 style guidelines
2. Add docstrings to all functions
3. Include type hints where applicable
4. Test endpoints thoroughly
5. Update documentation for API changes

## License

This project is for educational purposes. The predictions generated should not be used as sole financial advice. Always conduct independent research before making investment decisions.

## Acknowledgments

- Market data provided by Massive API (Polygon.io)
- Machine learning powered by TensorFlow
- Built with Flask web framework
- Data processing with Pandas and NumPy

Thanks.