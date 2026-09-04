import React, { useState } from 'react';
import { Terminal, Copy, Check, Sparkles, ArrowRight, Layers, ShieldCheck, Flame } from 'lucide-react';
import { Language } from '../types';
import { I18N, copyText } from '../utils';

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
  onNotify,
}) => {
  const t = I18N[lang];
  const [copied, setCopied] = useState(false);
  const installAllCmd = 'npx skills add K-Dense-AI/mimeographs';

  const handleCopyAll = async () => {
    const ok = await copyText(installAllCmd);
    if (ok) {
      setCopied(true);
      onNotify(t.copiedAll);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/50 via-slate-950 to-slate-950">
      {/* Background glow meshes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-gradient-to-tr from-cyan-500/10 via-indigo-500/10 to-purple-500/10 blur-3xl pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs font-semibold text-cyan-400 mb-6 shadow-sm backdrop-blur">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>{t.heroBadge}</span>
          <span className="w-1 h-1 rounded-full bg-slate-600" />
          <span className="text-slate-400">{lang === 'en' ? 'Open Standard' : '开源Agent标准'}</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
          {t.heroTitlePrefix}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
            {t.heroTitleHighlight}
          </span>
          {t.heroTitleSuffix}
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          {t.heroSubtitle}
        </p>

        {/* Interactive Install All Box */}
        <div className="mt-8 max-w-xl mx-auto">
          <div className="flex items-center justify-between p-2 pl-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur group hover:border-cyan-500/40 transition-colors">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-slate-300 overflow-x-auto select-all">
              <span className="text-cyan-400 font-bold">$</span>
              <span>{installAllCmd}</span>
            </div>
            <button
              onClick={handleCopyAll}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                copied
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'Copied' : '已复制'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'Copy All' : '一键复制'}</span>
                </>
              )}
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {lang === 'en' 
              ? 'Or pick individual experts below to install just what you need' 
              : '或者在下方按需挑选单人或组合安装，不占用多余 Prompt 空间'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={onExplore}
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-2 shadow-lg shadow-black/20 group"
          >
            <span>{t.exploreCatalog}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onOpenCouncil}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>{t.enterCouncil}</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-800/60">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">80</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              {lang === 'en' ? 'Curated Masterminds' : '位顶尖专家心智'}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-400">4</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              {lang === 'en' ? 'Core Disciplines' : '大核心领域'}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">660+</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              {lang === 'en' ? 'Frameworks & Models' : '套决策框架与模型'}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">2</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              {lang === 'en' ? 'Skill Flavors (SKILL/AGENTS)' : '种模式（按需 / 常驻）'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
