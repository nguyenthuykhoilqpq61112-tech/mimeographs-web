import React from 'react';
import { Award, X } from 'lucide-react';
import { Language } from '../types';
import { I18N } from '../utils';

interface BatchDockProps {
  selectedSlugs: string[];
  lang: Language;
  onClear: () => void;
  onOpenCouncil: () => void;
  onNotify: (msg: string) => void;
}

export const BatchDock: React.FC<BatchDockProps> = ({
  selectedSlugs,
  lang,
  onClear,
  onOpenCouncil,
}) => {
  const t = I18N[lang];

  if (selectedSlugs.length === 0) return null;

  return (
    <aside aria-label="Selected scholars actions" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[92vw] sm:w-auto animate-bounceIn">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:px-5 sm:py-3.5 rounded-2xl bg-slate-900/95 border border-amber-500/50 shadow-2xl shadow-amber-500/10 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs font-mono">
            {selectedSlugs.length}
          </div>
          <span className="text-xs sm:text-sm font-semibold text-white">
            {selectedSlugs.length} {t.selected}
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onOpenCouncil}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
          >
            <Award className="w-3.5 h-3.5 text-slate-950" />
            <span>{t.launchCouncil}</span>
          </button>

          <button
            onClick={onClear}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            title={t.clearSelection}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
