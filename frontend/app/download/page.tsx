'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Github, Terminal, Package, Container, Globe, Zap, Code, Users } from 'lucide-react';
import Link from 'next/link';

interface DownloadOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  size: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  includes: string[];
  command?: string;
  downloadUrl?: string;
  comingSoon?: boolean;
}

export default function DownloadPage() {
  const [selectedTab, setSelectedTab] = useState('all');

  const downloadOptions: DownloadOption[] = [
    {
      id: 'framework',
      title: 'Complete Framework',
      description: 'Full source code with backend, frontend, CLI, SDK, and working demos',
      icon: <Package className="h-8 w-8" />,
      size: '~50MB',
      difficulty: 'Advanced',
      includes: ['Backend API', 'Frontend UI', 'CLI Tool', 'SDK', 'Demo Modules', 'Documentation'],
      downloadUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}/api/download/framework`
    },
    {
      id: 'github',
      title: 'From GitHub',
      description: 'Clone directly from GitHub repository for latest updates',
      icon: <Github className="h-8 w-8" />,
      size: '~50MB',
      difficulty: 'Advanced',
      includes: ['Latest Code', 'Git History', 'All Branches', 'Issues & PRs'],
      command: 'git clone https://github.com/Isaac-Ameh/Ghostframe.git'
    },
    {
      id: 'cli',
      title: 'CLI Tool',
      description: 'Command-line interface for quick project scaffolding and development',
      icon: <Terminal className="h-8 w-8" />,
      size: '~2MB',
      difficulty: 'Beginner',
      includes: ['Project Templates', 'Development Server', 'Testing Tools', 'Validation', 'Publishing'],
      comingSoon: true
    },
    {
      id: 'sdk',
      title: 'SDK Package',
      description: 'Lightweight library for integrating AI features into existing projects',
      icon: <Code className="h-8 w-8" />,
      size: '~500KB',
      difficulty: 'Intermediate',
      includes: ['AI Router', 'Content Processor', 'TypeScript Types', 'Utilities'],
      comingSoon: true
    },
    {
      id: 'docker',
      title: 'Docker Image',
      description: 'Containerized development environment with all dependencies included',
      icon: <Container className="h-8 w-8" />,
      size: '~200MB',
      difficulty: 'Intermediate',
      includes: ['Complete Environment', 'Pre-configured Services', 'Development Tools'],
      command: 'docker pull ghostframe/dev:latest',
      comingSoon: true
    },
    {
      id: 'playground',
      title: 'Online Playground',
      description: 'Try GhostFrame in your browser without any installation',
      icon: <Globe className="h-8 w-8" />,
      size: '0MB',
      difficulty: 'Beginner',
      includes: ['Web IDE', 'Live Preview', 'Templates', 'Sharing', 'No Setup Required'],
      downloadUrl: 'https://playground.ghostframe.dev',
      comingSoon: true
    },
    {
      id: 'desktop',
      title: 'Desktop App',
      description: 'Native desktop application with visual project creator and editor',
      icon: <Code className="h-8 w-8" />,
      size: '~100MB',
      difficulty: 'Beginner',
      includes: ['Visual Editor', 'Project Manager', 'Live Preview', 'One-click Deploy'],
      comingSoon: true
    }
  ];

  const filteredOptions = selectedTab === 'all' 
    ? downloadOptions 
    : downloadOptions.filter(option => option.difficulty.toLowerCase() === selectedTab);

  const handleDownload = async (option: DownloadOption) => {
    if (option.comingSoon) return;
    
    if (option.downloadUrl) {
      // For API downloads, trigger the download
      if (option.downloadUrl.includes('/api/download/')) {
        try {
          // Create a temporary link and click it to trigger download
          const link = document.createElement('a');
          link.href = option.downloadUrl;
          link.download = `ghostframe-${option.id}.zip`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {
          console.error('Download failed:', error);
          alert('Download failed. Please make sure the backend server is running.');
        }
      } else {
        // For external URLs, open in new tab
        window.open(option.downloadUrl, '_blank');
      }
    } else if (option.command) {
      navigator.clipboard.writeText(option.command);
      alert('Command copied to clipboard!');
    }
  };

  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
    // Show toast notification
  };

  return (
    <div className="py-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-8xl mb-6"
          >
            📦
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold text-ghost-white mb-4 creepster-heading">
            Download GhostFrame
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Choose your preferred way to get started with the AI framework that brings dead tech back to life
          </p>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-pumpkin-orange">50K+</div>
              <div className="text-sm text-gray-400">Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-spectral-green">4.9★</div>
              <div className="text-sm text-gray-400">Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-specter-purple">MIT</div>
              <div className="text-sm text-gray-400">License</div>
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-12">
          <div className="ghost-card p-2 inline-flex rounded-lg">
            {['all', 'beginner', 'intermediate', 'advanced'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-6 py-2 rounded-md transition-colors capitalize ${
                  selectedTab === tab
                    ? 'bg-pumpkin-orange text-grave-black font-semibold'
                    : 'text-gray-300 hover:text-ghost-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Download Options Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`ghost-card p-6 relative ${option.comingSoon ? 'opacity-75' : ''}`}
            >
              {option.comingSoon && (
                <div className="absolute top-4 right-4 bg-specter-purple text-white text-xs px-2 py-1 rounded">
                  Coming Soon
                </div>
              )}
              
              <div className="flex items-center mb-4">
                <div className="text-pumpkin-orange mr-3">
                  {option.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-ghost-white">{option.title}</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      option.difficulty === 'Beginner' ? 'bg-spectral-green/20 text-spectral-green' :
                      option.difficulty === 'Intermediate' ? 'bg-pumpkin-orange/20 text-pumpkin-orange' :
                      'bg-specter-purple/20 text-specter-purple'
                    }`}>
                      {option.difficulty}
                    </span>
                    <span className="text-gray-400">{option.size}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 mb-4">{option.description}</p>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-ghost-white mb-2">Includes:</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  {option.includes.map((item, idx) => (
                    <li key={idx} className="flex items-center">
                      <Zap className="h-3 w-3 text-spectral-green mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {option.command && (
                <div className="mb-4">
                  <div className="bg-gray-800 rounded-lg p-3 font-mono text-sm text-gray-300 relative">
                    <code>{option.command}</code>
                    <button
                      onClick={() => copyCommand(option.command!)}
                      className="absolute right-2 top-2 text-gray-400 hover:text-ghost-white"
                      title="Copy command"
                    >
                      📋
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={() => handleDownload(option)}
                disabled={option.comingSoon}
                className={`w-full flex items-center justify-center space-x-2 py-3 rounded-lg transition-colors ${
                  option.comingSoon
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'ghost-button-primary'
                }`}
              >
                <Download className="h-4 w-4" />
                <span>{option.comingSoon ? 'Coming Soon' : 'Get Started'}</span>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Quick Start Guide */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="ghost-card p-8 mb-16"
        >
          <h2 className="text-3xl font-bold text-ghost-white mb-6 text-center">
            Quick Start Guide
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-pumpkin-orange/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-pumpkin-orange">1</span>
              </div>
              <h3 className="text-lg font-semibold text-ghost-white mb-2">Choose Your Method</h3>
              <p className="text-gray-300">Select the download option that best fits your experience level and project needs.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-spectral-green/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-spectral-green">2</span>
              </div>
              <h3 className="text-lg font-semibold text-ghost-white mb-2">Set Up Environment</h3>
              <p className="text-gray-300">Follow the setup instructions and configure your AI API keys to get started.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-specter-purple/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-specter-purple">3</span>
              </div>
              <h3 className="text-lg font-semibold text-ghost-white mb-2">Build & Deploy</h3>
              <p className="text-gray-300">Create your AI-powered application and deploy it to production in minutes.</p>
            </div>
          </div>
        </motion.div>

        {/* Community & Support */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-ghost-white mb-6">
            Join the Community
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Get help, share your projects, and contribute to the future of AI development
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="https://github.com/Isaac-Ameh/Ghostframe" className="ghost-button inline-flex items-center space-x-2">
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </Link>
            <Link href="https://discord.gg/vXjncVTx" className="ghost-button inline-flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Discord</span>
            </Link>
            <Link href="/docs" className="ghost-button inline-flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Documentation</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}