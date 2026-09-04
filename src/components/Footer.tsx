import { GithubIcon } from "./GithubIcon";
import React from 'react';
import { Sparkles, ExternalLink, Terminal, Heart } from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/90 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="font-extrabold text-white text-base tracking-tight">MIMEOGRAPHS</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                80 Minds
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md text-xs sm:text-sm">
              {lang === 'en'
                ? 'A collection of 80 ready-to-use agent skills cloning the thinking of founders, philosophers, scientists, and AI researchers into your coding agents.'
                : '收录 80 位世界级创始人、哲学家、科学家与 AI 学者思维模型的 Agent 技能库，全方位赋能 AI 智能体开发。'}
            </p>
            <div className="mt-4 flex items-center gap-2 font-mono text-[11px] text-slate-500">
              <span>Origin:</span>
              <a
                href="https://github.com/K-Dense-AI/mimeo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>K-Dense-AI/mimeo</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Upstream Links */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              {lang === 'en' ? 'Open Source' : '开源资源'}
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/K-Dense-AI/mimeographs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>K-Dense-AI/mimeographs</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/K-Dense-AI/mimeo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>K-Dense-AI/mimeo (Generator)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/K-Dense-AI/scientific-agent-skills"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>scientific-agent-skills</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Ecosystem */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              {lang === 'en' ? 'Ecosystem' : '生态关联'}
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://pantheon.k-dense.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Pantheon Research</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.k-dense.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>K-Dense Official</span>
                </a>
              </li>
              <li>
                <span className="text-slate-500">
                  {lang === 'en' ? 'License: Apache 2.0 / MIT' : '开源协议：Apache 2.0 / MIT'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © 2026 Mimeographs Web Explorer. Generated from K-Dense-AI open-source repositories.
          </div>
          <div className="flex items-center gap-1">
            <span>Built for Claude Code, Cursor, Codex & Gemini CLI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
