"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/servicios", label: "Servicios" },
    { href: "/proceso", label: "Proceso" },
    { href: "/contacto", label: "Contacto" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0c0c10]/90 backdrop-blur-md border-b border-[#26262e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Leadit"
              width={140}
              height={45}
              className="h-10 w-auto cursor-pointer"
            />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition font-medium ${
                  isActive(link.href)
                    ? "text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contacto"
              className="bg-[#E42C24] hover:bg-[#c42420] text-white font-bold px-6 py-3 rounded-xl transition shadow-[0_4px_0_#a01d17] hover:shadow-[0_2px_0_#a01d17] hover:translate-y-0.5"
            >
              Empezar
            </Link>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white p-2"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-[#141418] border-t border-[#26262e]">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block transition font-medium text-lg ${
                  isActive(link.href)
                    ? "text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contacto"
              onClick={() => setMenuOpen(false)}
              className="block bg-[#E42C24] hover:bg-[#c42420] text-white font-bold px-6 py-3 rounded-xl transition shadow-[0_4px_0_#a01d17] text-center mt-4"
            >
              Empezar
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
