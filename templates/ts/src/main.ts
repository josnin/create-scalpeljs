import { RedGin, html } from 'scalpeljs';

class App extends RedGin {
  render(): string {
    return html`<h1>Welcome to ScalpelJS (TS)</h1>`;
  }
}
customElements.define('app-root', App);
const appDiv = document.getElementById('app');
if (appDiv) appDiv.innerHTML = '<app-root></app-root>';

