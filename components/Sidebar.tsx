import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  History, 
  BarChart3, 
  Zap, 
  Wand2, 
  HelpCircle, 
  LogOut,
  Plus,
  LogIn,
  TrendingUp,
  User as UserIcon
} from "lucide-react";
import { auth, loginWithGoogle, logout } from "@/lib/firebase";
import { useAuth } from "@/components/FirebaseProvider";
import { useEffect, useState } from "react";
import Image from "next/image";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ activeTab, setActiveTab, isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'results', label: 'Resultados', icon: History },
    { id: 'stats', label: 'Estatísticas', icon: BarChart3 },
    { id: 'saved', label: 'Meus Jogos', icon: TrendingUp },
    { id: 'analysis', label: 'Análise Pro', icon: Zap },
    { id: 'generator', label: 'Gerador', icon: Wand2 },
    { id: 'profile', label: 'Perfil', icon: UserIcon },
  ];

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen w-64 z-50 bg-[#1c1b1b] flex flex-col border-r border-white/5 shadow-[4px_0_24px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-in-out lg:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="px-6 py-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-[#e9c349] font-headline">Lotofácil Oracle</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#bdcac0]/50 mt-1 font-sans">Intelligence Portal</p>
        </div>
        <button onClick={onClose} className="lg:hidden text-white/40 hover:text-white transition-colors">
          <History className="w-5 h-5 rotate-45" /> 
        </button>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex items-center gap-3 px-6 py-4 font-headline font-semibold text-sm transition-all hover:bg-[#2a2a2a] relative group",
              activeTab === item.id 
                ? "bg-[#6edba6]/10 text-[#6edba6] border-r-4 border-[#6edba6]" 
                : "text-white/40 hover:text-white/80"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6">
        {user && (
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
            <div className="w-10 h-10 rounded-full overflow-hidden relative border border-[#6edba6]/30">
              <Image 
                src={user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`} 
                alt="User" 
                fill 
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user.displayName}</p>
              <p className="text-[10px] text-[#bdcac0] truncate">Premium User</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto border-t border-white/5">
        <button className="w-full flex items-center gap-3 text-white/40 hover:text-white/80 px-6 py-4 text-sm font-semibold transition-all hover:bg-[#2a2a2a]">
          <HelpCircle className="w-5 h-5" />
          <span>Suporte</span>
        </button>
        {user && (
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 text-white/40 hover:text-white/80 px-6 py-4 text-sm font-semibold transition-all hover:bg-[#2a2a2a]"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        )}
      </div>
    </aside>
  );
}
