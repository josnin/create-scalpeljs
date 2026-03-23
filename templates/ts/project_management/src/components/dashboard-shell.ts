import { s, RedGin, html, getset, attr, on, css } from "scalpeljs";
import { store, actions } from "../store";

const styles = css`
  :host { display: flex; min-height: 100vh; }
  
  .sidebar {
    position: fixed;
    width: 260px;
    height: 100vh;
    background: var(--bg);
    border-right: 1px solid var(--border);
    padding: 1.5rem;
  }
  
  .logo { font-size: 1.5rem; font-weight: 700; color: var(--primary); margin-bottom: 2rem; }
  
  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    border-radius: 0.5rem;
    color: var(--gray-600);
    text-decoration: none;
    cursor: pointer;
  }
  .nav-item:hover, .nav-item.active { background: var(--gray-100); color: var(--primary); }
  
  .main {
    flex: 1;
    margin-left: 260px;
  }
  
  .topbar {
    position: sticky;
    top: 0;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .content { padding: 2rem; }
  
  @media (max-width: 768px) {
    .sidebar { transform: translateX(-100%); transition: 0.3s; }
    .sidebar.open { transform: translateX(0); }
    .main { margin-left: 0; }
  }
`;

export default class DashboardShell extends RedGin {
  global = getset(store.state);
  private unsub?: () => void;
  
  styles = [styles];
  
  onInit() {
    this.unsub = store.subscribe(state => {
      this.global = state;
      console.log('State updated:', state);
    });
  }
  
  disconnectedCallback() {
    this.unsub?.();
    super.disconnectedCallback();
  }
  
  toggleSidebar() {
    actions.toggleSidebar();
    //store.set('ui.sidebarOpen', !this.global.ui.sidebarOpen);
  }
  
  render() {
    const nav = [
      { href: '/projects', icon: '📋', label: 'Projects' },
      { href: '/tasks', icon: '✅', label: 'Tasks' },
      { href: '/team', icon: '👥', label: 'Team' },
      { href: '/analytics', icon: '📊', label: 'Analytics' }
    ];
    
    return html`
      ${s(() => console.log(this.global.ui.sidebarOpen))}
      <aside class="sidebar 
          ${attr('open', () => this.global.ui.sidebarOpen)}"
          >
        <div class="logo">📊 PM Flow</div>
        <nav>
          ${nav.map(item => html`
            <a router-link href="${item.href}" class="nav-item">
              <span>${item.icon}</span> ${item.label}
            </a>
          `).join('')}
        </nav>
      </aside>
      
      <main class="main">
        <div class="topbar">
          <button class="btn" ${on('click', () => this.toggleSidebar())}>☰</button>
          <div>👤 ${this.global.currentUser.name}</div>
        </div>
        <div class="content"><slot></slot></div>
      </main>
    `;
  }
}

customElements.define('dashboard-shell', DashboardShell);