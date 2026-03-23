import { Store } from "scalpeljs";

export type Project = {
  id: string;
  name: string;
  desc: string;
  status: 'active' | 'done' | 'hold';
  progress: number;
  due: string;
  priority: 'high' | 'med' | 'low';
};

export type Task = {
  id: string;
  projectId: string;
  title: string;
  status: 'todo' | 'doing' | 'review' | 'done';
  assignee: string;
  due: string;
};

export type Member = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'offline';
};

const initialState = {
  projects: [] as Project[],
  tasks: [] as Task[],
  members: [] as Member[],
  currentUser: { id: '1', name: 'Alex', avatar: '👨‍💻' },
  ui: { loading: false, sidebarOpen: false }
};

export const store = new Store(initialState, {
  storageKey: 'pm_dashboard',
  debug: true
});

// Helper actions
export const actions = {
  addProject: (p: Project) => store.set('projects', [...store.state.projects, p]),
  updateProject: (id: string, data: Partial<Project>) => {
    const projects = store.state.projects.map((p:any) => p.id === id ? { ...p, ...data } : p);
    store.set('projects', projects);
  },
  addTask: (t: Task) => store.set('tasks', [...store.state.tasks, t]),
  updateTask: (id: string, data: Partial<Task>) => {
    const tasks = store.state.tasks.map((t:any) => t.id === id ? { ...t, ...data } : t);
    store.set('tasks', tasks);
  },
  addNotification: (msg: string) => {
    const notif = { id: Date.now().toString(), msg, read: false, time: new Date() };
    store.set('notifications', [notif, ...(store.state.notifications || [])]);
  },
  toggleSidebar: () => {
    store.set('ui', { ...store.state.ui, sidebarOpen: !store.state.ui.sidebarOpen });
  }

  
};