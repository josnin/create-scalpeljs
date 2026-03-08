import { RedGin, shareStyle, JongRouter } from "scalpeljs";
import "./components/nav-bar";
import "./components/welcome-message";

import { theme } from "./theme.css";

const styleElement = document.createElement('style');
styleElement.textContent = theme;
document.head.appendChild(styleElement);


shareStyle(theme); // Share the compiled theme styles globally


class App extends RedGin {

  onInit() {
    console.log('App initialized');
    const router = new JongRouter([
      { pattern: '/', component: import('./components/catalog') },
      { pattern: '/checkout', component: import('./components/checkout') }
    ], this.shadowRoot!.getElementById('outlet')!, this.shadowRoot!);

    router.init();

  }

  render() {
    return `
      <welcome-message></welcome-message>
      <nav-bar></nav-bar>
      <div id="outlet"></div>
    `;
  }
}
customElements.define('my-app', App);
