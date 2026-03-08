import { propReflect, RedGin, html, on, getset, s, FormBuilder, css } from "scalpeljs";
import { store } from "../store";

const VALIDATORS = {
  required: {
    validator: (v: any) => !!v?.trim(),
    errorMessage: 'Identification required.',
  },
  email: {
    validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    errorMessage: 'Enter a valid digital address.',
  }
};

const checkoutStyles = css`
  :host { 
    display: flex; justify-content: center; padding: 4rem 1.5rem;
    background: var(--bg-app, #fafafa); min-height: 80vh;
    font-family: system-ui, sans-serif;
  }

  .card {
    width: 100%; max-width: 440px; padding: 2.5rem;
    background: var(--bg-card, #fff);
    border: 1px solid var(--border, rgba(0,0,0,0.05));
    border-radius: 40px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.05);
  }

  h2 { font-size: 2.5rem; font-weight: 850; letter-spacing: -2px; margin: 0 0 1.5rem; }

  .summary-inset {
    background: var(--bg-secondary, #f5f5f7);
    border-radius: 24px; padding: 1.5rem; margin-bottom: 2rem;
    display: flex; justify-content: space-between; align-items: center;
  }

  .total-label { color: var(--text-muted, #86868b); font-weight: 600; font-size: 0.9rem; }
  .total-value { font-size: 1.8rem; font-weight: 800; color: var(--text-main, #1d1d1f); }

  .field { margin-bottom: 1.5rem; }
  label { display: block; margin-bottom: 0.5rem; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); }

  input { 
    width: 100%; padding: 1.2rem; border-radius: 18px; border: 2px solid transparent; 
    background: var(--bg-secondary); font-size: 1rem; box-sizing: border-box; transition: 0.3s;
  }
  input:focus { background: #fff; border-color: #000; outline: none; box-shadow: 0 0 0 4px rgba(0,0,0,0.05); }

  .error { color: #ff3b30; font-size: 0.8rem; font-weight: 600; margin-top: 0.5rem; margin-left: 0.5rem; }

  /* Interactive Button Styles */
  .btn-pay { 
    width: 100%; padding: 1.4rem; border-radius: 20px; background: #000; color: #fff; 
    font-weight: 700; font-size: 1.1rem; border: none; cursor: pointer; 
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex; justify-content: center; align-items: center; gap: 12px;
  }
  
  .btn-pay:hover:not([disabled]) { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
  .btn-pay:active:not([disabled]) { transform: scale(0.98); }
  
  .btn-pay.processing { background: #444; cursor: wait; transform: scale(0.98); }
  .btn-pay[disabled]:not(.processing) { background: #e5e5e7; color: #a1a1a6; cursor: not-allowed; }

  /* CSS Spinner */
  .spinner {
    width: 18px; height: 18px; border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
  .processing-text { animation: pulse 1.5s ease-in-out infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
`;

export default class Checkout extends RedGin {
  global = getset(store.state);
  isValid = propReflect<boolean>(false);
  isProcessing = getset<boolean>(false); // NEW: Track payment state
  
  static observedAttributes = ['is-valid'];

  private _unsub?: () => void;
  private fb!: FormBuilder;
  private orderForm!: ReturnType<FormBuilder['group']>;

  styles = [checkoutStyles];

  onInit() {
    this.setupStore();
    this.setupForm();
  }

  private setupStore() {
    this._unsub = store.subscribe(state => (this.global = state));
    store.set('currentRoute', '/checkout');
  }

  private setupForm() {
    this.fb = new FormBuilder(this.shadowRoot!);
    this.orderForm = this.fb.group({
      email: this.fb.control('', [VALIDATORS.required, VALIDATORS.email])
    });

    this.orderForm.validateAll();
    this.isValid = this.orderForm.valid;

    this.orderForm.subscribe(() => {
      this.orderForm.validateAll();
      this.isValid = this.orderForm.valid;
    });
  }

  disconnectedCallback() {
    this._unsub?.();
    super.disconnectedCallback();
  }

  /**
   * MOCK PAYMENT LOGIC
   */
  async handlePayment() {
    this.isProcessing = true;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('Transaction Authorized Successfully.');
    
    this.isProcessing = false;
    // Optional: store.dispatch('clearCart');
  }

  get totalAmount() {
    const total = this.global.cart.reduce((sum: number, p: any) => sum + p.price, 0);
    return total.toFixed(2);
  }

  render() {
    return html`
      <div class="card">
        <h2>Checkout.</h2>
        
        <div class="summary-inset">
          <div>
            <div class="total-label">Items (${s(() => this.global.cart.length)})</div>
            <div class="total-value">$${this.totalAmount}</div>
          </div>
          <span style="font-size: 2rem;">💳</span>
        </div>
        
        <div class="field">
          <label for="email">Billing Email</label>
          <input type="email" id="email" placeholder="name@domain.com" autocomplete="off">
          <div id="emailError" class="error"></div>
        </div>

        ${s(() => html`
          <button 
            type="button"
            class="btn-pay ${this.isProcessing ? 'processing' : ''}"
            ${on('click', () => this.handlePayment())}
            ${!this.isValid || this.global.cart.length === 0 || this.isProcessing ? 'disabled' : ''}
          >
            ${this.isProcessing 
              ? html`<div class="spinner"></div> <span class="processing-text">Processing...</span>` 
              : `Authorize Payment $${this.totalAmount}`}
          </button>
        `)}
      </div>
    `;
  }
}

customElements.define('app-checkout', Checkout);
