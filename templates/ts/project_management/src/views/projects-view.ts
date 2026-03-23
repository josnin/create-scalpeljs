import { RedGin, html, getset, s, on, css } from "scalpeljs";
import { store, actions, type Project } from "../store";

const styles = css`
  .header { display: flex; justify-content: space-between; margin-bottom: 2rem; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
  .project-card { cursor: pointer; }
  .progress-bar { background: var(--gray-100); border-radius: 9999px; height: 0.5rem; margin: 1rem 0; }
  .progress-fill { background: var(--primary); height: 100%; border-radius: 9999px; transition: width 0.3s; }
  .modal {
    position: fixed; inset: 0; background: rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center; z-index: 1000;
  }
  .modal-content { background: var(--bg); border-radius: var(--radius); padding: 2rem; width: 90%; max-width: 500px; }
  .form-group { margin-bottom: 1rem; }
  .form-group label { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500; }
  .form-group input, .form-group select, .form-group textarea {
    width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 0.5rem;
  }
`;

export default class ProjectsView extends RedGin {
  global = getset(store.state);
  showModal = getset<boolean>(false);
  private unsub?: () => void;
  //private showModal = false;
  private newProject = { name: '', desc: '', status: 'active' as const, priority: 'med' as const, due: '' };
  
  styles = [styles];
  
  onInit() {
    this.unsub = store.subscribe(state => (this.global = state));
    if (this.global.projects.length === 0) this.loadMockData();
  }
  
  disconnectedCallback() { this.unsub?.(); super.disconnectedCallback(); }
  
  loadMockData() {
    const mock: Project[] = [
      { id: '1', name: 'Mobile App', desc: 'Redesign mobile experience', status: 'active', progress: 65, due: '2024-12-15', priority: 'high' },
      { id: '2', name: 'API Migration', desc: 'Migrate to new API gateway', status: 'active', progress: 30, due: '2025-01-20', priority: 'high' },
      { id: '3', name: 'Analytics', desc: 'Build real-time dashboard', status: 'hold', progress: 45, due: '2024-12-30', priority: 'med' },
    ];
    mock.forEach(p => actions.addProject(p));
  }
  
  createProject() {
    if (!this.newProject.name.trim()) return;
    actions.addProject({ id: Date.now().toString(), ...this.newProject, progress: 0 });
    this.showModal = false;
    this.newProject = { name: '', desc: '', status: 'active', priority: 'med', due: '' };
    actions.addNotification(`Project "${this.newProject.name}" created`);
  }
  
  render() {
    
    return html`
      <div class="animate">
        <div class="header">
          <h1>Projects</h1>
          <button class="btn btn-primary" ${on('click', () => this.showModal = true)}>+ New Project</button>
        </div>
        
        <div class="grid">
          ${s(() => this.global.projects.map((p: Project) => html`
            <div class="card project-card" ${on('click', () => location.hash = `/projects/${p.id}`)}>
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <strong>${p.name}</strong>
                <span class="badge badge-${p.status}">${p.status}</span>
              </div>
              <div style="font-size: 0.875rem; color: var(--gray-600); margin-bottom: 1rem;">${p.desc}</div>
              <div class="progress-bar"><div class="progress-fill" style="width: ${p.progress}%"></div></div>
              <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; font-size: 0.75rem;">
                <span>📅 ${new Date(p.due).toLocaleDateString()}</span>
                <span class="badge badge-${p.priority}">${p.priority}</span>
              </div>
            </div>
          ` ).join(''))}
        </div>

        ${s(() => this.showModal ? html`
          <div class="modal" ${on('click', (e: any) => e.target.classList.contains('modal') && (this.showModal = false))}>
            <div class="modal-content">
              <h2 style="margin-bottom: 1rem;">New Project</h2>
              <div class="form-group">
                <label>Name *</label>
                <input value="${this.newProject.name}" ${on('input', (e: any) => this.newProject.name = e.target.value)}>
              </div>
              <div class="form-group">
                <label>Description</label>
                <textarea value="${this.newProject.desc}" ${on('input', (e: any) => this.newProject.desc = e.target.value)}></textarea>
              </div>
              <div class="form-group">
                <label>Due Date</label>
                <input type="date" value="${this.newProject.due}" ${on('input', (e: any) => this.newProject.due = e.target.value)}>
              </div>
              <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                <button class="btn" ${on('click', () => this.showModal = false)}>Cancel</button>
                <button class="btn btn-primary" ${on('click', () => this.createProject())}>Create</button>
              </div>
            </div>
          </div>
      </div>
        ` : '')} 
            
    `;
  }
}

customElements.define('projects-view', ProjectsView);