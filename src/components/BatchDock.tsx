import React, { useState } from 'react';
import { Copy, Check, Sparkles, X, Terminal } from 'lucide-react';
import { Language } from '../types';
import { I18N, copyText } from '../utils';

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
  onNotify,
}) => {
  const [copied, setCopied] = useState(false);
  const t = I18N[lang];

  if (selectedSlugs.length === 0) return null;

  const batchCommand = `npx skills add ${selectedSlugs
    .map((slug) => `K-Dense-AI/mimeographs/${slug}`)
    .join(' ')}`;

  const handleCopyBatch = async () => {
    const ok = await copyText(batchCommand);
    if (ok) {
      setCopied(true);
      onNotify(lang === 'en' ? `Copied batch install for ${selectedSlugs.length} minds!` : `已复制 ${selectedSlugs.length} 位专家的批量安装命令！`);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <aside aria-label="Selected experts actions" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[92vw] sm:w-auto animate-bounceIn">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:px-5 sm:py-3.5 rounded-2xl bg-slate-900/95 border border-cyan-500/50 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs font-mono">
            {selectedSlugs.length}
          </div>
          <span className="text-xs sm:text-sm font-semibold text-white">
            {selectedSlugs.length} {t.selected}
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleCopyBatch}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? (lang === 'en' ? 'Copied' : '已复制') : t.copyBatchNpx}</span>
          </button>

          <button
            onClick={onOpenCouncil}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
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
