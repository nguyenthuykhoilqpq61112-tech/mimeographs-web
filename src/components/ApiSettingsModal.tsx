import React, { useState } from 'react';
import { X, Key, ShieldCheck, Sparkles, Check, Server, Eye, EyeOff } from 'lucide-react';
import { LLMSettings, Language, LLMProvider } from '../types';
import { saveStoredSettings } from '../services/llm';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: LLMSettings;
  onSave: (newSettings: LLMSettings) => void;
  lang: Language;
}

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
  lang,
}) => {
  const [provider, setProvider] = useState<LLMProvider>(settings.provider);
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [baseUrl, setBaseUrl] = useState(settings.baseUrl);
  const [model, setModel] = useState(settings.model);
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  const handleProviderChange = (p: LLMProvider) => {
    setProvider(p);
    if (p === 'deepseek') {
      setBaseUrl('https://api.deepseek.com/v1');
      setModel('deepseek-chat');
    } else if (p === 'openai') {
      setBaseUrl('https://api.openai.com/v1');
      setModel('gpt-4o-mini');
    } else if (p === 'openrouter') {
      setBaseUrl('https://openrouter.ai/api/v1');
      setModel('meta-llama/llama-3.3-70b-instruct');
    } else if (p === 'builtin') {
      // no key needed
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: LLMSettings = {
      provider,
      apiKey,
      baseUrl,
      model,
    };
    saveStoredSettings(updated);
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {lang === 'en' ? 'AI Model & Key Settings' : '大模型与对话服务配置'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'en' ? 'Optional: Connect your own LLM key' : '可选：支持直连大模型 API 或使用内置引擎'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-4">
          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {lang === 'en' ? 'Conversation Engine' : '对话驱动引擎'}
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleProviderChange('builtin')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  provider === 'builtin'
                    ? 'border-cyan-500 bg-cyan-950/30 text-white shadow-sm ring-1 ring-cyan-500/50'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-cyan-300">
                    {lang === 'en' ? 'Built-in Engine' : '内置引擎'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {lang === 'en' ? 'Built-in Key' : '内置密钥'}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleProviderChange('deepseek')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  provider === 'deepseek'
                    ? 'border-cyan-500 bg-cyan-950/30 text-white shadow-sm ring-1 ring-cyan-500/50'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Server className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">DeepSeek API</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">deepseek-chat</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleProviderChange('openai')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  provider === 'openai'
                    ? 'border-cyan-500 bg-cyan-950/30 text-white shadow-sm ring-1 ring-cyan-500/50'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Server className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">OpenAI API</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">gpt-4o / gpt-4o-mini</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleProviderChange('custom')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  provider === 'custom'
                    ? 'border-cyan-500 bg-cyan-950/30 text-white shadow-sm ring-1 ring-cyan-500/50'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Server className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">
                    {lang === 'en' ? 'Custom / Ollama' : '自定义 / 兼容端点'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {lang === 'en' ? 'OpenAI compatible' : '硅基流动 / 本地 Ollama 等'}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Key & Endpoints fields if not builtin */}
          {provider !== 'builtin' && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  API Key
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full px-3 py-2 pr-10 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>
                    {lang === 'en'
                      ? 'Your key is saved only in your local browser localStorage.'
                      : 'Key 仅保存在你的本地浏览器 localStorage 中，绝不上传第三方。'}
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Base URL
                </label>
                <input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://api.deepseek.com/v1"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Model
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="deepseek-chat"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              {lang === 'en' ? 'Cancel' : '取消'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
            >
              <Check className="w-4 h-4" />
              <span>{lang === 'en' ? 'Save Settings' : '保存设置'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
