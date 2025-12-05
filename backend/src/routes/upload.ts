import express from 'express';
import multer from 'multer';
import { Request, Response } from 'express';
import { ContentProcessor, saveProcessedContent, getProcessedContent } from '../controllers/contentProcessor';

const router = express.Router();

// 📁 KIRO INTEGRATION POINT: Future hooks will auto-process uploads and trigger AI generation
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept PDFs and text files
    const allowedTypes = ['application/pdf', 'text/plain', 'text/markdown'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('👻 Only PDF and text files are allowed in the spirit realm!'));
    }
  },
});

// Upload and process content
router.post('/', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
        message: '👻 The spirits require a file to process!',
      });
    }

    // Extract metadata from request body
    const metadata = {
      title: req.body.title,
      subject: req.body.subject,
      difficulty: req.body.difficulty,
      tags: req.body.tags ? req.body.tags.split(',').map((tag: string) => tag.trim()) : undefined,
    };

    // 🎃 KIRO INTEGRATION POINT: Steering docs will guide content processing quality
    const processedContent = await ContentProcessor.processContent(req.file, metadata);
    
    // Save processed content
    saveProcessedContent(processedContent);

    // 👻 KIRO INTEGRATION POINT: Future hooks will auto-trigger quiz/story/flashcard generation
    res.json({
      success: true,
      data: processedContent,
      message: '📁 Content successfully processed by the spirits!',
    });
  } catch (error) {
    console.error('Upload processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process upload',
      message: '💀 The spirits encountered an error processing your file',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get processed content by ID
router.get('/:contentId', async (req: Request, res: Response) => {
  try {
    const { contentId } = req.params;
    
    const content = getProcessedContent(contentId);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found',
        message: `👻 Content ${contentId} has vanished from the digital realm`,
      });
    }

    res.json({
      success: true,
      message: `📁 Content ${contentId} retrieved from the digital realm`,
      data: content,
    });
  } catch (error) {
    console.error('Content retrieval error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve content',
      message: '💀 The spirits encountered an error retrieving your content',
    });
  }
});

// List all processed content
router.get('/', async (req: Request, res: Response) => {
  try {
    const { listProcessedContent } = await import('../controllers/contentProcessor');
    const contentList = listProcessedContent();
    
    res.json({
      success: true,
      message: `📚 Found ${contentList.length} processed content files in the digital library`,
      data: contentList,
    });
  } catch (error) {
    console.error('Content listing error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list content',
      message: '💀 The spirits encountered an error accessing the digital library',
    });
  }
});

export default router;