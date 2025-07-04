"use client";
import Image from "next/image";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from '@/lib/firebase';
import LogoutButton from "./components/logout-buttom";
import Navbar from "./components/navbar";
import { FaChartLine, FaHistory, FaUser, FaMapMarkerAlt } from 'react-icons/fa';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      
      if (user) {
        console.log("Usuario detectado:", user);
        setLoading(false);
      } else {
        console.log("no se encontro user");
        router.push("/login");
      }


     console.log("Home page cargada en Vercel");

    });

    return () => unsub();
  }, [router]);

  

  if (loading) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <div className="bg-[rgb(228,231,234)] min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-white flex flex-col md:flex-row items-center max-w-6xl mx-auto py-16 px-4 flex-grow rounded-lg shadow-lg mb-8">
        <div className="md:w-1/2">
          <h1 className="text-5xl font-bold text-green-700 mb-4">
            Bienvenido a Previ-Agro
          </h1>
          <p className="text-gray-700 text-lg">
            Plataforma integral para la gestión y predicción de precipitaciones
            agrícolas, diseñada para ayudar a agricultores y técnicos a tomar
            decisiones informadas.
          </p>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
          <Image
            src={"/assets/costa.png"}
            alt="Costa Ecuatoriana"
            width={400}
            height={300}
            className="w-full max-w-md rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Objective Section */}
      <section className="bg-white py-12 px-4 rounded-lg shadow-lg mb-3">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-3/4">
            <h2 className="text-3xl font-semibold text-green-700 mb-4">
              Nuestro Objetivo
            </h2>
            <p className="text-gray-700">
              Brindar datos precisos y visualizaciones claras para anticipar
              patrones de lluvia, optimizar cultivos y mejorar la planificación
              agrícola.
            </p>
          </div>
          <div className="md:w-1/4 flex justify-center mt-6 md:mt-0">
          <FaChartLine className="w-24 h-24 text-green-700" />
          </div>
        </div>
      </section>

       {/* Objective Section */}
      <section className="bg-white py-12 px-4 rounded-lg shadow-lg">

        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-3/4">
            <h2 className="text-3xl font-semibold text-green-700 mb-4">
              Zona Delimitada
            </h2>
            <p className="text-gray-700">
              La zona en donde trabaja este sistema de predicción es en la costa ecuadtoriana, mas especificamente Brindar datos precisos y visualizaciones claras para anticipar patrones de lluvia, optimizar cultivos y mejorar la planificación agrícola.
            </p>
          </div>
          <div className="md:w-1/4 flex justify-center mt-6 md:mt-0">
            <FaMapMarkerAlt className="w-24 h-24 text-green-700" />
          </div>
        </div>
      </section>

      {/* Models Section */}
      <section className="py-12 px-4">
        <h2 className="text-3xl font-bold text-green-700 mb-2 text-center py-6"> Información sobre los módulos de la aplicación</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-start">
            <FaUser className="w-10 h-10 text-green-700 mb-4" />
            <h3 className="text-2xl font-semibold text-green-700 mb-2">Perfil de Usuario</h3>
            <p className="text-gray-700">
              Consulta y edita tu información personal almacenada en la plataforma.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-start">
            <FaChartLine className="w-10 h-10 text-green-700 mb-4" />
            <h3 className="text-2xl font-semibold text-green-700 mb-2">Predicciones</h3>
            <p className="text-gray-700">
              Genera proyecciones de precipitaciones con modelos SARIMA y Prophet.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-start">
            <FaHistory className="w-10 h-10 text-green-700 mb-4" />
            <h3 className="text-2xl font-semibold text-green-700 mb-2">Datos Históricos del Último Año</h3>
            <p className="text-gray-700">
              Visualiza la evolución de las precipitaciones de años anteriores mediante gráficos generados por meses y en general de los últimos años.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
