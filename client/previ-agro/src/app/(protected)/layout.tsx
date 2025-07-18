'use client';

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getIdToken, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Navbar from "../components/navbar";
import { LoadingModal } from '../components/loading';
import Footer from "../components/footer";
import { ProfileContext, Profile } from "@/context/ProfileContext";



export default function ProtectedLayout({ children }: { children: React.ReactNode } ) {
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
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
