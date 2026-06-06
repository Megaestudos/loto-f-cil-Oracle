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

export default function Page() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-[#131313]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <TopBar />
      
      <main className="ml-64 pt-28 px-8 pb-12">
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
      </main>
    </div>
  );
}
