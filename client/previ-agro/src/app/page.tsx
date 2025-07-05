
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { LoadingModal } from './components/loading';

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Usuario autenticado, redirigir a la página principal protegida
        router.push("/"); // o cualquier nombre que le quieras dar
      } else {
        // Usuario no autenticado, redirigir a login
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return <LoadingModal />;
}