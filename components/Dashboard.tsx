import { Calendar, ArrowRight, Scale, Sigma, Grid3X3, Filter, Lightbulb, Zap, Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchLatestResult, fetchHistory, fetchByConcurso, LotofacilResult } from "@/lib/lottery-api";
import { cn } from "@/lib/utils";

interface DashboardProps {
  searchQuery?: string;
}

export function Dashboard({ searchQuery }: DashboardProps) {
  const [latest, setLatest] = useState<LotofacilResult | null>(null);
  const [history, setHistory] = useState<LotofacilResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const [latestRes, historyRes] = await Promise.all([
        fetchLatestResult(),
        fetchHistory(5)
      ]);
      setLatest(latestRes);
      setHistory(historyRes);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  }, [searchQuery]);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const result = await fetchByConcurso(query);
      if (result) {
        setLatest(result);
      } else {
        alert("Concurso não encontrado ou erro na busca.");
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-[#6edba6]">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-headline font-bold animate-pulse">Sincronizando com a Caixa...</p>
      </div>
    );
  }

  const stats = latest ? {
    pairs: latest.dezenas.filter(n => parseInt(n) % 2 === 0).length,
    odds: latest.dezenas.filter(n => parseInt(n) % 2 !== 0).length,
    sum: latest.dezenas.reduce((acc, n) => acc + parseInt(n), 0),
    primes: latest.dezenas.filter(n => [2, 3, 5, 7, 11, 13, 17, 19, 23].includes(parseInt(n))).length
  } : null;

  return (
    <div className="space-y-8 md:space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#e5e2e1] font-headline">
              Dashboard do <span className="text-[#6edba6]">Especulador</span>
            </h2>
            {isSearching && <Loader2 className="w-5 h-5 text-[#6edba6] animate-spin" />}
          </div>
          <p className="text-[#bdcac0] text-xs md:text-sm">Análise de dados em tempo real para Lotofácil.</p>
        </div>
        <div className="text-left md:text-right bg-[#1c1b1b] p-4 rounded-2xl border border-white/5 w-full md:w-64 relative group overflow-hidden">
          <div className="absolute inset-0 bg-[#e9c349]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <p className="text-[9px] uppercase tracking-widest text-[#bdcac0]/60 mb-1 font-black">Próximo Sorteio • {latest?.proximo_concurso || '#'}</p>
          <p className="text-xl md:text-2xl font-black text-[#e9c349] drop-shadow-[0_0_10px_rgba(233,195,73,0.3)]">
            {latest?.valor_estimado_proximo_concurso != null ? `R$ ${latest.valor_estimado_proximo_concurso.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '---'}
          </p>
          <p className="text-[10px] text-[#bdcac0] mt-1 flex items-center md:justify-end gap-1 font-bold">
            <Calendar className="w-3 h-3 text-[#e9c349]" />
            Estimado para {latest?.data_proximo_concurso || '--/--/----'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Latest Result */}
        <div className="col-span-12 lg:col-span-8 bg-[#1c1b1b] rounded-3xl p-6 md:p-8 border border-white/5 relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Zap className="w-32 h-32 text-[#6edba6]" />
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={cn(
                  "px-2 py-0.5 text-[9px] font-black uppercase rounded border",
                  latest?.acumulou ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-[#6edba6]/10 text-[#6edba6] border-[#6edba6]/20"
                )}>
                  {latest?.acumulou ? 'Acumulou' : 'Oficial'}
                </span>
                <h3 className="text-xl md:text-2xl font-black font-headline">Concurso {latest?.concurso}</h3>
              </div>
              <p className="text-[#bdcac0] text-[10px] md:text-xs flex items-center gap-2 font-medium">
                <Calendar className="w-3 h-3 text-[#6edba6]" />
                Sorteado em {latest?.data}
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={loadData}
                className="p-2 bg-white/5 rounded-lg text-[#bdcac0] hover:text-[#6edba6] transition-colors"
                title="Sincronizar"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button className="bg-white/5 px-4 py-2 rounded-xl text-[#6edba6] text-[10px] font-black flex items-center gap-2 hover:bg-[#6edba6]/10 transition-all uppercase tracking-wider">
                Detalhes <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 md:gap-4 justify-between md:justify-start relative z-10">
            {latest?.dezenas.map((num) => (
              <div 
                key={num}
                className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-[#6edba6] flex items-center justify-center text-[#003823] text-lg md:text-xl font-black shadow-[0_8px_16px_rgba(110,219,166,0.2)] border-b-4 border-[#30a373] active:translate-y-1 transition-all"
              >
                {num}
              </div>
            ))}
          </div>
        </div>

        {/* Basic Stats */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          <div className="bg-[#1c1b1b] rounded-2xl p-5 border border-white/5 flex items-center justify-between group hover:border-[#6edba6]/20 transition-all shadow-lg">
            <div>
              <p className="text-[10px] uppercase font-black text-[#bdcac0]/40 tracking-wider mb-1">Pares / Ímpares</p>
              <h4 className="text-xl font-black text-[#e5e2e1] group-hover:text-[#6edba6] transition-colors">{stats?.pairs}P / {stats?.odds}I</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#6edba6]">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          
          <div className="bg-[#1c1b1b] rounded-2xl p-5 border border-white/5 flex items-center justify-between group hover:border-[#e9c349]/20 transition-all shadow-lg">
            <div>
              <p className="text-[10px] uppercase font-black text-[#bdcac0]/40 tracking-wider mb-1">Soma Total</p>
              <h4 className="text-xl font-black text-[#e5e2e1] group-hover:text-[#e9c349] transition-colors">{stats?.sum}</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#e9c349]">
              <Sigma className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#1c1b1b] rounded-2xl p-5 border border-white/5 flex items-center justify-between group hover:border-[#ffb3b1]/20 transition-all shadow-lg">
            <div>
              <p className="text-[10px] uppercase font-black text-[#bdcac0]/40 tracking-wider mb-1">Números Primos</p>
              <h4 className="text-xl font-black text-[#e5e2e1] group-hover:text-[#ffb3b1] transition-colors">{stats?.primes} <span className="text-[10px] font-medium text-[#bdcac0]/40 uppercase ml-1">Acertos</span></h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#ffb3b1]">
              <Grid3X3 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Recent History */}
        <div className="col-span-12 lg:col-span-5 bg-[#1c1b1b] rounded-3xl p-6 border border-white/5 shadow-xl">
          <div className="flex justify-between items-center mb-6 px-1">
            <h3 className="font-black text-[#e5e2e1] text-sm uppercase tracking-tighter">Histórico do Oracle</h3>
            <Filter className="w-4 h-4 text-[#bdcac0]/30 cursor-pointer hover:text-[#6edba6] transition-colors" />
          </div>
          <div className="space-y-2">
            {history.map((item) => (
              <button 
                key={item.concurso} 
                onClick={() => handleSearch(item.concurso.toString())}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] hover:bg-[#6edba6]/10 transition-all border border-transparent hover:border-[#6edba6]/20 group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-[#6edba6] bg-[#6edba6]/10 px-2 py-1 rounded-lg border border-[#6edba6]/20">{item.concurso}</span>
                  <span className="text-[10px] text-[#bdcac0]/60 font-bold">{item.data}</span>
                </div>
                <div className="flex gap-1.5">
                  {item.dezenas.slice(0, 5).map((n, i) => (
                    <div key={i} className="w-6 h-6 rounded-lg bg-black text-[9px] font-black flex items-center justify-center text-[#bdcac0] group-hover:bg-[#6edba6] group-hover:text-[#003823] transition-colors border border-white/5">
                      {n}
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Frequency Chart */}
        <div className="col-span-12 lg:col-span-7 bg-[#1c1b1b] rounded-3xl p-6 border border-white/5 shadow-xl">
          <div className="flex justify-between items-center mb-8 px-1">
            <h3 className="font-black text-[#e5e2e1] text-sm uppercase tracking-tighter">Frequência Relativa</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#30a373]"></span>
              <span className="text-[9px] uppercase text-[#bdcac0]/40 font-black tracking-widest font-mono">Heatmap %</span>
            </div>
          </div>
          <div className="flex items-end justify-between h-44 gap-2 md:gap-4 px-2">
            {[
              { num: '20', freq: 85 },
              { num: '13', freq: 78 },
              { num: '25', freq: 72 },
              { num: '11', freq: 65 },
              { num: '04', freq: 60 },
              { num: '18', freq: 55 },
              { num: '01', freq: 48 },
            ].map((item) => (
              <div key={item.num} className="flex flex-col items-center gap-3 flex-1 group cursor-help">
                <div 
                  className="w-full bg-[#30a373] rounded-xl relative transition-all duration-500 hover:bg-[#6edba6] shadow-lg group-hover:shadow-[#6edba6]/20"
                  style={{ height: `${item.freq}%` }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] opacity-0 group-hover:opacity-100 transition-opacity font-black text-[#6edba6] bg-black/50 px-1 py-0.5 rounded">
                    {item.freq}%
                  </div>
                </div>
                <span className="text-[10px] font-black text-[#bdcac0]/60 group-hover:text-white transition-colors">{item.num}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-4 border-t border-white/5 text-center">
            <p className="text-[9px] font-medium text-[#bdcac0]/20 uppercase tracking-widest italic">Processamento Oracle Data Neural Network</p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="col-span-12 mt-4">
          <div className="bg-gradient-to-br from-[#1c1b1b] to-[#0a0a0a] rounded-[40px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-[#6edba6]/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-[#e9c349]/10 flex items-center justify-center text-[#e9c349] shadow-inner shadow-[#e9c349]/20">
                <Lightbulb className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl md:text-2xl font-black font-headline tracking-tight">Próxima Jogada Mestra?</h3>
                <p className="text-[#bdcac0]/60 text-xs md:text-sm max-w-md font-medium">Nosso algoritmo proprietário está processando os padrões do concurso {latest?.proximo_concurso}.</p>
              </div>
            </div>
            <button className="whitespace-nowrap bg-[#6edba6] text-[#003823] px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-[#6edba6]/20 hover:shadow-[#6edba6]/40 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-3 relative z-10">
              <Zap className="w-5 h-5 fill-current" />
              GERAR PALPITE AGORA
            </button>
          </div>
        </div>
      </div>

      <footer className="mt-16 text-center text-[#bdcac0]/20 text-[9px] font-black uppercase tracking-[0.4em] pb-12 border-t border-white/5 pt-12">
        <p>© 2026 Lotofácil Oracle • Inteligência de Dados para Ganhadores • v2.8</p>
      </footer>
    </div>
  );
}
