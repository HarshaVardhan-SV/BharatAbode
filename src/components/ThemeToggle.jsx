import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="rounded-full border border-white/40 bg-white/20 px-3 py-1 text-sm dark:border-white/20 dark:bg-white/10"
    >
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  );
}
