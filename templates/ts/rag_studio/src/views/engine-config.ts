import { attr, propReflect, RedGin, html, on, getset, s, FormBuilder } from "scalpeljs";
import { store } from "../store";

const VALIDATORS = {
  required: { validator: (v: any) => !!v?.toString().trim(), errorMessage: 'Required.' },
  apiKey: { validator: (v: string) => v.startsWith('sk-'), errorMessage: 'Must start with sk-...' }
};

export default class EngineConfig extends RedGin {
  global = getset(store.state);
  isValid = propReflect<boolean>(false);
  isSaving = getset<boolean>(false);

  static observedAttributes = ['is-valid'];

  private _unsub?: () => void;
  private fb!: FormBuilder;
  private configForm!: ReturnType<FormBuilder['group']>;

//  styles = [theme]; // Using the shared theme

  onInit() {
    this._unsub = store.subscribe(state => (this.global = state));
    this.setupForm();
  }

  private setupForm() {
    this.fb = new FormBuilder(this.shadowRoot!);
    this.configForm = this.fb.group({
      apiKey: this.fb.control(this.global.config.apiKey, [VALIDATORS.required, VALIDATORS.apiKey]),
      model: this.fb.control(this.global.config.model, [VALIDATORS.required])
    });

    this.configForm.subscribe(() => {
      this.configForm.validateAll();
      this.isValid = this.configForm.valid;
    });
  }

  disconnectedCallback() {
    this._unsub?.();
    super.disconnectedCallback();
  }

  async handleSave() {
    this.isSaving = true;
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    store.set('config', { 
      ...this.global.config, 
      ...this.configForm.getValue() 
    });
    
    this.isSaving = false;
  }

  render() {
    return html`
      <div class="card">
        <h2 style="font-size: 2.2rem; font-weight: 850; letter-spacing: -1.5px; margin: 0 0 2rem;">Engine Config.</h2>
        
        <div class="field">
          <label for="apiKey">OpenAI API Key</label>
          <input 
            type="password" 
            id="apiKey" 
            class="input-standard" 
            placeholder="sk-..." 
            value="${this.global.config.apiKey}"
            ${on('input', (e: any) => this.configForm.setValue({ "apiKey": e.target.value }))}
          >
          <div id="apiKeyError" class="error-text"></div>
        </div>

        <div class="field">
          <label for="model">Inference Model</label>
          <select 
            id="model" 
            class="input-standard"
            ${on('change', (e: any) => this.configForm.setValue({ "model": e.target.value }))}
          >
            <option value="gpt-4o">GPT-4o</option>
            <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
          </select>
        </div>

        ${s(() => html`
          <button 
            type="button"
            class="btn-primary ${this.isSaving ? 'processing' : ''}"
            ${on('click', () => this.handleSave())}
            ${!this.isValid || this.isSaving ? 'disabled' : ''}
          >
            ${this.isSaving 
              ? html`<div class="spinner spinner-white"></div> <span>Syncing...</span>` 
              : 'Save Configuration'}
          </button>
        `)}
      </div>
    `;
  }
}

customElements.define('app-config', EngineConfig);
