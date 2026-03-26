import { Store } from "scalpeljs";

export interface Message { role: 'user' | 'ai'; content: string; }
export interface AppState {
  messages: Message[];
  activeSources: { title: string; snippet: string }[];
  config: { apiKey: string; model: string };
}

const initialState: AppState = {
  messages: [],
  activeSources: [],
  config: { apiKey: '', model: 'gpt-4o' }
};

export const store = new Store(initialState, { storageKey: 'rag_studio_v1' });

export const selectors = {
  hasHistory: () => store.state.messages.length > 0
};

export const actions = {
  async saveConfig(updates: Partial<AppState['config']>) {
    await new Promise(r => setTimeout(r, 1000));
    store.set('config', { ...store.state.config, ...updates });
  },

  async postMessage(prompt: string) {
    // 1. User message
    store.set('messages', [...store.state.messages, { role: 'user', content: prompt }]);

    // 2. Simulated delay for RAG
    await new Promise(r => setTimeout(r, 800));
    store.set('activeSources', [{ title: 'rag_data.json', snippet: 'Matched knowledge base...' }]);

    // 3. AI Stream Start
    const response = "Analyzing context... Access granted. Based on your RAG data, I have optimized the inference for your specific model.";
    const aiIdx = store.state.messages.length;
    store.set('messages', [...store.state.messages, { role: 'ai', content: '' }]);

    let current = "";
    for (const char of response) {
      current += char;
      const msgs = [...store.state.messages];
      msgs[aiIdx] = { role: 'ai', content: current };
      store.set('messages', msgs);
      await new Promise(r => setTimeout(r, 20 + Math.random() * 25));
    }
  },

  clearSession: () => store.set('messages', []) || store.set('activeSources', [])
};
