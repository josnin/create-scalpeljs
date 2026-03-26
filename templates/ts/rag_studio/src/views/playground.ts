import { RedGin, html, on, getset, s, watch } from "scalpeljs";
import { store, actions, selectors } from "../store";

export default class Playground extends RedGin {
  global = getset(store.state);
  isProcessing = getset<boolean>(false);
  private _unsub?: () => void;

  onInit() {
    this._unsub = store.subscribe(state => (this.global = { ...state }));
  }

  disconnectedCallback() { this._unsub?.(); super.disconnectedCallback(); }

  handleSend = async (e: KeyboardEvent) => {
    const input = e.target as HTMLInputElement;
    const prompt = input.value.trim();
    if (e.key !== 'Enter' || !prompt || this.isProcessing) return;

    this.isProcessing = true;
    input.value = '';
    
    await actions.postMessage(prompt);
    
    this.isProcessing = false;
  }

  render() {
    return html`
      <div class="studio-layout">
        <section class="chat-view">
          <div class="messages-list">
            <!-- Selector for Messages -->
            ${watch(["global"], () => selectors.getMessages().map(m => html`
                <div class="msg ${m.role}">${m.content}</div>
            `))}
            
            ${s(() => this.isProcessing ? html`
                <div class="msg ai"><span class="spinner"></span> Thinking...</div>
            ` : '')}
          </div>

          <div class="input-container">
            ${watch(["global"], () => html`
              <input class="input-standard" type="text" 
                placeholder="${this.isProcessing ? 'AI is processing...' : 'Type a query...'}" 
                ?disabled="${this.isProcessing}"
                ${on('keyup', this.handleSend)}>
            `)}
          </div>
        </section>
        
        <aside class="sources-panel">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
            <h3 style="font-size:0.8rem; text-transform:uppercase; color:var(--text-muted);">Sources</h3>
            
            <!-- Watch specifically for history changes via Selector -->
            ${watch(["global"], () => selectors.hasHistory() ? html`
              <button style="color:var(--error); cursor:pointer; background:none; border:none; font-size:0.7rem; font-weight:bold;" 
                ${on('click', () => actions.clearSession())}>CLEAR</button>
            ` : '')}
          </div>

          <!-- Selector for Sources -->
          ${watch(["global"], () => selectors.getSources().map(src => html`
            <div class="source-card">
                <strong>📄 ${src.title}</strong>
                <p style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">${src.snippet}</p>
            </div>
          `))}
        </aside>
      </div>
    `;
  }



}
customElements.define('app-playground', Playground);
