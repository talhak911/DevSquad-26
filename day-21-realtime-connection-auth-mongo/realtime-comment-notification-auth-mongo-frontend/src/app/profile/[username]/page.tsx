import { Navbar } from '@/components/layout/Navbar';
import { ProfileView } from '@/components/profile/ProfileView';

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  // Using React 19 / Next.js 15+ promise based params unwrapping
  const resolvedParams = await params;
  
  return (
    <main className="min-h-screen bg-[var(--bg-page-mid)] text-[var(--text-primary)]">
      <Navbar />
      <div className="pt-20">
        <ProfileView username={resolvedParams.username} />
      </div>
    </main>
  );
}
