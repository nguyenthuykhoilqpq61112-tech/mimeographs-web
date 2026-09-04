import React, { useState } from 'react';
import { Terminal, BookOpen, Layers, CheckCircle2, Copy, Check, Sparkles, ExternalLink } from 'lucide-react';
import { Language } from '../types';
import { I18N, copyText } from '../utils';

interface HowToUseProps {
  lang: Language;
  onNotify: (msg: string) => void;
}

export const HowToUse: React.FC<HowToUseProps> = ({ lang, onNotify }) => {
  const t = I18N[lang];
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (code: string, idx: number) => {
    const ok = await copyText(code);
    if (ok) {
      setCopiedIndex(idx);
      onNotify(lang === 'en' ? 'Copied snippet!' : '已复制配置代码！');
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const codeSnippets = [
    {
      title: lang === 'en' ? 'Option 1: Universal npx Install' : '方式一：全平台通用 npx 命令安装',
      env: 'Claude Code / Cursor / Codex / Gemini CLI',
      desc: lang === 'en'
        ? 'Supports any agent following the open Agent Skills specification.'
        : '支持遵循开放 Agent Skills 标准的任何 Agent 工具。',
      code: `# Install a single expert into your active agent
npx skills add K-Dense-AI/mimeographs/steve-jobs

# Install multiple complementary minds at once
npx skills add K-Dense-AI/mimeographs/steve-jobs K-Dense-AI/mimeographs/warren-buffett

# Install all 80 experts globally
npx skills add K-Dense-AI/mimeographs`,
    },
    {
      title: lang === 'en' ? 'Option 2: GitHub CLI (gh)' : '方式二：GitHub CLI (gh) 插件安装',
      env: 'GitHub CLI gh-skill',
      desc: lang === 'en'
        ? 'If you use gh skill extension for team-wide development environments.'
        : '如果你的团队开发环境使用 gh skill 扩展插件。',
      code: `# Install individual skill
gh skill install K-Dense-AI/mimeographs steve-jobs

# Update skills
gh skill update K-Dense-AI/mimeographs`,
    },
    {
      title: lang === 'en' ? 'Option 3: Always-On AGENTS.md (Project Root)' : '方式三：全天候 AGENTS.md 常驻规则',
      env: 'Cursor, Claude Code, Windsurf, Codex',
      desc: lang === 'en'
        ? 'Drop AGENTS.md directly into your repo root. The agent adopts this persona for every prompt in this repo without needing triggers.'
        : '直接将对应专家的 AGENTS.md 复制到你的项目根目录。Agent 每次在该目录工作时，所有代码审查与设计决策都会自动应用此专家的标准。',
      code: `# Example: Copy Jobs's craft standards to your current frontend repository
curl -sL https://raw.githubusercontent.com/K-Dense-AI/mimeographs/main/mimeographs/steve-jobs/AGENTS.md > AGENTS.md`,
    },
  ];

  return (
    <section id="guide" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {t.howToUse}
        </h2>
        <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
          {t.howToUseSub}
        </p>
      </div>

      {/* Two Flavors Architecture Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="p-6 rounded-2xl border border-cyan-500/30 bg-cyan-950/10 shadow-xl relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            1. SKILL.md — {lang === 'en' ? 'On-Demand Expertise' : '按需情景触发 (On-Demand)'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {lang === 'en'
              ? 'Has YAML frontmatter with a description and keywords. The agent only loads this skill when your query matches the persona’s domain (e.g. Warren Buffett only triggers when you ask about capital allocation or valuation).'
              : '带有 YAML 元数据与精准描述词。Agent 仅在用户提出的问题涉及特定领域时（例如讨论资本配置或估值时触发巴菲特，讨论用户体验和简化设计时触发乔布斯）才按需载入，极大地节省上下文 Token。'}
          </p>
          <div className="mt-4 inline-block text-xs font-mono text-cyan-300 bg-cyan-950/40 px-3 py-1.5 rounded-lg border border-cyan-800">
            {lang === 'en' ? 'Recommended for: Global Skill Library' : '推荐场景：全局常用专家技能库'}
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-purple-500/30 bg-purple-950/10 shadow-xl relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-4">
            <Layers className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            2. AGENTS.md — {lang === 'en' ? 'Always-On Project Defaults' : '全天候常驻规则 (Always-On)'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {lang === 'en'
              ? 'A single markdown file the agent reads at the start of every session in that project. No triggers required. Best when you want an expert’s standards baked into every code review, design critique, and PR description.'
              : '放置在具体代码库根目录。Agent 每次启动时无条件读取，无需关键词触发。适合希望将特定人物的极致标准（如乔布斯的品味、卡帕西的代码简洁哲学）直接作为该项目的工程默认规范。'}
          </p>
          <div className="mt-4 inline-block text-xs font-mono text-purple-300 bg-purple-950/40 px-3 py-1.5 rounded-lg border border-purple-800">
            {lang === 'en' ? 'Recommended for: Dedicated Project Standard' : '推荐场景：单个项目专属行为基准'}
          </div>
        </div>
      </div>

      {/* Code Snippets Accordion / Grid */}
      <div className="space-y-6">
        {codeSnippets.map((snip, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h4 className="text-base font-bold text-white">{snip.title}</h4>
                <p className="text-xs text-slate-400">{snip.desc}</p>
              </div>
              <span className="text-[11px] font-mono text-cyan-400 px-2.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800 self-start sm:self-auto">
                {snip.env}
              </span>
            </div>

            <div className="relative mt-3">
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm font-mono text-slate-300 overflow-x-auto leading-relaxed">
                {snip.code}
              </pre>
              <button
                onClick={() => handleCopy(snip.code, idx)}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{lang === 'en' ? 'Copied' : '已复制'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'Copy Code' : '复制代码'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom generator info */}
      <div className="mt-12 p-6 rounded-2xl border border-slate-800 bg-slate-950/60 text-center max-w-2xl mx-auto">
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {lang === 'en'
            ? 'Every mimeograph in this library was synthesized using K-Dense-AI/mimeo, extracting frameworks from hundreds of primary source talks, letters, papers, and interviews.'
            : '本库中所有专家技能均由 K-Dense-AI/mimeo 自动提炼生成，基于百余篇演讲、论文、访谈与信件进行聚类分析。'}
        </p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <a
            href="https://github.com/K-Dense-AI/mimeo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300"
          >
            <span>{lang === 'en' ? 'Explore K-Dense-AI/mimeo' : '查看 Mimeo 生成器源码'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
