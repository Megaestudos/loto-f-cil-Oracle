import { GoogleGenerativeAI } from "@google/genai";

// A chave deve ser configurada no arquivo .env.local como NEXT_PUBLIC_GEMINI_API_KEY
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Gera uma análise baseada no histórico da Lotofácil.
 */
export async function generateLotteryInsight(historyData: any[]) {
  if (!API_KEY) {
    return "Configuração de IA pendente. Configure a chave API para receber insights do Oráculo.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Você é o "Oráculo da Lotofácil", uma IA especialista em análise estatística e probabilística de loterias brasileiras.
      Analise os seguintes dados dos últimos sorteios:
      ${JSON.stringify(historyData.slice(0, 10))}

      Com base nesses dados, gere um insight curto, profissional e persuasivo (em português) para o usuário.
      Fale sobre tendências de dezenas (quentes/frias), equilíbrio de pares/ímpares ou comportamento da moldura.
      Mantenha o texto com no máximo 3 frases.
      Não use markdown exagerado, apenas texto corrido e aspas.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Erro ao gerar insight da IA:", error);
    return "O Oráculo está processando novos padrões. Tente novamente em breve.";
  }
}
