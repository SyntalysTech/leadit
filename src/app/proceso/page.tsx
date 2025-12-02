"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

// Componente de línea animada que conecta los pasos
function AnimatedPath() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(scrolled / (maxScroll * 0.8), 1);
      setProgress(scrollProgress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <svg
      className="absolute left-1/2 top-0 h-full w-4 -translate-x-1/2 hidden lg:block"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E42C24" />
          <stop offset="100%" stopColor="#ff6b6b" />
        </linearGradient>
      </defs>
      <line
        x1="8"
        y1="0"
        x2="8"
        y2="100%"
        stroke="#26262e"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="8"
        y1="0"
        x2="8"
        y2={`${progress * 100}%`}
        stroke="url(#lineGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        className="transition-all duration-300"
      />
    </svg>
  );
}

// Componente de paso con animación al entrar en viewport
function ProcessStep({
  number,
  title,
  description,
  visual,
  isLeft,
}: {
  number: string;
  title: string;
  description: string;
  visual: React.ReactNode;
  isLeft: boolean;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative grid lg:grid-cols-2 gap-8 lg:gap-16 items-center py-16 lg:py-24 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
      }`}
    >
      {/* Número central */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:flex">
        <div
          className={`w-20 h-20 rounded-full bg-[#E42C24] flex items-center justify-center text-3xl font-black text-white shadow-[0_6px_0_#a01d17] transition-all duration-500 ${
            isVisible ? "scale-100" : "scale-0"
          }`}
        >
          {number}
        </div>
      </div>

      {/* Contenido */}
      <div className={`${isLeft ? "lg:pr-24" : "lg:order-2 lg:pl-24"}`}>
        <div className="lg:hidden mb-6">
          <div className="w-14 h-14 rounded-full bg-[#E42C24] flex items-center justify-center text-2xl font-black text-white shadow-[0_4px_0_#a01d17]">
            {number}
          </div>
        </div>
        <h3 className="text-3xl sm:text-4xl font-bold mb-4">{title}</h3>
        <p className="text-gray-400 text-lg leading-relaxed">{description}</p>
      </div>

      {/* Visual */}
      <div className={`${isLeft ? "lg:order-2 lg:pl-24" : "lg:pr-24"}`}>
        {visual}
      </div>
    </div>
  );
}

// Visual: Formulario animado
function FormVisual() {
  const [filled, setFilled] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFilled((prev) => (prev + 1) % 4);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#141418] border-4 border-[#26262e] rounded-3xl p-6 shadow-2xl">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      <div className="space-y-4">
        {["Nombre", "Email", "Empresa"].map((label, i) => (
          <div key={label}>
            <div className="text-gray-500 text-sm mb-2">{label}</div>
            <div
              className={`h-12 rounded-xl transition-all duration-500 ${
                i < filled ? "bg-[#E42C24]/20 border-2 border-[#E42C24]" : "bg-[#26262e]"
              }`}
            >
              {i < filled && (
                <div className="h-full flex items-center px-4">
                  <div className="h-2 bg-[#E42C24] rounded-full animate-pulse" style={{ width: `${60 + i * 20}%` }}></div>
                </div>
              )}
            </div>
          </div>
        ))}
        <button className={`w-full py-4 rounded-xl font-bold transition-all duration-500 ${
          filled >= 3 ? "bg-[#E42C24] text-white shadow-[0_4px_0_#a01d17]" : "bg-[#26262e] text-gray-500"
        }`}>
          Enviar
        </button>
      </div>
    </div>
  );
}

// Visual: IA Analizando
function AIAnalysisVisual() {
  const [activeBar, setActiveBar] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBar((prev) => (prev + 1) % 5);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    { label: "Interés", value: 92 },
    { label: "Presupuesto", value: 78 },
    { label: "Urgencia", value: 85 },
    { label: "Autoridad", value: 95 },
    { label: "Score", value: 88, highlight: true },
  ];

  return (
    <div className="bg-[#141418] border-4 border-[#26262e] rounded-3xl p-6 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-[#E42C24] flex items-center justify-center shadow-[0_3px_0_#a01d17]">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <div className="font-bold text-white">IA Analizando</div>
          <div className="text-green-400 text-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Procesando lead
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {metrics.map((metric, i) => (
          <div key={metric.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">{metric.label}</span>
              <span className={metric.highlight ? "text-[#E42C24] font-bold" : "text-white"}>
                {metric.value}%
              </span>
            </div>
            <div className="h-3 bg-[#26262e] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  metric.highlight ? "bg-[#E42C24]" : "bg-gradient-to-r from-[#E42C24] to-[#ff6b6b]"
                } ${i <= activeBar ? "opacity-100" : "opacity-30"}`}
                style={{ width: `${metric.value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Visual: Llamada IA
function CallVisual() {
  const [waveHeights, setWaveHeights] = useState([20, 35, 25, 40, 30]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWaveHeights([
        15 + Math.random() * 30,
        20 + Math.random() * 35,
        15 + Math.random() * 25,
        25 + Math.random() * 35,
        15 + Math.random() * 30,
      ]);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#141418] border-4 border-[#26262e] rounded-3xl p-6 shadow-2xl">
      <div className="text-center mb-8">
        <div className="w-24 h-24 rounded-full bg-[#E42C24] mx-auto mb-4 flex items-center justify-center shadow-[0_5px_0_#a01d17] relative">
          <span className="text-3xl font-bold text-white">L</span>
          <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping opacity-50"></div>
        </div>
        <div className="text-xl font-bold text-white">Laura</div>
        <div className="text-green-400 text-sm">En llamada</div>
      </div>
      <div className="flex items-end justify-center gap-2 h-16 mb-6">
        {waveHeights.map((height, i) => (
          <div
            key={i}
            className="w-3 bg-gradient-to-t from-[#E42C24] to-[#ff6b6b] rounded-full transition-all duration-150"
            style={{ height: `${height}px` }}
          ></div>
        ))}
      </div>
      <div className="bg-[#0c0c10] rounded-xl p-4">
        <p className="text-gray-400 text-sm italic">
          &quot;Perfecto, veo que buscan automatizar su proceso de ventas. ¿Cuántos leads gestionan al mes actualmente?&quot;
        </p>
      </div>
    </div>
  );
}

// Visual: Cita agendada
function CalendarVisual() {
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setConfirmed((prev) => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#141418] border-4 border-[#26262e] rounded-3xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="font-bold text-white text-lg">Diciembre 2024</div>
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#26262e] flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#26262e] flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-sm mb-4">
        {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
          <div key={d} className="text-gray-500 font-medium">{d}</div>
        ))}
        {[...Array(31)].map((_, i) => (
          <div
            key={i}
            className={`h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
              i === 14
                ? confirmed
                  ? "bg-green-500 text-white font-bold scale-110 shadow-[0_3px_0_#16a34a]"
                  : "bg-[#E42C24] text-white font-bold animate-pulse"
                : i < 5
                ? "text-gray-600"
                : "text-gray-300 hover:bg-[#26262e]"
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>
      {confirmed && (
        <div className="bg-green-500/20 border-2 border-green-500 rounded-xl p-4 flex items-center gap-3">
          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <div className="text-white font-bold text-sm">Demo Confirmada</div>
            <div className="text-green-400 text-xs">15 Dic - 10:00 AM</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Visual: Cierre
function CloseVisual() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStage((prev) => (prev + 1) % 4);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#141418] border-4 border-[#26262e] rounded-3xl p-6 shadow-2xl relative overflow-hidden">
      {stage === 3 && (
        <div className="absolute inset-0 bg-green-500/10 animate-pulse"></div>
      )}
      <div className="relative">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#26262e] flex items-center justify-center">
              <svg className="w-6 h-6 text-[#E42C24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-white">Carlos M.</div>
              <div className="text-gray-500 text-sm">CEO - TechCorp</div>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-bold transition-all duration-500 ${
            stage === 3 ? "bg-green-500 text-white" : "bg-[#E42C24]/20 text-[#E42C24]"
          }`}>
            {stage === 3 ? "CERRADO" : "EN PROCESO"}
          </div>
        </div>

        <div className="space-y-4">
          {[
            { label: "Llamada inicial", done: stage >= 0 },
            { label: "Demo personalizada", done: stage >= 1 },
            { label: "Propuesta enviada", done: stage >= 2 },
            { label: "Contrato firmado", done: stage >= 3 },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                step.done ? "bg-green-500" : "bg-[#26262e]"
              }`}>
                {step.done ? (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                )}
              </div>
              <span className={`transition-colors duration-500 ${step.done ? "text-white" : "text-gray-500"}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {stage === 3 && (
          <div className="mt-6 text-center">
            <div className="text-4xl font-black text-green-400">+12.000€</div>
            <div className="text-gray-500 text-sm">Nuevo cliente</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProcesoPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const steps = [
    {
      number: "1",
      title: "Captura",
      description:
        "Tu lead entra por web, anuncio o referido. Nuestro sistema lo captura instantáneamente y comienza el proceso de cualificación automática.",
      visual: <FormVisual />,
    },
    {
      number: "2",
      title: "Análisis IA",
      description:
        "La inteligencia artificial evalúa el lead en segundos. Analiza interés, presupuesto, urgencia y autoridad de compra para asignar un score.",
      visual: <AIAnalysisVisual />,
    },
    {
      number: "3",
      title: "Contacto",
      description:
        "Laura, nuestra agente IA, llama al lead con voz natural. Cualifica, responde objeciones y detecta necesidades reales.",
      visual: <CallVisual />,
    },
    {
      number: "4",
      title: "Agenda",
      description:
        "Los leads cualificados se agendan automáticamente en tu calendario. Solo recibes citas con prospectos listos para comprar.",
      visual: <CalendarVisual />,
    },
    {
      number: "5",
      title: "Cierre",
      description:
        "Tu equipo de closers entra en acción con toda la información del lead. Proceso optimizado para maximizar conversiones.",
      visual: <CloseVisual />,
    },
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0c0c10]">
      {/* Navbar */}
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
              <Link href="/" className="text-gray-300 hover:text-white transition font-medium">Home</Link>
              <Link href="/servicios" className="text-gray-300 hover:text-white transition font-medium">Servicios</Link>
              <Link href="/proceso" className="text-white font-medium">Proceso</Link>
              <Link href="/#contacto" className="text-gray-300 hover:text-white transition font-medium">Contacto</Link>
              <Link href="/#contacto" className="bg-[#E42C24] hover:bg-[#c42420] text-white font-bold px-6 py-3 rounded-xl transition shadow-[0_4px_0_#a01d17] hover:shadow-[0_2px_0_#a01d17] hover:translate-y-0.5">
                Empezar
              </Link>
            </div>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-white p-2"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-[#141418] border-t border-[#26262e]">
            <div className="px-4 py-6 space-y-4">
              <Link href="/" className="block text-gray-300 hover:text-white transition font-medium text-lg">Home</Link>
              <Link href="/servicios" className="block text-gray-300 hover:text-white transition font-medium text-lg">Servicios</Link>
              <Link href="/proceso" className="block text-white font-medium text-lg">Proceso</Link>
              <Link href="/#contacto" className="block text-gray-300 hover:text-white transition font-medium text-lg">Contacto</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-12 px-4 text-center relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#E42C24]/5 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6">
            De lead a <span className="text-[#E42C24]">cliente</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Un proceso automatizado de 5 pasos que convierte desconocidos en clientes de pago. Sin fricción. Sin esperas.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <AnimatedPath />
        {steps.map((step, i) => (
          <ProcessStep
            key={step.number}
            {...step}
            isLeft={i % 2 === 0}
          />
        ))}
      </section>

      {/* CTA Final */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-black mb-6">
            Activa tu máquina de ventas
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Cada minuto que pasa, pierdes leads. Automatiza hoy y empieza a cerrar más.
          </p>
          <Link
            href="/#contacto"
            className="inline-block bg-[#E42C24] hover:bg-[#c42420] text-white font-bold text-lg px-10 py-5 rounded-2xl transition shadow-[0_6px_0_#a01d17] hover:shadow-[0_3px_0_#a01d17] hover:translate-y-0.5"
          >
            Quiero mi demo gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#26262e] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Image src="/logo.png" alt="Leadit" width={120} height={40} className="h-8 w-auto" />
            <div className="flex items-center gap-6">
              <Link href="/" className="text-gray-500 hover:text-white transition text-sm">Home</Link>
              <Link href="/servicios" className="text-gray-500 hover:text-white transition text-sm">Servicios</Link>
              <Link href="/proceso" className="text-gray-500 hover:text-white transition text-sm">Proceso</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
