import { useEffect, useState } from 'react';
import { cn } from '../../utils';
import Icon from '../../components/ui/icon';

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onToggle?: (isDark: boolean) => void;
}

export default function ThemeToggle({
  size = 'md',
  className = '',
  onToggle,
}: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme-mode');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    // Apply theme
    const html = document.documentElement;
    if (newIsDark) {
      html.setAttribute('data-theme', 'dark');
      html.classList.add('dark');
    } else {
      html.removeAttribute('data-theme');
      html.classList.remove('dark');
    }

    // Save preference
    localStorage.setItem('theme-mode', newIsDark ? 'dark' : 'light');

    // Call callback if provided
    onToggle?.(newIsDark);
  };

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  // Avoid hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <button
        className={cn(
          'text-foreground hover:text-primary transition-colors duration-200',
          sizeClasses[size],
          className,
        )}
        aria-label="Toggle theme"
        disabled
      >
        <Icon name="sun" size={size} />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'text-foreground hover:text-primary transition-colors duration-200',
        sizeClasses[size],
        className,
      )}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <Icon name={isDark ? 'moon' : 'sun'} size={size} />
    </button>
  );
}
