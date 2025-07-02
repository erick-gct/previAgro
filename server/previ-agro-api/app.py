# server/previ-agro-api/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from dotenv import load_dotenv
import psycopg2, psycopg2.extras
from urllib.parse import urlparse
import os, bcrypt
import firebase_admin
from firebase_admin import auth as fb_auth, credentials
from services.prediction_service import get_rain_prediction # Importamos nuestra función
import statsmodels.api as sm

cred = credentials.Certificate("./firebase-contra/clave-firebase.json")
firebase_admin.initialize_app(cred)

# 1. Carga de variables de entorno
load_dotenv()
db_url = urlparse(os.getenv("DATABASE_URL"))

# 2. Inicialización de la app
app = Flask(__name__)
CORS(app)



@app.route("/api/registrar", methods=["POST"])
def registrar():
    data = request.get_json(force=True)

    # 3. Validación de campos obligatorios
    required = [
        "nombre", "apellido", "cedula", "email",
        "contrasena", "fecha_nacimiento", "rol",
        "ciudad", "direccion"
    ]
    for campo in required:
        if not data.get(campo):
            return jsonify({ "error": f"El campo '{campo}' es obligatorio" }), 400

    try:
        usuario_fb = fb_auth.create_user(
            email=data["email"],
            password=data["contrasena"],
            display_name=f"{data['nombre']} {data['apellido']}"
        )
        uid = usuario_fb.uid

        # 4. Abrimos conexión a la DB Neon
        conn = psycopg2.connect(
            host=db_url.hostname,
            port=db_url.port or 5432,
            user=db_url.username,
            password=db_url.password,
            dbname=db_url.path.lstrip("/"),
            sslmode="require"
        )

        with conn:
            with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:

                # 5. Validar correo duplicado
                cur.execute("SELECT 1 FROM usuarios WHERE email = %s", (data["email"],))
                if cur.fetchone():
                    return jsonify({ "error": "El correo ya está registrado" }), 409

                # 6. Validar cédula duplicada
                cur.execute("SELECT 1 FROM usuarios WHERE cedula = %s", (data["cedula"],))
                if cur.fetchone():
                    return jsonify({ "error": "La cédula ya está registrada" }), 409

                # 7. Hashear la contraseña
                salt = bcrypt.gensalt()
                pw_hashed = bcrypt.hashpw(
                    data["contrasena"].encode("utf-8"),
                    salt
                ).decode("utf-8")

                # 8. Insertar usuario en la tabla
                cur.execute("""
                    INSERT INTO usuarios (
                        nombre, apellido, cedula, email, contrasena,
                        fecha_nacimiento, rol, ciudad, direccion, fecha_creacion,firebase_uid
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, [
                    data["nombre"],
                    data["apellido"],
                    data["cedula"],
                    data["email"],
                    pw_hashed,
                    data["fecha_nacimiento"],
                    data["rol"],
                    data["ciudad"],
                    data["direccion"],
                    datetime.utcnow(),
                    uid
                ])

        # 9. Éxito
        return jsonify({ "message": "Usuario registrado exitosamente" }), 201

    except Exception as e:
        # 10. En caso de cualquier excepción, devolvemos solo strings
        return jsonify({ "error": str(e) }), 500

    finally:
        # 11. Cerramos la conexión si existe
        try:
            conn.close()
        except:
            pass




@app.route("/api/profile", methods=["GET"])
def profile():
    # 1) Extrae el ID token de los headers
    #id_token = None
    auth_header = request.headers.get("Authorization", "")

    if not auth_header.startswith("Bearer "):
        return jsonify({"error": "No token provided"}), 401

    id_token = auth_header.split("Bearer ")[1]

    try:
        # 2) Verifica el ID token
        decoded = fb_auth.verify_id_token(id_token)
        uid = decoded["uid"]
        email = decoded.get("email")
    except Exception as e:
        return jsonify({ "error":"Token inválido: " + str(e) }), 401

    conn = psycopg2.connect(
      host=db_url.hostname,
      port=db_url.port or 5432,
      user=db_url.username,
      password=db_url.password,
      dbname=db_url.path.lstrip("/"),
      sslmode="require"
  )
    with conn:
      with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
          cur.execute("""
                      SELECT nombre,
                             apellido,
                             cedula,
                             email,
                             fecha_nacimiento,
                             rol,
                             ciudad,
                             direccion,
                             fecha_creacion
                      FROM usuarios
                      WHERE firebase_uid = %s
                      """, (uid,))
          row = cur.fetchone()

    conn.close()

    if not row:
        return jsonify({"error": "Usuario no encontrado"}), 404
    return jsonify(dict(row)), 200


# --- PUT /api/profile: actualiza los datos del usuario ---
@app.route("/api/profile", methods=["PUT"])
def update_profile():
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return jsonify({"error": "No token provided"}), 401
    id_token = auth_header.split("Bearer ")[1]

    try:
        decoded = fb_auth.verify_id_token(id_token)
        uid = decoded["uid"]
        current_email = decoded["email"]
    except Exception as e:
        return jsonify({"error": f"Token inválido: {e}"}), 401

    data = request.get_json(force=True)
    # Campos que permitimos cambiar
    allowed = ["nombre", "apellido", "email", "fecha_nacimiento", "rol", "ciudad", "direccion"]
    updates = {k: data[k] for k in allowed if k in data}

    if not updates:
        return jsonify({"error": "No hay nada que actualizar"}), 400

    conn = psycopg2.connect(
        host=db_url.hostname,
        port=db_url.port or 5432,
        user=db_url.username,
        password=db_url.password,
        dbname=db_url.path.lstrip("/"),
        sslmode="require"
    )
    try:
        with conn:
            with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
                # 1) Validar email duplicado (si cambió)
                new_email = updates.get("email")
                if new_email and new_email != current_email:
                    cur.execute("SELECT 1 FROM usuarios WHERE email = %s AND firebase_uid <> %s",
                                (new_email, uid))
                    if cur.fetchone():
                        return jsonify({"error": "El correo ya está en uso"}), 409

                # 2) Construir SET dinámico
                fragments, vals = [], []
                for col, val in updates.items():
                    fragments.append(f"{col} = %s")
                    vals.append(val)
                # añadimos fecha_actualizacion
                fragments.append("fecha_actualizacion = %s")
                vals.append(datetime.utcnow())
                vals.append(uid)  # para WHERE

                sql = f"UPDATE usuarios SET {', '.join(fragments)} WHERE firebase_uid = %s"
                cur.execute(sql, vals)

        # 3) Actualizar datos en Firebase Auth si cambió email o nombre
        fb_updates = {}
        if "email" in updates:
            fb_updates["email"] = updates["email"]
        if "nombre" in updates or "apellido" in updates:
            nombre = updates.get("nombre", decoded.get("name", ""))
            apellido = updates.get("apellido", "")
            fb_updates["display_name"] = f"{nombre} {apellido}".strip()
        if fb_updates:
            fb_auth.update_user(uid, **fb_updates)

        return jsonify({"message": "Perfil actualizado"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- NUEVA RUTA PARA PREDICCIONES ---
@app.route("/api/predict", methods=["GET"])
def predict():
    """
       Endpoint para obtener predicciones de lluvia.
       Uso: /api/predict?model=prophet&months=6
       """
    # 1. Obtener parámetros de la URL (con valores por defecto)
    model_choice = request.args.get('model', 'prophet').lower()
    try:
        months = int(request.args.get('months', 12))
    except ValueError:
        return jsonify({"error": "El parámetro 'months' debe ser un número entero."}), 400

    # 2. Validar parámetros
    if model_choice not in ['sarima', 'prophet']:
      return jsonify({"error": "Modelo no válido. Elija 'sarima' o 'prophet'."}), 400

    if not (1 <= months <= 24):
        return jsonify({"error": "El número de meses debe estar entre 1 y 24."}), 400

        # 3. Llamar al servicio para obtener la predicción

    try:
        prediction_data = get_rain_prediction(model_choice, months)
        return jsonify(prediction_data)
    except Exception as e:
        # Capturar cualquier error inesperado del modelo
        return jsonify({"error": f"Ocurrió un error al generar la predicción: {e}"}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
