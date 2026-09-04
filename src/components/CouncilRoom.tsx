import React, { useState } from 'react';
import { Sparkles, Users, Send, Loader2, Plus, X, MessageSquare, Copy, Check, ArrowRight } from 'lucide-react';
import { ExpertSummary, Language } from '../types';
import { I18N, copyText, getCategoryStyle } from '../utils';

interface CouncilRoomProps {
  experts: ExpertSummary[];
  selectedSlugs: string[];
  onToggleSelect: (slug: string) => void;
  lang: Language;
  onNotify: (msg: string) => void;
}

interface CouncilResponse {
  slug: string;
  name: string;
  avatar: string;
  category: string;
  content: string;
}

export const CouncilRoom: React.FC<CouncilRoomProps> = ({
  experts,
  selectedSlugs,
  onToggleSelect,
  lang,
  onNotify,
}) => {
  const t = I18N[lang];
  const [question, setQuestion] = useState('');
  const [isDebating, setIsDebating] = useState(false);
  const [responses, setResponses] = useState<CouncilResponse[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  // Selected expert summaries (limit up to 4 for clean layout)
  const councilMembers = experts.filter((e) => selectedSlugs.includes(e.slug)).slice(0, 4);

  const samplePrompts = [
    {
      title: lang === 'en' ? 'Open Source vs Proprietary AI' : '开源AI模型 vs 闭源商业SaaS',
      q: lang === 'en'
        ? 'Should our AI startup open-source our core model weights to build ecosystem adoption, or keep it proprietary behind a subscription API?'
        : '作为一家AI初创团队，我们应该开源核心模型权重以获得生态势能，还是全面闭源通过API收取商业订阅费用？',
    },
    {
      title: lang === 'en' ? 'Velocity vs Technical Debt' : '极速交付 vs 重构架构技术债',
      q: lang === 'en'
        ? 'We have 6 months of cash runway. Our codebase is messy, but users are asking for 5 new features. Should we halt feature work to refactor, or double down on shipping?'
        : '我们的资金还有6个月跑道。现有代码库积攒了大量技术债，但客户又急需5个新功能。我们该暂停开发进行架构重构，还是硬抗技术债继续极速交付？',
    },
    {
      title: lang === 'en' ? 'Moats & Capital Allocation' : '护城河与资本分配',
      q: lang === 'en'
        ? 'We just raised $5M Series A. Competitors are heavily spending on sales and marketing. Should we match their marketing spend or pour everything into R&D and product craftsmanship?'
        : '我们刚刚完成500万美元A轮融资。竞品在疯狂砸钱买量和做销售公关。我们应该跟进做大规模营销，还是把资金全部投入底层研发与产品极简打磨？',
    },
  ];

  const handleConvene = async () => {
    if (!question.trim() || councilMembers.length === 0 || isDebating) return;

    setIsDebating(true);
    setResponses([]);

    // Simulate round of deliberation based on each expert's profile
    setTimeout(() => {
      const generated: CouncilResponse[] = councilMembers.map((member) => {
        let text = '';
        if (lang === 'zh') {
          text = `### ${member.name} 的研讨分析：\n\n`;
          text += `面对你的难题：“${question.trim()}”\n\n`;
          text += `**1. 破除认知迷思：**\n根据我的判断基准，${member.summary}。我们不能用平庸的折中思维来看待这个问题。\n\n`;
          text += `**2. 关键法则运用：**\n如果从根源切入，首要的是厘清真实价值与外部噪音的区别。正如我始终坚守的准则：**“${member.top_quote || '聚焦第一性原理与核心护城河'}”**。\n\n`;
          text += `**3. 决断建议：**\n立即斩断不创造长期复利的支线任务。将力量集中在不可替代的临界点上，不要被对手的步伐乱了阵脚。`;
        } else {
          text = `### ${member.name}'s Perspective:\n\n`;
          text += `Addressing your dilemma: "${question.trim()}"\n\n`;
          text += `**1. Challenging Core Assumptions:**\nFrom my operating framework, ${member.summary}. Never settle for conventional committee consensus.\n\n`;
          text += `**2. Strategic Heuristic:**\nCut through the vanity metrics. My stance is anchored in: **"${member.top_quote || 'Focus obsessively on first principles and structural moats.'}"**.\n\n`;
          text += `**3. Decisive Directive:**\nEliminate secondary distractions immediately. Double down on the one variable that builds compounding leverage.`;
        }

        return {
          slug: member.slug,
          name: member.name,
          avatar: member.avatar,
          category: member.category,
          content: text,
        };
      });

      setResponses(generated);
      setIsDebating(false);
    }, 800);
  };

  const handleCopySummary = async () => {
    if (responses.length === 0) return;
    const compiled = responses.map((r) => `## ${r.name}\n\n${r.content}`).join('\n\n---\n\n');
    const ok = await copyText(compiled);
    if (ok) {
      setCopiedAll(true);
      onNotify(lang === 'en' ? 'Copied council deliberation!' : '已复制圆桌研讨全记录！');
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800 text-xs font-semibold text-purple-300 mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>{lang === 'en' ? 'Multi-Agent Pantheon' : '万神殿多专家研讨机制'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {t.councilTitle}
        </h2>
        <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
          {t.councilSubtitle}
        </p>
      </div>

      {/* Council Board Setup */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span>{lang === 'en' ? 'Convened Council Members' : '当前席位专家'}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-normal">
                {councilMembers.length} / 4
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'en'
                ? 'Select 1 to 4 experts from the catalog to form your advisory council'
                : '从80位专家中挑选 1 至 4 位组成你的专属决策智囊团'}
            </p>
          </div>

          <button
            onClick={() => setPickerOpen(!pickerOpen)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'en' ? 'Add / Swap Members' : '添加或更换专家'}</span>
          </button>
        </div>

        {/* Member Avatar Cards */}
        {councilMembers.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-slate-800 rounded-xl">
            <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">
              {lang === 'en' ? 'No experts currently on council' : '当前尚未挑选专家入席'}
            </p>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              {lang === 'en'
                ? 'Select experts below or from the catalog to begin.'
                : '请点击下方按钮快速挑选几位导师（如：Steve Jobs, Warren Buffett, Ilya Sutskever）。'}
            </p>
            <button
              onClick={() => {
                onToggleSelect('steve-jobs');
                onToggleSelect('warren-buffett');
                onToggleSelect('ilya-sutskever');
              }}
              className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs shadow-md"
            >
              {lang === 'en' ? 'Load Dream Council (Jobs + Buffett + Sutskever)' : '一键载入默认豪华智囊团'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {councilMembers.map((member) => {
              const catStyle = getCategoryStyle(member.category);
              return (
                <div
                  key={member.slug}
                  className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-white text-xs truncate group-hover:text-cyan-300">
                        {member.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate font-mono">
                        {member.category}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleSelect(member.slug)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors ml-2 shrink-0"
                    title="Remove from council"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Member Quick Picker Tray */}
        {pickerOpen && (
          <div className="mt-6 pt-6 border-t border-slate-800">
            <h4 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
              {lang === 'en' ? 'Quick Add from Catalog' : '快速添加智囊（点击切换席位）'}
            </h4>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
              {experts.map((exp) => {
                const isSelected = selectedSlugs.includes(exp.slug);
                return (
                  <button
                    key={exp.slug}
                    onClick={() => onToggleSelect(exp.slug)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                  >
                    <img
                      src={exp.avatar}
                      alt={exp.name}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                    <span>{exp.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Question Input Form */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            {lang === 'en' ? 'Council Question or Dilemma' : '提交至圆桌研讨的议题或决策困境'}
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t.askPlaceholder}
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all resize-none shadow-inner"
            />
          </div>

          {/* Sample dilemma chips */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-slate-400">
              {lang === 'en' ? 'Examples:' : '快捷议题:'}
            </span>
            {samplePrompts.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setQuestion(p.q)}
                className="text-[11px] px-2.5 py-1 rounded-md bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
              >
                {p.title}
              </button>
            ))}
          </div>

          {/* Convene Button */}
          <div className="mt-5 flex items-center justify-between">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>{t.simulatedAdvice}</span>
            </div>

            <button
              onClick={handleConvene}
              disabled={isDebating || !question.trim() || councilMembers.length === 0}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-sm flex items-center gap-2 disabled:opacity-50 transition-all shadow-xl shadow-purple-500/20"
            >
              {isDebating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{lang === 'en' ? 'Council Deliberating...' : '智囊团正在研讨...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t.generateAdvice}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Council Deliberation Output */}
      {responses.length > 0 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              <span>{lang === 'en' ? 'Deliberation Records' : '圆桌研讨决议与多重视角'}</span>
            </h3>

            <button
              onClick={handleCopySummary}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAll ? (lang === 'en' ? 'Copied' : '已复制') : (lang === 'en' ? 'Copy All Insights' : '复制全量研讨记录')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {responses.map((resp) => {
              const catStyle = getCategoryStyle(resp.category);
              return (
                <div
                  key={resp.slug}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-800">
                      <img
                        src={resp.avatar}
                        alt={resp.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-md"
                      />
                      <div>
                        <h4 className="font-extrabold text-white text-base">{resp.name}</h4>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${catStyle.badge}`}>
                          {resp.category}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {resp.content}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>npx skills add K-Dense-AI/mimeographs/{resp.slug}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
