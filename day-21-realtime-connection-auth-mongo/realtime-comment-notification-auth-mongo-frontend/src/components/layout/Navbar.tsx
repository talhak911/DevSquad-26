'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '../auth/AuthModal';
import { LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';

export function Navbar() {
  const { user, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/70 dark:bg-[#1a1410]/70 border-b border-[var(--border-default)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg text-[var(--text-primary)]">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#d4b89a] to-[#a08979] flex items-center justify-center text-white shadow-sm">
              C
            </span>
            Real-Time Comments
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-4">
                <Link href={`/profile/${user.username}`}>
                  <div className="flex items-center gap-2 hover:bg-[var(--border-subtle)] px-3 py-1.5 rounded-xl transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-[var(--bg-avatar)] border border-[var(--border-default)] flex items-center justify-center">
                      {user.profilePicture ? (
                        <img src={user.profilePicture} alt={user.username} className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon size={16} className="text-[var(--text-icon)]" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-[var(--text-primary)] hidden sm:block">
                      @{user.username}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)] rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuth('login')}
                  className="px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--border-subtle)] rounded-xl transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => openAuth('register')}
                  className="px-4 py-2 text-sm font-medium bg-[var(--bg-button)] hover:bg-[var(--bg-button-hover)] text-[var(--text-button)] rounded-xl shadow-[var(--shadow-button)] transition-all"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}
