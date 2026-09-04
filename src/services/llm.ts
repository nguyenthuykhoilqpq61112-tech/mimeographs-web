import { ChatMessage, ExpertDetail, LLMSettings } from '../types';

export const DEFAULT_LLM_SETTINGS: LLMSettings = {
  provider: 'builtin',
  apiKey: '',
  baseUrl: 'https://api.deepseek.com/v1',
  model: 'deepseek-chat',
};

export function getStoredSettings(): LLMSettings {
  try {
    const raw = localStorage.getItem('mimeo_llm_settings');
    if (raw) {
      return { ...DEFAULT_LLM_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to parse stored LLM settings', e);
  }
  return DEFAULT_LLM_SETTINGS;
}

export function saveStoredSettings(settings: LLMSettings) {
  localStorage.setItem('mimeo_llm_settings', JSON.stringify(settings));
}

// Built-in intelligent persona synthesizer
export function generateBuiltinPersonaResponse(
  expert: ExpertDetail,
  messages: ChatMessage[],
  lang: 'en' | 'zh'
): string {
  const lastUserMsg = messages.filter((m) => m.role === 'user').slice(-1)[0]?.content || '';
  const queryLower = lastUserMsg.toLowerCase();

  // Find matching mental model
  let bestModel = expert.mental_models[0];
  for (const m of expert.mental_models) {
    const titleWords = m.title.toLowerCase().split(' ');
    if (titleWords.some((w) => w.length > 3 && queryLower.includes(w))) {
      bestModel = m;
      break;
    }
  }

  // Find matching framework
  let bestFramework = expert.frameworks[0];
  for (const f of expert.frameworks) {
    const titleWords = f.title.toLowerCase().split(' ');
    if (titleWords.some((w) => w.length > 3 && queryLower.includes(w))) {
      bestFramework = f;
      break;
    }
  }

  // Find quote
  const quoteObj = expert.quotes[Math.floor(Math.random() * Math.min(expert.quotes.length, 3))] || expert.quotes[0];
  const quoteText = quoteObj?.quote ? `“${quoteObj.quote}”` : '';

  if (lang === 'zh') {
    let out = `我是 **${expert.name}**。面对你提到的：“${lastUserMsg.trim()}”，我的核心判断如下：\n\n`;

    if (bestModel) {
      out += `### 💡 核心心智模型：【${bestModel.title}】\n`;
      out += `${bestModel.content}\n\n`;
    }

    out += `### ⚖️ 决策与行动推演：\n`;
    const p1 = expert.principles[0];
    const p2 = expert.principles[1];
    if (p1) {
      out += `1. **${p1.title}**：${p1.content.slice(0, 160)}...\n`;
    }
    if (p2) {
      out += `2. **${p2.title}**：${p2.content.slice(0, 160)}...\n`;
    }

    if (bestFramework) {
      out += `\n### 🛠️ 实战操作框架：【${bestFramework.title}】\n`;
      out += `${bestFramework.content.slice(0, 260)}...\n\n`;
    }

    if (quoteText) {
      out += `> 正如我始终强调的信念：${quoteText}\n\n`;
    }

    out += `**总结建议**：停止在次要枝节上的妥协。回到最根本的事实与第一性原理，用最简单、最抗脆弱的方式推进它。`;
    return out;
  } else {
    let out = `I am **${expert.name}**. In analyzing your query: "${lastUserMsg.trim()}", here is how I break this down from first principles:\n\n`;

    if (bestModel) {
      out += `### 💡 Guiding Mental Model: [${bestModel.title}]\n`;
      out += `${bestModel.content}\n\n`;
    }

    out += `### ⚖️ Reasoning & Decisions:\n`;
    const p1 = expert.principles[0];
    const p2 = expert.principles[1];
    if (p1) {
      out += `1. **${p1.title}**: ${p1.content.slice(0, 180)}...\n`;
    }
    if (p2) {
      out += `2. **${p2.title}**: ${p2.content.slice(0, 180)}...\n`;
    }

    if (bestFramework) {
      out += `\n### 🛠️ Execution Framework: [${bestFramework.title}]\n`;
      out += `${bestFramework.content.slice(0, 260)}...\n\n`;
    }

    if (quoteText) {
      out += `> As I've always maintained: ${quoteText}\n\n`;
    }

    out += `**Directive**: Eliminate unnecessary noise and feature creep. Test your assumptions against hard reality immediately.`;
    return out;
  }
}

export async function streamChatResponse(
  settings: LLMSettings,
  expert: ExpertDetail,
  messages: ChatMessage[],
  lang: 'en' | 'zh',
  onDelta: (chunk: string) => void
): Promise<string> {
  // If builtin or no key configured, use intelligent persona engine
  if (settings.provider === 'builtin' || !settings.apiKey.trim()) {
    const fullText = generateBuiltinPersonaResponse(expert, messages, lang);
    // Simulate natural streaming chunks
    const chunks = fullText.split(/(\s+|[,.，。？！\n]+)/);
    let accumulated = '';
    for (const chunk of chunks) {
      accumulated += chunk;
      onDelta(accumulated);
      await new Promise((r) => setTimeout(r, 15 + Math.random() * 20));
    }
    return fullText;
  }

  // Otherwise, use real OpenAI-compatible endpoint
  let endpoint = settings.baseUrl.trim();
  if (endpoint.endsWith('/')) endpoint = endpoint.slice(0, -1);
  if (!endpoint.endsWith('/chat/completions')) {
    endpoint = `${endpoint}/chat/completions`;
  }

  const systemPrompt = `${expert.agents.full}\n\nYou are roleplaying as ${expert.name}. Stay strictly in character, adopting their mental models, voice, principles, and vocabulary. Respond concisely, authoritatively, and directly in the user's language (${lang === 'zh' ? 'Chinese' : 'English'}).`;

  const apiMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: settings.model || 'deepseek-chat',
        messages: apiMessages,
        stream: true,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`API error ${res.status}: ${errText}`);
    }

    if (!res.body) {
      throw new Error('No readable stream returned by API');
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let accumulated = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(':')) continue;
        if (trimmed === 'data: [DONE]') continue;
        if (trimmed.startsWith('data: ')) {
          try {
            const parsed = JSON.parse(trimmed.slice(6));
            const delta = parsed.choices?.[0]?.delta?.content || '';
            if (delta) {
              accumulated += delta;
              onDelta(accumulated);
            }
          } catch (err) {
            // Ignore parse errors on incomplete chunks
          }
        }
      }
    }

    return accumulated;
  } catch (err: any) {
    console.warn('Real API call failed, falling back to built-in persona engine:', err);
    onDelta(`*(提示: 自定义 API 请求遇到问题: ${err.message}，已自动为您启用内置引擎)*\n\n`);
    const fallbackText = generateBuiltinPersonaResponse(expert, messages, lang);
    onDelta(fallbackText);
    return fallbackText;
  }
}
