// theme.ts - Authentic Alibaba-inspired theme
import { css } from "scalpeljs";

export const theme = css`
  /* Minimal reset */
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    /* Authentic Alibaba colors - light mode only */
    --alibaba-orange: #ff6a00;
    --alibaba-orange-light: #fff4e5;
    --alibaba-orange-dark: #e55c00;
    
    --gray-50: #f9fafb;
    --gray-100: #f3f4f6;
    --gray-200: #e5e7eb;
    --gray-300: #d1d5db;
    --gray-400: #9ca3af;
    --gray-500: #6b7280;
    --gray-600: #4b5563;
    --gray-700: #374151;
    --gray-800: #1f2937;
    --gray-900: #111827;
    
    /* Semantic tokens */
    --bg: #ffffff;
    --bg-secondary: var(--gray-50);
    --text: var(--gray-900);
    --text-muted: var(--gray-500);
    --border: var(--gray-200);
    --border-hover: var(--gray-300);
    
    /* Brand colors */
    --primary: var(--alibaba-orange);
    --primary-light: var(--alibaba-orange-light);
    --primary-dark: var(--alibaba-orange-dark);
    
    /* Layout */
    --shop-max-width: 900px;
    --shop-padding: 0 1.5rem;
    
    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.5;
    min-height: 100vh;
  }

  /* Marketing section - Alibaba's clean marketing style */
  .marketing {
    width: 100%;
    padding: 4rem 2rem 3rem;
    text-align: center;
    background: linear-gradient(
      to bottom,
      var(--primary-light),
      var(--bg) 80%
    );
    border-bottom: 1px solid var(--border);
  }

  .marketing h1 {
    font-size: 3.5rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 1rem;
    color: var(--text);
  }

  .marketing h1 span {
    color: var(--primary);
  }

  .marketing p {
    font-size: 1.25rem;
    color: var(--text-muted);
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .marketing .pill {
    display: inline-block;
    padding: 0.5rem 1.5rem;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 9999px;
    color: var(--text-muted);
    font-size: 0.9rem;
    margin-top: 2rem;
    box-shadow: var(--shadow-sm);
  }

  /* Shop container */
  .shop {
    max-width: var(--shop-max-width);
    margin: 2rem auto;
    padding: var(--shop-padding);
  }

  /* Alibaba-style buttons */
  button {
    cursor: pointer;
    border: 1px solid var(--border);
    background: var(--bg);
    color: var(--text);
    padding: 0.5rem 1.5rem;
    border-radius: 9999px;
    font-weight: 500;
    transition: all 0.2s;
  }

  button:hover {
    border-color: var(--primary);
    color: var(--primary);
  }

  button.primary {
    background: var(--primary);
    color: white;
    border: none;
  }

  button.primary:hover {
    background: var(--primary-dark);
    color: white;
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  /* Alibaba-style cards */
  .card {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 1rem;
    padding: 1.5rem;
    transition: all 0.2s;
  }

  .card:hover {
    border-color: var(--primary);
    box-shadow: var(--shadow-lg);
  }
`;

export default theme;