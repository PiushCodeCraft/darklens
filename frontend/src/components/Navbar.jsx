import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, UserCheck, Moon, Sun } from 'lucide-react';
import { getSessionId } from '../services/api';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
    const [sessionId, setSessionId] = useState('');
    const { isDark, toggleTheme } = useTheme();

    useEffect(() => {
        setSessionId(getSessionId().substring(0, 10));
    }, []);

    return (
        <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 transition-colors duration-200">
            <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <img
                        src="./src/assets/DarkLensAI-removebg-preview.png"
                        alt="DarkLens AI Logo"
                        className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
                    />
                    <h1 className="font-bold text-xl tracking-tight text-slate-900 dark:text-white transition-colors">
                        DarkLens<span className="text-indigo-600 dark:text-indigo-400">AI</span>
                    </h1>
                </Link>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 transition-colors">
                        <UserCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
                        <span>Auth Session: <strong className="font-mono text-slate-800 dark:text-slate-200">{sessionId}...</strong></span>
                    </div>

                    <button
                        onClick={toggleTheme}
                        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
                        title={isDark ? "Switch to light theme" : "Switch to dark theme"}
                        className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-amber-300 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 active:scale-95"
                    >
                        {isDark ? (
                            <Sun size={18} className="text-amber-400" />
                        ) : (
                            <Moon size={18} className="text-slate-700" />
                        )}
                    </button>

                    <Link
                        to="/submit"
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-medium text-sm transition-all shadow-sm hover:shadow active:scale-95"
                    >
                        <Sparkles size={16} /> Analyze
                    </Link>
                </div>
            </div>
        </header>
    );
}