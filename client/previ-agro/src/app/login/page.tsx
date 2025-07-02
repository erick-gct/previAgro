'use client';
import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase"; // Asegúrate de que la ruta sea correcta
import { useRouter } from "next/navigation";
import Link from "next/link";

import React from "react";

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
      setError(err.message);
    }
  };

  if (checkingAuth) return <p className="text-center mt-10">Cargando...</p>;
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
        <p
          className="mb-6 text-center"
          style={{ color: "rgb(97, 97, 97)" }}
        >
          Ingresa tus credenciales para acceder a la aplicación previArgo.
        </p>
  <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          
          <div className="relative mb-6">
  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
        <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z"/>
        <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z"/>
    </svg>
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
              boxShadow: "4px 4px 5px rgba(3, 3, 3, 0.1)"
            }}
          >
            Ingresar
          </button>
          
           {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
          <p
          className="mb-6 text-center"
          style={{ color: "rgb(97, 97, 97)",
            fontSize: "0.9rem",
            marginTop: "1rem",
            padding: "0.5rem",
            }}
        >
          ¿No tienes una cuenta creada?<span className="font-bold" style={{ color: "rgb(27, 94, 32)" }}>  <Link href="../register" className=" p-2 rounded">Haz clic aqui para crearla :D</Link></span> 
        </p>
      </div>

    }
    </div>
  );
};

export default Login;


