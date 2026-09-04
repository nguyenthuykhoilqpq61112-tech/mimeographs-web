import { Category } from './types';

export function getCategoryStyle(category: string) {
  switch (category) {
    case 'Founders & operators':
      return {
        bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        badge: 'bg-emerald-950 text-emerald-300 border border-emerald-800',
        glow: 'group-hover:border-emerald-500/50',
        dot: 'bg-emerald-400',
        accent: 'text-emerald-400',
        gradient: 'from-emerald-500/20 to-transparent'
      };
    case 'Philosophers':
      return {
        bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
        badge: 'bg-purple-950 text-purple-300 border border-purple-800',
        glow: 'group-hover:border-purple-500/50',
        dot: 'bg-purple-400',
        accent: 'text-purple-400',
        gradient: 'from-purple-500/20 to-transparent'
      };
    case 'AI & ML researchers':
      return {
        bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
        badge: 'bg-cyan-950 text-cyan-300 border border-cyan-800',
        glow: 'group-hover:border-cyan-500/50',
        dot: 'bg-cyan-400',
        accent: 'text-cyan-400',
        gradient: 'from-cyan-500/20 to-transparent'
      };
    case 'Scientists & researchers':
      return {
        bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        badge: 'bg-amber-950 text-amber-300 border border-amber-800',
        glow: 'group-hover:border-amber-500/50',
        dot: 'bg-amber-400',
        accent: 'text-amber-400',
        gradient: 'from-amber-500/20 to-transparent'
      };
    default:
      return {
        bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
        badge: 'bg-slate-900 text-slate-300 border border-slate-700',
        glow: 'group-hover:border-slate-500/50',
        dot: 'bg-slate-400',
        accent: 'text-slate-400',
        gradient: 'from-slate-500/20 to-transparent'
      };
  }
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (err) {
    console.error('Failed to copy: ', err);
    return false;
  }
}

export const I18N = {
  en: {
    heroBadge: "K-Dense-AI / Mimeographs",
    heroTitlePrefix: "Clone ",
    heroTitleHighlight: "80 Masterminds",
    heroTitleSuffix: " into Your AI Agents",
    heroSubtitle: "Curated agent skills (`SKILL.md` + `AGENTS.md`) capturing the frameworks, mental models, and decision heuristics of top founders, philosophers, and scientists. Compatible with Claude Code, Cursor, Codex, and Gemini CLI.",
    exploreCatalog: "Explore 80 Experts",
    enterCouncil: "Pantheon Council (Multi-AI)",
    copyAllCmd: "Install All 80 Experts",
    copiedAll: "Copied install command for all 80 experts!",
    searchPlaceholder: "Search experts, mental models, 'loss curve', 'circle of competence'...",
    filterAll: "All Minds",
    filterFounders: "Founders & Operators",
    filterPhilosophers: "Philosophers",
    filterAI: "AI & ML Researchers",
    filterScientists: "Scientists & Researchers",
    showingCount: "Showing",
    of: "of",
    experts: "experts",
    inspect: "Inspect Mind",
    selectToBatch: "Select",
    selected: "selected",
    copyBatchNpx: "Copy npx Add",
    clearSelection: "Clear",
    launchCouncil: "Debate in Council",
    gridView: "Grid Cards",
    tableView: "Compact Index",
    presetBundles: "Curated Dream Teams",
    bundleUnicorns: "Silicon Valley Founders",
    bundleAGI: "Frontier AGI Pioneers",
    bundleWisdom: "Philosophy & First Principles",
    bundleBio: "Life Science Innovators",
    mentalModels: "Mental Models",
    frameworks: "Frameworks",
    principles: "Core Principles",
    quotes: "Quotes",
    behavioralAgent: "Always-On System Prompt (AGENTS.md)",
    skillGuide: "On-Demand Skill (SKILL.md)",
    reachForWhen: "Reach for this when...",
    quickInstall: "Quick Install",
    copyNpx: "Copy npx command",
    copyGh: "Copy gh command",
    copyAgentPrompt: "Copy AGENTS.md",
    consultThisMind: "Ask This Mind",
    councilTitle: "The Pantheon Council Room",
    councilSubtitle: "Convene up to 4 historical & modern masterminds to debate your question from distinct mental models.",
    askPlaceholder: "Ask a dilemma (e.g., 'Should our AI startup open-source our weights or build a closed SaaS?')",
    generateAdvice: "Convene Council",
    simulatedAdvice: "Authentic Persona Heuristics",
    byokSettings: "API Key (Optional)",
    howToUse: "How to Integrate into Your Workflow",
    howToUseSub: "Seamless integration across modern agent-first coding environments.",
    close: "Close",
    loading: "Loading expert details...",
  },
  zh: {
    heroBadge: "K-Dense-AI / Mimeographs 镜像站与智库平台",
    heroTitlePrefix: "将 ",
    heroTitleHighlight: "80 位世界级大师",
    heroTitleSuffix: " 的思维模型注入你的 AI Agent",
    heroSubtitle: "精选的 Agent 专家技能库（`SKILL.md` 与 `AGENTS.md`），提炼顶级创始人、哲学家与科学家的决策框架、心智模型与反脆弱法则。无缝支持 Claude Code、Cursor、Codex 及 Gemini CLI。",
    exploreCatalog: "浏览 80 位智库专家",
    enterCouncil: "万神殿多专家圆桌研讨",
    copyAllCmd: "一键安装全部 80 位专家",
    copiedAll: "已复制全量 80 位专家的安装命令！",
    searchPlaceholder: "输入名字、心智模型、关键词（如 护城河、第一性原理、损失曲线、护城河）...",
    filterAll: "全部专家",
    filterFounders: "创始人与商业领袖",
    filterPhilosophers: "哲学家与思想家",
    filterAI: "AI与机器学习科学家",
    filterScientists: "前沿科学家与学者",
    showingCount: "已显示",
    of: "/",
    experts: "位专家",
    inspect: "探究思维模型",
    selectToBatch: "选择",
    selected: "已勾选",
    copyBatchNpx: "复制批量安装命令 (npx)",
    clearSelection: "清空选择",
    launchCouncil: "进入圆桌研讨",
    gridView: "卡片网格",
    tableView: "紧凑目录",
    presetBundles: "精选大师智囊团",
    bundleUnicorns: "硅谷传奇创始人团队",
    bundleAGI: "AGI 前沿开拓者团队",
    bundleWisdom: "第一性原理与哲学大师",
    bundleBio: "生命科学与医学开拓者",
    mentalModels: "心智模型 (Mental Models)",
    frameworks: "实战框架 (Frameworks)",
    principles: "核心原则 (Principles)",
    quotes: "金句与真知 (Quotes)",
    behavioralAgent: "全天候系统提示词 (AGENTS.md)",
    skillGuide: "按需触发技能说明 (SKILL.md)",
    reachForWhen: "何时选用此技能：",
    quickInstall: "一键安装命令",
    copyNpx: "复制 npx 命令",
    copyGh: "复制 gh 命令",
    copyAgentPrompt: "复制 AGENTS.md 全文",
    consultThisMind: "咨询该专家",
    councilTitle: "万神殿 (Pantheon) 多专家圆桌研讨室",
    councilSubtitle: "挑选 1 至 4 位历史与当代大师，针对你的实际决策或难题，基于他们真实的心智模型展开碰撞与多角度分析。",
    askPlaceholder: "输入你要咨询的问题（例如：“作为初创团队，我们应该开源核心模型还是做封闭商业闭环？”）",
    generateAdvice: "召开圆桌研讨",
    simulatedAdvice: "大师原则启发式研讨",
    byokSettings: "API Key 设置 (可选)",
    howToUse: "如何接入你的开发工作流",
    howToUseSub: "支持主流 AI Agent 开发环境，开箱即用。",
    close: "关闭",
    loading: "正在加载专家详细思维模型...",
  }
};
