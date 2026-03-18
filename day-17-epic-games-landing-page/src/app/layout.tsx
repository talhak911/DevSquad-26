import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Epic Games Store",
  description: "The official Epic Games Store landing page.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
