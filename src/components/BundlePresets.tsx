import React from 'react';
import { Rocket, Brain, Landmark, Dna, ArrowRight, Check } from 'lucide-react';
import { Language } from '../types';
import { I18N } from '../utils';

interface BundlePresetsProps {
  lang: Language;
  onSelectBundle: (slugs: string[]) => void;
  selectedSlugs: string[];
}

export const BundlePresets: React.FC<BundlePresetsProps> = ({
  lang,
  onSelectBundle,
  selectedSlugs,
}) => {
  const t = I18N[lang];

  const presets = [
    {
      id: 'founders',
      title: t.bundleUnicorns,
      icon: Rocket,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
      badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
      desc: lang === 'en'
        ? 'Product vision, capital allocation, moat design, and ruthless execution.'
        : '极致产品品味、资本配置、护城河构建与狼性工程执行力。',
      slugs: ['steve-jobs', 'elon-musk', 'warren-buffett', 'bill-gates', 'mark-zuckerberg'],
      names: ['Steve Jobs', 'Elon Musk', 'Warren Buffett', 'Bill Gates', 'Mark Zuckerberg'],
    },
    {
      id: 'agi',
      title: t.bundleAGI,
      icon: Brain,
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
      badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-800',
      desc: lang === 'en'
        ? 'Empirical deep learning, scaling laws, systems engineering, and safety.'
        : '深度学习尺度定律、系统级大规模工程、损失曲线洞察与安全对齐。',
      slugs: ['ilya-sutskever', 'andrej-karpathy', 'yann-lecun', 'geoffrey-hinton', 'jeff-dean'],
      names: ['Ilya Sutskever', 'Andrej Karpathy', 'Yann LeCun', 'Geoffrey Hinton', 'Jeff Dean'],
    },
    {
      id: 'philosophy',
      title: t.bundleWisdom,
      icon: Landmark,
      color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400',
      badgeColor: 'bg-purple-950 text-purple-300 border-purple-800',
      desc: lang === 'en'
        ? 'Linguistic clarity, ethical frameworks, first principles, and anti-slop rigor.'
        : '语言哲学厘清、概念界定、第一性原理推导与抗假大空批判性思维。',
      slugs: ['ludwig-wittgenstein', 'immanuel-kant', 'aristotle', 'friedrich-nietzsche', 'hannah-arendt'],
      names: ['Wittgenstein', 'Kant', 'Aristotle', 'Nietzsche', 'Arendt'],
    },
    {
      id: 'science',
      title: t.bundleBio,
      icon: Dna,
      color: 'from-amber-500/20 to-rose-500/10 border-amber-500/30 text-amber-400',
      badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
      desc: lang === 'en'
        ? 'High-throughput experimentation, translational biotechnology, and genomics.'
        : '高通量组学生命科学、转化医学、严密实验范式与复杂流行病学。',
      slugs: ['eric-s-lander', 'aviv-regev', 'robert-langer', 'stacey-gabriel', 'zhenan-bao'],
      names: ['Eric Lander', 'Aviv Regev', 'Robert Langer', 'Stacey Gabriel', 'Zhenan Bao'],
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>{t.presetBundles}</span>
            <span className="text-xs font-normal text-slate-400">
              ({lang === 'en' ? 'Click to select team for council debate' : '点击选中该智囊团，直接开启圆桌研讨'})
            </span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {presets.map((bundle) => {
          const Icon = bundle.icon;
          const isFullySelected = bundle.slugs.every((s) => selectedSlugs.includes(s));

          return (
            <div
              key={bundle.id}
              onClick={() => onSelectBundle(bundle.slugs)}
              className={`p-4 rounded-xl border bg-gradient-to-br transition-all duration-300 cursor-pointer flex flex-col justify-between group hover:scale-[1.02] ${bundle.color} ${
                isFullySelected ? 'ring-2 ring-cyan-400 bg-slate-900' : 'hover:border-slate-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-900/80 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${bundle.badgeColor}`}>
                    {bundle.slugs.length} {lang === 'en' ? 'Minds' : '位大师'}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors">
                  {bundle.title}
                </h3>

                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                  {bundle.desc}
                </p>

                <div className="mt-3 flex flex-wrap gap-1">
                  {bundle.names.map((name) => (
                    <span
                      key={name}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-slate-800"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold">
                <span className={isFullySelected ? 'text-cyan-300 flex items-center gap-1' : 'text-slate-400 group-hover:text-white'}>
                  {isFullySelected ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? 'Team Selected' : '整组已选中'}</span>
                    </>
                  ) : (
                    <span>{lang === 'en' ? 'Select this Team' : '选中此智囊团'}</span>
                  )}
                </span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
