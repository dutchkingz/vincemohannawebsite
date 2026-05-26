// src/scripts/theme-client.ts
export type Theme = 'light' | 'dark';

export function getCurrentTheme(): Theme {
  return (localStorage.getItem('theme') as Theme) || 'light';
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

export function toggleTheme(): Theme {
  const current = getCurrentTheme();
  const next: Theme = current === 'light' ? 'dark' : 'light';
  applyTheme(next);
  return next;
}
