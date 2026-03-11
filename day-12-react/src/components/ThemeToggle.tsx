import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

const ThemeToggle = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.setAttribute('data-theme', 'light');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="btn-icon theme-btn focus:outline-none"
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? (
                <Sun className="h-6 w-6 text-yellow-500 transition-transform duration-300 hover:rotate-45" />
            ) : (
                <Moon className="h-6 w-6 text-gray-700 transition-transform duration-300 hover:-rotate-12" />
            )}
        </button>
    );
};

export default ThemeToggle;
