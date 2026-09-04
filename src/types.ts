export interface ExpertSummary {
  slug: string;
  name: string;
  category: string;
  summary: string;
  description: string;
  avatar: string;
  install: {
    npx: string;
    gh: string;
    manual: string;
  };
  tags: string[];
  top_quote: string;
  principles_count: number;
  mental_models_count: number;
  frameworks_count: number;
}

export interface MentalModelItem {
  title: string;
  content: string;
}

export interface FrameworkItem {
  title: string;
  content: string;
}

export interface PrincipleItem {
  title: string;
  content: string;
}

export interface QuoteItem {
  quote: string;
  source: string;
}

export interface ExpertDetail extends ExpertSummary {
  skill: {
    full: string;
    body: string;
    sections: Record<string, string>;
  };
  agents: {
    full: string;
  };
  mental_models: MentalModelItem[];
  frameworks: FrameworkItem[];
  principles: PrincipleItem[];
  quotes: QuoteItem[];
  sources: string;
}

export interface CatalogData {
  repo: string;
  count: number;
  categories: string[];
  experts: ExpertSummary[];
}

export type Category = 
  | 'All'
  | 'Founders & operators'
  | 'Philosophers'
  | 'AI & ML researchers'
  | 'Scientists & researchers';

export type Language = 'en' | 'zh';

export type LLMProvider = 'builtin' | 'deepseek' | 'openai' | 'openrouter' | 'custom';

export interface LLMSettings {
  provider: LLMProvider;
  apiKey: string;
  baseUrl: string;
  model: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  thought?: string;
  referencedModel?: string;
}
