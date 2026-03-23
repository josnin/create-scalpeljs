import { shareStyle, RedGin, JongRouter, html, css } from "scalpeljs";
import "./views/playground";
import "./views/engine-config";
import { theme } from "./theme.css";

const styleElement = document.createElement('style');
styleElement.textContent = theme;
document.head.appendChild(styleElement);


shareStyle(theme); // Share the compiled theme styles globally

const shellStyles = css`
  :host { display: block; font-family: 'Inter', system-ui, sans-serif; }
  nav { display: flex; gap: 2rem; padding: 1rem 2rem; background: #000; color: #fff; }
  nav a { color: #888; text-decoration: none; font-size: 0.9rem; font-weight: 600; }
  nav a:hover { color: #fff; }
  #outlet { height: calc(100vh - 60px); background: #f4f4f7; overflow: hidden; }
`;

class RagStudio extends RedGin {
  styles = [shellStyles];
  onInit() {
    const router = new JongRouter([
      { pattern: '/', component: import('./views/playground') },
      { pattern: '/config', component: import('./views/engine-config') }
    ], this.shadowRoot!.getElementById('outlet')!)
    router.init();
  }
  render() {
    return html`
      <nav>
        <span style="font-weight: 900;">SCALPEL RAG</span>
        <a router-link href="/">Playground</a>
        <a router-link href="/config">Settings</a>
      </nav>
      <div id="outlet"></div>
    `;
  }
}
customElements.define('my-app', RagStudio);
