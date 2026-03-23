import { RedGin, html, on, getset, s, css } from "scalpeljs";
import { store } from "../store";

const playLocalStyles = css`
  .msg { padding: 1rem 1.25rem; border-radius: 20px; max-width: 80%; line-height: 1.5; font-size: 0.95rem; }
  .user { align-self: flex-end; background: var(--primary); color: #fff; border-bottom-right-radius: 4px; }
  .ai { align-self: flex-start; background: var(--bg-app); color: var(--text-main); border-bottom-left-radius: 4px; }
  
  .input-container { position: relative; display: flex; align-items: center; padding-top: 1rem; border-top: 1px solid var(--border); }
  
  .sources-panel { background: var(--bg-sidebar); padding: 1.5rem; border-left: 1px solid var(--border); overflow-y: auto; }
  .source-card { background: #fff; padding: 1rem; border-radius: 16px; margin-bottom: 12px; border: 1px solid var(--border); }
`;

export default class Playground extends RedGin {
  global = getset(store.state);
  isProcessing = getset<boolean>(false);
  private _unsub?: () => void;

  styles = [playLocalStyles];

  onInit() {
    this._unsub = store.subscribe(state => {
      this.global = state;
    });
  }

  disconnectedCallback() { this._unsub?.(); super.disconnectedCallback(); }

  async handleSend(e: KeyboardEvent) {
    const input = e.target as HTMLInputElement;
    const prompt = input.value.trim();
    if (e.key !== 'Enter' || !prompt || this.isProcessing) return;

    this.isProcessing = true;
    input.value = '';
    const currentMessages = [...this.global.messages, { role: 'user', content: prompt }];
    store.set('messages', currentMessages);

    await new Promise(r => setTimeout(r, 1500));
    store.set('activeSources', [{ title: 'rag_data.json', snippet: 'Context optimized...' }]);
    store.set('messages', [...currentMessages, { role: 'ai', content: 'Context retrieved. Access granted.' }]);
    this.isProcessing = false;
  }

  render() {
    return html`
      <div class="studio-layout">
        <section class="chat-view">
          <div class="messages-list">
            ${s(() => this.global.messages.map((m: any) => html`<div class="msg ${m.role}">${m.content}</div>`))}
            ${s(() => this.isProcessing ? html`<div class="msg ai"><span class="spinner"></span> Thinking...</div>` : '')}
          </div>

          <div class="input-container">
            ${s(() => html`
              <input class="input-standard" type="text" 
                placeholder="${this.isProcessing ? 'AI is processing...' : 'Type a query...'}" 
                ${this.isProcessing ? 'disabled' : ''}
                ${on('keyup', (e) => this.handleSend(e as KeyboardEvent))}>
            `)}
          </div>
        </section>
        
        <aside class="sources-panel">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
            <h3 style="font-size:0.8rem; text-transform:uppercase; color:var(--text-muted);">Sources</h3>
            ${s(() => this.global.messages.length > 0 ? html`
              <button style="color:var(--error); cursor:pointer; background:none; border:none; font-weight:bold;" 
                ${on('click', () => store.set('messages', []))}>Clear</button>
            ` : '')}
          </div>
          ${s(() => this.global.activeSources.map((src: any) => html`
            <div class="source-card"><strong>📄 ${src.title}</strong><p style="font-size:0.8rem; color:var(--text-muted);">${src.snippet}</p></div>
          `))}
        </aside>
      </div>
    `;
  }
}
customElements.define('app-playground', Playground);
