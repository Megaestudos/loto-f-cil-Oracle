// v2.0.2 - Force redeploy for Gemini 2.0 Flash
import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY || "";

export async function POST(req: Request) {
  try {
    const { historyData } = await req.json();

    if (!API_KEY) {
      console.error("[Oracle API] GEMINI_API_KEY não encontrada no ambiente Vercel.");
      return NextResponse.json(
        { error: "O Oráculo está offline (API Key ausente). Configure GEMINI_API_KEY nas variáveis de ambiente do Vercel." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const prompt = `
      Você é o "Oráculo da Lotofácil", uma IA especialista em análise estatística e probabilística de loterias brasileiras.
      Analise os seguintes dados dos últimos sorteios:
      ${JSON.stringify(historyData.slice(0, 10))}

      Com base nesses dados, gere um insight curto, profissional e persuasivo (em português) para o usuário.
      Fale sobre tendências de dezenas (quentes/frias), equilíbrio de pares/ímpares ou comportamento da moldura.
      Mantenha o texto com no máximo 3 frases curtas.
      Não use markdown exagerado, apenas texto corrido e aspas se necessário.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const text = response.text ?? "";

    return NextResponse.json({ insight: text });

  } catch (error: any) {
    // Log detalhado para depuração nos logs do Vercel
    console.error("[Oracle API] Erro detalhado:", {
      message: error?.message,
      status: error?.status,
      stack: error?.stack,
    });
    return NextResponse.json(
      { error: "O Oráculo está processando novos padrões. Tente novamente em breve." },
      { status: 500 }
    );
  }
}
