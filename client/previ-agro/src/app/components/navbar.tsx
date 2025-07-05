'use client';

import { signOut } from "firebase/auth";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getIdToken, onAuthStateChanged, User } from "firebase/auth";
import Link from "next/link";
import LogoutButton from "./logout-buttom";

interface NavbarProps {
  user?: {
    nombre: string;
    apellido: string;
    email: string;
    // agrega más campos si lo necesitas
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const [nombre, setNombre] = useState("");

  return (
    <aside className="bg-green-600 text-white w-64 h-screen fixed top-0 left-0 flex flex-col p-4 rounded-r-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="font-semibold text-lg">Bienvenido {user? `, ${user.nombre}` : ''}</div>
        <LogoutButton />
      </div>

      <nav className="flex flex-col gap-3 mt-4">
        <Link href="/" className="hover:bg-green-700 p-2 rounded">Inicio</Link>
        <Link href="/perfil" className="hover:bg-green-700 p-2 rounded">Perfil de Usuario</Link>
        <Link href="/predicciones" className="hover:bg-green-700 p-2 rounded">Predicciones</Link>
        <Link href="/datos_historicos" className="hover:bg-green-700 p-2 rounded">Datos Historicos del Último año</Link>
        {/* Aquí puedes seguir agregando más enlaces */}
      </nav>
    </aside>
  );
}
