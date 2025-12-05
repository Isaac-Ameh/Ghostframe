'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Settings, Zap, Upload, FileText, CheckCircle } from 'lucide-react';
import { SpookyLoader } from '@/components/Animations/SpookyLoader';

export interface QuizGenerationOptions {
  contentId: string;
  questionCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  questionTypes: ('multiple-choice' | 'true-false' | 'short-answer')[];
  focusTopics?: string[];
}

interface ProcessedContent {
  contentId: string;
  originalFilename: string;
  summary: string;
  keyTopics: string[];
  wordCount: number;
  metadata: {
    title: string;
    subject: string;
    difficulty: string;
    tags: string[];
  };
  readabilityScore: {
    difficulty: string;
    estimatedReadingTime: number;
  };
}

interface QuizGeneratorProps {
  availableContent: ProcessedContent[];
  onGenerateQuiz: (options: QuizGenerationOptions) => Promise<void>;
  isGenerating: boolean;
}

export const QuizGenerator: React.FC<QuizGeneratorProps> = ({
  availableContent,
  onGenerateQuiz,
  isGenerating
}) => {
  const [selectedContent, setSelectedContent] = useState<string>('');
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [questionTypes, setQuestionTypes] = useState<('multiple-choice' | 'true-false' | 'short-answer')[]>(['multiple-choice']);
  const [focusTopics, setFocusTopics] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const selectedContentData = availableContent.find(c => c.contentId === selectedContent);

  const handleQuestionTypeToggle = (type: 'multiple-choice' | 'true-false' | 'short-answer') => {
    setQuestionTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const handleTopicToggle = (topic: string) => {
    setFocusTopics(prev => {
      if (prev.includes(topic)) {
        return prev.filter(t => t !== topic);
      } else {
        return [...prev, topic];
      }
    });
  };

  const handleGenerate = async () => {
    if (!selectedContent || questionTypes.length === 0) return;

    const options: QuizGenerationOptions = {
      contentId: selectedContent,
      questionCount,
      difficulty,
      questionTypes,
      focusTopics: focusTopics.length > 0 ? focusTopics : undefined
    };

    await onGenerateQuiz(options);
  };

  const canGenerate = selectedContent && questionTypes.length > 0 && !isGenerating;

  if (isGenerating) {
    return (
      <div className="text-center py-16">
        <SpookyLoader isLoading={true} message="The Quiz Ghost is conjuring your questions..." />
        <div className="mt-8 space-y-2">
          <p className="text-gray-300">🧠 Analyzing your content...</p>
          <p className="text-gray-400 text-sm">This may take a moment while our AI spirits work their magic</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-6xl mb-4"
        >
          🧠
        </motion.div>
        <h2 className="text-3xl font-bold text-ghost-white mb-2">
          Generate Your Quiz
        </h2>
        <p className="text-gray-400">
          Transform your uploaded content into an engaging quiz experience
        </p>
      </motion.div>

      {/* Content Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="ghost-card"
      >
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="h-5 w-5 text-haunted-orange" />
          <h3 className="text-xl font-semibold text-ghost-white">Select Content</h3>
        </div>

        {availableContent.length === 0 ? (
          <div className="text-center py-8">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No content available for quiz generation</p>
            <p className="text-sm text-gray-500">
              Upload some learning materials first to create quizzes
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {availableContent.map((content) => (
              <motion.div
                key={content.contentId}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedContent === content.contentId
                    ? 'border-eerie-purple bg-eerie-purple/20'
                    : 'border-phantom-gray hover:border-eerie-purple/50'
                }`}
                onClick={() => setSelectedContent(content.contentId)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-ghost-white">
                        {content.metadata.title}
                      </h4>
                      <span className="text-xs px-2 py-1 bg-haunted-orange/20 text-haunted-orange rounded">
                        {content.metadata.subject}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                      {content.summary}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{content.wordCount} words</span>
                      <span>{content.readabilityScore.estimatedReadingTime} min read</span>
                      <span className="capitalize">{content.readabilityScore.difficulty}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    {selectedContent === content.contentId && (
                      <CheckCircle className="h-5 w-5 text-eerie-purple" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quiz Configuration */}
      {selectedContent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="ghost-card"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Settings className="h-5 w-5 text-spectral-green" />
              <h3 className="text-xl font-semibold text-ghost-white">Quiz Settings</h3>
            </div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-eerie-purple hover:text-eerie-purple/80 transition-colors"
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Options
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Question Count */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Number of Questions
              </label>
              <input
                type="range"
                min="3"
                max="20"
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                className="w-full h-2 bg-phantom-gray rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>3</span>
                <span className="text-eerie-purple font-medium">{questionCount}</span>
                <span>20</span>
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['easy', 'medium', 'hard'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`p-2 rounded-lg text-sm font-medium transition-all ${
                      difficulty === level
                        ? 'bg-eerie-purple text-white'
                        : 'bg-phantom-gray text-gray-300 hover:bg-phantom-gray/80'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question Types */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Question Types
            </label>
            <div className="grid md:grid-cols-3 gap-3">
              {[
                { type: 'multiple-choice' as const, label: 'Multiple Choice', icon: '🔘' },
                { type: 'true-false' as const, label: 'True/False', icon: '✅' },
                { type: 'short-answer' as const, label: 'Short Answer', icon: '✍️' }
              ].map(({ type, label, icon }) => (
                <button
                  key={type}
                  onClick={() => handleQuestionTypeToggle(type)}
                  className={`p-3 rounded-lg border transition-all ${
                    questionTypes.includes(type)
                      ? 'border-eerie-purple bg-eerie-purple/20 text-ghost-white'
                      : 'border-phantom-gray text-gray-300 hover:border-eerie-purple/50'
                  }`}
                >
                  <div className="text-2xl mb-1">{icon}</div>
                  <div className="text-sm font-medium">{label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Options */}
          {showAdvanced && selectedContentData && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-phantom-gray"
            >
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Focus Topics (Optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedContentData.keyTopics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => handleTopicToggle(topic)}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                      focusTopics.includes(topic)
                        ? 'bg-spectral-green/20 text-spectral-green border border-spectral-green'
                        : 'bg-phantom-gray text-gray-300 hover:bg-phantom-gray/80'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Select specific topics to focus the quiz questions on
              </p>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Generate Button */}
      {selectedContent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className={`ghost-button-primary inline-flex items-center space-x-3 px-8 py-4 text-lg ${
              !canGenerate ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Zap className="h-5 w-5" />
            <span>Generate Quiz</span>
            <Brain className="h-5 w-5" />
          </button>
          
          {questionTypes.length === 0 && (
            <p className="text-red-400 text-sm mt-2">
              Please select at least one question type
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
};