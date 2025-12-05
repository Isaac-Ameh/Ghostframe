import express from 'express';
import { Request, Response } from 'express';
import { QuizGenerator, saveGeneratedQuiz, getGeneratedQuiz, listGeneratedQuizzes, QuizGenerationRequest } from '../controllers/quizGenerator';

const router = express.Router();

// 🧠 KIRO INTEGRATION POINT: AI quiz generation powered by steering docs
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { 
      contentId, 
      questionCount = 5, 
      difficulty = 'medium', 
      questionTypes = ['multiple-choice'],
      focusTopics 
    } = req.body;

    // Validate request
    if (!contentId) {
      return res.status(400).json({
        success: false,
        error: 'Content ID is required',
        message: '👻 The Quiz Ghost needs content to work with!'
      });
    }

    const request: QuizGenerationRequest = {
      contentId,
      questionCount: Math.min(Math.max(1, questionCount), 20), // Limit 1-20 questions
      difficulty,
      questionTypes,
      focusTopics
    };

    console.log(`🧠 Quiz Ghost generating quiz for content: ${contentId}`);
    
    // 🎃 KIRO INTEGRATION POINT: Steering docs guide question generation quality
    const generatedQuiz = await QuizGenerator.generateQuiz(request);
    
    // Save the generated quiz
    saveGeneratedQuiz(generatedQuiz);

    res.json({
      success: true,
      data: generatedQuiz,
      message: `🧠 Quiz generated successfully! ${generatedQuiz.questions.length} spooky questions await.`,
    });
  } catch (error) {
    console.error('💀 Quiz generation error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate quiz',
      message: '💀 The Quiz Ghost encountered an error in the spirit realm',
    });
  }
});

// Get quiz by ID
router.get('/:quizId', async (req: Request, res: Response) => {
  try {
    const { quizId } = req.params;
    
    const quiz = getGeneratedQuiz(quizId);
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found',
        message: '👻 This quiz has vanished into the spirit realm'
      });
    }
    
    res.json({
      success: true,
      message: `📚 Quiz retrieved from the spirit realm`,
      data: quiz
    });
  } catch (error) {
    console.error('💀 Quiz retrieval error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve quiz',
      message: '💀 Error communicating with the Quiz Ghost'
    });
  }
});

// List all generated quizzes
router.get('/', async (req: Request, res: Response) => {
  try {
    const quizzes = listGeneratedQuizzes();
    
    res.json({
      success: true,
      message: `📚 Found ${quizzes.length} quizzes in the spirit realm`,
      data: quizzes.map(quiz => ({
        quizId: quiz.metadata.quizId,
        title: quiz.metadata.title,
        totalQuestions: quiz.metadata.totalQuestions,
        difficulty: quiz.metadata.difficulty,
        topics: quiz.metadata.topics,
        createdAt: quiz.metadata.createdAt
      }))
    });
  } catch (error) {
    console.error('💀 Quiz listing error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list quizzes',
      message: '💀 Error accessing the quiz spirit realm'
    });
  }
});

// Submit quiz answers and get results
router.post('/:quizId/submit', async (req: Request, res: Response) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body; // Array of { questionId, answer }
    
    const quiz = getGeneratedQuiz(quizId);
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found',
        message: '👻 This quiz has vanished into the spirit realm'
      });
    }

    // Calculate results
    let correctAnswers = 0;
    let totalPoints = 0;
    const results = quiz.questions.map(question => {
      const userAnswer = answers.find((a: any) => a.questionId === question.id);
      const isCorrect = userAnswer && userAnswer.answer === question.correctAnswer;
      
      if (isCorrect) {
        correctAnswers++;
        totalPoints += question.points;
      }

      return {
        questionId: question.id,
        question: question.question,
        userAnswer: userAnswer?.answer || 'No answer',
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
        points: isCorrect ? question.points : 0
      };
    });

    const percentage = Math.round((correctAnswers / quiz.questions.length) * 100);
    const maxPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);

    res.json({
      success: true,
      message: `🎯 Quiz completed! You scored ${percentage}%`,
      data: {
        quizId,
        score: {
          correct: correctAnswers,
          total: quiz.questions.length,
          percentage,
          points: totalPoints,
          maxPoints
        },
        results,
        completedAt: new Date()
      }
    });
  } catch (error) {
    console.error('💀 Quiz submission error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process quiz submission',
      message: '💀 Error processing your answers'
    });
  }
});

export default router;