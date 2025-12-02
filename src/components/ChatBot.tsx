"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "¡Hola! Soy el asistente de Leadit. ¿En qué puedo ayudarte hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } catch {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Lo siento, ha ocurrido un error. Por favor, contacta directamente a contacto@leadit.es",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? "bg-[#26262e] rotate-0"
            : "bg-[#E42C24] shadow-[0_6px_0_#a01d17,0_8px_20px_rgba(228,44,36,0.4)] hover:translate-y-1 hover:shadow-[0_4px_0_#a01d17,0_6px_15px_rgba(228,44,36,0.3)]"
        }`}
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
      >
        {isOpen ? (
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Pulse animation when closed */}
      {!isOpen && (
        <span className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-2xl bg-[#E42C24] animate-ping opacity-30 pointer-events-none" />
      )}

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] transition-all duration-300 origin-bottom-right ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="bg-[#141418] border-4 border-[#26262e] rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[500px] sm:h-[550px]">
          {/* Header */}
          <div className="bg-[#0c0c10] px-5 py-4 border-b-4 border-[#26262e] flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-[#E42C24] rounded-xl flex items-center justify-center shadow-[0_3px_0_#a01d17]">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0c0c10]" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-lg">Leadit</h3>
              <p className="text-green-400 text-sm font-medium">Online ahora</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 rounded-xl bg-[#26262e] flex items-center justify-center hover:bg-[#32323c] transition"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                    message.role === "user"
                      ? "bg-[#E42C24] text-white rounded-br-md shadow-[0_3px_0_#a01d17]"
                      : "bg-[#26262e] text-gray-100 rounded-bl-md"
                  }`}
                >
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#26262e] px-5 py-4 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick actions */}
          <div className="px-4 pb-2 flex gap-2 flex-wrap">
            {messages.length <= 2 && (
              <>
                <button
                  onClick={() => {
                    setInput("¿Qué servicios ofrecéis?");
                    setTimeout(() => sendMessage(), 100);
                  }}
                  className="text-xs bg-[#26262e] hover:bg-[#32323c] text-gray-300 px-3 py-2 rounded-xl transition"
                  disabled={isLoading}
                >
                  Servicios
                </button>
                <button
                  onClick={() => {
                    setInput("Quiero una demo");
                    setTimeout(() => sendMessage(), 100);
                  }}
                  className="text-xs bg-[#26262e] hover:bg-[#32323c] text-gray-300 px-3 py-2 rounded-xl transition"
                  disabled={isLoading}
                >
                  Solicitar demo
                </button>
                <button
                  onClick={() => {
                    setInput("¿Cuánto cuesta?");
                    setTimeout(() => sendMessage(), 100);
                  }}
                  className="text-xs bg-[#26262e] hover:bg-[#32323c] text-gray-300 px-3 py-2 rounded-xl transition"
                  disabled={isLoading}
                >
                  Precios
                </button>
              </>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t-4 border-[#26262e] bg-[#0c0c10]">
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu mensaje..."
                disabled={isLoading}
                className="flex-1 bg-[#26262e] text-white placeholder-gray-500 px-4 py-3 rounded-xl border-2 border-transparent focus:border-[#E42C24] focus:outline-none transition text-[15px]"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  isLoading || !input.trim()
                    ? "bg-[#26262e] text-gray-600 cursor-not-allowed"
                    : "bg-[#E42C24] text-white shadow-[0_3px_0_#a01d17] hover:translate-y-0.5 hover:shadow-[0_2px_0_#a01d17] active:translate-y-1 active:shadow-none"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
