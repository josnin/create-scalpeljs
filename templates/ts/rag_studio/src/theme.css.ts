import { css } from "scalpeljs";

export const theme = css`
  :root {
    --primary: #000000;
    --bg-app: #f4f4f7;
    --bg-card: #ffffff;
    --bg-sidebar: #f5f5f7;
    --border: rgba(0, 0, 0, 0.08);
    --text-main: #1d1d1f;
    --text-muted: #86868b;
    --error: #ff3b30;
    --radius-lg: 40px;
    --radius-md: 20px;
    --radius-sm: 12px;
  }

  :host { font-family: system-ui, -apple-system, sans-serif; color: var(--text-main); }

  /* --- Layouts --- */
  .studio-layout { display: grid; grid-template-columns: 1fr 320px; height: 100vh; overflow: hidden; }
  
  .card { 
    max-width: 480px; margin: 4rem auto; padding: 3rem; 
    background: var(--bg-card); border-radius: var(--radius-lg); 
    box-shadow: 0 20px 50px rgba(0,0,0,0.04); 
  }

  /* --- Elements --- */
  .field { margin-bottom: 1.8rem; }
  label { display: block; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.6rem; }

  .input-standard { 
    width: 100%; padding: 1.2rem; border-radius: var(--radius-md); border: 2px solid transparent; 
    background: var(--bg-app); font-size: 1rem; transition: 0.3s; box-sizing: border-box;
  }
  .input-standard:focus { background: #fff; border-color: var(--primary); outline: none; }

  .error-text { color: var(--error); font-size: 0.8rem; font-weight: 600; margin-top: 0.5rem; }

  .btn-primary { 
    width: 100%; padding: 1.4rem; border-radius: 20px; background: var(--primary); color: #fff; 
    font-weight: 700; font-size: 1.1rem; border: none; cursor: pointer; 
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex; justify-content: center; align-items: center; gap: 12px;
  }
  .btn-primary:disabled { background: #e5e5e7; color: #a1a1a6; cursor: not-allowed; }
  .btn-primary.processing { background: #444; cursor: wait; }

  .spinner {
    width: 18px; height: 18px; border: 2px solid rgba(0, 0, 0, 0.1);
    border-top-color: var(--primary); border-radius: 50%; 
    animation: spin 0.8s linear infinite;
  }
  .spinner-white { border-top-color: #fff; border-right-color: rgba(255,255,255,0.3); }
  @keyframes spin { to { transform: rotate(360deg); } }
`;
