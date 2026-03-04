import { RedGin, html } from 'https://cdn.jsdelivr.net/npm/redgin@latest/dist/redgin.min.js';

class App extends RedGin {
  render() {
    return html`<h1>Welcome to JSgood (JS)</h1>`;
  }
}
customElements.define('app-root', App);
document.getElementById('app').innerHTML = '<app-root></app-root>';

