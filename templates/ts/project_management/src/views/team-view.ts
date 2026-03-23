import { RedGin, html, getset, s, on, css } from "scalpeljs";
import { store, actions } from "../store";

const styles = css`
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
  .member-card { display: flex; gap: 1rem; align-items: center; }
  .avatar { width: 60px; height: 60px; background: var(--gray-100); border-radius: 1rem; display: flex; align-items: center; justify-content: center; font-size: 2rem; }
  .status-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 0.5rem; }
  .online { background: #10b981; }
  .offline { background: #9ca3af; }
`;

export default class TeamView extends RedGin {
  global = getset(store.state);
  private unsub?: () => void;
  
  styles = [styles];
  
  onInit() {
    this.unsub = store.subscribe(state => (this.global = state));
    if (this.global.members.length === 0) this.loadMockMembers();
  }
  
  disconnectedCallback() { this.unsub?.(); super.disconnectedCallback(); }
  
  loadMockMembers() {
    const mock = [
      { id: '1', name: 'Alex Johnson', role: 'Product Manager', avatar: '👨‍💼', status: 'online' },
      { id: '2', name: 'Sarah Chen', role: 'Lead Developer', avatar: '👩‍💻', status: 'online' },
      { id: '3', name: 'Mike Rodriguez', role: 'UI Designer', avatar: '🎨', status: 'offline' },
    ];
    store.set('members', mock);
  }
  
  render() {
    return html`
      <div class="animate">
        <div class="header" style="margin-bottom: 2rem;">
          <h1>Team (${s(() => this.global.members.length)})</h1>
        </div>
        
        <div class="grid">
          ${s(() => this.global.members.map((m: any) => html`
            <div class="card member-card">
              <div class="avatar">${m.avatar}</div>
              <div>
                <div style="font-weight: 600;">${m.name}</div>
                <div style="font-size: 0.875rem; color: var(--gray-600);">${m.role}</div>
                <div style="font-size: 0.75rem; margin-top: 0.25rem;">
                  <span class="status-dot ${m.status}"></span>${m.status}
                </div>
              </div>
            </div>
          `))}
        </div>
      </div>
    `;
  }
}

customElements.define('team-view', TeamView);