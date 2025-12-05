// 🎃 Story Spirit Module - AI-Powered Story Generation
// Creates engaging stories from content using AI

import { GhostModule, ExecutionContext, ExecutionResult } from '../../../sdk/src/GhostFrameSDK';

export interface StoryGenerationInput {
  content: string;
  genre?: 'educational' | 'adventure' | 'mystery' | 'fantasy' | 'sci-fi';
  audience?: 'children' | 'teens' | 'adults';
  length?: 'short' | 'medium' | 'long';
  tone?: string;
  characters?: string[];
  setting?: string;
}

export interface StoryOutput {
  storyId: string;
  title: string;
  story: string;
  characters: Array<{
    name: string;
    role: string;
    description: string;
  }>;
  themes: string[];
  summary: string;
  metadata: {
    wordCount: number;
    readingTime: number;
    genre: string;
    audience: string;
    createdAt: string;
  };
}

export default class StorySpiritModule extends GhostModule {
  
  async execute(context: ExecutionContext): Promise<ExecutionResult> {
    const startTime = Date.now();
    
    try {
      const validationResult = await this.validateInput(context.input);
      if (!validationResult.isValid) {
        throw new Error(`Input validation failed: ${validationResult.errors.join(', ')}`);
      }

      const input = context.input as StoryGenerationInput;
      const story = await this.generateStory(input, context);
      
      return {
        success: true,
        output: story,
        metadata: {
          executionTime: Date.now() - startTime,
          aiModel: context.options?.aiModel || 'gpt-3.5-turbo',
          tokensUsed: this.estimateTokens(story.story),
          cacheHit: false,
          qualityScore: await this.calculateQualityScore(story),
          kiroEvents: ['story_generated', 'content_processed']
        }
      };

    } catch (error) {
      return {
        success: false,
        error: {
          code: 'STORY_GENERATION_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          details: { context: context.moduleId }
        },
        metadata: {
          executionTime: Date.now() - startTime,
          aiModel: context.options?.aiModel || 'gpt-3.5-turbo',
          tokensUsed: 0,
          cacheHit: false,
          kiroEvents: ['story_generation_failed']
        }
      };
    }
  }

  private async validateInput(input: any): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!input.content || typeof input.content !== 'string') {
      errors.push('Content is required and must be a string');
    } else if (input.content.length < 20) {
      errors.push('Content must be at least 20 characters long');
    } else if (input.content.length > 10000) {
      errors.push('Content must be less than 10,000 characters');
    }

    const validGenres = ['educational', 'adventure', 'mystery', 'fantasy', 'sci-fi'];
    if (input.genre && !validGenres.includes(input.genre)) {
      errors.push(`Genre must be one of: ${validGenres.join(', ')}`);
    }

    const validAudiences = ['children', 'teens', 'adults'];
    if (input.audience && !validAudiences.includes(input.audience)) {
      errors.push(`Audience must be one of: ${validAudiences.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private async generateStory(input: StoryGenerationInput, context: ExecutionContext): Promise<StoryOutput> {
    const genre = input.genre || 'educational';
    const audience = input.audience || 'general';
    const length = input.length || 'medium';
    const tone = input.tone || 'engaging and educational';

    // Extract themes and concepts from content
    const themes = this.extractThemes(input.content);
    const concepts = this.extractConcepts(input.content);

    // Generate story using AI
    const storyData = await this.callAI({
      content: input.content,
      genre,
      audience,
      length,
      tone,
      themes,
      concepts,
      characters: input.characters,
      setting: input.setting,
      aiModel: context.options?.aiModel || 'gpt-3.5-turbo'
    });

    const storyId = `story_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const wordCount = storyData.story.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed

    return {
      storyId,
      title: storyData.title,
      story: storyData.story,
      characters: storyData.characters,
      themes: storyData.themes,
      summary: storyData.summary,
      metadata: {
        wordCount,
        readingTime,
        genre,
        audience,
        createdAt: new Date().toISOString()
      }
    };
  }

  private extractThemes(content: string): string[] {
    const themes: string[] = [];
    const lower = content.toLowerCase();

    // Educational themes
    if (lower.includes('learn') || lower.includes('education')) themes.push('Learning');
    if (lower.includes('discover') || lower.includes('explore')) themes.push('Discovery');
    if (lower.includes('challenge') || lower.includes('problem')) themes.push('Problem-solving');
    if (lower.includes('friend') || lower.includes('team')) themes.push('Friendship');
    if (lower.includes('courage') || lower.includes('brave')) themes.push('Courage');
    if (lower.includes('science') || lower.includes('experiment')) themes.push('Science');
    if (lower.includes('history') || lower.includes('past')) themes.push('History');
    if (lower.includes('nature') || lower.includes('environment')) themes.push('Nature');

    return themes.length > 0 ? themes : ['Adventure', 'Learning'];
  }

  private extractConcepts(content: string): string[] {
    const words = content.toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 5)
      .filter(word => !this.isStopWord(word));

    const wordCounts: Record<string, number> = {};
    words.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });

    return Object.entries(wordCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));
  }

  private async callAI(params: any): Promise<any> {
    // In production, this would call the AI Router
    // For now, return structured mock data
    
    const { content, genre, audience, length, themes, concepts } = params;
    
    const lengthMap = {
      short: { paragraphs: 3, wordsPerPara: 80 },
      medium: { paragraphs: 5, wordsPerPara: 100 },
      long: { paragraphs: 8, wordsPerPara: 120 }
    };

    const config = lengthMap[length as keyof typeof lengthMap] || lengthMap.medium;
    
    // Generate story paragraphs
    const paragraphs: string[] = [];
    for (let i = 0; i < config.paragraphs; i++) {
      if (i === 0) {
        paragraphs.push(`Once upon a time, in a world where ${concepts[0] || 'knowledge'} was the greatest treasure, there lived a curious ${audience === 'children' ? 'child' : 'person'} who loved to ${themes[0] || 'learn'}. The ${genre} adventure was about to begin...`);
      } else if (i === config.paragraphs - 1) {
        paragraphs.push(`And so, through ${themes.join(' and ')}, our hero discovered that ${concepts[0] || 'learning'} was not just about facts, but about the journey of discovery itself. The end.`);
      } else {
        paragraphs.push(`As the story unfolded, they encountered challenges related to ${concepts[i % concepts.length] || 'the unknown'}. With determination and ${themes[i % themes.length] || 'courage'}, they pressed forward, learning valuable lessons along the way.`);
      }
    }

    const story = paragraphs.join('\n\n');

    return {
      title: `The ${genre.charAt(0).toUpperCase() + genre.slice(1)} of ${concepts[0] || 'Discovery'}`,
      story,
      characters: [
        {
          name: 'Alex',
          role: 'Protagonist',
          description: `A curious ${audience} eager to learn about ${concepts[0] || 'the world'}`
        },
        {
          name: 'The Guide',
          role: 'Mentor',
          description: `A wise figure who helps Alex understand ${concepts[1] || 'important concepts'}`
        }
      ],
      themes: themes.slice(0, 3),
      summary: `A ${genre} story about ${concepts[0] || 'discovery'} and ${themes[0] || 'learning'}, perfect for ${audience}.`
    };
  }

  private async calculateQualityScore(story: StoryOutput): Promise<number> {
    let score = 100;

    if (story.story.length < 200) score -= 30;
    if (story.characters.length === 0) score -= 20;
    if (story.themes.length === 0) score -= 10;
    if (!story.summary) score -= 10;
    if (story.metadata.wordCount < 100) score -= 20;

    return Math.max(0, score);
  }

  private isStopWord(word: string): boolean {
    const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'this', 'that'];
    return stopWords.includes(word.toLowerCase());
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}
