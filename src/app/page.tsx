"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ChatBot from "@/components/ChatBot";
import TypingText from "@/components/TypingText";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main id="home" className="min-h-screen overflow-x-hidden">
      <ChatBot />
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0c0c10]/90 backdrop-blur-md border-b border-[#26262e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href="#home">
              <Image
                src="/logo.png"
                alt="Leadit"
                width={140}
                height={45}
                className="h-10 w-auto cursor-pointer"
              />
            </a>
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-gray-300 hover:text-white transition font-medium">Home</a>
              <Link href="/servicios" className="text-gray-300 hover:text-white transition font-medium">Servicios</Link>
              <a href="#proceso" className="text-gray-300 hover:text-white transition font-medium">Proceso</a>
              <a href="#contacto" className="text-gray-300 hover:text-white transition font-medium">Contacto</a>
              <a href="#contacto" className="btn-3d text-base px-6 py-3">
                Empezar
              </a>
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
              <a href="#home" className="block text-gray-300 hover:text-white transition font-medium text-lg">Home</a>
              <Link href="/servicios" className="block text-gray-300 hover:text-white transition font-medium text-lg">Servicios</Link>
              <a href="#proceso" className="block text-gray-300 hover:text-white transition font-medium text-lg">Proceso</a>
              <a href="#contacto" className="block text-gray-300 hover:text-white transition font-medium text-lg">Contacto</a>
              <a href="#contacto" className="btn-3d w-full mt-4">Empezar</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div>
              <div className="badge-cartoon mb-6">
                <span className="w-2 h-2 bg-[#E42C24] rounded-full animate-pulse"></span>
                Automatización con IA
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                Tu equipo de ventas
                <span className="block h-[1.2em]"><TypingText /></span>
              </h1>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                Chatbots, call centers virtuales, closers y setters impulsados por IA.
                Automatiza tu proceso comercial y multiplica tus resultados.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#contacto" className="btn-3d">
                  Solicitar Demo Gratis
                </a>
                <a href="#servicios" className="btn-3d btn-3d-white">
                  Ver Servicios
                </a>
              </div>

              {/* Stats inline */}
              <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-[#26262e]">
                <div>
                  <div className="text-3xl font-extrabold text-brand">24/7</div>
                  <div className="text-gray-500 text-sm">Disponibilidad</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-brand">+300%</div>
                  <div className="text-gray-500 text-sm">Más leads</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-brand">&lt;1s</div>
                  <div className="text-gray-500 text-sm">Respuesta</div>
                </div>
              </div>
            </div>

            {/* Right image */}
            <div className="relative">
              <div className="img-frame">
                <img
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop"
                  alt="Equipo trabajando con IA"
                  className="w-full h-auto"
                />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 bg-[#141418] border-3 border-[#26262e] rounded-2xl p-4 shadow-2xl hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#E42C24] rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Conversiones</div>
                    <div className="text-xl font-bold text-white">+127%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos/Trust Section */}
      <section className="py-12 px-4 border-y border-[#26262e] bg-[#0a0a0c]">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-gray-500 text-sm mb-8 uppercase tracking-wider font-medium">
            Tecnología que impulsa a empresas líderes
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
            <span className="text-2xl font-bold text-gray-400">OpenAI</span>
            <span className="text-2xl font-bold text-gray-400">WhatsApp</span>
            <span className="text-2xl font-bold text-gray-400">Twilio</span>
            <span className="text-2xl font-bold text-gray-400">HubSpot</span>
            <span className="text-2xl font-bold text-gray-400">Zapier</span>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge-cartoon mx-auto mb-4">Nuestros Servicios</div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
              Todo lo que tu negocio necesita
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Soluciones de IA para cada etapa del proceso comercial
            </p>
          </div>

          {/* Service 1 - Chatbots */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
            <div className="img-frame order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=500&fit=crop"
                alt="Chatbot IA conversando"
                className="w-full h-auto"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="number-cartoon mb-4">01</div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Chatbots Inteligentes</h3>
              <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                Asistentes virtuales que entienden, responden y convierten. Disponibles 24/7 en WhatsApp,
                tu web y redes sociales. No son bots genéricos: entienden tu negocio y hablan como tu marca.
              </p>
              <ul className="space-y-3">
                {["Respuestas naturales con GPT-4", "Integración con WhatsApp Business", "Escalado automático a humanos", "Analíticas en tiempo real"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <span className="w-6 h-6 bg-[#E42C24] rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Service 2 - Call Center */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
            <div>
              <div className="number-cartoon mb-4">02</div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Call Centers Virtuales</h3>
              <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                Agentes de voz con IA que realizan y reciben llamadas. Suenan naturales, entienden contexto
                y nunca pierden la paciencia. Sin tiempos de espera, sin horarios limitados.
              </p>
              <ul className="space-y-3">
                {["Voces naturales en español", "Llamadas entrantes y salientes", "Transferencia inteligente", "Grabación y transcripción"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <span className="w-6 h-6 bg-[#E42C24] rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="img-frame">
              <img
                src="https://images.unsplash.com/photo-1596524430615-b46475ddff6e?w=800&h=500&fit=crop"
                alt="Call center con IA"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Service 3 - Closers & Setters */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
            <div className="img-frame order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1552581234-26160f608093?w=800&h=500&fit=crop"
                alt="Ventas automatizadas"
                className="w-full h-auto"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="number-cartoon mb-4">03</div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Closers & Setters</h3>
              <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                Profesionales de ventas que califican leads, agendan citas y cierran tratos.
                Tu equipo solo habla con prospectos cualificados y listos para comprar.
              </p>
              <ul className="space-y-3">
                {["Calificación de leads", "Agendamiento en tu calendario", "Seguimiento persistente", "Cierre de ventas"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <span className="w-6 h-6 bg-[#E42C24] rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Service 4 - Automatizaciones */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="number-cartoon mb-4">04</div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Automatizaciones con IA</h3>
              <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                Flujos de trabajo inteligentes que eliminan tareas repetitivas. Conectamos todas tus
                herramientas en un ecosistema potenciado por IA que trabaja mientras duermes.
              </p>
              <ul className="space-y-3">
                {["Integración con +5000 apps", "Workflows con inteligencia artificial", "Triggers inteligentes", "Sin código necesario"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <span className="w-6 h-6 bg-[#E42C24] rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="img-frame">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop"
                alt="Dashboard de automatizaciones"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="proceso" className="py-24 px-4 sm:px-6 lg:px-8 pattern-dots bg-[#0a0a0c]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge-cartoon mx-auto mb-4">Nuestro Proceso</div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
              De cero a automatizado en <span className="text-brand">3 pasos</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: "1",
                title: "Diagnóstico",
                desc: "Analizamos tu proceso comercial actual, identificamos cuellos de botella y diseñamos la estrategia de automatización perfecta.",
                img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop"
              },
              {
                num: "2",
                title: "Implementación",
                desc: "Configuramos los agentes de IA, los integramos con tus herramientas y entrenamos los modelos con tu información.",
                img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop"
              },
              {
                num: "3",
                title: "Optimización",
                desc: "Monitorizamos resultados, ajustamos comportamientos y escalamos lo que funciona. Tu negocio mejora cada día.",
                img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
              }
            ].map((step, i) => (
              <div key={i} className="card-cartoon p-6">
                <div className="img-frame mb-6">
                  <img src={step.img} alt={step.title} className="w-full h-48 object-cover" />
                </div>
                <div className="number-cartoon mb-4">{step.num}</div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial / Social Proof */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="card-cartoon p-8 sm:p-12 text-center relative">
            <svg className="w-16 h-16 text-[#E42C24] mx-auto mb-6 opacity-50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>
            <blockquote className="text-2xl sm:text-3xl font-medium mb-8 leading-relaxed">
              "El equipo de setters de Leadit transformó nuestro proceso comercial. Ahora solo hablamos
              con prospectos cualificados y listos para comprar. Resultados reales desde el primer mes."
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <img
                src="https://media.licdn.com/dms/image/v2/D4E03AQHag-hjxq9aPQ/profile-displayphoto-scale_200_200/B4EZfifVK7HIAc-/0/1751851554538?e=1766016000&v=beta&t=ZLPbru5_pM0kAZUCfzI7PPlVeybCtuspFWuQbs2kjEo"
                alt="Adrian Serrano"
                className="w-14 h-14 rounded-full border-3 border-[#26262e]"
              />
              <div className="text-left">
                <div className="font-bold">Adrian Serrano</div>
                <div className="text-gray-500">Founder, Syntalys Tech</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contacto" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0a0a0c]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6">
                ¿Listo para <span className="text-brand">automatizar</span> tu negocio?
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Solicita una demo gratuita y descubre cómo la IA puede multiplicar tus resultados
                sin aumentar tu equipo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="mailto:contacto@leadit.es"
                  className="btn-3d inline-flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  contacto@leadit.es
                </a>
                <a
                  href="https://wa.me/34641590487"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-3d btn-3d-white inline-flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
            <div className="img-frame">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop"
                alt="Equipo de soporte"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-[#26262e]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <Image
                src="/logo.png"
                alt="Leadit"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
              <span className="text-gray-500 text-sm">
                © {new Date().getFullYear()} Leadit. Todos los derechos reservados.
              </span>
            </div>
            <div className="flex items-center gap-8">
              <a href="#" className="text-gray-500 hover:text-white transition text-sm">Privacidad</a>
              <a href="#" className="text-gray-500 hover:text-white transition text-sm">Términos</a>
              <a href="#" className="text-gray-500 hover:text-white transition text-sm">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
