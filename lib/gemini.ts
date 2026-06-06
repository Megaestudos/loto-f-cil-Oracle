/**
 * Gera uma análise baseada no histórico da Lotofácil chamando a API do servidor.
 */
export async function generateLotteryInsight(historyData: any[]) {
  try {
    const response = await fetch('/api/oracle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ historyData }),
    });

    if (!response.ok) {
      throw new Error('Falha ao obter insight do servidor');
    }

    const data = await response.json();
    return data.insight || data.error || "Insight não disponível.";
  } catch (error) {
    console.error("Erro ao chamar API do Oráculo:", error);
    return "O Oráculo está processando novos padrões. Tente novamente em breve.";
  }
}
