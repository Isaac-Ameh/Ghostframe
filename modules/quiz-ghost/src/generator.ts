// 🎃 Quiz Ghost - Quiz Generator
// Generates quiz questions from processed content

import { QuizConfig, ProcessedContent, QuizQuestion, QuizOptions } from './types';

export class QuizGenerator {
  private config: QuizConfig;

  constructor(config: QuizConfig) {
    this.config = config;
  }

  /**
   * Generate quiz questions
   */
  async generate(
    content: ProcessedContent,
    options?: QuizOptions
  ): Promise<QuizQuestion[]> {
    const questionCount = options?.questionCount || 5;
    const difficulty = options?.difficulty || content.difficulty;
    const questionTypes = options?.questionTypes || ['multiple-choice', 'true-false'];

    const questions: QuizQuestion[] = [];

    // Generate questions based on content
    for (let i = 0; i < questionCount; i++) {
      const type = questionTypes[i % questionTypes.length];
      
      if (type === 'multiple-choice') {
        questions.push(this.generateMultipleChoice(content, difficulty, i));
      } else if (type === 'true-false') {
        questions.push(this.generateTrueFalse(content, difficulty, i));
      } else if (type === 'short-answer') {
        questions.push(this.generateShortAnswer(content, difficulty, i));
      }
    }

    return questions;
  }

  /**
   * Generate multiple choice question
   */
  private generateMultipleChoice(
    content: ProcessedContent,
    difficulty: string,
    index: number
  ): QuizQuestion {
    const topic = content.topics[index % content.topics.length] || 'general';
    
    return {
      id: `q${index + 1}`,
      type: 'multiple-choice',
      question: `What is the main concept related to "${topic}"?`,
      options: [
        `${topic} is a fundamental concept in this content`,
        `${topic} is not mentioned in the content`,
        `${topic} is a secondary topic`,
        `${topic} is unrelated to the main theme`,
      ],
      correctAnswer: 0,
      explanation: `Based on the content analysis, "${topic}" is identified as a key concept with high frequency.`,
      difficulty: difficulty as any,
      points: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3,
      tags: [topic, 'concept'],
    };
  }

  /**
   * Generate true/false question
   */
  private generateTrueFalse(
    content: ProcessedContent,
    difficulty: string,
    index: number
  ): QuizQuestion {
    const concept = content.concepts[index % content.concepts.length] || 'This content discusses important topics';
    
    return {
      id: `q${index + 1}`,
      type: 'true-false',
      question: `True or False: ${concept}`,
      options: ['True', 'False'],
      correctAnswer: 0,
      explanation: 'This statement is derived from the content analysis.',
      difficulty: difficulty as any,
      points: 1,
      tags: ['true-false', 'concept'],
    };
  }

  /**
   * Generate short answer question
   */
  private generateShortAnswer(
    content: ProcessedContent,
    difficulty: string,
    index: number
  ): QuizQuestion {
    const topic = content.topics[index % content.topics.length] || 'main topic';
    
    return {
      id: `q${index + 1}`,
      type: 'short-answer',
      question: `Explain the significance of "${topic}" in the context of this content.`,
      options: [],
      correctAnswer: -1,
      explanation: `A good answer should discuss how "${topic}" relates to the main themes and concepts presented.`,
      difficulty: difficulty as any,
      points: difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 5,
      tags: [topic, 'explanation'],
    };
  }
}
