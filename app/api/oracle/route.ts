// v2.0.3 - Migration to @google/generative-ai for better stability on Vercel
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

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

    if (!historyData || !Array.isArray(historyData)) {
      return NextResponse.json(
        { error: "Dados de histórico inválidos." },
        { status: 400 }
      );
    }

    // Inicializa o SDK oficial do Google Generative AI
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      Você é o "Oráculo da Lotofácil", uma IA especialista em análise estatística e probabilística de loterias brasileiras.
      Analise os seguintes dados dos últimos sorteios:
      ${JSON.stringify(historyData.slice(0, 10))}

      Com base nesses dados, gere um insight curto, profissional e persuasivo (em português) para o usuário.
      Fale sobre tendências de dezenas (quentes/frias), equilíbrio de pares/ímpares ou comportamento da moldura.
      Mantenha o texto com no máximo 3 frases curtas.
      Não use markdown exagerado, apenas texto corrido e aspas se necessário.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ insight: text });

  } catch (error: any) {
    // Log detalhado para depuração nos logs do Vercel
    console.error("[Oracle API] Erro detalhado:", {
      message: error?.message,
      status: error?.status,
      stack: error?.stack,
    });
    
    // Fallback amigável
    return NextResponse.json(
      { 
        error: "O Oráculo está processando novos padrões. Tente novamente em breve.",
        details: error?.message 
      },
      { status: 500 }
    );
  }
}
