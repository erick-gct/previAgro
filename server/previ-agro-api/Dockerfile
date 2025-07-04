# 1) Base image ligera de Python
FROM python:3.11-slim

# 2) Directório de trabajo en el contenedor
WORKDIR /app

# 3) Copiamos solo los ficheros necesarios
#    - requirements.txt primero para aprovechar cache
COPY requirements.txt .

# 4) Instalamos dependencias sin limpiar cache pip
RUN pip install --no-cache-dir -r requirements.txt

# 5) Copiamos todo el código de tu API
#    (incluye tu services/, app.py, modelos locales, etc.)
COPY . .

# 6) Exponemos el puerto (Railway lo vinculará a $PORT internamente)
EXPOSE 5000

# 7) Comando de arranque con Gunicorn
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5000", "--workers", "2"]
