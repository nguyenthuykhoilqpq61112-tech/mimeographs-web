import React from 'react';
import { Landmark } from 'lucide-react';
import { Language } from '../types';
import { I18N } from '../utils';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = I18N[lang];

  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/90 py-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-slate-900 border border-amber-500/30 flex items-center justify-center">
              <Landmark className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="font-extrabold text-white text-base tracking-tight font-serif">{t.brandName}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold">
              {t.brandBadge}
            </span>
          </div>
          <p className="text-slate-400 text-xs text-center sm:text-right">
            {lang === 'en'
              ? 'Curated intellectual archive of 80 historical and contemporary thinkers, philosophers, and scientists.'
              : '收录 80 位跨时代先哲、科学家、哲学家与行业领袖的思维模型智库。'}
          </p>
        </div>
      </div>
    </footer>
  );
};


