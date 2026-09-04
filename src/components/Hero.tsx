import React from 'react';
import { ArrowRight, Award, Landmark, BookOpen, Compass } from 'lucide-react';
import { Language } from '../types';
import { I18N } from '../utils';

interface HeroProps {
  lang: Language;
  onExplore: () => void;
  onOpenCouncil: () => void;
  onNotify: (msg: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  lang,
  onExplore,
  onOpenCouncil,
}) => {
  const t = I18N[lang];

  return (
    <section className="relative overflow-hidden pt-16 pb-20 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 via-slate-950 to-slate-950">
      {/* Background subtle scholarly glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-gradient-to-tr from-amber-500/10 via-indigo-500/10 to-cyan-500/10 blur-3xl pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Scholarly Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none font-serif">
          {t.heroTitlePrefix}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-100 to-cyan-300">
            {t.heroTitleHighlight}
          </span>
          {t.heroTitleSuffix}
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          {t.heroSubtitle}
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={onExplore}
            className="px-7 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-2 shadow-lg shadow-black/30 group"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>{t.exploreCatalog}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onOpenCouncil}
            className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-amber-600/20"
          >
            <Award className="w-4 h-4 text-slate-950" />
            <span>{t.enterCouncil}</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 border-t border-slate-800/60">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/70">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-serif">80</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              {lang === 'en' ? 'Thinkers & Scholars' : '位思想先驱与学者'}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/70">
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-serif">4</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              {lang === 'en' ? 'Core Disciplines' : '大学术与实践领域'}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/70">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-serif">660+</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              {lang === 'en' ? 'Decision Frameworks' : '套决策框架与模型'}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/70">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-serif">2</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              {lang === 'en' ? 'Dialogue Modes' : '种深度研讨交互形态'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
