"""
Stock Data Utility using Massive API (formerly Polygon.io)
Optimized for FREE TIER - 5 API calls/minute
"""

import requests
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import time

load_dotenv()

class MassiveStockFetcher:
    """Fetch stock data from Massive API """
    
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv('MASSIVE_API_KEY')
        self.base_url = 'https://api.polygon.io'
        
        # Top 50 Global Stocks
        self.POPULAR_STOCKS = {
            # US Tech Giants
            'AAPL': 'Apple Inc.',
            'MSFT': 'Microsoft Corporation',
            'GOOGL': 'Alphabet Inc.',
            'AMZN': 'Amazon.com Inc.',
            'NVDA': 'NVIDIA Corporation',
            'META': 'Meta Platforms Inc.',
            'TSLA': 'Tesla Inc.',
            
            # US Tech
            'AMD': 'Advanced Micro Devices',
            'INTC': 'Intel Corporation',
            'ORCL': 'Oracle Corporation',
            'IBM': 'IBM Corporation',
            'CSCO': 'Cisco Systems',
            'ADBE': 'Adobe Inc.',
            'CRM': 'Salesforce Inc.',
            'QCOM': 'Qualcomm Inc.',
            'TXN': 'Texas Instruments',
            'AVGO': 'Broadcom Inc.',
            'NOW': 'ServiceNow Inc.',
            'NFLX': 'Netflix Inc.',
            'UBER': 'Uber Technologies',
            
            # Financial Services
            'V': 'Visa Inc.',
            'MA': 'Mastercard Inc.',
            'JPM': 'JPMorgan Chase',
            'BAC': 'Bank of America',
            'WFC': 'Wells Fargo',
            'GS': 'Goldman Sachs',
            'MS': 'Morgan Stanley',
            'C': 'Citigroup',
            
            # Consumer & Retail
            'WMT': 'Walmart Inc.',
            'HD': 'Home Depot',
            'MCD': 'McDonald\'s Corp',
            'NKE': 'Nike Inc.',
            'SBUX': 'Starbucks Corp',
            'DIS': 'Walt Disney Co',
            
            # Healthcare & Pharma
            'JNJ': 'Johnson & Johnson',
            'UNH': 'UnitedHealth Group',
            'PFE': 'Pfizer Inc.',
            'ABBV': 'AbbVie Inc.',
            'TMO': 'Thermo Fisher Scientific',
            'LLY': 'Eli Lilly',
            
            # Industrial & Energy
            'XOM': 'Exxon Mobil',
            'CVX': 'Chevron Corp',
            'BA': 'Boeing Co',
            'CAT': 'Caterpillar Inc.',
            'GE': 'General Electric',
            
            # Telecom & Media
            'T': 'AT&T Inc.',
            'VZ': 'Verizon Communications',
            'CMCSA': 'Comcast Corp'
        }
    
    def _make_request(self, endpoint, params=None):
        """Make request to Massive API with rate limiting"""
        if not self.api_key:
            raise ValueError("MASSIVE_API_KEY not found. Please set it in .env file")
        
        if params is None:
            params = {}
        
        params['apiKey'] = self.api_key
        
        try:
            response = requests.get(f"{self.base_url}{endpoint}", params=params, timeout=15)
            
            # Handle rate limiting
            if response.status_code == 429:
                print("Rate limit hit. Waiting 15 seconds...")
                time.sleep(15)
                response = requests.get(f"{self.base_url}{endpoint}", params=params, timeout=15)
            
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error making request to {endpoint}: {str(e)}")
            if hasattr(response, 'text'):
                print(f"Response: {response.text}")
            return None
    
    def get_all_stocks(self):
        """Get list of all available stocks"""
        return [
            {
                'symbol': symbol,
                'name': name
            }
            for symbol, name in self.POPULAR_STOCKS.items()
        ]
    
    def get_current_price(self, symbol):
        """
        Get current price and details for a stock
        Uses Previous Close API (works on free tier)
        """
        try:
            # Use previous close endpoint (more reliable on free tier)
            endpoint = f"/v2/aggs/ticker/{symbol}/prev"
            data = self._make_request(endpoint)
            
            # Free tier returns "DELAYED" status which is OK for our use case
            if not data or data.get('status') not in ['OK', 'DELAYED']:
                print(f"API Error for {symbol}: {data}")
                return None
            
            results = data.get('results', [])
            if not results or len(results) == 0:
                print(f"No results for {symbol}")
                return None
            
            result = results[0]
            
            current_price = result.get('c', 0)  # Close price
            open_price = result.get('o', 0)
            
            # Calculate change from open to close
            change = current_price - open_price if current_price and open_price else 0
            change_percent = (change / open_price * 100) if open_price != 0 else 0
            
            return {
                'symbol': symbol,
                'name': self.POPULAR_STOCKS.get(symbol, 'Unknown'),
                'currentPrice': round(current_price, 2) if current_price else 0,
                'previousClose': round(open_price, 2),
                'change': round(change, 2),
                'changePercent': round(change_percent, 2),
                'volume': result.get('v', 0),
                'marketCap': 0,
                'dayHigh': round(result.get('h', 0), 2),
                'dayLow': round(result.get('l', 0), 2),
                'fiftyTwoWeekHigh': 0,
                'fiftyTwoWeekLow': 0,
            }
        except Exception as e:
            print(f"Error fetching data for {symbol}: {str(e)}")
            return None
    
    def get_historical_data(self, symbol, period='1y', interval='1d'):
        """
        Get historical stock data - FREE TIER COMPATIBLE
        Uses Aggregates API with adjusted parameters for free tier
        """
        try:
            # Convert period to date range
            end_date = datetime.now()
            
            # FREE TIER: Limit to 2 years max for better performance
            period_map = {
                '1d': 1,
                '5d': 5,
                '1mo': 30,
                '3mo': 90,
                '6mo': 180,
                '1y': 365,
                '2y': 730,
                'ALL': 730,  # Max 2 years on free tier
            }
            
            days = period_map.get(period, 365)
            start_date = end_date - timedelta(days=days)
            
            # For free tier, use daily data only (more reliable)
            if interval not in ['1d', '1wk', '1mo']:
                interval = '1d'
            
            # Convert interval to Massive format
            interval_map = {
                '1d': ('1', 'day'),
                '1wk': ('1', 'week'),
                '1mo': ('1', 'month'),
            }
            
            multiplier, timespan = interval_map.get(interval, ('1', 'day'))
            
            # Format dates for API
            from_date = start_date.strftime('%Y-%m-%d')
            to_date = end_date.strftime('%Y-%m-%d')
            
            # Make API request
            endpoint = f"/v2/aggs/ticker/{symbol}/range/{multiplier}/{timespan}/{from_date}/{to_date}"
            params = {
                'adjusted': 'true',
                'sort': 'asc',
                'limit': 5000  
            }
            
            print(f"Requesting: {endpoint}")
            print(f"Params: {params}")
            
            data = self._make_request(endpoint, params)
            
            if not data:
                print(f"No data returned from API for {symbol}")
                return None
            
            print(f"API Response status: {data.get('status')}")
            print(f"Results count: {data.get('resultsCount', 0)}")
            
            # returns "DELAYED" status but data is still valid
            status = data.get('status')
            if status not in ['OK', 'DELAYED']:
                print(f"API returned error status: {data}")
                return None
            
            results = data.get('results', [])
            
            if not results or len(results) == 0:
                print(f"No results in response for {symbol}")
                return None
            
            # Convert to standardized format
            historical_data = []
            for item in results:
                timestamp = item.get('t', 0)
                if timestamp:
                    date = datetime.fromtimestamp(timestamp / 1000)
                    
                    historical_data.append({
                        'date': date.strftime('%Y-%m-%d %H:%M:%S'),
                        'open': round(item.get('o', 0), 2),
                        'high': round(item.get('h', 0), 2),
                        'low': round(item.get('l', 0), 2),
                        'close': round(item.get('c', 0), 2),
                        'volume': int(item.get('v', 0))
                    })
            
            print(f"Processed {len(historical_data)} data points")
            return historical_data
            
        except Exception as e:
            print(f"Error fetching historical data for {symbol}: {str(e)}")
            import traceback
            traceback.print_exc()
            return None
    
    def get_intraday_data(self, symbol):
        """
        Get today's intraday data
        Note: Intraday data requires paid plan on Massive
        Returns previous day data on free tier
        """
        try:
            # use previous close instead of intraday
            endpoint = f"/v2/aggs/ticker/{symbol}/prev"
            data = self._make_request(endpoint)
            
            # returns DELAYED status
            if not data or data.get('status') not in ['OK', 'DELAYED']:
                return None
            
            results = data.get('results', [])
            if not results:
                return None
            
            result = results[0]
            
            # Return single data point as "today's" data
            return [{
                'time': 'Previous Close',
                'price': round(result.get('c', 0), 2),
                'volume': int(result.get('v', 0))
            }]
            
        except Exception as e:
            print(f"Error fetching intraday data for {symbol}: {str(e)}")
            return None
    
    def get_multiple_stocks_current(self, symbols):
        """Get current prices for multiple stocks with rate limiting"""
        results = []
        for i, symbol in enumerate(symbols):
            # Rate limiting for free tier (5 calls/min) fuck
            if i > 0 and i % 4 == 0:
                print(f"Rate limiting: waiting 15 seconds...")
                time.sleep(15)
            
            data = self.get_current_price(symbol)
            if data:
                results.append(data)
        return results

# Create global instance
massive_fetcher = MassiveStockFetcher()
