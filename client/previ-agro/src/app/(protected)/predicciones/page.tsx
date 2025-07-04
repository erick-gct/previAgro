"use client";

import { useState } from "react";
import { auth } from "../../../lib/firebase";
import { Activity, BarChart2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from "../../../lib/api";

// Un componente reutilizable para mostrar los resultados
type Prediction = {
  date: string;
  value: number;
};

type PredictionTableProps = {
  data: Prediction[];
};

const PredictionTable = ({ data }: PredictionTableProps) => {
  if (data.length === 0) return null;
  return (
    <table className="w-full text-sm text-left text-gray-600 border">
      <thead className="text-xs text-gray-700 uppercase bg-gray-100">
        <tr>
          <th className="px-4 py-2">Fecha</th>
          <th className="px-4 py-2">Precipitación Estimada (mm/día)</th>
        </tr>
      </thead>
      <tbody>
        {data.map((pred) => (
          <tr key={pred.date} className="bg-white border-b hover:bg-gray-50">
            <td className="px-4 py-2">{pred.date}</td>
            <td className="px-4 py-2">{pred.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default function Predictor() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentModel, setCurrentModel] = useState("");

  // Función que llama a la API. Ahora acepta el tipo de modelo como argumento.
  const fetchPredictions = async (modelType) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentModel(`- ${modelType.toUpperCase()}`);

      const response = await fetch(
        `${API_URL}/api/predict?model=${modelType}&months=12`
      );
      if (!response.ok) {
        toast.error("La respuesta de la red no fue exitosa", {position: "top-right"});
        //throw new Error("La respuesta de la red no fue exitosa");
      }
      const data = await response.json();
      setPredictions(data);
    } catch (err) {
      toast.error(err.message, {position: "top-right"});
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-200 min-h-screen flex items-center justify-center">
        {/* Contenedor del toast */}
        <ToastContainer />
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl w-full">
        {/* Título */}
        <h1 className="text-green-600 text-2xl font-bold mb-4 text-center">
          Modelo de predicciones para los próximos 12 meses
        </h1>

        {/* Párrafo */}
        <p className="text-gray-700 mb-8 text-justify">
          Cuando hablamos de predecir el futuro basándonos en datos históricos,
          especialmente aquellos que cambian con el tiempo, nos adentramos en el
          campo de las series temporales. Para hacer estas predicciones, existen
          herramientas poderosas como SARIMA y Prophet. Nuestro sistema usa
          información de las últimas precipitaciones por meses de acuerdo a los
          últimos años (a partir de 2020) con el que hemos generado la siguiente
          información para usted:
        </p>

        {/* Tarjetas flotantes debajo del párrafo */}
        <div className="flex justify-between gap-4 mb-8">
          <div className="bg-white shadow-lg border-gray-600 rounded-xl p-6 flex items-start gap-3 w-1/2">
            <Activity className="w-60 h-10 text-green-600 mr-2" />
            <div>
              <h2 className="font-semibold text-gray-900 mb-1">
                Modelo Prophet
              </h2>
              <p className="text-sm text-gray-600 text-justify">
                {" "}
                Es un modelo diseñado para ser más flexible y amigable con datos
                del mundo real, que a menudo son "ruidosos", tienen vacíos,
                valores atípicos, cambios bruscos en la tendencia o eventos
                externos que los afectan, como días festivos o promociones. Este
                modelo descompone la serie temporal en componentes de tendencia,
                estacionalidad (diaria, semanal, anual).
              </p>
            </div>
          </div>
          <div className="bg-white shadow-xl rounded-xl p-6 flex items-start gap-3 w-1/2 border-black-600">
            <BarChart2 className="w-60 h-10 text-green-600" />
            <div>
              <h2 className="font-semibold text-gray-800 mb-1">
                Modelo SARIMA
              </h2>
              <p className="text-sm text-gray-600 text-justify">
                {" "}
                Es un modelo robusto y más tradicional, ideal para datos de
                series temporales que no solo muestran tendencias generales,
                sino también patrones estacionales claros y repetitivos. Este
                modelo analiza cómo los valores pasados, los errores de
                predicción anteriores y las diferencias en los datos influyen en
                el valor actual.
              </p>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-center gap-7">
          <button
            onClick={() => fetchPredictions("prophet")}
            disabled={loading}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition cursor-pointer"
          >
            <Activity className="w-5 h-5 mr-2" />
            Predicción con Prophet
          </button>
          <button
            onClick={() => fetchPredictions("sarima")}
            disabled={loading}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition cursor-pointer"
          >
            <BarChart2 className="w-5 h-5 mr-2" />
            Predicción con SARIMA
          </button>
        </div>
        {/* --- ZONA DE RESULTADOS (DENTRO del contenedor blanco) --- */}
        {loading && (
          <p className="mt-6 text-gray-700 text-center">
            Cargando predicciones...
          </p>
        )}
   

        {predictions.length > 0 && (
          <div className="mt-8 py-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Resultados - {currentModel}
            </h2>

            {/* Gráfico */}
            <div className="py-5" style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={predictions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#22c55e"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="overflow-x-auto py-10">
              <PredictionTable data={predictions} />
            </div>
          </div>
        )}

        {/* --- Tabla informativa de rangos de precipitación --- */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
            Tabla de rangos de niveles de precipitación
          </h3>
          <table className="w-full text-sm text-left text-gray-600 border">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="px-4 py-2">Rango (mm/día)</th>
                <th className="px-4 py-2">Nivel de precipitación</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b hover:bg-gray-50">
                <td className="px-4 py-2">0 – 2</td>
                <td className="px-4 py-2">Suave</td>
              </tr>
              <tr className="bg-white border-b hover:bg-gray-50">
                <td className="px-4 py-2">2 – 5</td>
                <td className="px-4 py-2">Moderada</td>
              </tr>
              <tr className="bg-white border-b hover:bg-gray-50">
                <td className="px-4 py-2">5 – 10</td>
                <td className="px-4 py-2">Alta</td>
              </tr>
              <tr className="bg-white hover:bg-gray-50">
                <td className="px-4 py-2">&gt; 10</td>
                <td className="px-4 py-2">Muy alta</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
