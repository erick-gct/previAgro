"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { LoadingModal } from "./components/loading";

export default function Home() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/(protected)");
      } else {
        router.replace("/login");
      }
      setChecking(false);
    });
    return () => unsub();
  }, [router]);

  if (checking) return <LoadingModal />;

  return null;
}
