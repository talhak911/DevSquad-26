import { Navbar } from '@/components/layout/Navbar';
import { CommentFeed } from '@/components/comments/CommentFeed';
import { NotificationListener } from '@/components/notifications/NotificationListener';

export default function Home() {
  return (
    <main className="min-h-screen text-[var(--text-primary)]">
      <Navbar />
      <NotificationListener />
      <CommentFeed />
    </main>
  );
}
