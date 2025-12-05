// 🎃 GhostFrame Template Generator Service
// Generates module templates with Kiro specs, hooks, and steering documents

import { KiroModule, ModuleCategory } from '../types/framework';
import { kiroSpecGenerator } from './KiroSpecGenerator';

export interface TemplateGenerationRequest {
  moduleName: string;
  domain: ModuleCategory;
  description?: string;
  author?: string;
  features?: string[];
  kiroIntegration?: {
    includeSpecs: boolean;
    includeHooks: boolean;
    includeSteering: boolean;
  };
}

export interface GeneratedTemplate {
  moduleConfig: KiroModule;
  kiroSpecs: {
    requirements: string;
    design: string;
    tasks: string;
  };
  hooks: string[];
  steering: string;
  setupInstructions: string[];
  dependencies: string[];
}

export class TemplateGenerator {
  
  /**
   * Generate a complete module template with Kiro integration
   */
  async generateTemplate(request: TemplateGenerationRequest): Promise<GeneratedTemplate> {
    const moduleId = this.generateModuleId(request.moduleName);
    const moduleConfig = this.generateModuleConfig(request, moduleId);
    const kiroSpecs = await this.generateKiroSpecs(request, moduleId);
    const hooks = this.generateHooks(request, moduleId);
    const steering = this.generateSteering(request, moduleId);
    const setupInstructions = this.generateSetupInstructions(request, moduleId);
    const dependencies = this.generateDependencies(request);

    return {
      moduleConfig,
      kiroSpecs,
      hooks,
      steering,
      setupInstructions,
      dependencies
    };
  }

  /**
   * Generate module configuration
   */
  private generateModuleConfig(request: TemplateGenerationRequest, moduleId: string): KiroModule {
    const domainConfig = this.getDomainSpecificConfig(request.domain);
    
    return {
      id: moduleId,
      name: request.moduleName,
      version: '1.0.0',
      description: request.description || `AI-powered ${request.domain} module built with GhostFrame`,
      author: request.author || 'Module Developer',
      category: request.domain,
      kiroCompatibility: '1.0.0',
      config: {
        inputSchema: domainConfig.inputSchema,
        outputSchema: domainConfig.outputSchema,
        supportedContentTypes: domainConfig.supportedContentTypes,
        processingModes: domainConfig.processingModes,
        uiComponents: [
          {
            componentType: 'generator',
            componentPath: `/components/${this.toPascalCase(request.moduleName)}/Generator`,
            props: {},
            permissions: []
          }
        ],
        endpoints: [
          {
            path: `/api/${moduleId}/process`,
            method: 'POST',
            handler: 'processContent'
          }
        ]
      },
      specs: {
        specFiles: [`.kiro/specs/${moduleId}.md`],
        requirements: [],
        testCases: []
      },
      hooks: {
        onContentUpload: 'processContentForModule',
        onProcessingComplete: 'notifyProcessingComplete'
      },
      steering: {
        behaviorRules: domainConfig.behaviorRules,
        contextGuidelines: domainConfig.contextGuidelines,
        qualityStandards: domainConfig.qualityStandards
      },
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Generate Kiro specification files using the advanced spec generator
   */
  private async generateKiroSpecs(request: TemplateGenerationRequest, moduleId: string): Promise<{
    requirements: string;
    design: string;
    tasks: string;
  }> {
    const moduleConfig = this.generateModuleConfig(request, moduleId);
    
    try {
      // Use the advanced Kiro spec generator
      const generatedSpecs = await kiroSpecGenerator.generateKiroSpecs(moduleConfig);
      
      return {
        requirements: generatedSpecs.requirements.content,
        design: generatedSpecs.design.content,
        tasks: generatedSpecs.tasks.content
      };
    } catch (error) {
      console.warn('Advanced spec generation failed, falling back to basic templates:', error);
      
      // Fallback to basic generation
      const requirements = this.generateRequirementsSpec(request, moduleId);
      const design = this.generateDesignSpec(request, moduleId);
      const tasks = this.generateTasksSpec(request, moduleId);

      return { requirements, design, tasks };
    }
  }

  /**
   * Generate requirements specification
   */
  private generateRequirementsSpec(request: TemplateGenerationRequest, moduleId: string): string {
    return `# ${request.moduleName} Requirements Document

## Introduction

${request.moduleName} is a ${request.domain} module built with the GhostFrame framework. ${request.description || `This module provides AI-powered ${request.domain} capabilities for processing and generating content.`}

## Glossary

- **${request.moduleName}**: The AI module providing ${request.domain} functionality
- **Content_Processor**: Component responsible for processing input content
- **AI_Engine**: Core AI processing component for ${request.domain} tasks
- **Output_Generator**: Component that formats and delivers processed results

## Requirements

### Requirement 1

**User Story:** As a user, I want to process ${request.domain} content so that I can get AI-generated results

#### Acceptance Criteria

1. WHEN a user provides input content, THE Content_Processor SHALL validate and process the input
2. WHEN content is processed, THE AI_Engine SHALL generate ${request.domain}-specific output
3. THE Output_Generator SHALL format results according to the output schema
4. IF processing fails, THEN THE ${request.moduleName} SHALL provide clear error messages
5. THE ${request.moduleName} SHALL integrate with Kiro's agent architecture

### Requirement 2

**User Story:** As a developer, I want Kiro integration so that I can leverage agent workflows

#### Acceptance Criteria

1. THE ${request.moduleName} SHALL include comprehensive Kiro specs
2. THE ${request.moduleName} SHALL support hook-based automation
3. THE ${request.moduleName} SHALL follow steering guidelines for AI behavior
4. THE ${request.moduleName} SHALL be compatible with other GhostFrame modules
5. THE ${request.moduleName} SHALL provide clear documentation and examples
`;
  }

  /**
   * Generate design specification
   */
  private generateDesignSpec(request: TemplateGenerationRequest, moduleId: string): string {
    return `# ${request.moduleName} Design Document

## Overview

${request.moduleName} is designed as a ${request.domain} module within the GhostFrame ecosystem. The module follows the framework's patterns for AI processing, Kiro integration, and user interaction.

## Architecture

### Component Structure

\`\`\`
${request.moduleName}
├── Content Processing Layer
│   ├── Input Validation
│   ├── Content Analysis
│   └── Preprocessing
├── AI Processing Engine
│   ├── ${this.toPascalCase(request.domain)} AI Logic
│   ├── Quality Validation
│   └── Output Generation
└── Integration Layer
    ├── Kiro Hooks
    ├── Steering Rules
    └── Framework APIs
\`\`\`

## Data Models

### Input Schema
\`\`\`typescript
interface ${this.toPascalCase(moduleId)}Input {
  content: string;
  options?: {
    // Domain-specific options
  };
}
\`\`\`

### Output Schema
\`\`\`typescript
interface ${this.toPascalCase(moduleId)}Output {
  result: any; // Domain-specific result
  metadata: {
    processingTime: number;
    confidence: number;
    moduleVersion: string;
  };
}
\`\`\`

## Kiro Integration

### Hooks
- **onContentUpload**: Triggered when new content is uploaded
- **onProcessingComplete**: Triggered when processing finishes

### Steering Rules
- Quality standards for ${request.domain} content
- AI behavior guidelines
- Output formatting rules

## Error Handling

The module implements comprehensive error handling for:
- Invalid input validation
- AI processing failures
- Integration errors
- Resource limitations
`;
  }

  /**
   * Generate tasks specification
   */
  private generateTasksSpec(request: TemplateGenerationRequest, moduleId: string): string {
    return `# ${request.moduleName} Implementation Plan

- [ ] 1. Set up module structure and configuration
  - Create module directory structure
  - Configure package.json and dependencies
  - Set up TypeScript configuration
  - _Requirements: 1.1, 2.1_

- [ ] 2. Implement core processing logic
  - [ ] 2.1 Build input validation system
    - Create input schema validation
    - Implement content preprocessing
    - Add error handling for invalid inputs
    - _Requirements: 1.1_
  
  - [ ] 2.2 Develop AI processing engine
    - Implement ${request.domain}-specific AI logic
    - Add quality validation and scoring
    - Create output generation system
    - _Requirements: 1.2, 1.3_

- [ ] 3. Create user interface components
  - [ ] 3.1 Build generator component
    - Create React component for content input
    - Implement processing status display
    - Add result visualization
    - _Requirements: 1.1, 1.2, 1.3_

- [ ] 4. Implement Kiro integration
  - [ ] 4.1 Set up Kiro hooks
    - Create content upload hooks
    - Implement processing completion hooks
    - Add error handling hooks
    - _Requirements: 2.2, 2.3_
  
  - [ ] 4.2 Configure steering rules
    - Define AI behavior guidelines
    - Set quality standards
    - Create output formatting rules
    - _Requirements: 2.3, 2.5_

- [ ] 5. Add API endpoints
  - Create processing endpoint
  - Implement status checking endpoint
  - Add configuration endpoint
  - _Requirements: 1.1, 1.2, 1.3_

- [ ]* 6. Testing and validation
  - Write unit tests for core logic
  - Create integration tests
  - Add performance testing
  - _Requirements: All requirements validation_
`;
  }

  /**
   * Generate hook templates
   */
  private generateHooks(request: TemplateGenerationRequest, moduleId: string): string[] {
    return [
      `# ${request.moduleName} Content Processing Hook

## Trigger
- File upload completion
- Content analysis request

## Actions
1. Validate input content for ${request.domain} processing
2. Queue content for AI processing
3. Update processing status
4. Notify dependent systems

## Integration
- Framework: GhostFrame
- Module: ${moduleId}
- Kiro Compatibility: 1.0.0
`,
      `# ${request.moduleName} Processing Complete Hook

## Trigger
- AI processing completion
- Result generation finished

## Actions
1. Validate output quality
2. Store results in module registry
3. Trigger downstream workflows
4. Send completion notifications

## Integration
- Framework: GhostFrame
- Module: ${moduleId}
- Kiro Compatibility: 1.0.0
`
    ];
  }

  /**
   * Generate steering document
   */
  private generateSteering(request: TemplateGenerationRequest, moduleId: string): string {
    const domainGuidelines = this.getDomainSteeringGuidelines(request.domain);
    
    return `# ${request.moduleName} AI Steering Guidelines

## ${this.toPascalCase(request.domain)} AI Behavior

### Quality Standards
${domainGuidelines.qualityStandards.map((standard: string) => `- ${standard}`).join('\n')}

### Content Guidelines
${domainGuidelines.contentGuidelines.map((guideline: string) => `- ${guideline}`).join('\n')}

### Processing Rules
${domainGuidelines.processingRules.map((rule: string) => `- ${rule}`).join('\n')}

### Integration Guidelines
- Follow GhostFrame module patterns
- Maintain Kiro compatibility
- Ensure cross-module compatibility
- Provide clear error messages

### Performance Standards
- Response time: < 5 seconds for typical content
- Accuracy: > 85% for domain-specific tasks
- Resource usage: Efficient memory and CPU utilization
- Scalability: Support concurrent processing
`;
  }

  /**
   * Generate setup instructions
   */
  private generateSetupInstructions(request: TemplateGenerationRequest, moduleId: string): string[] {
    return [
      '1. Create module directory structure',
      '2. Install dependencies using npm or yarn',
      '3. Configure environment variables',
      '4. Set up Kiro specs in .kiro/specs/',
      '5. Create hook files in .kiro/hooks/',
      '6. Add steering document to .kiro/steering/',
      '7. Implement core processing logic',
      '8. Create UI components',
      '9. Add API endpoints',
      '10. Test module functionality',
      '11. Register module with GhostFrame registry'
    ];
  }

  /**
   * Generate dependencies list
   */
  private generateDependencies(request: TemplateGenerationRequest): string[] {
    const baseDependencies = [
      'express',
      'typescript',
      'react',
      '@types/node',
      '@types/react'
    ];

    const domainDependencies = this.getDomainDependencies(request.domain);
    
    return [...baseDependencies, ...domainDependencies];
  }

  // Helper methods

  private generateModuleId(moduleName: string): string {
    return moduleName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private toPascalCase(str: string): string {
    return str
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }

  private getDomainSpecificConfig(domain: ModuleCategory) {
    const configs: Record<string, any> = {
      education: {
        inputSchema: { type: 'object', properties: { content: { type: 'string' }, difficulty: { type: 'string' } } },
        outputSchema: { type: 'object', properties: { questions: { type: 'array' }, summary: { type: 'string' } } },
        supportedContentTypes: ['text/plain', 'application/pdf'],
        processingModes: ['realtime', 'batch'] as any[],
        behaviorRules: [
          { id: 'educational-focus', condition: 'content_type == educational', action: 'prioritize_learning_objectives', priority: 1 }
        ],
        contextGuidelines: ['Focus on educational value', 'Ensure content clarity'],
        qualityStandards: [
          { metric: 'content_relevance', threshold: 0.8, description: 'Content must be educationally relevant' }
        ]
      },
      storytelling: {
        inputSchema: { type: 'object', properties: { content: { type: 'string' }, theme: { type: 'string' } } },
        outputSchema: { type: 'object', properties: { story: { type: 'object' }, characters: { type: 'array' } } },
        supportedContentTypes: ['text/plain', 'application/pdf'],
        processingModes: ['realtime', 'interactive'] as any[],
        behaviorRules: [
          { id: 'narrative-coherence', condition: 'story_length > 100', action: 'ensure_plot_consistency', priority: 1 }
        ],
        contextGuidelines: ['Maintain narrative flow', 'Create engaging characters'],
        qualityStandards: [
          { metric: 'story_coherence', threshold: 0.85, description: 'Story must have coherent plot' }
        ]
      }
    };

    return configs[domain] || configs.education;
  }

  private getDomainSteeringGuidelines(domain: ModuleCategory) {
    const guidelines: Record<string, any> = {
      education: {
        qualityStandards: [
          'Generated content must be educationally valuable',
          'Questions should be clear and unambiguous',
          'Difficulty levels should be appropriate for target audience'
        ],
        contentGuidelines: [
          'Focus on learning objectives',
          'Provide clear explanations',
          'Include relevant examples'
        ],
        processingRules: [
          'Validate educational content quality',
          'Ensure age-appropriate language',
          'Maintain factual accuracy'
        ]
      },
      storytelling: {
        qualityStandards: [
          'Stories must have coherent narrative structure',
          'Characters should be well-developed',
          'Plot should be engaging and logical'
        ],
        contentGuidelines: [
          'Maintain consistent tone and style',
          'Create immersive experiences',
          'Balance creativity with coherence'
        ],
        processingRules: [
          'Ensure narrative consistency',
          'Validate character development',
          'Maintain thematic coherence'
        ]
      }
    };

    return guidelines[domain] || guidelines.education;
  }

  private getDomainDependencies(domain: ModuleCategory): string[] {
    const dependencies = {
      education: ['@types/jest', 'jest'],
      storytelling: ['@types/jest', 'jest'],
      research: ['@types/jest', 'jest', 'pdf-parse'],
      productivity: ['@types/jest', 'jest', 'node-cron'],
      games: ['@types/jest', 'jest', 'canvas'],
      creative: ['@types/jest', 'jest', 'sharp'],
      analytics: ['@types/jest', 'jest', 'd3'],
      communication: ['@types/jest', 'jest', 'nodemailer'],
      other: ['@types/jest', 'jest']
    };

    return dependencies[domain] || dependencies.other;
  }
}

// Singleton instance
export const templateGenerator = new TemplateGenerator();