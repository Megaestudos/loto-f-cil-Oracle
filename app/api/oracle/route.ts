// v2.0.4 - Enhanced prompt for Deep Analysis metrics
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || "";

export async function POST(req: Request) {
  try {
    const { historyData } = await req.json();

    if (!API_KEY) {
      console.error("[Oracle API] GEMINI_API_KEY não encontrada no ambiente Vercel.");
      return NextResponse.json(
        { error: "O Oráculo está offline. Configure GEMINI_API_KEY no Vercel." },
        { status: 500 }
      );
    }

    if (!historyData || !Array.isArray(historyData)) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    // Calcular estatísticas profundas para o prompt
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23];
    const moldura = [1, 2, 3, 4, 5, 6, 10, 11, 15, 16, 20, 21, 22, 23, 24, 25];
    
    const latest = historyData[0]?.dezenas?.map((n: string) => parseInt(n)) || [];
    const prev = historyData[1]?.dezenas?.map((n: string) => parseInt(n)) || [];
    
    const stats = {
      primesCount: latest.filter(n => primes.includes(n)).length,
      molduraCount: latest.filter(n => moldura.includes(n)).length,
      repeatedCount: latest.filter(n => prev.includes(n)).length,
      sum: latest.reduce((a, b) => a + b, 0),
    };

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: { temperature: 0.7, topP: 0.8, topK: 40 }
    });

    const prompt = `
      Você é o "Oráculo da Lotofácil v4.2", uma IA de elite em análise probabilística.
      Dados do último concurso:
      - Dezenas: ${historyData[0]?.dezenas?.join(', ')}
      - Soma: ${stats.sum}
      - Primos: ${stats.primesCount}
      - Moldura: ${stats.molduraCount}
      - Repetidos do anterior: ${stats.repeatedCount}

      Histórico recente (últimos 10):
      ${JSON.stringify(historyData.slice(0, 10))}

      Com base nesses indicadores e na tendência estatística, gere um insight místico, porém matemático e profissional.
      Fale sobre a força de um padrão específico (ex: "A moldura está saturando" ou "Os primos devem recuar").
      Mantenha o texto com exatamente 2 ou 3 frases curtas e impactantes.
      Use um tom de consultor de elite. Não use markdown.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ insight: text });

  } catch (error: any) {
    console.error("[Oracle API] Erro:", error?.message);
    return NextResponse.json(
      { error: "O Oráculo está recalculando as probabilidades.", details: error?.message },
      { status: 500 }
    );
  }
}
