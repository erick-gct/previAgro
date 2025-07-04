'use client';

import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import { FaSignOutAlt } from "react-icons/fa";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <button onClick={handleLogout} className="flex items-center mt-4 bg-red-600 text-white p-2 rounded-2xl cursor-pointer transition-colors duration-200 hover:bg-white hover:text-red-700 border border-red-700 flex items-center space-x-2" style={{ width: "fit-content" }} title="Cerrar Sesión" aria-label="Cerrar Sesión"
      >
      <FaSignOutAlt />
     <span>Cerrar Sesión</span> 
    </button>
  );
}
