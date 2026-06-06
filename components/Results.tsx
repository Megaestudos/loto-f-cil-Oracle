'use client'

import { useEffect, useState } from "react";
import { fetchHistory, LotofacilResult } from "@/lib/lottery-api";
import { Loader2, Calendar, Trophy, Users, Landmark, ChevronDown, ChevronUp } from "lucide-react";

export function Results() {
  const [results, setResults] = useState<LotofacilResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    async function loadResults() {
      try {
        const data = await fetchHistory(15);
        setResults(data);
      } catch (error) {
        console.error("Error loading results:", error);
      } finally {
        setLoading(false);
      }
    }
    loadResults();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-[#6edba6]">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-headline font-bold animate-pulse">Carregando últimos sorteios...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[#6edba6] font-bold tracking-widest text-xs uppercase">Histórico Oficial</span>
        <h1 className="text-4xl font-extrabold text-[#e5e2e1] tracking-tight font-headline">Resultados</h1>
        <p className="text-[#bdcac0]">Confira os últimos concursos e o rateio detalhado da Lotofácil.</p>
      </div>

      <div className="grid gap-4">
        {results.map((result) => (
          <div 
            key={result.concurso} 
            className="bg-[#1c1b1b] rounded-2xl border border-white/5 overflow-hidden transition-all hover:border-white/10"
          >
            <div 
              className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
              onClick={() => setExpandedId(expandedId === result.concurso ? null : result.concurso)}
            >
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-[#bdcac0] tracking-wider">Concurso</span>
                  <span className="text-2xl font-black text-[#6edba6] font-headline">{result.concurso}</span>
                </div>
                <div className="h-10 w-px bg-white/10 hidden md:block" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-[#bdcac0] tracking-wider">Data</span>
                  <span className="text-sm font-bold text-[#e5e2e1] flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-[#6edba6]" />
                    {result.data}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 flex-1 md:justify-center">
                {result.dezenas.map((num) => (
                  <div 
                    key={num}
                    className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center text-[#e5e2e1] text-xs font-bold border border-white/5"
                  >
                    {num}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 justify-between md:justify-end">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] uppercase font-bold text-[#bdcac0] tracking-wider">Acumulou</span>
                  <p className={`text-xs font-bold ${result.acumulou ? 'text-[#ffb3b1]' : 'text-[#6edba6]'}`}>
                    {result.acumulou ? 'SIM' : 'NÃO'}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-white/5 text-[#bdcac0]">
                  {expandedId === result.concurso ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>
            </div>

            {expandedId === result.concurso && (
              <div className="px-6 pb-8 pt-2 border-t border-white/5 bg-[#161515]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  {result.premiacoes.slice(0, 3).map((premio, idx) => (
                    <div key={idx} className="bg-[#1c1b1b] p-4 rounded-xl border border-white/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#bdcac0] uppercase tracking-tighter">{premio.descricao}</span>
                        <Trophy className={`w-4 h-4 ${idx === 0 ? 'text-[#e9c349]' : 'text-[#bdcac0]'}`} />
                      </div>
                      <div>
                        <p className="text-lg font-black text-[#e5e2e1]">
                          {premio.ganhadores} <span className="text-xs font-normal text-[#bdcac0]">ganhadores</span>
                        </p>
                        <p className="text-sm font-bold text-[#6edba6]">
                          R$ {premio.valor_pago != null ? premio.valor_pago.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="w-10 h-10 rounded-full bg-[#0e0e0e] flex items-center justify-center text-[#e9c349]">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#bdcac0]">Local do Sorteio</p>
                      <p className="text-sm font-bold text-[#e5e2e1]">Espaço da Sorte - São Paulo, SP</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="w-10 h-10 rounded-full bg-[#0e0e0e] flex items-center justify-center text-[#6edba6]">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#bdcac0]">Arrecadação Total</p>
                      <p className="text-sm font-bold text-[#e5e2e1]">R$ 18.450.230,50</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
