// 🎃 Enhanced Module Generator with AI Gateway Integration
// Scalable module creation system with full-stack code generation

import { aiGateway } from './AIGateway';
import { kiroSpecGenerator } from './KiroSpecGenerator';
import { hookManager } from './HookManager';
import { steeringEngine } from './SteeringEngine';
import { KiroModule } from '../types/framework';

export interface EnhancedModuleRequest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  category: 'education' | 'productivity' | 'creative' | 'research' | 'utility';
  features: string[];
  aiModels: string[];
  theme: 'dark' | 'light' | 'auto';
  database: boolean;
  realtime: boolean;
  kiroIntegration: {
    specs: boolean;
    hooks: boolean;
    steering: boolean;
  };
}

export interface GeneratedModule {
  config: ModuleConfig;
  files: GeneratedFile[];
  kiroSpecs: {
    requirements?: string;
    design?: string;
    tasks?: string;
  };
  hooks: string[];
  steering: string;
  documentation: string;
  setupInstructions: string;
  dependencies: string[];
}

export interface ModuleConfig {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  category: string;
  main: string;
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  ghostframe: {
    processor: string;
    ui: string;
    hooks: string[];
    steering: string;
    aiModels: string[];
    features: string[];
  };
}

export interface GeneratedFile {
  path: string;
  content: string;
  type: 'typescript' | 'react' | 'json' | 'markdown' | 'yaml';
  description: string;
}

export class EnhancedModuleGenerator {
  constructor() {}

  /**
   * Generate a complete module with AI-powered code generation
   */
  async generateModule(request: EnhancedModuleRequest): Promise<GeneratedModule> {
    console.log(`🎃 Generating enhanced module: ${request.name}`);

    // Generate module configuration
    const config = this.generateModuleConfig(request);

    // Generate core files with AI assistance
    const files = await this.generateModuleFiles(request, config);

    // Generate Kiro specifications if requested
    let kiroSpecs = {};
    if (request.kiroIntegration.specs) {
      kiroSpecs = await this.generateKiroSpecs(request);
    }

    // Generate hooks if requested
    let hooks: string[] = [];
    if (request.kiroIntegration.hooks) {
      hooks = await this.generateHooks(request);
    }

    // Generate steering if requested
    let steering = '';
    if (request.kiroIntegration.steering) {
      steering = await this.generateSteering(request);
    }

    // Generate documentation
    const documentation = await this.generateDocumentation(request, config);

    // Generate setup instructions
    const setupInstructions = this.generateSetupInstructions(request, config);

    // Generate dependencies
    const dependencies = this.generateDependencies(request);

    return {
      config,
      files,
      kiroSpecs,
      hooks,
      steering,
      documentation,
      setupInstructions,
      dependencies
    };
  }

  /**
   * Generate module configuration
   */
  private generateModuleConfig(request: EnhancedModuleRequest): ModuleConfig {
    const dependencies: Record<string, string> = {
      '@ghostframe/core': '^1.0.0',
      'typescript': '^5.0.0'
    };

    const devDependencies: Record<string, string> = {
      '@types/node': '^20.0.0',
      'jest': '^29.0.0',
      '@types/jest': '^29.0.0'
    };

    // Add category-specific dependencies
    switch (request.category) {
      case 'education':
        dependencies['@ghostframe/education'] = '^1.0.0';
        break;
      case 'creative':
        dependencies['@ghostframe/creative'] = '^1.0.0';
        break;
      case 'productivity':
        dependencies['@ghostframe/productivity'] = '^1.0.0';
        break;
      case 'research':
        dependencies['@ghostframe/research'] = '^1.0.0';
        break;
    }

    // Add React dependencies for UI
    dependencies['react'] = '^18.0.0';
    dependencies['@types/react'] = '^18.0.0';

    // Add database dependencies if needed
    if (request.database) {
      dependencies['prisma'] = '^5.0.0';
      dependencies['@prisma/client'] = '^5.0.0';
      devDependencies['@types/prisma'] = '^5.0.0';
    }

    // Add real-time dependencies if needed
    if (request.realtime) {
      dependencies['socket.io'] = '^4.0.0';
      dependencies['socket.io-client'] = '^4.0.0';
    }

    return {
      id: request.id,
      name: request.name,
      version: request.version,
      description: request.description,
      author: request.author,
      category: request.category,
      main: 'dist/index.js',
      scripts: {
        'build': 'tsc',
        'dev': 'tsc --watch',
        'test': 'jest',
        'lint': 'eslint src/**/*.ts',
        'start': 'node dist/index.js'
      },
      dependencies,
      devDependencies,
      ghostframe: {
        processor: `src/${request.id}Processor.ts`,
        ui: `src/ui/${request.id}Panel.tsx`,
        hooks: request.kiroIntegration.hooks ? [`hooks/${request.id}Hooks.ts`] : [],
        steering: request.kiroIntegration.steering ? `steering/${request.id}Steering.yaml` : '',
        aiModels: request.aiModels,
        features: request.features
      }
    };
  }

  /**
   * Generate module files with AI assistance
   */
  private async generateModuleFiles(request: EnhancedModuleRequest, config: ModuleConfig): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    // Generate package.json
    files.push({
      path: 'package.json',
      content: JSON.stringify(config, null, 2),
      type: 'json',
      description: 'Module configuration and dependencies'
    });

    // Generate main processor file
    const processorContent = await this.generateProcessorFile(request);
    files.push({
      path: `src/${request.id}Processor.ts`,
      content: processorContent,
      type: 'typescript',
      description: 'Main processing logic for the module'
    });

    // Generate UI component
    const uiContent = await this.generateUIComponent(request);
    files.push({
      path: `src/ui/${request.id}Panel.tsx`,
      content: uiContent,
      type: 'react',
      description: 'React UI component for the module'
    });

    // Generate types file
    const typesContent = await this.generateTypesFile(request);
    files.push({
      path: `src/types.ts`,
      content: typesContent,
      type: 'typescript',
      description: 'TypeScript type definitions'
    });

    // Generate index file
    const indexContent = this.generateIndexFile(request);
    files.push({
      path: 'src/index.ts',
      content: indexContent,
      type: 'typescript',
      description: 'Module entry point'
    });

    // Generate test file
    const testContent = await this.generateTestFile(request);
    files.push({
      path: `src/__tests__/${request.id}Processor.test.ts`,
      content: testContent,
      type: 'typescript',
      description: 'Unit tests for the processor'
    });

    // Generate database schema if needed
    if (request.database) {
      const schemaContent = await this.generateDatabaseSchema(request);
      files.push({
        path: 'prisma/schema.prisma',
        content: schemaContent,
        type: 'typescript',
        description: 'Database schema definition'
      });
    }

    // Generate TypeScript config
    files.push({
      path: 'tsconfig.json',
      content: this.generateTSConfig(),
      type: 'json',
      description: 'TypeScript configuration'
    });

    return files;
  }

  /**
   * Generate processor file with AI assistance
   */
  private async generateProcessorFile(request: EnhancedModuleRequest): Promise<string> {
    const prompt = `Generate a TypeScript processor class for a ${request.category} AI module named "${request.name}".

Description: ${request.description}
Features: ${request.features.join(', ')}
AI Models: ${request.aiModels.join(', ')}
Database: ${request.database ? 'Yes' : 'No'}
Real-time: ${request.realtime ? 'Yes' : 'No'}

The processor should:
1. Implement the ModuleProcessor interface
2. Include proper error handling
3. Use the AI Gateway for model requests
4. Include logging and analytics
5. Be production-ready with TypeScript types

Generate clean, professional code with comments.`;

    const response = await aiGateway.process({
      model: 'gpt-4',
      prompt,
      options: {
        temperature: 0.3,
        maxTokens: 2000
      },
      metadata: {
        moduleId: request.id,
        requestId: `gen_processor_${Date.now()}`
      }
    });

    return this.cleanupGeneratedCode(response.content);
  }

  /**
   * Generate UI component with AI assistance
   */
  private async generateUIComponent(request: EnhancedModuleRequest): Promise<string> {
    const prompt = `Generate a React TypeScript component for a ${request.category} AI module UI panel.

Module: ${request.name}
Description: ${request.description}
Features: ${request.features.join(', ')}
Theme: ${request.theme}

The component should:
1. Use modern React hooks
2. Include proper TypeScript types
3. Have a clean, professional UI
4. Include form handling and validation
5. Show loading states and error handling
6. Use Tailwind CSS for styling
7. Include accessibility features

Generate a complete, functional React component.`;

    const response = await aiGateway.process({
      model: 'gpt-4',
      prompt,
      options: {
        temperature: 0.4,
        maxTokens: 2500
      },
      metadata: {
        moduleId: request.id,
        requestId: `gen_ui_${Date.now()}`
      }
    });

    return this.cleanupGeneratedCode(response.content);
  }

  /**
   * Generate types file
   */
  private async generateTypesFile(request: EnhancedModuleRequest): Promise<string> {
    const prompt = `Generate TypeScript type definitions for a ${request.category} AI module.

Module: ${request.name}
Features: ${request.features.join(', ')}
Database: ${request.database ? 'Yes' : 'No'}
Real-time: ${request.realtime ? 'Yes' : 'No'}

Include types for:
1. Input and output interfaces
2. Configuration options
3. Error types
4. Event types (if real-time)
5. Database models (if database enabled)

Generate comprehensive, well-documented TypeScript types.`;

    const response = await aiGateway.process({
      model: 'gpt-3.5-turbo',
      prompt,
      options: {
        temperature: 0.2,
        maxTokens: 1500
      },
      metadata: {
        moduleId: request.id,
        requestId: `gen_types_${Date.now()}`
      }
    });

    return this.cleanupGeneratedCode(response.content);
  }

  /**
   * Generate test file
   */
  private async generateTestFile(request: EnhancedModuleRequest): Promise<string> {
    const prompt = `Generate Jest unit tests for a ${request.category} AI module processor.

Module: ${request.name}
Description: ${request.description}

Generate comprehensive tests including:
1. Basic functionality tests
2. Error handling tests
3. Edge case tests
4. Mock AI responses
5. Async operation tests

Use modern Jest syntax with TypeScript.`;

    const response = await aiGateway.process({
      model: 'gpt-3.5-turbo',
      prompt,
      options: {
        temperature: 0.3,
        maxTokens: 1800
      },
      metadata: {
        moduleId: request.id,
        requestId: `gen_tests_${Date.now()}`
      }
    });

    return this.cleanupGeneratedCode(response.content);
  }

  /**
   * Generate database schema if needed
   */
  private async generateDatabaseSchema(request: EnhancedModuleRequest): Promise<string> {
    if (!request.database) return '';

    const prompt = `Generate a Prisma database schema for a ${request.category} AI module.

Module: ${request.name}
Features: ${request.features.join(', ')}

Include models for:
1. User data and preferences
2. Processing history and results
3. Analytics and metrics
4. Configuration settings

Generate a complete Prisma schema with proper relationships.`;

    const response = await aiGateway.process({
      model: 'gpt-3.5-turbo',
      prompt,
      options: {
        temperature: 0.2,
        maxTokens: 1200
      },
      metadata: {
        moduleId: request.id,
        requestId: `gen_schema_${Date.now()}`
      }
    });

    return this.cleanupGeneratedCode(response.content);
  }

  /**
   * Generate Kiro specifications
   */
  private async generateKiroSpecs(request: EnhancedModuleRequest): Promise<any> {
    // Convert request to KiroModule format
    const tempModule: KiroModule = {
      id: request.id,
      name: request.name,
      version: request.version,
      description: request.description,
      author: request.author,
      category: request.category as any,
      status: 'draft',
      config: {
        inputSchema: {},
        outputSchema: {},
        supportedContentTypes: ['text/plain', 'application/pdf'],
        processingModes: ['realtime' as any],
        uiComponents: [],
        endpoints: []
      },
      specs: {
        specFiles: [],
        requirements: [],
        testCases: []
      },
      hooks: {},
      steering: {
        behaviorRules: [],
        contextGuidelines: [],
        qualityStandards: []
      },
      kiroCompatibility: '1.0.0',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return await kiroSpecGenerator.generateKiroSpecs(tempModule);
  }

  /**
   * Generate hooks
   */
  private async generateHooks(request: EnhancedModuleRequest): Promise<string[]> {
    const hooks: string[] = [];

    // Generate content processing hook
    const hookId = await hookManager.registerHook({
      name: `${request.name} Content Processing`,
      moduleId: request.id,
      trigger: {
        event: 'content.uploaded',
        source: 'framework'
      },
      actions: [
        {
          type: 'process_content',
          target: request.id,
          parameters: { autoProcess: true },
          timeout: 30000,
          retryPolicy: {
            maxAttempts: 3,
            backoffStrategy: 'exponential',
            initialDelay: 1000,
            maxDelay: 10000
          }
        }
      ],
      metadata: {
        description: `Automatically processes content for ${request.name}`,
        tags: [request.category, 'automation'],
        priority: 'normal',
        category: request.category,
        author: request.author
      }
    });

    hooks.push(hookId);
    return hooks;
  }

  /**
   * Generate steering
   */
  private async generateSteering(request: EnhancedModuleRequest): Promise<string> {
    const doc = await steeringEngine.generateSteeringDocument(
      request.id,
      request.category
    );
    return doc.content;
  }

  /**
   * Generate documentation
   */
  private async generateDocumentation(request: EnhancedModuleRequest, config: ModuleConfig): Promise<string> {
    const prompt = `Generate comprehensive documentation for an AI module.

Module: ${request.name}
Description: ${request.description}
Category: ${request.category}
Features: ${request.features.join(', ')}
AI Models: ${request.aiModels.join(', ')}

Generate a complete README.md with:
1. Overview and features
2. Installation instructions
3. Usage examples
4. API reference
5. Configuration options
6. Contributing guidelines
7. License information

Make it professional and comprehensive.`;

    const response = await aiGateway.process({
      model: 'gpt-4',
      prompt,
      options: {
        temperature: 0.3,
        maxTokens: 3000
      },
      metadata: {
        moduleId: request.id,
        requestId: `gen_docs_${Date.now()}`
      }
    });

    return response.content;
  }

  /**
   * Generate setup instructions
   */
  private generateSetupInstructions(request: EnhancedModuleRequest, config: ModuleConfig): string {
    return `# ${request.name} Setup Instructions

## Prerequisites
- Node.js 18+
- npm or yarn
${request.database ? '- PostgreSQL or MySQL database' : ''}

## Installation

1. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

${request.database ? `
2. **Set up database**
   \`\`\`bash
   npx prisma migrate dev
   npx prisma generate
   \`\`\`
` : ''}

3. **Configure environment variables**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your configuration
   \`\`\`

4. **Build the module**
   \`\`\`bash
   npm run build
   \`\`\`

5. **Run tests**
   \`\`\`bash
   npm test
   \`\`\`

## Development

- **Start development mode**: \`npm run dev\`
- **Run tests**: \`npm test\`
- **Lint code**: \`npm run lint\`

## Integration with GhostFrame

1. Copy the built module to your GhostFrame modules directory
2. Register the module in the GhostFrame registry
3. Configure the module settings in the admin panel

Your module is now ready to use! 🎃`;
  }

  /**
   * Generate dependencies list
   */
  private generateDependencies(request: EnhancedModuleRequest): string[] {
    const deps = [
      '@ghostframe/core',
      'typescript',
      'react',
      '@types/react',
      '@types/node',
      'jest',
      '@types/jest'
    ];

    if (request.database) {
      deps.push('prisma', '@prisma/client');
    }

    if (request.realtime) {
      deps.push('socket.io', 'socket.io-client');
    }

    return deps;
  }

  // Helper methods

  private generateIndexFile(request: EnhancedModuleRequest): string {
    return `// 🎃 ${request.name} Module Entry Point
// Generated by GhostFrame Enhanced Module Generator

export { ${this.toPascalCase(request.id)}Processor } from './${request.id}Processor';
export { ${this.toPascalCase(request.id)}Panel } from './ui/${request.id}Panel';
export * from './types';

// Module configuration
export const moduleConfig = {
  id: '${request.id}',
  name: '${request.name}',
  version: '${request.version}',
  category: '${request.category}',
  description: '${request.description}',
  author: '${request.author}'
};`;
  }

  private generateTSConfig(): string {
    return JSON.stringify({
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
        jsx: 'react-jsx'
      },
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist', '**/*.test.ts']
    }, null, 2);
  }

  private cleanupGeneratedCode(code: string): string {
    // Remove markdown code blocks if present
    return code
      .replace(/```typescript\n?/g, '')
      .replace(/```tsx\n?/g, '')
      .replace(/```javascript\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
  }

  private toPascalCase(str: string): string {
    return str
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }
}

// Singleton instance
export const enhancedModuleGenerator = new EnhancedModuleGenerator();