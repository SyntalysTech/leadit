"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

// Componente de partículas flotantes
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-[#E42C24]/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

// Input animado
function AnimatedInput({
  label,
  name,
  type = "text",
  required = false,
  textarea = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const inputProps = {
    name,
    type,
    required,
    onFocus: () => setFocused(true),
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFocused(false);
      setHasValue(e.target.value.length > 0);
    },
    className: `w-full bg-transparent text-white text-lg outline-none peer pt-6 pb-2 ${
      textarea ? "min-h-[120px] resize-none" : ""
    }`,
  };

  return (
    <div
      className={`relative bg-[#141418] border-3 rounded-2xl px-5 transition-all duration-300 ${
        focused
          ? "border-[#E42C24] shadow-[0_0_20px_rgba(228,44,36,0.2)]"
          : "border-[#26262e] hover:border-[#3a3a3e]"
      }`}
    >
      <label
        className={`absolute left-5 transition-all duration-300 pointer-events-none ${
          focused || hasValue
            ? "top-2 text-xs text-[#E42C24] font-medium"
            : "top-1/2 -translate-y-1/2 text-gray-500"
        }`}
      >
        {label}
      </label>
      {textarea ? (
        <textarea {...inputProps} />
      ) : (
        <input {...inputProps} />
      )}
    </div>
  );
}

// Estadística animada
function AnimatedStat({ value, label, delay }: { value: string; label: string; delay: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`text-center transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="text-3xl sm:text-4xl font-black text-[#E42C24]">{value}</div>
      <div className="text-gray-500 text-sm mt-1">{label}</div>
    </div>
  );
}

export default function ContactoPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("loading");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/mvgerbqw", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setFormState("success");
        form.reset();
      } else {
        setFormState("error");
      }
    } catch {
      setFormState("error");
    }
  };

  return (
    <main className="min-h-screen bg-[#0c0c10]">
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
              <Link href="/proceso" className="text-gray-300 hover:text-white transition font-medium">Proceso</Link>
              <Link href="/contacto" className="text-white font-medium">Contacto</Link>
              <Link href="/contacto" className="bg-[#E42C24] hover:bg-[#c42420] text-white font-bold px-6 py-3 rounded-xl transition shadow-[0_4px_0_#a01d17] hover:shadow-[0_2px_0_#a01d17] hover:translate-y-0.5">
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
              <Link href="/proceso" className="block text-gray-300 hover:text-white transition font-medium text-lg">Proceso</Link>
              <Link href="/contacto" className="block text-white font-medium text-lg">Contacto</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <FloatingParticles />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E42C24]/5 rounded-full blur-3xl"></div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#141418] border-2 border-[#26262e] rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-gray-400 text-sm font-medium">Respondemos en menos de 2h</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6">
            Hablemos de <span className="text-[#E42C24]">resultados</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Cuéntanos tu proyecto y te mostraremos cómo podemos triplicar tus ventas cualificadas con IA.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Form - 3 columns */}
            <div className="lg:col-span-3">
              <div className="bg-[#0a0a0c] border-4 border-[#1a1a1e] rounded-3xl p-8 sm:p-10 relative overflow-hidden">
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#E42C24]/10 to-transparent"></div>

                {formState === "success" ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Mensaje enviado</h3>
                    <p className="text-gray-400 mb-8">Te contactaremos en menos de 2 horas.</p>
                    <button
                      onClick={() => setFormState("idle")}
                      className="text-[#E42C24] font-medium hover:underline"
                    >
                      Enviar otro mensaje
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6 relative">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <AnimatedInput label="Nombre" name="nombre" required />
                      <AnimatedInput label="Empresa" name="empresa" />
                    </div>

                    <AnimatedInput label="Email" name="email" type="email" required />

                    <AnimatedInput label="Teléfono" name="telefono" type="tel" />

                    <div className="space-y-3">
                      <label className="text-gray-400 text-sm font-medium block">Servicio de interés</label>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {[
                          { id: "chatbot", label: "Chatbot IA" },
                          { id: "callcenter", label: "Call Center Virtual" },
                          { id: "setters", label: "Setters & Closers" },
                          { id: "automatizacion", label: "Automatización" },
                        ].map((service) => (
                          <label
                            key={service.id}
                            className="flex items-center gap-3 bg-[#141418] border-2 border-[#26262e] rounded-xl px-4 py-3 cursor-pointer hover:border-[#3a3a3e] transition group"
                          >
                            <input
                              type="checkbox"
                              name="servicios"
                              value={service.id}
                              className="w-5 h-5 rounded-lg bg-[#26262e] border-0 text-[#E42C24] focus:ring-[#E42C24] focus:ring-offset-0"
                            />
                            <span className="text-gray-300 group-hover:text-white transition">{service.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <AnimatedInput label="Cuéntanos sobre tu proyecto" name="mensaje" textarea required />

                    <button
                      type="submit"
                      disabled={formState === "loading"}
                      className="w-full bg-[#E42C24] hover:bg-[#c42420] text-white font-bold text-lg py-5 rounded-2xl transition shadow-[0_6px_0_#a01d17] hover:shadow-[0_3px_0_#a01d17] hover:translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {formState === "loading" ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Enviando...
                        </>
                      ) : (
                        <>
                          Solicitar Demo Gratis
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </>
                      )}
                    </button>

                    {formState === "error" && (
                      <p className="text-red-400 text-center text-sm">
                        Hubo un error. Inténtalo de nuevo o escríbenos directamente.
                      </p>
                    )}
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar Info - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Cards */}
              <div className="bg-[#141418] border-3 border-[#26262e] rounded-2xl p-6 hover:border-[#E42C24]/50 transition group">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-[#E42C24]/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#E42C24]/20 transition">
                    <svg className="w-7 h-7 text-[#E42C24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">Email</h3>
                    <a href="mailto:hola@leadit.es" className="text-gray-400 hover:text-[#E42C24] transition">
                      hola@leadit.es
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-[#141418] border-3 border-[#26262e] rounded-2xl p-6 hover:border-[#E42C24]/50 transition group">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-[#E42C24]/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#E42C24]/20 transition">
                    <svg className="w-7 h-7 text-[#E42C24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">Teléfono</h3>
                    <a href="tel:+34900123456" className="text-gray-400 hover:text-[#E42C24] transition">
                      +34 900 123 456
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-[#141418] border-3 border-[#26262e] rounded-2xl p-6 hover:border-[#E42C24]/50 transition group">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition">
                    <svg className="w-7 h-7 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">WhatsApp</h3>
                    <a href="https://wa.me/34900123456" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500 transition">
                      Escríbenos directo
                    </a>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-gradient-to-br from-[#E42C24]/10 to-[#141418] border-3 border-[#26262e] rounded-2xl p-6">
                <h3 className="text-white font-bold text-lg mb-6 text-center">Por qué elegirnos</h3>
                <div className="grid grid-cols-2 gap-6">
                  <AnimatedStat value="+150" label="Clientes activos" delay={0} />
                  <AnimatedStat value="98%" label="Satisfacción" delay={100} />
                  <AnimatedStat value="3x" label="Más conversiones" delay={200} />
                  <AnimatedStat value="<2h" label="Respuesta" delay={300} />
                </div>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-3 justify-center">
                {["SSL Seguro", "GDPR", "Soporte 24/7"].map((badge) => (
                  <span
                    key={badge}
                    className="bg-[#141418] border border-[#26262e] rounded-full px-4 py-2 text-gray-500 text-sm"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 border-t border-[#26262e]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-center mb-12">
            Preguntas <span className="text-[#E42C24]">frecuentes</span>
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "¿Cuánto tiempo tarda la implementación?",
                a: "Dependiendo del servicio, entre 1 y 2 semanas. Los chatbots básicos pueden estar listos en 48-72 horas.",
              },
              {
                q: "¿Necesito conocimientos técnicos?",
                a: "No. Nosotros nos encargamos de todo: configuración, integración y formación. Tú solo recibes los resultados.",
              },
              {
                q: "¿Qué pasa si no funciona para mi negocio?",
                a: "Ofrecemos una demo gratuita para validar que nuestra solución encaja con tu modelo de negocio antes de comprometerte.",
              },
              {
                q: "¿Puedo integrarlo con mi CRM actual?",
                a: "Sí, nos integramos con HubSpot, Salesforce, Pipedrive, Zoho y prácticamente cualquier CRM del mercado.",
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="bg-[#141418] border-3 border-[#26262e] rounded-2xl group"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-bold text-white pr-4">{faq.q}</span>
                  <span className="w-8 h-8 bg-[#26262e] rounded-lg flex items-center justify-center flex-shrink-0 group-open:bg-[#E42C24] transition">
                    <svg
                      className="w-4 h-4 text-gray-400 group-open:text-white group-open:rotate-180 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
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
              <Link href="/contacto" className="text-gray-500 hover:text-white transition text-sm">Contacto</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
