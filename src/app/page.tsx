"use client";

import Image from "next/image";
import { useState } from "react";

const services = [
  {
    title: "Chatbots Inteligentes",
    description: "Asistentes virtuales 24/7 que entienden, responden y convierten. Integración con WhatsApp, web y redes sociales.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    title: "Automatizaciones",
    description: "Flujos de trabajo automáticos que eliminan tareas repetitivas. Conecta todas tus herramientas en un ecosistema inteligente.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    title: "Call Centers Virtuales",
    description: "Agentes de voz con IA que realizan y reciben llamadas. Disponibles 24/7 sin tiempos de espera.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
  {
    title: "Closers con IA",
    description: "Agentes de ventas virtuales que cierran tratos. Negociación inteligente y seguimiento automatizado.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Setters Automatizados",
    description: "Calificación y agendamiento de citas automático. Tu equipo solo habla con prospectos cualificados.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Triagers Inteligentes",
    description: "Clasificación y priorización automática de leads. Cada prospecto al agente correcto en el momento perfecto.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
];

const benefits = [
  { number: "24/7", label: "Disponibilidad total" },
  { number: "90%", label: "Reducción de costes" },
  { number: "3x", label: "Más conversiones" },
  { number: "<1s", label: "Tiempo de respuesta" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="Leadit"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#servicios" className="text-gray-300 hover:text-white transition">Servicios</a>
              <a href="#beneficios" className="text-gray-300 hover:text-white transition">Beneficios</a>
              <a href="#contacto" className="text-gray-300 hover:text-white transition">Contacto</a>
              <a
                href="#contacto"
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition font-medium"
              >
                Empezar Ahora
              </a>
            </div>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-dark-800 border-t border-white/5">
            <div className="px-4 py-4 space-y-3">
              <a href="#servicios" className="block text-gray-300 hover:text-white transition">Servicios</a>
              <a href="#beneficios" className="block text-gray-300 hover:text-white transition">Beneficios</a>
              <a href="#contacto" className="block text-gray-300 hover:text-white transition">Contacto</a>
              <a
                href="#contacto"
                className="block px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition font-medium text-center"
              >
                Empezar Ahora
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
              Transforma tu negocio con{" "}
              <span className="gradient-text">IA Conversacional</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 animate-slide-up">
              Chatbots, automatizaciones, call centers virtuales, closers y setters
              impulsados por inteligencia artificial. Vende más, trabaja menos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <a
                href="#contacto"
                className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition font-semibold text-lg glow"
              >
                Solicitar Demo Gratis
              </a>
              <a
                href="#servicios"
                className="px-8 py-4 border border-white/20 hover:border-white/40 text-white rounded-xl transition font-semibold text-lg"
              >
                Ver Servicios
              </a>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 relative">
            <div className="gradient-border rounded-2xl p-8 bg-dark-800/50 backdrop-blur-sm">
              <div className="flex items-center justify-center">
                <Image
                  src="/icon.png"
                  alt="Leadit Icon"
                  width={200}
                  height={200}
                  className="animate-float"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl sm:text-5xl font-bold gradient-text mb-2">
                  {benefit.number}
                </div>
                <div className="text-gray-400">{benefit.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Todo lo que necesitas para{" "}
              <span className="gradient-text">automatizar tus ventas</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Soluciones de IA diseñadas para cada etapa del proceso comercial
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="gradient-border rounded-2xl p-6 bg-dark-800/50 backdrop-blur-sm card-hover"
              >
                <div className="w-14 h-14 bg-primary-500/10 rounded-xl flex items-center justify-center text-primary-400 mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-400">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Cómo <span className="gradient-text">funciona</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Consulta Inicial</h3>
              <p className="text-gray-400">
                Analizamos tu negocio y definimos los flujos de automatización ideales
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Implementación</h3>
              <p className="text-gray-400">
                Configuramos e integramos los agentes de IA con tus herramientas actuales
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Resultados</h3>
              <p className="text-gray-400">
                Tu negocio opera 24/7 generando leads y cerrando ventas automáticamente
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contacto" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="gradient-border rounded-3xl p-8 sm:p-12 bg-dark-800/50 backdrop-blur-sm text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              ¿Listo para <span className="gradient-text">transformar</span> tu negocio?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Solicita una demo gratuita y descubre cómo la IA puede multiplicar tus resultados
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:hola@leadit.es"
                className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition font-semibold text-lg glow inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                hola@leadit.es
              </a>
              <a
                href="https://wa.me/34600000000"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl transition font-semibold text-lg inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="Leadit"
                width={100}
                height={32}
                className="h-6 w-auto"
              />
              <span className="text-gray-500">
                © {new Date().getFullYear()} Leadit. Todos los derechos reservados.
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition">Privacidad</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Términos</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
