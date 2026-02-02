"""
Stock Price Prediction Model - Massive API Compatible
Uses LSTM (Long Short-Term Memory) neural network for time series prediction
"""

import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from datetime import datetime, timedelta
import sys
import os

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

class StockPredictor:
    """LSTM-based stock price predictor - Works with Massive API"""
    
    def __init__(self):
        self.model = None
        self.scaler = MinMaxScaler(feature_range=(0, 1))
        self.sequence_length = 30  # Use 30 days of data to predict next day
        
    def prepare_data(self, prices_array, prediction_days=60):
        """
        Prepare data for LSTM model
        
        Parameters:
        - prices_array: Array of closing prices
        - prediction_days: Number of days to use for prediction
        """
        # Reshape prices
        prices = np.array(prices_array).reshape(-1, 1)
        
        # Scale the data
        scaled_data = self.scaler.fit_transform(prices)
        
        # Create sequences
        X, y = [], []
        
        for i in range(prediction_days, len(scaled_data)):
            X.append(scaled_data[i-prediction_days:i, 0])
            y.append(scaled_data[i, 0])
        
        X, y = np.array(X), np.array(y)
        
        # Reshape for LSTM [samples, time steps, features]
        X = np.reshape(X, (X.shape[0], X.shape[1], 1))
        
        return X, y
    
    def build_model(self, input_shape):
        """Build LSTM model"""
        model = Sequential([
            # First LSTM layer
            LSTM(units=20, return_sequences=True, input_shape=input_shape),
            Dropout(0.2),
            
            # Second LSTM layer
            LSTM(units=20, return_sequences=True),
            Dropout(0.2),
            
            # Third LSTM layer
            LSTM(units=20, return_sequences=False),
            Dropout(0.2),
            
            # Output layer
            Dense(units=25),
            Dense(units=1)
        ])
        
        model.compile(optimizer='adam', loss='mean_squared_error')
        return model
    
    def train_model(self, historical_data, epochs=25, batch_size=32):
        """
        Train the model on historical data from Massive API
        
        Parameters:
        - historical_data: List of dict from Massive API with 'close' prices
        - epochs: Number of training epochs
        - batch_size: Batch size for training
        """
        try:
            if not historical_data or len(historical_data) < self.sequence_length + 1:
                return False, "Insufficient data for training. Need at least 61 days."
            
            # Extract closing prices from Massive API format
            closing_prices = [float(item['close']) for item in historical_data]
            
            # Prepare data
            X, y = self.prepare_data(closing_prices, self.sequence_length)
            
            if len(X) < 50:  # Need minimum data for training
                return False, f"Insufficient data after processing. Got {len(X)} samples, need at least 50."
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42, shuffle=False
            )
            
            # Build and train model
            self.model = self.build_model((X_train.shape[1], 1))
            
            # Train with reduced verbosity
            self.model.fit(
                X_train, y_train,
                epochs=epochs,
                batch_size=batch_size,
                validation_data=(X_test, y_test),
                verbose=0
            )
            
            return True, "Model trained successfully"
            
        except Exception as e:
            return False, f"Error training model: {str(e)}"
    
    def predict_future(self, symbol, days=7, fetcher=None):
        """
        Predict future stock prices using Massive API data
        
        Parameters:
        - symbol: Stock symbol
        - days: Number of days to predict (default: 7)
        - fetcher: Massive API fetcher instance
        
        Returns:
        - Dictionary with predictions and confidence
        """
        try:
            if fetcher is None:
                # Import here to avoid circular dependency
                from utils.massive_api import massive_fetcher
                fetcher = massive_fetcher
            
            print(f"Fetching historical data for {symbol}...")
            
            # Get 2 years of historical data for training
            historical_data = fetcher.get_historical_data(symbol, period='2y', interval='1d')
            
            if not historical_data or len(historical_data) < self.sequence_length + 1:
                print(f"Insufficient historical data. Got {len(historical_data) if historical_data else 0} days.")
                return None
            
            print(f"Got {len(historical_data)} days of data. Training model...")
            
            # Train model
            success, message = self.train_model(historical_data, epochs=15)
            
            if not success:
                print(f"Training failed: {message}")
                return None
            
            print("Model trained successfully. Generating predictions...")
            
            # Get last 60 days for prediction
            closing_prices = [float(item['close']) for item in historical_data]
            last_60_days = closing_prices[-self.sequence_length:]
            
            # Scale last 60 days
            last_60_days_scaled = self.scaler.transform(np.array(last_60_days).reshape(-1, 1))
            
            # Predict future prices
            predictions = []
            current_sequence = last_60_days_scaled.reshape(1, self.sequence_length, 1)
            
            for _ in range(days):
                # Predict next day
                predicted_price_scaled = self.model.predict(current_sequence, verbose=0)
                predicted_price = self.scaler.inverse_transform(predicted_price_scaled)[0][0]
                predictions.append(float(predicted_price))
                
                # Update sequence for next prediction
                new_sequence = np.append(current_sequence[0][1:], predicted_price_scaled)
                current_sequence = new_sequence.reshape(1, self.sequence_length, 1)
            
            # Calculate confidence (simplified - based on prediction variance)
            current_price = float(closing_prices[-1])
            avg_prediction = np.mean(predictions[:3])  # Average of next 3 days
            price_diff_percent = abs((avg_prediction - current_price) / current_price * 100)
            
            # Confidence decreases as prediction differs more from current price
            confidence = max(50, min(95, 90 - price_diff_percent * 2))
            
            # Determine trend
            if predictions[0] > current_price * 1.01:
                trend = 'bullish'
            elif predictions[0] < current_price * 0.99:
                trend = 'bearish'
            else:
                trend = 'neutral'
            
            print(f"Predictions generated successfully. Trend: {trend}, Confidence: {confidence:.1f}%")
            
            return {
                'symbol': symbol,
                'currentPrice': round(current_price, 2),
                'predictions': {
                    'tomorrow': round(predictions[0], 2),
                    'nextWeek': round(predictions[-1], 2) if len(predictions) >= 7 else round(predictions[-1], 2),
                    'threeDay': round(np.mean(predictions[:3]), 2),
                },
                'allPredictions': [round(p, 2) for p in predictions],
                'confidence': round(confidence, 1),
                'trend': trend,
                'recommendation': self._get_recommendation(trend, confidence),
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"Error predicting for {symbol}: {str(e)}")
            import traceback
            traceback.print_exc()
            return None
    
    def _get_recommendation(self, trend, confidence):
        """Get investment recommendation based on trend and confidence"""
        if confidence < 60:
            return 'HOLD - Low confidence prediction'
        
        if trend == 'bullish' and confidence >= 75:
            return 'BUY - Strong upward trend expected'
        elif trend == 'bullish':
            return 'CONSIDER BUY - Moderate upward trend'
        elif trend == 'bearish' and confidence >= 75:
            return 'SELL - Strong downward trend expected'
        elif trend == 'bearish':
            return 'CONSIDER SELL - Moderate downward trend'
        else:
            return 'HOLD - Stable price expected'

# Create global predictor instance
stock_predictor = StockPredictor()
