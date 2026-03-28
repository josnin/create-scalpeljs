import { css } from "scalpeljs";

export const theme = css`
  :host { 
    --primary: #0071e3;
    --accent: #5e5ce6;
    --bg-app: #09090b; 
    --bg-card: rgba(28, 28, 30, 0.7);
    --bg-sidebar: rgba(22, 22, 23, 0.8);
    --border: rgba(255, 255, 255, 0.08);
    --text-main: #f5f5f7;
    --text-muted: #86868b;
    --radius-lg: 32px;
    --radius-md: 18px;
    --glass-blur: blur(24px) saturate(180%);

    display: block;
    margin: 0;
    height: 100vh;
    width: 100vw;
    background-color: var(--bg-app);
    font-family: 'SF Pro Display', system-ui, sans-serif;
    color: var(--text-main);
    overflow: hidden;
  }

  * { box-sizing: border-box; }

  .studio-layout { 
    display: grid; grid-template-columns: 1fr 360px; 
    height: 100vh; padding: 1.5rem; gap: 1.5rem;
  }
  
  .chat-view {
    background: var(--bg-card); backdrop-filter: var(--glass-blur);
    border: 1px solid var(--border); border-radius: var(--radius-lg);
    display: flex; flex-direction: column; padding: 2rem; height: 100%; min-height: 0;
  }

  .messages-list { 
    flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 1.2rem; padding-right: 0.8rem;
  }

  /* Custom Obsidian Scrollbar */
  .messages-list::-webkit-scrollbar { width: 6px; }
  .messages-list::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }

  .msg { max-width: 80%; padding: 1.2rem 1.5rem; border-radius: 24px; font-size: 0.95rem; line-height: 1.6; }
  .user { align-self: flex-end; background: var(--primary); color: #fff; border-bottom-right-radius: 4px; }
  .ai { align-self: flex-start; background: rgba(255,255,255,0.06); border: 1px solid var(--border); border-bottom-left-radius: 4px; }

  /* Typing Cursor Effect */
  .msg.ai:last-child:not(:empty)::after {
    content: '▊'; margin-left: 4px; animation: blink 1s step-end infinite; opacity: 0.6;
  }

  @keyframes blink { from, to { color: transparent } 50% { color: var(--text-main) } }

  .input-container {
    margin-top: 1.5rem; background: rgba(255,255,255,0.04);
    border: 1px solid var(--border); border-radius: 22px; padding: 0.4rem;
  }

  .card { 
    width: 100%; max-width: 480px; margin: auto; padding: 3rem; 
    background: var(--bg-card); backdrop-filter: var(--glass-blur);
    border: 1px solid var(--border); border-radius: var(--radius-lg); 
    display: flex; flex-direction: column; gap: 1.8rem;
  }

  .input-standard { 
    width: 100%; padding: 1.1rem; border-radius: var(--radius-md); border: 1px solid var(--border); 
    background: rgba(255, 255, 255, 0.03); font-size: 1rem; color: #fff; transition: 0.3s;
  }

  .btn-primary { 
    width: 100%; padding: 1.2rem; border-radius: 20px; background: #fff; color: #000; 
    font-weight: 700; border: none; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 10px;
  }
  .btn-primary:disabled { opacity: 0.2; cursor: not-allowed; }

  .sources-panel {
    background: var(--bg-sidebar); backdrop-filter: var(--glass-blur);
    border-radius: var(--radius-lg); border: 1px solid var(--border); padding: 2rem; overflow-y: auto;
  }

  .source-card { background: rgba(255,255,255,0.03); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 0.8rem; border: 1px solid var(--border); font-size: 0.85rem; }

    /* Spinner Animation */
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-top-color: #000; /* Matches the black text on your white button */
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    display: inline-block;
  }

  /* Optional: Pulse effect when loading */
  .btn-primary.loading {
    background: rgba(255, 255, 255, 0.8);
    pointer-events: none;
  }

`;
