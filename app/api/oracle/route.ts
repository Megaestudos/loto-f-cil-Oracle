import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || "";

export async function POST(req: Request) {
  try {
    const { historyData } = await req.json();

    if (!API_KEY) {
      console.error("GEMINI_API_KEY não encontrada no ambiente.");
      return NextResponse.json({ error: "O Oráculo está offline no momento (API Key ausente)." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
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
    console.error("Erro na API do Oráculo:", error);
    return NextResponse.json({ error: "O Oráculo está processando novos padrões. Tente novamente em breve." }, { status: 500 });
  }
}
