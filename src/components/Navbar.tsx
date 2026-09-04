import React from 'react';
import { Landmark, Users, Globe, MessageSquare, Award } from 'lucide-react';
import { Language } from '../types';
import { I18N } from '../utils';

interface NavbarProps {
  lang: Language;
  setLang: (l: Language) => void;
  activeTab: 'chat' | 'catalog' | 'council';
  setActiveTab: (tab: 'chat' | 'catalog' | 'council') => void;
  selectedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  setLang,
  activeTab,
  setActiveTab,
  selectedCount,
}) => {
  const t = I18N[lang];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/70 shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('chat')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-amber-500/40 p-[1px] shadow-lg shadow-amber-500/10 group-hover:border-amber-400/70 transition-all duration-300">
            <div className="w-full h-full bg-slate-950/80 rounded-[10px] flex items-center justify-center">
              <Landmark className="w-5 h-5 text-amber-400 group-hover:scale-105 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-white text-lg font-serif">
                {t.brandName}
              </span>
              <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                {t.brandBadge}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 -mt-0.5 hidden sm:block">
              {t.brandSubtitle}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-cyan-500/20 to-sky-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'en' ? 'Direct Dialogue' : '学者对话'}</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'catalog'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === 'en' ? 'Scholars Index' : '学者目录'}</span>
            {selectedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-xs bg-amber-500 text-slate-950 rounded-full font-bold">
                {selectedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('council')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'council'
                ? 'bg-gradient-to-r from-purple-600/30 to-amber-600/30 text-purple-300 border border-purple-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">{lang === 'en' ? 'Roundtable Council' : '圆桌研讨'}</span>
          </button>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switch */}
          <button
            onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
            title={lang === 'en' ? 'Switch to Chinese / 切换至中文' : '切换为英文 / Switch to English'}
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'en' ? '中文' : 'English'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

