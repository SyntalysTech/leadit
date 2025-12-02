"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

// Tipos para la conversación
interface CallMessage {
  role: "agent" | "user";
  content: string;
}

// Demo de llamada interactiva con IA real
function CallDemo() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<CallMessage[]>([]);
  const [callEnded, setCallEnded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Auto-scroll a últimos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Configurar reconocimiento de voz
  useEffect(() => {
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "es-ES";
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const playAudio = async (text: string): Promise<void> => {
    return new Promise(async (resolve) => {
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
            resolve();
          };
          audioRef.current.onerror = () => {
            setIsSpeaking(false);
            resolve();
          };
          await audioRef.current.play();
        } else {
          resolve();
        }
      } catch (error) {
        console.error("Error playing audio:", error);
        setIsSpeaking(false);
        resolve();
      }
    });
  };

  const getAIResponse = async (conversation: CallMessage[]): Promise<string> => {
    try {
      const response = await fetch("/api/call-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversation }),
      });

      if (!response.ok) throw new Error("API error");

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Error getting AI response:", error);
      return "Disculpa, ha habido un problema de conexión. ¿Podemos continuar?";
    }
  };

  const startCall = async () => {
    setIsCallActive(true);
    setCallEnded(false);
    setMessages([]);
    setIsLoading(true);

    const greeting = "¡Hola, buenos días! Soy Laura de Leadit. ¿Hablo con el responsable de ventas o marketing de la empresa?";
    setMessages([{ role: "agent", content: greeting }]);
    setIsLoading(false);
    await playAudio(greeting);
  };

  const sendMessage = async () => {
    if (!userInput.trim() || isLoading || isSpeaking) return;

    const userMessage = userInput.trim();
    setUserInput("");

    // Añadir mensaje del usuario
    const updatedMessages: CallMessage[] = [...messages, { role: "user", content: userMessage }];
    setMessages(updatedMessages);

    // Obtener respuesta de IA
    setIsLoading(true);
    const aiResponse = await getAIResponse(updatedMessages);

    // Verificar si la conversación debe terminar
    const shouldEnd = aiResponse.includes("[FIN_LLAMADA]");
    const cleanResponse = aiResponse.replace("[FIN_LLAMADA]", "").trim();

    setMessages(prev => [...prev, { role: "agent", content: cleanResponse }]);
    setIsLoading(false);

    // Reproducir audio
    await playAudio(cleanResponse);

    if (shouldEnd) {
      setCallEnded(true);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Tu navegador no soporta reconocimiento de voz");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const endCall = () => {
    setIsCallActive(false);
    setMessages([]);
    setCallEnded(false);
    setIsSpeaking(false);
    setIsListening(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
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
                    Habla con Laura, nuestra agente IA con voz real. Responde por texto o micrófono.
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
                  <div className="p-4 text-center border-b border-[#26262e]">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-12 h-12 bg-[#E42C24] rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-white">L</span>
                      </div>
                      <div className="text-left">
                        <h3 className="text-base font-bold text-white">Laura - Leadit</h3>
                        <p className="text-green-400 text-xs flex items-center gap-2">
                          {isSpeaking ? (
                            <>
                              <span className="flex gap-0.5">
                                <span className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                <span className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                <span className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                              </span>
                              Hablando...
                            </>
                          ) : isLoading ? (
                            "Pensando..."
                          ) : (
                            "En llamada"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Conversation */}
                  <div className="flex-1 p-3 overflow-y-auto space-y-3">
                    {messages.map((msg, i) => (
                      <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
                        {msg.role === "agent" && (
                          <div className="w-7 h-7 bg-[#E42C24] rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-bold text-white">L</span>
                          </div>
                        )}
                        <div className={`rounded-2xl p-3 max-w-[80%] ${
                          msg.role === "user"
                            ? "bg-[#E42C24] rounded-tr-sm"
                            : "bg-[#26262e] rounded-tl-sm"
                        }`}>
                          <p className="text-sm text-white">{msg.content}</p>
                        </div>
                        {msg.role === "user" && (
                          <div className="w-7 h-7 bg-[#3a3a3a] rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-bold text-white">Tú</span>
                          </div>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-2">
                        <div className="w-7 h-7 bg-[#E42C24] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-bold text-white">L</span>
                        </div>
                        <div className="bg-[#26262e] rounded-2xl rounded-tl-sm p-3">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input area */}
                  <div className="p-3 border-t border-[#26262e]">
                    {!callEnded ? (
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Escribe tu respuesta..."
                          disabled={isLoading || isSpeaking}
                          className="flex-1 bg-[#26262e] text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E42C24] disabled:opacity-50"
                        />
                        <button
                          onClick={toggleListening}
                          disabled={isLoading || isSpeaking}
                          className={`w-11 h-11 rounded-xl flex items-center justify-center transition ${
                            isListening
                              ? "bg-red-500 animate-pulse"
                              : "bg-[#26262e] hover:bg-[#3a3a3a]"
                          } disabled:opacity-50`}
                          title="Hablar por micrófono"
                        >
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                        </button>
                        <button
                          onClick={sendMessage}
                          disabled={!userInput.trim() || isLoading || isSpeaking}
                          className="w-11 h-11 bg-[#E42C24] rounded-xl flex items-center justify-center shadow-[0_3px_0_#a01d17] hover:shadow-[0_1px_0_#a01d17] hover:translate-y-0.5 transition disabled:opacity-50 disabled:hover:translate-y-0"
                        >
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <p className="text-center text-green-400 text-sm py-2">Llamada finalizada</p>
                    )}
                    <div className="flex justify-center mt-3">
                      <button
                        onClick={endCall}
                        className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-[0_3px_0_#b91c1c]"
                      >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

  const stepIcons = [
    <svg key="inbox" className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>,
    <svg key="robot" className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    <svg key="calendar" className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    <svg key="bell" className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
    <svg key="check" className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  ];

  const steps = [
    { icon: stepIcons[0], label: "Lead entra", desc: "Nuevo contacto desde web" },
    { icon: stepIcons[1], label: "IA califica", desc: "Análisis automático" },
    { icon: stepIcons[2], label: "Agenda cita", desc: "Slot en calendario" },
    { icon: stepIcons[3], label: "Notifica", desc: "Email + WhatsApp" },
    { icon: stepIcons[4], label: "CRM actualizado", desc: "Todo sincronizado" },
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
                  { icon: <svg className="w-6 h-6 text-[#E42C24]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth={2}/><circle cx="12" cy="12" r="3" strokeWidth={2}/></svg>, text: "Voces naturales en español con ElevenLabs" },
                  { icon: <svg className="w-6 h-6 text-[#E42C24]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>, text: "Llamadas entrantes y salientes 24/7" },
                  { icon: <svg className="w-6 h-6 text-[#E42C24]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>, text: "Entiende contexto y objeciones" },
                  { icon: <svg className="w-6 h-6 text-[#E42C24]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>, text: "Transcripción y análisis automático" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="flex-shrink-0">{item.icon}</span>
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
                  { icon: <svg className="w-6 h-6 text-[#E42C24]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>, text: "Respuestas naturales con GPT-4" },
                  { icon: <svg className="w-6 h-6 text-[#E42C24]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>, text: "WhatsApp Business API integrada" },
                  { icon: <svg className="w-6 h-6 text-[#E42C24]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>, text: "Escalado inteligente a humanos" },
                  { icon: <svg className="w-6 h-6 text-[#E42C24]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>, text: "Analíticas y métricas en tiempo real" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="flex-shrink-0">{item.icon}</span>
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
              { num: "5000+", label: "Apps conectadas", icon: <svg className="w-10 h-10 text-[#E42C24]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg> },
              { num: "100%", label: "Sin código", icon: <svg className="w-10 h-10 text-[#E42C24]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
              { num: "24/7", label: "Funcionando", icon: <svg className="w-10 h-10 text-[#E42C24]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
              { num: "<1s", label: "Tiempo respuesta", icon: <svg className="w-10 h-10 text-[#E42C24]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth={2}/><circle cx="12" cy="12" r="3" strokeWidth={2}/></svg> },
            ].map((stat, i) => (
              <div key={i} className="bg-[#141418] border-3 border-[#26262e] rounded-2xl p-6 text-center">
                <span className="mb-3 flex justify-center">{stat.icon}</span>
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
                  { icon: <svg className="w-6 h-6 text-[#E42C24]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>, text: "Equipo hispanohablante nativo" },
                  { icon: <svg className="w-6 h-6 text-[#E42C24]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth={2}/><circle cx="12" cy="12" r="3" strokeWidth={2}/></svg>, text: "Especialistas en tu sector" },
                  { icon: <svg className="w-6 h-6 text-[#E42C24]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, text: "Citas agendadas en tu calendario" },
                  { icon: <svg className="w-6 h-6 text-[#E42C24]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, text: "Pago por resultados" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="flex-shrink-0">{item.icon}</span>
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
