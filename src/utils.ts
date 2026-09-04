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

export function formatCategory(cat: string, lang: Language): string {
  if (lang === 'en') {
    switch (cat) {
      case 'Founders & operators': return 'Founders & Operators';
      case 'Philosophers': return 'Philosophers';
      case 'AI & ML researchers': return 'AI & ML Researchers';
      case 'Scientists & researchers': return 'Scientists & Scholars';
      default: return cat;
    }
  }
  switch (cat) {
    case 'Founders & operators': return '商业领袖与实业家';
    case 'Philosophers': return '哲学家与思想家';
    case 'AI & ML researchers': return '人工智能学者';
    case 'Scientists & researchers': return '前沿科学家与学者';
    default: return cat;
  }
}

export function formatCategoryShort(cat: string, lang: Language): string {
  if (lang === 'en') {
    switch (cat) {
      case 'All': return 'All';
      case 'Founders & operators': return 'Founders';
      case 'Philosophers': return 'Philosophers';
      case 'AI & ML researchers': return 'AI & ML';
      case 'Scientists & researchers': return 'Scientists';
      default: return cat;
    }
  }
  switch (cat) {
    case 'All': return '全部';
    case 'Founders & operators': return '商业领袖';
    case 'Philosophers': return '哲学思想';
    case 'AI & ML researchers': return '人工智能';
    case 'Scientists & researchers': return '前沿科学';
    default: return cat;
  }
}

export const I18N = {
  en: {
    brandName: "SCHOLARMIND",
    brandBadge: "80 Scholars",
    brandSubtitle: "Intellectual Archive & Direct Dialogue",
    heroTitlePrefix: "Dialogue with ",
    heroTitleHighlight: "80 Masterminds & Scholars",
    heroTitleSuffix: " Across History",
    heroSubtitle: "Curated intellectual archive capturing the mental models, reasoning heuristics, and decision frameworks of foundational philosophers, scientists, and visionary leaders. Engage in one-on-one deep conversations or convene multi-expert roundtable debates.",
    exploreCatalog: "Browse 80 Scholars",
    enterCouncil: "Convene Roundtable Council",
    searchPlaceholder: "Search by scholar name, mental model, or keyword (e.g. First Principles, Circle of Competence)...",
    filterAll: "All Scholars",
    filterFounders: "Founders & Operators",
    filterPhilosophers: "Philosophers",
    filterAI: "AI & ML Researchers",
    filterScientists: "Scientists & Researchers",
    showingCount: "Showing",
    of: "of",
    experts: "scholars",
    inspect: "Inspect Blueprint",
    selectToBatch: "Select",
    selected: "selected",
    clearSelection: "Clear",
    launchCouncil: "Start Council Debate",
    gridView: "Cards",
    tableView: "Index Table",
    presetBundles: "Curated Scholar Circles",
    bundleUnicorns: "Silicon Valley Founders",
    bundleAGI: "Frontier AGI Pioneers",
    bundleWisdom: "Philosophy & First Principles",
    bundleBio: "Life Science Innovators",
    mentalModels: "Mental Models",
    frameworks: "Decision Frameworks",
    principles: "Core Principles",
    quotes: "Quotes & Maxims",
    consultThisMind: "Consult This Scholar",
    councilTitle: "Thinkers Roundtable Council",
    councilSubtitle: "Select up to 4 historical and contemporary scholars to deliberate your dilemma based on their distinct mental models.",
    askPlaceholder: "Pose a decision dilemma (e.g., 'Should an early-stage startup focus strictly on product simplicity or match competitor feature depth?')",
    generateAdvice: "Convene Deliberation",
    simulatedAdvice: "Heuristic Deliberation Output",
    byokSettings: "Model Settings",
    close: "Close",
    loading: "Loading scholar details...",
  },
  zh: {
    brandName: "博雅智库",
    brandBadge: "80 位思想先驱",
    brandSubtitle: "思想先驱与学术大师智库",
    heroTitlePrefix: "与 ",
    heroTitleHighlight: "80 位跨时代思想家与学者",
    heroTitleSuffix: " 展开深度思维对话",
    heroSubtitle: "系统提炼 80 位跨时代先哲、科学家、哲学家与商业领袖的心智模型与决策法则，支持一对一深度提问沉浸交流，或发起多学者跨学科圆桌思辨研讨。",
    exploreCatalog: "浏览 80 位智库学者",
    enterCouncil: "发起先贤圆桌研讨",
    searchPlaceholder: "按学者姓名、心智模型或关键词搜索（如 第一性原理、能力圈、有效利他）...",
    filterAll: "全部学者",
    filterFounders: "商业领袖与实业家",
    filterPhilosophers: "哲学家与思想家",
    filterAI: "人工智能学者",
    filterScientists: "前沿科学家与学者",
    showingCount: "已呈现",
    of: "/",
    experts: "位学者",
    inspect: "查阅思维蓝图",
    selectToBatch: "勾选",
    selected: "位已选",
    clearSelection: "清空",
    launchCouncil: "开启圆桌思辨研讨",
    gridView: "卡片网格",
    tableView: "紧凑目录",
    presetBundles: "特邀名家智囊团",
    bundleUnicorns: "实业与科技领袖",
    bundleAGI: "人工智能开拓者",
    bundleWisdom: "第一性原理与哲学先哲",
    bundleBio: "生命科学与医学学者",
    mentalModels: "心智模型",
    frameworks: "决策框架",
    principles: "核心原则",
    quotes: "箴言与名著摘录",
    consultThisMind: "向该学者咨询",
    councilTitle: "学者先哲圆桌思辨室",
    councilSubtitle: "挑选 1 至 4 位历史与当代大师，针对您的核心决策困境，基于各自坚守的心智模型展开跨学科思辨研讨。",
    askPlaceholder: "输入您要探讨的核心问题（例如：“在资源极其受限的早期阶段，应坚守极致产品打磨还是加速功能铺开抢占市场？”）",
    generateAdvice: "发起研讨",
    simulatedAdvice: "学者启发式思辨建言",
    byokSettings: "模型设置",
    close: "关闭",
    loading: "正在调阅学者思维蓝图...",
  }
};
