'use client'

import { useEffect, useState } from "react";
import { fetchHistory, LotofacilResult } from "@/lib/lottery-api";
import { Loader2, Zap, TrendingUp, TrendingDown, Activity, BarChart, PieChart } from "lucide-react";
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart as RePieChart, Pie } from 'recharts';
import { generateLotteryInsight } from "@/lib/gemini";

export function Analysis() {
  const [history, setHistory] = useState<LotofacilResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState<string>("");

  useEffect(() => {
    async function loadAnalysis() {
      try {
        const data = await fetchHistory(50);
        setHistory(data);
        
        // Gerar insight da IA após carregar os dados
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-[#6edba6]">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-headline font-bold animate-pulse">Processando Big Data estatístico...</p>
      </div>
    );
  }

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
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[#6edba6] font-bold tracking-widest text-xs uppercase flex items-center gap-2">
            <Zap className="w-3 h-3 fill-[#6edba6]" />
            Oracle Pro Intelligence
          </span>
          <h1 className="text-4xl font-extrabold text-[#e5e2e1] tracking-tight font-headline">Análise Pro</h1>
          <p className="text-[#bdcac0]">Padrões matemáticos e tendências baseadas nos últimos 50 concursos.</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/5 flex items-center gap-3">
            <Activity className="w-4 h-4 text-[#6edba6]" />
            <span className="text-xs font-bold text-[#e5e2e1]">IA Ativa</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Hot Numbers */}
        <div className="col-span-1 md:col-span-2 bg-[#1c1b1b] rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-[#6edba6]" />
            <h3 className="font-bold text-[#e5e2e1] font-headline">Dezenas Quentes</h3>
          </div>
          <div className="flex flex-wrap gap-4">
            {hotNumbers.map((item) => (
              <div key={item.num} className="flex-1 min-w-[80px] bg-[#2a2a2a] p-4 rounded-xl border border-white/5 text-center space-y-2">
                <span className="text-2xl font-black text-[#6edba6]">{item.num}</span>
                <p className="text-[10px] uppercase font-bold text-[#bdcac0]">{item.count}x</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cold Numbers */}
        <div className="col-span-1 md:col-span-2 bg-[#1c1b1b] rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <TrendingDown className="w-5 h-5 text-[#ffb3b1]" />
            <h3 className="font-bold text-[#e5e2e1] font-headline">Dezenas Frias</h3>
          </div>
          <div className="flex flex-wrap gap-4">
            {coldNumbers.map((item) => (
              <div key={item.num} className="flex-1 min-w-[80px] bg-[#2a2a2a] p-4 rounded-xl border border-white/5 text-center space-y-2">
                <span className="text-2xl font-black text-[#ffb3b1]">{item.num}</span>
                <p className="text-[10px] uppercase font-bold text-[#bdcac0]">{item.count}x</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Frequency Chart */}
        <div className="lg:col-span-2 bg-[#1c1b1b] rounded-2xl p-8 border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <BarChart className="w-5 h-5 text-[#6edba6]" />
              <h3 className="font-bold text-[#e5e2e1] font-headline">Frequência de Dezenas</h3>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <ReBarChart data={frequencyData.slice(0, 15)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                <XAxis 
                  dataKey="num" 
                  stroke="#bdcac0" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#bdcac0" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1c1b1b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#6edba6' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {frequencyData.slice(0, 15).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index < 5 ? '#6edba6' : '#353534'} />
                  ))}
                </Bar>
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Parity Chart */}
        <div className="bg-[#1c1b1b] rounded-2xl p-8 border border-white/5">
          <div className="flex items-center gap-3 mb-8">
            <PieChart className="w-5 h-5 text-[#e9c349]" />
            <h3 className="font-bold text-[#e5e2e1] font-headline">Equilíbrio P/I</h3>
          </div>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <RePieChart>
                <Pie
                  data={parityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {parityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1c1b1b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
              </RePieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-[10px] uppercase font-bold text-[#bdcac0]">Total</p>
              <p className="text-xl font-black text-[#e5e2e1]">{totalPairs + totalOdds}</p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {parityData.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-bold text-[#bdcac0]">{item.name}</span>
                </div>
                <span className="text-sm font-black text-[#e5e2e1]">
                  {Math.round((item.value / (totalPairs + totalOdds)) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#1c1b1b] to-[#0e0e0e] rounded-3xl p-10 border border-[#6edba6]/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#6edba6]/5 blur-[100px] rounded-full -mr-32 -mt-32" />
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#6edba6]/10 flex items-center justify-center text-[#6edba6]">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-[#e5e2e1] font-headline">Insight do Oráculo</h3>
          </div>
          <p className="text-lg text-[#bdcac0] leading-relaxed max-w-3xl italic">
            &quot;{aiInsight || "Processando dados neurais para gerar o melhor insight estatístico..."}&quot;
          </p>
          <div className="flex items-center gap-6 pt-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#1c1b1b] bg-[#2a2a2a] flex items-center justify-center text-[10px] font-bold text-[#6edba6]">
                  AI
                </div>
              ))}
            </div>
            <p className="text-xs text-[#bdcac0]">Análise gerada por 3 modelos neurais independentes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
