import { getProcessedContent } from './contentProcessor';
import { AIRouter } from '../services/AIRouter';

// 🎃 Quiz Generator using GhostFrame AI Router

export type QuizDifficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer';

export interface QuizGenerationRequest {
  contentId: string;
  questionCount: number;
  difficulty: QuizDifficulty;
  questionTypes: QuestionType[];
  focusTopics?: string[];
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // For multiple-choice
  correctAnswer: string;
  explanation: string;
  points: number;
  difficulty: QuizDifficulty;
}

export interface GeneratedQuiz {
  metadata: {
    quizId: string;
    contentId: string;
    title: string;
    totalQuestions: number;
    difficulty: QuizDifficulty;
    topics: string[];
    createdAt: Date;
  };
  questions: QuizQuestion[];
}

export class QuizGenerator {
  private static aiRouter = new AIRouter();

  /**
   * Generate AI-powered quiz from processed content
   * Uses GhostFrame's AI Router for actual AI generation
   */
  static async generateQuiz(request: QuizGenerationRequest): Promise<GeneratedQuiz> {
    const content = getProcessedContent(request.contentId);
    if (!content) {
      throw new Error(`Content not found: ${request.contentId}`);
    }

    console.log(`🧠 Quiz Ghost using AI to generate ${request.questionCount} questions`);

    // Build AI prompt for quiz generation
    const prompt = this.buildQuizPrompt(content.processedText, request);

    // Use AI Router to generate quiz
    const aiResponse = await this.aiRouter.generate({
      prompt,
      provider: 'groq',
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      maxTokens: 3000
    });

    // Parse AI response into structured quiz
    const questions = this.parseQuizResponse(aiResponse.text, request);

    const quizId = `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    return {
      metadata: {
        quizId,
        contentId: request.contentId,
        title: await this.generateQuizTitle(content.processedText),
        totalQuestions: questions.length,
        difficulty: request.difficulty,
        topics: content.keyTopics.slice(0, 5),
        createdAt: new Date()
      },
      questions
    };
  }

  /**
   * Build comprehensive prompt for AI quiz generation
   */
  private static buildQuizPrompt(contentText: string, request: QuizGenerationRequest): string {
    const difficultyGuidance = {
      easy: 'Basic recall and understanding questions',
      medium: 'Application and analysis questions',
      hard: 'Complex synthesis and evaluation questions'
    };

    let prompt = `You are an expert quiz creator. Generate ${request.questionCount} high-quality quiz questions based on the following content.

**Quiz Requirements:**
- Number of Questions: ${request.questionCount}
- Difficulty Level: ${request.difficulty} (${difficultyGuidance[request.difficulty]})
- Question Types: ${request.questionTypes.join(', ')}

**Source Content:**
${contentText.substring(0, 3000)}

**Instructions:**
1. Create ${request.questionCount} questions that test understanding of the content
2. Each question should be clear, unambiguous, and educational
3. For multiple-choice questions, provide 4 options (A, B, C, D)
4. Include the correct answer
5. Provide a brief explanation for each answer
6. Ensure questions are appropriate for ${request.difficulty} difficulty level`;

    if (request.focusTopics && request.focusTopics.length > 0) {
      prompt += `\n7. Focus on these topics: ${request.focusTopics.join(', ')}`;
    }

    prompt += `\n\n**Format each question exactly like this:**

QUESTION 1:
Type: multiple-choice
Question: [Your question here]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
Correct Answer: [A/B/C/D]
Explanation: [Why this is correct]

QUESTION 2:
Type: true-false
Question: [Your question here]
Correct Answer: [True/False]
Explanation: [Why this is correct]

**Generate all ${request.questionCount} questions now:**`;

    return prompt;
  }

  /**
   * Parse AI response into structured quiz questions
   */
  private static parseQuizResponse(aiText: string, request: QuizGenerationRequest): QuizQuestion[] {
    const questions: QuizQuestion[] = [];
    const questionBlocks = aiText.split(/QUESTION \d+:/i).filter(block => block.trim());

    for (let i = 0; i < questionBlocks.length && i < request.questionCount; i++) {
      const block = questionBlocks[i];
      
      try {
        const question = this.parseQuestionBlock(block, i, request.difficulty);
        if (question) {
          questions.push(question);
        }
      } catch (error) {
        console.error(`Error parsing question ${i + 1}:`, error);
      }
    }

    // If parsing failed, generate fallback questions
    if (questions.length === 0) {
      return this.generateFallbackQuestions(request);
    }

    return questions;
  }

  /**
   * Parse individual question block
   */
  private static parseQuestionBlock(block: string, index: number, difficulty: QuizDifficulty): QuizQuestion | null {
    const lines = block.split('\n').map(line => line.trim()).filter(line => line);
    
    let type: QuestionType = 'multiple-choice';
    let question = '';
    let options: string[] = [];
    let correctAnswer = '';
    let explanation = '';

    for (const line of lines) {
      if (line.toLowerCase().startsWith('type:')) {
        const typeMatch = line.match(/type:\s*(.+)/i);
        if (typeMatch) {
          const typeStr = typeMatch[1].trim().toLowerCase();
          if (typeStr.includes('multiple') || typeStr.includes('choice')) {
            type = 'multiple-choice';
          } else if (typeStr.includes('true') || typeStr.includes('false')) {
            type = 'true-false';
          } else if (typeStr.includes('short')) {
            type = 'short-answer';
          }
        }
      } else if (line.toLowerCase().startsWith('question:')) {
        question = line.replace(/^question:\s*/i, '').trim();
      } else if (/^[A-D]\)/.test(line)) {
        options.push(line);
      } else if (line.toLowerCase().startsWith('correct answer:')) {
        correctAnswer = line.replace(/^correct answer:\s*/i, '').trim();
      } else if (line.toLowerCase().startsWith('explanation:')) {
        explanation = line.replace(/^explanation:\s*/i, '').trim();
      } else if (question && !line.toLowerCase().includes('type:') && !line.toLowerCase().includes('correct') && !line.toLowerCase().includes('explanation')) {
        // Continuation of question
        if (!options.length && !correctAnswer) {
          question += ' ' + line;
        }
      }
    }

    if (!question || !correctAnswer) {
      return null;
    }

    const points = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;

    return {
      id: `q${index + 1}_${Date.now()}`,
      type,
      question,
      options: options.length > 0 ? options : undefined,
      correctAnswer,
      explanation: explanation || 'No explanation provided.',
      points,
      difficulty
    };
  }

  /**
   * Generate fallback questions if AI parsing fails
   * REMOVED - No hardcoded templates, only AI-generated content
   */
  private static generateFallbackQuestions(request: QuizGenerationRequest): QuizQuestion[] {
    throw new Error('AI quiz generation failed. Please check your content and try again. Ensure the Groq API key is properly configured in the .env file.');
  }

  /**
   * Generate quiz title using AI
   */
  private static async generateQuizTitle(contentText: string): Promise<string> {
    const prompt = `Based on this content, generate a short quiz title (maximum 8 words):

${contentText.substring(0, 300)}...

Title:`;

    try {
      const response = await this.aiRouter.generate({
        prompt,
        provider: 'groq',
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        maxTokens: 30
      });

      return response.text.trim().replace(/^["']|["']$/g, '');
    } catch (error) {
      return 'Knowledge Quiz';
    }
  }
}

// In-memory storage for demo
export const quizStorage = new Map<string, GeneratedQuiz>();

export const saveGeneratedQuiz = (quiz: GeneratedQuiz): void => {
  quizStorage.set(quiz.metadata.quizId, quiz);
  console.log(`💾 Quiz saved: ${quiz.metadata.quizId}`);
};

export const getGeneratedQuiz = (quizId: string): GeneratedQuiz | null => {
  return quizStorage.get(quizId) || null;
};

export const listGeneratedQuizzes = (): GeneratedQuiz[] => {
  return Array.from(quizStorage.values());
};
