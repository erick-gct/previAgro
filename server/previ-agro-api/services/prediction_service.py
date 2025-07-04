import joblib
import os
import json
import pandas as pd
from prophet.serialize import model_from_json
import requests

# --- Paths y URLs ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOCAL_SARIMA_PATH = os.path.normpath(os.path.join(BASE_DIR, '..', 'models', 'sarima_rain_model.pkl'))
PROPHE_MODEL_PATH = os.path.normpath(os.path.join(BASE_DIR, '..', 'models', 'prophet_rain_model.json'))

# URL pública al modelo SARIMA (GitHub Releases)
SARIMA_MODEL_URL = os.getenv("SARIMA_MODEL_URL", "").strip()
# Ruta temporal donde guardar el modelo descargado
TMP_SARIMA_PATH = "/tmp/sarima_rain_model.pkl"


def _ensure_sarima_model():
    """
    Garantiza que el modelo SARIMA esté disponible localmente.
    Si existe la env var SARIMA_MODEL_URL, descarga desde ahí;
    si no, usa el archivo local en models/.
    """
    if SARIMA_MODEL_URL:
        # Descarga solo si no existe en /tmp
        if not os.path.exists(TMP_SARIMA_PATH):
            resp = requests.get(SARIMA_MODEL_URL, stream=True)
            resp.raise_for_status()
            with open(TMP_SARIMA_PATH, "wb") as f:
                for chunk in resp.iter_content(chunk_size=8192):
                    f.write(chunk)
        return TMP_SARIMA_PATH
    # Fallback local
    if os.path.exists(LOCAL_SARIMA_PATH):
        return LOCAL_SARIMA_PATH
    raise FileNotFoundError("No se encontró el modelo SARIMA en local ni la variable SARIMA_MODEL_URL")

# --- Carga de los modelos una sola vez ---
print("Cargando modelos de predicción...")
# SARIMA
sarima_file = _ensure_sarima_model()
SARIMA_MODEL = joblib.load(sarima_file)
# Prophet
with open(PROPHE_MODEL_PATH, 'r') as fin:
    PROPHET_MODEL = model_from_json(json.load(fin))
print("Modelos cargados exitosamente.")


def get_rain_prediction(model_type: str, months_to_predict: int) -> list:
    """
    Genera una predicción de lluvia usando el modelo especificado.

    Args:
        model_type (str): 'sarima' o 'prophet'.
        months_to_predict (int): Número de meses a predecir.
    Returns:
        list de {'date': 'YYYY-MM-DD', 'value': float}
    """
    predictions = []

    if model_type == 'sarima':
        # Predicción SARIMA
        forecast = SARIMA_MODEL.get_forecast(steps=months_to_predict)
        vals = forecast.predicted_mean.values
        # Generar fechas futuras
        last_date = SARIMA_MODEL.model.data.row_labels[-1]
        future_dates = pd.date_range(
            start=last_date + pd.DateOffset(months=1),
            periods=months_to_predict,
            freq='MS'
        )
        for date, value in zip(future_dates, vals):
            predictions.append({
                "date": date.strftime('%Y-%m-%d'),
                "value": round(float(value), 2)
            })

    elif model_type == 'prophet':
        # Predicción Prophet
        future = PROPHET_MODEL.make_future_dataframe(periods=months_to_predict, freq='MS')
        forecast = PROPHET_MODEL.predict(future)
        df = forecast[['ds', 'yhat']].tail(months_to_predict)
        for _, row in df.iterrows():
            predictions.append({
                "date": row['ds'].strftime('%Y-%m-%d'),
                "value": round(float(row['yhat']), 2)
            })
    else:
        raise ValueError("Modelo no soportado: debe ser 'sarima' o 'prophet'")

    return predictions
