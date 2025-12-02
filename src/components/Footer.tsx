import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#26262e] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Leadit"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-gray-500 hover:text-white transition text-sm">
              Home
            </Link>
            <Link href="/servicios" className="text-gray-500 hover:text-white transition text-sm">
              Servicios
            </Link>
            <Link href="/proceso" className="text-gray-500 hover:text-white transition text-sm">
              Proceso
            </Link>
            <Link href="/contacto" className="text-gray-500 hover:text-white transition text-sm">
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
