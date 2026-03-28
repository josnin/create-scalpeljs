import {
  RedGin,
  html,
  on,
  getset,
  s,
  FormBuilder,
  attr,
} from 'scalpeljs';
import { store, actions } from '../store';

const VALIDATORS = {
  required: {
    validator: (v: any) => !!v?.toString().trim(),
    errorMessage: 'Required.',
  },
  apiKey: {
    validator: (v: string) => v.startsWith('sk-'),
    errorMessage: 'Must start with sk-...',
  },
};

export default class EngineConfig extends RedGin {
  global = getset(store.state);
  isValid = getset<boolean>(false);
  isSaving = getset<boolean>(false);

  //static observedAttributes = ['is-valid'];

  private _unsub?: () => void;
  private fb!: FormBuilder;
  private configForm!: ReturnType<FormBuilder['group']>;

  onInit() {
    this._unsub = store.subscribe((state) => (this.global = { ...state }));
    this.setupForm();
  }

  private setupForm() {
    this.fb = new FormBuilder(this.shadowRoot!);
    this.configForm = this.fb.group({
      apiKey: this.fb.control(this.global.config.apiKey, [
        VALIDATORS.required,
        VALIDATORS.apiKey,
      ]),
      model: this.fb.control(this.global.config.model, [VALIDATORS.required]),
    });

    this.configForm.subscribe(() => {
      this.configForm.validateAll();
      this.isValid = this.configForm.valid;
      //console.log(this.configForm.getValue())
    });
  }

  disconnectedCallback() {
    this._unsub?.();
    super.disconnectedCallback();
  }

  handleSave = async () => {
    this.isSaving = true;

    try {
      await actions.saveConfig(this.configForm.getValue());
    } finally {
      this.isSaving = false;
    }
  };

  render() {
    return html`
      <div class="card">
        <h2 style="font-size: 2.2rem; font-weight: 850; letter-spacing: -1.5px; margin: 0 0 2rem;">Engine Config.</h2>
        
        <div class="field">
          <label for="apiKey">OpenAI API Key</label>
          <input 
            type="password" id="apiKey" class="input-standard" 
            placeholder="sk-..."
          >
           <div id="apiKeyError"></div>
        </div>

        <div class="field">
          <label for="model">Inference Model</label>
          <select id="model" class="input-standard">
            <option value="gpt-4o">GPT-4o</option>
            <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
          </select>
           <div id="modelError"></div>
        </div>

          <button 
            type="button"
            ${attr(
              'class',
              () => `btn-primary ${this.isSaving ? 'processing' : ''}`
            )}
            ${attr('disabled', () => !this.isValid || this.isSaving)}
            ${on('click', this.handleSave)}
          >

          ${s(() =>
            this.isSaving
              ? html`<div class="spinner"></div> <span>Syncing...</span>`
              : 'Save Configuration'
          )}
          </button>
      </div>
    `;
  }
}
customElements.define('app-config', EngineConfig);
