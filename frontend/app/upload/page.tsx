'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Home, FileText, Zap, Brain } from 'lucide-react';
import Link from 'next/link';

export default function UploadPage() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back to Home Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/">
            <button className="ghost-button inline-flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </button>
          </Link>
        </motion.div>

        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-8xl mb-6"
          >
            📤
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold text-ghost-white mb-6 creepster-heading">
            Upload Portal Opens...
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Feed your content to the GhostFrame spirits! Upload documents, PDFs, or text files 
            and watch as our AI entities analyze, process, and prepare your materials for 
            resurrection into interactive learning experiences.
          </p>
        </motion.div>

        {/* Feature Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <div className="ghost-card p-6 text-center">
            <FileText className="h-12 w-12 text-pumpkin-orange mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-ghost-white mb-2">Smart Analysis</h3>
            <p className="text-gray-400 text-sm">AI extracts key concepts and topics from your content</p>
          </div>
          <div className="ghost-card p-6 text-center">
            <Zap className="h-12 w-12 text-spectral-green mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-ghost-white mb-2">Instant Processing</h3>
            <p className="text-gray-400 text-sm">Lightning-fast content parsing and preparation</p>
          </div>
          <div className="ghost-card p-6 text-center">
            <Brain className="h-12 w-12 text-specter-purple mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-ghost-white mb-2">AI Enhancement</h3>
            <p className="text-gray-400 text-sm">Content optimized for quiz and story generation</p>
          </div>
        </motion.div>

        {/* Upload Zone Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-ghost-gray/50 rounded-2xl p-12 border-2 border-dashed border-specter-purple/50 text-center mb-8"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-6"
          >
            ☁️
          </motion.div>
          <h3 className="text-2xl font-bold text-ghost-white mb-4">
            Drag & Drop Your Content Here
          </h3>
          <p className="text-gray-300 mb-6">
            Supported formats: PDF, DOCX, TXT, MD
          </p>
          <button className="ghost-button-primary inline-flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Choose Files</span>
          </button>
        </motion.div>

        {/* Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-center bg-ghost-gray/30 rounded-xl p-8 border border-specter-purple/30"
        >
          <h4 className="text-lg font-semibold text-ghost-white mb-2">
            Upload Portal Awakening...
          </h4>
          <p className="text-gray-300 mb-4">
            Soon you'll be able to upload and process your learning materials!
          </p>
          
          {/* Future Integration Comment */}
          <div className="bg-specter-purple/10 rounded-lg p-3 border border-specter-purple/30">
            <p className="text-gray-400 text-xs">
              🎃 Future: handle file uploads with content analysis
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}