// 🤖 GhostFrame AI Gateway
// Unified interface for multiple AI providers with fallback and streaming support

import { EventEmitter } from 'events';

export interface AIProvider {
  name: string;
  models: string[];
  apiKey?: string;
  baseUrl?: string;
  rateLimit: {
    requestsPerMinute: number;
    tokensPerMinute: number;
  };
  pricing: {
    inputTokens: number; // per 1K tokens
    outputTokens: number; // per 1K tokens
  };
}

export interface AIRequest {
  model: string;
  prompt: string;
  options?: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    stream?: boolean;
    systemPrompt?: string;
    context?: any;
  };
  metadata?: {
    userId?: string;
    moduleId?: string;
    requestId?: string;
  };
}

export interface AIResponse {
  content: string;
  model: string;
  provider: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    cost: number;
  };
  metadata: {
    requestId: string;
    processingTime: number;
    quality: number;
    cached: boolean;
  };
}

export interface StreamChunk {
  content: string;
  delta: string;
  finished: boolean;
  metadata?: {
    tokens: number;
    model: string;
  };
}

export class AIGateway extends EventEmitter {
  private providers: Map<string, AIProvider>;
  private rateLimits: Map<string, { requests: number; tokens: number; resetTime: number }>;
  private circuitBreakers: Map<string, { failures: number; lastFailure: number; isOpen: boolean }>;
  private cache: Map<string, { response: AIResponse; timestamp: number; ttl: number }>;
  private fallbackChain: string[];

  constructor() {
    super();
    this.providers = new Map();
    this.rateLimits = new Map();
    this.circuitBreakers = new Map();
    this.cache = new Map();
    this.fallbackChain = ['gpt-4', 'claude-3', 'gpt-3.5-turbo', 'gemini-pro'];
    
    this.initializeProviders();
    this.startCleanupTasks();
  }

  /**
   * Process AI request with automatic fallback
   */
  async process(request: AIRequest): Promise<AIResponse> {
    const requestId = request.metadata?.requestId || this.generateRequestId();
    const startTime = Date.now();

    // Check cache first
    const cacheKey = this.generateCacheKey(request);
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      this.emit('cache:hit', { requestId, model: request.model });
      return {
        ...cached.response,
        metadata: { ...cached.response.metadata, cached: true }
      };
    }

    // Try primary model first, then fallbacks
    const modelsToTry = this.getModelFallbackChain(request.model);
    let lastError: Error | null = null;

    for (const model of modelsToTry) {
      try {
        const provider = this.getProviderForModel(model);
        if (!provider) continue;

        // Check circuit breaker
        if (this.isCircuitBreakerOpen(provider.name)) {
          console.warn(`Circuit breaker open for ${provider.name}, skipping`);
          continue;
        }

        // Check rate limits
        if (!this.checkRateLimit(provider.name, request)) {
          console.warn(`Rate limit exceeded for ${provider.name}, skipping`);
          continue;
        }

        // Make the request
        const response = await this.makeRequest(provider, { ...request, model }, requestId);
        
        // Reset circuit breaker on success
        this.resetCircuitBreaker(provider.name);
        
        // Cache the response
        this.cacheResponse(cacheKey, response, 300000); // 5 minutes TTL
        
        // Update rate limits
        this.updateRateLimit(provider.name, response.usage.totalTokens);
        
        this.emit('request:success', { 
          requestId, 
          model, 
          provider: provider.name,
          processingTime: Date.now() - startTime 
        });

        return response;

      } catch (error) {
        lastError = error as Error;
        const provider = this.getProviderForModel(model);
        if (provider) {
          this.recordFailure(provider.name);
        }
        
        this.emit('request:error', { 
          requestId, 
          model, 
          error: lastError.message 
        });
        
        console.error(`AI request failed for ${model}:`, lastError.message);
      }
    }

    // All models failed
    throw new Error(`All AI models failed. Last error: ${lastError?.message}`);
  }

  /**
   * Stream AI response with real-time updates
   */
  async *stream(request: AIRequest): AsyncGenerator<StreamChunk> {
    const requestId = request.metadata?.requestId || this.generateRequestId();
    const modelsToTry = this.getModelFallbackChain(request.model);

    for (const model of modelsToTry) {
      try {
        const provider = this.getProviderForModel(model);
        if (!provider || this.isCircuitBreakerOpen(provider.name)) {
          continue;
        }

        yield* this.streamRequest(provider, { ...request, model }, requestId);
        return; // Success, exit the loop

      } catch (error) {
        console.error(`Streaming failed for ${model}:`, (error as Error).message);
        const provider = this.getProviderForModel(model);
        if (provider) {
          this.recordFailure(provider.name);
        }
      }
    }

    throw new Error('All streaming models failed');
  }

  /**
   * Get available models
   */
  getAvailableModels(): { model: string; provider: string; available: boolean }[] {
    const models: { model: string; provider: string; available: boolean }[] = [];
    
    for (const [providerName, provider] of this.providers) {
      for (const model of provider.models) {
        models.push({
          model,
          provider: providerName,
          available: !this.isCircuitBreakerOpen(providerName)
        });
      }
    }
    
    return models;
  }

  /**
   * Get provider statistics
   */
  getProviderStats(): Record<string, any> {
    const stats: Record<string, any> = {};
    
    for (const [name, provider] of this.providers) {
      const rateLimit = this.rateLimits.get(name);
      const circuitBreaker = this.circuitBreakers.get(name);
      
      stats[name] = {
        models: provider.models,
        rateLimit: {
          requests: rateLimit?.requests || 0,
          tokens: rateLimit?.tokens || 0,
          resetTime: rateLimit?.resetTime || 0
        },
        circuitBreaker: {
          failures: circuitBreaker?.failures || 0,
          isOpen: circuitBreaker?.isOpen || false,
          lastFailure: circuitBreaker?.lastFailure || 0
        },
        pricing: provider.pricing
      };
    }
    
    return stats;
  }

  // Private methods

  private initializeProviders(): void {
    // OpenAI
    this.providers.set('openai', {
      name: 'openai',
      models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
      apiKey: process.env.OPENAI_API_KEY,
      baseUrl: 'https://api.openai.com/v1',
      rateLimit: {
        requestsPerMinute: 500,
        tokensPerMinute: 150000
      },
      pricing: {
        inputTokens: 0.03, // per 1K tokens
        outputTokens: 0.06
      }
    });

    // Anthropic
    this.providers.set('anthropic', {
      name: 'anthropic',
      models: ['claude-3', 'claude-3-sonnet', 'claude-3-haiku'],
      apiKey: process.env.ANTHROPIC_API_KEY,
      baseUrl: 'https://api.anthropic.com/v1',
      rateLimit: {
        requestsPerMinute: 300,
        tokensPerMinute: 100000
      },
      pricing: {
        inputTokens: 0.025,
        outputTokens: 0.075
      }
    });

    // Google
    this.providers.set('google', {
      name: 'google',
      models: ['gemini-pro', 'gemini-pro-vision'],
      apiKey: process.env.GOOGLE_API_KEY,
      baseUrl: 'https://generativelanguage.googleapis.com/v1',
      rateLimit: {
        requestsPerMinute: 200,
        tokensPerMinute: 80000
      },
      pricing: {
        inputTokens: 0.0005,
        outputTokens: 0.0015
      }
    });

    // Mistral
    this.providers.set('mistral', {
      name: 'mistral',
      models: ['mistral-large', 'mistral-medium', 'mistral-small'],
      apiKey: process.env.MISTRAL_API_KEY,
      baseUrl: 'https://api.mistral.ai/v1',
      rateLimit: {
        requestsPerMinute: 100,
        tokensPerMinute: 50000
      },
      pricing: {
        inputTokens: 0.008,
        outputTokens: 0.024
      }
    });

    console.log(`🤖 AI Gateway initialized with ${this.providers.size} providers`);
  }

  private getProviderForModel(model: string): AIProvider | undefined {
    for (const provider of this.providers.values()) {
      if (provider.models.includes(model)) {
        return provider;
      }
    }
    return undefined;
  }

  private getModelFallbackChain(primaryModel: string): string[] {
    const chain = [primaryModel];
    
    // Add fallbacks that aren't the primary model
    for (const fallback of this.fallbackChain) {
      if (fallback !== primaryModel && !chain.includes(fallback)) {
        chain.push(fallback);
      }
    }
    
    return chain;
  }

  private async makeRequest(provider: AIProvider, request: AIRequest, requestId: string): Promise<AIResponse> {
    const startTime = Date.now();
    
    // Simulate API call (in real implementation, this would make actual HTTP requests)
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    
    // Simulate response
    const inputTokens = Math.floor(request.prompt.length / 4); // Rough estimate
    const outputTokens = Math.floor(Math.random() * 500 + 100);
    const totalTokens = inputTokens + outputTokens;
    const cost = (inputTokens * provider.pricing.inputTokens + outputTokens * provider.pricing.outputTokens) / 1000;
    
    const response: AIResponse = {
      content: this.generateMockResponse(request),
      model: request.model,
      provider: provider.name,
      usage: {
        inputTokens,
        outputTokens,
        totalTokens,
        cost
      },
      metadata: {
        requestId,
        processingTime: Date.now() - startTime,
        quality: Math.random() * 0.3 + 0.7, // 0.7-1.0
        cached: false
      }
    };

    return response;
  }

  private async *streamRequest(provider: AIProvider, request: AIRequest, requestId: string): AsyncGenerator<StreamChunk> {
    const mockResponse = this.generateMockResponse(request);
    const words = mockResponse.split(' ');
    let content = '';
    
    for (let i = 0; i < words.length; i++) {
      const delta = (i === 0 ? '' : ' ') + words[i];
      content += delta;
      
      yield {
        content,
        delta,
        finished: i === words.length - 1,
        metadata: {
          tokens: Math.floor(content.length / 4),
          model: request.model
        }
      };
      
      // Simulate streaming delay
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
    }
  }

  private generateMockResponse(request: AIRequest): string {
    // Generate contextual mock responses based on the prompt
    const prompt = request.prompt.toLowerCase();
    
    if (prompt.includes('quiz') || prompt.includes('question')) {
      return 'Here are some educational questions based on your content: 1. What is the main concept? 2. How does this apply in practice? 3. What are the key benefits?';
    } else if (prompt.includes('story') || prompt.includes('narrative')) {
      return 'Once upon a time, in a world where AI and creativity merged, there lived a character who discovered the power of storytelling through technology...';
    } else if (prompt.includes('analyze') || prompt.includes('research')) {
      return 'Based on the analysis, the key findings indicate several important trends and patterns that suggest significant opportunities for improvement...';
    } else {
      return 'This is a comprehensive response generated by the AI model, addressing your request with detailed information and actionable insights.';
    }
  }

  private checkRateLimit(providerName: string, request: AIRequest): boolean {
    const provider = this.providers.get(providerName);
    if (!provider) return false;

    const now = Date.now();
    const rateLimit = this.rateLimits.get(providerName);
    
    if (!rateLimit || now > rateLimit.resetTime) {
      // Reset rate limit window
      this.rateLimits.set(providerName, {
        requests: 1,
        tokens: this.estimateTokens(request.prompt),
        resetTime: now + 60000 // 1 minute
      });
      return true;
    }

    const estimatedTokens = this.estimateTokens(request.prompt);
    
    return (
      rateLimit.requests < provider.rateLimit.requestsPerMinute &&
      rateLimit.tokens + estimatedTokens < provider.rateLimit.tokensPerMinute
    );
  }

  private updateRateLimit(providerName: string, tokensUsed: number): void {
    const rateLimit = this.rateLimits.get(providerName);
    if (rateLimit) {
      rateLimit.requests += 1;
      rateLimit.tokens += tokensUsed;
    }
  }

  private isCircuitBreakerOpen(providerName: string): boolean {
    const breaker = this.circuitBreakers.get(providerName);
    if (!breaker) return false;

    // Auto-reset after 5 minutes
    if (breaker.isOpen && Date.now() - breaker.lastFailure > 300000) {
      breaker.isOpen = false;
      breaker.failures = 0;
    }

    return breaker.isOpen;
  }

  private recordFailure(providerName: string): void {
    const breaker = this.circuitBreakers.get(providerName) || {
      failures: 0,
      lastFailure: 0,
      isOpen: false
    };

    breaker.failures += 1;
    breaker.lastFailure = Date.now();

    // Open circuit breaker after 3 failures
    if (breaker.failures >= 3) {
      breaker.isOpen = true;
      console.warn(`Circuit breaker opened for ${providerName} after ${breaker.failures} failures`);
    }

    this.circuitBreakers.set(providerName, breaker);
  }

  private resetCircuitBreaker(providerName: string): void {
    const breaker = this.circuitBreakers.get(providerName);
    if (breaker) {
      breaker.failures = 0;
      breaker.isOpen = false;
    }
  }

  private generateCacheKey(request: AIRequest): string {
    const key = `${request.model}:${request.prompt}:${JSON.stringify(request.options || {})}`;
    return Buffer.from(key).toString('base64');
  }

  private cacheResponse(key: string, response: AIResponse, ttl: number): void {
    this.cache.set(key, {
      response,
      timestamp: Date.now(),
      ttl
    });
  }

  private estimateTokens(text: string): number {
    // Rough estimation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private startCleanupTasks(): void {
    // Clean up cache every 10 minutes
    setInterval(() => {
      const now = Date.now();
      for (const [key, cached] of this.cache) {
        if (now - cached.timestamp > cached.ttl) {
          this.cache.delete(key);
        }
      }
    }, 600000);

    // Reset rate limits every minute
    setInterval(() => {
      const now = Date.now();
      for (const [provider, rateLimit] of this.rateLimits) {
        if (now > rateLimit.resetTime) {
          this.rateLimits.delete(provider);
        }
      }
    }, 60000);
  }
}

// Singleton instance
export const aiGateway = new AIGateway();