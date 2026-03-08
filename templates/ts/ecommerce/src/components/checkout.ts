import { propReflect, RedGin, html, on, getset, s, FormBuilder, css } from "scalpeljs";
import { store } from "../store";

export default class Checkout extends RedGin {
  global = getset(store.state);
  isValid = propReflect<boolean>(false);
  static observedAttributes = ['is-valid'];
  private _unsub?: () => void;
  fb!: FormBuilder;
  orderForm!: ReturnType<FormBuilder['group']>;

  onInit() {
    this._unsub = store.subscribe(state => this.global = state);
    this.fb = new FormBuilder(this.shadowRoot!);

    const Validators = {
      required: {
        validator: (value: any) => !!value && value.trim().length > 0,
        errorMessage: 'Identification required.',
      },
      email: {
        validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        errorMessage: 'Enter a valid digital address.',
      }
    };

    this.orderForm = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email])
    });

    this.orderForm.subscribe(() => {
      this.orderForm.validateAll();
      this.isValid = this.orderForm.valid;
    });
  }

  disconnectedCallback() { this._unsub?.(); super.disconnectedCallback(); }

  styles = [css`
    :host { 
      display: flex; 
      justify-content: center; 
      padding: 4rem 1.5rem;
      background: var(--bg);
      min-height: 80vh;
    }

    .card {
      width: 100%;
      max-width: 440px;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 2rem;
      padding: 2rem;
    }

    h2 { 
      font-size: 1.8rem; 
      font-weight: 700; 
      margin: 0 0 1.5rem; 
      color: var(--text);
    }

    .summary {
      background: color-mix(in srgb, var(--text) 5%, transparent);
      border-radius: 1.5rem;
      padding: 1.5rem;
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .summary-label { 
      color: var(--text-muted); 
      font-size: 0.9rem; 
    }
    
    .summary-value { 
      font-size: 1.5rem; 
      font-weight: 700; 
      color: var(--text);
    }

    .field { 
      margin-bottom: 1.5rem; 
    }
    
    label { 
      display: block; 
      margin-bottom: 0.5rem; 
      font-size: 0.8rem; 
      font-weight: 600; 
      color: var(--text-muted);
    }

    input { 
      width: 100%; 
      padding: 1rem 1.25rem; 
      border-radius: 1rem; 
      border: 1px solid var(--border); 
      background: var(--bg); 
      color: var(--text); /* FIXED: Explicitly set text color */
      font-size: 1rem;
      transition: 0.2s;
    }

    input:focus { 
      border-color: var(--primary); 
      outline: none; 
    }

    /* FIXED: Placeholder color for better visibility */
    input::placeholder {
      color: var(--text-muted);
      opacity: 0.7;
    }

    .error { 
      color: #ff3b30; 
      font-size: 0.8rem; 
      margin-top: 0.4rem; 
    }

    .btn { 
      width: 100%; 
      padding: 1rem; 
      border-radius: 1rem; 
      background: var(--primary); 
      color: white; 
      font-weight: 600; 
      border: none; 
      cursor: pointer;
      transition: 0.2s;
    }

    .btn:hover:not([disabled]) { 
      opacity: 0.9; 
      transform: translateY(-2px); 
    }

    .btn[disabled] { 
      opacity: 0.5; 
      cursor: not-allowed; 
    }
  `]

  render() {
    const total = this.global.cart.reduce((sum: number, p: { price: number }) => sum + p.price, 0);

    return html`
      <div class="card">
        <h2>Checkout</h2>
        
        <div class="summary">
          <div>
            <div class="summary-label">Items (${s(() => this.global.cart.length)})</div>
            <div class="summary-value">$${total.toFixed(2)}</div>
          </div>
          <span style="font-size: 2rem;">💳</span>
        </div>
        
        <div class="field">
          <label for="email">Email</label>
          <input type="email" id="email" placeholder="name@domain.com">
          <div id="emailError" class="error"></div>
        </div>

        ${s(() => html`
          <button 
            type="button"
            ${on('click', () => alert('Transaction Authorized.'))}
            ${!this.isValid ? 'disabled' : ''}
            class="btn"
          >
            Pay $${total.toFixed(2)}
          </button>
        `)}
      </div>
    `;
  }
}
customElements.define('app-checkout', Checkout);