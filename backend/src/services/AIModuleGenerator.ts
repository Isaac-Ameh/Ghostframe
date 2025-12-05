// 🎃 GhostFrame AI Module Generator
// Uses Kiro AI to generate complete modules from natural language descriptions

import { KiroSpecGenerator } from './KiroSpecGenerator';

export interface AIModuleRequest {
  description: string;
  framework: string;
  kiroCompatible: boolean;
  category?: string;
  features?: string[];
}

export interface AIModuleResponse {
  id: string;
  name: string;
  description: string;
  category: string;
  files: Record<string, string>;
  packageJson: any;
  config: any;
  readme: string;
}

export class AIModuleGenerator {
  private kiroSpecGenerator: KiroSpecGenerator;

  constructor() {
    this.kiroSpecGenerator = new KiroSpecGenerator();
  }

  /**
   * Generate a complete module from AI description
   */
  async generateModule(request: AIModuleRequest): Promise<AIModuleResponse> {
    console.log('🤖 Generating module with AI:', request.description);

    // Parse the description to extract key information
    const moduleInfo = await this.parseDescription(request.description);

    // Generate module structure
    const moduleId = this.sanitizeModuleName(moduleInfo.name);
    const category = request.category || moduleInfo.category || 'general';

    // Generate files using AI
    const files = await this.generateFiles(moduleInfo, category);

    // Generate package.json
    const packageJson = this.generatePackageJson(moduleId, moduleInfo);

    // Generate ghostframe.config.json
    const config = await this.generateConfig(moduleId, moduleInfo, category);

    // Generate README
    const readme = this.generateReadme(moduleInfo);

    return {
      id: moduleId,
      name: moduleInfo.name,
      description: moduleInfo.description,
      category,
      files,
      packageJson,
      config,
      readme
    };
  }

  /**
   * Parse natural language description
   */
  private async parseDescription(description: string): Promise<any> {
    // Extract key information from description
    const lowerDesc = description.toLowerCase();

    // Determine module type
    let category = 'general';
    if (lowerDesc.includes('quiz') || lowerDesc.includes('education') || lowerDesc.includes('learn')) {
      category = 'education';
    } else if (lowerDesc.includes('story') || lowerDesc.includes('creative') || lowerDesc.includes('narrative')) {
      category = 'creative';
    } else if (lowerDesc.includes('task') || lowerDesc.includes('productivity') || lowerDesc.includes('workflow')) {
      category = 'productivity';
    } else if (lowerDesc.includes('research') || lowerDesc.includes('analysis') || lowerDesc.includes('data')) {
      category = 'research';
    }

    // Extract name (simplified - in production would use NLP)
    const name = this.extractModuleName(description);

    // Extract features
    const features = this.extractFeatures(description);

    return {
      name,
      description,
      category,
      features,
      inputType: this.detectInputType(description),
      outputType: this.detectOutputType(description)
    };
  }

  /**
   * Extract module name from description
   */
  private extractModuleName(description: string): string {
    // Simple extraction - look for "module that..." or "AI that..."
    const patterns = [
      /(?:module|ai|tool|system)\s+(?:that|to|for)\s+([^,.]+)/i,
      /([^,.]+?)\s+(?:module|ai|tool|system)/i
    ];

    for (const pattern of patterns) {
      const match = description.match(pattern);
      if (match && match[1]) {
        return this.capitalizeWords(match[1].trim());
      }
    }

    // Fallback: use first few words
    const words = description.split(' ').slice(0, 3);
    return this.capitalizeWords(words.join(' '));
  }

  /**
   * Extract features from description
   */
  private extractFeatures(description: string): string[] {
    const features: string[] = [];
    const lowerDesc = description.toLowerCase();

    // Common feature keywords
    const featureKeywords = [
      'summarize', 'analyze', 'generate', 'create', 'process',
      'extract', 'transform', 'classify', 'detect', 'predict'
    ];

    for (const keyword of featureKeywords) {
      if (lowerDesc.includes(keyword)) {
        features.push(this.capitalizeWords(keyword));
      }
    }

    return features.length > 0 ? features : ['Process content', 'Generate output'];
  }

  /**
   * Detect input type from description
   */
  private detectInputType(description: string): string {
    const lowerDesc = description.toLowerCase();

    if (lowerDesc.includes('paper') || lowerDesc.includes('document') || lowerDesc.includes('text')) {
      return 'text/plain';
    } else if (lowerDesc.includes('pdf')) {
      return 'application/pdf';
    } else if (lowerDesc.includes('image')) {
      return 'image/*';
    } else if (lowerDesc.includes('video')) {
      return 'video/*';
    }

    return 'text/plain';
  }

  /**
   * Detect output type from description
   */
  private detectOutputType(description: string): string {
    const lowerDesc = description.toLowerCase();

    if (lowerDesc.includes('summary') || lowerDesc.includes('summarize')) {
      return 'summary';
    } else if (lowerDesc.includes('quiz') || lowerDesc.includes('question')) {
      return 'quiz';
    } else if (lowerDesc.includes('story') || lowerDesc.includes('narrative')) {
      return 'story';
    } else if (lowerDesc.includes('report') || lowerDesc.includes('analysis')) {
      return 'report';
    }

    return 'processed-content';
  }

  /**
   * Generate module files
   */
  private async generateFiles(moduleInfo: any, category: string): Promise<Record<string, string>> {
    const className = this.toPascalCase(moduleInfo.name);
    const files: Record<string, string> = {};

    // Generate main module file
    files['src/index.ts'] = this.generateMainModule(className, moduleInfo, category);

    // Generate types file
    files['src/types/index.ts'] = this.generateTypes(className, moduleInfo);

    // Generate test file
    files['tests/index.test.ts'] = this.generateTests(className, moduleInfo);

    // Generate Kiro specs
    files['.kiro/specs/module.md'] = await this.generateKiroSpecs(moduleInfo);

    // Generate hooks
    files['.kiro/hooks/index.ts'] = this.generateHooks(className, moduleInfo);

    // Generate steering
    files['.kiro/steering/behavior.md'] = this.generateSteering(moduleInfo);

    // Generate TypeScript config
    files['tsconfig.json'] = JSON.stringify({
      compilerOptions: {
        target: 'ES2020',
        module: 'commonjs',
        lib: ['ES2020'],
        outDir: './dist',
        rootDir: './src',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        declaration: true,
        sourceMap: true
      },
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist', 'tests']
    }, null, 2);

    // Generate Jest config
    files['jest.config.json'] = JSON.stringify({
      preset: 'ts-jest',
      testEnvironment: 'node',
      roots: ['<rootDir>/src', '<rootDir>/tests'],
      testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
      collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
      coverageDirectory: 'coverage'
    }, null, 2);

    // Generate .gitignore
    files['.gitignore'] = `node_modules/
dist/
coverage/
.env
.env.local
*.log
.DS_Store
`;

    return files;
  }

  /**
   * Generate main module code
   */
  private generateMainModule(className: string, moduleInfo: any, category: string): string {
    return `// 🎃 ${moduleInfo.name}
// ${moduleInfo.description}
// Generated by GhostFrame AI

export interface ${className}Input {
  content: string;
  options?: {
    mode?: 'standard' | 'advanced';
    [key: string]: any;
  };
}

export interface ${className}Output {
  result: any;
  metadata: {
    processingTime: number;
    confidence: number;
    moduleId: string;
    timestamp: string;
  };
}

export class ${className}Module {
  readonly id = '${this.sanitizeModuleName(moduleInfo.name)}';
  readonly name = '${moduleInfo.name}';
  readonly version = '1.0.0';
  readonly category = '${category}';

  /**
   * Process content
   */
  async process(input: ${className}Input, context: any): Promise<${className}Output> {
    const startTime = Date.now();

    try {
      // Validate input
      this.validateInput(input);

      // Apply Kiro steering
      const steeringContext = await context.applySteering(input);

      // Process content
      const result = await this.processContent(input, steeringContext);

      // Calculate metadata
      const processingTime = Date.now() - startTime;
      const confidence = this.calculateConfidence(result);

      return {
        result,
        metadata: {
          processingTime,
          confidence,
          moduleId: this.id,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      throw new Error(\`Processing failed: \${error instanceof Error ? error.message : error}\`);
    }
  }

  /**
   * Process content implementation
   */
  private async processContent(input: ${className}Input, context: any): Promise<any> {
    // TODO: Implement your processing logic here
    console.log('Processing:', input.content.substring(0, 100) + '...');

    // Placeholder implementation
    return {
      type: '${category}',
      processed: true,
      content: input.content,
      features: ${JSON.stringify(moduleInfo.features)}
    };
  }

  private validateInput(input: ${className}Input): void {
    if (!input.content || typeof input.content !== 'string') {
      throw new Error('Content is required and must be a string');
    }

    if (input.content.length === 0) {
      throw new Error('Content cannot be empty');
    }
  }

  private calculateConfidence(result: any): number {
    return result && result.processed ? 0.95 : 0.5;
  }
}

export const ${this.toCamelCase(moduleInfo.name)}Module = new ${className}Module();
export default ${this.toCamelCase(moduleInfo.name)}Module;
`;
  }

  /**
   * Generate TypeScript types
   */
  private generateTypes(className: string, moduleInfo: any): string {
    return `// Type definitions for ${moduleInfo.name}

export interface ProcessingOptions {
  mode?: 'standard' | 'advanced';
  language?: string;
  [key: string]: any;
}

export interface ProcessingResult {
  success: boolean;
  data: any;
  error?: string;
}

export interface ModuleMetadata {
  processingTime: number;
  confidence: number;
  moduleId: string;
  timestamp: string;
}
`;
  }

  /**
   * Generate test file
   */
  private generateTests(className: string, moduleInfo: any): string {
    return `// Tests for ${moduleInfo.name}

import { ${className}Module } from '../src/index';

describe('${className}Module', () => {
  let module: ${className}Module;

  beforeEach(() => {
    module = new ${className}Module();
  });

  describe('Module Properties', () => {
    test('should have correct module properties', () => {
      expect(module.id).toBeDefined();
      expect(module.name).toBe('${moduleInfo.name}');
      expect(module.version).toBe('1.0.0');
      expect(module.category).toBe('${moduleInfo.category}');
    });
  });

  describe('Content Processing', () => {
    test('should process valid content successfully', async () => {
      const input = {
        content: 'Test content for processing'
      };

      const mockContext = {
        applySteering: jest.fn().mockResolvedValue({})
      };

      const result = await module.process(input, mockContext);

      expect(result).toBeDefined();
      expect(result.result).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.metadata.confidence).toBeGreaterThan(0);
    });

    test('should reject empty content', async () => {
      const input = { content: '' };
      const mockContext = { applySteering: jest.fn() };

      await expect(module.process(input, mockContext))
        .rejects.toThrow('Content cannot be empty');
    });
  });
});
`;
  }

  /**
   * Generate Kiro specs
   */
  private async generateKiroSpecs(moduleInfo: any): Promise<string> {
    return `# ${moduleInfo.name} - Kiro Specifications

## Overview
${moduleInfo.description}

## Features
${moduleInfo.features.map((f: string) => `- ${f}`).join('\n')}

## Requirements
- Process ${moduleInfo.inputType} content
- Generate ${moduleInfo.outputType} output
- Maintain Kiro compatibility
- Provide confidence scores

## API Specification

### Input
- Content: ${moduleInfo.inputType}
- Options: Processing configuration

### Output
- Result: Processed content
- Metadata: Processing information

Generated by GhostFrame AI 🤖
`;
  }

  /**
   * Generate hooks
   */
  private generateHooks(className: string, moduleInfo: any): string {
    return `// Kiro hooks for ${moduleInfo.name}

export const hooks = {
  async handleContentUpload(content: any, context: any) {
    console.log('📤 Content uploaded for ${moduleInfo.name}');
    return { success: true, preprocessed: true };
  },

  async handleProcessingComplete(result: any, context: any) {
    console.log('✅ Processing completed for ${moduleInfo.name}');
    return { success: true, postProcessed: true };
  }
};

export default hooks;
`;
  }

  /**
   * Generate steering
   */
  private generateSteering(moduleInfo: any): string {
    return `# ${moduleInfo.name} - AI Behavior Steering

## Personality
- Professional and helpful
- Focused on ${moduleInfo.category} domain
- Clear and concise communication

## Guidelines
${moduleInfo.features.map((f: string) => `- ${f} with high accuracy`).join('\n')}

## Quality Standards
- Accuracy: > 90%
- Response time: < 2 seconds
- Confidence reporting: Always include

Generated by GhostFrame AI 🤖
`;
  }

  /**
   * Generate package.json
   */
  private generatePackageJson(moduleId: string, moduleInfo: any): any {
    return {
      name: moduleId,
      version: '1.0.0',
      description: moduleInfo.description,
      main: 'dist/index.js',
      types: 'dist/index.d.ts',
      scripts: {
        dev: 'tsc --watch',
        build: 'tsc',
        test: 'jest',
        'test:watch': 'jest --watch',
        'test:coverage': 'jest --coverage'
      },
      keywords: [
        'ghostframe',
        'kiro',
        'ai',
        moduleInfo.category,
        'module'
      ],
      author: 'GhostFrame AI',
      license: 'MIT',
      dependencies: {
        '@ghostframe/core': '^1.0.0',
        'typescript': '^5.0.0'
      },
      devDependencies: {
        '@types/node': '^20.0.0',
        '@types/jest': '^29.0.0',
        'jest': '^29.0.0',
        'ts-jest': '^29.0.0'
      }
    };
  }

  /**
   * Generate config
   */
  private async generateConfig(moduleId: string, moduleInfo: any, category: string): Promise<any> {
    return {
      id: moduleId,
      name: moduleInfo.name,
      version: '1.0.0',
      description: moduleInfo.description,
      category,
      kiroCompatibility: '1.0.0',
      config: {
        inputSchema: {
          type: 'object',
          properties: {
            content: { type: 'string', description: 'Input content' },
            options: { type: 'object', description: 'Processing options' }
          },
          required: ['content']
        },
        outputSchema: {
          type: 'object',
          properties: {
            result: { type: 'any', description: 'Processed result' },
            metadata: { type: 'object', description: 'Processing metadata' }
          }
        },
        supportedContentTypes: [moduleInfo.inputType],
        processingModes: ['realtime', 'batch']
      }
    };
  }

  /**
   * Generate README
   */
  private generateReadme(moduleInfo: any): string {
    return `# ${moduleInfo.name}

${moduleInfo.description}

## Features

${moduleInfo.features.map((f: string) => `- ${f}`).join('\n')}

## Installation

\`\`\`bash
npm install ${this.sanitizeModuleName(moduleInfo.name)}
\`\`\`

## Usage

\`\`\`typescript
import { ${this.toCamelCase(moduleInfo.name)}Module } from '${this.sanitizeModuleName(moduleInfo.name)}';

const result = await ${this.toCamelCase(moduleInfo.name)}Module.process({
  content: 'Your content here'
}, context);

console.log(result);
\`\`\`

## Development

\`\`\`bash
npm install
npm run dev
npm test
\`\`\`

---

Generated by GhostFrame AI 🤖
Built with 🎃 GhostFrame - Where dead tech learns new tricks!
`;
  }

  // Helper methods
  private sanitizeModuleName(name: string): string {
    return name.toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private toPascalCase(str: string): string {
    return str.replace(/[^a-zA-Z0-9]/g, ' ')
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join('');
  }

  private toCamelCase(str: string): string {
    const pascal = this.toPascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
  }

  private capitalizeWords(str: string): string {
    return str.split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' ');
  }
}
