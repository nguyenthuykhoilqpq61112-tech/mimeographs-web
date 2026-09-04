import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BundlePresets } from './components/BundlePresets';
import { CatalogSection } from './components/CatalogSection';
import { ExpertModal } from './components/ExpertModal';
import { CouncilRoom } from './components/CouncilRoom';
import { HowToUse } from './components/HowToUse';
import { BatchDock } from './components/BatchDock';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';
import { ExpertSummary, Language } from './types';

export function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('mimeo_lang');
    return (saved === 'zh' || saved === 'en') ? saved : 'zh';
  });

  const [activeTab, setActiveTab] = useState<'catalog' | 'council' | 'guide'>('catalog');
  const [experts, setExperts] = useState<ExpertSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [selectedExpertForModal, setSelectedExpertForModal] = useState<ExpertSummary | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('mimeo_lang', lang);
  }, [lang]);

  useEffect(() => {
    fetch('./data/summary.json')
      .then((res) => res.json())
      .then((data) => {
        setExperts(data.experts || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load summary.json, attempting fallback', err);
        // In case running in environment without server yet
        import('./data/experts.json').then((module) => {
          const fallbackList: ExpertSummary[] = module.default.experts.map((exp: any) => ({
            slug: exp.slug,
            name: exp.name,
            category: exp.category,
            summary: exp.summary,
            description: exp.description,
            avatar: exp.avatar,
            install: exp.install,
            tags: exp.tags.slice(0, 8),
            top_quote: exp.quotes?.[0]?.quote || '',
            principles_count: exp.principles?.length || 0,
            mental_models_count: exp.mental_models?.length || 0,
            frameworks_count: exp.frameworks?.length || 0,
          }));
          setExperts(fallbackList);
          setLoading(false);
        });
      });
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar
        lang={lang}
        setLang={setLang}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCount={selectedSlugs.length}
      />

      <main className="flex-1">
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
              selectedSlugs={selectedSlugs}
              onToggleSelect={handleToggleSelect}
              onSelectAll={handleSelectAll}
              onClearSelection={handleClearSelection}
              onNotify={handleNotify}
            />
          </>
        )}

        {activeTab === 'council' && (
          <CouncilRoom
            experts={experts}
            selectedSlugs={selectedSlugs}
            onToggleSelect={handleToggleSelect}
            lang={lang}
            onNotify={handleNotify}
          />
        )}

        {activeTab === 'guide' && (
          <HowToUse lang={lang} onNotify={handleNotify} />
        )}
      </main>

      <BatchDock
        selectedSlugs={selectedSlugs}
        lang={lang}
        onClear={handleClearSelection}
        onOpenCouncil={() => setActiveTab('council')}
        onNotify={handleNotify}
      />

      <ExpertModal
        expertSummary={selectedExpertForModal}
        lang={lang}
        onClose={() => setSelectedExpertForModal(null)}
        onNotify={handleNotify}
      />

      <Toast message={toastMessage} />

      <Footer lang={lang} />
    </div>
  );
}

export default App;
