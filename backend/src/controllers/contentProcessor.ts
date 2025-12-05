import * as pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';
import * as cheerio from 'cheerio';

// 🎃 KIRO INTEGRATION POINT: Future steering docs will enhance content processing quality

export interface ContentMetadata {
  title?: string;
  subject?: string;
  difficulty?: string;
  tags?: string[];
}

export interface ProcessedContent {
  contentId: string;
  originalFilename: string;
  processedText: string;
  keyTopics: string[];
  wordCount: number;
  uploadedAt: Date;
  metadata: ContentMetadata;
  summary: string;
  learningObjectives: string[];
  readabilityScore: {
    difficulty: string;
    avgWordLength: number;
    avgSentenceLength: number;
    estimatedReadingTime: number;
  };
}

export class ContentProcessor {
  
  /**
   * Extract text content from uploaded file buffer
   * 👻 Now supports PDF, Word, HTML, and text files
   */
  static async extractText(file: Express.Multer.File): Promise<string> {
    try {
      // Handle text files
      if (file.mimetype === 'text/plain' || file.mimetype === 'text/markdown') {
        return file.buffer.toString('utf-8');
      }
      
      // Handle PDF files
      if (file.mimetype === 'application/pdf') {
        const pdfData = await pdfParse(file.buffer);
        return pdfData.text;
      }
      
      // Handle Word documents
      if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        return result.value;
      }
      
      // Handle HTML files
      if (file.mimetype === 'text/html') {
        const $ = cheerio.load(file.buffer.toString('utf-8'));
        // Remove script and style elements
        $('script, style').remove();
        return $.text();
      }
      
      // Handle JSON files (for structured data)
      if (file.mimetype === 'application/json') {
        const jsonData = JSON.parse(file.buffer.toString('utf-8'));
        return JSON.stringify(jsonData, null, 2);
      }
      
      // Fallback for other text-based files
      if (file.mimetype.startsWith('text/')) {
        return file.buffer.toString('utf-8');
      }
      
      throw new Error(`Unsupported file type: ${file.mimetype}`);
    } catch (error) {
      console.error(`💀 Error extracting text from ${file.originalname}:`, error);
      throw new Error(`Failed to extract text from ${file.originalname}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Clean and normalize extracted text
   */
  static cleanText(rawText: string): string {
    return rawText
      // Remove excessive whitespace
      .replace(/\s+/g, ' ')
      // Remove special characters that might interfere with AI processing
      .replace(/[^\w\s.,!?;:()\-"']/g, '')
      // Normalize line breaks
      .replace(/\n+/g, '\n')
      // Trim whitespace
      .trim();
  }

  /**
   * Extract key topics from processed text
   * 👻 Enhanced keyword extraction with better NLP techniques
   */
  static extractKeyTopics(text: string): string[] {
    // Enhanced stop words list
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
      'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
      'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
      'from', 'up', 'out', 'down', 'off', 'over', 'under', 'again', 'further',
      'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all',
      'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
      'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very'
    ]);

    // Extract sentences for context
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    // Extract potential multi-word phrases (2-3 words)
    const phrases = new Map<string, number>();
    sentences.forEach(sentence => {
      const words = sentence.toLowerCase().trim().split(/\s+/);
      
      // Extract 2-word phrases
      for (let i = 0; i < words.length - 1; i++) {
        const word1 = words[i].replace(/[^\w]/g, '');
        const word2 = words[i + 1].replace(/[^\w]/g, '');
        
        if (word1.length > 2 && word2.length > 2 && 
            !stopWords.has(word1) && !stopWords.has(word2)) {
          const phrase = `${word1.charAt(0).toUpperCase() + word1.slice(1)} ${word2.charAt(0).toUpperCase() + word2.slice(1)}`;
          phrases.set(phrase, (phrases.get(phrase) || 0) + 1);
        }
      }
      
      // Extract 3-word phrases for important concepts
      for (let i = 0; i < words.length - 2; i++) {
        const word1 = words[i].replace(/[^\w]/g, '');
        const word2 = words[i + 1].replace(/[^\w]/g, '');
        const word3 = words[i + 2].replace(/[^\w]/g, '');
        
        if (word1.length > 2 && word2.length > 2 && word3.length > 2 &&
            !stopWords.has(word1) && !stopWords.has(word2) && !stopWords.has(word3)) {
          const phrase = `${word1.charAt(0).toUpperCase() + word1.slice(1)} ${word2.charAt(0).toUpperCase() + word2.slice(1)} ${word3.charAt(0).toUpperCase() + word3.slice(1)}`;
          phrases.set(phrase, (phrases.get(phrase) || 0) + 1);
        }
      }
    });

    // Single word extraction with better filtering
    const words = text.toLowerCase().split(/\s+/);
    const wordCount = new Map<string, number>();
    
    words.forEach(word => {
      const cleaned = word.replace(/[^\w]/g, '');
      if (cleaned.length > 4 && !stopWords.has(cleaned)) {
        // Boost score for capitalized words (likely proper nouns/important terms)
        const boost = /^[A-Z]/.test(word) ? 2 : 1;
        wordCount.set(cleaned, (wordCount.get(cleaned) || 0) + boost);
      }
    });

    // Combine phrases and words, prioritizing phrases
    const allTopics = new Map<string, number>();
    
    // Add phrases with higher weight
    phrases.forEach((count, phrase) => {
      if (count >= 2) { // Only include phrases that appear multiple times
        allTopics.set(phrase, count * 3); // Boost phrase scores
      }
    });
    
    // Add single words
    wordCount.forEach((count, word) => {
      const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
      if (!Array.from(allTopics.keys()).some(topic => topic.includes(capitalizedWord))) {
        allTopics.set(capitalizedWord, count);
      }
    });

    // Get top topics
    const sortedTopics = Array.from(allTopics.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([topic]) => topic);

    // 🎃 KIRO INTEGRATION POINT: Advanced topic extraction will use AI services
    return sortedTopics.length > 0 ? sortedTopics : ['General Knowledge', 'Learning Material', 'Educational Content'];
  }

  /**
   * Count words in processed text
   */
  static countWords(text: string): number {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Determine content difficulty based on text analysis
   * 👻 Enhanced readability analysis with multiple metrics
   */
  static analyzeDifficulty(text: string): string {
    const wordCount = this.countWords(text);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentenceCount = sentences.length;
    
    if (wordCount === 0 || sentenceCount === 0) {
      return 'beginner';
    }

    // Calculate various readability metrics
    const avgWordLength = text.replace(/\s+/g, '').length / wordCount;
    const avgSentenceLength = wordCount / sentenceCount;
    
    // Count syllables (approximation)
    const syllableCount = text.toLowerCase()
      .replace(/[^a-z]/g, '')
      .replace(/[aeiou]+/g, 'a')
      .length;
    const avgSyllablesPerWord = syllableCount / wordCount;
    
    // Count complex words (3+ syllables, approximation)
    const words = text.toLowerCase().split(/\s+/);
    const complexWords = words.filter(word => {
      const syllables = word.replace(/[^aeiou]/g, '').length;
      return syllables >= 3 && word.length > 6;
    }).length;
    const complexWordRatio = complexWords / wordCount;
    
    // Flesch Reading Ease approximation
    const fleschScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
    
    // Combine multiple factors for difficulty assessment
    let difficultyScore = 0;
    
    // Word length factor
    if (avgWordLength > 6) difficultyScore += 2;
    else if (avgWordLength > 5) difficultyScore += 1;
    
    // Sentence length factor
    if (avgSentenceLength > 25) difficultyScore += 2;
    else if (avgSentenceLength > 18) difficultyScore += 1;
    
    // Complex word ratio factor
    if (complexWordRatio > 0.15) difficultyScore += 2;
    else if (complexWordRatio > 0.08) difficultyScore += 1;
    
    // Flesch score factor
    if (fleschScore < 30) difficultyScore += 2;
    else if (fleschScore < 60) difficultyScore += 1;
    
    // Determine final difficulty
    if (difficultyScore >= 5) {
      return 'advanced';
    } else if (difficultyScore >= 3) {
      return 'intermediate';
    } else {
      return 'beginner';
    }
  }

  /**
   * Detect subject/domain based on content analysis
   * 👻 Enhanced subject detection using keyword patterns
   */
  static detectSubject(text: string, topics: string[]): string {
    const lowerText = text.toLowerCase();
    const lowerTopics = topics.map(t => t.toLowerCase());
    
    // Subject keyword patterns
    const subjectPatterns = {
      'Mathematics': ['math', 'equation', 'formula', 'calculate', 'algebra', 'geometry', 'calculus', 'statistics', 'probability', 'theorem', 'proof', 'number', 'function'],
      'Science': ['experiment', 'hypothesis', 'theory', 'research', 'analysis', 'data', 'observation', 'method', 'result', 'conclusion', 'biology', 'chemistry', 'physics'],
      'History': ['century', 'war', 'empire', 'civilization', 'ancient', 'medieval', 'revolution', 'historical', 'timeline', 'era', 'dynasty', 'culture'],
      'Literature': ['author', 'novel', 'poem', 'character', 'plot', 'theme', 'narrative', 'literary', 'writing', 'story', 'book', 'text', 'analysis'],
      'Computer Science': ['algorithm', 'programming', 'software', 'computer', 'code', 'data structure', 'database', 'network', 'system', 'technology', 'digital'],
      'Business': ['market', 'company', 'management', 'strategy', 'finance', 'economics', 'business', 'organization', 'leadership', 'profit', 'customer'],
      'Psychology': ['behavior', 'mind', 'cognitive', 'psychology', 'mental', 'emotion', 'personality', 'development', 'learning', 'memory', 'brain'],
      'Medicine': ['medical', 'health', 'disease', 'treatment', 'patient', 'diagnosis', 'therapy', 'clinical', 'medicine', 'healthcare', 'symptom'],
      'Language': ['language', 'grammar', 'vocabulary', 'pronunciation', 'communication', 'linguistic', 'word', 'sentence', 'meaning', 'translation'],
      'Art': ['art', 'painting', 'sculpture', 'design', 'creative', 'visual', 'aesthetic', 'artist', 'gallery', 'museum', 'style', 'technique']
    };
    
    let bestMatch = 'General';
    let highestScore = 0;
    
    Object.entries(subjectPatterns).forEach(([subject, keywords]) => {
      let score = 0;
      
      // Check keywords in text
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = (lowerText.match(regex) || []).length;
        score += matches;
      });
      
      // Check keywords in topics
      lowerTopics.forEach(topic => {
        keywords.forEach(keyword => {
          if (topic.includes(keyword)) {
            score += 3; // Higher weight for topic matches
          }
        });
      });
      
      if (score > highestScore) {
        highestScore = score;
        bestMatch = subject;
      }
    });
    
    return bestMatch;
  }

  /**
   * Generate content summary for preview
   */
  static generateSummary(text: string, maxLength: number = 200): string {
    if (text.length <= maxLength) {
      return text;
    }

    // Find the last complete sentence within the limit
    const truncated = text.substring(0, maxLength);
    const lastSentenceEnd = Math.max(
      truncated.lastIndexOf('.'),
      truncated.lastIndexOf('!'),
      truncated.lastIndexOf('?')
    );

    if (lastSentenceEnd > maxLength * 0.7) {
      return truncated.substring(0, lastSentenceEnd + 1);
    }

    // If no good sentence break, truncate at word boundary
    const lastSpace = truncated.lastIndexOf(' ');
    return truncated.substring(0, lastSpace) + '...';
  }

  /**
   * Extract educational objectives from content
   * 👻 Identifies learning goals and key concepts
   */
  static extractLearningObjectives(text: string): string[] {
    const objectives: string[] = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    
    // Look for objective-indicating phrases
    const objectivePatterns = [
      /understand\s+(.{10,60})/gi,
      /learn\s+(.{10,60})/gi,
      /explain\s+(.{10,60})/gi,
      /describe\s+(.{10,60})/gi,
      /analyze\s+(.{10,60})/gi,
      /identify\s+(.{10,60})/gi,
      /demonstrate\s+(.{10,60})/gi,
      /apply\s+(.{10,60})/gi,
      /evaluate\s+(.{10,60})/gi,
      /compare\s+(.{10,60})/gi
    ];
    
    sentences.forEach(sentence => {
      objectivePatterns.forEach(pattern => {
        const matches = sentence.match(pattern);
        if (matches) {
          matches.forEach(match => {
            const objective = match.trim().replace(/^(understand|learn|explain|describe|analyze|identify|demonstrate|apply|evaluate|compare)\s+/i, '');
            if (objective.length > 10 && objective.length < 100) {
              objectives.push(objective.charAt(0).toUpperCase() + objective.slice(1));
            }
          });
        }
      });
    });
    
    return objectives.slice(0, 5); // Limit to top 5 objectives
  }

  /**
   * Main processing function
   */
  static async processContent(
    file: Express.Multer.File, 
    metadata: Partial<ContentMetadata> = {}
  ): Promise<ProcessedContent> {
    try {
      // Extract and clean text
      const rawText = await this.extractText(file);
      const processedText = this.cleanText(rawText);

      // Analyze content
      const keyTopics = this.extractKeyTopics(processedText);
      const wordCount = this.countWords(processedText);
      const difficulty = this.analyzeDifficulty(processedText);
      const detectedSubject = this.detectSubject(processedText, keyTopics);
      const learningObjectives = this.extractLearningObjectives(processedText);
      const summary = this.generateSummary(processedText);

      // Generate unique content ID
      const contentId = `content_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      // Prepare final metadata
      const finalMetadata: ContentMetadata = {
        title: metadata.title || file.originalname.replace(/\.[^/.]+$/, ''),
        subject: metadata.subject || detectedSubject,
        difficulty: metadata.difficulty || difficulty,
        tags: metadata.tags || keyTopics.slice(0, 8),
      };

      // Calculate reading time (average 200 words per minute)
      const estimatedReadingTime = Math.ceil(wordCount / 200);
      
      const result: ProcessedContent = {
        contentId,
        originalFilename: file.originalname,
        processedText,
        keyTopics,
        wordCount,
        uploadedAt: new Date(),
        metadata: finalMetadata,
        summary,
        learningObjectives,
        readabilityScore: {
          difficulty,
          avgWordLength: processedText.replace(/\s+/g, '').length / wordCount,
          avgSentenceLength: wordCount / (processedText.split(/[.!?]+/).length || 1),
          estimatedReadingTime
        }
      };

      // 🎃 KIRO INTEGRATION POINT: Future hooks will auto-trigger AI generation here
      console.log(`👻 Content processed successfully: ${contentId}`);
      console.log(`📊 Stats: ${wordCount} words, ${keyTopics.length} topics, ${difficulty} difficulty`);
      console.log(`📚 Subject: ${detectedSubject}, Reading time: ${estimatedReadingTime} min`);
      console.log(`🎯 Learning objectives: ${learningObjectives.length} identified`);

      return result;
    } catch (error) {
      console.error('💀 Content processing error:', error);
      throw new Error('Failed to process content: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }
}

// 👻 In-memory storage for demo purposes
// 🎃 KIRO INTEGRATION POINT: Future implementation will use proper database
export const contentStorage = new Map<string, ProcessedContent>();

export const saveProcessedContent = (content: ProcessedContent): void => {
  contentStorage.set(content.contentId, content);
  console.log(`💾 Content saved: ${content.contentId}`);
};

export const getProcessedContent = (contentId: string): ProcessedContent | null => {
  return contentStorage.get(contentId) || null;
};

export const listProcessedContent = (): ProcessedContent[] => {
  return Array.from(contentStorage.values());
};