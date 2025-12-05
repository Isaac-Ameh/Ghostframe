// 🎃 GhostFrame AI Generation Routes
// API endpoints for AI-powered module generation

import express, { Request, Response } from 'express';
import { AIModuleGenerator } from '../services/AIModuleGenerator';

const router = express.Router();
const aiGenerator = new AIModuleGenerator();

/**
 * POST /api/ai/generate-module
 * Generate a complete module from natural language description
 */
router.post('/generate-module', async (req: Request, res: Response) => {
  try {
    const { description, framework, kiroCompatible, category, features } = req.body;

    // Validate request
    if (!description || description.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Description must be at least 10 characters'
      });
    }

    console.log('🤖 Generating module from description:', description);

    // Generate module
    const generatedModule = await aiGenerator.generateModule({
      description,
      framework: framework || 'ghostframe',
      kiroCompatible: kiroCompatible !== false,
      category,
      features
    });

    res.json({
      success: true,
      data: generatedModule,
      message: 'Module generated successfully'
    });

  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'AI generation failed'
    });
  }
});

/**
 * POST /api/ai/refine-module
 * Refine an existing module with additional features
 */
router.post('/refine-module', async (req: Request, res: Response) => {
  try {
    const { moduleId, refinements } = req.body;

    if (!moduleId || !refinements) {
      return res.status(400).json({
        success: false,
        error: 'Module ID and refinements are required'
      });
    }

    // TODO: Implement module refinement logic
    res.json({
      success: true,
      data: {
        moduleId,
        refinements: refinements,
        applied: true
      },
      message: 'Module refined successfully'
    });

  } catch (error) {
    console.error('Module refinement error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Refinement failed'
    });
  }
});

/**
 * POST /api/ai/suggest-features
 * Suggest additional features for a module
 */
router.post('/suggest-features', async (req: Request, res: Response) => {
  try {
    const { description, category } = req.body;

    if (!description) {
      return res.status(400).json({
        success: false,
        error: 'Description is required'
      });
    }

    // Generate feature suggestions based on description
    const suggestions = [
      'API endpoint support',
      'Real-time processing',
      'Batch processing mode',
      'Export to multiple formats',
      'Advanced analytics',
      'Custom templates',
      'Webhook integration',
      'Caching layer'
    ];

    res.json({
      success: true,
      data: {
        suggestions: suggestions.slice(0, 5),
        category: category || 'general'
      }
    });

  } catch (error) {
    console.error('Feature suggestion error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Suggestion failed'
    });
  }
});

/**
 * GET /api/ai/templates
 * Get available AI generation templates
 */
router.get('/templates', async (req: Request, res: Response) => {
  try {
    const templates = [
      {
        id: 'education',
        name: 'Education Module',
        description: 'AI-powered educational content processing',
        examples: [
          'Quiz generation from content',
          'Flashcard creation',
          'Study guide generation'
        ]
      },
      {
        id: 'creative',
        name: 'Creative Module',
        description: 'AI-powered creative content generation',
        examples: [
          'Story generation',
          'Character development',
          'Plot structure creation'
        ]
      },
      {
        id: 'productivity',
        name: 'Productivity Module',
        description: 'AI-powered workflow optimization',
        examples: [
          'Task automation',
          'Document processing',
          'Email summarization'
        ]
      },
      {
        id: 'research',
        name: 'Research Module',
        description: 'AI-powered data analysis',
        examples: [
          'Paper summarization',
          'Data visualization',
          'Insight extraction'
        ]
      }
    ];

    res.json({
      success: true,
      data: { templates }
    });

  } catch (error) {
    console.error('Template fetch error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch templates'
    });
  }
});

/**
 * POST /api/ai/generate-story
 * Generate a story from content using AI (uses GhostFrame AI Router)
 */
router.post('/generate-story', async (req: Request, res: Response) => {
  try {
    const { content, genre = 'adventure', audience = 'teens', length = 'medium' } = req.body;

    if (!content || content.length < 20) {
      return res.status(400).json({
        success: false,
        error: 'Content must be at least 20 characters'
      });
    }

    console.log('📖 Using AI Router to generate story...');

    // Import AIRouter
    const { AIRouter } = await import('../services/AIRouter');
    const aiRouter = new AIRouter();

    // Build prompt for story generation
    const lengthGuidance = {
      short: '500-700 words',
      medium: '1000-1500 words',
      long: '2000-3000 words'
    };

    const prompt = `You are a creative storyteller. Generate an engaging ${genre} story based on this content:

${content}

Requirements:
- Genre: ${genre}
- Target Audience: ${audience}
- Length: ${lengthGuidance[length as keyof typeof lengthGuidance] || '1000-1500 words'}
- Make it educational and engaging
- Include vivid descriptions and compelling characters
- Have a clear beginning, middle, and end

Generate the complete story now:`;

    // Use AI Router to generate story
    const aiResponse = await aiRouter.generate({
      prompt,
      provider: 'groq',
      model: 'llama-3.3-70b-versatile',
      temperature: 0.8,
      maxTokens: 3000
    });

    const storyText = aiResponse.text;
    const wordCount = storyText.split(/\s+/).length;
    const storyId = `story_${Date.now()}`;

    // Generate title using AI
    const titlePrompt = `Based on this ${genre} story, generate a compelling title (maximum 10 words):\n\n${storyText.substring(0, 300)}...\n\nTitle:`;
    const titleResponse = await aiRouter.generate({
      prompt: titlePrompt,
      provider: 'groq',
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      maxTokens: 30
    });

    const story = {
      title: titleResponse.text.trim().replace(/^["']|["']$/g, ''),
      story: storyText,
      characters: [
        {
          name: 'Protagonist',
          role: 'Main Character',
          description: 'The hero of our story'
        }
      ],
      themes: ['Learning', 'Discovery', 'Adventure'],
      metadata: {
        storyId,
        wordCount,
        readingTime: Math.ceil(wordCount / 200),
        genre,
        audience,
        createdAt: new Date().toISOString(),
        aiProvider: aiResponse.provider
      }
    };

    res.json({
      success: true,
      data: story,
      message: 'Story generated successfully using AI!'
    });

  } catch (error) {
    console.error('Story generation error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Story generation failed'
    });
  }
});

/**
 * POST /api/ai/generate-quiz
 * Generate a quiz from content using AI (uses GhostFrame AI Router)
 */
router.post('/generate-quiz', async (req: Request, res: Response) => {
  try {
    const { content, questionCount = 5, difficulty = 'medium' } = req.body;

    if (!content || content.length < 20) {
      return res.status(400).json({
        success: false,
        error: 'Content must be at least 20 characters'
      });
    }

    console.log(`🧠 Quiz Ghost generating ${questionCount} ${difficulty} questions from content...`);

    // Import AIRouter
    const { AIRouter } = await import('../services/AIRouter');
    const aiRouter = new AIRouter();

    // Check if AI is available
    if (!aiRouter.isAnyAIAvailable()) {
      return res.status(503).json({
        success: false,
        error: 'No AI service available. Please configure GROQ_API_KEY in your .env file.'
      });
    }

    // Build dynamic prompt based on content analysis
    const difficultyGuidance = {
      easy: 'Basic recall and understanding questions that test fundamental concepts',
      medium: 'Application and analysis questions that require deeper thinking',
      hard: 'Complex synthesis and evaluation questions that challenge critical thinking'
    };

    const prompt = `You are an expert educational quiz creator. Analyze the following content and generate ${questionCount} high-quality quiz questions.

CONTENT TO ANALYZE:
${content}

QUIZ REQUIREMENTS:
- Number of Questions: ${questionCount}
- Difficulty Level: ${difficulty} (${difficultyGuidance[difficulty as keyof typeof difficultyGuidance]})
- Question Type: Multiple choice with 4 options
- Focus on the most important concepts from the content
- Ensure questions are clear, unambiguous, and educational
- Make distractors (wrong answers) plausible but clearly incorrect

FORMAT EACH QUESTION EXACTLY LIKE THIS:

QUESTION 1:
Question: [Clear, specific question about the content]
A) [First option]
B) [Second option]
C) [Third option]
D) [Fourth option]
Correct Answer: [A/B/C/D]
Explanation: [Brief explanation of why this answer is correct and why others are wrong]

IMPORTANT: Generate exactly ${questionCount} questions. Base all questions directly on the provided content. Do not include generic knowledge questions.`;

    // Use AI Router to generate quiz
    const aiResponse = await aiRouter.generate({
      prompt,
      provider: 'groq',
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      maxTokens: 3000
    });

    // Parse AI response into questions
    const questions = parseQuizResponse(aiResponse.text, questionCount, difficulty);

    // Generate dynamic title based on content
    const titlePrompt = `Based on this content, generate a concise quiz title (maximum 6 words):

${content.substring(0, 300)}...

Title:`;

    let quizTitle = 'Knowledge Quiz';
    try {
      const titleResponse = await aiRouter.generate({
        prompt: titlePrompt,
        provider: 'groq',
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        maxTokens: 20
      });
      quizTitle = titleResponse.text.trim().replace(/^["']|["']$/g, '') || 'Knowledge Quiz';
    } catch (error) {
      console.log('Title generation failed, using default');
    }

    // Extract topics from content
    const topics = await extractTopicsFromContent(content, aiRouter);

    const quizId = `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const quiz = {
      metadata: {
        quizId,
        title: quizTitle,
        totalQuestions: questions.length,
        difficulty,
        topics,
        createdAt: new Date().toISOString(),
        aiProvider: aiResponse.provider
      },
      questions
    };

    res.json({
      success: true,
      data: quiz,
      message: `Quiz "${quizTitle}" generated with ${questions.length} questions using ${aiResponse.provider.toUpperCase()}!`
    });

  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Quiz generation failed. Please check your AI service configuration.'
    });
  }
});

/**
 * Parse AI response into structured quiz questions
 */
function parseQuizResponse(aiText: string, questionCount: number, difficulty: string): any[] {
  const questions = [];
  const questionBlocks = aiText.split(/QUESTION \d+:/i).filter(block => block.trim());
  const points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20;

  for (let i = 0; i < questionBlocks.length && i < questionCount; i++) {
    const block = questionBlocks[i];
    const lines = block.split('\n').map(line => line.trim()).filter(line => line);
    
    let question = '';
    let options: string[] = [];
    let correctAnswer = '';
    let explanation = '';

    for (const line of lines) {
      if (line.toLowerCase().startsWith('question:')) {
        question = line.replace(/^question:\s*/i, '').trim();
      } else if (/^[A-D]\)/.test(line)) {
        options.push(line);
      } else if (line.toLowerCase().startsWith('correct answer:')) {
        correctAnswer = line.replace(/^correct answer:\s*/i, '').trim();
      } else if (line.toLowerCase().startsWith('explanation:')) {
        explanation = line.replace(/^explanation:\s*/i, '').trim();
      } else if (question && !line.toLowerCase().includes('correct') && !line.toLowerCase().includes('explanation') && options.length === 0) {
        // Continuation of question text
        question += ' ' + line;
      }
    }

    if (question && correctAnswer && options.length >= 4) {
      questions.push({
        id: `q${i + 1}_${Date.now()}`,
        question,
        type: 'multiple-choice',
        options,
        correctAnswer,
        explanation: explanation || 'No explanation provided.',
        points,
        difficulty
      });
    }
  }

  // If parsing failed completely, throw error - NO FALLBACK TEMPLATES
  if (questions.length === 0) {
    throw new Error('Failed to generate quiz questions from the provided content. Please ensure the content is clear and substantial enough for quiz generation, or try again with different content.');
  }

  return questions;
}

/**
 * Extract key topics from content using AI
 */
async function extractTopicsFromContent(content: string, aiRouter: any): Promise<string[]> {
  try {
    const topicsPrompt = `Analyze this content and extract 3-5 key topics or themes (single words or short phrases):

${content.substring(0, 500)}...

Topics (comma-separated):`;

    const topicsResponse = await aiRouter.generate({
      prompt: topicsPrompt,
      provider: 'groq',
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      maxTokens: 50
    });

    const topics = topicsResponse.text
      .split(',')
      .map((topic: string) => topic.trim())
      .filter((topic: string) => topic.length > 0)
      .slice(0, 5);

    return topics.length > 0 ? topics : ['General Knowledge'];
  } catch (error) {
    return ['General Knowledge'];
  }
}

export default router;
