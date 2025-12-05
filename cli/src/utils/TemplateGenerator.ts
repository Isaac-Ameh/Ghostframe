// 🎃 GhostFrame CLI Template Generator
// Generates module templates with Kiro integration

import fs from 'fs-extra';
import path from 'path';

export interface ModuleTemplate {
  id: string;
  name: string;
  template: string;
  directory: string;
}

export class TemplateGenerator {
  private templates: Record<string, any>;

  constructor() {
    this.templates = {
      education: {
        name: 'Education Module',
        description: 'AI-powered educational content processing',
        features: ['Quiz Generation', 'Content Analysis', 'Progress Tracking'],
        dependencies: {
          '@ghostframe/core': '^1.0.0',
          '@ghostframe/education': '^1.0.0'
        }
      },
      creative: {
        name: 'Creative Module',
        description: 'AI-powered creative content generation',
        features: ['Story Generation', 'Character Development', 'Plot Structure'],
        dependencies: {
          '@ghostframe/core': '^1.0.0',
          '@ghostframe/creative': '^1.0.0'
        }
      },
      productivity: {
        name: 'Productivity Module',
        description: 'AI-powered workflow optimization',
        features: ['Task Automation', 'Document Processing', 'Time Management'],
        dependencies: {
          '@ghostframe/core': '^1.0.0',
          '@ghostframe/productivity': '^1.0.0'
        }
      },
      research: {
        name: 'Research Module',
        description: 'AI-powered data analysis and insights',
        features: ['Data Analysis', 'Report Generation', 'Visualization'],
        dependencies: {
          '@ghostframe/core': '^1.0.0',
          '@ghostframe/research': '^1.0.0'
        }
      }
    };
  }

  /**
   * Generate a new module from template
   */
  async generateModule(options: ModuleTemplate): Promise<void> {
    const template = this.templates[options.template];
    if (!template) {
      throw new Error(`Unknown template: ${options.template}`);
    }

    // Create directory structure
    await this.createDirectoryStructure(options.directory);

    // Generate files
    await this.generatePackageJson(options, template);
    await this.generateGhostFrameConfig(options, template);
    await this.generateModuleClass(options, template);
    await this.generateKiroSpecs(options, template);
    await this.generateHooks(options, template);
    await this.generateSteering(options, template);
    await this.generateTests(options, template);
    await this.generateReadme(options, template);
    await this.generateTypeScriptConfig(options.directory);
    await this.generateGitIgnore(options.directory);
  }

  private async createDirectoryStructure(baseDir: string): Promise<void> {
    const dirs = [
      'src',
      'src/components',
      'src/services',
      'src/types',
      'tests',
      '.kiro',
      '.kiro/specs',
      '.kiro/hooks',
      '.kiro/steering',
      'docs'
    ];

    for (const dir of dirs) {
      await fs.ensureDir(path.join(baseDir, dir));
    }
  }

  private async generatePackageJson(options: ModuleTemplate, template: any): Promise<void> {
    const packageJson = {
      name: options.id,
      version: '1.0.0',
      description: template.description,
      main: 'dist/index.js',
      types: 'dist/index.d.ts',
      scripts: {
        dev: 'tsc --watch',
        build: 'tsc',
        test: 'jest',
        'test:watch': 'jest --watch',
        'test:coverage': 'jest --coverage',
        lint: 'eslint src --ext .ts',
        'lint:fix': 'eslint src --ext .ts --fix',
        validate: 'ghostframe validate',
        publish: 'ghostframe publish'
      },
      keywords: [
        'ghostframe',
        'kiro',
        'ai',
        options.template,
        'module'
      ],
      author: 'GhostFrame Developer',
      license: 'MIT',
      dependencies: {
        ...template.dependencies,
        typescript: '^5.0.0'
      },
      devDependencies: {
        '@types/node': '^20.0.0',
        '@typescript-eslint/eslint-plugin': '^6.0.0',
        '@typescript-eslint/parser': '^6.0.0',
        eslint: '^8.0.0',
        jest: '^29.0.0',
        '@types/jest': '^29.0.0',
        'ts-jest': '^29.0.0'
      },
      engines: {
        node: '>=16.0.0'
      }
    };

    await fs.writeJson(path.join(options.directory, 'package.json'), packageJson, { spaces: 2 });
  }

  private async generateGhostFrameConfig(options: ModuleTemplate, template: any): Promise<void> {
    const config = {
      id: options.id,
      name: options.name,
      version: '1.0.0',
      description: template.description,
      category: options.template,
      kiroCompatibility: '1.0.0',
      config: {
        inputSchema: {
          type: 'object',
          properties: {
            content: { type: 'string', description: 'Input content to process' },
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
        supportedContentTypes: ['text/plain', 'application/json'],
        processingModes: ['realtime', 'batch'],
        uiComponents: [
          {
            componentType: 'generator',
            componentPath: `/components/${this.toPascalCase(options.id)}Generator`,
            props: {},
            permissions: ['read', 'write']
          }
        ],
        endpoints: [
          {
            path: '/api/process',
            method: 'POST',
            handler: 'processContent',
            rateLimit: {
              windowMs: 60000,
              maxRequests: 100
            }
          }
        ]
      },
      specs: {
        specFiles: ['.kiro/specs/module.md'],
        requirements: [],
        testCases: []
      },
      hooks: {
        onContentUpload: 'handleContentUpload',
        onProcessingComplete: 'handleProcessingComplete'
      },
      steering: {
        behaviorRules: [
          {
            id: 'quality-check',
            condition: 'input.length > 0',
            action: 'validateInput',
            priority: 1
          }
        ],
        contextGuidelines: template.features,
        qualityStandards: [
          {
            metric: 'accuracy',
            threshold: 0.9,
            description: 'Processing accuracy must be above 90%'
          }
        ]
      }
    };

    await fs.writeJson(path.join(options.directory, 'ghostframe.config.json'), config, { spaces: 2 });
  }

  private async generateModuleClass(options: ModuleTemplate, template: any): Promise<void> {
    const className = this.toPascalCase(options.id);
    const moduleCode = `// 🎃 ${options.name} - GhostFrame Module
// ${template.description}

import { KiroModule, ModuleProcessor, ProcessingContext } from '@ghostframe/core';

export interface ${className}Input {
  content: string;
  options?: {
    mode?: 'standard' | 'advanced';
    language?: string;
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

export class ${className}Module implements KiroModule {
  readonly id = '${options.id}';
  readonly name = '${options.name}';
  readonly version = '1.0.0';
  readonly category = '${options.template}';

  /**
   * Process content using ${options.template} AI capabilities
   */
  async process(input: ${className}Input, context: ProcessingContext): Promise<${className}Output> {
    const startTime = Date.now();

    try {
      // Validate input
      this.validateInput(input);

      // Apply Kiro steering rules
      const steeringContext = await context.applySteering(input);

      // Process content based on template type
      const result = await this.processContent(input, steeringContext);

      // Calculate processing metadata
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
   * ${template.name}-specific content processing
   */
  private async processContent(input: ${className}Input, context: any): Promise<any> {
    // TODO: Implement your ${options.template} processing logic here
    
    console.log(\`Processing \${options.template} content:\`, input.content.substring(0, 100) + '...');
    
    // Placeholder implementation - replace with actual AI processing
    switch ('${options.template}') {
      case 'education':
        return this.processEducationalContent(input, context);
      case 'creative':
        return this.processCreativeContent(input, context);
      case 'productivity':
        return this.processProductivityContent(input, context);
      case 'research':
        return this.processResearchContent(input, context);
      default:
        return { processed: true, content: input.content };
    }
  }

  private async processEducationalContent(input: ${className}Input, context: any): Promise<any> {
    // Educational processing logic
    return {
      type: 'educational',
      questions: [
        { question: 'What is the main topic?', answer: 'Generated from content' },
        { question: 'Key concepts?', answer: 'Extracted concepts' }
      ],
      summary: 'Educational summary generated from content',
      difficulty: 'medium'
    };
  }

  private async processCreativeContent(input: ${className}Input, context: any): Promise<any> {
    // Creative processing logic
    return {
      type: 'creative',
      story: {
        title: 'Generated Story Title',
        content: 'Creative narrative based on input content...',
        characters: ['Protagonist', 'Supporting Character'],
        theme: 'Adventure and learning'
      }
    };
  }

  private async processProductivityContent(input: ${className}Input, context: any): Promise<any> {
    // Productivity processing logic
    return {
      type: 'productivity',
      tasks: [
        { id: 1, title: 'Generated Task 1', priority: 'high' },
        { id: 2, title: 'Generated Task 2', priority: 'medium' }
      ],
      workflow: 'Optimized workflow based on content'
    };
  }

  private async processResearchContent(input: ${className}Input, context: any): Promise<any> {
    // Research processing logic
    return {
      type: 'research',
      insights: [
        'Key insight 1 from content analysis',
        'Key insight 2 from data processing'
      ],
      data: {
        analyzed: true,
        patterns: ['Pattern 1', 'Pattern 2']
      }
    };
  }

  private validateInput(input: ${className}Input): void {
    if (!input.content || typeof input.content !== 'string') {
      throw new Error('Content is required and must be a string');
    }

    if (input.content.length === 0) {
      throw new Error('Content cannot be empty');
    }

    if (input.content.length > 100000) {
      throw new Error('Content too large (max 100KB)');
    }
  }

  private calculateConfidence(result: any): number {
    // Simple confidence calculation - implement your own logic
    if (!result) return 0;
    
    // Base confidence on result completeness
    const hasResult = !!result;
    const hasMetadata = !!result.metadata || !!result.type;
    
    return hasResult && hasMetadata ? 0.95 : 0.75;
  }
}

// Export the module instance
export const ${this.toCamelCase(options.id)}Module = new ${className}Module();
export default ${this.toCamelCase(options.id)}Module;
`;

    await fs.writeFile(path.join(options.directory, 'src', 'index.ts'), moduleCode);
  }

  private async generateKiroSpecs(options: ModuleTemplate, template: any): Promise<void> {
    const specs = `# ${options.name} - Kiro Specifications

## Overview
${template.description}

## Features
${template.features.map((f: string) => `- ${f}`).join('\n')}

## Requirements

### Functional Requirements
- Process ${options.template} content efficiently
- Maintain Kiro compatibility standards
- Provide accurate and relevant results
- Support real-time and batch processing modes

### Non-Functional Requirements
- Response time < 2 seconds for standard content
- 99.9% uptime availability
- Support for concurrent processing
- Secure data handling

## API Specification

### Input Schema
\`\`\`json
{
  "type": "object",
  "properties": {
    "content": {
      "type": "string",
      "description": "Content to process"
    },
    "options": {
      "type": "object",
      "description": "Processing options"
    }
  },
  "required": ["content"]
}
\`\`\`

### Output Schema
\`\`\`json
{
  "type": "object",
  "properties": {
    "result": {
      "type": "any",
      "description": "Processed result"
    },
    "metadata": {
      "type": "object",
      "description": "Processing metadata"
    }
  }
}
\`\`\`

## Testing Requirements
- Unit tests for all processing functions
- Integration tests with Kiro framework
- Performance benchmarks
- Security validation

## Deployment
- Compatible with GhostFrame Registry
- Supports Docker containerization
- Environment-specific configurations

Generated by GhostFrame CLI 🎃
`;

    await fs.writeFile(path.join(options.directory, '.kiro', 'specs', 'module.md'), specs);
  }

  private async generateHooks(options: ModuleTemplate, template: any): Promise<void> {
    const hooks = `// 🎃 ${options.name} - Kiro Hooks
// Event handlers for module lifecycle

export const hooks = {
  /**
   * Handle content upload event
   */
  async handleContentUpload(content: any, context: any) {
    console.log('📤 Content uploaded for ${options.template} processing');
    
    // Pre-process content if needed
    if (content.type === 'text/plain') {
      // Text preprocessing
      content.processed = content.data.trim();
    }
    
    return {
      success: true,
      preprocessed: true,
      contentId: context.contentId
    };
  },

  /**
   * Handle processing completion
   */
  async handleProcessingComplete(result: any, context: any) {
    console.log('✅ ${options.template} processing completed');
    
    // Post-process results
    if (result.confidence < 0.8) {
      console.warn('⚠️ Low confidence result detected');
    }
    
    // Log analytics
    context.analytics.track('processing_complete', {
      moduleId: '${options.id}',
      processingTime: result.metadata.processingTime,
      confidence: result.metadata.confidence
    });
    
    return {
      success: true,
      postProcessed: true,
      resultId: context.resultId
    };
  },

  /**
   * Handle module installation
   */
  async onModuleInstall(installContext: any) {
    console.log('🎃 Installing ${options.name}...');
    
    // Setup module-specific resources
    await this.setupResources(installContext);
    
    return {
      success: true,
      installed: true
    };
  },

  /**
   * Handle module uninstallation
   */
  async onModuleUninstall(uninstallContext: any) {
    console.log('🗑️ Uninstalling ${options.name}...');
    
    // Cleanup module resources
    await this.cleanupResources(uninstallContext);
    
    return {
      success: true,
      uninstalled: true
    };
  },

  // Helper methods
  async setupResources(context: any) {
    // Initialize ${options.template}-specific resources
    console.log('Setting up ${options.template} resources...');
  },

  async cleanupResources(context: any) {
    // Cleanup ${options.template}-specific resources
    console.log('Cleaning up ${options.template} resources...');
  }
};

export default hooks;
`;

    await fs.writeFile(path.join(options.directory, '.kiro', 'hooks', 'index.ts'), hooks);
  }

  private async generateSteering(options: ModuleTemplate, template: any): Promise<void> {
    const steering = `# ${options.name} - AI Behavior Steering

## Personality
- Professional and knowledgeable in ${options.template} domain
- Helpful and educational in responses
- Maintains GhostFrame's spooky theme appropriately

## Guidelines

### ${template.name} Specific
${template.features.map((f: string) => `- Focus on ${f.toLowerCase()}`).join('\n')}

### Quality Standards
- Ensure high accuracy in ${options.template} processing
- Provide clear and understandable results
- Maintain consistency across processing sessions
- Follow domain-specific best practices

### Behavior Rules
- Always validate input before processing
- Provide confidence scores with results
- Include helpful metadata in responses
- Handle errors gracefully with informative messages

## Context Guidelines
- Consider user's expertise level
- Adapt complexity based on content type
- Maintain educational value in all outputs
- Preserve original content intent

## Processing Standards
- Response time: < 2 seconds for standard content
- Accuracy threshold: > 90%
- Confidence reporting: Always include
- Error handling: Graceful with clear messages

Generated by GhostFrame CLI 🎃
`;

    await fs.writeFile(path.join(options.directory, '.kiro', 'steering', 'behavior.md'), steering);
  }

  private async generateTests(options: ModuleTemplate, template: any): Promise<void> {
    const className = this.toPascalCase(options.id);
    const testCode = `// 🎃 ${options.name} - Test Suite
// Comprehensive tests for ${options.template} module

import { ${className}Module } from '../src/index';

describe('${className}Module', () => {
  let module: ${className}Module;

  beforeEach(() => {
    module = new ${className}Module();
  });

  describe('Module Properties', () => {
    test('should have correct module properties', () => {
      expect(module.id).toBe('${options.id}');
      expect(module.name).toBe('${options.name}');
      expect(module.version).toBe('1.0.0');
      expect(module.category).toBe('${options.template}');
    });
  });

  describe('Content Processing', () => {
    test('should process valid content successfully', async () => {
      const input = {
        content: 'Test content for ${options.template} processing',
        options: { mode: 'standard' }
      };

      const mockContext = {
        applySteering: jest.fn().mockResolvedValue({}),
        analytics: { track: jest.fn() }
      };

      const result = await module.process(input, mockContext as any);

      expect(result).toBeDefined();
      expect(result.result).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.metadata.moduleId).toBe('${options.id}');
      expect(result.metadata.confidence).toBeGreaterThan(0);
      expect(result.metadata.processingTime).toBeGreaterThan(0);
    });

    test('should reject empty content', async () => {
      const input = { content: '' };
      const mockContext = { applySteering: jest.fn() };

      await expect(module.process(input, mockContext as any))
        .rejects.toThrow('Content cannot be empty');
    });

    test('should reject missing content', async () => {
      const input = {} as any;
      const mockContext = { applySteering: jest.fn() };

      await expect(module.process(input, mockContext as any))
        .rejects.toThrow('Content is required');
    });

    test('should reject oversized content', async () => {
      const input = { content: 'x'.repeat(100001) };
      const mockContext = { applySteering: jest.fn() };

      await expect(module.process(input, mockContext as any))
        .rejects.toThrow('Content too large');
    });
  });

  describe('${template.name} Specific Processing', () => {
    test('should return ${options.template}-specific result structure', async () => {
      const input = {
        content: 'Sample content for ${options.template} analysis',
        options: { mode: 'advanced' }
      };

      const mockContext = {
        applySteering: jest.fn().mockResolvedValue({}),
        analytics: { track: jest.fn() }
      };

      const result = await module.process(input, mockContext as any);

      expect(result.result.type).toBe('${options.template}');
      
      // Template-specific assertions
      switch ('${options.template}') {
        case 'education':
          expect(result.result.questions).toBeDefined();
          expect(result.result.summary).toBeDefined();
          break;
        case 'creative':
          expect(result.result.story).toBeDefined();
          expect(result.result.story.title).toBeDefined();
          break;
        case 'productivity':
          expect(result.result.tasks).toBeDefined();
          expect(result.result.workflow).toBeDefined();
          break;
        case 'research':
          expect(result.result.insights).toBeDefined();
          expect(result.result.data).toBeDefined();
          break;
      }
    });
  });

  describe('Performance', () => {
    test('should process content within time limit', async () => {
      const input = {
        content: 'Performance test content for ${options.template} processing'
      };

      const mockContext = {
        applySteering: jest.fn().mockResolvedValue({}),
        analytics: { track: jest.fn() }
      };

      const startTime = Date.now();
      const result = await module.process(input, mockContext as any);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(5000); // 5 second limit
      expect(result.metadata.processingTime).toBeLessThan(5000);
    });
  });

  describe('Error Handling', () => {
    test('should handle processing errors gracefully', async () => {
      const input = { content: 'test content' };
      const mockContext = {
        applySteering: jest.fn().mockRejectedValue(new Error('Steering failed'))
      };

      await expect(module.process(input, mockContext as any))
        .rejects.toThrow('Processing failed: Steering failed');
    });
  });
});
`;

    await fs.writeFile(path.join(options.directory, 'tests', `${options.id}.test.ts`), testCode);

    // Generate Jest configuration
    const jestConfig = {
      preset: 'ts-jest',
      testEnvironment: 'node',
      roots: ['<rootDir>/src', '<rootDir>/tests'],
      testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
      collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts'
      ],
      coverageDirectory: 'coverage',
      coverageReporters: ['text', 'lcov', 'html']
    };

    await fs.writeJson(path.join(options.directory, 'jest.config.json'), jestConfig, { spaces: 2 });
  }

  private async generateReadme(options: ModuleTemplate, template: any): Promise<void> {
    const readme = `# ${options.name}

${template.description}

## Features

${template.features.map((f: string) => `- ${f}`).join('\n')}

## Installation

\`\`\`bash
npm install ${options.id}
\`\`\`

## Usage

\`\`\`typescript
import { ${this.toCamelCase(options.id)}Module } from '${options.id}';

const module = ${this.toCamelCase(options.id)}Module;

// Process content
const result = await module.process({
  content: 'Your content here',
  options: {
    mode: 'standard',
    language: 'en'
  }
}, context);

console.log(result);
\`\`\`

## API Reference

### Input

\`\`\`typescript
interface ${this.toPascalCase(options.id)}Input {
  content: string;
  options?: {
    mode?: 'standard' | 'advanced';
    language?: string;
    [key: string]: any;
  };
}
\`\`\`

### Output

\`\`\`typescript
interface ${this.toPascalCase(options.id)}Output {
  result: any;
  metadata: {
    processingTime: number;
    confidence: number;
    moduleId: string;
    timestamp: string;
  };
}
\`\`\`

## Development

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Validate module
npm run validate

# Build for production
npm run build
\`\`\`

## Testing

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
\`\`\`

## Validation

This module is Kiro-compatible and follows GhostFrame standards:

\`\`\`bash
# Validate module compliance
ghostframe validate

# Validate with strict mode
ghostframe validate --strict
\`\`\`

## Publishing

\`\`\`bash
# Publish to GhostFrame Registry
ghostframe publish

# Dry run (test without publishing)
ghostframe publish --dry-run
\`\`\`

## Configuration

Module configuration is defined in \`ghostframe.config.json\`:

\`\`\`json
{
  "id": "${options.id}",
  "name": "${options.name}",
  "category": "${options.template}",
  "kiroCompatibility": "1.0.0"
}
\`\`\`

## Kiro Integration

This module includes:

- **Specs**: Detailed specifications in \`.kiro/specs/\`
- **Hooks**: Event handlers in \`.kiro/hooks/\`
- **Steering**: AI behavior rules in \`.kiro/steering/\`

## License

MIT

## Support

For support and questions:

- 📧 Email: support@ghostframe.dev
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/ghostframe/issues)
- 📖 Docs: [GhostFrame Documentation](https://docs.ghostframe.dev)

---

Built with 🎃 GhostFrame - Where dead tech learns new tricks!
`;

    await fs.writeFile(path.join(options.directory, 'README.md'), readme);
  }

  private async generateTypeScriptConfig(directory: string): Promise<void> {
    const tsConfig = {
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
        declarationMap: true,
        sourceMap: true,
        removeComments: false,
        experimentalDecorators: true,
        emitDecoratorMetadata: true
      },
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist', 'tests']
    };

    await fs.writeJson(path.join(directory, 'tsconfig.json'), tsConfig, { spaces: 2 });
  }

  private async generateGitIgnore(directory: string): Promise<void> {
    const gitignore = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/
*.tsbuildinfo

# Coverage
coverage/
*.lcov

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Temporary folders
tmp/
temp/

# GhostFrame specific
.ghostframe/
`;

    await fs.writeFile(path.join(directory, '.gitignore'), gitignore);
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
}