import { attr, css, RedGin, s, getset, html } from "scalpeljs";
import { store } from "../store";

const componentStyles = css`
    :host { 
      display: block; 
      position: sticky; 
      top: 1rem;
      z-index: 100;
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    nav {
      background: color-mix(in srgb, var(--bg) 80%, transparent);
      backdrop-filter: blur(10px);
      border: 1px solid var(--border);
      border-radius: 9999px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 1rem;
      transition: 0.2s;
    }

    nav.scrolled {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .logo {
      font-weight: 700;
      color: var(--primary);
      text-decoration: none;
      letter-spacing: -0.5px;
    }

    .nav-links { 
      display: flex; 
      align-items: center; 
      gap: 0.25rem;
    }

    .nav-link { 
      text-decoration: none; 
      color: var(--text-muted);
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      transition: 0.2s;
      
      &:hover { 
        color: var(--text);
        background: color-mix(in srgb, var(--text) 5%, transparent);
      }
      
      &.active {
        color: var(--primary);
        font-weight: 500;
      }
    }

    .cart-action {
      background: var(--primary);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      margin-left: 0.5rem;
      transition: 0.2s;
      
      &:hover {
        opacity: 0.9;
        transform: scale(1.02);
      }
    }

    .cart-text {
      font-weight: 500;
      
      @media (max-width: 480px) {
        display: none;
      }
    }

    .cart-count {
      background: white;
      color: var(--primary);
      font-weight: 600;
      font-size: 0.75rem;
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
    }

    .cart-count-empty {
      background: rgba(255,255,255,0.2);
      color: white;
      font-size: 0.75rem;
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
    }

    @media (max-width: 640px) {
      .nav-link span {
        display: none;
      }
      
      .cart-action {
        padding: 0.5rem;
      }
    }

  `;

export default class Navbar extends RedGin {
  global = getset(store.state);
  private _unsub?: () => void;

  styles = [componentStyles]

  private handleScroll = () => {
    const nav = this.shadowRoot?.querySelector('nav');
    if (nav) {
      if (window.scrollY > 10) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
  };

  onInit() {
    this._unsub = store.subscribe(state => this.global = state);
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  disconnectedCallback() {
    this._unsub?.();
    window.removeEventListener('scroll', this.handleScroll);
    super.disconnectedCallback();
  }

  render() {
    return html`
      <nav>
        <a router-link href="/" class="logo" router-link>ScalpelJS Shop</a>
        
        <div class="nav-links">
          <a 
            router-link 
            href="/" 
            ${attr('class', () => `nav-link${this.global.currentRoute === '/' ? ' active' : ''}`)}
          >
            <span>Shop</span>
          </a>
          
          
          <a 
            router-link 
            href="/checkout" 
            ${attr('class', () => `nav-link${this.global.currentRoute === '/checkout' ? ' active' : ''}`)}
          >
            <span>Orders</span>
          </a>
          
          <a router-link href="/checkout" class="cart-action">
            <span>🛒</span>
            <span class="cart-text">Cart</span>
            ${s(() => {
              const count = this.global.cart.length;
              return count > 0 
                ? html`<span class="cart-count">${count}</span>`
                : html`<span class="cart-count-empty">0</span>`;
            })}
          </a>
        </div>
      </nav>
    `;
  }
}

customElements.define('nav-bar', Navbar);