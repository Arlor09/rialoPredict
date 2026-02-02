"""
Flask API Routes for Stock Prediction Backend
Using Massive API (Polygon.io) ONLY
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.massive_api import massive_fetcher
from models.predictor import stock_predictor
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# HEALTH CHECK

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Stock Prediction API is running',
        'apiMode': 'Massive API (Polygon.io)',
        'freeTier': True
    }), 200

# STOCK DATA ENDPOINTS

@app.route('/api/stocks', methods=['GET'])
def get_all_stocks():
    """Get list of all available stocks"""
    try:
        stocks = massive_fetcher.get_all_stocks()
        return jsonify({
            'success': True,
            'count': len(stocks),
            'stocks': stocks
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/stocks/<symbol>', methods=['GET'])
def get_stock_detail(symbol):
    """Get detailed information for a specific stock"""
    try:
        symbol = symbol.upper()
        data = massive_fetcher.get_current_price(symbol)
        
        if not data:
            return jsonify({
                'success': False,
                'error': f'Stock {symbol} not found or API error'
            }), 404
        
        return jsonify({
            'success': True,
            'data': data
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/stocks/<symbol>/history', methods=['GET'])
def get_stock_history(symbol):
    """Get historical data for a stock"""
    try:
        symbol = symbol.upper()
        
        # Get query parameters
        period = request.args.get('period', '1y')  # Default: 1 year
        interval = request.args.get('interval', '1d')  # Default: 1 day
        
        print(f"Fetching history for {symbol}: period={period}, interval={interval}")
        
        data = massive_fetcher.get_historical_data(symbol, period, interval)
        
        if not data or len(data) == 0:
            return jsonify({
                'success': False,
                'error': f'No historical data found for {symbol}. This might be due to: 1) Free tier limitations, 2) Invalid symbol, or 3) Weekend/market closed'
            }), 404
        
        return jsonify({
            'success': True,
            'symbol': symbol,
            'period': period,
            'interval': interval,
            'count': len(data),
            'data': data
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/stocks/<symbol>/intraday', methods=['GET'])
def get_stock_intraday(symbol):
    """Get today's intraday data (Limited on free tier)"""
    try:
        symbol = symbol.upper()
        data = massive_fetcher.get_intraday_data(symbol)
        
        if not data:
            return jsonify({
                'success': False,
                'error': f'Intraday data not available on free tier for {symbol}'
            }), 404
        
        return jsonify({
            'success': True,
            'symbol': symbol,
            'count': len(data),
            'data': data,
            'note': 'Free tier shows previous close only. Upgrade for real-time intraday data.'
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/stocks/batch', methods=['POST'])
def get_multiple_stocks():
    """Get current prices for multiple stocks"""
    try:
        data = request.get_json()
        symbols = data.get('symbols', [])
        
        if not symbols:
            return jsonify({
                'success': False,
                'error': 'No symbols provided'
            }), 400
        
        # Convert to uppercase
        symbols = [s.upper() for s in symbols]
        
        results = massive_fetcher.get_multiple_stocks_current(symbols)
        
        return jsonify({
            'success': True,
            'count': len(results),
            'data': results
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# PREDICTION ENDPOINTS

@app.route('/api/predict/<symbol>', methods=['POST'])
def predict_stock(symbol):
    """
    Predict future stock prices using ML model
    
    Request body (optional):
    {
        "days": 7  // Number of days to predict (default: 7)
    }
    """
    try:
        symbol = symbol.upper()
        
        # Get parameters from request body
        data = request.get_json() or {}
        days = data.get('days', 7)
        
        # Validate days parameter
        if days < 1 or days > 30:
            return jsonify({
                'success': False,
                'error': 'Days parameter must be between 1 and 30'
            }), 400
        
        # Make prediction
        prediction = stock_predictor.predict_future(symbol, days)
        
        if not prediction:
            return jsonify({
                'success': False,
                'error': f'Unable to generate prediction for {symbol}. This may be due to insufficient historical data.'
            }), 500
        
        return jsonify({
            'success': True,
            'data': prediction
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/predict/batch', methods=['POST'])
def predict_multiple_stocks():
    """
    Predict multiple stocks at once
    
    Request body:
    {
        "symbols": ["AAPL", "NVDA", "GOOGL"],
        "days": 7
    }
    """
    try:
        data = request.get_json()
        symbols = data.get('symbols', [])
        days = data.get('days', 7)
        
        if not symbols:
            return jsonify({
                'success': False,
                'error': 'No symbols provided'
            }), 400
        
        # Convert to uppercase
        symbols = [s.upper() for s in symbols]
        
        # Generate predictions for each stock
        predictions = []
        for symbol in symbols:
            try:
                prediction = stock_predictor.predict_future(symbol, days)
                if prediction:
                    predictions.append(prediction)
            except Exception as e:
                print(f"Error predicting {symbol}: {str(e)}")
                continue
        
        return jsonify({
            'success': True,
            'count': len(predictions),
            'data': predictions
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# ERROR HANDLERS

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500

# RUN APP

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'True') == 'True'
    
    print(f"""
    ╔══════════════════════════════════════════════════╗
    ║   Rialo Prediction API Server - Arlor09          ║
    ║   Running on http://localhost:{port}              ║
    ║   API: Massive API (Polygon.io)                  ║
    ║   Stocks: 50 Top Global Stocks                   ║
    ╚══════════════════════════════════════════════════╝
    
     Available Endpoints:
    - GET  /api/health
    - GET  /api/stocks                    (Get all 50 stocks)
    - GET  /api/stocks/<symbol>           (Get current price)
    - GET  /api/stocks/<symbol>/history   (Get historical data)
    - GET  /api/stocks/<symbol>/intraday  (Get today's data)
    - POST /api/stocks/batch              (Get multiple stocks)
    - POST /api/predict/<symbol>          (AI Prediction)
    - POST /api/predict/batch             (Batch predictions)
    
     FREE TIER NOTES:
    - Rate limit: 5 API calls per minute
    - Historical data: Up to 2 years
    - Real-time quotes: 15-min delayed
    - Intraday data: Previous close only
    
     Enjoy using the Rialo Prediction API! - Arlor09
    """)
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug
    )
