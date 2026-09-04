import React, { useState, useMemo } from 'react';
import { Search, LayoutGrid, List, Filter, X, Sparkles, CheckSquare, Square, Copy, Check } from 'lucide-react';
import { ExpertSummary, Language, Category } from '../types';
import { ExpertCard } from './ExpertCard';
import { I18N, getCategoryStyle, copyText } from '../utils';

interface CatalogSectionProps {
  experts: ExpertSummary[];
  lang: Language;
  onOpenDetail: (expert: ExpertSummary) => void;
  selectedSlugs: string[];
  onToggleSelect: (slug: string) => void;
  onSelectAll: (slugs: string[]) => void;
  onClearSelection: () => void;
  onNotify: (msg: string) => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  experts,
  lang,
  onOpenDetail,
  selectedSlugs,
  onToggleSelect,
  onSelectAll,
  onClearSelection,
  onNotify,
}) => {
  const t = I18N[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const categories: Category[] = [
    'All',
    'Founders & operators',
    'Philosophers',
    'AI & ML researchers',
    'Scientists & researchers',
  ];

  const filteredExperts = useMemo(() => {
    return experts.filter((exp) => {
      // Category filter
      if (activeCategory !== 'All' && exp.category !== activeCategory) {
        return false;
      }
      // Search filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchName = exp.name.toLowerCase().includes(q);
      const matchSlug = exp.slug.toLowerCase().includes(q);
      const matchDesc = exp.description.toLowerCase().includes(q);
      const matchSummary = exp.summary.toLowerCase().includes(q);
      const matchTags = exp.tags.some((tag) => tag.toLowerCase().includes(q));
      const matchQuote = exp.top_quote.toLowerCase().includes(q);

      return matchName || matchSlug || matchDesc || matchSummary || matchTags || matchQuote;
    });
  }, [experts, activeCategory, searchQuery]);

  const allFilteredSelected = useMemo(() => {
    if (filteredExperts.length === 0) return false;
    return filteredExperts.every((exp) => selectedSlugs.includes(exp.slug));
  }, [filteredExperts, selectedSlugs]);

  const handleToggleSelectAll = () => {
    if (allFilteredSelected) {
      onClearSelection();
    } else {
      onSelectAll(filteredExperts.map((e) => e.slug));
    }
  };

  const handleCopy = async (npxCmd: string, slug: string) => {
    const ok = await copyText(npxCmd);
    if (ok) {
      setCopiedSlug(slug);
      onNotify(`${lang === 'en' ? 'Copied' : '已复制'}: ${npxCmd}`);
      setTimeout(() => setCopiedSlug(null), 2000);
    }
  };

  return (
    <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Controls Header */}
      <div className="flex flex-col gap-5 mb-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search input */}
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* View mode toggle & Batch select */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={handleToggleSelectAll}
              className="px-3.5 py-2.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center gap-1.5 transition-colors"
            >
              {allFilteredSelected ? (
                <>
                  <CheckSquare className="w-4 h-4 text-cyan-400" />
                  <span>{lang === 'en' ? 'Deselect All' : '取消全选'}</span>
                </>
              ) : (
                <>
                  <Square className="w-4 h-4 text-slate-400" />
                  <span>{lang === 'en' ? 'Select All' : '全选本页'}</span>
                </>
              )}
            </button>

            <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'table' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const count =
              cat === 'All' ? experts.length : experts.filter((e) => e.category === cat).length;

            let label = cat;
            if (lang === 'zh') {
              if (cat === 'All') label = '全部专家';
              if (cat === 'Founders & operators') label = '创始人与商业领袖';
              if (cat === 'Philosophers') label = '哲学家与思想家';
              if (cat === 'AI & ML researchers') label = 'AI与机器学习学者';
              if (cat === 'Scientists & researchers') label = '科学家与流行病学者';
            }

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
              >
                <span>{label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results Info Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <div>
            <span>{t.showingCount} </span>
            <span className="font-bold text-white">{filteredExperts.length}</span>
            <span> {t.of} </span>
            <span className="font-bold text-white">{experts.length}</span>
            <span> {t.experts}</span>
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>{lang === 'en' ? 'Clear search filter' : '清空搜索条件'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid or Table Display */}
      {filteredExperts.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-slate-800 bg-slate-900/30">
          <Filter className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-300 font-semibold">
            {lang === 'en' ? 'No experts found matching your criteria' : '未找到匹配的专家技能'}
          </p>
          <p className="text-slate-500 text-xs mt-1">
            {lang === 'en'
              ? 'Try searching with different keywords or switch categories.'
              : '请尝试其他关键词（如：first principles, loss curve, capital）或切换分类。'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredExperts.map((expert) => (
            <ExpertCard
              key={expert.slug}
              expert={expert}
              lang={lang}
              onOpenDetail={onOpenDetail}
              isSelected={selectedSlugs.includes(expert.slug)}
              onToggleSelect={onToggleSelect}
              onNotify={onNotify}
            />
          ))}
        </div>
      ) : (
        /* Table / Index View */
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">
                    <span className="sr-only">Select</span>
                  </th>
                  <th className="py-3.5 px-4">{lang === 'en' ? 'Expert' : '专家'}</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">{lang === 'en' ? 'Category' : '领域'}</th>
                  <th className="py-3.5 px-4">{lang === 'en' ? 'Reach for this when…' : '适用场景与核心思维'}</th>
                  <th className="py-3.5 px-4 text-right">{lang === 'en' ? 'Install' : '安装命令'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredExperts.map((exp) => {
                  const catStyle = getCategoryStyle(exp.category);
                  const isSelected = selectedSlugs.includes(exp.slug);

                  return (
                    <tr
                      key={exp.slug}
                      onClick={() => onOpenDetail(exp)}
                      className={`cursor-pointer hover:bg-slate-800/40 transition-colors ${
                        isSelected ? 'bg-cyan-950/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleSelect(exp.slug)}
                          className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={exp.avatar}
                            alt={exp.name}
                            className="w-8 h-8 rounded-lg object-cover border border-slate-700 shrink-0"
                            loading="lazy"
                          />
                          <div>
                            <div className="font-bold text-white hover:text-cyan-300">
                              {exp.name}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {exp.slug}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${catStyle.badge}`}>
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300 max-w-md">
                        <p className="line-clamp-2 leading-relaxed">{exp.description}</p>
                      </td>
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleCopy(exp.install.npx, exp.slug)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700 transition-colors inline-flex items-center gap-1.5"
                        >
                          {copiedSlug === exp.slug ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                              <span>npx</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};
