"use client";
import { useState } from "react";
import { Activity, BarChart2 } from "lucide-react";
import Image from 'next/image';

export default function Footer() {

  return (
    <footer className="bg-green-700 shadow-md   flex  gap-3 w-full">
      
        <div className="py-1  flex flex-col items-center justify-center flex-grow-[2]">
          <p className="text-white text-sm ">
            COPYRIGHT © PreviAgro, Todos los derechos reservados</p>
        </div>
        <div className="py-1  flex items-center justify-center flex-grow-[2]">
             <p className="text-white text-sm">Proyecto del Segundo Parcial de Gestión de Proyectos de Software</p>
        </div>
        <div className="flex  items-center justify-center flex-grow-[1]">
            <img src={"/assets/logitoo.png"} alt="Logo PreviAgro" className="w-20 h-16 mx-auto mt-2"  />
        </div>
    </footer>
  );
}