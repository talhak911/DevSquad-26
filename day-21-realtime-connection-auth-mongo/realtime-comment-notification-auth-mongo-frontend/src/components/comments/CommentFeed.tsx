'use client';

import React, { useState, useEffect } from 'react';
import { useSocket } from '@/context/SocketContext';
import api from '@/lib/api';
import { CommentItem } from './CommentItem';
import { CommentInput } from './CommentInput';

interface CommentData {
  _id: string;
  content: string;
  author: any;
  likesCount: number;
  likedBy: string[];
  createdAt: string;
  parentId: string | null;
  repliesCount: number;
}

export function CommentFeed() {
  const { socket } = useSocket();
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopLevelComments = async () => {
      try {
        const res = await api.get('/comments');
        // Filter out replies, we only want top-level here
        const topLevel = res.data.filter((c: CommentData) => !c.parentId);
        setComments(topLevel);
      } catch (err) {
        console.error('Failed to load comments', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopLevelComments();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewComment = (newComment: CommentData) => {
      // Only prepend if it's a top-level comment
      if (!newComment.parentId) {
        setComments((prev) => [newComment, ...prev]);
      }
    };

    socket.on('new_comment', handleNewComment);
    return () => {
      socket.off('new_comment', handleNewComment);
    };
  }, [socket]);

  return (
    <div className="max-w-3xl mx-auto py-8 mb-16">
      <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 tracking-tight">Join the Discussion</h2>
        <CommentInput autoFocus />
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex gap-4 p-4 border border-[var(--border-default)] rounded-xl">
                <div className="w-10 h-10 rounded-full bg-[var(--border-subtle)]" />
                <div className="flex-1 space-y-3">
                  <div className="w-1/4 h-4 bg-[var(--border-subtle)] rounded-md" />
                  <div className="w-full h-4 bg-[var(--border-subtle)] rounded-md" />
                  <div className="w-5/6 h-4 bg-[var(--border-subtle)] rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length > 0 ? (
          <div className="animate-in fade-in duration-500">
            {comments.map((comment) => (
              <CommentItem key={comment._id} comment={comment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-[var(--text-muted)] animate-in fade-in duration-500 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-default)] border-dashed">
            <p className="text-lg font-medium mb-1">No comments yet</p>
            <p className="text-sm">Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
}
