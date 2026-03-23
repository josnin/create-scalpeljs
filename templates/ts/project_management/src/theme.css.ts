import { css } from "scalpeljs";

export const theme = css`
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  :root {
    --primary: #6366f1;
    --primary-dark: #4f46e5;
    --gray-50: #f9fafb;
    --gray-100: #f3f4f6;
    --gray-200: #e5e7eb;
    --gray-600: #4b5563;
    --gray-900: #111827;
    --bg: #ffffff;
    --text: #111827;
    --border: #e5e7eb;
    --shadow: 0 1px 3px rgba(0,0,0,0.1);
    --radius: 0.75rem;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: var(--gray-50);
    color: var(--text);
  }

  .btn {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid var(--border);
    background: var(--bg);
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
  }
  .btn-primary { background: var(--primary); color: white; border: none; }
  .btn-primary:hover { background: var(--primary-dark); transform: translateY(-1px); }
  
  .badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }
  .badge-active { background: #d1fae5; color: #065f46; }
  .badge-done { background: #e0e7ff; color: #3730a3; }
  .badge-hold { background: #fed7aa; color: #92400e; }
  .badge-high { background: #fee2e2; color: #991b1b; }
  .badge-med { background: #fef3c7; color: #92400e; }
  .badge-low { background: #d1fae5; color: #065f46; }
  
  .card {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1rem;
    transition: all 0.2s;
  }
  .card:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
  
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate { animation: slideIn 0.2s ease-out; }
`;