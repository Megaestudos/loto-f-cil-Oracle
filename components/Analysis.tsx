'use client'

import { useEffect, useState } from "react";
import { fetchHistory, LotofacilResult } from "@/lib/lottery-api";
import { Loader2, Zap, TrendingUp, TrendingDown, Activity, BarChart, PieChart, Shield, LayoutGrid, RotateCcw, Sigma } from "lucide-react";
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart as RePieChart, Pie } from 'recharts';
import { generateLotteryInsight } from "@/lib/gemini";

export function Analysis() {
  const [history, setHistory] = useState<LotofacilResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    async function loadAnalysis() {
      try {
        const data = await fetchHistory(50);
        setHistory(data);
        
        // Calcular métricas extras para a IA
        const metrics = calculateDeepMetrics(data);
        
        // Gerar insight da IA com dados enriquecidos
        const insight = await generateLotteryInsight(data);
        setAiInsight(insight || "");
      } catch (error) {
        console.error("Error loading analysis data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadAnalysis();
  }, []);

  function calculateDeepMetrics(data: LotofacilResult[]) {
    if (data.length < 2) return null;

    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23];
    const moldura = [1, 2, 3, 4, 5, 6, 10, 11, 15, 16, 20, 21, 22, 23, 24, 25];

    let totalPrimes = 0;
    let totalMoldura = 0;
    let totalSum = 0;
    let totalRepeated = 0;

    data.forEach((res, index) => {
      const nums = res.dezenas.map(n => parseInt(n));
      totalPrimes += nums.filter(n => primes.includes(n)).length;
      totalMoldura += nums.filter(n => moldura.includes(n)).length;
      totalSum += nums.reduce((a, b) => a + b, 0);

      if (index < data.length - 1) {
        const prevNums = data[index + 1].dezenas;
        totalRepeated += res.dezenas.filter(n => prevNums.includes(n)).length;
      }
    });

    return {
      avgPrimes: (totalPrimes / data.length).toFixed(1),
      avgMoldura: (totalMoldura / data.length).toFixed(1),
      avgSum: (totalSum / data.length).toFixed(0),
      avgRepeated: (totalRepeated / (data.length - 1)).toFixed(1),
    };
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-[#6edba6]">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-headline font-bold animate-pulse">Iniciando Varredura Deep Metrics...</p>
      </div>
    );
  }

  const metrics = calculateDeepMetrics(history);

  // Calculate frequencies
  const frequencies: { [key: string]: number } = {};
  history.forEach(res => {
    res.dezenas.forEach(num => {
      frequencies[num] = (frequencies[num] || 0) + 1;
    });
  });

  const frequencyData = Object.entries(frequencies)
    .map(([num, count]) => ({ num, count }))
    .sort((a, b) => b.count - a.count);

  const hotNumbers = frequencyData.slice(0, 5);
  const coldNumbers = frequencyData.slice(-5).reverse();

  // Parity analysis
  let totalPairs = 0;
  let totalOdds = 0;
  history.forEach(res => {
    res.dezenas.forEach(num => {
      if (parseInt(num) % 2 === 0) totalPairs++;
      else totalOdds++;
    });
  });

  const parityData = [
    { name: 'Pares', value: totalPairs, color: '#6edba6' },
    { name: 'Ímpares', value: totalOdds, color: '#e9c349' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[#6edba6] font-bold tracking-widest text-xs uppercase flex items-center gap-2">
            <Shield className="w-3 h-3 fill-[#6edba6]" />
            Oracle Pro Security & Intelligence
          </span>
          <h1 className="text-4xl font-extrabold text-[#e5e2e1] tracking-tight font-headline">Análise Profunda</h1>
          <p className="text-[#bdcac0]">Análise de padrões neurais e comportamentais de elite.</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-[#6edba6]/10 rounded-lg border border-[#6edba6]/20 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#6edba6] animate-ping" />
            <span className="text-xs font-bold text-[#6edba6] uppercase tracking-tighter">Motor Neural Ativo</span>
          </div>
        </div>
      </div>

      {/* Deep Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Média Primos', value: metrics?.avgPrimes, icon: Shield, color: 'text-[#6edba6]' },
          { label: 'Média Moldura', value: metrics?.avgMoldura, icon: LayoutGrid, color: 'text-[#e9c349]' },
          { label: 'Média Repetidos', value: metrics?.avgRepeated, icon: RotateCcw, color: 'text-[#ffb3b1]' },
          { label: 'Soma Média', value: metrics?.avgSum, icon: Sigma, color: 'text-[#bdcac0]' },
        ].map((m, i) => (
          <div key={i} className="bg-[#1c1b1b] p-6 rounded-3xl border border-white/5 hover:border-[#6edba6]/20 transition-all group">
            <m.icon className={`w-5 h-5 ${m.color} mb-4 opacity-50 group-hover:opacity-100 transition-opacity`} />
            <p className="text-[10px] uppercase font-black text-[#bdcac0]/40 mb-1">{m.label}</p>
            <p className="text-2xl font-black text-[#e5e2e1] tracking-tight">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Hot Numbers */}
        <div className="col-span-1 md:col-span-2 bg-[#1c1b1b] rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <TrendingUp className="w-32 h-32 text-[#6edba6]" />
          </div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-xl bg-[#6edba6]/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#6edba6]" />
            </div>
            <h3 className="font-black text-[#e5e2e1] font-headline uppercase text-sm tracking-widest">Dezenas Quentes</h3>
          </div>
          <div className="flex flex-wrap gap-4 relative z-10">
            {hotNumbers.map((item) => (
              <div key={item.num} className="flex-1 min-w-[70px] bg-[#2a2a2a] p-5 rounded-2xl border border-white/5 text-center space-y-2 group-hover:border-[#6edba6]/30 transition-all">
                <span className="text-3xl font-black text-[#6edba6]">{item.num}</span>
                <p className="text-[9px] uppercase font-black text-[#bdcac0]/60">{item.count}x Freq</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cold Numbers */}
        <div className="col-span-1 md:col-span-2 bg-[#1c1b1b] rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <TrendingDown className="w-32 h-32 text-[#ffb3b1]" />
          </div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-xl bg-[#ffb3b1]/10 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-[#ffb3b1]" />
            </div>
            <h3 className="font-black text-[#e5e2e1] font-headline uppercase text-sm tracking-widest">Dezenas Frias</h3>
          </div>
          <div className="flex flex-wrap gap-4 relative z-10">
            {coldNumbers.map((item) => (
              <div key={item.num} className="flex-1 min-w-[70px] bg-[#2a2a2a] p-5 rounded-2xl border border-white/5 text-center space-y-2 group-hover:border-[#ffb3b1]/30 transition-all">
                <span className="text-3xl font-black text-[#ffb3b1]">{item.num}</span>
                <p className="text-[9px] uppercase font-black text-[#bdcac0]/60">{item.count}x Freq</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Frequency Chart */}
        <div className="lg:col-span-2 bg-[#1c1b1b] rounded-3xl p-10 border border-white/5 shadow-2xl">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <BarChart className="w-5 h-5 text-[#6edba6]" />
              <h3 className="font-black text-[#e5e2e1] font-headline uppercase text-sm tracking-widest">Distribuição de Frequência</h3>
            </div>
            <span className="text-[10px] font-black text-[#bdcac0]/40 uppercase tracking-widest">Amostra: 50 Concursos</span>
          </div>
          <div className="h-[300px] w-full">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                <ReBarChart data={frequencyData.slice(0, 15)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                  <XAxis 
                    dataKey="num" 
                    stroke="#bdcac0" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
                  />
                  <YAxis 
                    stroke="#bdcac0" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '12px' }}
                    itemStyle={{ color: '#6edba6', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {frequencyData.slice(0, 15).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index < 5 ? '#6edba6' : '#353534'} />
                    ))}
                  </Bar>
                </ReBarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Parity Chart */}
        <div className="bg-[#1c1b1b] rounded-3xl p-10 border border-white/5 shadow-2xl">
          <div className="flex items-center gap-3 mb-10">
            <PieChart className="w-5 h-5 text-[#e9c349]" />
            <h3 className="font-black text-[#e5e2e1] font-headline uppercase text-sm tracking-widest">Equilíbrio P/I</h3>
          </div>
          <div className="h-[250px] w-full relative">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                <RePieChart>
                  <Pie
                    data={parityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {parityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            )}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-[10px] uppercase font-black text-[#bdcac0]/40 tracking-tighter">Total</p>
              <p className="text-3xl font-black text-[#e5e2e1] tracking-tighter">{totalPairs + totalOdds}</p>
            </div>
          </div>
          <div className="mt-10 space-y-3">
            {parityData.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-black text-[#bdcac0] uppercase tracking-widest">{item.name}</span>
                </div>
                <span className="text-sm font-black text-[#e5e2e1]">
                  {Math.round((item.value / (totalPairs + totalOdds)) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Deep Insight */}
      <div className="bg-gradient-to-br from-[#1c1b1b] to-[#0a0a0a] rounded-[40px] p-10 md:p-14 border border-[#6edba6]/10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#6edba6]/5 blur-[120px] rounded-full -mr-64 -mt-64 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#e9c349]/5 blur-[100px] rounded-full -ml-32 -mb-32" />
        
        <div className="relative z-10 space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-3xl bg-[#6edba6]/10 flex items-center justify-center text-[#6edba6] shadow-inner">
                <Zap className="w-7 h-7 fill-[#6edba6]" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-[#e5e2e1] font-headline tracking-tight">Insight Profundo do Oráculo</h3>
                <p className="text-[#6edba6] font-bold text-xs uppercase tracking-widest mt-1">Análise Baseada em Redes Neurais v4.2</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-black/40 rounded-full border border-white/5 backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-[#6edba6] animate-pulse" />
              <span className="text-[10px] font-black text-[#bdcac0] uppercase tracking-widest">Previsão em Tempo Real</span>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] backdrop-blur-sm">
            <p className="text-xl md:text-2xl text-[#e5e2e1] leading-relaxed font-medium italic">
              &quot;{aiInsight || "Calibrando tensores neurais e processando histórico estatístico..."}&quot;
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-10 pt-4">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-14 h-14 rounded-full border-4 border-[#0a0a0a] bg-gradient-to-tr from-[#1c1b1b] to-[#2a2a2a] flex items-center justify-center shadow-2xl relative">
                   <div className="absolute inset-0 rounded-full border border-[#6edba6]/20" />
                   <span className="text-[10px] font-black text-[#6edba6]">MOD 0{i}</span>
                </div>
              ))}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-black text-[#e5e2e1]">Protocolo Multi-Agente Ativado</p>
              <p className="text-xs text-[#bdcac0]">Cruzamento de dados entre modelos Flash 2.0 Pro e Deep Research.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
