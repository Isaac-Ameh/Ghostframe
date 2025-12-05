'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SpookyLoaderProps {
  isLoading: boolean;
  message?: string;
}

export const SpookyLoader: React.FC<SpookyLoaderProps> = ({ 
  isLoading, 
  message = 'The spirits are working...' 
}) => {
  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-shadow-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="text-center">
        {/* Floating Ghosts Animation */}
        <div className="relative mb-8">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: 'easeInOut' 
            }}
            className="text-6xl"
          >
            👻
          </motion.div>
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, -3, 3, 0]
            }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity, 
              ease: 'easeInOut',
              delay: 0.5
            }}
            className="text-4xl absolute -top-2 -right-8"
          >
            🎃
          </motion.div>
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ 
              duration: 1.8, 
              repeat: Infinity, 
              ease: 'easeInOut',
              delay: 1
            }}
            className="text-3xl absolute -top-1 -left-6"
          >
            ✨
          </motion.div>
        </div>

        {/* Loading Text */}
        <motion.h2
          animate={{ 
            opacity: [0.7, 1, 0.7],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
          className="text-2xl font-bold text-ghost-white mb-4 text-glow"
        >
          {message}
        </motion.h2>

        {/* Animated Dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -10, 0],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{ 
                duration: 0.8, 
                repeat: Infinity, 
                delay: i * 0.2 
              }}
              className="w-3 h-3 bg-haunted-orange rounded-full"
            />
          ))}
        </div>

        {/* Spooky Progress Bar */}
        <div className="mt-8 w-64 mx-auto">
          <div className="bg-phantom-gray/50 rounded-full h-2 overflow-hidden">
            <motion.div
              animate={{ 
                x: ['-100%', '100%'],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: 'easeInOut' 
              }}
              className="h-full w-1/3 bg-gradient-to-r from-transparent via-eerie-purple to-transparent"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};