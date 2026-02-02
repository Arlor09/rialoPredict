# RialoPredict Frontend

A modern React-based web application for real-time stock price prediction and analysis.

## Overview

RialoPredict Frontend is a responsive single-page application that provides an intuitive interface for viewing stock market data, analyzing price trends, and generating AI-powered predictions. Built with React and Vite, it offers a seamless user experience with real-time data visualization and interactive charts.

## Features

- **Landing Page**: Modern, responsive design with hero section and company information
- **Interactive Dashboard**: Real-time stock data display with 50+ top global stocks
- **Price Charts**: Historical price visualization with multiple timeframe options (1W, 1M, 3M, 6M, 1Y, ALL)
- **AI Predictions**: Machine learning-based price forecasting with confidence scores
- **Stock Search**: Quick search and filtering across available stocks
- **Responsive Design**: Mobile-first approach with full tablet and desktop support

## Technology Stack

- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.0
- **Routing**: React Router DOM 6.20.0
- **HTTP Client**: Axios 1.6.0
- **Charts**: Recharts 2.10.0
- **Icons**: Lucide React 0.263.1
- **Styling**: CSS3 with custom properties

## Project Structure

```
stock-prediction-web/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, fonts, etc.
│   ├── components/        # Reusable components
│   │   ├── dashboard/     # Dashboard-specific components
│   │   │   ├── StockList.jsx
│   │   │   ├── StockChart.jsx
│   │   │   └── PredictionCard.jsx
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── Architecture.jsx
│   │   ├── Partners.jsx
│   │   └── Footer.jsx
│   ├── pages/             # Page components
│   │   ├── LandingPage.jsx
│   │   └── Dashboard.jsx
│   ├── styles/            # CSS files
│   │   ├── global.css
│   │   ├── Dashboard.css
│   │   └── ...
│   ├── utils/             # Utility functions
│   │   └── api.js         # API client
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── index.html
├── vite.config.js
└── package.json
```

## Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher
- Backend API running on http://localhost:5000

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd stock-prediction-web
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment (optional):
   - Default API endpoint: http://localhost:5000/api
   - To change, update `API_BASE_URL` in `src/utils/api.js`

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000

### Development Features

- Hot Module Replacement (HMR) for instant updates
- Fast refresh for React components
- Source maps for debugging
- ESLint integration for code quality

## Building for Production

Create an optimized production build:
```bash
npm run build
```

The build output will be in the `dist/` directory.

Preview the production build locally:
```bash
npm run preview
```

## API Integration

The frontend communicates with the backend through REST API endpoints:

### Stock Data Endpoints

- `GET /api/stocks` - Retrieve list of all available stocks
- `GET /api/stocks/{symbol}` - Get detailed information for a specific stock
- `GET /api/stocks/{symbol}/history` - Fetch historical price data
- `POST /api/predict/{symbol}` - Generate AI-powered price predictions

### API Client Configuration

Located in `src/utils/api.js`, the API client provides:

- Centralized endpoint management
- Request/response interceptors
- Error handling
- Timeout configuration (30 seconds for ML predictions)

## Component Overview

### Dashboard Components

**StockList**: Displays available stocks with search functionality
- Real-time price updates
- Alphabetical sorting
- Quick search filter

**StockChart**: Interactive price history visualization
- Multiple timeframe selection
- Hover tooltips with detailed information
- Prediction overlay when available

**PredictionCard**: AI prediction interface
- Customizable prediction periods (1 day to 1 month)
- Confidence scoring
- Trend analysis (bullish/bearish/neutral)
- Investment recommendations

### Landing Page Components

**Hero**: Main landing section with call-to-action
**Architecture**: System architecture visualization
**Partners**: Partner companies showcase
**Footer**: Site navigation and information

## Styling Approach

The application uses a custom CSS architecture:

- **CSS Variables**: Centralized theme management
- **Component-scoped CSS**: Each component has its own stylesheet
- **Mobile-first**: Responsive breakpoints at 768px and 1200px
- **Custom animations**: Smooth transitions and hover effects

### Color Scheme

```css
--primary-color: #d4a5a5;    /* Rose/Pink */
--dark-bg: #0a0a0a;          /* Dark background */
--light-bg: #f5f5dc;         /* Beige */
--text-primary: #ffffff;     /* White */
--text-secondary: #cccccc;   /* Light gray */
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization

- Code splitting by route
- Lazy loading for dashboard components
- Optimized bundle size with Vite
- Minified CSS and JavaScript in production
- Image optimization

## Troubleshooting

### Common Issues

**Issue**: Chart not displaying
**Solution**: Ensure backend is running and returning valid data. Check browser console for errors.

**Issue**: Prediction fails
**Solution**: Verify backend is accessible. Predictions require 30-60 seconds to process.

**Issue**: Port 3000 already in use
**Solution**: Change port in `vite.config.js`:
```javascript
export default defineConfig({
  server: {
    port: 3001
  }
})
```

### Debug Mode

Enable detailed logging:
```javascript
// In src/utils/api.js
axios.interceptors.request.use(request => {
  console.log('Starting Request', request);
  return request;
});
```

## Contributing

This project follows standard React development practices. When contributing:

1. Follow the existing code structure
2. Maintain component modularity
3. Write descriptive commit messages
4. Test on multiple browsers
5. Ensure responsive design works

## License

This project is for educational purposes. Stock predictions should not be used as sole financial advice.

## Acknowledgments

- Built with React and Vite
- Charts powered by Recharts
- Icons from Lucide React
- Inspired by modern fintech interfaces