'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Clock, Users, Palette, ChevronLeft, ChevronRight, RotateCcw, Share, Download, Eye, EyeOff } from 'lucide-react';

export interface StoryMetadata {
  storyId: string;
  title: string;
  theme: string;
  targetAudience: string;
  length: string;
  wordCount: number;
  estimatedReadingTime: number;
  keyPoints: string[];
  learningObjectives: string[];
  createdAt: Date;
}

export interface StoryChapter {
  title: string;
  content: string;
  keyPoints: string[];
}

export interface Story {
  metadata: StoryMetadata;
  content: string;
  chapters?: StoryChapter[];
  summary: string;
  moralOrLesson?: string;
}

interface StoryViewerProps {
  story: Story;
  onRegenerate?: () => void;
  onShare?: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  story,
  onRegenerate,
  onShare
}) => {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showKeyPoints, setShowKeyPoints] = useState(false);
  const [fontSize, setFontSize] = useState('text-base');
  const [readingTime, setReadingTime] = useState(0);

  const hasChapters = story.chapters && story.chapters.length > 1;
  const totalChapters = story.chapters?.length || 1;
  const currentChapterData = story.chapters?.[currentChapter];

  // Reading timer
  useEffect(() => {
    const timer = setInterval(() => {
      setReadingTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getThemeEmoji = (theme: string): string => {
    const themeEmojis: Record<string, string> = {
      adventure: '🗺️',
      mystery: '🔍',
      fantasy: '🧙',
      'sci-fi': '🚀',
      historical: '🏛️',
      educational: '📚',
      horror: '👻',
      comedy: '😄'
    };
    return themeEmojis[theme] || '📖';
  };

  const getAudienceColor = (audience: string): string => {
    const colors: Record<string, string> = {
      children: 'text-spectral-green',
      teens: 'text-haunted-orange',
      adults: 'text-eerie-purple',
      academic: 'text-blue-400'
    };
    return colors[audience] || 'text-gray-400';
  };

  const handlePreviousChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextChapter = () => {
    if (currentChapter < totalChapters - 1) {
      setCurrentChapter(currentChapter + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDownload = () => {
    const content = `# ${story.metadata.title}\n\n${story.content}\n\n---\n\n**Summary:** ${story.summary}\n\n${story.moralOrLesson ? `**Lesson:** ${story.moralOrLesson}` : ''}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${story.metadata.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-phantom-gray z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-spectral-green to-eerie-purple"
          style={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Story Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="ghost-card mb-8"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-3xl">{getThemeEmoji(story.metadata.theme)}</span>
              <h1 className="text-2xl md:text-3xl font-bold text-ghost-white">
                {story.metadata.title}
              </h1>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Palette className="h-4 w-4" />
                <span className="capitalize">{story.metadata.theme}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span className={`capitalize ${getAudienceColor(story.metadata.targetAudience)}`}>
                  {story.metadata.targetAudience}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{story.metadata.estimatedReadingTime} min read</span>
              </div>
              <div className="flex items-center space-x-1">
                <BookOpen className="h-4 w-4" />
                <span>{story.metadata.wordCount} words</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowKeyPoints(!showKeyPoints)}
              className="ghost-button p-2"
              title={showKeyPoints ? 'Hide key points' : 'Show key points'}
            >
              {showKeyPoints ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="ghost-button text-sm"
            >
              <option value="text-sm">Small</option>
              <option value="text-base">Medium</option>
              <option value="text-lg">Large</option>
            </select>
            <button
              onClick={handleDownload}
              className="ghost-button p-2"
              title="Download story"
            >
              <Download className="h-4 w-4" />
            </button>
            {onShare && (
              <button
                onClick={onShare}
                className="ghost-button p-2"
                title="Share story"
              >
                <Share className="h-4 w-4" />
              </button>
            )}
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="ghost-button-primary p-2"
                title="Generate new story"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Chapter Navigation */}
        {hasChapters && (
          <div className="flex items-center justify-between pt-4 border-t border-phantom-gray">
            <button
              onClick={handlePreviousChapter}
              disabled={currentChapter === 0}
              className={`ghost-button flex items-center space-x-2 ${
                currentChapter === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <div className="text-center">
              <div className="text-sm text-gray-400">
                Chapter {currentChapter + 1} of {totalChapters}
              </div>
              {currentChapterData && (
                <div className="text-ghost-white font-medium">
                  {currentChapterData.title}
                </div>
              )}
            </div>

            <button
              onClick={handleNextChapter}
              disabled={currentChapter === totalChapters - 1}
              className={`ghost-button flex items-center space-x-2 ${
                currentChapter === totalChapters - 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </motion.div>

      {/* Key Points Sidebar */}
      <AnimatePresence>
        {showKeyPoints && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed right-4 top-1/2 transform -translate-y-1/2 w-64 ghost-card z-40 max-h-96 overflow-y-auto"
          >
            <h3 className="text-lg font-semibold text-ghost-white mb-3">Key Points</h3>
            <div className="space-y-2">
              {(currentChapterData?.keyPoints || story.metadata.keyPoints).map((point, index) => (
                <div
                  key={index}
                  className="text-sm text-gray-300 p-2 bg-phantom-gray/50 rounded"
                >
                  {point}
                </div>
              ))}
            </div>
            {story.metadata.learningObjectives.length > 0 && (
              <>
                <h4 className="text-md font-medium text-spectral-green mt-4 mb-2">Learning Objectives</h4>
                <div className="space-y-1">
                  {story.metadata.learningObjectives.map((objective, index) => (
                    <div
                      key={index}
                      className="text-xs text-gray-400 p-2 bg-spectral-green/10 rounded"
                    >
                      {objective}
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Story Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="ghost-card mb-8"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentChapter}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className={`prose prose-invert max-w-none ${fontSize}`}
          >
            {hasChapters && currentChapterData ? (
              <div>
                <h2 className="text-xl font-bold text-ghost-white mb-4 border-b border-phantom-gray pb-2">
                  {currentChapterData.title}
                </h2>
                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {currentChapterData.content}
                </div>
              </div>
            ) : (
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {story.content}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Story Summary and Lesson */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="ghost-card mb-8"
      >
        <h3 className="text-xl font-semibold text-ghost-white mb-4">Story Summary</h3>
        <p className="text-gray-300 mb-6 leading-relaxed">
          {story.summary}
        </p>

        {story.moralOrLesson && (
          <>
            <h4 className="text-lg font-medium text-spectral-green mb-3">Lesson Learned</h4>
            <p className="text-gray-300 leading-relaxed bg-spectral-green/10 p-4 rounded-lg border-l-4 border-spectral-green">
              {story.moralOrLesson}
            </p>
          </>
        )}
      </motion.div>

      {/* Reading Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="ghost-card text-center"
      >
        <h3 className="text-lg font-semibold text-ghost-white mb-4">Reading Session</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-2xl font-bold text-spectral-green">
              {formatTime(readingTime)}
            </div>
            <div className="text-sm text-gray-400">Time Reading</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-haunted-orange">
              {Math.round(readingProgress)}%
            </div>
            <div className="text-sm text-gray-400">Progress</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-eerie-purple">
              {hasChapters ? `${currentChapter + 1}/${totalChapters}` : '1/1'}
            </div>
            <div className="text-sm text-gray-400">Chapters</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">
              {story.metadata.keyPoints.length}
            </div>
            <div className="text-sm text-gray-400">Key Points</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};