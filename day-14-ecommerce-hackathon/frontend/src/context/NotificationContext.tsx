import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';
import api from '../services/api';

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
  recipientId: string | null;
  actorId: {
    _id: string;
    name: string;
    avatar: string;
  };
}

interface NotificationContextData {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  hasMore: boolean;
  fetchNotifications: (reset?: boolean) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextData>({
  notifications: [],
  unreadCount: 0,
  loading: false,
  hasMore: true,
  fetchNotifications: async () => {},
  markAsRead: async () => {},
  markAllAsRead: async () => {},
});

const GUEST_READ_KEY = 'guest_read_notifications';

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dbUnreadCount, setDbUnreadCount] = useState(0);
  const [guestReadIds, setGuestReadIds] = useState<string[]>(() => {
    const stored = localStorage.getItem(GUEST_READ_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const { isAuthenticated } = useAuth();
  const { socket } = useSocket();

  const fetchNotifications = useCallback(async (reset = false) => {
    setLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      const response = await api.get(`/api/v1/notifications?page=${currentPage}&limit=10`, {
        baseURL: import.meta.env.VITE_REALTIME_URL || 'http://localhost:5006',
        headers: isAuthenticated ? {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
        } : {}
      });
      
      const newNotifications = response.data;
      
      if (reset) {
        setNotifications(newNotifications);
        setPage(2);
      } else {
        setNotifications(prev => [...prev, ...newNotifications]);
        setPage(prev => prev + 1);
      }
      
      setHasMore(newNotifications.length === 10);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [page, isAuthenticated]);

  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await api.get('/api/v1/notifications/unread-count', {
        baseURL: import.meta.env.VITE_REALTIME_URL || 'http://localhost:5006',
      });
      setDbUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchNotifications(true);
    fetchUnreadCount();
  }, [isAuthenticated, fetchNotifications, fetchUnreadCount]);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      if (isAuthenticated) {
        setDbUnreadCount((prev) => prev + 1);
      }
      toast.success(notification.title, { icon: '🔔' });
    };

    const handleReviewCreated = (data: any) => {
       toast((t) => (
         <div onClick={() => {
           window.location.href = data.link;
           toast.dismiss(t.id);
         }} style={{ cursor: 'pointer' }}>
           <b>{data.userName}</b> added a {data.rating}⭐ review for <b>{data.productName}</b>!
           <br />
           <small style={{ color: '#BC575F', fontWeight: 600 }}>Click to view</small>
         </div>
       ), { 
         icon: '🍵',
         duration: 6000,
       });
       
       // Handle updating the notification list in real-time
       if (data.notification) {
         setNotifications((prev) => [data.notification, ...prev]);
         if (isAuthenticated) {
           setDbUnreadCount((prev) => prev + 1);
         }
       }
    };

    socket.on('notification:new', handleNewNotification);
    socket.on('review:created', handleReviewCreated);

    return () => {
      socket.off('notification:new', handleNewNotification);
      socket.off('review:created', handleReviewCreated);
    };
  }, [socket, isAuthenticated]);

  const unreadCount = useMemo(() => {
    if (isAuthenticated) return dbUnreadCount;
    // For Guests: Count notifications that are not in local guestReadIds
    return notifications.filter(n => n.recipientId === null && !guestReadIds.includes(n._id)).length;
  }, [isAuthenticated, dbUnreadCount, notifications, guestReadIds]);

  const markAsRead = async (id: string) => {
    if (isAuthenticated) {
      try {
        await api.patch(`/api/v1/notifications/${id}/read`, {}, {
          baseURL: import.meta.env.VITE_REALTIME_URL || 'http://localhost:5006',
        });
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
        setDbUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    } else {
      // Guest local read
      const newReadIds = [...guestReadIds, id];
      setGuestReadIds(newReadIds);
      localStorage.setItem(GUEST_READ_KEY, JSON.stringify(newReadIds));
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    }
  };

  const markAllAsRead = async () => {
    if (isAuthenticated) {
      try {
        await api.post('/api/v1/notifications/read-all', {}, {
          baseURL: import.meta.env.VITE_REALTIME_URL || 'http://localhost:5006',
        });
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setDbUnreadCount(0);
      } catch (error) {
        console.error('Error marking all notifications as read:', error);
      }
    } else {
      const allIds = notifications.filter(n => n.recipientId === null).map(n => n._id);
      const newReadIds = Array.from(new Set([...guestReadIds, ...allIds]));
      setGuestReadIds(newReadIds);
      localStorage.setItem(GUEST_READ_KEY, JSON.stringify(newReadIds));
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    }
  };

  return (
    <NotificationContext.Provider
      value={{ 
        notifications: notifications.map(n => ({
          ...n,
          isRead: isAuthenticated ? n.isRead : guestReadIds.includes(n._id)
        })), 
        unreadCount, 
        loading, 
        hasMore, 
        fetchNotifications, 
        markAsRead, 
        markAllAsRead 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
