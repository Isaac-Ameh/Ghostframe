import express from 'express';
import { Request, Response } from 'express';
import { StoryGenerator, saveGeneratedStory, getGeneratedStory, listGeneratedStories, StoryGenerationRequest } from '../controllers/storyGenerator';

const router = express.Router();

// 📖 KIRO INTEGRATION POINT: AI story generation powered by steering docs
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { 
      contentId, 
      theme = 'adventure', 
      length = 'medium', 
      targetAudience = 'teens',
      customPrompt,
      includeCharacters,
      setting
    } = req.body;

    // Validate request
    if (!contentId) {
      return res.status(400).json({
        success: false,
        error: 'Content ID is required',
        message: '👻 The Story Spirit needs content to weave tales from!'
      });
    }

    const request: StoryGenerationRequest = {
      contentId,
      theme,
      targetAudience,
      length,
      customPrompt,
      includeCharacters,
      setting
    };

    console.log(`📖 Story Spirit weaving tale for content: ${contentId}`);
    console.log(`🎭 Theme: ${theme}, Audience: ${targetAudience}, Length: ${length}`);
    
    // 🎃 KIRO INTEGRATION POINT: Steering docs guide narrative quality and educational value
    const generatedStory = await StoryGenerator.generateStory(request);
    
    // Save the generated story
    saveGeneratedStory(generatedStory);

    res.json({
      success: true,
      data: generatedStory,
      message: `📖 Story conjured successfully! A ${theme} tale awaits.`,
    });
  } catch (error) {
    console.error('💀 Story generation error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate story',
      message: '💀 The Story Spirit encountered an error in the narrative realm',
    });
  }
});

// Get story by ID
router.get('/:storyId', async (req: Request, res: Response) => {
  try {
    const { storyId } = req.params;
    
    const story = getGeneratedStory(storyId);
    
    if (!story) {
      return res.status(404).json({
        success: false,
        error: 'Story not found',
        message: '👻 This story has vanished into the narrative realm'
      });
    }
    
    res.json({
      success: true,
      message: `📚 Story retrieved from the narrative realm`,
      data: story
    });
  } catch (error) {
    console.error('💀 Story retrieval error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve story',
      message: '💀 Error communicating with the Story Spirit'
    });
  }
});

// List all generated stories
router.get('/', async (req: Request, res: Response) => {
  try {
    const stories = listGeneratedStories();
    
    res.json({
      success: true,
      message: `📚 Found ${stories.length} stories in the narrative realm`,
      data: stories.map(story => ({
        storyId: story.metadata.storyId,
        title: story.metadata.title,
        theme: story.metadata.theme,
        targetAudience: story.metadata.targetAudience,
        length: story.metadata.length,
        wordCount: story.metadata.wordCount,
        estimatedReadingTime: story.metadata.estimatedReadingTime,
        createdAt: story.metadata.createdAt
      }))
    });
  } catch (error) {
    console.error('💀 Story listing error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list stories',
      message: '💀 Error accessing the narrative realm'
    });
  }
});

export default router;