import { useState, useEffect } from "react";
import { auth, db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { cn } from "@/lib/utils";
import { Trash2, Loader2, Calendar, TrendingUp, Edit2, Check, X, Target, Award } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { fetchLatestResult, LotofacilResult } from "@/lib/lottery-api";

export function SavedBets() {
  const [user, setUser] = useState<User | null>(null);
  const [bets, setBets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [latestResult, setLatestResult] = useState<LotofacilResult | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    async function loadLatest() {
      try {
        const res = await fetchLatestResult();
        setLatestResult(res);
      } catch (error) {
        console.error("Error loading latest result for check:", error);
      }
    }
    loadLatest();
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        setBets([]);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const path = `users/${user.uid}/bets`;
    const q = query(
      collection(db, path),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const betsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBets(betsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const deleteBet = async (betId: string) => {
    if (!user) return;

    try {
      const path = `users/${user.uid}/bets/${betId}`;
      await deleteDoc(doc(db, `users/${user.uid}/bets`, betId));
      setConfirmDeleteId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/bets/${betId}`);
    }
  };

  const startEditing = (bet: any) => {
    setEditingId(bet.id);
    setEditTitle(bet.title || "");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const updateBet = async (betId: string) => {
    if (!user) return;

    try {
      const path = `users/${user.uid}/bets/${betId}`;
      await updateDoc(doc(db, `users/${user.uid}/bets`, betId), {
        title: editTitle
      });
      setEditingId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}/bets/${betId}`);
    }
  };

  const countHits = (betNumbers: number[]) => {
    if (!latestResult) return 0;
    const resultNumbers = latestResult.dezenas.map(n => parseInt(n));
    return betNumbers.filter(n => resultNumbers.includes(n)).length;
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-[#bdcac0]/20">
          <TrendingUp className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-[#e5e2e1]">Acesse sua conta</h2>
        <p className="text-[#bdcac0] max-w-xs">Faça login com sua conta Google para salvar e gerenciar seus palpites estratégicos.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#6edba6]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <span className="text-[#6edba6] font-bold tracking-widest text-xs uppercase">Meus Jogos</span>
          <h1 className="text-4xl font-extrabold text-[#e5e2e1] tracking-tight font-headline">Palpites Salvos</h1>
          <p className="text-[#bdcac0]">Gerencie seus jogos gerados pelo algoritmo e acompanhe suas estatísticas.</p>
        </div>
        <div className="bg-[#1c1b1b] px-4 py-2 rounded-lg border border-white/5">
          <span className="text-xs text-[#bdcac0] font-bold uppercase">Total: {bets.length}</span>
        </div>
      </div>

      {bets.length === 0 ? (
        <div className="bg-[#1c1b1b] rounded-xl p-12 text-center border border-white/5">
          <p className="text-[#bdcac0]">Você ainda não salvou nenhum palpite.</p>
          <p className="text-xs text-[#bdcac0]/60 mt-2">Vá para o Gerador e clique no ícone de salvar em um dos jogos sugeridos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bets.map((bet) => {
            const hits = countHits(bet.numbers);
            const isWinner = hits >= 11;
            
            return (
              <div key={bet.id} className={cn(
                "bg-[#1c1b1b] rounded-xl p-6 border transition-all group relative overflow-hidden",
                isWinner ? "border-[#6edba6]/40 shadow-[0_0_20px_rgba(110,219,166,0.1)]" : "border-white/5 hover:border-[#6edba6]/30"
              )}>
                {isWinner && (
                  <div className="absolute -top-1 -right-1 p-2 bg-[#6edba6] text-[#003823] rounded-bl-xl z-10">
                    <Award className="w-4 h-4" />
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    {editingId === bet.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="bg-[#2a2a2a] border border-white/10 rounded px-2 py-1 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#6edba6] w-full"
                          placeholder="Nome do jogo..."
                          autoFocus
                        />
                        <button onClick={() => updateBet(bet.id)} className="text-[#6edba6] hover:text-[#6edba6]/80">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={cancelEditing} className="text-[#ffb4ab] hover:text-[#ffb4ab]/80">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#e5e2e1] truncate">
                          {bet.title || "Jogo sem nome"}
                        </h3>
                        <button 
                          onClick={() => startEditing(bet)}
                          className="p-1 rounded text-[#bdcac0] hover:text-[#6edba6] opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-[#bdcac0] mt-1">
                      <Calendar className="w-3 h-3" />
                      <span className="text-[10px] font-bold uppercase">
                        {bet.createdAt?.toDate ? format(bet.createdAt.toDate(), "dd 'de' MMMM", { locale: ptBR }) : 'Recentemente'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {confirmDeleteId === bet.id ? (
                      <div className="flex items-center gap-1 bg-[#ffb4ab]/10 rounded-lg p-1 animate-in fade-in zoom-in duration-200">
                        <span className="text-[9px] font-bold text-[#ffb4ab] px-1 uppercase">Excluir?</span>
                        <button 
                          onClick={() => deleteBet(bet.id)}
                          className="p-1 rounded bg-[#ffb4ab] text-[#690005] hover:bg-[#ffb4ab]/80 transition-all"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => setConfirmDeleteId(null)}
                          className="p-1 rounded bg-white/10 text-[#bdcac0] hover:bg-white/20 transition-all"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setConfirmDeleteId(bet.id)}
                        className="p-1.5 rounded-lg text-[#bdcac0] hover:text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {latestResult && (
                  <div className="mb-4 p-3 bg-[#0e0e0e] rounded-lg border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className={cn("w-4 h-4", isWinner ? "text-[#6edba6]" : "text-[#bdcac0]")} />
                      <span className="text-[10px] font-black uppercase text-[#bdcac0]">Concurso {latestResult.concurso}</span>
                    </div>
                    <div className="text-right">
                      <span className={cn(
                        "text-lg font-black",
                        hits >= 14 ? "text-[#e9c349]" : hits >= 11 ? "text-[#6edba6]" : "text-[#e5e2e1]"
                      )}>
                        {hits} <span className="text-[10px] font-bold uppercase opacity-60">Acertos</span>
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {bet.numbers.map((n: number) => {
                    const isHit = latestResult?.dezenas.map(d => parseInt(d)).includes(n);
                    return (
                      <span 
                        key={n} 
                        className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all",
                          isHit 
                            ? "bg-[#6edba6] text-[#003823] border-[#6edba6] shadow-[0_0_10px_rgba(110,219,166,0.2)]" 
                            : "bg-[#2a2a2a] text-[#e5e2e1] border-white/5"
                        )}
                      >
                        {n.toString().padStart(2, '0')}
                      </span>
                    );
                  })}
                </div>

                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/5">
                  <div className="text-center">
                    <p className="text-[9px] text-[#bdcac0] uppercase font-bold">Prob.</p>
                    <p className="text-xs font-black text-[#6edba6]">{bet.probability}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] text-[#bdcac0] uppercase font-bold">Soma</p>
                    <p className="text-xs font-black text-[#e5e2e1]">{bet.sum}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] text-[#bdcac0] uppercase font-bold">P/I</p>
                    <p className="text-xs font-black text-[#e5e2e1]">{bet.pairs}/{bet.odds}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
