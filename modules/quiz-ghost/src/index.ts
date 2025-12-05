// 🎃 Quiz Ghost Module - Main Entry Point
// AI-powered quiz generation from any content

import { QuizProcessor } from './processor';
import { QuizGenerator } from './generator';
import { QuizConfig, QuizInput, QuizOutput } from './types';

export class QuizGhostModule {
  private processor: QuizProcessor;
  private generator: QuizGenerator;
  private config: QuizConfig;

  constructor(config: QuizConfig) {
    this.config = config;
    this.processor = new QuizProcessor();
    this.generator = new QuizGenerator(config);
  }

  /**
   * Main execution method
   */
  async execute(input: QuizInput): Promise<QuizOutput> {
    try {
      // 1. Process and extract content
      const processedContent = await this.processor.process(input.content);

      // 2. Generate quiz questions
      const questions = await this.generator.generate(
        processedContent,
        input.options
      );

      // 3. Return formatted output
      return {
        success: true,
        quiz: {
          title: input.options?.title || 'Generated Quiz',
          description: `Quiz generated from ${processedContent.wordCount} words of content`,
          questions,
          metadata: {
            difficulty: input.options?.difficulty || 'medium',
            topics: processedContent.topics,
            estimatedTime: questions.length * 2, // 2 minutes per question
            totalQuestions: questions.length,
          },
        },
        analytics: {
          contentLength: processedContent.wordCount,
          questionsGenerated: questions.length,
          processingTime: Date.now(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Quiz generation failed',
      };
    }
  }

  /**
   * Validate input
   */
  validateInput(input: QuizInput): boolean {
    if (!input.content || input.content.trim().length < 100) {
      throw new Error('Content must be at least 100 characters');
    }

    if (input.options?.questionCount && input.options.questionCount > 50) {
      throw new Error('Maximum 50 questions allowed');
    }

    return true;
  }

  /**
   * Get module info
   */
  getInfo() {
    return {
      name: 'Quiz Ghost',
      version: '1.0.0',
      description: 'AI-powered quiz generation from any content',
      author: 'GhostFrame Team',
      capabilities: [
        'Multiple choice questions',
        'True/false questions',
        'Short answer questions',
        'Adaptive difficulty',
        'Topic extraction',
      ],
    };
  }
}

// Export for use
export default QuizGhostModule;
export * from './types';
