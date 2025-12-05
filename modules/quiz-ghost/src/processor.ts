// 🎃 Quiz Ghost - Content Processor
// Processes and analyzes content for quiz generation

import { ProcessedContent } from './types';

export class QuizProcessor {
  /**
   * Process content and extract key information
   */
  async process(content: string): Promise<ProcessedContent> {
    // Clean and normalize content
    const cleaned = this.cleanContent(content);

    // Extract topics
    const topics = this.extractTopics(cleaned);

    // Extract key concepts
    const concepts = this.extractConcepts(cleaned);

    // Calculate metrics
    const wordCount = cleaned.split(/\s+/).length;
    const sentenceCount = cleaned.split(/[.!?]+/).length;

    return {
      originalContent: content,
      cleanedContent: cleaned,
      topics,
      concepts,
      wordCount,
      sentenceCount,
      difficulty: this.assessDifficulty(cleaned),
    };
  }

  /**
   * Clean and normalize content
   */
  private cleanContent(content: string): string {
    return content
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[^\w\s.,!?;:()\-]/g, '') // Remove special chars
      .trim();
  }

  /**
   * Extract main topics from content
   */
  private extractTopics(content: string): string[] {
    // Simple topic extraction based on word frequency
    const words = content.toLowerCase().split(/\s+/);
    const wordFreq = new Map<string, number>();

    // Count word frequency (excluding common words)
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being']);

    words.forEach(word => {
      if (word.length > 4 && !stopWords.has(word)) {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
      }
    });

    // Get top 5 most frequent words as topics
    return Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
  }

  /**
   * Extract key concepts
   */
  private extractConcepts(content: string): string[] {
    // Extract sentences that might contain key concepts
    const sentences = content.split(/[.!?]+/);
    
    // Look for sentences with keywords like "is", "means", "refers to"
    const conceptSentences = sentences.filter(s => 
      /\b(is|means|refers to|defined as|known as)\b/i.test(s)
    );

    return conceptSentences.slice(0, 10).map(s => s.trim());
  }

  /**
   * Assess content difficulty
   */
  private assessDifficulty(content: string): 'easy' | 'medium' | 'hard' {
    const words = content.split(/\s+/);
    const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;

    if (avgWordLength < 5) return 'easy';
    if (avgWordLength < 7) return 'medium';
    return 'hard';
  }
}
