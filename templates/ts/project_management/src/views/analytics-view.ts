import { RedGin, html, getset, s, on, css } from "scalpeljs";
import { store } from "../store";

const styles = css`
  .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
  .stat-card { text-align: center; }
  .stat-value { font-size: 2rem; font-weight: 700; color: var(--primary); }
  .stat-label { font-size: 0.875rem; color: var(--gray-600); margin-top: 0.25rem; }
  .progress-item { margin-bottom: 1rem; }
  .progress-header { display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 0.25rem; }
  .progress-bar-bg { background: var(--gray-100); border-radius: 9999px; height: 0.5rem; }
  .progress-bar-fill { background: var(--primary); height: 100%; border-radius: 9999px; }
`;

export default class AnalyticsView extends RedGin {
  global = getset(store.state);
  private unsub?: () => void;
  
  styles = [styles];
  
  onInit() { this.unsub = store.subscribe(state => (this.global = state)); }
  disconnectedCallback() { this.unsub?.(); super.disconnectedCallback(); }
  
  getStats() {
    const projects = this.global.projects;
    const tasks = this.global.tasks;
    const active = projects.filter((p: any) => p.status === 'active').length;
    const completed = tasks.filter((t: any) => t.status === 'done').length;
    const avgProgress = projects.length ? Math.round(projects.reduce((sum: number, p: any) => sum + p.progress, 0) / projects.length) : 0;
    return { active, completed, avgProgress, totalTasks: tasks.length };
  }
  
  render() {
    const stats = this.getStats();
    const statusCount = { active: 0, done: 0, hold: 0 };
    this.global.projects.forEach((p: any) => statusCount[p.status as keyof typeof statusCount]++);
    
    return html`
      <div class="animate">
        <h1 style="margin-bottom: 2rem;">Analytics</h1>
        
        <div class="stats">
          <div class="card stat-card">
            <div class="stat-value">${stats.active}</div>
            <div class="stat-label">Active Projects</div>
          </div>
          <div class="card stat-card">
            <div class="stat-value">${stats.completed}</div>
            <div class="stat-label">Completed Tasks</div>
          </div>
          <div class="card stat-card">
            <div class="stat-value">${stats.avgProgress}%</div>
            <div class="stat-label">Avg Progress</div>
          </div>
          <div class="card stat-card">
            <div class="stat-value">${stats.totalTasks}</div>
            <div class="stat-label">Total Tasks</div>
          </div>
        </div>
        
        <div class="card" style="margin-bottom: 1.5rem;">
          <h3 style="margin-bottom: 1rem;">Projects by Status</h3>
          ${Object.entries(statusCount).map(([status, count]) => html`
            <div class="progress-item">
              <div class="progress-header">
                <span>${status.toUpperCase()}</span>
                <span>${count}</span>
              </div>
              <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width: ${(count / Math.max(1, this.global.projects.length)) * 100}%"></div>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="card">
          <h3 style="margin-bottom: 1rem;">Overall Progress</h3>
          <div class="progress-bar-bg" style="height: 1rem;">
            <div class="progress-bar-fill" style="width: ${stats.avgProgress}%; height: 1rem;"></div>
          </div>
          <div style="text-align: center; margin-top: 0.5rem;">${stats.avgProgress}% Complete</div>
        </div>
      </div>
    `;
  }
}

customElements.define('analytics-view', AnalyticsView);