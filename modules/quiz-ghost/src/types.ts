// 🎃 Quiz Ghost - Type Definitions

export interface QuizConfig {
  aiProvider?: 'openai' | 'anthropic' | 'mock';
  apiKey?: string;
  maxQuestions?: number;
  defaultDifficulty?: 'easy' | 'medium' | 'hard';
}

export interface QuizInput {
  content: string;
  options?: QuizOptions;
}

export interface QuizOptions {
  questionCount?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  questionTypes?: Array<'multiple-choice' | 'true-false' | 'short-answer'>;
  title?: string;
}

export interface QuizOutput {
  success: boolean;
  quiz?: Quiz;
  error?: string;
  analytics?: {
    contentLength: number;
    questionsGenerated: number;
    processingTime: number;
  };
}

export interface Quiz {
  title: string;
  description: string;
  questions: QuizQuestion[];
  metadata: {
    difficulty: string;
    topics: string[];
    estimatedTime: number;
    totalQuestions: number;
  };
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  tags: string[];
}

export interface ProcessedContent {
  originalContent: string;
  cleanedContent: string;
  topics: string[];
  concepts: string[];
  wordCount: number;
  sentenceCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
}
