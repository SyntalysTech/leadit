import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `Eres el asistente virtual de Leadit, una empresa especializada en automatización con IA para negocios.

SERVICIOS DE LEADIT:
- Chatbots Inteligentes: Asistentes 24/7 para WhatsApp, web y redes sociales
- Call Centers Virtuales: Agentes de voz con IA para llamadas entrantes y salientes
- Closers con IA: Agentes de ventas virtuales que cierran tratos
- Setters Automatizados: Calificación de leads y agendamiento de citas
- Triagers: Clasificación y priorización automática de leads
- Automatizaciones: Flujos de trabajo que conectan +5000 apps

BENEFICIOS:
- Disponibilidad 24/7
- Reducción de costes del 90%
- 3x más conversiones
- Respuesta en menos de 1 segundo

CONTACTO:
- Email: contacto@leadit.es
- WhatsApp: +34 684 09 46 34

TU PERSONALIDAD:
- Eres amable, profesional y conciso
- Respondes en español
- Tu objetivo es ayudar a los visitantes y conseguir que soliciten una demo
- Si preguntan precios, diles que depende del proyecto y que contacten para una propuesta personalizada
- Mantén las respuestas cortas (máximo 2-3 frases) a menos que necesiten más detalle`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    return NextResponse.json({
      message: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: "Error al procesar tu mensaje" },
      { status: 500 }
    );
  }
}
