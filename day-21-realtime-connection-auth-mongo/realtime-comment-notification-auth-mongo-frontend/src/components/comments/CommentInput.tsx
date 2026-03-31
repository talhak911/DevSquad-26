'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import api from '@/lib/api';
import { SendHorizontal } from 'lucide-react';

interface CommentInputProps {
  parentId?: string;
  onSuccess?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function CommentInput({ parentId, onSuccess, placeholder = "What's on your mind?", autoFocus }: CommentInputProps) {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const res = await api.post('/comments', {
        content,
        parentId,
      });
      setContent('');
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Failed to post comment', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 relative">
      <textarea
        className="w-full bg-[var(--bg-input)] min-h-[100px] border border-[var(--border-input)] rounded-2xl p-4 text-[var(--text-primary)] placeholder-[var(--text-input-placeholder)] focus:outline-none focus:border-[var(--border-input-focus)] focus:ring-4 focus:ring-[var(--border-ring)] transition-all resize-none shadow-sm pb-12"
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={500}
        autoFocus={autoFocus}
      />
      <div className="absolute bottom-3 right-3 left-4 flex items-center justify-between text-xs text-[var(--text-hint)]">
        <span>{content.length} / 500</span>
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="p-2.5 bg-[var(--bg-button)] hover:bg-[var(--bg-button-hover)] text-[var(--text-button)] rounded-xl shadow-[var(--shadow-button)] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
          title="Send"
        >
          {isSubmitting ? (
             <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
             <SendHorizontal size={18} />
          )}
        </button>
      </div>
    </form>
  );
}
