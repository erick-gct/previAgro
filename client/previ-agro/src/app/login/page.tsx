"use client";
import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Asegúrate de que la ruta sea correcta
import { useRouter } from "next/navigation";
import Link from "next/link";
import {LoadingModal} from "../components/loading";
import React from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Si ya está logueado, redirige automáticamente
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/"); // o a "/page" si lo cambias
      } else {
        setCheckingAuth(false);
      }
    });

    return () => unsub();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/"); // redirige al dashboard u otra ruta protegida
    } catch (err: any) {
      toast.error(err.message, {position: "top-right"});
      setError(err.message);
    }
  };

  if (checkingAuth) return <LoadingModal></LoadingModal>;
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-500 to-green-900"
      /*        style={{
        backgroundImage: "url('./assets/fondos/fondo-2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",

      }} */
    >
      {/* Contenedor del toast */}
      <ToastContainer />
      {
        <div
          className="shadow-lg p-8 w-full max-w-md flex flex-col items-center"
          style={{
            backgroundColor: "rgb(244,234,255)",
            borderRadius: "1.5rem",
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(10px)",

            backgroundAttachment: "fixed",
          }}
        >
          <h2
            className="text-4xl font-bold mb-2"
            style={{ color: "rgb(27, 94, 32)" }}
          >
            Bienvenido
          </h2>
          <p className="mb-6 text-center" style={{ color: "rgb(97, 97, 97)" }}>
            Ingresa tus credenciales para acceder a la aplicación previArgo.
          </p>
          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            <div className="relative mb-6">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
 
              </div>

              <input
                type="email"
                placeholder="Ingrese su email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded  focus:ring-2 focus:ring-green-600 shadow-sm focus:outline-none"
                style={{
                  backgroundColor: "rgb(254,254,255)",
                  color: "rgb(43, 43, 43)",
                }}
              />
            </div>

            <input
              type="password"
              placeholder="Ingrese su Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded  focus:ring-2 focus:ring-blue-600 shadow-sm focus:outline-none"
              style={{
                backgroundColor: "rgb(254,254,255)",
                color: "rgb(33, 33, 33)",
              }}
            />

            <button
              type="submit"
              className=" px-6 py-3 font-bold py-2  p5 transition p-2 hover:scale-102 hover:shadow-lg p-2  shadow-sm"
              style={{
                backgroundColor: "rgb(56, 142, 60)",
                color: "white",
                cursor: "pointer",
                borderRadius: "0.7rem",
                boxShadow: "4px 4px 5px rgba(3, 3, 3, 0.1)",
              }}
            >
              Ingresar
            </button>

          </form>
          <p
            className="mb-6 text-center"
            style={{
              color: "rgb(97, 97, 97)",
              fontSize: "0.9rem",
              marginTop: "1rem",
              padding: "0.5rem",
            }}
          >
            ¿No tienes una cuenta creada?
            <span className="font-bold" style={{ color: "rgb(27, 94, 32)" }}>
              {" "}
              <Link href="../register" className=" p-2 rounded">
                Haz clic aqui para crearla :D
              </Link>
            </span>
          </p>
        </div>
      }
    </div>
  );
};

export default Login;
