// 🎃 GhostFrame Kiro Spec Generation System
// Automated generation and validation of Kiro specifications

import { KiroModule, ModuleCategory } from '../types/framework';

export interface KiroSpecValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  complianceScore: number;
}

export interface SpecTemplate {
  domain: string;
  template: string;
  variables: TemplateVariable[];
  examples: SpecExample[];
  validation: ValidationRule[];
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'array' | 'object' | 'boolean';
  required: boolean;
  description: string;
  defaultValue?: any;
}

export interface SpecExample {
  title: string;
  content: string;
  domain: string;
}

export interface ValidationRule {
  id: string;
  pattern: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface GeneratedKiroSpecs {
  requirements: {
    content: string;
    validation: KiroSpecValidationResult;
  };
  design: {
    content: string;
    validation: KiroSpecValidationResult;
  };
  tasks: {
    content: string;
    validation: KiroSpecValidationResult;
  };
  hooks: {
    content: string[];
    validation: KiroSpecValidationResult;
  };
  steering: {
    content: string;
    validation: KiroSpecValidationResult;
  };
}

export class KiroSpecGenerator {
  private specTemplates: Map<string, SpecTemplate>;
  private validationRules: ValidationRule[];

  constructor() {
    this.specTemplates = new Map();
    this.validationRules = [];
    this.initializeTemplates();
    this.initializeValidationRules();
  }

  /**
   * Generate complete Kiro specs for a module
   */
  async generateKiroSpecs(moduleConfig: KiroModule): Promise<GeneratedKiroSpecs> {
    const requirements = await this.generateRequirements(moduleConfig);
    const design = await this.generateDesign(moduleConfig);
    const tasks = await this.generateTasks(moduleConfig);
    const hooks = await this.generateHooks(moduleConfig);
    const steering = await this.generateSteering(moduleConfig);

    return {
      requirements: {
        content: requirements,
        validation: await this.validateSpec(requirements, 'requirements')
      },
      design: {
        content: design,
        validation: await this.validateSpec(design, 'design')
      },
      tasks: {
        content: tasks,
        validation: await this.validateSpec(tasks, 'tasks')
      },
      hooks: {
        content: hooks,
        validation: await this.validateHooks(hooks)
      },
      steering: {
        content: steering,
        validation: await this.validateSpec(steering, 'steering')
      }
    };
  }

  /**
   * Generate requirements specification
   */
  async generateRequirements(moduleConfig: KiroModule): Promise<string> {
    const template = this.getTemplate(moduleConfig.category, 'requirements');
    const variables = this.extractVariables(moduleConfig);

    return this.processTemplate(template, variables);
  }

  /**
   * Generate design specification
   */
  async generateDesign(moduleConfig: KiroModule): Promise<string> {
    const template = this.getTemplate(moduleConfig.category, 'design');
    const variables = this.extractVariables(moduleConfig);

    // Add architecture-specific variables
    variables.architecture = this.generateArchitectureSection(moduleConfig);
    variables.dataModels = this.generateDataModelsSection(moduleConfig);
    variables.apiEndpoints = this.generateAPIEndpointsSection(moduleConfig);

    return this.processTemplate(template, variables);
  }

  /**
   * Generate tasks specification
   */
  async generateTasks(moduleConfig: KiroModule): Promise<string> {
    const template = this.getTemplate(moduleConfig.category, 'tasks');
    const variables = this.extractVariables(moduleConfig);

    // Add task-specific variables
    variables.implementationTasks = this.generateImplementationTasks(moduleConfig);
    variables.testingTasks = this.generateTestingTasks(moduleConfig);
    variables.integrationTasks = this.generateIntegrationTasks(moduleConfig);

    return this.processTemplate(template, variables);
  }

  /**
   * Generate hook specifications
   */
  async generateHooks(moduleConfig: KiroModule): Promise<string[]> {
    const hooks: string[] = [];
    
    // Generate content processing hook
    if (moduleConfig.hooks.onContentUpload) {
      hooks.push(this.generateContentProcessingHook(moduleConfig));
    }

    // Generate completion hook
    if (moduleConfig.hooks.onProcessingComplete) {
      hooks.push(this.generateCompletionHook(moduleConfig));
    }

    // Generate user interaction hook
    if (moduleConfig.hooks.onUserInteraction) {
      hooks.push(this.generateUserInteractionHook(moduleConfig));
    }

    // Generate module lifecycle hooks
    if (moduleConfig.hooks.onModuleInstall) {
      hooks.push(this.generateInstallationHook(moduleConfig));
    }

    return hooks;
  }

  /**
   * Generate steering document
   */
  async generateSteering(moduleConfig: KiroModule): Promise<string> {
    const template = this.getTemplate(moduleConfig.category, 'steering');
    const variables = this.extractVariables(moduleConfig);

    // Add steering-specific variables
    variables.behaviorRules = this.formatBehaviorRules(moduleConfig.steering.behaviorRules);
    variables.contextGuidelines = this.formatContextGuidelines(moduleConfig.steering.contextGuidelines);
    variables.qualityStandards = this.formatQualityStandards(moduleConfig.steering.qualityStandards);

    return this.processTemplate(template, variables);
  }

  /**
   * Validate Kiro spec compliance
   */
  async validateSpec(content: string, specType: string): Promise<KiroSpecValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    let complianceScore = 100;

    // Apply validation rules
    for (const rule of this.validationRules) {
      if (rule.id.includes(specType) || rule.id === 'general') {
        const regex = new RegExp(rule.pattern, 'gi');
        const matches = content.match(regex);

        if (rule.severity === 'error' && !matches) {
          errors.push(rule.message);
          complianceScore -= 20;
        } else if (rule.severity === 'warning' && !matches) {
          warnings.push(rule.message);
          complianceScore -= 5;
        }
      }
    }

    // Specific validations for each spec type
    switch (specType) {
      case 'requirements':
        this.validateRequirementsSpec(content, errors, warnings);
        break;
      case 'design':
        this.validateDesignSpec(content, errors, warnings);
        break;
      case 'tasks':
        this.validateTasksSpec(content, errors, warnings);
        break;
      case 'steering':
        this.validateSteeringSpec(content, errors, warnings);
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      complianceScore: Math.max(0, complianceScore)
    };
  }

  /**
   * Validate hooks
   */
  async validateHooks(hooks: string[]): Promise<KiroSpecValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    let complianceScore = 100;

    if (hooks.length === 0) {
      warnings.push('No hooks defined - consider adding automation hooks');
      complianceScore -= 10;
    }

    for (const hook of hooks) {
      // Validate hook structure
      if (!hook.includes('## Trigger')) {
        errors.push('Hook missing trigger section');
        complianceScore -= 15;
      }

      if (!hook.includes('## Actions')) {
        errors.push('Hook missing actions section');
        complianceScore -= 15;
      }

      if (!hook.includes('## Integration')) {
        warnings.push('Hook missing integration section');
        complianceScore -= 5;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      complianceScore: Math.max(0, complianceScore)
    };
  }

  // Private methods

  private initializeTemplates(): void {
    // Requirements templates
    this.specTemplates.set('education-requirements', {
      domain: 'education',
      template: `# {{moduleName}} Requirements Document

## Introduction

{{moduleName}} is an educational AI module built with the GhostFrame framework. {{description}}

## Glossary

- **{{moduleName}}**: The AI module providing educational functionality
- **Content_Processor**: Component responsible for processing educational content
- **Learning_Engine**: Core AI processing component for educational tasks
- **Assessment_Generator**: Component that creates educational assessments

## Requirements

### Requirement 1

**User Story:** As an educator, I want to process educational content so that I can create learning materials

#### Acceptance Criteria

1. WHEN educational content is uploaded, THE Content_Processor SHALL validate and process the input
2. WHEN content is processed, THE Learning_Engine SHALL generate educational materials
3. THE Assessment_Generator SHALL create appropriate assessments
4. IF processing fails, THEN THE {{moduleName}} SHALL provide clear error messages
5. THE {{moduleName}} SHALL integrate with Kiro's agent architecture

### Requirement 2

**User Story:** As a learner, I want interactive educational experiences so that I can learn effectively

#### Acceptance Criteria

1. THE {{moduleName}} SHALL provide interactive learning interfaces
2. THE {{moduleName}} SHALL track learning progress
3. THE {{moduleName}} SHALL adapt to different learning styles
4. THE {{moduleName}} SHALL provide immediate feedback
5. THE {{moduleName}} SHALL support collaborative learning features
`,
      variables: [
        { name: 'moduleName', type: 'string', required: true, description: 'Name of the module' },
        { name: 'description', type: 'string', required: true, description: 'Module description' }
      ],
      examples: [],
      validation: []
    });

    // Add more templates for other domains and spec types
    this.addDesignTemplates();
    this.addTasksTemplates();
    this.addSteeringTemplates();
  }

  private addDesignTemplates(): void {
    this.specTemplates.set('education-design', {
      domain: 'education',
      template: `# {{moduleName}} Design Document

## Overview

{{moduleName}} is designed as an educational AI module within the GhostFrame ecosystem. {{description}}

## Architecture

{{architecture}}

## Data Models

{{dataModels}}

## API Endpoints

{{apiEndpoints}}

## Kiro Integration

### Hooks
- **onContentUpload**: Triggered when educational content is uploaded
- **onLearningComplete**: Triggered when learning session completes

### Steering Rules
- Educational content quality standards
- Age-appropriate content filtering
- Learning objective alignment
`,
      variables: [
        { name: 'moduleName', type: 'string', required: true, description: 'Name of the module' },
        { name: 'description', type: 'string', required: true, description: 'Module description' },
        { name: 'architecture', type: 'string', required: true, description: 'Architecture description' },
        { name: 'dataModels', type: 'string', required: true, description: 'Data models section' },
        { name: 'apiEndpoints', type: 'string', required: true, description: 'API endpoints section' }
      ],
      examples: [],
      validation: []
    });
  }

  private addTasksTemplates(): void {
    this.specTemplates.set('education-tasks', {
      domain: 'education',
      template: `# {{moduleName}} Implementation Plan

{{implementationTasks}}

{{integrationTasks}}

{{testingTasks}}
`,
      variables: [
        { name: 'moduleName', type: 'string', required: true, description: 'Name of the module' },
        { name: 'implementationTasks', type: 'string', required: true, description: 'Implementation tasks' },
        { name: 'integrationTasks', type: 'string', required: true, description: 'Integration tasks' },
        { name: 'testingTasks', type: 'string', required: true, description: 'Testing tasks' }
      ],
      examples: [],
      validation: []
    });
  }

  private addSteeringTemplates(): void {
    this.specTemplates.set('education-steering', {
      domain: 'education',
      template: `# {{moduleName}} AI Steering Guidelines

## Educational AI Behavior

### Quality Standards
{{qualityStandards}}

### Content Guidelines
{{contextGuidelines}}

### Behavior Rules
{{behaviorRules}}

### Integration Guidelines
- Follow GhostFrame module patterns
- Maintain Kiro compatibility
- Ensure educational effectiveness
- Provide clear learning outcomes
`,
      variables: [
        { name: 'moduleName', type: 'string', required: true, description: 'Name of the module' },
        { name: 'qualityStandards', type: 'string', required: true, description: 'Quality standards' },
        { name: 'contextGuidelines', type: 'string', required: true, description: 'Context guidelines' },
        { name: 'behaviorRules', type: 'string', required: true, description: 'Behavior rules' }
      ],
      examples: [],
      validation: []
    });
  }

  private initializeValidationRules(): void {
    this.validationRules = [
      {
        id: 'general-title',
        pattern: '^#\\s+.+Requirements Document|^#\\s+.+Design Document|^#\\s+.+Implementation Plan',
        message: 'Document must have a proper title',
        severity: 'error'
      },
      {
        id: 'requirements-user-story',
        pattern: '\\*\\*User Story:\\*\\*',
        message: 'Requirements must include user stories',
        severity: 'error'
      },
      {
        id: 'requirements-acceptance-criteria',
        pattern: '#### Acceptance Criteria',
        message: 'Requirements must include acceptance criteria',
        severity: 'error'
      },
      {
        id: 'requirements-shall',
        pattern: 'SHALL',
        message: 'Requirements should use SHALL for mandatory requirements',
        severity: 'warning'
      },
      {
        id: 'design-architecture',
        pattern: '## Architecture',
        message: 'Design document should include architecture section',
        severity: 'warning'
      },
      {
        id: 'tasks-checkbox',
        pattern: '- \\[ \\]',
        message: 'Tasks should be formatted as checkboxes',
        severity: 'error'
      },
      {
        id: 'steering-behavior-rules',
        pattern: '### Behavior Rules|## Behavior Rules',
        message: 'Steering document should include behavior rules',
        severity: 'warning'
      }
    ];
  }

  private getTemplate(domain: ModuleCategory, specType: string): string {
    const templateKey = `${domain}-${specType}`;
    const template = this.specTemplates.get(templateKey);
    
    if (!template) {
      // Fallback to generic template
      return this.getGenericTemplate(specType);
    }
    
    return template.template;
  }

  private getGenericTemplate(specType: string): string {
    const genericTemplates: Record<string, string> = {
      requirements: `# {{moduleName}} Requirements Document

## Introduction
{{description}}

## Requirements

### Requirement 1
**User Story:** As a user, I want to use {{moduleName}} so that I can accomplish my goals

#### Acceptance Criteria
1. THE {{moduleName}} SHALL process user input
2. THE {{moduleName}} SHALL provide appropriate output
3. THE {{moduleName}} SHALL integrate with Kiro architecture
`,
      design: `# {{moduleName}} Design Document

## Overview
{{description}}

## Architecture
{{architecture}}

## Integration
- Kiro compatibility
- Framework integration
`,
      tasks: `# {{moduleName}} Implementation Plan

- [ ] 1. Set up module structure
- [ ] 2. Implement core functionality
- [ ] 3. Add Kiro integration
- [ ] 4. Test and validate
`,
      steering: `# {{moduleName}} AI Steering Guidelines

## AI Behavior
- Follow best practices
- Ensure quality output
- Maintain consistency
`
    };

    return genericTemplates[specType] || '# {{moduleName}}\n\n{{description}}';
  }

  private extractVariables(moduleConfig: KiroModule): Record<string, any> {
    return {
      moduleName: moduleConfig.name,
      moduleId: moduleConfig.id,
      description: moduleConfig.description,
      author: moduleConfig.author,
      version: moduleConfig.version,
      category: moduleConfig.category,
      domain: moduleConfig.category
    };
  }

  private processTemplate(template: string, variables: Record<string, any>): string {
    let processed = template;
    
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processed = processed.replace(regex, String(value));
    }
    
    return processed;
  }

  private generateArchitectureSection(moduleConfig: KiroModule): string {
    return `### Component Structure
\`\`\`
${moduleConfig.name}
├── Input Processing
├── Core Logic
├── Output Generation
└── Kiro Integration
\`\`\``;
  }

  private generateDataModelsSection(moduleConfig: KiroModule): string {
    return `### Input Schema
\`\`\`typescript
${JSON.stringify(moduleConfig.config.inputSchema, null, 2)}
\`\`\`

### Output Schema
\`\`\`typescript
${JSON.stringify(moduleConfig.config.outputSchema, null, 2)}
\`\`\``;
  }

  private generateAPIEndpointsSection(moduleConfig: KiroModule): string {
    return moduleConfig.config.endpoints.map(endpoint => 
      `- **${endpoint.method} ${endpoint.path}**: ${endpoint.handler || 'Process request'}`
    ).join('\n');
  }

  private generateImplementationTasks(moduleConfig: KiroModule): string {
    return `- [ ] 1. Set up ${moduleConfig.name} module structure
- [ ] 2. Implement core ${moduleConfig.category} functionality
- [ ] 3. Add input/output processing
- [ ] 4. Integrate with GhostFrame APIs`;
  }

  private generateTestingTasks(moduleConfig: KiroModule): string {
    return `- [ ]* 5. Write unit tests for core logic
- [ ]* 6. Add integration tests
- [ ]* 7. Test Kiro compatibility`;
  }

  private generateIntegrationTasks(moduleConfig: KiroModule): string {
    return `- [ ] 8. Set up Kiro hooks
- [ ] 9. Configure steering rules
- [ ] 10. Test end-to-end workflow`;
  }

  private generateContentProcessingHook(moduleConfig: KiroModule): string {
    return `# ${moduleConfig.name} Content Processing Hook

## Trigger
- File upload completion
- Content analysis request

## Actions
1. Validate input content for ${moduleConfig.category} processing
2. Queue content for AI processing
3. Update processing status
4. Notify dependent systems

## Integration
- Framework: GhostFrame
- Module: ${moduleConfig.id}
- Kiro Compatibility: ${moduleConfig.kiroCompatibility}
`;
  }

  private generateCompletionHook(moduleConfig: KiroModule): string {
    return `# ${moduleConfig.name} Processing Complete Hook

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
- Module: ${moduleConfig.id}
- Kiro Compatibility: ${moduleConfig.kiroCompatibility}
`;
  }

  private generateUserInteractionHook(moduleConfig: KiroModule): string {
    return `# ${moduleConfig.name} User Interaction Hook

## Trigger
- User interface interactions
- User feedback submission

## Actions
1. Process user interactions
2. Update user preferences
3. Adapt module behavior
4. Log interaction analytics

## Integration
- Framework: GhostFrame
- Module: ${moduleConfig.id}
- Kiro Compatibility: ${moduleConfig.kiroCompatibility}
`;
  }

  private generateInstallationHook(moduleConfig: KiroModule): string {
    return `# ${moduleConfig.name} Installation Hook

## Trigger
- Module installation request
- Module update request

## Actions
1. Validate installation requirements
2. Set up module configuration
3. Initialize module state
4. Register with framework

## Integration
- Framework: GhostFrame
- Module: ${moduleConfig.id}
- Kiro Compatibility: ${moduleConfig.kiroCompatibility}
`;
  }

  private formatBehaviorRules(rules: any[]): string {
    return rules.map(rule => 
      `- **${rule.id}**: ${rule.condition} → ${rule.action} (Priority: ${rule.priority})`
    ).join('\n');
  }

  private formatContextGuidelines(guidelines: string[]): string {
    return guidelines.map(guideline => `- ${guideline}`).join('\n');
  }

  private formatQualityStandards(standards: any[]): string {
    return standards.map(standard => 
      `- **${standard.metric}**: ${standard.description} (Threshold: ${standard.threshold})`
    ).join('\n');
  }

  private validateRequirementsSpec(content: string, errors: string[], warnings: string[]): void {
    if (!content.includes('## Glossary')) {
      warnings.push('Requirements should include a glossary section');
    }

    if (!content.includes('THE ') && !content.includes('SHALL')) {
      errors.push('Requirements should use proper requirement language (THE ... SHALL)');
    }
  }

  private validateDesignSpec(content: string, errors: string[], warnings: string[]): void {
    if (!content.includes('## Overview')) {
      warnings.push('Design should include an overview section');
    }

    if (!content.includes('Kiro')) {
      warnings.push('Design should mention Kiro integration');
    }
  }

  private validateTasksSpec(content: string, errors: string[], warnings: string[]): void {
    if (!content.includes('- [ ]')) {
      errors.push('Tasks should be formatted as checkboxes');
    }

    if (!content.includes('Requirements:')) {
      warnings.push('Tasks should reference requirements');
    }
  }

  private validateSteeringSpec(content: string, errors: string[], warnings: string[]): void {
    if (!content.includes('Guidelines') && !content.includes('Rules')) {
      warnings.push('Steering should include guidelines or rules');
    }
  }
}

// Singleton instance
export const kiroSpecGenerator = new KiroSpecGenerator();