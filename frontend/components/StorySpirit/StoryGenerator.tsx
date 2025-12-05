'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Settings, Sparkles, Upload, FileText, CheckCircle, Users, Clock, Palette } from 'lucide-react';
import { SpookyLoader } from '@/components/Animations/SpookyLoader';

export interface StoryGenerationOptions {
  contentId: string;
  theme: 'adventure' | 'mystery' | 'fantasy' | 'sci-fi' | 'historical' | 'educational' | 'horror' | 'comedy';
  targetAudience: 'children' | 'teens' | 'adults' | 'academic';
  length: 'short' | 'medium' | 'long';
  customPrompt?: string;
  includeCharacters?: string[];
  setting?: string;
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

interface StoryGeneratorProps {
  availableContent: ProcessedContent[];
  onGenerateStory: (options: StoryGenerationOptions) => Promise<void>;
  isGenerating: boolean;
}

export const StoryGenerator: React.FC<StoryGeneratorProps> = ({
  availableContent,
  onGenerateStory,
  isGenerating
}) => {
  const [selectedContent, setSelectedContent] = useState<string>('');
  const [theme, setTheme] = useState<'adventure' | 'mystery' | 'fantasy' | 'sci-fi' | 'historical' | 'educational' | 'horror' | 'comedy'>('adventure');
  const [targetAudience, setTargetAudience] = useState<'children' | 'teens' | 'adults' | 'academic'>('teens');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [customPrompt, setCustomPrompt] = useState('');
  const [includeCharacters, setIncludeCharacters] = useState<string[]>([]);
  const [setting, setSetting] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [newCharacter, setNewCharacter] = useState('');

  const selectedContentData = availableContent.find(c => c.contentId === selectedContent);

  const themeOptions = [
    { value: 'adventure', label: 'Adventure', icon: '🗺️', description: 'Exciting journeys and discoveries' },
    { value: 'mystery', label: 'Mystery', icon: '🔍', description: 'Puzzles and secrets to uncover' },
    { value: 'fantasy', label: 'Fantasy', icon: '🧙', description: 'Magical worlds and creatures' },
    { value: 'sci-fi', label: 'Sci-Fi', icon: '🚀', description: 'Future technology and space' },
    { value: 'historical', label: 'Historical', icon: '🏛️', description: 'Past events and civilizations' },
    { value: 'educational', label: 'Educational', icon: '📚', description: 'Learning-focused narratives' },
    { value: 'horror', label: 'Horror', icon: '👻', description: 'Spooky and thrilling tales' },
    { value: 'comedy', label: 'Comedy', icon: '😄', description: 'Funny and lighthearted stories' }
  ] as const;

  const audienceOptions = [
    { value: 'children', label: 'Children', icon: '🧒', description: 'Ages 6-12, simple language' },
    { value: 'teens', label: 'Teens', icon: '👦', description: 'Ages 13-17, engaging plots' },
    { value: 'adults', label: 'Adults', icon: '👨', description: 'Mature themes and complexity' },
    { value: 'academic', label: 'Academic', icon: '🎓', description: 'Scholarly and detailed' }
  ] as const;

  const lengthOptions = [
    { value: 'short', label: 'Short', icon: '⚡', description: '~500 words, quick read', time: '2-3 min' },
    { value: 'medium', label: 'Medium', icon: '📖', description: '~1200 words, engaging', time: '5-6 min' },
    { value: 'long', label: 'Long', icon: '📚', description: '~2500 words, detailed', time: '10-12 min' }
  ] as const;

  const handleAddCharacter = () => {
    if (newCharacter.trim() && !includeCharacters.includes(newCharacter.trim())) {
      setIncludeCharacters([...includeCharacters, newCharacter.trim()]);
      setNewCharacter('');
    }
  };

  const handleRemoveCharacter = (character: string) => {
    setIncludeCharacters(includeCharacters.filter(c => c !== character));
  };

  const handleGenerate = async () => {
    if (!selectedContent) return;

    const options: StoryGenerationOptions = {
      contentId: selectedContent,
      theme,
      targetAudience,
      length,
      customPrompt: customPrompt.trim() || undefined,
      includeCharacters: includeCharacters.length > 0 ? includeCharacters : undefined,
      setting: setting.trim() || undefined
    };

    await onGenerateStory(options);
  };

  const canGenerate = selectedContent && !isGenerating;

  if (isGenerating) {
    return (
      <div className="text-center py-16">
        <SpookyLoader isLoading={true} message="The Story Spirit is weaving your tale..." />
        <div className="mt-8 space-y-2">
          <p className="text-gray-300">📖 Crafting your narrative...</p>
          <p className="text-gray-400 text-sm">The spirits are weaving educational concepts into an engaging story</p>
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
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="text-6xl mb-4"
        >
          📖
        </motion.div>
        <h2 className="text-3xl font-bold text-ghost-white mb-2">
          Generate Your Story
        </h2>
        <p className="text-gray-400">
          Transform your learning content into captivating narratives
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
            <p className="text-gray-400 mb-4">No content available for story generation</p>
            <p className="text-sm text-gray-500">
              Upload some learning materials first to create stories
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
                      <span className="text-xs px-2 py-1 bg-spectral-green/20 text-spectral-green rounded">
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

      {/* Story Configuration */}
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
              <h3 className="text-xl font-semibold text-ghost-white">Story Settings</h3>
            </div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-eerie-purple hover:text-eerie-purple/80 transition-colors"
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Options
            </button>
          </div>

          {/* Theme Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <Palette className="h-4 w-4 inline mr-2" />
              Story Theme
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`p-3 rounded-lg border transition-all text-left ${
                    theme === option.value
                      ? 'border-eerie-purple bg-eerie-purple/20 text-ghost-white'
                      : 'border-phantom-gray text-gray-300 hover:border-eerie-purple/50'
                  }`}
                >
                  <div className="text-2xl mb-1">{option.icon}</div>
                  <div className="text-sm font-medium">{option.label}</div>
                  <div className="text-xs text-gray-400 mt-1">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Audience Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <Users className="h-4 w-4 inline mr-2" />
              Target Audience
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {audienceOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTargetAudience(option.value)}
                  className={`p-3 rounded-lg border transition-all text-left ${
                    targetAudience === option.value
                      ? 'border-spectral-green bg-spectral-green/20 text-ghost-white'
                      : 'border-phantom-gray text-gray-300 hover:border-spectral-green/50'
                  }`}
                >
                  <div className="text-2xl mb-1">{option.icon}</div>
                  <div className="text-sm font-medium">{option.label}</div>
                  <div className="text-xs text-gray-400 mt-1">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Length Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <Clock className="h-4 w-4 inline mr-2" />
              Story Length
            </label>
            <div className="grid grid-cols-3 gap-3">
              {lengthOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setLength(option.value)}
                  className={`p-4 rounded-lg border transition-all text-center ${
                    length === option.value
                      ? 'border-haunted-orange bg-haunted-orange/20 text-ghost-white'
                      : 'border-phantom-gray text-gray-300 hover:border-haunted-orange/50'
                  }`}
                >
                  <div className="text-2xl mb-2">{option.icon}</div>
                  <div className="text-sm font-medium">{option.label}</div>
                  <div className="text-xs text-gray-400 mt-1">{option.description}</div>
                  <div className="text-xs text-eerie-purple mt-1">{option.time}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Options */}
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-6 border-t border-phantom-gray space-y-4"
            >
              {/* Custom Prompt */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Custom Story Prompt (Optional)
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Add specific instructions for your story..."
                  className="w-full p-3 bg-phantom-gray border border-phantom-gray rounded-lg text-ghost-white placeholder-gray-400 focus:border-eerie-purple focus:outline-none resize-none"
                  rows={3}
                />
              </div>

              {/* Setting */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Story Setting (Optional)
                </label>
                <input
                  type="text"
                  value={setting}
                  onChange={(e) => setSetting(e.target.value)}
                  placeholder="e.g., a magical library, ancient Rome, space station..."
                  className="w-full p-3 bg-phantom-gray border border-phantom-gray rounded-lg text-ghost-white placeholder-gray-400 focus:border-eerie-purple focus:outline-none"
                />
              </div>

              {/* Characters */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Character Names (Optional)
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newCharacter}
                    onChange={(e) => setNewCharacter(e.target.value)}
                    placeholder="Add character name..."
                    className="flex-1 p-3 bg-phantom-gray border border-phantom-gray rounded-lg text-ghost-white placeholder-gray-400 focus:border-eerie-purple focus:outline-none"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCharacter()}
                  />
                  <button
                    onClick={handleAddCharacter}
                    className="ghost-button px-4"
                  >
                    Add
                  </button>
                </div>
                {includeCharacters.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {includeCharacters.map((character) => (
                      <span
                        key={character}
                        className="px-3 py-1 bg-eerie-purple/20 text-eerie-purple rounded-full text-sm flex items-center space-x-2"
                      >
                        <span>{character}</span>
                        <button
                          onClick={() => handleRemoveCharacter(character)}
                          className="text-eerie-purple/60 hover:text-eerie-purple"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
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
            <Sparkles className="h-5 w-5" />
            <span>Generate Story</span>
            <BookOpen className="h-5 w-5" />
          </button>
        </motion.div>
      )}
    </div>
  );
};