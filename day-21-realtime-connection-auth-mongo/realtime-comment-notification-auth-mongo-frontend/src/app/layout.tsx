import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { SocketProvider } from '@/context/SocketContext';
import { Toaster } from 'react-hot-toast';

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Real-Time Comments · Socket.IO',
  description:
    'A minimal, real-time comment board powered by Socket.IO, NestJS, and Next.js.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" style={{ fontFamily: 'var(--font-dm-sans), sans-serif' }}>
        <AuthProvider>
          <SocketProvider>
            {children}
            <Toaster position="bottom-right" />
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
