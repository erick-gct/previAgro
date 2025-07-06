"use client";

import React, { useContext, useState, useRef, useEffect} from "react";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { auth } from '@/lib/firebase';
import { getIdToken, onAuthStateChanged, User } from "firebase/auth";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "@/lib/api";
import { ProfileContext } from "@/context/ProfileContext";
import { LoadingModal } from "@/app/components/loading";
import { FaCalendarAlt } from 'react-icons/fa'; 

export default function PerfilPage() {
  const profile = useContext(ProfileContext);


  // 1) Si todavía no llegó el profile, mostramos un loading
  if (!profile) {
    return <LoadingModal />;
  }
  
  
  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return "";
    
    try {
      // Si ya está en formato ISO con "T", tomar solo la parte de fecha
      if (dateString.includes("T")) {
        return dateString.split("T")[0];
      }
      
      // Si es otra fecha, convertirla a ISO y tomar la parte de fecha
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      
      return date.toISOString().split("T")[0];
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(() => ({
    ...profile,
    // Si tu API te devuelve "2025-07-04T00:00:00Z", esto extrae "2025-07-04"
    fecha_nacimiento: profile.fecha_nacimiento
    ? formatDateForInput(profile.fecha_nacimiento)
    : "",
  }));

  // 2. Creamos la referencia para el input de fecha aquí, junto a los otros hooks
  const dateInputRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  
  if (!profile) {
    toast.error("Error, No se pudo encontrar el perfil :(", {
      position: "top-right",
    });
    return;
  }

  // useEffect para actualizar el form cuando profile cambie
  useEffect(() => {
    if (profile) {
      setForm({
        ...profile,
        fecha_nacimiento: profile.fecha_nacimiento
        ? formatDateForInput(profile.fecha_nacimiento)
        : "",
      });
    }
  }, [profile]);

 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError(""); 
    console.log(profile.fecha_nacimiento);
    console.log(profile);
  };

  const handleSave = async () => {
    setError("");
   
    try{
      // Obtener token
      const user = auth.currentUser;
      if (!user) {
        toast.error("La respuesta de la red no fue exitosa", {position: "top-right"});
        return;
      }   
      const idToken = await getIdToken(user);
      // Llamada PUT
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Error al actualizar perfil", {position: "top-right"});
        //throw new Error(data.error || "Error al actualizar perfil");
      }
      toast.success("Perfil Actualizado Correctamente", {position: "top-right"});
      setIsEditing(false);

    }catch (e: any) {
       toast.error(e.message, {position: "top-right"});
    }
    setIsEditing(false);
  };

  //Funcion para cancelar la edición y restaurar valores originales
  const handleCancel = () => {
      setForm({
      ...profile,
      fecha_nacimiento: formatDateForInput(profile.fecha_nacimiento)
    });
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  


  // 3. Creamos la función para manejar el clic en el ícono
  const handleIconClick = () => {
    if (!dateInputRef.current) return;
    dateInputRef.current?.focus();        // 1) Enfoca el input
    dateInputRef.current?.showPicker();  
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4 py-4">
          {/* Contenedor del toast */}
        <ToastContainer />
      <div className="bg-white shadow-md rounded-lg p-10 w-full max-w-5xl animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-left text-green-700">
            Mi Perfil
          </h1>
          {isEditing ? (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white p-2 rounded-2xl cursor-pointer"
              >
                <FaSave />
                <span> Actualizar</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-2xl cursor-pointer"
              >
                <FaTimes />
                <span>Cancelar</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-2xl cursor-pointer"
            >
              <FaEdit />
              <span>Editar</span>
            </button>
          )}
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}
        <p className="mb-6 text-gray-800">
          {isEditing
            ? "Modifica tus datos y haz clic en Guardar para aplicar los cambios."
            : " A continuación, puede visualizar su información completa, asi mismo como editarla con el botón al lado"}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div>
            <label className="block mb-1 font-medium text-black">Nombre</label>
            <input 
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full p-2 shadow rounded text-black focus:outline-none focus:ring-2 focus:ring-green-500 border ${
                isEditing ? "bg-gray-200 border-gray-400" : "bg-white border-gray-300 cursor-default"
              }`}
            />
          </div>
          {/* Apellido */}
          <div>
            <label className="block mb-1 font-medium text-black">
              Apellido
            </label>
            <input
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full p-2 shadow rounded text-black focus:outline-none focus:ring-2 focus:ring-green-500 border ${
                isEditing ? "bg-gray-200 border-gray-400" : "bg-white border-gray-300 cursor-default"
              }`}
            />
          </div>
          {/* Cédula (siempre readOnly) */}
          <div>
            <label className="block mb-1 font-medium text-black">Cédula</label>
            <input
              name="cedula"
              value={form.cedula}
              readOnly
              className="w-full p-2 shadow rounded bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-default"
            />
          </div>
          {/* Email */}
          <div>
            <label className="block mb-1 font-medium text-black">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full p-2 shadow rounded text-black focus:outline-none focus:ring-2 focus:ring-green-500 border ${
                isEditing ? "bg-gray-200 border-gray-400" : "bg-white border-gray-300 cursor-default"
              }`}
            />
          </div>
          {/* Fecha de Nacimiento: text o date */}
          <div>
            <label className="block mb-1 font-medium text-black">
              Fecha de Nacimiento
            </label>
           {isEditing ? (
              <div className="relative">
              <input
                ref={dateInputRef}
                type="date"
                name="fecha_nacimiento"
                value={form.fecha_nacimiento}
                onChange={handleChange}
                className="w-full p-2 shadow rounded text-black focus:outline-none focus:ring-2 focus:ring-green-500 border bg-gray-200 border-gray-400"
              />
              <FaCalendarAlt
                    onClick={() => {
                      dateInputRef.current?.focus();
                      dateInputRef.current?.showPicker();
                     }} // Asignamos el manejador de clic
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 cursor-pointer transition-colors hover:text-green-600"
                />
              </div>

            ) : (
              <input
                type="text"
                value={new Date(profile.fecha_nacimiento).toLocaleDateString()}
                readOnly
                className="w-full p-2 shadow rounded bg-white text-black border border-gray-300 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-default"
              />
            )}
          </div>
          {/* Rol */}
          <div>
            <label className="block mb-1 font-medium text-black">Rol</label>
                        {isEditing ? (
              <select
                name="rol"
                value={form.rol}
                onChange={handleChange}
                className="w-full p-2 shadow rounded text-black focus:outline-none focus:ring-2 focus:ring-green-500 border bg-gray-200 border-gray-400"
              >
                <option>Agricultor</option>
                <option>Ejecutivo</option>
                <option>Empresario</option>
                <option>Líder Técnico</option>
                <option>Tester</option>
                <option>General</option>
              </select>
            ) : (
              <input
                type="text"
                value={profile.rol}
                readOnly
                className="w-full p-2 shadow rounded bg-white text-black border border-gray-300 cursor-default"
              />
            )}
            
          </div>
          {/* Ciudad */}
          <div>
            <label className="block mb-1 font-medium text-black">Ciudad</label>
             <input
              name="ciudad"
              value={form.ciudad}
              onChange={handleChange}
              disabled={!isEditing} 
              className={`w-full p-2 shadow rounded text-black focus:outline-none focus:ring-2 focus:ring-green-500 border ${
                isEditing ? "bg-gray-200 border-gray-400" : "bg-white border-gray-300 select-none cursor-default"
              }`}
            />
          </div>
          {/* Dirección */}
          <div>
            <label className="block mb-1 font-medium text-black">
              Dirección
            </label>
            <input
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full p-2 shadow rounded text-black focus:outline-none focus:ring-2 focus:ring-green-500 border ${
                isEditing ? "bg-gray-200 border-gray-400" : "bg-white border-gray-300 cursor-default"
              }`}
            />
          </div>
          {/* Fecha de Creación (siempre readOnly) */}
          <div>
            <label className="block mb-1 font-medium text-black">
              Registrado el
            </label>
              <input
              type="text"
              value={new Date(profile.fecha_creacion).toLocaleDateString()}
              readOnly
              className="w-full p-2 shadow rounded bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-default"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
