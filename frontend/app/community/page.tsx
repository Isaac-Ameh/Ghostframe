'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Github, 
  MessageCircle, 
  Users, 
  Star, 
  GitFork,
  Heart,
  Zap,
  BookOpen,
  Code,
  Coffee
} from 'lucide-react';

export default function CommunityPage() {
  const contributors = [
    { name: 'GhostFrame Team', role: 'Core Maintainers', avatar: '👻' },
    { name: 'Kiro Community', role: 'Framework Contributors', avatar: '🤖' },
    { name: 'AI Developers', role: 'Module Creators', avatar: '🧠' },
    { name: 'Open Source Heroes', role: 'Bug Hunters & Testers', avatar: '🦸' }
  ];

  const communityStats = [
    { label: 'GitHub Stars', value: '1.2k+', icon: Star },
    { label: 'Contributors', value: '50+', icon: Users },
    { label: 'Modules Created', value: '100+', icon: Code },
    { label: 'Discord Members', value: '500+', icon: MessageCircle }
  ];

  const resources = [
    {
      title: 'GitHub Repository',
      description: 'Contribute code, report issues, and collaborate',
      icon: Github,
      link: 'https://github.com/Isaac-Ameh/Ghostframe',
      color: 'text-gray-400'
    },
    {
      title: 'Discord Community',
      description: 'Chat with developers and get real-time help',
      icon: MessageCircle,
      link: 'https://discord.gg/vXjncVTx',
      color: 'text-blue-400'
    },
    {
      title: 'Documentation',
      description: 'Learn how to build with GhostFrame',
      icon: BookOpen,
      link: '/docs',
      color: 'text-spectral-green'
    },
    {
      title: 'Module Registry',
      description: 'Discover and share AI modules',
      icon: Zap,
      link: '/framework',
      color: 'text-pumpkin-orange'
    }
  ];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <Link href="/" className="inline-flex items-center text-spectral-green hover:text-spectral-green/80 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-6xl font-bold text-ghost-white mb-6">
            👻 GhostFrame Community
            <span className="block text-2xl md:text-3xl text-spectral-green mt-2">
              Where developers resurrect dead tech together
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl">
            Join a growing community of developers building the future of AI applications. 
            Contribute code, share modules, get help, and help others bring their ideas to life.
          </p>
        </motion.div>

        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {communityStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-midnight-black/30 border border-spectral-green/20 rounded-xl p-6 text-center"
              >
                <Icon className="h-8 w-8 text-spectral-green mx-auto mb-3" />
                <div className="text-2xl font-bold text-ghost-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Community Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-ghost-white mb-8 text-center">
            🤝 Get Involved
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <motion.a
                  key={index}
                  href={resource.link}
                  target={resource.link.startsWith('http') ? '_blank' : '_self'}
                  rel={resource.link.startsWith('http') ? 'noopener noreferrer' : ''}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-midnight-black/30 border border-spectral-green/20 rounded-xl p-8 group cursor-pointer"
                >
                  <Icon className={`h-12 w-12 ${resource.color} mb-4 group-hover:scale-110 transition-transform`} />
                  <h3 className="text-xl font-bold text-ghost-white mb-3">{resource.title}</h3>
                  <p className="text-gray-300 mb-4">{resource.description}</p>
                  <div className="flex items-center text-spectral-green group-hover:text-spectral-green/80">
                    <span className="mr-2">Join now</span>
                    <ArrowLeft className="h-4 w-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.a>
              );
            })}
          </div>
        </motion.div>

        {/* Contributors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-ghost-white mb-8 text-center">
            🎃 Our Contributors
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contributors.map((contributor, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-midnight-black/30 border border-spectral-green/20 rounded-xl p-6 text-center"
              >
                <div className="text-4xl mb-4">{contributor.avatar}</div>
                <h3 className="font-bold text-ghost-white mb-2">{contributor.name}</h3>
                <p className="text-sm text-gray-400">{contributor.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How to Contribute */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-ghost-white mb-8 text-center">
            🚀 How to Contribute
          </h2>
          
          <div className="bg-midnight-black/30 border border-spectral-green/20 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Code className="h-12 w-12 text-spectral-green mx-auto mb-4" />
                <h3 className="text-xl font-bold text-ghost-white mb-3">Code Contributions</h3>
                <p className="text-gray-300 mb-4">
                  Fix bugs, add features, improve performance, or create new modules.
                </p>
                <Link href="https://github.com/Isaac-Ameh/Ghostframe/blob/main/CONTRIBUTING.md">
                  <span className="text-spectral-green hover:text-spectral-green/80">
                    Read Contributing Guide →
                  </span>
                </Link>
              </div>

              <div className="text-center">
                <BookOpen className="h-12 w-12 text-spectral-green mx-auto mb-4" />
                <h3 className="text-xl font-bold text-ghost-white mb-3">Documentation</h3>
                <p className="text-gray-300 mb-4">
                  Help improve docs, write tutorials, or create examples.
                </p>
                <Link href="/docs">
                  <span className="text-spectral-green hover:text-spectral-green/80">
                    View Documentation →
                  </span>
                </Link>
              </div>

              <div className="text-center">
                <Heart className="h-12 w-12 text-spectral-green mx-auto mb-4" />
                <h3 className="text-xl font-bold text-ghost-white mb-3">Community Support</h3>
                <p className="text-gray-300 mb-4">
                  Help others in Discord, report bugs, or share your modules.
                </p>
                <Link href="https://discord.gg/vXjncVTx">
                  <span className="text-spectral-green hover:text-spectral-green/80">
                    Join Discord →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-ghost-white mb-6">
            Ready to Join the Haunting? 👻
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Whether you're a seasoned developer or just getting started with AI, 
            there's a place for you in the GhostFrame community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="https://github.com/Isaac-Ameh/Ghostframe"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="ghost-button-primary inline-flex items-center space-x-2 px-8 py-4"
            >
              <Github className="h-5 w-5" />
              <span>Star on GitHub</span>
            </motion.a>

            <motion.a
              href="https://discord.gg/vXjncVTx"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="ghost-button inline-flex items-center space-x-2 px-8 py-4"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Join Discord</span>
            </motion.a>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="border-t border-spectral-green/20 pt-8 mt-16 text-center"
        >
          <p className="text-gray-400 mb-4">
            Built with 🎃 for the Kiroween Hackathon and the open source community
          </p>
          <div className="flex justify-center items-center space-x-4 text-sm">
            <Link href="/docs" className="text-spectral-green hover:text-spectral-green/80">
              Documentation
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/framework" className="text-spectral-green hover:text-spectral-green/80">
              Framework
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="https://github.com/Isaac-Ameh/Ghostframe/blob/main/LICENSE" className="text-spectral-green hover:text-spectral-green/80">
              MIT License
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}