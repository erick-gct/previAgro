'use client';

import { useState, useRef } from "react"; // 1. Agregamos useRef aquí
import { useRouter } from "next/navigation";
import { FaCalendarAlt } from 'react-icons/fa'; 
import { LoadingModal } from '../components/loading'; // Importa el componente LoadingModal
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from "@/lib/api";
import Link from "next/link";


export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    email: "",
    contrasena: "",
    fecha_nacimiento: "",
    rol: "",
    ciudad: "",
    direccion: ""
  });

  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // 2. Creamos la referencia para el input de fecha aquí, junto a los otros hooks
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "cedula" && !/^[0-9]*$/.test(value)) return;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 3. Creamos la función para manejar el clic en el ícono
  const handleIconClick = () => {
    dateInputRef.current?.showPicker();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/.+@.+\..+/.test(formData.email)) {
      toast.error("Por favor, ingrese un correo válido", {position: "top-right"});
      return;
    }
    if (formData.contrasena.length < 7) {
      toast.error('La contraseña debe tener al menos 6 caracteres', { position: 'top-right' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/registrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setLoading(false);

      if (res.ok) {
        setShowModal(true);
        
      } else {
        const data = await res.json();
        toast.error(data.error || 'Error al registrar usuario', { position: 'top-right' });
      }
    } catch (err) {
      setLoading(false);
      toast.error('Error al conectar con el servidor', { position: 'top-right' });
    }
  };

  const handleModalAccept = () => {
    setShowModal(false);
    router.push("/login"); // Redirige al login después de aceptar el modal
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-4">

      {/* Toast Container */}
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded p-10 w-full max-w-5xl animate-fade-in"
      >
        <h2 className="text-3xl font-bold mb-1 text-left text-green-700">
          Registro de Usuario
        </h2>
        <p className="mb-6 text-gray-600 text-left">Complete el siguiente formulario para registrar un nuevo usuario.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label className="block mb-1 font-medium text-black">Nombre</label>
            <input
              name="nombre"
              placeholder="Ingrese su nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full p-2 shadow rounded text-black focus:outline-none focus:ring-2 focus:ring-green-500  border border-gray-300  bg-gray-50"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-black ">Apellido</label>
            <input
              name="apellido"
              placeholder="Ingrese su apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
              className="w-full p-2 shadow rounded text-black focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-300  bg-gray-50"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-black">Cédula</label>
            <input
              name="cedula"
              placeholder="Ingrese su cédula"
              value={formData.cedula}
              onChange={handleChange}
              required
              className="w-full p-2 shadow rounded text-black focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-300  bg-gray-50"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-black">Correo electrónico</label>
            <input
              type="email"
              name="email"
              placeholder="Ingrese su email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 shadow rounded text-black focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-300  bg-gray-50"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-black">Contraseña</label>
            <input
              type="password"
              name="contrasena"
              placeholder="Ingrese su contraseña"
              value={formData.contrasena}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full p-2 shadow rounded text-black focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-300  bg-gray-50"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-black">Fecha de nacimiento</label>
            <div className="relative">
              <input
                ref={dateInputRef} // Asignamos la referencia
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                required
                className="w-full p-2 pr-10 shadow rounded text-black focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none border border-gray-300  bg-gray-50"
              />
              <FaCalendarAlt
                onClick={handleIconClick} // Asignamos el manejador de clic
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 cursor-pointer transition-colors hover:text-green-600"
              />
            </div>
          </div>
          

          <div>
            <label className="block mb-1 font-medium text-black ">Rol</label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              required
              className="w-full p-2 shadow rounded text-black focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-300  bg-gray-50"
            >
              <option value="agricultor">Agricultor</option>
              <option value="ejecutivo">Ejecutivo</option>
              <option value="empresario">Empresario</option>
              <option value="lider tecnico">Líder Técnico</option>
              <option value="tester">Tester</option>
              <option value="general">General</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium text-black" >Ciudad</label>
            <input
              name="ciudad"
              placeholder="Ingrese su ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              required
              className="w-full p-2 shadow rounded text-black focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-300  bg-gray-50"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-black">Dirección</label>
            <input
              name="direccion"
              placeholder="Ingrese su dirección"
              value={formData.direccion}
              onChange={handleChange}
              required
              className="w-full p-2 shadow rounded text-black focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-300  bg-gray-50"
            />
          </div>
        </div>

        <div className="flex justify-end mt-8">
        
        <p className="mt-4 text-left text-gray-700">
          ¿Ya tienes una cuenta creada? {" "}
           <Link href= "../login" className="font-bold text-green-700 hover:underline">
            Inicia sesión aquí
            </Link>
         </p>

          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 cursor-pointer transition-colors duration-200 shadow-md hover:shadow-lg"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </div>
        

  
      </form>
  


       {/* Modal de carga */}
      {loading && <LoadingModal />}

     {/* Modal de éxito */}
    {showModal && (
      <div className="fixed inset-0 z-40 flex items-center justify-center"> {/* Este div es el contenedor principal que centra todo */}
       
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md"></div>

        {/* Este div es el contenido del modal, ahora es un hijo directo del contenedor centrado */}
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-8/12  h-4/12 max-w-md z-50">
      <h3 className="text-2xl font-semibold mb-4 text-center text-green-700 pt-5 ">
        Usuario creado correctamente :D
      </h3>
      <p className="text-gray-600 text-center mb-6 py-0">
        Puedes iniciar sesión con el ahora.
      </p>
      <div className="flex justify-center">
        <button
          onClick={handleModalAccept}
          className="bg-green-600 text-white py-3 px-4 rounded hover:bg-green-700 pointer-events-auto transition-colors duration-200 shadow-md hover:shadow-lg cursor-pointer"
        >
          Aceptar
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}