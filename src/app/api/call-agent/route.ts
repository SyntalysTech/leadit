import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface CallMessage {
  role: "agent" | "user";
  content: string;
}

const SYSTEM_PROMPT = `Eres Laura, una agente de ventas profesional de Leadit que habla español de España (no latinoamericano).
Tu objetivo es cualificar leads y agendar demos para los servicios de Leadit.

SOBRE LEADIT:
- Leadit ofrece: chatbots inteligentes, call centers virtuales con IA, setters y closers profesionales (humanos), y automatizaciones con IA
- Ayudamos a empresas a triplicar sus ventas cualificadas
- Nuestros setters cualifican leads antes de pasarlos al equipo comercial
- Solo pasamos prospectos listos para comprar

INSTRUCCIONES:
- Habla de manera natural, profesional pero cercana
- Usa expresiones españolas (vale, genial, perfecto, estupendo)
- Sé concisa, frases cortas como en una llamada real
- Haz preguntas para cualificar: tamaño empresa, sector, problema actual, urgencia
- Tu objetivo final es conseguir agendar una demo o conseguir el email del prospecto
- Si el usuario no está interesado, agradece y despídete amablemente
- Si consigues el email o agendar demo, despídete añadiendo [FIN_LLAMADA] al final de tu mensaje
- Si el usuario dice que no le interesa claramente o se despide, añade [FIN_LLAMADA] al final

IMPORTANTE: Responde SOLO con lo que dirías en la llamada, sin explicaciones ni texto adicional. Máximo 2-3 frases por respuesta.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json() as { messages: CallMessage[] };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages required" }, { status: 400 });
    }

    // Convertir formato de mensajes
    const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((msg) => ({
        role: msg.role === "agent" ? "assistant" : "user",
        content: msg.content,
      } as OpenAI.Chat.ChatCompletionMessageParam)),
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: openaiMessages,
      max_tokens: 150,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || "Disculpa, ¿puedes repetir?";

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Call agent error:", error);
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 }
    );
  }
}
