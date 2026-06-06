import { Search, Bell, Settings } from "lucide-react";
import Image from "next/image";

export function TopBar() {
  return (
    <header className="fixed top-0 right-0 left-64 z-40 bg-[#131313]/80 backdrop-blur-xl flex justify-between items-center px-8 h-20 border-b border-white/10 shadow-2xl shadow-black/40">
      <div className="flex items-center gap-4">
        <span className="text-[#6edba6] font-headline text-sm font-medium tracking-wide">Analista Oracle</span>
        <div className="h-10 w-10 rounded-full bg-[#353534] border border-[#6edba6]/20 flex items-center justify-center overflow-hidden relative">
          <Image 
            src="https://picsum.photos/seed/oracle-analyst/100/100" 
            alt="Avatar" 
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative flex items-center">
          <input 
            className="bg-[#0e0e0e] border-none text-sm px-4 py-2 pl-10 rounded-lg w-64 focus:ring-1 focus:ring-[#6edba6] text-[#e5e2e1] placeholder-[#bdcac0]/40" 
            placeholder="Buscar concurso..." 
            type="text" 
          />
          <Search className="absolute left-3 text-[#bdcac0] w-4 h-4" />
        </div>
        
        <div className="flex gap-4">
          <button className="text-white/60 hover:text-[#6edba6] transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#e9c349] rounded-full border border-[#131313]" />
          </button>
          <button className="text-white/60 hover:text-[#6edba6] transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
