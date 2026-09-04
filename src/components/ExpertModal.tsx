import React, { useState, useEffect } from 'react';
import {
  X,
  Brain,
  Cpu,
  MessageSquareQuote,
  BookOpen,
  Sparkles,
  Send,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { ExpertSummary, ExpertDetail, Language } from '../types';
import { getCategoryStyle, I18N, formatCategory } from '../utils';

interface ExpertModalProps {
  expertSummary: ExpertSummary | null;
  lang: Language;
  onClose: () => void;
  onNotify: (msg: string) => void;
}

export const ExpertModal: React.FC<ExpertModalProps> = ({
  expertSummary,
  lang,
  onClose,
  onNotify,
}) => {
  const [detail, setDetail] = useState<ExpertDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'models' | 'frameworks' | 'principles' | 'quotes' | 'chat'
  >('models');

  // Chat state
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([]);
  const [isThinking, setIsThinking] = useState(false);

  const t = I18N[lang];

  useEffect(() => {
    if (!expertSummary) {
      setDetail(null);
      return;
    }
    setLoading(true);
    fetch(`./data/experts/${expertSummary.slug}.json`)
      .then((res) => res.json())
      .then((data: ExpertDetail) => {
        setDetail(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load expert details:', err);
        setLoading(false);
      });
  }, [expertSummary]);

  if (!expertSummary) return null;

  const catStyle = getCategoryStyle(expertSummary.category);

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuestion.trim() || isThinking || !detail) return;

    const userQ = chatQuestion.trim();
    setChatHistory((prev) => [...prev, { role: 'user', text: userQ }]);
    setChatQuestion('');
    setIsThinking(true);

    setTimeout(() => {
      // Synthesize realistic advice based on their core mental models and principles
      const topPrinciples = detail.principles.slice(0, 3).map((p) => p.title).join('; ');
      const topModel = detail.mental_models[0]?.title || 'First Principles';
      const quote = detail.quotes[0]?.quote ? `"${detail.quotes[0].quote}"` : '';

      let response = '';
      if (lang === 'zh') {
        response = `站在 **${detail.name}** 的视角来思考你的问题：\n\n`;
        response += `针对 “${userQ}”，我首先会用 **【${topModel}】** 的模型来解构它。\n\n`;
        response += `### 核心判断法则：\n`;
        response += `1. **${detail.principles[0]?.title || '关注本质价值'}**：不要被表象的琐碎干扰。${detail.principles[0]?.content?.slice(0, 120) || ''}\n`;
        if (detail.principles[1]) {
          response += `2. **${detail.principles[1].title}**：${detail.principles[1].content?.slice(0, 100)}\n`;
        }
        if (quote) {
          response += `\n> 正如我常说的：${quote}\n\n`;
        }
        response += `### 行动建议：\n推翻先入为主的假设，从第一性原理和严密逻辑对方案进行压力测试，持续迭代并寻找破局点。`;
      } else {
        response = `Reasoning through the lens of **${detail.name}**:\n\n`;
        response += `Regarding your dilemma "${userQ}", I immediately evaluate this using **"${topModel}"**.\n\n`;
        response += `### Fundamental Stance:\n`;
        response += `1. **${detail.principles[0]?.title || 'Focus on Core Value'}**: Strip away the noise. ${detail.principles[0]?.content?.slice(0, 140) || ''}\n`;
        if (detail.principles[1]) {
          response += `2. **${detail.principles[1].title}**: ${detail.principles[1].content?.slice(0, 120)}\n`;
        }
        if (quote) {
          response += `\n> As I have always emphasized: ${quote}\n\n`;
        }
        response += `### Concrete Action:\nCut down unproven complexity, test your core assumptions against reality immediately, and iterate with discipline.`;
      }

      setChatHistory((prev) => [...prev, { role: 'assistant', text: response }]);
      setIsThinking(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header bar */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950/70 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <img
              src={expertSummary.avatar}
              alt={expertSummary.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-slate-700 shadow-xl shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${catStyle.badge}`}>
                  {formatCategory(expertSummary.category, lang)}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  slug: {expertSummary.slug}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {expertSummary.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                {expertSummary.summary}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-5 sm:px-6 pt-3 bg-slate-900 border-b border-slate-800 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('models')}
            className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'models'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>{t.mentalModels}</span>
            {detail && <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">{detail.mental_models.length}</span>}
          </button>

          <button
            onClick={() => setActiveTab('frameworks')}
            className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'frameworks'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>{t.frameworks}</span>
            {detail && <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">{detail.frameworks.length}</span>}
          </button>

          <button
            onClick={() => setActiveTab('principles')}
            className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'principles'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{t.principles}</span>
            {detail && <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">{detail.principles.length}</span>}
          </button>

          <button
            onClick={() => setActiveTab('quotes')}
            className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'quotes'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquareQuote className="w-4 h-4" />
            <span>{t.quotes}</span>
            {detail && <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">{detail.quotes.length}</span>}
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'chat'
                ? 'border-purple-400 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>{t.consultThisMind}</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-950/40">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
              <p className="text-xs">{t.loading}</p>
            </div>
          ) : !detail ? (
            <div className="text-center py-10 text-slate-400">Failed to load details</div>
          ) : (
            <>
              {/* Tab 1: Mental Models */}
              {activeTab === 'models' && (
                <div className="space-y-4">
                  {detail.mental_models.map((mm, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-colors"
                    >
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Brain className="w-4 h-4 text-cyan-400" />
                        <span>{mm.title}</span>
                      </h4>
                      <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                        {mm.content}
                      </p>
                    </div>
                  ))}
                  {detail.mental_models.length === 0 && (
                    <p className="text-slate-500 text-xs">No mental models recorded.</p>
                  )}
                </div>
              )}

              {/* Tab 2: Frameworks */}
              {activeTab === 'frameworks' && (
                <div className="space-y-4">
                  {detail.frameworks.map((fw, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-colors"
                    >
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-purple-400" />
                        <span>{fw.title}</span>
                      </h4>
                      <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                        {fw.content}
                      </p>
                    </div>
                  ))}
                  {detail.frameworks.length === 0 && (
                    <p className="text-slate-500 text-xs">No frameworks recorded.</p>
                  )}
                </div>
              )}

              {/* Tab 3: Principles */}
              {activeTab === 'principles' && (
                <div className="space-y-4">
                  {detail.principles.map((pr, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-colors"
                    >
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-emerald-400" />
                        <span>{pr.title}</span>
                      </h4>
                      <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                        {pr.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 4: Quotes */}
              {activeTab === 'quotes' && (
                <div className="space-y-3">
                  {detail.quotes.map((q, idx) => (
                    <blockquote
                      key={idx}
                      className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 text-slate-300 italic text-xs sm:text-sm flex flex-col gap-2"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-cyan-400 font-serif text-xl leading-none">“</span>
                        <span>{q.quote}</span>
                      </div>
                      {q.source && (
                        <cite className="text-[10px] text-slate-500 font-mono not-italic self-end">
                          Source: {q.source}
                        </cite>
                      )}
                    </blockquote>
                  ))}
                  {detail.quotes.length === 0 && (
                    <p className="text-slate-500 text-xs">No quotes recorded.</p>
                  )}
                </div>
              )}

              {/* Tab 5: Interactive Mind Consultation */}
              {activeTab === 'chat' && (
                <div className="flex flex-col h-full min-h-[350px]">
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {chatHistory.length === 0 && (
                      <div className="text-center py-8 text-slate-400">
                        <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                        <p className="font-semibold text-sm text-slate-200">
                          {lang === 'en' ? `Ask ${detail.name} for Advice` : `向 ${detail.name} 咨询决策建议`}
                        </p>
                        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                          {lang === 'en'
                            ? `Test how ${detail.name}'s mental models apply to your technical, business, or philosophical dilemma.`
                            : `体验 ${detail.name} 基于其独特心智模型对你的技术构架、商业抉择或哲理困惑进行针对性分析。`}
                        </p>
                      </div>
                    )}

                    {chatHistory.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-3 text-xs sm:text-sm ${
                          msg.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {msg.role === 'assistant' && (
                          <img
                            src={detail.avatar}
                            alt={detail.name}
                            className="w-8 h-8 rounded-lg object-cover border border-slate-700 shrink-0"
                          />
                        )}
                        <div
                          className={`p-3.5 rounded-xl max-w-xl whitespace-pre-line leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-cyan-600 text-white rounded-br-none'
                              : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}

                    {isThinking && (
                      <div className="flex gap-3 text-xs text-slate-400 items-center">
                        <img
                          src={detail.avatar}
                          alt={detail.name}
                          className="w-7 h-7 rounded-lg object-cover border border-slate-700 animate-pulse"
                        />
                        <span className="flex items-center gap-1.5">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                          <span>{lang === 'en' ? `${detail.name} is evaluating...` : `${detail.name} 正在审视问题...`}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleAskQuestion} className="flex gap-2">
                    <input
                      type="text"
                      value={chatQuestion}
                      onChange={(e) => setChatQuestion(e.target.value)}
                      placeholder={
                        lang === 'en'
                          ? `Ask ${detail.name} a question or dilemma...`
                          : `向 ${detail.name} 提出具体问题或权衡抉择...`
                      }
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                    <button
                      type="submit"
                      disabled={isThinking || !chatQuestion.trim()}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 transition-all shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{lang === 'en' ? 'Ask' : '发送'}</span>
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
