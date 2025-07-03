import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Inter } from "next/font/google";
import Footer from "./components/footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Previ-Agro",
  description: "App para Agricolas Ecuatorianos",
  icons: {
    icon: "/assets/icono.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.className}>
      <body className="font-sans font-sans bg-[rgb(228,231,234)] flex flex-col min-h-screen overflow-x-hiddenn">
        <main className="flex-grow">{children}</main>
          <Footer />
      </body>
    </html>
  );
}
