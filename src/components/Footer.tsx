import React from 'react';
import { Sparkles } from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/90 py-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="font-extrabold text-white text-base tracking-tight">MIMEOGRAPHS</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold">
              80 Minds
            </span>
          </div>
          <p className="text-slate-400 text-xs text-center sm:text-right">
            {lang === 'en'
              ? 'A collection of 80 ready-to-use agent skills cloning the thinking of thinkers and leaders.'
              : '收录 80 位思想家与行业领袖的思维模型智库，全方位赋能 AI 智能体对话。'}
          </p>
        </div>
      </div>
    </footer>
  );
};

