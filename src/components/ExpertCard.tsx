import React, { useState } from 'react';
import { Copy, Check, Sparkles, Brain, Cpu, MessageSquareQuote } from 'lucide-react';
import { ExpertSummary, Language } from '../types';
import { getCategoryStyle, copyText, I18N } from '../utils';

interface ExpertCardProps {
  expert: ExpertSummary;
  lang: Language;
  onOpenDetail: (expert: ExpertSummary) => void;
  isSelected: boolean;
  onToggleSelect: (slug: string) => void;
  onNotify: (msg: string) => void;
}

export const ExpertCard: React.FC<ExpertCardProps> = ({
  expert,
  lang,
  onOpenDetail,
  isSelected,
  onToggleSelect,
  onNotify,
}) => {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
  const t = I18N[lang];
  const catStyle = getCategoryStyle(expert.category);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await copyText(expert.install.npx);
    if (ok) {
      setCopied(true);
      onNotify(`${lang === 'en' ? 'Copied' : '已复制'}: ${expert.install.npx}`);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      onClick={() => onOpenDetail(expert)}
      className={`relative group rounded-2xl border bg-slate-900/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col justify-between ${
        isSelected
          ? 'border-cyan-500/80 bg-slate-900/90 ring-1 ring-cyan-500 shadow-cyan-500/10'
          : 'border-slate-800/80 hover:border-slate-700'
      }`}
    >
      <div>
        {/* Top bar: Category + Select toggle */}
        <div className="flex items-center justify-between mb-4">
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${catStyle.badge}`}>
            {expert.category}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect(expert.slug);
            }}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
              isSelected
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
            }`}
          >
            {isSelected ? (
              <>
                <Check className="w-3 h-3 stroke-[3]" />
                <span>{lang === 'en' ? 'Selected' : '已选'}</span>
              </>
            ) : (
              <span>{lang === 'en' ? '+ Select' : '+ 勾选'}</span>
            )}
          </button>
        </div>

        {/* Profile Info: Avatar + Name */}
        <div className="flex items-start gap-3.5 mb-3">
          <div className="relative shrink-0">
            {!imgError ? (
              <img
                src={expert.avatar}
                alt={expert.name}
                loading="lazy"
                onError={() => setImgError(true)}
                className="w-14 h-14 rounded-xl object-cover border border-slate-700/80 shadow-md group-hover:border-cyan-500/40 transition-colors"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg font-bold text-slate-400">
                {expert.name[0]}
              </div>
            )}
            <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${catStyle.dot}`} />
          </div>

          <div className="min-w-0">
            <h3 className="font-bold text-white text-lg tracking-tight group-hover:text-cyan-300 transition-colors truncate">
              {expert.name}
            </h3>
            <p className="text-xs text-slate-400 line-clamp-1 font-mono">
              slug: {expert.slug}
            </p>
          </div>
        </div>

        {/* Summary text */}
        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
          {expert.summary}
        </p>

        {/* Quote snippet if exists */}
        {expert.top_quote && (
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 mb-4 text-[11px] text-slate-400 italic flex items-start gap-2">
            <MessageSquareQuote className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <span className="line-clamp-2">"{expert.top_quote}"</span>
          </div>
        )}
      </div>

      <div>
        {/* Badges for Frameworks & Models */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-800/60 text-[11px] text-slate-400 mb-4">
          <div className="flex items-center gap-1">
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            <span>{expert.mental_models_count} {lang === 'en' ? 'Models' : '心智模型'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>{expert.frameworks_count} {lang === 'en' ? 'Frameworks' : '决策框架'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(expert);
            }}
            className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all text-center flex items-center justify-center gap-1.5 border border-slate-700/60 group-hover:border-cyan-500/40"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.inspect}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            title={expert.install.npx}
            className={`p-2 rounded-lg border text-xs font-medium transition-all ${
              copied
                ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
