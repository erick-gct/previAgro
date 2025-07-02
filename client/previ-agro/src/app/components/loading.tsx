'use client';
import React from 'react';
import { FaSpinner } from 'react-icons/fa';

export function LoadingModal() {
  return (

    <div className="fixed inset-0 z-40 flex items-center justify-center">
       <div className="fixed inset-0 bg-black/50 backdrop-blur-md"></div>
      <div className="relative bg-white bg-opacity-80 rounded-lg shadow-lg p-6 flex flex-col items-center space-y-4">
        <FaSpinner className="animate-spin text-green-500 text-4xl" />
        <p className="text-lg font-medium text-gray-700">Cargando, espere por favor :D</p>
      </div>
    </div>

  );
}
  
