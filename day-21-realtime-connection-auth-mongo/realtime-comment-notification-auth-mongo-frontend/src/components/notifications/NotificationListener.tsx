'use client';

import React, { useEffect } from 'react';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { MessageCircleReply, Heart, Bell } from 'lucide-react';

export function NotificationListener() {
  const { socket } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (!socket || !user) return;

    const handleNotification = (data: any) => {
      // The notification data from the backend contains: type, sender (populated), commentId
      const { type, sender } = data;
      const senderName = sender?.username || 'Someone';
      const senderPic = sender?.profilePicture;

      let message = '';
      let Icon = Bell;
      let iconColor = 'text-[var(--text-hint)]';

      if (type === 'REPLY') {
        message = `${senderName} replied to your comment.`;
        Icon = MessageCircleReply;
        iconColor = 'text-blue-500';
      } else if (type === 'LIKE') {
        message = `${senderName} liked your comment.`;
        Icon = Heart;
        iconColor = 'text-red-500 text-fill-current';
      } else if (type === 'FOLLOW') {
        message = `${senderName} started following you.`;
        iconColor = 'text-green-500';
      } else {
        message = `New interaction from ${senderName}.`;
      }

      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-sm w-full bg-[var(--bg-toast)] shadow-[var(--shadow-toast)] rounded-2xl pointer-events-auto flex ring-1 ring-[var(--border-ring)] overflow-hidden backdrop-blur-md border border-[var(--border-toast)]`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="shrink-0 pt-0.5 relative">
                  <div className="h-10 w-10 rounded-full bg-[var(--bg-avatar)] border border-[var(--border-default)] overflow-hidden">
                    {senderPic ? (
                      <img src={senderPic} alt={senderName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-[var(--text-icon)] font-bold">
                        {senderName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 bg-white dark:bg-black rounded-full p-0.5 shadow-sm border border-[var(--border-default)]`}>
                    <Icon size={12} className={iconColor} />
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {senderName}
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-body)]">
                    {message}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-[var(--border-divider)]">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-2xl p-4 flex items-center justify-center text-sm font-medium text-[var(--text-subtle)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        )
      );
    };

    socket.on('notification', handleNotification);

    return () => {
      socket.off('notification', handleNotification);
    };
  }, [socket, user]);

  return null; // This component just listens and fires toasts
}
