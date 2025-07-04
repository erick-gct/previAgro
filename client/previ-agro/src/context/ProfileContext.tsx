import { createContext } from "react";

export interface Profile {
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

export const ProfileContext = createContext<Profile | null>(null);
