// 🎃 GhostFrame Anthropic Service
// Integration with Anthropic Claude API

import { config } from '../config/env';

export class AnthropicService {
  private apiKey: string;
  private baseURL: string = 'https://api.anthropic.com/v1';
  private model: string = 'claude-3-haiku-20240307';

  constructor() {
    this.apiKey = config.anthropic.apiKey || '';
    
    if (!this.apiKey) {
      console.warn('⚠️  Anthropic API key not configured.');
    }
  }

  /**
   * Check if Anthropic is enabled
   */
  isEnabled(): boolean {
    return config.anthropic.enabled && !!this.apiKey;
  }

  /**
   * Generate content with Claude
   */
  async generateContent(prompt: string, systemPrompt?: string): Promise<string> {
    if (!this.isEnabled()) {
      return 'Anthropic API not configured. Please add ANTHROPIC_API_KEY to your environment.';
    }

    try {
      const response = await fetch(`${this.baseURL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 2000,
          system: systemPrompt || 'You are a helpful AI assistant.',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Anthropic API error:', error);
      throw error;
    }
  }

  /**
   * Analyze content
   */
  async analyzeContent(content: string): Promise<any> {
    const prompt = `Analyze this content and provide:
1. Main topics (list)
2. Key concepts (list)
3. Difficulty level (beginner/intermediate/advanced)
4. Suggested learning objectives (list)

Content:
${content}

Respond in JSON format.`;

    try {
      const response = await this.generateContent(
        prompt,
        'You are a content analysis expert. Always respond with valid JSON.'
      );
      return JSON.parse(response);
    } catch (error) {
      return {
        topics: ['General'],
        concepts: ['Various concepts'],
        difficulty: 'intermediate',
        objectives: ['Understand the content'],
      };
    }
  }
}

export const anthropicService = new AnthropicService();
