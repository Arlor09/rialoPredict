# RialoPredict

An intelligent stock prediction platform that leverages machine learning and real-time market data to provide actionable insights for informed investment decisions.

## Overview

RialoPredict is a full-stack web application that combines modern frontend technologies with sophisticated backend AI models to deliver accurate stock price predictions. The platform integrates institutional-grade market data from Massive API with LSTM neural networks to forecast future price movements, helping users make data-driven investment decisions.

## Key Features

- **Real-Time Market Data**: Integration with Massive API for up-to-date stock information across 50+ global companies
- **AI-Powered Predictions**: LSTM neural network generates multi-day price forecasts with confidence scoring
- **Interactive Visualizations**: Dynamic charts with multiple timeframe options and prediction overlays
- **Comprehensive Analysis**: Trend identification, confidence metrics, and investment recommendations
- **Responsive Interface**: Modern, mobile-first design that works seamlessly across all devices
- **User-Friendly Dashboard**: Intuitive navigation with search, filtering, and quick access to stock details

## Architecture

### Frontend (React + Vite)

The client-side application provides a modern, responsive user interface built with React 18 and Vite. It features:

- Single-page application architecture with React Router
- Interactive charts using Recharts library
- Real-time data updates via Axios HTTP client
- Component-based design for maintainability
- Optimized build process with code splitting

### Backend (Python Flask + TensorFlow)

The server-side API delivers market data and generates predictions through:

- RESTful API design with Flask framework
- LSTM neural network for time series forecasting
- Massive API integration for institutional-grade market data
- Automated rate limiting and error handling
- Comprehensive data processing with Pandas and NumPy

### Data Flow

1. User selects a stock from the dashboard
2. Frontend requests current and historical data from backend API
3. Backend fetches real-time data from Massive API
4. Data is processed and visualized in interactive charts
5. User initiates prediction request
6. Backend trains LSTM model on historical data
7. Model generates multi-day price forecast
8. Results are returned with confidence scores and recommendations

## Technology Stack

### Frontend Technologies

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | React | 18.2.0 |
| Build Tool | Vite | 5.0.0 |
| Routing | React Router DOM | 6.20.0 |
| HTTP Client | Axios | 1.6.0 |
| Charts | Recharts | 2.10.0 |
| Icons | Lucide React | 0.263.1 |

### Backend Technologies

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Flask | 3.0.0 |
| ML Framework | TensorFlow | 2.15.0 |
| Data Processing | Pandas | 2.1.3 |
| Numerical Computing | NumPy | 1.26.2 |
| ML Utilities | Scikit-learn | 1.3.2 |
| HTTP Client | Requests | 2.31.0 |

### External Services

- **Massive API** (formerly Polygon.io): Real-time and historical market data
- Free tier: 5 API calls/minute with 15-minute delayed quotes
- Institutional-grade data from major US exchanges

## Project Structure

```
rialoPredict/
├── frontend/                    # Frontend application
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/               # Page components
│   │   ├── styles/              # CSS stylesheets
│   │   └── utils/               # Utility functions
│   ├── package.json
│   └── vite.config.js
│
├── backend/                    # Backend application
│   ├── app/
│   │   └── server.py           # Flask API server
│   ├── models/
│   │   └── predictor.py        # LSTM prediction model
│   ├── utils/
│   │   └── massive_api.py      # Massive API client
│   ├── requirements.txt
│   └── .env
│
└── README.md                    # This file
```

## Prerequisites

### System Requirements

- **Node.js**: 16.x or higher
- **Python**: 3.8 or higher
- **npm**: 8.x or higher
- **pip**: Latest version

### API Access

- Massive API key (obtain free tier at https://massive.com/dashboard/signup)

## Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd rialoPredict
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables
# Create .env file with:
MASSIVE_API_KEY=your_api_key_here
PORT=5000
FLASK_DEBUG=True

# Start backend server
cd app
python server.py
```

Backend will be available at http://localhost:5000

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install Node dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at http://localhost:3000

### 4. Access Application

Open your browser and navigate to http://localhost:3000

## Usage Guide

### Viewing Stock Data

1. Navigate to the dashboard by clicking "Get Started" on the landing page
2. Browse the list of available stocks in the sidebar
3. Click any stock to view detailed information
4. Charts automatically load with 1-year historical data
5. Use time range buttons to adjust the timeframe (1W, 1M, 3M, 6M, 1Y, ALL)

### Generating Predictions

1. Select a stock from the dashboard
2. Scroll to the "AI Stock Prediction" section
3. Choose prediction period (1 day to 1 month)
4. Click "Generate Prediction"
5. Wait 30-60 seconds for model training
6. Review prediction results including:
   - Tomorrow's predicted price
   - Next week's forecast
   - 3-day average prediction
   - Trend analysis (bullish/bearish/neutral)
   - Confidence score (50-95%)
   - Investment recommendation

### Understanding Results

**Confidence Score:**
- 85-95%: Very high confidence, strong historical patterns
- 70-84%: Good confidence, reliable prediction
- 50-69%: Moderate confidence, volatile patterns

**Trend Analysis:**
- Bullish: Price expected to increase
- Bearish: Price expected to decrease  
- Neutral: Price expected to remain stable

**Recommendations:**
- BUY: Strong upward trend with high confidence
- CONSIDER BUY: Moderate upward trend
- HOLD: Stable price or low confidence
- CONSIDER SELL: Moderate downward trend
- SELL: Strong downward trend with high confidence

## API Documentation

### Stock Data Endpoints

```http
GET /api/stocks
GET /api/stocks/{symbol}
GET /api/stocks/{symbol}/history?period=1y&interval=1d
GET /api/stocks/{symbol}/intraday
POST /api/stocks/batch
```

### Prediction Endpoints

```http
POST /api/predict/{symbol}
POST /api/predict/batch
```

For detailed API documentation, refer to `stock-backend/README.md`

## Available Stocks

The platform supports 50 top global stocks across various sectors:

**Technology**: Apple, Microsoft, Google, Amazon, NVIDIA, Meta, Tesla, AMD, Intel, Oracle, IBM, Cisco, Adobe, Salesforce, Qualcomm, Texas Instruments, Broadcom, ServiceNow, Netflix, Uber

**Financial Services**: Visa, Mastercard, JPMorgan Chase, Bank of America, Wells Fargo, Goldman Sachs, Morgan Stanley, Citigroup

**Consumer & Retail**: Walmart, Home Depot, McDonald's, Nike, Starbucks, Disney

**Healthcare & Pharma**: Johnson & Johnson, UnitedHealth Group, Pfizer, AbbVie, Thermo Fisher Scientific, Eli Lilly

**Industrial & Energy**: Exxon Mobil, Chevron, Boeing, Caterpillar, General Electric

**Telecom & Media**: AT&T, Verizon, Comcast

## Machine Learning Model

### LSTM Neural Network

The prediction system employs a Long Short-Term Memory network specifically designed for time series forecasting:

**Architecture:**
- 3 LSTM layers with 50 units each
- Dropout layers (20%) to prevent overfitting
- Dense layers for final price prediction
- Adam optimizer for training
- Mean Squared Error loss function

**Training Process:**
- Uses 2 years of historical price data
- Creates 30-day sequences for pattern recognition
- Trains for 15 epochs with batch processing
- Validates on 20% held-out test data

**Prediction Generation:**
- Takes last 60 days as input sequence
- Generates forecasts for 1-30 days ahead
- Calculates confidence based on prediction variance
- Identifies trends from price movement patterns

## Performance Benchmarks

### Frontend Performance

- Initial load time: Under 2 seconds
- Time to interactive: Under 3 seconds
- Chart rendering: Under 500ms
- Lighthouse score: 90+ across all metrics

### Backend Performance

- Stock data retrieval: 2-5 seconds
- Historical data fetch: 3-7 seconds  
- Model training: 20-40 seconds
- Prediction generation: 5-10 seconds
- Total prediction time: 30-60 seconds

## Configuration

### Frontend Configuration

Edit `src/utils/api.js` to change API endpoint:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

### Backend Configuration

Edit `.env` file to configure server:

```env
MASSIVE_API_KEY=your_api_key_here
PORT=5000
FLASK_DEBUG=True
FRONTEND_URL=http://localhost:3000
```

## Development

### Frontend Development

```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Development

```bash
cd backend
python app/server.py              # Start development server
pip install -r requirements.txt   # Install dependencies
```

## Testing

### Frontend Testing

```bash
cd frontend
npm run test        # Run unit tests (if configured)
npm run lint        # Check code quality
```

### Backend Testing

```bash
cd backend
# Test health endpoint
curl http://localhost:5000/api/health

# Test stock data
curl http://localhost:5000/api/stocks/AAPL

# Test prediction
curl -X POST http://localhost:5000/api/predict/AAPL \
  -H "Content-Type: application/json" \
  -d '{"days": 7}'
```

## Deployment

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
# Deploy dist/ directory to hosting service
```

**Backend:**
```bash
cd backend
# Use production WSGI server
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app.server:app
```

### Hosting Recommendations

- **Frontend**: Vercel, Netlify, or AWS S3 + CloudFront
- **Backend**: Heroku, AWS EC2, or Google Cloud Run
- **Database** (if added): PostgreSQL on AWS RDS or Google Cloud SQL

## Troubleshooting

### Common Issues

**Frontend won't start:**
- Verify Node.js version (16+)
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check port 3000 is not in use

**Backend won't start:**
- Verify Python version (3.8+)
- Install missing dependencies: `pip install -r requirements.txt`
- Check `.env` file exists with valid API key

**Chart not displaying:**
- Ensure backend is running and accessible
- Check browser console for errors
- Verify historical data endpoint returns data

**Prediction fails:**
- Wait full 30-60 seconds for processing
- Check backend console for errors
- Verify at least 61 days of historical data exists
- Ensure not hitting Massive API rate limits

### Debug Mode

Enable verbose logging in backend:
```python
# In app/server.py
app.config['DEBUG'] = True
```

Enable network logging in frontend:
```javascript
// In src/utils/api.js
axios.interceptors.request.use(console.log);
```

## Security Considerations

- Never commit `.env` file to version control
- Rotate API keys regularly
- Use HTTPS in production
- Implement proper CORS configuration
- Validate all user inputs
- Set secure session management

## Limitations

- Free tier API has 5 calls/minute rate limit
- Data has 15-minute delay on free tier
- Predictions are for educational purposes only
- Model accuracy varies by stock volatility
- Historical performance does not guarantee future results

## Disclaimer

This application is designed for educational and informational purposes only. The stock price predictions generated by the machine learning models should not be considered as financial advice or recommendations to buy or sell securities. 

Users should:
- Conduct independent research before making investment decisions
- Consult with qualified financial advisors
- Understand that past performance does not guarantee future results
- Recognize that stock markets involve risk and potential loss of capital

The developers and contributors are not liable for any financial losses incurred through the use of this application.

## Contributing

Contributions are welcome. When contributing:

1. Fork the repository
2. Create a feature branch
3. Follow existing code style and conventions
4. Add tests for new functionality
5. Update documentation as needed
6. Submit a pull request with clear description

## License

This project is licensed for educational use. Commercial use requires appropriate licensing for:
- Massive API (market data)
- TensorFlow (ML framework)
- React and associated libraries

## Support

For issues, questions, or contributions:
- Review existing documentation in `frontend/README.md` and `backend/README.md`
- Check troubleshooting sections
- Consult Massive API documentation at https://massive.com/docs
- Review TensorFlow documentation for ML-related questions

## Acknowledgments

- **Market Data**: Provided by Massive API (formerly Polygon.io)
- **Machine Learning**: Powered by TensorFlow and Keras
- **Frontend Framework**: Built with React and Vite
- **Backend Framework**: Developed with Flask
- **Charting Library**: Recharts for data visualization
- **UI Icons**: Lucide React icon set

## Roadmap

Future enhancements under consideration:

- User authentication and portfolio tracking
- Real-time price alerts and notifications
- Additional ML models (Random Forest, GRU)
- Extended technical indicators (RSI, MACD, Bollinger Bands)
- News sentiment analysis integration
- Mobile application (React Native)
- Advanced portfolio optimization tools
- Social features for sharing analysis

---

Built with precision for intelligent investment decisions.

Build by Arlor09
Thank you, Enjoyy.
