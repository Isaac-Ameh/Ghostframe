import type { Metadata } from 'next';
import { AppLayout } from '@/components/Layout/AppLayout';
import './globals.css';

export const metadata: Metadata = {
  title: 'GhostFrame — Kiro-Powered AI Framework & Demo App',
  description: 'A modular AI framework for creators and developers building intelligent, adaptive experiences. Powered by Kiro agents with domain-agnostic capabilities. Explore educational and storytelling demos.',
  keywords: ['AI', 'framework', 'modular', 'kiro', 'agents', 'developers', 'creators', 'education', 'storytelling', 'hackathon', 'domain-agnostic', 'adaptive'],
  authors: [{ name: 'GhostFrame Team' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Preload Creepster font for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Creepster&family=Nosifer&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased font-sans">
        {/* 🎃 KIRO INTEGRATION POINT: Global app wrapper with consistent layout */}
        <AppLayout>
          {children}
        </AppLayout>
        
        {/* 👻 KIRO INTEGRATION POINT: Future hooks will monitor user interactions here */}
        <div id="kiro-global-monitor" className="hidden" data-kiro-hook="global-analytics"></div>
      </body>
    </html>
  );
}