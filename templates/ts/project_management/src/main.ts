import { RedGin, shareStyle, JongRouter } from "scalpeljs";
import "./components/dashboard-shell";
import "./views/projects-view";
import "./views/tasks-view";
import "./views/team-view";
import "./views/analytics-view";
import { theme } from "./theme.css";

const styleElement = document.createElement('style');
styleElement.textContent = theme;
document.head.appendChild(styleElement);
shareStyle(theme);

class App extends RedGin {
  onInit() {
    const outlet = this.shadowRoot!.getElementById('outlet')!;
    const router = new JongRouter([
      { pattern: '/', component: import('./views/projects-view') },
      { pattern: '/projects', component: import('./views/projects-view') },
      { pattern: '/tasks', component: import('./views/tasks-view') },
      { pattern: '/team', component: import('./views/team-view') },
      { pattern: '/analytics', component: import('./views/analytics-view') },
    ], outlet);
    router.init();
  }

  render() {
    return `<dashboard-shell><div id="outlet"></div></dashboard-shell>`;
  }
}

customElements.define('pm-app', App);