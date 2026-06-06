import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY || "";

// Re-usando a lógica do lib/gemini.ts no lado do servidor
export async function POST(req: Request) {
  try {
    const { historyData } = await req.json();

    if (!API_KEY) {
      return NextResponse.json({ error: "Chave API não configurada no servidor." }, { status: 500 });
    }

    const client = new GoogleGenAI({ apiKey: API_KEY });
    
    const response = await client.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [{
            text: `
              Você é o "Oráculo da Lotofácil", uma IA especialista em análise estatística e probabilística de loterias brasileiras.
              Analise os seguintes dados dos últimos sorteios:
              ${JSON.stringify(historyData.slice(0, 10))}

              Com base nesses dados, gere um insight curto, profissional e persuasivo (em português) para o usuário.
              Fale sobre tendências de dezenas (quentes/frias), equilíbrio de pares/ímpares ou comportamento da moldura.
              Mantenha o texto com no máximo 3 frases.
              Não use markdown exagerado, apenas texto corrido e aspas.
            `
          }]
        }
      ]
    });

    const text = response.text || "Insight não disponível.";
    return NextResponse.json({ insight: text });

  } catch (error: any) {
    console.error("Erro na API do Oráculo:", error);
    return NextResponse.json({ error: "Erro ao processar análise estatística." }, { status: 500 });
  }
}
