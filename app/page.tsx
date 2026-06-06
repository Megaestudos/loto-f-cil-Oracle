'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { Dashboard } from '@/components/Dashboard';
import { Generator } from '@/components/Generator';
import { SavedBets } from '@/components/SavedBets';
import { Profile } from '@/components/Profile';
import { Results } from '@/components/Results';
import { Stats } from '@/components/Stats';
import { Analysis } from '@/components/Analysis';
import { LayoutDashboard, History, Zap, Wand2, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Page() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  return (
    <div className="min-h-screen bg-[#131313] overflow-x-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsSidebarOpen(false);
        }} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <TopBar onOpenSidebar={() => setIsSidebarOpen(true)} />
      
      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <main className="lg:ml-64 pt-24 md:pt-28 px-4 md:px-8 pb-32 md:pb-12 transition-all">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'generator' && <Generator />}
          {activeTab === 'saved' && <SavedBets />}
          {activeTab === 'profile' && <Profile />}
          {activeTab === 'results' && <Results />}
          {activeTab === 'stats' && <Stats />}
          {activeTab === 'analysis' && <Analysis />}
          
          {/* Placeholder for other tabs */}
          {(activeTab !== 'dashboard' && activeTab !== 'generator' && activeTab !== 'saved' && activeTab !== 'profile' && activeTab !== 'results' && activeTab !== 'stats' && activeTab !== 'analysis') && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-[#bdcac0]">
              <h2 className="text-2xl font-bold font-headline mb-2">Em breve</h2>
              <p>Esta funcionalidade está em desenvolvimento.</p>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Nav for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#1c1b1b]/90 backdrop-blur-xl border-t border-white/5 px-2 pb-6 pt-2 flex justify-around">
        {['dashboard', 'generator', 'results', 'analysis'].map((tab) => {
          const icons: Record<string, any> = {
            dashboard: LayoutDashboard,
            results: History,
            analysis: Zap,
            generator: Wand2,
          };
          const labels: Record<string, string> = {
            dashboard: 'Home',
            results: 'Loterias',
            analysis: 'Oracle',
            generator: 'Gerar',
          };
          const Icon = icons[tab];
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex flex-col items-center gap-1 p-2 min-w-[70px] transition-all",
                activeTab === tab ? "text-[#6edba6]" : "text-white/40"
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase tracking-tight">{labels[tab]}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
