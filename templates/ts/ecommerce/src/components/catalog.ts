import { RedGin, html, on, getset, s, css } from "scalpeljs";
import { store } from "../store";

/** 
 * 1. STATIC CONFIG & STYLES 
 * Extracted to keep the class logic lightweight.
 */
const PRODUCTS = [
  { id: 1, name: 'Precision Scalpel', price: 45, image: '🔪', category: 'surgical' },
  { id: 2, name: 'Micro-Fiber Cloth', price: 12, image: '🧼', category: 'accessories' },
  { id: 3, name: 'Surgical Tweezers', price: 18, image: '✂️', category: 'surgical' },
  { id: 4, name: 'Tech Repair Kit', price: 89, image: '🛠️', category: 'kits' },
];

const catalogStyles = css`
  :host { display: block; background: var(--bg); min-height: 100vh; font-family: system-ui; }
  
  .header { text-align: center; padding: 4rem 1rem 2rem; }
  .header h2 { font-size: 2.5rem; font-weight: 850; letter-spacing: -2px; margin: 0; }
  
  .cart-pill {
    background: color-mix(in srgb, var(--primary) 15%, transparent);
    padding: 0.4rem 1rem; border-radius: 100px;
    color: var(--primary); font-weight: 700; font-size: 0.9rem;
  }

  .grid { 
    display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
    gap: 2rem; padding: 2rem; max-width: 1200px; margin: 0 auto; 
  }

  .card { 
    background: var(--bg); border: 1px solid var(--border);
    border-radius: 2.5rem; padding: 1.5rem; transition: 0.4s cubic-bezier(0.2, 1, 0.2, 1);
  }

  .card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }

  .img-box { 
    width: 100%; aspect-ratio: 1; background: var(--bg-secondary, #f5f5f7);
    border-radius: 2rem; display: flex; align-items: center; justify-content: center; 
    font-size: 4rem; margin-bottom: 1.5rem;
  }

  .info { display: flex; justify-content: space-between; align-items: flex-end; }
  h4 { margin: 0; font-size: 1.2rem; font-weight: 700; letter-spacing: -0.5px; }
  .price { color: var(--primary); font-weight: 800; font-size: 1.1rem; margin-top: 4px; display: block; }

  .btn-add { 
    background: var(--primary, #000); color: white; border: none; 
    width: 50px; height: 50px; border-radius: 20px;
    font-size: 1.5rem; cursor: pointer; transition: 0.2s;
    display: flex; align-items: center; justify-content: center;
  }

  .btn-add:hover { transform: scale(1.1) rotate(90deg); }
  .btn-add:active { transform: scale(0.9); }
`;

export default class Catalog extends RedGin {
  // 2. REACTIVE STATE
  global = getset(store.state);
  private _unsub?: () => void;

  styles = [catalogStyles];

  // 3. LIFECYCLE
  onInit() {
    this.setupStore();
  }

  private setupStore() {
    this._unsub = store.subscribe(state => (this.global = state));
    store.set('currentRoute', '/'); 
  }

  disconnectedCallback() { 
    this._unsub?.(); 
    super.disconnectedCallback(); 
  }

  // 4. ACTIONS
  private addToCart(product: any) {
    store.set('cart', [...this.global.cart, product]);
    if (navigator.vibrate) navigator.vibrate(10); // Haptic feedback
  }

  // 5. SUB-TEMPLATES (For cleaner render logic)
  private renderProduct(p: any) {
    return html`
      <div class="card" data-category="${p.category}">
        <div class="img-box">
          <span role="img" aria-label="${p.name}">${p.image}</span>
        </div>
        <div class="info">
          <div class="text-content">
            <h4>${p.name}</h4>
            <span class="price">$${p.price}</span>
          </div>
          <button class="btn-add" ${on('click', () => this.addToCart(p))}>
            +
          </button>
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <header class="header">
        <h2>
          Curated Tools 
          <span class="cart-pill">${s(() => this.global.cart.length)} items</span>
        </h2>
        <p>Precision instruments for the modern craftsman</p>
      </header>

      <section class="grid">
        ${PRODUCTS.length 
          ? PRODUCTS.map(p => this.renderProduct(p)).join('') 
          : html`<div class="empty">📦 No products found.</div>`
        }
      </section>
    `;
  }
}

customElements.define('app-catalog', Catalog);
