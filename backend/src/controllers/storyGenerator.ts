import { getProcessedContent } from './contentProcessor';
import { AIRouter } from '../services/AIRouter';

// 🎃 Story Generator using GhostFrame AI Router

export type StoryTheme = 'adventure' | 'mystery' | 'fantasy' | 'sci-fi' | 'historical' | 'educational' | 'horror' | 'comedy';
export type TargetAudience = 'children' | 'teens' | 'adults' | 'academic';
export type StoryLength = 'short' | 'medium' | 'long';

export interface StoryGenerationRequest {
  contentId: string;
  theme: StoryTheme;
  targetAudience: TargetAudience;
  length: StoryLength;
  customPrompt?: string;
  includeCharacters?: string[];
  setting?: string;
}

export interface GeneratedStory {
  metadata: {
    storyId: string;
    contentId: string;
    title: string;
    theme: StoryTheme;
    targetAudience: TargetAudience;
    length: StoryLength;
    wordCount: number;
    estimatedReadingTime: number;
    createdAt: Date;
  };
  content: string;
  summary: string;
  moralOrLesson?: string;
}

export class StoryGenerator {
  private static aiRouter = new AIRouter();

  /**
   * Generate AI-powered story from processed content
   * Uses GhostFrame's AI Router for actual AI generation
   */
  static async generateStory(request: StoryGenerationRequest): Promise<GeneratedStory> {
    const content = getProcessedContent(request.contentId);
    if (!content) {
      throw new Error(`Content not found: ${request.contentId}`);
    }

    console.log(`👻 Story Spirit using AI to generate ${request.theme} story`);

    // Build AI prompt based on requirements
    const prompt = this.buildStoryPrompt(content.processedText, request);

    // Use AI Router to generate story
    const aiResponse = await this.aiRouter.generate({
      prompt,
      provider: 'groq', // Using Groq for fast generation
      model: 'llama-3.3-70b-versatile',
      temperature: 0.8, // Higher temperature for creative writing
      maxTokens: this.getMaxTokens(request.length)
    });

    // Parse AI response
    const storyContent = aiResponse.text;
    const wordCount = storyContent.split(/\s+/).length;
    const estimatedReadingTime = Math.ceil(wordCount / 200);

    // Generate summary using AI
    const summary = await this.generateSummary(storyContent);

    // Generate moral/lesson using AI
    const moralOrLesson = await this.generateMoral(storyContent, request.theme);

    const storyId = `story_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    return {
      metadata: {
        storyId,
        contentId: request.contentId,
        title: await this.generateTitle(storyContent, request.theme),
        theme: request.theme,
        targetAudience: request.targetAudience,
        length: request.length,
        wordCount,
        estimatedReadingTime,
        createdAt: new Date()
      },
      content: storyContent,
      summary,
      moralOrLesson
    };
  }

  /**
   * Build comprehensive prompt for AI story generation
   */
  private static buildStoryPrompt(contentText: string, request: StoryGenerationRequest): string {
    const lengthGuidance = {
      short: '500-700 words',
      medium: '1000-1500 words',
      long: '2000-3000 words'
    };

    const audienceGuidance = {
      children: 'Use simple language, short sentences, and engaging descriptions suitable for ages 8-12.',
      teens: 'Use engaging language with moderate complexity suitable for ages 13-17.',
      adults: 'Use sophisticated language and complex narratives suitable for adult readers.',
      academic: 'Use formal academic language with proper terminology and scholarly tone.'
    };

    let prompt = `You are a creative storyteller. Generate an engaging ${request.theme} story based on the following content.

**Story Requirements:**
- Theme: ${request.theme}
- Target Audience: ${request.targetAudience}
- Length: ${lengthGuidance[request.length]}
- Writing Style: ${audienceGuidance[request.targetAudience]}

**Source Content to Base Story On:**
${contentText.substring(0, 3000)}

**Instructions:**
1. Create an original ${request.theme} story that incorporates key concepts from the source content
2. Make the story engaging and appropriate for ${request.targetAudience}
3. Include educational elements naturally woven into the narrative
4. Use vivid descriptions and compelling characters
5. Ensure the story has a clear beginning, middle, and end
6. Target length: ${lengthGuidance[request.length]}`;

    if (request.setting) {
      prompt += `\n7. Set the story in: ${request.setting}`;
    }

    if (request.includeCharacters && request.includeCharacters.length > 0) {
      prompt += `\n8. Include these characters: ${request.includeCharacters.join(', ')}`;
    }

    if (request.customPrompt) {
      prompt += `\n9. Additional requirements: ${request.customPrompt}`;
    }

    prompt += `\n\n**Generate the complete story now:**`;

    return prompt;
  }

  /**
   * Generate story title using AI
   */
  private static async generateTitle(storyContent: string, theme: StoryTheme): Promise<string> {
    const prompt = `Based on this ${theme} story, generate a compelling title (maximum 10 words):

${storyContent.substring(0, 500)}...

Title:`;

    const response = await this.aiRouter.generate({
      prompt,
      provider: 'groq',
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      maxTokens: 50
    });

    return response.text.trim().replace(/^["']|["']$/g, '');
  }

  /**
   * Generate story summary using AI
   */
  private static async generateSummary(storyContent: string): Promise<string> {
    const prompt = `Summarize this story in 2-3 sentences:

${storyContent.substring(0, 1000)}...

Summary:`;

    const response = await this.aiRouter.generate({
      prompt,
      provider: 'groq',
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      maxTokens: 150
    });

    return response.text.trim();
  }

  /**
   * Generate moral or lesson using AI
   */
  private static async generateMoral(storyContent: string, theme: StoryTheme): Promise<string> {
    const prompt = `What is the main lesson or moral of this ${theme} story? (1-2 sentences)

${storyContent.substring(0, 800)}...

Lesson:`;

    const response = await this.aiRouter.generate({
      prompt,
      provider: 'groq',
      model: 'llama-3.3-70b-versatile',
      temperature: 0.6,
      maxTokens: 100
    });

    return response.text.trim();
  }

  /**
   * Get max tokens based on story length
   */
  private static getMaxTokens(length: StoryLength): number {
    const tokenLimits = {
      short: 1000,
      medium: 2000,
      long: 4000
    };
    return tokenLimits[length];
  }
}

// In-memory storage for demo
export const storyStorage = new Map<string, GeneratedStory>();

export const saveGeneratedStory = (story: GeneratedStory): void => {
  storyStorage.set(story.metadata.storyId, story);
  console.log(`💾 Story saved: ${story.metadata.storyId}`);
};

export const getGeneratedStory = (storyId: string): GeneratedStory | null => {
  return storyStorage.get(storyId) || null;
};

export const listGeneratedStories = (): GeneratedStory[] => {
  return Array.from(storyStorage.values());
};
