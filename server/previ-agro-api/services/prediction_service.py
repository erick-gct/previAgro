import joblib
import os
import json
import pandas as pd
from prophet.serialize import model_from_json


# Obtener el path absoluto a la carpeta actual (services/)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Ruta absoluta al archivo del modelo SARIMA
sarima_path = os.path.normpath(os.path.join(BASE_DIR, '..', 'models', 'sarima_rain_model.pkl'))
prophet_path = os.path.normpath(os.path.join(BASE_DIR, '..', 'models', 'prophet_rain_model.json'))



# --- CARGAR LOS MODELOS UNA SOLA VEZ ---
# Se cargan al iniciar la app para no leer los archivos en cada petición.
print("Cargando modelos de predicción...")
SARIMA_MODEL = joblib.load(sarima_path)
with open(prophet_path, 'r') as fin:
    PROPHET_MODEL = model_from_json(json.load(fin))
print("Modelos cargados exitosamente.")


def get_rain_prediction(model_type: str, months_to_predict: int) -> list:
    """
    Genera una predicción de lluvia usando el modelo especificado.

    Args:
        model_type (str): El tipo de modelo a usar ('sarima' o 'prophet').
        months_to_predict (int): El número de meses a predecir.

    Returns:
        list: Una lista de diccionarios con la fecha y el valor predicho.
    """
    predictions = []

    if model_type == 'sarima':
        # Generar predicción con SARIMA
        forecast = SARIMA_MODEL.get_forecast(steps=months_to_predict)
        predicted_values = forecast.predicted_mean.values

        # --- INICIO DEL PARCHE PARA EL ERROR 'strftime' ---
        # Como el modelo devuelve un índice numérico, construiremos las fechas del futuro manualmente.

        # 2. Obtener la última fecha de los datos con los que el modelo fue entrenado.
        last_date = SARIMA_MODEL.model.data.row_labels[-1]

        # 3. Crear un rango de fechas futuras, comenzando un mes después de la última fecha.
        future_dates = pd.date_range(
            start=last_date + pd.DateOffset(months=1),
            periods=months_to_predict,
            freq='MS'  # 'MS' para inicio de mes, que es como entrenamos.
        )

        # 4. Unir nuestras fechas generadas con los valores predichos.
        for date, value in zip(future_dates, predicted_values):
            predictions.append({
                "date": date.strftime('%Y-%m-%d'), # Ahora 'date' es un objeto de fecha garantizado.
                "value": round(value, 2)
            })
        # --- FIN DEL PARCHE ---

    elif model_type == 'prophet':
        # Generar predicción con Prophet
        future = PROPHET_MODEL.make_future_dataframe(periods=months_to_predict, freq='MS')
        forecast = PROPHET_MODEL.predict(future)

        # Extraer solo las fechas futuras y sus predicciones ('yhat')
        predictions_df = forecast[['ds', 'yhat']].tail(months_to_predict)

        # Formatear la salida
        for _, row in predictions_df.iterrows():
            predictions.append({
                "date": row['ds'].strftime('%Y-%m-%d'),
                "value": round(row['yhat'], 2)
            })

    return predictions
