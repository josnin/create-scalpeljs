// src/components/welcome-message.ts
import { RedGin, html } from "scalpeljs";

export default class WelcomeMessage extends RedGin {

  render() {
    return html`
      <div class="marketing">
        <h1><span>🔪</span> ScalpelJS</h1>
        <p>
          A lightweight framework for building Web Component applications.<br>
          Zero overhead, maximum control.
        </p>
        <div class="pill">
          👇 Sample shop — everything below is yours to modify and build upon
        </div>
      </div>
    `;
  }
}

customElements.define('welcome-message', WelcomeMessage);