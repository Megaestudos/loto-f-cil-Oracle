export interface LotofacilResult {
  concurso: number;
  data: string;
  dezenas: string[];
  premiacoes: {
    descricao: string;
    faixa: number;
    ganhadores: number;
    valor_pago: number;
  }[];
  acumulou: boolean;
  proximo_concurso: number;
  data_proximo_concurso: string;
  valor_estimado_proximo_concurso: number;
}

export async function fetchLatestResult(): Promise<LotofacilResult> {
  try {
    const response = await fetch('https://loteriascaixa-api.herokuapp.com/api/lotofacil/latest');
    if (!response.ok) throw new Error('Failed to fetch lottery data');
    return await response.json();
  } catch (error) {
    console.error("Error fetching latest result:", error);
    // Fallback data if API is down
    return {
      concurso: 3120,
      data: "05/06/2026",
      dezenas: ["02", "03", "05", "06", "08", "09", "10", "13", "14", "15", "18", "19", "21", "24", "25"],
      premiacoes: [],
      acumulou: false,
      proximo_concurso: 3121,
      data_proximo_concurso: "06/06/2026",
      valor_estimado_proximo_concurso: 1700000
    };
  }
}

export async function fetchHistory(limit: number = 5): Promise<LotofacilResult[]> {
  try {
    const response = await fetch('https://loteriascaixa-api.herokuapp.com/api/lotofacil');
    if (!response.ok) throw new Error('Failed to fetch lottery history');
    const data = await response.json();
    return data.slice(0, limit);
  } catch (error) {
    console.error("Error fetching history:", error);
    return [];
  }
}
export async function fetchByConcurso(concurso: number | string): Promise<LotofacilResult | null> {
  try {
    const response = await fetch(`https://loteriascaixa-api.herokuapp.com/api/lotofacil/${concurso}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`Error fetching concurso ${concurso}:`, error);
    return null;
  }
}
