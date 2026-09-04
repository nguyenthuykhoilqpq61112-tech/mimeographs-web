import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BundlePresets } from './components/BundlePresets';
import { CatalogSection } from './components/CatalogSection';
import { ExpertModal } from './components/ExpertModal';
import { CouncilRoom } from './components/CouncilRoom';
import { BatchDock } from './components/BatchDock';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';
import { ChatWorkspace } from './components/ChatWorkspace';
import { ApiSettingsModal } from './components/ApiSettingsModal';
import { ExpertSummary, Language, LLMSettings } from './types';
import catalogSummary from './data/summary.json';
import { getStoredSettings } from './services/llm';

export function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('mimeo_lang');
    return (saved === 'zh' || saved === 'en') ? saved : 'zh';
  });

  // Default to 'chat' for immediate conversational experience!
  const [activeTab, setActiveTab] = useState<'chat' | 'catalog' | 'council'>('chat');
  const [currentChatSlug, setCurrentChatSlug] = useState<string>('steve-jobs');
  const [experts, setExperts] = useState<ExpertSummary[]>(catalogSummary.experts as ExpertSummary[]);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [selectedExpertForModal, setSelectedExpertForModal] = useState<ExpertSummary | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [llmSettings, setLlmSettings] = useState<LLMSettings>(getStoredSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('mimeo_lang', lang);
  }, [lang]);

  // Support hash routing (e.g. #/chat/steve-jobs or #/catalog)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#/', '');
      if (hash.startsWith('chat/')) {
        const slug = hash.split('/')[1];
        if (slug) setCurrentChatSlug(slug);
        setActiveTab('chat');
      } else if (hash === 'catalog') {
        setActiveTab('catalog');
      } else if (hash === 'council') {
        setActiveTab('council');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNotify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2500);
  };

  const handleToggleSelect = (slug: string) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleSelectBundle = (slugs: string[]) => {
    setSelectedSlugs((prev) => {
      const set = new Set([...prev, ...slugs]);
      return Array.from(set);
    });
    handleNotify(lang === 'en' ? 'Bundle selected!' : '已加入智囊团！');
  };

  const handleSelectAll = (slugs: string[]) => {
    setSelectedSlugs((prev) => {
      const set = new Set([...prev, ...slugs]);
      return Array.from(set);
    });
  };

  const handleClearSelection = () => {
    setSelectedSlugs([]);
  };

  const handleOpenChatWithExpert = (exp: ExpertSummary) => {
    setCurrentChatSlug(exp.slug);
    setActiveTab('chat');
    window.location.hash = `#/chat/${exp.slug}`;
  };

  return (
    <div
      className={`w-full flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 ${
        activeTab === 'chat' ? 'h-full overflow-hidden' : 'min-h-full'
      }`}
    >
      <Navbar
        lang={lang}
        setLang={setLang}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.location.hash = `#/${tab}`;
        }}
        selectedCount={selectedSlugs.length}
      />

      <main className={`flex-1 min-h-0 flex flex-col ${activeTab === 'chat' ? 'overflow-hidden' : ''}`}>
        {/* 1. DIRECT CHAT STUDIO */}
        {activeTab === 'chat' && (
          <ChatWorkspace
            experts={experts}
            currentSlug={currentChatSlug}
            onSelectExpert={(slug) => {
              setCurrentChatSlug(slug);
              window.location.hash = `#/chat/${slug}`;
            }}
            lang={lang}
            onNotify={handleNotify}
            llmSettings={llmSettings}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onBackToCatalog={() => setActiveTab('catalog')}
          />
        )}

        {/* 2. CATALOG BROWSER */}
        {activeTab === 'catalog' && (
          <>
            <Hero
              lang={lang}
              onExplore={() => {
                const el = document.getElementById('catalog');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenCouncil={() => setActiveTab('council')}
              onNotify={handleNotify}
            />

            <BundlePresets
              lang={lang}
              onSelectBundle={handleSelectBundle}
              selectedSlugs={selectedSlugs}
            />

            <CatalogSection
              experts={experts}
              lang={lang}
              onOpenDetail={(exp) => setSelectedExpertForModal(exp)}
              onOpenChat={handleOpenChatWithExpert}
              selectedSlugs={selectedSlugs}
              onToggleSelect={handleToggleSelect}
              onSelectAll={handleSelectAll}
              onClearSelection={handleClearSelection}
              onNotify={handleNotify}
            />
          </>
        )}

        {/* 3. PANTHEON MULTI-AGENT COUNCIL */}
        {activeTab === 'council' && (
          <CouncilRoom
            experts={experts}
            selectedSlugs={selectedSlugs}
            onToggleSelect={handleToggleSelect}
            lang={lang}
            onNotify={handleNotify}
          />
        )}
      </main>

      {/* Floating dock when items are selected */}
      {activeTab === 'catalog' && (
        <BatchDock
          selectedSlugs={selectedSlugs}
          lang={lang}
          onClear={handleClearSelection}
          onOpenCouncil={() => setActiveTab('council')}
          onNotify={handleNotify}
        />
      )}

      {/* Expert Specs Modal */}
      <ExpertModal
        expertSummary={selectedExpertForModal}
        lang={lang}
        onClose={() => setSelectedExpertForModal(null)}
        onNotify={handleNotify}
      />

      {/* API Settings Modal */}
      <ApiSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={llmSettings}
        onSave={(newSettings) => {
          setLlmSettings(newSettings);
          handleNotify(lang === 'en' ? 'Settings saved!' : '设置已更新！');
        }}
        lang={lang}
      />

      <Toast message={toastMessage} />

      {activeTab !== 'chat' && <Footer lang={lang} />}
    </div>
  );
}

export default App;
