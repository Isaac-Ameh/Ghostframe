'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Brain, BookOpen, ArrowRight, Package, FileCode, Download } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col overflow-hidden relative min-h-screen">
      
      {/* Subtle fog background */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-specter-purple/10 via-transparent to-pumpkin-orange/10 fog-effect" />
      </div>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          
          {/* Floating Ghost Icon */}
          <motion.div className="mb-8 floating-ghost">
            <span className="text-8xl">👻</span>
          </motion.div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-ghost-white mb-6 leading-tight">
            Welcome to{' '}
            <span className="creepster-heading text-pumpkin-orange text-glow">
              GhostFrame
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-2xl md:text-3xl text-spectral-green font-semibold mb-6 text-glow">
            👻 Where dead tech learns new tricks
          </p>

          {/* Description */}
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            An AI Starter Framework for developers. Download, configure your API key, and start building AI-powered applications in 5 minutes.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Link href="http://localhost:3002/download">
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="ghost-button-primary flex items-center space-x-3 text-lg px-8 py-4 min-w-[250px]"
              >
                <Download className="h-6 w-6" />
                <span>Download Framework</span>
              </motion.button>
            </Link>

            <Link href="/docs">
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="ghost-button flex items-center space-x-3 text-lg px-8 py-4 min-w-[250px]"
              >
                <FileCode className="h-6 w-6" />
                <span>Read Docs</span>
              </motion.button>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <a href="https://github.com/Isaac-Ameh/Ghostframe" target="_blank" rel="noopener noreferrer" className="hover:text-spectral-green transition-colors">
              🐙 GitHub
            </a>
            <span>•</span>
            <Link href="/community" className="hover:text-spectral-green transition-colors">
              👻 Community
            </Link>
            <span>•</span>
            <span className="text-pumpkin-orange">🎃 Built for Kiroween Hackathon 2024</span>
          </div>
        </motion.div>
      </section>

      {/* Demo Section */}
      <section className="relative z-10 py-20 px-4 border-t border-gray-800/50">
        <div className="max-w-5xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-ghost-white mb-4 creepster-heading">
              Try the Demos
            </h2>
            <p className="text-xl text-gray-300">
              See what you can build with GhostFrame
            </p>
          </motion.div>

          {/* Demo Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            
            {/* Story Spirit Demo */}
            <Link href="/story-spirit">
              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                className="ghost-card cursor-pointer group"
              >
                <div className="text-center">
                  <BookOpen className="h-16 w-16 text-spectral-green mx-auto mb-4 group-hover:text-pumpkin-orange transition-colors" />
                  <h3 className="text-2xl font-semibold text-ghost-white mb-3">Story Spirit</h3>
                  <p className="text-gray-400 mb-4">
                    Transform any content into engaging AI-generated stories
                  </p>
                  <div className="flex items-center justify-center text-pumpkin-orange group-hover:text-spectral-green transition-colors">
                    <span>Try Demo</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Quiz Ghost Demo */}
            <Link href="/quiz-ghost">
              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                className="ghost-card cursor-pointer group"
              >
                <div className="text-center">
                  <Brain className="h-16 w-16 text-pumpkin-orange mx-auto mb-4 group-hover:text-spectral-green transition-colors" />
                  <h3 className="text-2xl font-semibold text-ghost-white mb-3">Quiz Ghost</h3>
                  <p className="text-gray-400 mb-4">
                    Generate educational quizzes from any content with AI
                  </p>
                  <div className="flex items-center justify-center text-pumpkin-orange group-hover:text-spectral-green transition-colors">
                    <span>Try Demo</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>

          {/* What's Included */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-grave-black/50 rounded-2xl p-8 border border-pumpkin-orange/30"
          >
            <h3 className="text-2xl font-bold text-ghost-white mb-6 text-center creepster-heading">
              What's Included
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <Package className="h-10 w-10 text-spectral-green mx-auto mb-3" />
                <h4 className="font-semibold text-ghost-white mb-2">Backend + Frontend</h4>
                <p className="text-sm text-gray-400">Express API + Next.js starter</p>
              </div>
              <div>
                <Brain className="h-10 w-10 text-pumpkin-orange mx-auto mb-3" />
                <h4 className="font-semibold text-ghost-white mb-2">AI Integration</h4>
                <p className="text-sm text-gray-400">Multi-provider support built-in</p>
              </div>
              <div>
                <FileCode className="h-10 w-10 text-specter-purple mx-auto mb-3" />
                <h4 className="font-semibold text-ghost-white mb-2">Production Ready</h4>
                <p className="text-sm text-gray-400">Security, logging, error handling</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 mb-4">
            Built with 💀 for the Kiroween Hackathon 2024
          </p>
          <div className="flex justify-center items-center space-x-6 text-sm">
            <Link href="/docs" className="text-spectral-green hover:text-spectral-green/80 transition-colors">
              📚 Documentation
            </Link>
            <a href="https://github.com/Isaac-Ameh/Ghostframe" target="_blank" rel="noopener noreferrer" className="text-spectral-green hover:text-spectral-green/80 transition-colors">
              🐙 GitHub
            </a>
            <Link href="/community" className="text-spectral-green hover:text-spectral-green/80 transition-colors">
              👻 Community
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
