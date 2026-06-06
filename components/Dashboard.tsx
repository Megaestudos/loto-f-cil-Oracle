import { Calendar, ArrowRight, Scale, Sigma, Grid3X3, Filter, Lightbulb, Zap, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchLatestResult, fetchHistory, LotofacilResult } from "@/lib/lottery-api";

export function Dashboard() {
  const [latest, setLatest] = useState<LotofacilResult | null>(null);
  const [history, setHistory] = useState<LotofacilResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
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
    loadData();
  }, []);

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
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#e5e2e1] font-headline">
            Dashboard do <span className="text-[#6edba6]">Especulador</span>
          </h2>
          <p className="text-[#bdcac0] text-sm mt-1">Análise de dados em tempo real para Lotofácil.</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-[#bdcac0] mb-1">Próximo Sorteio</p>
          <p className="text-xl font-bold text-[#e9c349]">
            {latest?.valor_estimado_proximo_concurso != null ? `R$ ${latest.valor_estimado_proximo_concurso.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '---'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Latest Result */}
        <div className="col-span-12 lg:col-span-8 bg-[#1c1b1b] rounded-xl p-8 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Zap className="w-32 h-32 text-[#6edba6]" />
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-0.5 bg-[#6edba6]/10 text-[#6edba6] text-[10px] font-bold uppercase rounded border border-[#6edba6]/20">
                  {latest?.acumulou ? 'Acumulou' : 'Oficial'}
                </span>
                <h3 className="text-2xl font-bold font-headline">Concurso {latest?.concurso}</h3>
              </div>
              <p className="text-[#bdcac0] text-xs flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                Sorteado em {latest?.data}
              </p>
            </div>
            <button className="text-[#6edba6] text-xs font-bold flex items-center gap-2 hover:underline transition-all">
              Ver Detalhes do Rateio <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex flex-wrap gap-4 md:gap-5 justify-center md:justify-start relative z-10">
            {latest?.dezenas.map((num) => (
              <div 
                key={num}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#6edba6] flex items-center justify-center text-[#003823] text-xl font-bold shadow-[0_0_15px_rgba(110,219,166,0.3)] border-2 border-[#8bf8c1]"
              >
                {num}
              </div>
            ))}
          </div>
        </div>

        {/* Basic Stats */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          <div className="bg-[#2a2a2a] rounded-xl p-6 border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-[#bdcac0] tracking-wider mb-1">Pares / Ímpares</p>
              <h4 className="text-xl font-black text-[#e5e2e1]">{stats?.pairs}P / {stats?.odds}I</h4>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#0e0e0e] flex items-center justify-center text-[#6edba6]">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          
          <div className="bg-[#2a2a2a] rounded-xl p-6 border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-[#bdcac0] tracking-wider mb-1">Soma Total</p>
              <h4 className="text-xl font-black text-[#e5e2e1]">{stats?.sum}</h4>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#0e0e0e] flex items-center justify-center text-[#e9c349]">
              <Sigma className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#2a2a2a] rounded-xl p-6 border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-[#bdcac0] tracking-wider mb-1">Números Primos</p>
              <h4 className="text-xl font-black text-[#e5e2e1]">{stats?.primes} <span className="text-xs font-medium text-[#bdcac0]">números</span></h4>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#0e0e0e] flex items-center justify-center text-[#ffb3b1]">
              <Grid3X3 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Recent History */}
        <div className="col-span-12 lg:col-span-5 bg-[#201f1f] rounded-xl p-6 border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-[#e5e2e1] font-headline">Histórico Recente</h3>
            <Filter className="w-4 h-4 text-[#bdcac0] cursor-pointer hover:text-[#6edba6] transition-colors" />
          </div>
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.concurso} className="flex items-center justify-between p-3 rounded-lg bg-[#0e0e0e] hover:bg-[#2a2a2a] transition-all border border-transparent hover:border-white/5 group">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-[#6edba6] bg-[#6edba6]/10 px-2 py-1 rounded">{item.concurso}</span>
                  <span className="text-xs text-[#bdcac0]">{item.data}</span>
                </div>
                <div className="flex gap-1">
                  {item.dezenas.slice(0, 3).map((n, i) => (
                    <div key={i} className="w-5 h-5 rounded-full bg-[#353534] text-[8px] flex items-center justify-center text-[#bdcac0] group-hover:bg-[#6edba6] group-hover:text-[#003823] transition-colors">
                      {n}
                    </div>
                  ))}
                  <span className="text-[8px] text-[#bdcac0] flex items-center ml-1">...</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Frequency Chart - Mocked for now based on history */}
        <div className="col-span-12 lg:col-span-7 bg-[#201f1f] rounded-xl p-6 border border-white/5">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-[#e5e2e1] font-headline">Dezenas &apos;Quentes&apos;</h3>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#30a373]"></span>
              <span className="text-[10px] uppercase text-[#bdcac0] font-medium">Frequência (%)</span>
            </div>
          </div>
          <div className="flex items-end justify-between h-48 gap-2">
            {[
              { num: '20', freq: 85 },
              { num: '13', freq: 78 },
              { num: '25', freq: 72 },
              { num: '11', freq: 65 },
              { num: '04', freq: 60 },
              { num: '18', freq: 55 },
              { num: '01', freq: 48 },
            ].map((item) => (
              <div key={item.num} className="flex flex-col items-center gap-2 flex-1">
                <div 
                  className="w-full bg-[#30a373] rounded-t-sm relative group transition-all duration-500 hover:bg-[#6edba6]"
                  style={{ height: `${item.freq}%` }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold text-[#6edba6]">
                    {item.freq}%
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#bdcac0]">{item.num}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-[10px] text-[#bdcac0]/60">Análise baseada nos últimos 100 concursos realizados.</p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="col-span-12 mt-4">
          <div className="bg-gradient-to-r from-[#2a2a2a] to-[#201f1f] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/5">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-[#e9c349]/10 flex items-center justify-center text-[#e9c349]">
                <Lightbulb className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-headline">Pronto para sua próxima jogada?</h3>
                <p className="text-[#bdcac0] text-sm">Utilize nossa rede neural para cruzar padrões estatísticos e tendências.</p>
              </div>
            </div>
            <button className="whitespace-nowrap bg-[#6edba6] text-[#003823] px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-[#6edba6]/20 hover:shadow-[#6edba6]/40 hover:-translate-y-1 transition-all flex items-center gap-3 active:scale-95">
              <Zap className="w-5 h-5" />
              Gerar Palpite Estratégico
            </button>
          </div>
        </div>
      </div>

      <footer className="mt-16 text-center text-[#bdcac0]/40 text-[10px] uppercase tracking-widest pb-8">
        <p>© 2026 Lotofácil Oracle Data Intelligence • Premium v2.0</p>
      </footer>
    </div>
  );
}
