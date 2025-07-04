"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { LoadingModal } from "./components/loading";
import { app } from "@/lib/firebase";

export default function Home() {
  const router = useRouter();
  const auth = getAuth(app);


  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/'); // iría al dashboard (protegido)
      } else {
        router.push('/login');
      }
    });

    return () => unsub();
  }, [router, auth]);

  return <LoadingModal />;
}
