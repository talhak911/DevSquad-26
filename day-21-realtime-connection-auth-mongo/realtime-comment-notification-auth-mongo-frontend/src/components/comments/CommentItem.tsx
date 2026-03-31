'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import api from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircleReply, User as UserIcon } from 'lucide-react';
import { CommentInput } from './CommentInput';
import Link from 'next/link';

interface Author {
  _id: string;
  username: string;
  profilePicture: string;
}

interface CommentData {
  _id: string;
  content: string;
  author: Author;
  likesCount: number;
  likedBy: string[];
  createdAt: string;
  parentId: string | null;
  repliesCount: number;
}

interface CommentItemProps {
  comment: CommentData;
  onDelete?: (id: string) => void;
}

export function CommentItem({ comment, onDelete }: CommentItemProps) {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [likes, setLikes] = useState(comment.likesCount);
  const [isLiked, setIsLiked] = useState(user ? comment.likedBy.includes(user.id) : false);
  const [isReplying, setIsReplying] = useState(false);
  const [replies, setReplies] = useState<CommentData[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [repliesCount, setRepliesCount] = useState(comment.repliesCount || 0);

  const fetchReplies = async () => {
    setLoadingReplies(true);
    try {
      const res = await api.get(`/comments/${comment._id}/replies`);
      setReplies(res.data);
      setShowReplies(true);
    } catch (error) {
      console.error('Failed to fetch replies', error);
    } finally {
      setLoadingReplies(false);
    }
  };

  useEffect(() => {
    if (!socket) return;
    
    // Listen for new comments globally. If it belongs to this parent, add it.
    const handleNewComment = (newComment: CommentData) => {
      if (newComment.parentId === comment._id) {
        setReplies((prev) => [...prev, newComment]);
        setRepliesCount((prev) => prev + 1);
        if (!showReplies) setShowReplies(true);
      }
    };

    socket.on('new_comment', handleNewComment);
    return () => {
      socket.off('new_comment', handleNewComment);
    };
  }, [socket, comment._id, showReplies]);

  const toggleLike = async () => {
    if (!user) return; // Prevent liking if not logged in
    
    // Optimistic UI updates
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    
    try {
      await api.patch(`/comments/${comment._id}/like`);
    } catch (error) {
      // Revert on failure
      setIsLiked(isLiked);
      setLikes(comment.likesCount);
    }
  };

  return (
    <div className={`flex gap-4 p-4 mb-4 rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] shadow-sm transition-all hover:border-[var(--border-ring)] group`}>
      {/* Avatar */}
      <div className="shrink-0 flex flex-col items-center">
        <Link href={`/profile/${comment.author.username}`}>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--bg-avatar)] border border-[var(--border-default)] flex items-center justify-center shadow-inner hover:ring-2 hover:ring-[var(--border-ring)] transition-all cursor-pointer">
            {comment.author.profilePicture ? (
              <img src={comment.author.profilePicture} alt={comment.author.username} className="w-full h-full object-cover" />
            ) : (
              <UserIcon size={20} className="text-[var(--text-icon)]" />
            )}
          </div>
        </Link>
        {showReplies && replies.length > 0 && (
          <div className="flex-1 w-px bg-[var(--border-divider)] my-2 min-h-[40px]" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <Link href={`/profile/${comment.author.username}`}>
            <span className="font-semibold text-sm text-[var(--text-author)] tracking-tight hover:underline cursor-pointer">
              {comment.author.username}
            </span>
          </Link>
          <span className="text-xs text-[var(--text-hint)]" title={new Date(comment.createdAt).toLocaleString()}>
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        </div>
        
        <p className="text-sm text-[var(--text-body)] whitespace-pre-wrap leading-relaxed mb-3">
          {comment.content}
        </p>
        
        {/* Actions */}
        <div className="flex items-center gap-4 text-[var(--text-subtle)]">
          <button 
            onClick={toggleLike}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-red-500 ${isLiked ? 'text-red-500' : ''}`}
            disabled={!user}
            title={!user ? "Login to like" : "Like"}
          >
            <Heart size={16} className={`${isLiked ? 'fill-current' : 'fill-transparent'} transition-all`} />
            <span>{likes > 0 ? likes : 'Like'}</span>
          </button>
          
          <button 
            onClick={() => user ? setIsReplying(!isReplying) : null}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-[var(--text-primary)] ${!user && 'opacity-50 cursor-not-allowed'}`}
            title={!user ? "Login to reply" : "Reply"}
          >
            <MessageCircleReply size={16} />
            <span>Reply</span>
          </button>
          
          {/* View count if we knew it, or just a toggle if there are inferred replies */}
          {(!showReplies && repliesCount > 0) && (
             <button
                onClick={fetchReplies}
                className="text-xs font-medium text-[var(--text-faint)] hover:text-[var(--text-primary)] transition-colors ml-auto"
                disabled={loadingReplies}
             >
                {loadingReplies ? 'Loading...' : `View Replies (${repliesCount})`}
             </button>
          )}
        </div>

        {/* Reply Input */}
        {isReplying && (
          <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <CommentInput 
              parentId={comment._id} 
              placeholder={`Replying to @${comment.author.username}...`}
              onSuccess={() => setIsReplying(false)}
              autoFocus
            />
          </div>
        )}

        {/* Nested Replies Rendering */}
        {showReplies && replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {replies.map(reply => (
              <CommentItem key={reply._id} comment={reply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
