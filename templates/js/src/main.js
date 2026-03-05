import { RedGin, html } from 'https://cdn.jsdelivr.net/npm/scalpeljs@latest/dist/scalpeljs.min.js';

class App extends RedGin {
  render() {
    return html`<h1>Welcome to ScalpelJS (JS)</h1>`;
  }
}
customElements.define('app-root', App);
document.getElementById('app').innerHTML = '<app-root></app-root>';

