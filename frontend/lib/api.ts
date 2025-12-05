// 👻 GhostFrame API Client
// 🎃 KIRO INTEGRATION POINT: Future hooks will monitor API calls for automation

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

export interface ProcessedContent {
  contentId: string;
  originalFilename: string;
  processedText: string;
  keyTopics: string[];
  wordCount: number;
  uploadedAt: string;
  metadata: {
    title?: string;
    subject?: string;
    difficulty?: string;
    tags?: string[];
  };
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: number;
}

export interface Quiz {
  quizId: string;
  questions: Question[];
  metadata: {
    contentId: string;
    difficulty: string;
    questionTypes: string[];
    generatedAt: string;
  };
}

export interface Story {
  storyId: string;
  title: string;
  content: string;
  keyPoints: string[];
  theme: string;
  targetAudience: string;
  generatedAt: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: number;
  topic: string;
  hints?: string[];
}

export interface FlashcardDeck {
  deckId: string;
  cards: Flashcard[];
  metadata: {
    contentId: string;
    difficulty: string;
    totalCards: number;
    topics: string[];
    generatedAt: string;
  };
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // 📁 Content Upload API
  async uploadContent(file: File, metadata?: any): Promise<ApiResponse<ProcessedContent>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (metadata) {
      Object.keys(metadata).forEach(key => {
        formData.append(key, metadata[key]);
      });
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      return data;
    } catch (error) {
      console.error('Upload Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  async getContent(contentId: string): Promise<ApiResponse<ProcessedContent>> {
    return this.request<ProcessedContent>(`/api/upload/${contentId}`);
  }

  // 🧠 Quiz Generation API
  async generateQuiz(params: {
    contentId: string;
    questionCount?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    questionTypes?: ('multiple-choice' | 'true-false' | 'short-answer')[];
  }): Promise<ApiResponse<Quiz>> {
    return this.request<Quiz>('/api/quiz/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getQuiz(quizId: string): Promise<ApiResponse<Quiz>> {
    return this.request<Quiz>(`/api/quiz/${quizId}`);
  }

  // 📖 Story Generation API
  async generateStory(params: {
    contentId: string;
    theme?: string;
    length?: 'short' | 'medium' | 'long';
    targetAudience?: 'children' | 'teens' | 'adults';
  }): Promise<ApiResponse<Story>> {
    return this.request<Story>('/api/story/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getStory(storyId: string): Promise<ApiResponse<Story>> {
    return this.request<Story>(`/api/story/${storyId}`);
  }

  // 🃏 Flashcard Generation API
  async generateFlashcards(params: {
    contentId: string;
    cardCount?: number;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
  }): Promise<ApiResponse<FlashcardDeck>> {
    return this.request<FlashcardDeck>('/api/flashcards/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getFlashcards(deckId: string): Promise<ApiResponse<FlashcardDeck>> {
    return this.request<FlashcardDeck>(`/api/flashcards/${deckId}`);
  }

  // 🏥 Health Check
  async healthCheck(): Promise<ApiResponse<{ status: string; message: string }>> {
    return this.request<{ status: string; message: string }>('/health');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// 🎃 KIRO INTEGRATION POINT: Future hooks will intercept these API calls
export default apiClient;