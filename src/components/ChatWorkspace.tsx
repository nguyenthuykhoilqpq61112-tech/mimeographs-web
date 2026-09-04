import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  Settings,
  Brain,
  Trash2,
  Copy,
  Check,
  Search,
  BookOpen,
  Cpu,
  ChevronRight,
  MessageSquare,
  Loader2,
  ArrowLeft,
  X,
  FileCode,
  Terminal,
} from 'lucide-react';
import { ExpertSummary, ExpertDetail, Language, ChatMessage, LLMSettings, Category } from '../types';
import { getCategoryStyle, copyText, I18N } from '../utils';
import { streamChatResponse } from '../services/llm';

interface ChatWorkspaceProps {
  experts: ExpertSummary[];
  currentSlug: string;
  onSelectExpert: (slug: string) => void;
  lang: Language;
  onNotify: (msg: string) => void;
  llmSettings: LLMSettings;
  onOpenSettings: () => void;
  onBackToCatalog?: () => void;
}

export const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({
  experts,
  currentSlug,
  onSelectExpert,
  lang,
  onNotify,
  llmSettings,
  onOpenSettings,
  onBackToCatalog,
}) => {
  const t = I18N[lang];
  const [expertDetail, setExpertDetail] = useState<ExpertDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSpecsDrawer, setShowSpecsDrawer] = useState(false);
  const [searchSidebar, setSearchSidebar] = useState('');
  const [sidebarCat, setSidebarCat] = useState<Category>('All');
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load active expert detail on slug change
  useEffect(() => {
    if (!currentSlug) return;
    setLoadingDetail(true);
    fetch(`./data/experts/${currentSlug}.json`)
      .then((res) => res.json())
      .then((data: ExpertDetail) => {
        setExpertDetail(data);
        setLoadingDetail(false);
      })
      .catch((err) => {
        console.error('Failed to load expert details:', err);
        setLoadingDetail(false);
      });

    // Reset messages for the newly chosen expert or load from history
    setMessages([]);
  }, [currentSlug]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const activeSummary = experts.find((e) => e.slug === currentSlug) || experts[0];
  const catStyle = getCategoryStyle(activeSummary?.category || '');

  // Filter sidebar experts
  const sidebarExperts = experts.filter((e) => {
    if (sidebarCat !== 'All' && e.category !== sidebarCat) return false;
    if (!searchSidebar.trim()) return true;
    const q = searchSidebar.toLowerCase();
    return e.name.toLowerCase().includes(q) || e.slug.toLowerCase().includes(q);
  });

  // Dynamic starter prompts based on expert
  const getStarterPrompts = (exp: ExpertSummary | null): string[] => {
    if (!exp) return [];
    if (exp.slug === 'steve-jobs') {
      return lang === 'zh'
        ? [
            '如何做出极简、让人一见倾心的产品？',
            '如何坚定削减多余功能，对抗团队的妥协？',
            '如何把握软硬件与科技人文的交叉点？',
          ]
        : [
            'How do we design simple, insanely great products?',
            'How do I ruthlessly cut features and fight committee compromise?',
            'How do we balance liberal arts with cutting-edge tech?',
          ];
    }
    if (exp.slug === 'warren-buffett') {
      return lang === 'zh'
        ? [
            '如何判断一家软件公司是否拥有真正的经济护城河？',
            '如何评估当下的资本配置与安全边际？',
            '面对市场狂热与炒作，何时应该坚决说“不”？',
          ]
        : [
            'How do I evaluate if a software startup has a real economic moat?',
            'How should I think about capital allocation and margin of safety?',
            'When should I stay firmly within my circle of competence?',
          ];
    }
    if (exp.slug === 'andrej-karpathy') {
      return lang === 'zh'
        ? [
            '如何建立对 Loss 曲线与梯度异常的直觉洞察？',
            'AI 时代的工程师如何写出最小、最透明的代码？',
            '如何从零复现和调试一个现代 Transformer 模型？',
          ]
        : [
            'How do I build reliable intuition around loss curves and gradients?',
            'How should engineers keep code surgically simple in the LLM era?',
            'What is the best way to debug a neural network from scratch?',
          ];
    }
    if (exp.slug === 'ilya-sutskever') {
      return lang === 'zh'
        ? [
            '深度学习尺度定律（Scaling Laws）的核心启示是什么？',
            '如何看待下一代前沿模型的架构演进与对齐？',
            '在不确定性极高的前沿探索中，如何保持坚定信念？',
          ]
        : [
            'What is the true significance of empirical Scaling Laws?',
            'How should we think about foundation model architecture and alignment?',
            'How do you maintain extreme conviction in uncharted territory?',
          ];
    }
    if (exp.category === 'Philosophers') {
      return lang === 'zh'
        ? [
            '从第一性原理与概念界定出发，如何理清我眼前的难题？',
            '如何识破伪概念与虚妄假象，抓住真实的本质？',
            '面对价值判断与伦理抉择，应当遵循什么法则？',
          ]
        : [
            'How do we dismantle this dilemma using first principles and conceptual clarity?',
            'How do I distinguish pseudo-problems from genuine reality?',
            'What moral and philosophical framework should guide this decision?',
          ];
    }
    // Default fallback starter prompts
    return lang === 'zh'
      ? [
          `以你的核心心智模型，会如何分析当下科技创业的决断？`,
          `面对两难权衡，你的核心原则是什么？`,
          `你会坚决反对哪些常见的平庸做法？`,
        ]
      : [
          `How would your core mental models analyze my current dilemma?`,
          `What first principles should govern this decision?`,
          `What anti-patterns would you push back against?`,
        ];
  };

  const starterPrompts = getStarterPrompts(activeSummary);

  const handleSend = async (userText: string) => {
    if (!userText.trim() || isGenerating || !expertDetail) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userText.trim(),
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setIsGenerating(true);

    const assistantId = (Date.now() + 1).toString();
    const assistantPlaceholder: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };

    setMessages([...newHistory, assistantPlaceholder]);

    try {
      await streamChatResponse(
        llmSettings,
        expertDetail,
        newHistory,
        lang,
        (currentText) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: currentText } : m))
          );
        }
      );
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: `*(Error: ${err.message || 'Failed to generate response'})*` }
            : m
        )
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyMessage = async (text: string, id: string) => {
    const ok = await copyText(text);
    if (ok) {
      setCopiedMsgId(id);
      onNotify(lang === 'en' ? 'Copied message!' : '已复制回答！');
      setTimeout(() => setCopiedMsgId(null), 2000);
    }
  };

  return (
    <div className="w-full flex-1 min-h-0 flex overflow-hidden bg-slate-950 text-slate-100">
      {/* 1. LEFT SIDEBAR: 80 Experts List */}
      <aside aria-label="80 Experts selection" className="w-80 h-full min-h-0 border-r border-slate-800/80 bg-slate-900/50 flex flex-col shrink-0 hidden md:flex overflow-hidden">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'en' ? '80 Minds' : '80 位大师列表'}</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              {sidebarExperts.length} / 80
            </span>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchSidebar}
              onChange={(e) => setSearchSidebar(e.target.value)}
              placeholder={lang === 'en' ? 'Search thinker...' : '搜索姓名或拼音...'}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Category mini pills */}
          <div className="flex items-center gap-1 mt-2.5 overflow-x-auto text-[10px] pb-1">
            {(['All', 'Founders & operators', 'Philosophers', 'AI & ML researchers', 'Scientists & researchers'] as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setSidebarCat(cat)}
                className={`px-2 py-0.5 rounded-md whitespace-nowrap font-medium transition-colors ${
                  sidebarCat === cat
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat === 'All' ? '全部' : cat.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Experts Scroll List */}
        <div id="sidebar-experts-list" className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-2 space-y-1">
          {sidebarExperts.map((exp) => {
            const isActive = exp.slug === currentSlug;
            const cStyle = getCategoryStyle(exp.category);

            return (
              <button
                key={exp.slug}
                onClick={() => onSelectExpert(exp.slug)}
                className={`w-full p-2.5 rounded-xl text-left flex items-center gap-3 transition-all ${
                  isActive
                    ? 'bg-slate-800/90 border border-cyan-500/60 shadow-md'
                    : 'hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={exp.avatar}
                    alt={exp.name}
                    className={`w-10 h-10 rounded-xl object-cover border ${
                      isActive ? 'border-cyan-400' : 'border-slate-700'
                    }`}
                  />
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-slate-900" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold truncate ${
                        isActive ? 'text-cyan-300' : 'text-slate-200'
                      }`}
                    >
                      {exp.name}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {exp.summary}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* 2. MAIN CHAT AREA */}
      <div className="flex-1 min-w-0 h-full min-h-0 flex flex-col overflow-hidden bg-slate-950">
        {/* Chat Header Bar */}
        <div className="h-16 px-4 sm:px-6 border-b border-slate-800 bg-slate-900/60 backdrop-blur flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {onBackToCatalog && (
              <button
                onClick={onBackToCatalog}
                className="p-2 rounded-lg text-slate-400 hover:text-white bg-slate-800 md:hidden"
                title="Back to Catalog"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            <img
              src={activeSummary.avatar}
              alt={activeSummary.name}
              className="w-10 h-10 rounded-xl object-cover border border-slate-700 shadow-md shrink-0"
            />

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold text-white truncate">
                  {activeSummary.name}
                </h2>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${catStyle.badge}`}>
                  {activeSummary.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">
                {activeSummary.summary}
              </p>
            </div>
          </div>

          {/* Right actions: Mind Specs + API settings + Clear */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setShowSpecsDrawer(!showSpecsDrawer)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
              title="View Mental Models & System Prompt"
            >
              <Brain className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">
                {lang === 'en' ? 'Mind Specs' : '思维蓝图'}
              </span>
            </button>

            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="AI Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {messages.length > 0 && (
              <button
                onClick={() => setMessages([])}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
                title="Clear Chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Message Scrollable Container */}
        <div id="chat-messages-container" className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-6">
          {/* Welcome Screen if empty */}
          {messages.length === 0 && (
            <div className="max-w-2xl mx-auto pt-6 sm:pt-12 text-center animate-fadeIn">
              <div className="relative inline-block mb-4">
                <img
                  src={activeSummary.avatar}
                  alt={activeSummary.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover mx-auto border-2 border-slate-700 shadow-2xl"
                />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-cyan-400 ring-4 ring-slate-950 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-slate-950" />
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {lang === 'en' ? `Talk directly with ${activeSummary.name}` : `与 ${activeSummary.name} 直接对话`}
              </h1>

              <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                {activeSummary.description}
              </p>

              {activeSummary.top_quote && (
                <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 italic max-w-md mx-auto">
                  "{activeSummary.top_quote}"
                </div>
              )}

              {/* Starter Question Chips */}
              <div className="mt-8">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  {lang === 'en' ? '💡 Suggested Topics / Questions:' : '💡 推荐点击发起的对话议题：'}
                </p>
                <div className="flex flex-col gap-2 max-w-xl mx-auto">
                  {starterPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt)}
                      className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-left text-xs sm:text-sm text-slate-200 transition-all flex items-center justify-between group hover:translate-x-1"
                    >
                      <span>{prompt}</span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Message List */}
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs sm:text-sm ${
                  isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                {!isUser && (
                  <img
                    src={activeSummary.avatar}
                    alt={activeSummary.name}
                    className="w-8 h-8 rounded-xl object-cover border border-slate-700 shrink-0 mt-0.5"
                  />
                )}

                <div
                  className={`relative p-4 rounded-2xl max-w-2xl leading-relaxed whitespace-pre-wrap group ${
                    isUser
                      ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white rounded-br-none shadow-md shadow-cyan-600/20'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
                  }`}
                >
                  {!isUser && (
                    <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800/60 text-[11px] font-bold text-cyan-400">
                      <span>{activeSummary.name}</span>
                      <button
                        onClick={() => handleCopyMessage(msg.content, msg.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-white transition-opacity"
                        title="Copy message"
                      >
                        {copiedMsgId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}

                  <div>{msg.content}</div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isGenerating && (
            <div className="flex gap-3 text-xs text-slate-400 items-center animate-pulse">
              <img
                src={activeSummary.avatar}
                alt={activeSummary.name}
                className="w-8 h-8 rounded-xl object-cover border border-slate-700"
              />
              <span className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>
                  {lang === 'en'
                    ? `${activeSummary.name} is formulating response...`
                    : `${activeSummary.name} 正在基于心智模型推演...`}
                </span>
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900/80 shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="relative flex items-center rounded-2xl bg-slate-950 border border-slate-800 focus-within:border-cyan-500/60 focus-within:ring-2 focus-within:ring-cyan-500/20 shadow-xl transition-all">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(input);
                  }
                }}
                placeholder={
                  lang === 'en'
                    ? `Ask ${activeSummary.name} anything... (Enter to send, Shift+Enter for newline)`
                    : `向 ${activeSummary.name} 提问... (Enter 发送，Shift+Enter 换行)`
                }
                className="w-full px-4 py-3 bg-transparent text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none resize-none max-h-32"
              />

              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isGenerating}
                className="mr-2 p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold disabled:opacity-30 transition-all shrink-0 shadow-md shadow-cyan-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Provider Indicator Strip */}
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 px-1">
              <button
                onClick={onOpenSettings}
                className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>
                  {llmSettings.provider === 'builtin'
                    ? lang === 'en'
                      ? 'Engine: Free Built-in Persona'
                      : '当前引擎：免费内置思维模型'
                    : `API: ${llmSettings.provider} (${llmSettings.model})`}
                </span>
                <span className="text-slate-600 underline">
                  {lang === 'en' ? 'Change' : '切换/配置'}
                </span>
              </button>

              <div className="hidden sm:block font-mono">
                npx skills add K-Dense-AI/mimeographs/{activeSummary.slug}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. RIGHT SLIDEOUT DRAWER: Mind Specs & Blueprint */}
      {showSpecsDrawer && expertDetail && (
        <aside aria-label="Mind blueprint and specs" className="w-96 h-full min-h-0 border-l border-slate-800 bg-slate-900/95 backdrop-blur-xl flex flex-col shrink-0 animate-slideLeft z-30 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span>{lang === 'en' ? 'Mind Blueprint' : '专家思维模型蓝图'}</span>
            </h3>
            <button
              onClick={() => setShowSpecsDrawer(false)}
              className="p-1 rounded-md text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-5 text-xs">
            {/* Mental Models */}
            <div>
              <h4 className="font-bold text-cyan-300 uppercase tracking-wider text-[11px] mb-2.5 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Mental Models' : '心智模型 (Mental Models)'}</span>
              </h4>
              <div className="space-y-2.5">
                {expertDetail.mental_models.map((mm, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                    <div className="font-bold text-white mb-1">{mm.title}</div>
                    <div className="text-slate-300 line-clamp-3 leading-relaxed">
                      {mm.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Frameworks */}
            <div>
              <h4 className="font-bold text-purple-300 uppercase tracking-wider text-[11px] mb-2.5 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Decision Frameworks' : '决策框架 (Frameworks)'}</span>
              </h4>
              <div className="space-y-2.5">
                {expertDetail.frameworks.map((fw, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                    <div className="font-bold text-white mb-1">{fw.title}</div>
                    <div className="text-slate-300 line-clamp-3 leading-relaxed">
                      {fw.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Principles */}
            <div>
              <h4 className="font-bold text-emerald-300 uppercase tracking-wider text-[11px] mb-2.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Core Principles' : '核心原则 (Principles)'}</span>
              </h4>
              <div className="space-y-2.5">
                {expertDetail.principles.map((pr, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                    <div className="font-bold text-white mb-1">{pr.title}</div>
                    <div className="text-slate-300 line-clamp-3 leading-relaxed">
                      {pr.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Always-on System Prompt button */}
            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  copyText(expertDetail.agents.full);
                  onNotify(lang === 'en' ? 'Copied AGENTS.md!' : '已复制 AGENTS.md 全文！');
                }}
                className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Copy System Prompt (AGENTS.md)' : '复制完整系统提示词 (AGENTS.md)'}</span>
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};
