import { RedGin, html, on, getset, s, css } from "scalpeljs";
import { store } from "../store";

export default class Catalog extends RedGin {
  global = getset(store.state);
  private _unsub?: () => void;

  products = [
    { id: 1, name: 'Precision Scalpel', price: 45, image: '🔪', category: 'surgical' },
    { id: 2, name: 'Micro-Fiber Cloth', price: 12, image: '🧼', category: 'accessories' },
    { id: 3, name: 'Surgical Tweezers', price: 18, image: '✂️', category: 'surgical' },
    { id: 4, name: 'Tech Repair Kit', price: 89, image: '🛠️', category: 'kits' },
  ];

  onInit() {
    this._unsub = store.subscribe(state => this.global = state);
  }

  disconnectedCallback() { 
    this._unsub?.(); 
    super.disconnectedCallback(); 
  }

  styles = [css`
    :host { 
      display: block; 
      background: var(--bg);
      min-height: 100vh; 
    }
    
    .header {
      text-align: center;
      padding: 4rem 1rem 2rem;
    }
    
    .header h2 { 
      font-size: 2.5rem; 
      font-weight: 700; 
      margin: 0; 
      color: var(--text);
    }
    
    .header p { 
      color: var(--text-muted);
      margin-top: 0.5rem; 
    }
    
    .cart-count {
      background: color-mix(in srgb, var(--primary) 15%, transparent);
      padding: 0.2rem 0.8rem;
      border-radius: 9999px;
      color: var(--primary);
      font-weight: 600;
      margin-left: 0.5rem;
      font-size: 1rem;
    }

    .grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
      gap: 1.5rem; 
      padding: 1.5rem; 
      max-width: 1280px; 
      margin: 0 auto; 
    }

    .card { 
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 1.5rem;
      padding: 1.5rem;
      transition: 0.2s;
      position: relative;
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
      }
      
      &::before {
        content: attr(data-category);
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: color-mix(in srgb, var(--primary) 10%, transparent);
        color: var(--primary);
        padding: 0.2rem 0.8rem;
        border-radius: 9999px;
        font-size: 0.7rem;
        text-transform: uppercase;
        opacity: 0;
        transition: opacity 0.2s;
      }
      
      &:hover::before {
        opacity: 1;
      }
    }

    .img-box { 
      width: 100%; 
      aspect-ratio: 1; 
      background: var(--border);
      border-radius: 1rem;
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .info { 
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    h4 { 
      margin: 0; 
      font-size: 1.1rem; 
      font-weight: 600; 
      color: var(--text);
    }

    .price { 
      color: var(--primary);
      font-weight: 600;
      
      &::before {
        content: '$';
        opacity: 0.8;
        margin-right: 2px;
      }
    }

    .btn-add { 
      background: var(--primary);
      color: white;
      border: none; 
      width: 40px;
      height: 40px;
      border-radius: 9999px;
      font-size: 1.2rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: 0.2s;
      
      &:hover {
        opacity: 0.9;
        transform: scale(1.1);
      }
      
      &:active {
        transform: scale(0.9);
      }
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--text-muted);
      grid-column: 1 / -1;
      
      span {
        font-size: 3rem;
        display: block;
        margin-bottom: 1rem;
      }
    }

    @media (max-width: 768px) {
      .header {
        padding: 2rem 1rem;
      }
      
      .header h2 { 
        font-size: 2rem; 
      }
      
      .grid {
        gap: 1rem;
        padding: 1rem;
      }
      
      .card {
        padding: 1rem;
      }
    }
  `]

  render() {
    return html`
      <div class="header">
        <h2>Curated Tools <span class="cart-count">${s(() => this.global.cart.length)}</span></h2>
        <p>Precision instruments for the modern craftsman</p>
      </div>

      <div class="grid">
        ${this.products.length ? this.products.map(p => html`
          <div class="card" data-category="${p.category}">
            <div class="img-box">
              <span role="img" aria-label="${p.name}">${p.image}</span>
            </div>
            <div class="info">
              <div>
                <h4>${p.name}</h4>
                <span class="price">${p.price}</span>
              </div>
              <button class="btn-add" 
                      ${on('click', () => this.addToCart(p))}
                      aria-label="Add ${p.name} to cart">
                +
              </button>
            </div>
          </div>
        `).join('') : html`
          <div class="empty-state">
            <span>📦</span>
            <p>No products available</p>
          </div>
        `}
      </div>
    `;
  }

  addToCart(product: any) {
    store.set('cart', [...this.global.cart, product]);
    if (navigator.vibrate) navigator.vibrate(10);
  }
}

customElements.define('app-catalog', Catalog);