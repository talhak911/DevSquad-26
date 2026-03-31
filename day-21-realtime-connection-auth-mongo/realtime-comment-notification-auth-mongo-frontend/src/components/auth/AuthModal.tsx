'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login({ email, password });
      } else {
        await register({ username, email, password });
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative bg-[var(--bg-card)] border border-[var(--border-default)] shadow-[var(--shadow-surface)] rounded-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--text-hint)] hover:text-[var(--text-primary)] transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 text-center tracking-tight">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-200 dark:border-red-800/30">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-[var(--text-label)] mb-1">Username</label>
              <input
                type="text"
                required
                className="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl px-4 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-input-focus)] focus:ring-2 focus:ring-[var(--border-ring)] transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="cool_user"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[var(--text-label)] mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl px-4 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-input-focus)] focus:ring-2 focus:ring-[var(--border-ring)] transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-label)] mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl px-4 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-input-focus)] focus:ring-2 focus:ring-[var(--border-ring)] transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[var(--bg-button)] hover:bg-[var(--bg-button-hover)] text-[var(--text-button)] rounded-xl font-medium shadow-[var(--shadow-button)] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : mode === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[var(--text-subtle)]">
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
            }}
            className="text-[var(--text-primary)] font-medium hover:underline"
          >
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
