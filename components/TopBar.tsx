import { Search, Settings, Menu, LogOut, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { logout } from "@/lib/firebase";
import { cn } from "@/lib/utils";

interface TopBarProps {
  onOpenSidebar: () => void;
  onSearch?: (contest: string) => void;
}

export function TopBar({ onOpenSidebar, onSearch }: TopBarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <header className="fixed top-0 right-0 lg:left-64 left-0 z-40 bg-[#131313]/80 backdrop-blur-xl flex justify-between items-center px-4 md:px-8 h-20 border-b border-white/10 shadow-2xl shadow-black/40 transition-all">
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenSidebar}
          className="lg:hidden p-2 -ml-2 text-white/60 hover:text-[#6edba6] transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="text-[#6edba6] font-headline text-sm font-medium tracking-wide hidden sm:inline-block uppercase">Analista Oracle</span>
        <div className="h-10 w-10 rounded-full bg-[#353534] border border-[#6edba6]/20 flex items-center justify-center overflow-hidden relative">
          <Image 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Oracle" 
            alt="Avatar" 
            fill
            unoptimized={true}
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <input 
            className="bg-[#0e0e0e] border-none text-xs md:text-sm px-4 py-2 pl-9 md:pl-10 rounded-lg w-32 md:w-64 focus:ring-1 focus:ring-[#6edba6] text-[#e5e2e1] placeholder-[#bdcac0]/20 transition-all" 
            placeholder="Buscar concurso..." 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 text-[#bdcac0]/40 w-3.5 h-3.5 md:w-4 md:h-4" />
        </form>
        
        <div className="relative">
          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={cn(
              "text-white/60 hover:text-[#6edba6] transition-all p-2 rounded-lg hover:bg-white/5",
              isSettingsOpen && "text-[#6edba6] bg-white/5"
            )}
          >
            <Settings className={cn("w-5 h-5", isSettingsOpen && "rotate-90 transition-transform duration-300")} />
          </button>

          {isSettingsOpen && (
            <>
              <div className="fixed inset-0 z-0" onClick={() => setIsSettingsOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-[#1c1b1b] border border-white/5 rounded-xl shadow-2xl p-1 z-10 animate-in fade-in zoom-in duration-200">
                <button 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors font-bold"
                >
                  {isLoggingOut ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4" />
                  )}
                  {isLoggingOut ? 'Saindo...' : 'Sair da Conta'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
