'use client';

import { createContext, ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getIdToken, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Navbar from "../components/navbar";
import { LoadingModal } from '../components/loading';
import Footer from "../components/footer";

interface Profile {
  nombre: string;
  apellido: string;
  email: string;
  cedula: string;
  fecha_nacimiento: string;
  rol: string;
  ciudad: string;
  direccion: string;
  fecha_creacion: string;
}

// 1) Creamos y exportamos el contexto
export const ProfileContext = createContext<Profile | null>(null);

export default function ProtectedLayout({ children }: ProtectedLayoutProps ) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (!user) {
        router.push("/login");
        return;
      } 
        try {
        
        const idToken = await user.getIdToken();

        // 2) Llama a tu endpoint de perfil
        const res = await fetch("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${idToken}` }
        });

        if (!res.ok){
          console.error("Profile fetch failed:", await res.text());
          throw new Error('No se pudo cargar perfil');
        } 
        
        //throw new Error("No se pudo cargar perfil");

        const data: Profile = await res.json();
        setProfile(data);
      

      } catch (err) {
        console.error('Error en auth callback:', err);
        auth.signOut();
        await auth.signOut();
        router.push("/login");
        return;
      }finally {
        setLoading(false);
      }

    });

    return () => unsubscribe();


    
  }, [router]);

  if (loading) return <LoadingModal />;

  return (
    <ProfileContext.Provider value={profile}>
      
      <div className="flex min-h-screen ">
      <Navbar user={profile}/>
      

      <main className="flex-grow ml-64 p-6 w-full overflow-x-hidden">
        
        <div className="max-w-full overflow-x-hidden">
          {children}
        </div>
        
        </main>
     
     
      </div>
    </ProfileContext.Provider>
    
  );
}
