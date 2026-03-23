import { RedGin, html, getset, s, on, css } from "scalpeljs";
import { store, actions } from "../store";

const styles = css`
  .board { display: flex; gap: 1.5rem; overflow-x: auto; }
  .column { flex: 1; min-width: 280px; background: var(--gray-50); border-radius: var(--radius); padding: 1rem; }
  .column h3 { margin-bottom: 1rem; font-size: 1rem; }
  .task-card { background: var(--bg); border-radius: 0.5rem; padding: 0.75rem; margin-bottom: 0.75rem; border: 1px solid var(--border); cursor: pointer; }
  .task-card:hover { border-color: var(--primary); transform: translateX(4px); }
`;

const columns = [
  { id: 'todo', title: '📝 To Do', icon: '📝' },
  { id: 'doing', title: '🔄 In Progress', icon: '🔄' },
  { id: 'review', title: '👀 Review', icon: '👀' },
  { id: 'done', title: '✅ Done', icon: '✅' }
];

export default class TasksView extends RedGin {
  global = getset(store.state);
  private unsub?: () => void;
  
  styles = [styles];
  
  onInit() {
    this.unsub = store.subscribe(state => (this.global = state));
    if (this.global.tasks.length === 0) this.loadMockTasks();
  }
  
  disconnectedCallback() { this.unsub?.(); super.disconnectedCallback(); }
  
  loadMockTasks() {
    const mock = [
      { id: '1', projectId: '1', title: 'Design system setup', status: 'doing', assignee: '1', due: '2024-12-10' },
      { id: '2', projectId: '1', title: 'Implement components', status: 'todo', assignee: '1', due: '2024-12-15' },
      { id: '3', projectId: '2', title: 'API documentation', status: 'review', assignee: '2', due: '2024-12-12' },
    ];
    mock.forEach(t => actions.addTask(t as any));
  }
  
  getProjectName(projectId: string) {
    return this.global.projects.find((p: any) => p.id === projectId)?.name || 'Unknown';
  }
  
  render() {
    return html`
      <div class="animate">
        <div class="header" style="margin-bottom: 2rem;">
          <h1>Task Board</h1>
        </div>
        
        <div class="board">
          ${columns.map(col => html`
            <div class="column">
              <h3>${col.title} (${s(() => this.global.tasks.filter((t: any) => t.status === col.id).length)})</h3>
              <div>
                ${s(() => this.global.tasks.filter((t: any) => t.status === col.id).map((task: any) => html`
                  <div class="task-card">
                    <div style="font-weight: 500;">${task.title}</div>
                    <div style="font-size: 0.75rem; color: var(--gray-600); margin-top: 0.5rem;">
                      📁 ${this.getProjectName(task.projectId)} • 👤 User ${task.assignee} • 📅 ${new Date(task.due).toLocaleDateString()}
                    </div>
                  </div>
                `).join(''))}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

customElements.define('tasks-view', TasksView);