"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { LoadingModal } from "./components/loading";

export default function Home() {
  const router = useRouter();


  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/'); // iría al dashboard (protegido)
      } else {
        router.replace('/login');
      }
    });

    return () => unsub();
  }, [router]);

  return <LoadingModal />;
}
