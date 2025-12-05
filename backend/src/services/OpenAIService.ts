// 🎃 GhostFrame OpenAI Service
// Integration with OpenAI API for AI-powered content generation

import { config } from '../config/env';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class OpenAIService {
  private apiKey: string;
  private baseURL: string = 'https://api.openai.com/v1';
  private model: string = 'gpt-3.5-turbo';

  constructor() {
    this.apiKey = config.openai.apiKey || '';
    
    if (!this.apiKey) {
      console.warn('⚠️  OpenAI API key not configured. AI features will use mock responses.');
    }
  }

  /**
   * Check if OpenAI is enabled
   */
  isEnabled(): boolean {
    return config.openai.enabled && !!this.apiKey;
  }

  /**
   * Generate text using OpenAI (for AIRouter compatibility)
   */
  async generateText(prompt: string, options: {
    temperature?: number;
    maxTokens?: number;
  } = {}): Promise<string> {
    if (!this.isEnabled()) {
      throw new Error('OpenAI is not configured');
    }

    return await this.chat([
      { role: 'user', content: prompt }
    ]);
  }

  /**
   * Generate quiz questions from content
   */
  async generateQuiz(content: string, options: {
    questionCount?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    questionTypes?: string[];
  } = {}): Promise<any> {
    const {
      questionCount = 5,
      difficulty = 'medium',
      questionTypes = ['multiple-choice', 'true-false']
    } = options;

    if (!this.isEnabled()) {
      return this.getMockQuiz(questionCount);
    }

    const prompt = `Generate ${questionCount} ${difficulty} quiz questions from the following content. 
Include ${questionTypes.join(' and ')} questions.

Content:
${content}

Return a JSON array of questions with this format:
[
  {
    "type": "multiple-choice",
    "question": "Question text",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 0,
    "explanation": "Why this is correct"
  }
]`;

    try {
      const response = await this.chat([
        { role: 'system', content: 'You are a helpful quiz generator. Always respond with valid JSON.' },
        { role: 'user', content: prompt }
      ]);

      return JSON.parse(response);
    } catch (error) {
      console.error('OpenAI quiz generation error:', error);
      return this.getMockQuiz(questionCount);
    }
  }

  /**
   * Generate story from content
   */
  async generateStory(content: string, options: {
    genre?: string;
    length?: 'short' | 'medium' | 'long';
    audience?: string;
  } = {}): Promise<any> {
    const {
      genre = 'educational',
      length = 'medium',
      audience = 'general'
    } = options;

    if (!this.isEnabled()) {
      return this.getMockStory();
    }

    const wordCount = length === 'short' ? 300 : length === 'medium' ? 600 : 1000;

    const prompt = `Create a ${genre} story (approximately ${wordCount} words) for ${audience} audience based on this content:

${content}

Return a JSON object with this format:
{
  "title": "Story title",
  "story": "Full story text",
  "characters": ["Character 1", "Character 2"],
  "themes": ["Theme 1", "Theme 2"],
  "summary": "Brief summary"
}`;

    try {
      const response = await this.chat([
        { role: 'system', content: 'You are a creative storyteller. Always respond with valid JSON.' },
        { role: 'user', content: prompt }
      ]);

      return JSON.parse(response);
    } catch (error) {
      console.error('OpenAI story generation error:', error);
      return this.getMockStory();
    }
  }

  /**
   * Generate flashcards from content
   */
  async generateFlashcards(content: string, count: number = 10): Promise<any> {
    if (!this.isEnabled()) {
      return this.getMockFlashcards(count);
    }

    const prompt = `Generate ${count} flashcards from this content:

${content}

Return a JSON array with this format:
[
  {
    "front": "Question or term",
    "back": "Answer or definition",
    "category": "Category name",
    "difficulty": "easy|medium|hard"
  }
]`;

    try {
      const response = await this.chat([
        { role: 'system', content: 'You are a helpful flashcard generator. Always respond with valid JSON.' },
        { role: 'user', content: prompt }
      ]);

      return JSON.parse(response);
    } catch (error) {
      console.error('OpenAI flashcard generation error:', error);
      return this.getMockFlashcards(count);
    }
  }

  /**
   * Chat completion with OpenAI
   */
  private async chat(messages: ChatMessage[]): Promise<string> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data: OpenAIResponse = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * Mock quiz for when OpenAI is not available
   */
  private getMockQuiz(count: number): any {
    return Array.from({ length: count }, (_, i) => ({
      type: i % 2 === 0 ? 'multiple-choice' : 'true-false',
      question: `Sample question ${i + 1}?`,
      options: i % 2 === 0 ? ['Option A', 'Option B', 'Option C', 'Option D'] : ['True', 'False'],
      correctAnswer: 0,
      explanation: 'This is a mock question. Configure OpenAI API key for real questions.',
    }));
  }

  /**
   * Mock story for when OpenAI is not available
   */
  private getMockStory(): any {
    return {
      title: 'Sample Story',
      story: 'This is a mock story. Configure OpenAI API key to generate real stories from your content.',
      characters: ['Character 1', 'Character 2'],
      themes: ['Learning', 'Adventure'],
      summary: 'A sample story demonstrating the story generation feature.',
    };
  }

  /**
   * Mock flashcards for when OpenAI is not available
   */
  private getMockFlashcards(count: number): any {
    return Array.from({ length: count }, (_, i) => ({
      front: `Sample term ${i + 1}`,
      back: `Sample definition ${i + 1}. Configure OpenAI API key for real flashcards.`,
      category: 'General',
      difficulty: 'medium',
    }));
  }
}

export const openAIService = new OpenAIService();
