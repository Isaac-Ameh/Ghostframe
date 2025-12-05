// 🎃 GhostFrame Groq AI Service
// Fast inference with Groq's LPU technology
// Uses OpenAI-compatible API with fetch (no SDK needed)

interface AIService {
  generateQuiz(request: QuizGenerationRequest): Promise<AIResponse>;
  generateStory(request: StoryGenerationRequest): Promise<AIResponse>;
  analyzeContent(content: string): Promise<AIResponse>;
  testConnection(): Promise<boolean>;
}

interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
  provider: string;
  model?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

interface QuizGenerationRequest {
  content: string;
  questionCount?: number;
  questionTypes?: string[];
  difficulty?: string;
  topic?: string;
}

interface StoryGenerationRequest {
  content: string;
  genre?: string;
  audience?: string;
  length?: string;
  tone?: string;
}

export class GroqService implements AIService {
  private apiKey: string;
  private baseURL = 'https://api.groq.com/openai/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Generic text generation method - used by AIRouter
   */
  async generateText(options: {
    prompt: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<AIResponse> {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: options.model || 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'user',
              content: options.prompt
            }
          ],
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 2000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from Groq');
      }

      return {
        success: true,
        data: content,
        provider: 'groq',
        model: options.model || 'llama-3.3-70b-versatile',
        usage: {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0,
        },
      };
    } catch (error) {
      console.error('Groq text generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: 'groq',
      };
    }
  }

  async generateQuiz(request: QuizGenerationRequest): Promise<AIResponse> {
    try {
      const prompt = this.buildQuizPrompt(request);
      
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are an expert quiz generator. Create educational quizzes from provided content. Always respond with valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from Groq');
      }

      const quizData = JSON.parse(content);

      return {
        success: true,
        data: quizData,
        provider: 'groq',
        model: 'llama-3.3-70b-versatile',
        usage: {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0,
        },
      };
    } catch (error) {
      console.error('Groq quiz generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: 'groq',
      };
    }
  }

  async generateStory(request: StoryGenerationRequest): Promise<AIResponse> {
    try {
      const prompt = this.buildStoryPrompt(request);
      
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are a creative storyteller. Transform educational content into engaging stories. Always respond with valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 3000,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from Groq');
      }

      const storyData = JSON.parse(content);

      return {
        success: true,
        data: storyData,
        provider: 'groq',
        model: 'llama-3.3-70b-versatile',
        usage: {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0,
        },
      };
    } catch (error) {
      console.error('Groq story generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: 'groq',
      };
    }
  }

  async analyzeContent(content: string): Promise<AIResponse> {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are a content analyzer. Extract key topics, concepts, and themes from text. Respond with valid JSON.'
            },
            {
              role: 'user',
              content: `Analyze this content and extract key topics, concepts, difficulty level, and main themes:\n\n${content}`
            }
          ],
          temperature: 0.3,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      const analysisContent = data.choices[0]?.message?.content;

      if (!analysisContent) {
        throw new Error('No analysis received from Groq');
      }

      const analysis = JSON.parse(analysisContent);

      return {
        success: true,
        data: analysis,
        provider: 'groq',
        model: 'llama-3.3-70b-versatile',
        usage: {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0,
        },
      };
    } catch (error) {
      console.error('Groq content analysis error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: 'groq',
      };
    }
  }

  private buildQuizPrompt(request: QuizGenerationRequest): string {
    return `Generate a quiz from this content with the following specifications:

Content: ${request.content}

Requirements:
- Number of questions: ${request.questionCount || 5}
- Question types: ${request.questionTypes?.join(', ') || 'multiple-choice, true-false'}
- Difficulty: ${request.difficulty || 'medium'}
- Topic focus: ${request.topic || 'general'}

Return a JSON object with this structure:
{
  "title": "Quiz Title",
  "description": "Brief description",
  "questions": [
    {
      "id": 1,
      "type": "multiple-choice",
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "Why this is correct",
      "difficulty": "medium",
      "topic": "topic name"
    }
  ],
  "metadata": {
    "totalQuestions": 5,
    "estimatedTime": "10 minutes",
    "topics": ["topic1", "topic2"]
  }
}`;
  }

  private buildStoryPrompt(request: StoryGenerationRequest): string {
    return `Create an engaging story that incorporates the following content:

Content: ${request.content}

Requirements:
- Genre: ${request.genre || 'educational adventure'}
- Target audience: ${request.audience || 'general'}
- Length: ${request.length || 'medium'} (short=500 words, medium=1000 words, long=1500 words)
- Tone: ${request.tone || 'engaging and educational'}

Return a JSON object with this structure:
{
  "title": "Story Title",
  "genre": "adventure",
  "summary": "Brief story summary",
  "story": "Full story text with paragraphs",
  "characters": [
    {
      "name": "Character Name",
      "role": "protagonist",
      "description": "Character description"
    }
  ],
  "themes": ["theme1", "theme2"],
  "educationalElements": [
    {
      "concept": "concept name",
      "integration": "how it's woven into the story"
    }
  ],
  "metadata": {
    "wordCount": 1000,
    "readingTime": "5 minutes",
    "difficulty": "medium"
  }
}`;
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Groq connection test failed:', error);
      return false;
    }
  }
}
