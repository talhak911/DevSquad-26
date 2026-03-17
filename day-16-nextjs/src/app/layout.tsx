import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Job Listings with Filtering",
  description: "Challenge from Frontend Mentor implemented with Next.js and Zustand",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
