import { Store } from "scalpeljs";

const initialState = {
  messages: [] as { role: 'user' | 'ai', content: string }[],
  activeSources: [] as { title: string, snippet: string }[],
  config: { apiKey: '', model: 'gpt-4o' }
};

export const store = new Store(initialState, {
  storageKey: 'rag_studio_v1',
  debug: true
});
