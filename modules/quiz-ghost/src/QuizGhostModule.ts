// 🎃 Quiz Ghost Module - Refactored for GhostFrame Framework
// Educational AI module for generating interactive quizzes from content

import { GhostModule, ExecutionContext, ExecutionResult } from '../../../sdk/src/GhostFrameSDK';
import { qualityMetricsEngine } from '../../../backend/src/services/QualityMetricsEngine';
import { moduleValidationEngine } from '../../../backend/src/services/ModuleValidationEngine';

export interface QuizGenerationInput {
  content: string;
  questionCount?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  questionTypes?: ('multiple_choice' | 'true_false' | 'short_answer')[];
  includeExplanations?: boolean;
  language?: string;
  subject?: string;
  focusAreas?: string[];
}

export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  points: number;
}

export interface QuizOutput {
  quizId: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  metadata: {
    totalQuestions: number;
    totalPoints: number;
    estimatedTime: number;
    difficulty: string;
    topics: string[];
    createdAt: string;
  };
}

export default class QuizGhostModule extends GhostModule {
  
  async execute(context: ExecutionContext): Promise<ExecutionResult> {
    const startTime = Date.now();
    
    try {
      // Validate input using framework validation
      const validationResult = await this.validateInput(context.input);
      if (!validationResult.isValid) {
        throw new Error(`Input validation failed: ${validationResult.errors.join(', ')}`);
      }

      const input = context.input as QuizGenerationInput;
      
      // Process content and generate quiz
      const quiz = await this.generateQuiz(input, context);
      
      // Record quality metrics
      await this.recordQualityMetrics(context, quiz, startTime);
      
      return {
        success: true,
        output: quiz,
        metadata: {
          executionTime: Date.now() - startTime,
          aiModel: context.options?.aiModel || 'gpt-3.5-turbo',
          tokensUsed: this.estimateTokens(input.content + JSON.stringify(quiz)),
          cacheHit: false,
          qualityScore: await this.calculateQualityScore(quiz),
          kiroEvents: ['quiz_generated', 'content_processed']
        }
      };

    } catch (error) {
      return {
        success: false,
        error: {
          code: 'QUIZ_GENERATION_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          details: { context: context.moduleId }
        },
        metadata: {
          executionTime: Date.now() - startTime,
          aiModel: context.options?.aiModel || 'gpt-3.5-turbo',
          tokensUsed: 0,
          cacheHit: false,
          kiroEvents: ['quiz_generation_failed']
        }
      };
    }
  }

  private async validateInput(input: any): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!input.content || typeof input.content !== 'string') {
      errors.push('Content is required and must be a string');
    } else if (input.content.length < 50) {
      errors.push('Content must be at least 50 characters long');
    } else if (input.content.length > 50000) {
      errors.push('Content must be less than 50,000 characters');
    }

    if (input.questionCount && (input.questionCount < 1 || input.questionCount > 20)) {
      errors.push('Question count must be between 1 and 20');
    }

    if (input.difficulty && !['easy', 'medium', 'hard'].includes(input.difficulty)) {
      errors.push('Difficulty must be easy, medium, or hard');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private async generateQuiz(input: QuizGenerationInput, context: ExecutionContext): Promise<QuizOutput> {
    // Set defaults
    const questionCount = input.questionCount || 5;
    const difficulty = input.difficulty || 'medium';
    const questionTypes = input.questionTypes || ['multiple_choice'];
    const includeExplanations = input.includeExplanations !== false;

    // Extract key information from content
    const keyStatements = this.extractKeyStatements(input.content);
    const topics = this.extractTopics(input.content, input.focusAreas);

    // Generate questions using AI
    const questions = await this.generateQuestions({
      statements: keyStatements,
      topics,
      questionCount,
      difficulty,
      questionTypes,
      includeExplanations,
      aiModel: context.options?.aiModel || 'gpt-3.5-turbo'
    });

    // Create quiz metadata
    const quizId = `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    const estimatedTime = Math.max(5, questions.length * 2);

    return {
      quizId,
      title: `Quiz: ${input.subject || 'Generated Content'}`,
      description: `AI-generated quiz with ${questions.length} questions`,
      questions,
      metadata: {
        totalQuestions: questions.length,
        totalPoints,
        estimatedTime,
        difficulty,
        topics: [...new Set(questions.map(q => q.topic))],
        createdAt: new Date().toISOString()
      }
    };
  }

  private extractKeyStatements(content: string): string[] {
    const sentences = content.split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 20 && s.length < 200)
      .filter(s => this.isEducationallyValuable(s));

    // Score and sort sentences by educational value
    const scoredSentences = sentences.map(sentence => ({
      text: sentence,
      score: this.scoreSentenceEducationalValue(sentence)
    }));

    return scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.min(30, sentences.length))
      .map(s => s.text);
  }

  private extractTopics(content: string, focusAreas?: string[]): string[] {
    if (focusAreas && focusAreas.length > 0) {
      return focusAreas;
    }

    // Simple topic extraction - in production would use NLP
    const words = content.toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 4)
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

  private async generateQuestions(params: {
    statements: string[];
    topics: string[];
    questionCount: number;
    difficulty: string;
    questionTypes: string[];
    includeExplanations: boolean;
    aiModel: string;
  }): Promise<QuizQuestion[]> {
    const questions: QuizQuestion[] = [];
    const { statements, topics, questionCount, difficulty, questionTypes, includeExplanations, aiModel } = params;

    // Distribute questions across types
    const typeDistribution = this.distributeQuestionTypes(questionTypes, questionCount);

    let questionId = 1;

    // Generate multiple choice questions
    for (let i = 0; i < (typeDistribution['multiple_choice'] || 0); i++) {
      const statement = this.selectRandomElement(statements);
      const topic = this.selectRelevantTopic(statement, topics);
      
      const question = await this.generateMultipleChoiceQuestion({
        statement,
        topic,
        difficulty: difficulty as 'easy' | 'medium' | 'hard',
        id: `q${questionId++}`,
        includeExplanations,
        aiModel
      });
      
      if (question) questions.push(question);
    }

    // Generate true/false questions
    for (let i = 0; i < (typeDistribution['true_false'] || 0); i++) {
      const statement = this.selectRandomElement(statements);
      const topic = this.selectRelevantTopic(statement, topics);
      
      const question = await this.generateTrueFalseQuestion({
        statement,
        topic,
        difficulty: difficulty as 'easy' | 'medium' | 'hard',
        id: `q${questionId++}`,
        includeExplanations,
        aiModel
      });
      
      if (question) questions.push(question);
    }

    // Generate short answer questions
    for (let i = 0; i < (typeDistribution['short_answer'] || 0); i++) {
      const statement = this.selectRandomElement(statements);
      const topic = this.selectRelevantTopic(statement, topics);
      
      const question = await this.generateShortAnswerQuestion({
        statement,
        topic,
        difficulty: difficulty as 'easy' | 'medium' | 'hard',
        id: `q${questionId++}`,
        includeExplanations,
        aiModel
      });
      
      if (question) questions.push(question);
    }

    return this.shuffleArray(questions).slice(0, questionCount);
  }

  private async generateMultipleChoiceQuestion(params: {
    statement: string;
    topic: string;
    difficulty: 'easy' | 'medium' | 'hard';
    id: string;
    includeExplanations: boolean;
    aiModel: string;
  }): Promise<QuizQuestion | null> {
    const { statement, topic, difficulty, id, includeExplanations, aiModel } = params;

    try {
      // Use framework's AI gateway for generation
      const prompt = this.buildMultipleChoicePrompt(statement, difficulty);
      const aiResponse = await this.callAI(prompt, aiModel);
      
      const parsed = this.parseMultipleChoiceResponse(aiResponse);
      if (!parsed) return null;

      return {
        id,
        type: 'multiple_choice',
        question: parsed.question,
        options: parsed.options,
        correctAnswer: parsed.correctAnswer,
        explanation: includeExplanations ? parsed.explanation : '',
        difficulty,
        topic,
        points: this.calculatePoints(difficulty)
      };

    } catch (error) {
      console.error('Failed to generate multiple choice question:', error);
      return null;
    }
  }

  private async generateTrueFalseQuestion(params: {
    statement: string;
    topic: string;
    difficulty: 'easy' | 'medium' | 'hard';
    id: string;
    includeExplanations: boolean;
    aiModel: string;
  }): Promise<QuizQuestion | null> {
    const { statement, topic, difficulty, id, includeExplanations, aiModel } = params;

    try {
      const prompt = this.buildTrueFalsePrompt(statement, difficulty);
      const aiResponse = await this.callAI(prompt, aiModel);
      
      const parsed = this.parseTrueFalseResponse(aiResponse);
      if (!parsed) return null;

      return {
        id,
        type: 'true_false',
        question: parsed.question,
        correctAnswer: parsed.correctAnswer,
        explanation: includeExplanations ? parsed.explanation : '',
        difficulty,
        topic,
        points: this.calculatePoints(difficulty)
      };

    } catch (error) {
      console.error('Failed to generate true/false question:', error);
      return null;
    }
  }

  private async generateShortAnswerQuestion(params: {
    statement: string;
    topic: string;
    difficulty: 'easy' | 'medium' | 'hard';
    id: string;
    includeExplanations: boolean;
    aiModel: string;
  }): Promise<QuizQuestion | null> {
    const { statement, topic, difficulty, id, includeExplanations, aiModel } = params;

    try {
      const prompt = this.buildShortAnswerPrompt(statement, difficulty);
      const aiResponse = await this.callAI(prompt, aiModel);
      
      const parsed = this.parseShortAnswerResponse(aiResponse);
      if (!parsed) return null;

      return {
        id,
        type: 'short_answer',
        question: parsed.question,
        correctAnswer: parsed.correctAnswer,
        explanation: includeExplanations ? parsed.explanation : '',
        difficulty,
        topic,
        points: this.calculatePoints(difficulty) * 1.5 // Higher points for open-ended
      };

    } catch (error) {
      console.error('Failed to generate short answer question:', error);
      return null;
    }
  }

  private buildMultipleChoicePrompt(statement: string, difficulty: string): string {
    return `Based on this information: "${statement}"

Create a ${difficulty} difficulty multiple choice question with 4 options (A, B, C, D).

Format your response as JSON:
{
  "question": "Your question here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "Option A",
  "explanation": "Why this answer is correct"
}

Make sure the question tests understanding, not just memorization.`;
  }

  private buildTrueFalsePrompt(statement: string, difficulty: string): string {
    return `Based on this information: "${statement}"

Create a ${difficulty} difficulty true/false question.

Format your response as JSON:
{
  "question": "Your true/false statement here",
  "correctAnswer": "True" or "False",
  "explanation": "Why this answer is correct"
}

Make the question clear and unambiguous.`;
  }

  private buildShortAnswerPrompt(statement: string, difficulty: string): string {
    return `Based on this information: "${statement}"

Create a ${difficulty} difficulty short answer question that requires explanation or analysis.

Format your response as JSON:
{
  "question": "Your open-ended question here",
  "correctAnswer": "Key points that should be included in the answer",
  "explanation": "What makes a good answer to this question"
}

Make the question thought-provoking and require understanding.`;
  }

  private async callAI(prompt: string, model: string): Promise<string> {
    // Simulate AI call - in production would use actual AI gateway
    // This is a placeholder that returns structured responses
    
    if (prompt.includes('multiple choice')) {
      return JSON.stringify({
        question: "What is the main concept discussed in the given statement?",
        options: ["Concept A", "Concept B", "Concept C", "Concept D"],
        correctAnswer: "Concept A",
        explanation: "This is the correct answer based on the provided information."
      });
    } else if (prompt.includes('true/false')) {
      return JSON.stringify({
        question: "The statement provided is accurate and complete.",
        correctAnswer: "True",
        explanation: "The statement accurately reflects the information provided."
      });
    } else {
      return JSON.stringify({
        question: "Explain the significance of the concept mentioned in the statement.",
        correctAnswer: "The concept is significant because it demonstrates key principles and has practical applications.",
        explanation: "A good answer should include the main principles, examples, and real-world applications."
      });
    }
  }

  private parseMultipleChoiceResponse(response: string): any {
    try {
      const parsed = JSON.parse(response);
      if (parsed.question && parsed.options && parsed.correctAnswer && parsed.explanation) {
        return parsed;
      }
    } catch (error) {
      console.error('Failed to parse multiple choice response:', error);
    }
    return null;
  }

  private parseTrueFalseResponse(response: string): any {
    try {
      const parsed = JSON.parse(response);
      if (parsed.question && parsed.correctAnswer && parsed.explanation) {
        return parsed;
      }
    } catch (error) {
      console.error('Failed to parse true/false response:', error);
    }
    return null;
  }

  private parseShortAnswerResponse(response: string): any {
    try {
      const parsed = JSON.parse(response);
      if (parsed.question && parsed.correctAnswer && parsed.explanation) {
        return parsed;
      }
    } catch (error) {
      console.error('Failed to parse short answer response:', error);
    }
    return null;
  }

  private async recordQualityMetrics(context: ExecutionContext, quiz: QuizOutput, startTime: number): Promise<void> {
    try {
      await qualityMetricsEngine.recordPerformanceBenchmark(context.moduleId, {
        name: 'quiz_generation_time',
        value: Date.now() - startTime,
        unit: 'ms',
        target: 5000,
        percentile: 95
      });
    } catch (error) {
      console.error('Failed to record quality metrics:', error);
    }
  }

  private async calculateQualityScore(quiz: QuizOutput): Promise<number> {
    let score = 100;

    // Deduct points for issues
    if (quiz.questions.length === 0) score -= 50;
    if (quiz.questions.some(q => !q.explanation)) score -= 10;
    if (quiz.questions.some(q => q.question.length < 10)) score -= 15;
    if (quiz.metadata.topics.length === 0) score -= 5;

    return Math.max(0, score);
  }

  // Utility methods

  private isEducationallyValuable(sentence: string): boolean {
    const lower = sentence.toLowerCase();
    
    // Filter out non-educational content
    if (lower.includes('click here') || lower.includes('subscribe') || lower.includes('advertisement')) {
      return false;
    }
    
    // Look for educational indicators
    return lower.includes('is') || lower.includes('are') || lower.includes('because') || 
           lower.includes('result') || lower.includes('important') || /\d+/.test(sentence);
  }

  private scoreSentenceEducationalValue(sentence: string): number {
    let score = 0;
    const lower = sentence.toLowerCase();

    // Boost for factual indicators
    if (lower.includes('is') || lower.includes('are')) score += 2;
    if (lower.includes('because') || lower.includes('due to')) score += 3;
    if (lower.includes('result') || lower.includes('effect')) score += 3;
    if (lower.includes('important') || lower.includes('significant')) score += 2;
    if (/\d+/.test(sentence)) score += 2;
    if (lower.includes('define') || lower.includes('means')) score += 4;
    
    // Penalize vague language
    if (lower.includes('might') || lower.includes('could')) score -= 1;
    
    return score;
  }

  private isStopWord(word: string): boolean {
    const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'this', 'that', 'these', 'those'];
    return stopWords.includes(word.toLowerCase());
  }

  private distributeQuestionTypes(types: string[], count: number): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    const perType = Math.floor(count / types.length);
    const remainder = count % types.length;

    types.forEach((type, index) => {
      distribution[type] = perType + (index < remainder ? 1 : 0);
    });

    return distribution;
  }

  private selectRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private selectRelevantTopic(statement: string, topics: string[]): string {
    const lowerStatement = statement.toLowerCase();
    
    for (const topic of topics) {
      if (lowerStatement.includes(topic.toLowerCase())) {
        return topic;
      }
    }
    
    return this.selectRandomElement(topics) || 'General Knowledge';
  }

  private calculatePoints(difficulty: 'easy' | 'medium' | 'hard'): number {
    const pointMap = { easy: 1, medium: 2, hard: 3 };
    return pointMap[difficulty];
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}