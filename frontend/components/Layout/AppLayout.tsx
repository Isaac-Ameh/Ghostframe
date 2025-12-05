'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '../Navbar';

interface AppLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  showNavigation 
}) => {
  const pathname = usePathname();
  
  // Show main navigation on all routes including dashboard
  const shouldShowNavigation = showNavigation !== false;
  // Use different background for dashboard
  const isDashboard = pathname.startsWith('/dashboard');
  
  return (
    <div className={`${isDashboard ? 'h-screen overflow-hidden bg-grave-black' : 'min-h-screen bg-gradient-to-br from-grave-black via-ghost-gray to-specter-purple'}`}>
      {/* 🎃 Enhanced spooky background effects with Phase 2.1 colors - only for non-dashboard */}
      {!isDashboard && (
        <>
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-32 h-32 bg-specter-purple/10 rounded-full blur-xl animate-float"></div>
            <div className="absolute top-1/3 right-20 w-24 h-24 bg-pumpkin-orange/10 rounded-full blur-lg animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-spectral-green/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-blood-red/5 rounded-full blur-md animate-float" style={{ animationDelay: '3s' }}></div>
          </div>

          {/* Ghostly overlay for enhanced atmosphere */}
          <div className="fixed inset-0 bg-gradient-to-t from-grave-black/20 via-transparent to-specter-purple/10 pointer-events-none"></div>
        </>
      )}

      {/* Navigation */}
      {shouldShowNavigation && <Navbar />}

      {/* Main content area with enhanced transitions */}
      <main className={isDashboard ? 'h-full' : 'relative z-10'}>
        {isDashboard ? (
          // Dashboard gets direct rendering without extra animations or positioning
          <div className="h-full">
            {children}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="min-h-screen"
          >
            {children}
          </motion.div>
        )}
      </main>

      {/* Footer with Kiro branding - only for non-dashboard */}
      {!isDashboard && (
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="relative z-10 bg-grave-black/50 backdrop-blur-sm border-t border-specter-purple/30 py-6 mt-auto"
        >
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-ghost-gray text-sm">
              👻 Built with <span className="text-pumpkin-orange">Kiro</span> for the Kiroween Hackathon
            </p>
          </div>
        </motion.footer>
      )}

      {/* 👻 KIRO INTEGRATION POINTS: Enhanced monitoring and automation hooks */}
      <div id="kiro-interaction-monitor" className="hidden" data-kiro-hook="user-interactions"></div>
      <div id="kiro-performance-monitor" className="hidden" data-kiro-hook="performance-tracking"></div>
      <div id="kiro-navigation-monitor" className="hidden" data-kiro-hook="navigation-analytics"></div>
      
      {/* 🎃 KIRO SPECS INTEGRATION: Future specs will enhance layout behavior */}
      <div className="hidden" data-kiro-spec="layout-responsiveness"></div>
      <div className="hidden" data-kiro-spec="animation-performance"></div>
    </div>
  );
};