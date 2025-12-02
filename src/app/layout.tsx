import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Leadit - Automatización Inteligente con IA",
  description: "Chatbots, automatizaciones, call centers virtuales, closers y setters con IA. Transforma tu negocio con tecnología de vanguardia.",
  keywords: "chatbots, automatización, IA, call center, closers, setters, inteligencia artificial, ventas automatizadas",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
