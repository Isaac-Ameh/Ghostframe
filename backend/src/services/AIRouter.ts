// 🎃 GhostFrame AI Router
// Routes AI requests to appropriate service (Groq, OpenAI, or Anthropic)

import { GroqService } from './GroqService';
import { openAIService } from './OpenAIService';
import { anthropicService } from './AnthropicService';
import { config } from '../config/env';

type AIProvider = 'groq' | 'openai' | 'anthropic' | 'auto';

// Initialize Groq service if API key is available
const groqService = config.groq.enabled ? new GroqService(config.groq.apiKey!) : null;

export class AIRouter {
  /**
   * Generic AI generation method - the main framework method
   */
  async generate(options: {
    prompt: string;
    provider?: AIProvider;
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<{ text: string; provider: string }> {
    const provider = options.provider || 'auto';
    const selectedProvider = this.selectProvider(provider);

    console.log(`🎃 AIRouter using provider: ${selectedProvider}`);

    // Use Groq (fastest and free)
    if (selectedProvider === 'groq' && groqService) {
      try {
        const response = await groqService.generateText({
          prompt: options.prompt,
          model: options.model || 'llama-3.3-70b-versatile',
          temperature: options.temperature || 0.7,
          maxTokens: options.maxTokens || 2000
        });
        
        if (response.success && response.data) {
          return {
            text: response.data,
            provider: 'groq'
          };
        }
      } catch (error) {
        console.error('Groq generation failed:', error);
        // Fall through to next provider
      }
    }

    // Fallback to OpenAI if available
    if (openAIService.isEnabled()) {
      try {
        const response = await openAIService.generateText(options.prompt, {
          temperature: options.temperature,
          maxTokens: options.maxTokens
        });
        return {
          text: response,
          provider: 'openai'
        };
      } catch (error) {
        console.error('OpenAI generation failed:', error);
      }
    }

    // Fallback to Anthropic if available
    if (anthropicService.isEnabled()) {
      try {
        const response = await anthropicService.generateContent(options.prompt);
        return {
          text: response,
          provider: 'anthropic'
        };
      } catch (error) {
        console.error('Anthropic generation failed:', error);
      }
    }

    // No AI available - throw error
    throw new Error('No AI provider available. Please configure GROQ_API_KEY in your .env file.');
  }

  /**
   * Generate quiz using best available AI service
   */
  async generateQuiz(
    content: string,
    options: any = {},
    provider: AIProvider = 'auto'
  ): Promise<any> {
    const selectedProvider = this.selectProvider(provider);

    if (selectedProvider === 'groq' && groqService) {
      const request = {
        content,
        questionCount: options.questionCount || 5,
        questionTypes: options.questionTypes || ['multiple-choice', 'true-false'],
        difficulty: options.difficulty || 'medium',
        topic: options.topic
      };
      const response = await groqService.generateQuiz(request);
      if (response.success) {
        return response.data;
      }
      // Fall through to next provider on error
    }

    if (selectedProvider === 'openai') {
      return await openAIService.generateQuiz(content, options);
    } else if (selectedProvider === 'anthropic') {
      // Use Anthropic for quiz generation
      const prompt = `Generate ${options.questionCount || 5} quiz questions from this content: ${content}`;
      const response = await anthropicService.generateContent(
        prompt,
        'You are a quiz generator. Respond with JSON array of questions.'
      );
      try {
        return JSON.parse(response);
      } catch {
        return openAIService.generateQuiz(content, options); // Fallback
      }
    }

    // No AI available, use mock
    return openAIService.generateQuiz(content, options);
  }

  /**
   * Generate story using best available AI service
   */
  async generateStory(
    content: string,
    options: any = {},
    provider: AIProvider = 'auto'
  ): Promise<any> {
    const selectedProvider = this.selectProvider(provider);

    if (selectedProvider === 'groq' && groqService) {
      const request = {
        content,
        genre: options.genre || 'educational adventure',
        audience: options.audience || 'general',
        length: options.length || 'medium',
        tone: options.tone || 'engaging and educational'
      };
      const response = await groqService.generateStory(request);
      if (response.success) {
        return response.data;
      }
      // Fall through to next provider on error
    }

    if (selectedProvider === 'openai') {
      return await openAIService.generateStory(content, options);
    } else if (selectedProvider === 'anthropic') {
      const prompt = `Create a ${options.genre || 'educational'} story based on: ${content}`;
      const response = await anthropicService.generateContent(
        prompt,
        'You are a creative storyteller. Respond with JSON containing title, story, characters, themes, and summary.'
      );
      try {
        return JSON.parse(response);
      } catch {
        return openAIService.generateStory(content, options); // Fallback
      }
    }

    return openAIService.generateStory(content, options);
  }

  /**
   * Generate flashcards using best available AI service
   */
  async generateFlashcards(
    content: string,
    count: number = 10,
    provider: AIProvider = 'auto'
  ): Promise<any> {
    const selectedProvider = this.selectProvider(provider);

    if (selectedProvider === 'openai') {
      return await openAIService.generateFlashcards(content, count);
    } else if (selectedProvider === 'anthropic') {
      const prompt = `Generate ${count} flashcards from this content: ${content}`;
      const response = await anthropicService.generateContent(
        prompt,
        'You are a flashcard generator. Respond with JSON array of flashcards with front, back, category, and difficulty.'
      );
      try {
        return JSON.parse(response);
      } catch {
        return openAIService.generateFlashcards(content, count); // Fallback
      }
    }

    return openAIService.generateFlashcards(content, count);
  }

  /**
   * Analyze content using best available AI service
   */
  async analyzeContent(content: string, provider: AIProvider = 'auto'): Promise<any> {
    const selectedProvider = this.selectProvider(provider);

    if (selectedProvider === 'anthropic') {
      return await anthropicService.analyzeContent(content);
    } else if (selectedProvider === 'openai') {
      // Use OpenAI for analysis
      const prompt = `Analyze this content and provide topics, concepts, difficulty, and objectives in JSON: ${content}`;
      // Would implement similar to Anthropic
      return anthropicService.analyzeContent(content); // Fallback for now
    }

    return anthropicService.analyzeContent(content);
  }

  /**
   * Select best available AI provider
   */
  private selectProvider(requested: AIProvider): AIProvider {
    if (requested === 'groq' && groqService) {
      return 'groq';
    }

    if (requested === 'openai' && openAIService.isEnabled()) {
      return 'openai';
    }

    if (requested === 'anthropic' && anthropicService.isEnabled()) {
      return 'anthropic';
    }

    // Auto-select (prioritize Groq for speed)
    if (groqService) {
      return 'groq';
    }

    if (openAIService.isEnabled()) {
      return 'openai';
    }

    if (anthropicService.isEnabled()) {
      return 'anthropic';
    }

    // No AI available
    return 'openai'; // Will use mock responses
  }

  /**
   * Get available AI providers
   */
  getAvailableProviders(): string[] {
    const providers: string[] = [];

    if (groqService) {
      providers.push('groq');
    }

    if (openAIService.isEnabled()) {
      providers.push('openai');
    }

    if (anthropicService.isEnabled()) {
      providers.push('anthropic');
    }

    return providers;
  }

  /**
   * Check if any AI service is available
   */
  isAnyAIAvailable(): boolean {
    return !!groqService || openAIService.isEnabled() || anthropicService.isEnabled();
  }
}

export const aiRouter = new AIRouter();
