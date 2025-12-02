"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";

// Demo de llamada interactiva
function CallDemo() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [callStep, setCallStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const callScript = [
    {
      agent: "Hola, buenos días. Soy Laura de Leadit. ¿Hablo con el responsable de ventas?",
      user: "Sí, soy yo. ¿En qué puedo ayudarte?",
    },
    {
      agent: "Perfecto. Le llamo porque hemos ayudado a empresas como la suya a triplicar sus ventas cualificadas. ¿Tiene dos minutos para contarle cómo?",
      user: "Sí, cuéntame.",
    },
    {
      agent: "Excelente. Nuestro equipo de setters cualifica leads antes de pasarlos a su equipo comercial. Solo hablan con prospectos listos para comprar. ¿Le interesaría una demo gratuita?",
      user: "Sí, me interesa.",
    },
    {
      agent: "Genial. Le envío un enlace para agendar la demo. ¿Cuál es su email?",
      user: null,
    },
  ];

  const playAudio = async (text: string) => {
    setIsLoading(true);
    setIsSpeaking(true);
    try {
      const response = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error("Audio error");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };
        await audioRef.current.play();
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsSpeaking(false);
    } finally {
      setIsLoading(false);
    }
  };

  const startCall = async () => {
    setIsCallActive(true);
    setCallStep(0);
    await playAudio(callScript[0].agent);
  };

  const nextStep = async () => {
    if (callStep < callScript.length - 1) {
      const nextStepIndex = callStep + 1;
      setCallStep(nextStepIndex);
      await playAudio(callScript[nextStepIndex].agent);
    } else {
      setIsCallActive(false);
      setCallStep(0);
    }
  };

  const endCall = () => {
    setIsCallActive(false);
    setCallStep(0);
    setIsSpeaking(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div className="relative">
      <audio ref={audioRef} />

      {/* Phone mockup */}
      <div className="max-w-sm mx-auto">
        <div className="bg-[#1a1a1a] rounded-[3rem] p-3 shadow-2xl border-4 border-[#2a2a2a]">
          <div className="bg-[#0c0c10] rounded-[2.5rem] overflow-hidden">
            {/* Phone notch */}
            <div className="h-8 bg-[#0c0c10] flex justify-center items-end pb-1">
              <div className="w-20 h-5 bg-[#1a1a1a] rounded-full"></div>
            </div>

            {/* Call screen */}
            <div className="h-[500px] flex flex-col">
              {!isCallActive ? (
                // Idle state
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                  <div className="w-24 h-24 bg-[#E42C24] rounded-full flex items-center justify-center mb-6 shadow-[0_4px_0_#a01d17]">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Demo Call Center IA</h3>
                  <p className="text-gray-400 text-center text-sm mb-8">
                    Experimenta una llamada real con nuestro agente de voz IA
                  </p>
                  <button
                    onClick={startCall}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-2xl transition shadow-[0_4px_0_#16a34a] hover:shadow-[0_2px_0_#16a34a] hover:translate-y-0.5"
                  >
                    Iniciar llamada demo
                  </button>
                </div>
              ) : (
                // Active call
                <div className="flex-1 flex flex-col">
                  {/* Call header */}
                  <div className="p-6 text-center border-b border-[#26262e]">
                    <div className="w-16 h-16 bg-[#E42C24] rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl font-bold text-white">L</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">Laura - Leadit</h3>
                    <p className="text-green-400 text-sm flex items-center justify-center gap-2">
                      {isSpeaking && (
                        <span className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                        </span>
                      )}
                      {isSpeaking ? "Hablando..." : "En llamada"}
                    </p>
                  </div>

                  {/* Conversation */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {callScript.slice(0, callStep + 1).map((step, i) => (
                      <div key={i} className="space-y-3">
                        <div className="flex gap-2">
                          <div className="w-8 h-8 bg-[#E42C24] rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-white">L</span>
                          </div>
                          <div className="bg-[#26262e] rounded-2xl rounded-tl-sm p-3 max-w-[85%]">
                            <p className="text-sm text-white">{step.agent}</p>
                          </div>
                        </div>
                        {step.user && i <= callStep && (
                          <div className="flex gap-2 justify-end">
                            <div className="bg-[#E42C24] rounded-2xl rounded-tr-sm p-3 max-w-[85%]">
                              <p className="text-sm text-white">{step.user}</p>
                            </div>
                            <div className="w-8 h-8 bg-[#3a3a3a] rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-white">Tú</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Call actions */}
                  <div className="p-4 border-t border-[#26262e]">
                    {callScript[callStep].user && !isSpeaking && (
                      <button
                        onClick={nextStep}
                        disabled={isLoading}
                        className="w-full bg-[#26262e] hover:bg-[#3a3a3a] text-white font-medium py-3 px-6 rounded-xl mb-3 transition"
                      >
                        &quot;{callScript[callStep].user}&quot;
                      </button>
                    )}
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={endCall}
                        className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center shadow-[0_3px_0_#b91c1c]"
                      >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Demo de Chatbot interactivo
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function ChatbotDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "¡Hola! Soy el asistente virtual de tu empresa. ¿En qué puedo ayudarte hoy?" },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const demoResponses: Record<string, string> = {
    "precios": "Nuestros planes empiezan desde 299€/mes para el plan Starter. Incluye hasta 1000 conversaciones mensuales, integración con WhatsApp y soporte por email. ¿Te gustaría que te cuente más sobre los planes?",
    "horario": "Estamos disponibles 24/7 gracias a la automatización. Para atención humana, nuestro horario es de Lunes a Viernes de 9:00 a 18:00. ¿Necesitas hablar con alguien ahora?",
    "demo": "¡Genial! Puedo agendarte una demo gratuita de 30 minutos. ¿Qué día te vendría mejor: mañana a las 10:00 o el jueves a las 16:00?",
    "servicios": "Ofrecemos: 1) Chatbots inteligentes para WhatsApp y web, 2) Call centers virtuales con IA, 3) Setters y closers profesionales, 4) Automatizaciones de workflows. ¿Cuál te interesa más?",
  };

  const quickActions = [
    { label: "Ver precios", value: "precios" },
    { label: "Horario", value: "horario" },
    { label: "Agendar demo", value: "demo" },
    { label: "Servicios", value: "servicios" },
  ];

  const handleQuickAction = async (value: string) => {
    const userMessage = quickActions.find(a => a.value === value)?.label || value;

    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsTyping(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const response = demoResponses[value] || "Gracias por tu mensaje. Un agente se pondrá en contacto contigo pronto.";
    setMessages(prev => [...prev, { role: "assistant", content: response }]);
    setIsTyping(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-[#141418] border-4 border-[#26262e] rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-[#0c0c10] px-5 py-4 border-b-4 border-[#26262e] flex items-center gap-4">
          <div className="w-12 h-12 bg-[#E42C24] rounded-xl flex items-center justify-center shadow-[0_3px_0_#a01d17]">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-white">Asistente Virtual</h3>
            <p className="text-green-400 text-sm">Online 24/7</p>
          </div>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                msg.role === "user"
                  ? "bg-[#E42C24] text-white rounded-br-sm"
                  : "bg-[#26262e] text-gray-100 rounded-bl-sm"
              }`}>
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#26262e] px-4 py-3 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="p-4 border-t-4 border-[#26262e] bg-[#0c0c10]">
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => handleQuickAction(action.value)}
                disabled={isTyping}
                className="bg-[#26262e] hover:bg-[#3a3a3a] text-white text-sm px-4 py-2 rounded-xl transition disabled:opacity-50"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Workflow animation
function WorkflowDemo() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { icon: "📥", label: "Lead entra", desc: "Nuevo contacto desde web" },
    { icon: "🤖", label: "IA califica", desc: "Análisis automático" },
    { icon: "📅", label: "Agenda cita", desc: "Slot en calendario" },
    { icon: "📧", label: "Notifica", desc: "Email + WhatsApp" },
    { icon: "✅", label: "CRM actualizado", desc: "Todo sincronizado" },
  ];

  useState(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  });

  return (
    <div className="relative py-8">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center relative z-10">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl transition-all duration-500 ${
              i <= activeStep
                ? "bg-[#E42C24] shadow-[0_4px_0_#a01d17] scale-110"
                : "bg-[#26262e]"
            }`}>
              {step.icon}
            </div>
            <p className={`mt-3 font-bold text-sm sm:text-base transition-colors ${i <= activeStep ? "text-white" : "text-gray-500"}`}>
              {step.label}
            </p>
            <p className="text-xs text-gray-500 hidden sm:block">{step.desc}</p>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div className="absolute left-full top-8 sm:top-10 w-full h-1 -translate-y-1/2">
                <div className={`h-full transition-all duration-500 ${
                  i < activeStep ? "bg-[#E42C24]" : "bg-[#26262e]"
                }`} style={{ width: i < activeStep ? "100%" : "0%" }}></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ServiciosPage() {
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
              <Link href="/servicios" className="text-white font-medium">Servicios</Link>
              <Link href="/#proceso" className="text-gray-300 hover:text-white transition font-medium">Proceso</Link>
              <Link href="/#contacto" className="text-gray-300 hover:text-white transition font-medium">Contacto</Link>
              <Link href="/#contacto" className="btn-3d text-base px-6 py-3">
                Empezar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="badge-cartoon mx-auto mb-6">
            <span className="w-2 h-2 bg-[#E42C24] rounded-full animate-pulse"></span>
            Demos Interactivas
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
            Prueba nuestros servicios <span className="text-brand">en vivo</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            No te lo contamos, te lo mostramos. Interactúa con nuestras demos y
            descubre el poder de la automatización inteligente.
          </p>
        </div>
      </section>

      {/* Service 1: Call Center IA */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="number-cartoon mb-4">01</div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Call Center Virtual con IA</h2>
              <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                Agentes de voz que suenan 100% naturales. Realizan y reciben llamadas,
                califican leads y agendan citas mientras duermes.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: "🎯", text: "Voces naturales en español con ElevenLabs" },
                  { icon: "📞", text: "Llamadas entrantes y salientes 24/7" },
                  { icon: "🧠", text: "Entiende contexto y objeciones" },
                  { icon: "📊", text: "Transcripción y análisis automático" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-gray-300">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="img-frame">
                <img
                  src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop"
                  alt="Call center profesional"
                  className="w-full h-auto"
                />
              </div>
            </div>

            <div>
              <p className="text-center text-gray-500 mb-4 text-sm uppercase tracking-wider">
                Demo interactiva - Haz una llamada real
              </p>
              <CallDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Service 2: Chatbot */}
      <section className="py-20 px-4 bg-[#0a0a0c]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <p className="text-center text-gray-500 mb-4 text-sm uppercase tracking-wider">
                Demo interactiva - Prueba el chatbot
              </p>
              <ChatbotDemo />
            </div>

            <div className="order-1 lg:order-2">
              <div className="number-cartoon mb-4">02</div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Chatbots Inteligentes</h2>
              <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                Asistentes virtuales que entienden, responden y convierten. Integrados
                con WhatsApp, web y redes sociales.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: "💬", text: "Respuestas naturales con GPT-4" },
                  { icon: "📱", text: "WhatsApp Business API integrada" },
                  { icon: "🔄", text: "Escalado inteligente a humanos" },
                  { icon: "📈", text: "Analíticas y métricas en tiempo real" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-gray-300">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="img-frame">
                <img
                  src="https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=600&h=400&fit=crop"
                  alt="Chat en móvil"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service 3: Automatizaciones */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="number-cartoon mx-auto mb-4">03</div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Automatizaciones con IA</h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Flujos de trabajo inteligentes que conectan todas tus herramientas.
              Mira cómo un lead se convierte en cliente sin intervención manual.
            </p>
          </div>

          <div className="bg-[#141418] border-4 border-[#26262e] rounded-3xl p-8 mb-12">
            <p className="text-center text-gray-500 mb-6 text-sm uppercase tracking-wider">
              Animación en vivo - Flujo automatizado
            </p>
            <WorkflowDemo />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: "5000+", label: "Apps conectadas", icon: "🔗" },
              { num: "100%", label: "Sin código", icon: "🚀" },
              { num: "24/7", label: "Funcionando", icon: "⚡" },
              { num: "<1s", label: "Tiempo respuesta", icon: "🎯" },
            ].map((stat, i) => (
              <div key={i} className="bg-[#141418] border-3 border-[#26262e] rounded-2xl p-6 text-center">
                <span className="text-4xl mb-3 block">{stat.icon}</span>
                <div className="text-3xl font-bold text-brand mb-1">{stat.num}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service 4: Closers & Setters */}
      <section className="py-20 px-4 bg-[#0a0a0c]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="number-cartoon mb-4">04</div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Closers & Setters Profesionales</h2>
              <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                Equipo humano especializado en cualificar leads y cerrar ventas.
                Tú solo hablas con prospectos listos para comprar.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: "👥", text: "Equipo hispanohablante nativo" },
                  { icon: "🎯", text: "Especialistas en tu sector" },
                  { icon: "📅", text: "Citas agendadas en tu calendario" },
                  { icon: "💰", text: "Pago por resultados" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-gray-300">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="img-frame">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop"
                  alt="Profesional de ventas"
                  className="w-full h-auto"
                />
              </div>
              <div className="img-frame mt-8">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=500&fit=crop"
                  alt="Profesional de ventas"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            ¿Listo para <span className="text-brand">transformar</span> tu negocio?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Agenda una llamada con nuestro equipo y diseñemos juntos tu estrategia de automatización.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-[#26262e]">
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
              <Link href="/" className="text-gray-500 hover:text-white transition text-sm">Home</Link>
              <Link href="/servicios" className="text-gray-500 hover:text-white transition text-sm">Servicios</Link>
              <a href="#" className="text-gray-500 hover:text-white transition text-sm">Privacidad</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
