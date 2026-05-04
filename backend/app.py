from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.metrics import mean_absolute_percentage_error
from prophet import Prophet
import logging

# Mute prophet logging to keep console clean
logging.getLogger('prophet').setLevel(logging.ERROR)
logging.getLogger('cmdstanpy').setLevel(logging.ERROR)

# CONFIG + DB + AUTH
from config import Config
from models import db
from auth import auth_bp

from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)

# INIT EXTENSIONS
db.init_app(app)
jwt = JWTManager(app)

# REGISTER BLUEPRINT
app.register_blueprint(auth_bp, url_prefix="/auth")

# =========================
# 📊 DATA
# =========================
supported_commodities = {
    "Gold (Troy Ounce)": "GC=F",
    "Silver (Troy Ounce)": "SI=F",
    "MCX Crude": "CL=F"
}

def get_live_rate(currency):
    if currency == "USD":
        return 1.0
    try:
        # yfinance symbol for USD/Target is "Target=X" (e.g., INR=X)
        ticker = yf.Ticker(f"{currency}=X")
        hist = ticker.history(period="1d")
        if not hist.empty:
            return float(hist['Close'].iloc[-1])
    except Exception as e:
        print(f"Error fetching live rate for {currency}: {e}")
    
    # Fallback to recent approximate values if API fails
    fallbacks = {"INR": 94.84, "EUR": 0.85, "GBP": 0.74}
    return fallbacks.get(currency, 1.0)

# =========================
# 🔒 PROTECTED PREDICT
# =========================
@app.route("/predict", methods=["POST"])
@jwt_required()
def predict():
    user_id = int(get_jwt_identity())

    data = request.json
    commodity = data.get("commodity")
    currency = data.get("currency")

    if commodity not in supported_commodities:
        return jsonify({"error": "Invalid commodity"}), 400

    symbol = supported_commodities[commodity]
    rate = get_live_rate(currency)

    try:
        # Download historical data
        df = yf.download(symbol, period="2y", interval="1d") # Increased period for better Prophet learning

        if df.empty:
            return jsonify({"error": "No market data available"}), 400

        # Flatten multi-index columns (common in newer yfinance versions)
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = [col[0] if col[1] == '' else col[0] for col in df.columns.values]

        # Prepare data for Prophet (requires 'ds' and 'y' columns)
        df = df.reset_index()
        prophet_df = pd.DataFrame()
        prophet_df['ds'] = df['Date'].dt.tz_localize(None)
        prophet_df['y'] = df['Close']
        
        # Ensure y is a 1D series (yfinance sometimes returns a DataFrame)
        if len(prophet_df['y'].shape) > 1:
            prophet_df['y'] = prophet_df['y'].iloc[:, 0]

        # ── ACCURACY VALIDATION (Backtesting) ──
        # Split: Train on everything except last 10 days
        train_df = prophet_df.iloc[:-10]
        test_df = prophet_df.iloc[-10:]
        
        val_model = Prophet(daily_seasonality=True, yearly_seasonality=True)
        val_model.fit(train_df)
        
        future_val = val_model.make_future_dataframe(periods=10)
        forecast_val = val_model.predict(future_val)
        
        y_actual = test_df['y'].values
        y_pred = forecast_val.iloc[-10:]['yhat'].values
        
        mape = mean_absolute_percentage_error(y_actual, y_pred)
        accuracy = max(0, (1 - mape) * 100)

        # ── FINAL FORECAST (On All Data) ──
        model = Prophet(daily_seasonality=True, yearly_seasonality=True)
        model.fit(prophet_df)
        
        future = model.make_future_dataframe(periods=30)
        forecast_results = model.predict(future)
        
        # Extract the next 30 days of forecast (excluding historical days)
        forecast_period = forecast_results.iloc[-30:]
        forecast_values = forecast_period['yhat'].values

        # Convert to target currency
        converted = (forecast_values * rate).tolist()

        return jsonify({
            "user_id": user_id,
            "accuracy": round(accuracy, 2),
            "forecast": [round(v, 2) for v in converted] # Full 30 days rounded
        })

    except Exception as e:
        print(f"Prediction Error: {e}")
        return jsonify({"error": "Market analysis engine encountered an error."}), 500


# =========================
# 🚀 RUN
# =========================
if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)