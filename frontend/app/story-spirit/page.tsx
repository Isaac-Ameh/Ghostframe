'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Home, Sparkles, Loader2, Download } from 'lucide-react';
import Link from 'next/link';

interface StoryResult {
  title: string;
  story: string;
  characters: Array<{
    name: string;
    role: string;
    description: string;
  }>;
  themes: string[];
  metadata: {
    wordCount: number;
    readingTime: number;
    genre: string;
    audience: string;
  };
}

export default function StorySpiritPage() {
  const [content, setContent] = useState('');
  const [genre, setGenre] = useState('educational');
  const [audience, setAudience] = useState('teens');
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState<StoryResult | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!content.trim()) {
      setError('Please enter some content to transform into a story');
      return;
    }

    setLoading(true);
    setError('');
    setStory(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}/api/ai/generate-story`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          genre,
          audience,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStory(data.data);
      } else {
        setError(data.error || 'Failed to generate story');
      }
    } catch (err) {
      setError('Failed to connect to the Story Spirit. Make sure the backend is running!');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sampleContent = `Photosynthesis is the process by which plants convert sunlight into energy. Plants use chlorophyll in their leaves to capture light energy. This energy is then used to convert carbon dioxide and water into glucose and oxygen. The glucose provides energy for the plant, while oxygen is released into the atmosphere.`;

  const downloadStory = (format: 'txt' | 'md' | 'html') => {
    if (!story) return;

    let content = '';
    let filename = '';
    let mimeType = '';

    const sanitizedTitle = story.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    if (format === 'txt') {
      // Plain text format
      content = `${story.title}\n${'='.repeat(story.title.length)}\n\n`;
      content += `Genre: ${story.metadata.genre}\n`;
      content += `Audience: ${story.metadata.audience}\n`;
      content += `Reading Time: ${story.metadata.readingTime} minutes\n`;
      content += `Word Count: ${story.metadata.wordCount}\n\n`;
      content += `${story.story}\n\n`;
      
      if (story.characters && story.characters.length > 0) {
        content += `\nCHARACTERS\n${'='.repeat(10)}\n\n`;
        story.characters.forEach(char => {
          content += `${char.name} (${char.role})\n${char.description}\n\n`;
        });
      }
      
      if (story.themes && story.themes.length > 0) {
        content += `\nTHEMES\n${'='.repeat(6)}\n`;
        content += story.themes.join(', ') + '\n';
      }
      
      filename = `${sanitizedTitle}.txt`;
      mimeType = 'text/plain';
    } else if (format === 'md') {
      // Markdown format
      content = `# ${story.title}\n\n`;
      content += `**Genre:** ${story.metadata.genre} | `;
      content += `**Audience:** ${story.metadata.audience} | `;
      content += `**Reading Time:** ${story.metadata.readingTime} min | `;
      content += `**Words:** ${story.metadata.wordCount}\n\n`;
      content += `---\n\n`;
      content += `${story.story}\n\n`;
      
      if (story.characters && story.characters.length > 0) {
        content += `## Characters\n\n`;
        story.characters.forEach(char => {
          content += `### ${char.name}\n`;
          content += `**Role:** ${char.role}\n\n`;
          content += `${char.description}\n\n`;
        });
      }
      
      if (story.themes && story.themes.length > 0) {
        content += `## Themes\n\n`;
        story.themes.forEach(theme => {
          content += `- ${theme}\n`;
        });
      }
      
      filename = `${sanitizedTitle}.md`;
      mimeType = 'text/markdown';
    } else if (format === 'html') {
      // HTML format
      content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${story.title}</title>
    <style>
        body {
            font-family: Georgia, serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            line-height: 1.8;
            color: #333;
            background: #f9f9f9;
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #e67e22;
            padding-bottom: 10px;
        }
        .metadata {
            background: #ecf0f1;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            font-size: 0.9em;
        }
        .metadata span {
            margin-right: 20px;
            color: #7f8c8d;
        }
        .story-content {
            text-align: justify;
            white-space: pre-wrap;
            margin: 30px 0;
        }
        .characters, .themes {
            margin-top: 40px;
        }
        h2 {
            color: #34495e;
            border-bottom: 2px solid #95a5a6;
            padding-bottom: 5px;
        }
        .character {
            background: white;
            padding: 15px;
            margin: 10px 0;
            border-left: 4px solid #e67e22;
            border-radius: 3px;
        }
        .character-name {
            font-weight: bold;
            color: #e67e22;
            font-size: 1.1em;
        }
        .character-role {
            color: #7f8c8d;
            font-style: italic;
            font-size: 0.9em;
        }
        .theme-tag {
            display: inline-block;
            background: #3498db;
            color: white;
            padding: 5px 15px;
            margin: 5px;
            border-radius: 20px;
            font-size: 0.9em;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            color: #95a5a6;
            font-size: 0.8em;
            border-top: 1px solid #ecf0f1;
            padding-top: 20px;
        }
    </style>
</head>
<body>
    <h1>${story.title}</h1>
    
    <div class="metadata">
        <span><strong>Genre:</strong> ${story.metadata.genre}</span>
        <span><strong>Audience:</strong> ${story.metadata.audience}</span>
        <span><strong>Reading Time:</strong> ${story.metadata.readingTime} minutes</span>
        <span><strong>Word Count:</strong> ${story.metadata.wordCount}</span>
    </div>
    
    <div class="story-content">
        ${story.story}
    </div>
    
    ${story.characters && story.characters.length > 0 ? `
    <div class="characters">
        <h2>Characters</h2>
        ${story.characters.map(char => `
        <div class="character">
            <div class="character-name">${char.name}</div>
            <div class="character-role">${char.role}</div>
            <p>${char.description}</p>
        </div>
        `).join('')}
    </div>
    ` : ''}
    
    ${story.themes && story.themes.length > 0 ? `
    <div class="themes">
        <h2>Themes</h2>
        <div>
            ${story.themes.map(theme => `<span class="theme-tag">${theme}</span>`).join('')}
        </div>
    </div>
    ` : ''}
    
    <div class="footer">
        Generated by Story Spirit | GhostFrame AI
    </div>
</body>
</html>`;
      
      filename = `${sanitizedTitle}.html`;
      mimeType = 'text/html';
    }

    // Create blob and download
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-20 px-4 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, -5, 5, 0], y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-8xl mb-6 floating-ghost"
          >
            📖
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold text-ghost-white mb-4 creepster-heading">
            Story Spirit
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transform educational content into engaging stories with AI
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="ghost-card p-6"
          >
            <h2 className="text-2xl font-bold text-ghost-white mb-4 flex items-center">
              <Sparkles className="h-6 w-6 text-pumpkin-orange mr-2" />
              Input Content
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Your Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste your educational content here..."
                  className="w-full h-48 bg-gray-800 border border-gray-700 rounded-lg p-4 text-gray-200 focus:border-pumpkin-orange focus:outline-none resize-none"
                />
                <button
                  onClick={() => setContent(sampleContent)}
                  className="mt-2 text-sm text-spectral-green hover:text-spectral-green/80"
                >
                  Use sample content
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Genre</label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-200 focus:border-pumpkin-orange focus:outline-none"
                  >
                    <option value="educational">Educational</option>
                    <option value="adventure">Adventure</option>
                    <option value="mystery">Mystery</option>
                    <option value="fantasy">Fantasy</option>
                    <option value="sci-fi">Sci-Fi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Audience</label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-200 focus:border-pumpkin-orange focus:outline-none"
                  >
                    <option value="children">Children</option>
                    <option value="teens">Teens</option>
                    <option value="adults">Adults</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !content.trim()}
                className="w-full ghost-button-primary flex items-center justify-center space-x-2 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Weaving Story...</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="h-5 w-5" />
                    <span>Generate Story</span>
                  </>
                )}
              </button>

              {error && (
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-300">
                  {error}
                </div>
              )}
            </div>
          </motion.div>

          {/* Output Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="ghost-card p-6"
          >
            <h2 className="text-2xl font-bold text-ghost-white mb-4 flex items-center">
              <BookOpen className="h-6 w-6 text-spectral-green mr-2" />
              Generated Story
            </h2>

            {!story && !loading && (
              <div className="text-center py-12 text-gray-400">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  📚
                </motion.div>
                <p>Your story will appear here...</p>
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <Loader2 className="h-12 w-12 text-pumpkin-orange mx-auto mb-4 animate-spin" />
                <p className="text-gray-300">The Story Spirit is weaving your tale...</p>
              </div>
            )}

            {story && (
              <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                <div>
                  <h3 className="text-2xl font-bold text-pumpkin-orange mb-2">{story.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs bg-specter-purple/20 text-specter-purple px-2 py-1 rounded">
                      {story.metadata.genre}
                    </span>
                    <span className="text-xs bg-spectral-green/20 text-spectral-green px-2 py-1 rounded">
                      {story.metadata.audience}
                    </span>
                    <span className="text-xs bg-pumpkin-orange/20 text-pumpkin-orange px-2 py-1 rounded">
                      {story.metadata.readingTime} min read
                    </span>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{story.story}</p>
                </div>

                {story.characters && story.characters.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-ghost-white mb-3">Characters</h4>
                    <div className="space-y-2">
                      {story.characters.map((char, idx) => (
                        <div key={idx} className="bg-gray-800/50 rounded-lg p-3">
                          <div className="font-semibold text-pumpkin-orange">{char.name}</div>
                          <div className="text-sm text-gray-400">{char.role}</div>
                          <div className="text-sm text-gray-300 mt-1">{char.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {story.themes && story.themes.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-ghost-white mb-3">Themes</h4>
                    <div className="flex flex-wrap gap-2">
                      {story.themes.map((theme, idx) => (
                        <span key={idx} className="bg-specter-purple/20 text-specter-purple px-3 py-1 rounded-full text-sm">
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Download Buttons */}
                <div className="pt-4 border-t border-gray-700">
                  <h4 className="text-lg font-semibold text-ghost-white mb-3">Download Story</h4>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => downloadStory('txt')}
                      className="ghost-button inline-flex items-center space-x-2 px-4 py-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download TXT</span>
                    </button>
                    <button
                      onClick={() => downloadStory('md')}
                      className="ghost-button inline-flex items-center space-x-2 px-4 py-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Markdown</span>
                    </button>
                    <button
                      onClick={() => downloadStory('html')}
                      className="ghost-button inline-flex items-center space-x-2 px-4 py-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download HTML</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
