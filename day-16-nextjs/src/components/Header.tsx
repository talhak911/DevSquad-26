'use client';

import { useJobStore } from '@/store/useJobStore';
import { useEffect, useState } from 'react';

export default function Header() {
  const { isDarkMode, toggleDarkMode } = useJobStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode, mounted]);

  if (!mounted) {
    return (
      <header className="header">
        <div className="container header-content">
          <div className="theme-toggle">🌙</div>
        </div>
      </header>
    );
  }

  return (
    <header className="header">
      <div className="container header-content">
        <button 
          onClick={toggleDarkMode} 
          className="theme-toggle"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? '🌞' : '🌙'}
        </button>
      </div>
    </header>
  );
}
