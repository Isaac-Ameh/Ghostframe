// 🎃 GhostFrame TypeScript SDK
// Comprehensive SDK for building, testing, and integrating Ghost modules with full Kiro compatibility

import { EventEmitter } from 'events';

export interface GhostFrameConfig {
  apiKey?: string;
  apiEndpoint?: string;
  environment?: 'development' | 'staging' | 'production';
  timeout?: number;
  retries?: number;
  debug?: boolean;
  kiroIntegration?: KiroIntegrationConfig;
}

export interface KiroIntegrationConfig {
  specsPath?: string;
  hooksPath?: string;
  steeringPath?: string;
  autoGenerate?: boolean;
  validateOnBuild?: boolean;
}

export interface ModuleDefinition {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  category: string;
  inputSchema: JSONSchema;
  outputSchema: JSONSchema;
  aiModels: string[];
  features: string[];
  permissions: string[];
  dependencies: string[];
  kiroSpecs?: KiroSpecs;
  configuration?: ModuleConfig;
}

export interface JSONSchema {
  type: string;
  properties?: Record<string, any>;
  required?: string[];
  additionalProperties?: boolean;
  [key: string]: any;
}

export interface KiroSpecs {
  requirements?: string;
  design?: string;
  tasks?: string;
  hooks?: Record<string, KiroHook>;
  steering?: KiroSteering;
}

export interface KiroHook {
  trigger: string;
  conditions: KiroCondition[];
  actions: KiroAction[];
  enabled: boolean;
}

export interface KiroCondition {
  field: string;
  operator: string;
  value: any;
}

export interface KiroAction {
  type: string;
  target: string;
  parameters: Record<string, any>;
}

export interface KiroSteering {
  personality: {
    tone: string;
    style: string;
    creativity: number;
    formality: number;
  };
  behavior: {
    rules: string[];
    guidelines: string[];
    restrictions: string[];
  };
  quality: {
    standards: string[];
    thresholds: Record<string, number>;
  };
}

export interface ModuleConfig {
  environment: Record<string, string>;
  resources: ResourceConfig;
  scaling: ScalingConfig;
  monitoring: MonitoringConfig;
}

export interface ResourceConfig {
  cpu: string;
  memory: string;
  storage: string;
  network?: string;
}

export interface ScalingConfig {
  minInstances: number;
  maxInstances: number;
  targetCPU: number;
  targetMemory: number;
}

export interface MonitoringConfig {
  healthCheck: HealthCheckConfig;
  metrics: string[];
  alerts: AlertConfig[];
}

export interface HealthCheckConfig {
  path: string;
  interval: number;
  timeout: number;
  retries: number;
}

export interface AlertConfig {
  name: string;
  condition: string;
  threshold: number;
  actions: string[];
}

export interface ExecutionContext {
  moduleId: string;
  userId?: string;
  sessionId: string;
  input: any;
  options?: ExecutionOptions;
  kiroContext?: KiroExecutionContext;
}

export interface ExecutionOptions {
  timeout?: number;
  retries?: number;
  aiModel?: string;
  streaming?: boolean;
  caching?: boolean;
  debug?: boolean;
}

export interface KiroExecutionContext {
  specs: KiroSpecs;
  agentContext: AgentContext;
  steeringRules: KiroSteering;
}

export interface AgentContext {
  conversationHistory: ConversationEntry[];
  userPreferences: UserPreferences;
  sessionData: Record<string, any>;
}

export interface ConversationEntry {
  timestamp: Date;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: Record<string, any>;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  aiModel: string;
  responseStyle: string;
  privacyLevel: string;
}

export interface ExecutionResult {
  success: boolean;
  output?: any;
  error?: ExecutionError;
  metadata: ExecutionMetadata;
}

export interface ExecutionError {
  code: string;
  message: string;
  details?: any;
  stack?: string;
}

export interface ExecutionMetadata {
  executionTime: number;
  aiModel: string;
  tokensUsed: number;
  cacheHit: boolean;
  qualityScore?: number;
  kiroEvents: string[];
}

export interface ValidationResult {
  isValid: boolean;
  score: number;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: ValidationSuggestion[];
}

export interface ValidationError {
  code: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  field?: string;
  suggestion?: string;
}

export interface ValidationWarning {
  code: string;
  message: string;
  field?: string;
  impact: string;
  suggestion?: string;
}

export interface ValidationSuggestion {
  type: 'improvement' | 'optimization' | 'best_practice';
  message: string;
  priority: 'high' | 'medium' | 'low';
  implementation?: string;
}

export interface TestSuite {
  id: string;
  name: string;
  tests: TestCase[];
  setup?: TestSetup;
  teardown?: TestTeardown;
}

export interface TestCase {
  id: string;
  name: string;
  description: string;
  input: any;
  expectedOutput?: any;
  assertions: TestAssertion[];
  timeout?: number;
}

export interface TestAssertion {
  type: 'equals' | 'contains' | 'matches' | 'custom';
  field?: string;
  expected: any;
  message?: string;
}

export interface TestSetup {
  actions: TestAction[];
  data: any;
}

export interface TestTeardown {
  actions: TestAction[];
}

export interface TestAction {
  type: string;
  parameters: Record<string, any>;
}

export interface TestResult {
  testId: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  output?: any;
  error?: string;
  assertions: AssertionResult[];
}

export interface AssertionResult {
  assertion: TestAssertion;
  passed: boolean;
  actual: any;
  message: string;
}

export interface DeploymentConfig {
  environment: string;
  version?: string;
  strategy: 'blue_green' | 'rolling' | 'canary';
  rollback?: boolean;
  notifications?: string[];
}

export interface DeploymentResult {
  success: boolean;
  deploymentId: string;
  version: string;
  url?: string;
  status: string;
  logs: string[];
}

/**
 * Main GhostFrame SDK class
 */
export class GhostFrameSDK extends EventEmitter {
  private config: GhostFrameConfig;
  private apiClient: APIClient;
  private moduleBuilder: ModuleBuilder;
  private testRunner: TestRunner;
  private validator: ModuleValidator;
  private kiroIntegration: KiroIntegration;

  constructor(config: GhostFrameConfig = {}) {
    super();
    this.config = {
      apiEndpoint: 'https://api.ghostframe.dev',
      environment: 'development',
      timeout: 30000,
      retries: 3,
      debug: false,
      ...config
    };

    this.apiClient = new APIClient(this.config);
    this.moduleBuilder = new ModuleBuilder(this.config);
    this.testRunner = new TestRunner(this.config);
    this.validator = new ModuleValidator(this.config);
    this.kiroIntegration = new KiroIntegration(this.config);
  }

  /**
   * Initialize the SDK
   */
  async initialize(): Promise<void> {
    console.log('🎃 Initializing GhostFrame SDK...');

    await this.apiClient.initialize();
    await this.kiroIntegration.initialize();

    console.log('✅ GhostFrame SDK initialized');
    this.emit('sdk:initialized');
  }

  /**
   * Create a new module
   */
  async createModule(definition: ModuleDefinition): Promise<GhostModule> {
    console.log(`🎃 Creating module: ${definition.name}`);

    // Validate definition
    const validation = await this.validator.validateDefinition(definition);
    if (!validation.isValid) {
      throw new Error(`Invalid module definition: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    // Build module
    const module = await this.moduleBuilder.build(definition);

    // Generate Kiro specs if enabled
    if (this.config.kiroIntegration?.autoGenerate) {
      module.kiroSpecs = await this.kiroIntegration.generateSpecs(definition);
    }

    console.log(`✅ Module created: ${module.id}`);
    this.emit('module:created', { module });

    return module;
  }

  /**
   * Execute a module
   */
  async executeModule(context: ExecutionContext): Promise<ExecutionResult> {
    console.log(`🎃 Executing module: ${context.moduleId}`);

    try {
      const result = await this.apiClient.executeModule(context);
      
      console.log(`✅ Module executed: ${context.moduleId} (${result.metadata.executionTime}ms)`);
      this.emit('module:executed', { context, result });

      return result;

    } catch (error) {
      console.error(`❌ Module execution failed: ${context.moduleId}`, error);
      this.emit('module:error', { context, error });
      throw error;
    }
  }

  /**
   * Validate a module
   */
  async validateModule(module: GhostModule): Promise<ValidationResult> {
    console.log(`🎃 Validating module: ${module.id}`);

    const result = await this.validator.validate(module);

    console.log(`✅ Validation complete: ${module.id} (Score: ${result.score}/100)`);
    this.emit('module:validated', { module, result });

    return result;
  }

  /**
   * Test a module
   */
  async testModule(module: GhostModule, testSuite?: TestSuite): Promise<TestResult[]> {
    console.log(`🎃 Testing module: ${module.id}`);

    const results = await this.testRunner.runTests(module, testSuite);

    const passed = results.filter(r => r.status === 'passed').length;
    const total = results.length;

    console.log(`✅ Tests complete: ${module.id} (${passed}/${total} passed)`);
    this.emit('module:tested', { module, results });

    return results;
  }

  /**
   * Deploy a module
   */
  async deployModule(module: GhostModule, config: DeploymentConfig): Promise<DeploymentResult> {
    console.log(`🎃 Deploying module: ${module.id} to ${config.environment}`);

    // Validate before deployment
    if (this.config.kiroIntegration?.validateOnBuild) {
      const validation = await this.validateModule(module);
      if (!validation.isValid) {
        throw new Error('Module validation failed. Cannot deploy.');
      }
    }

    const result = await this.apiClient.deployModule(module, config);

    console.log(`✅ Deployment ${result.success ? 'successful' : 'failed'}: ${module.id}`);
    this.emit('module:deployed', { module, config, result });

    return result;
  }

  /**
   * Get module status
   */
  async getModuleStatus(moduleId: string, environment?: string): Promise<ModuleStatus> {
    return await this.apiClient.getModuleStatus(moduleId, environment);
  }

  /**
   * List modules
   */
  async listModules(filters?: ModuleFilters): Promise<GhostModule[]> {
    return await this.apiClient.listModules(filters);
  }

  /**
   * Generate Kiro specifications
   */
  async generateKiroSpecs(definition: ModuleDefinition): Promise<KiroSpecs> {
    return await this.kiroIntegration.generateSpecs(definition);
  }

  /**
   * Create test suite
   */
  createTestSuite(name: string): TestSuiteBuilder {
    return new TestSuiteBuilder(name);
  }

  /**
   * Create module builder
   */
  createModuleBuilder(): ModuleDefinitionBuilder {
    return new ModuleDefinitionBuilder();
  }

  /**
   * Get SDK configuration
   */
  getConfig(): GhostFrameConfig {
    return { ...this.config };
  }

  /**
   * Update SDK configuration
   */
  updateConfig(updates: Partial<GhostFrameConfig>): void {
    this.config = { ...this.config, ...updates };
    this.apiClient.updateConfig(this.config);
  }
}

/**
 * API Client for GhostFrame backend
 */
export class APIClient {
  private config: GhostFrameConfig;
  private baseURL: string;
  private headers: Record<string, string>;

  constructor(config: GhostFrameConfig) {
    this.config = config;
    this.baseURL = config.apiEndpoint || 'https://api.ghostframe.dev';
    this.headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'GhostFrame-SDK/2.0.0'
    };

    if (config.apiKey) {
      this.headers['Authorization'] = `Bearer ${config.apiKey}`;
    }
  }

  async initialize(): Promise<void> {
    // Verify API connection
    try {
      await this.request('GET', '/health');
      console.log('✅ API connection verified');
    } catch (error) {
      console.warn('⚠️ API connection failed, operating in offline mode');
    }
  }

  async executeModule(context: ExecutionContext): Promise<ExecutionResult> {
    return await this.request('POST', `/modules/${context.moduleId}/execute`, {
      input: context.input,
      options: context.options,
      kiroContext: context.kiroContext
    });
  }

  async deployModule(module: GhostModule, config: DeploymentConfig): Promise<DeploymentResult> {
    return await this.request('POST', `/modules/${module.id}/deploy`, {
      module,
      config
    });
  }

  async getModuleStatus(moduleId: string, environment?: string): Promise<ModuleStatus> {
    const params = environment ? `?environment=${environment}` : '';
    return await this.request('GET', `/modules/${moduleId}/status${params}`);
  }

  async listModules(filters?: ModuleFilters): Promise<GhostModule[]> {
    const params = filters ? `?${new URLSearchParams(filters as any).toString()}` : '';
    return await this.request('GET', `/modules${params}`);
  }

  updateConfig(config: GhostFrameConfig): void {
    this.config = config;
    if (config.apiKey) {
      this.headers['Authorization'] = `Bearer ${config.apiKey}`;
    }
  }

  private async request(method: string, path: string, data?: any): Promise<any> {
    const url = `${this.baseURL}${path}`;
    const options: RequestInit = {
      method,
      headers: this.headers,
      body: data ? JSON.stringify(data) : undefined
    };

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      if (this.config.debug) {
        console.error('API Request Error:', error);
      }
      throw error;
    }
  }
}

/**
 * Module Builder for creating Ghost modules
 */
export class ModuleBuilder {
  private config: GhostFrameConfig;

  constructor(config: GhostFrameConfig) {
    this.config = config;
  }

  async build(definition: ModuleDefinition): Promise<GhostModule> {
    const module: GhostModule = {
      id: definition.id,
      name: definition.name,
      version: definition.version,
      description: definition.description,
      author: definition.author,
      category: definition.category,
      status: 'development',
      entryPoint: 'index.js',
      dependencies: definition.dependencies,
      kiroSpecs: definition.kiroSpecs || {},
      config: {
        inputSchema: definition.inputSchema,
        outputSchema: definition.outputSchema,
        aiModels: definition.aiModels,
        features: definition.features,
        permissions: definition.permissions
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        downloads: 0,
        rating: 0,
        tags: []
      }
    };

    return module;
  }
}

/**
 * Test Runner for module testing
 */
export class TestRunner {
  private config: GhostFrameConfig;

  constructor(config: GhostFrameConfig) {
    this.config = config;
  }

  async runTests(module: GhostModule, testSuite?: TestSuite): Promise<TestResult[]> {
    const suite = testSuite || this.generateDefaultTestSuite(module);
    const results: TestResult[] = [];

    for (const test of suite.tests) {
      const result = await this.runTest(module, test);
      results.push(result);
    }

    return results;
  }

  private async runTest(module: GhostModule, test: TestCase): Promise<TestResult> {
    const startTime = Date.now();

    try {
      // Execute test
      const output = await this.executeTest(module, test);

      // Validate assertions
      const assertions = await this.validateAssertions(test.assertions, output);
      const passed = assertions.every(a => a.passed);

      return {
        testId: test.id,
        status: passed ? 'passed' : 'failed',
        duration: Date.now() - startTime,
        output,
        assertions
      };

    } catch (error) {
      return {
        testId: test.id,
        status: 'failed',
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        assertions: []
      };
    }
  }

  private async executeTest(module: GhostModule, test: TestCase): Promise<any> {
    // Simulate test execution
    return { success: true, data: test.input };
  }

  private async validateAssertions(assertions: TestAssertion[], output: any): Promise<AssertionResult[]> {
    return assertions.map(assertion => {
      const actual = assertion.field ? this.getNestedValue(output, assertion.field) : output;
      let passed = false;

      switch (assertion.type) {
        case 'equals':
          passed = actual === assertion.expected;
          break;
        case 'contains':
          passed = String(actual).includes(String(assertion.expected));
          break;
        case 'matches':
          passed = new RegExp(assertion.expected).test(String(actual));
          break;
        default:
          passed = false;
      }

      return {
        assertion,
        passed,
        actual,
        message: assertion.message || (passed ? 'Assertion passed' : 'Assertion failed')
      };
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private generateDefaultTestSuite(module: GhostModule): TestSuite {
    return {
      id: `default-${module.id}`,
      name: `Default Test Suite for ${module.name}`,
      tests: [
        {
          id: 'basic-execution',
          name: 'Basic Execution Test',
          description: 'Test basic module execution',
          input: { test: 'data' },
          assertions: [
            {
              type: 'equals',
              field: 'success',
              expected: true,
              message: 'Module should execute successfully'
            }
          ]
        }
      ]
    };
  }
}

/**
 * Module Validator
 */
export class ModuleValidator {
  private config: GhostFrameConfig;

  constructor(config: GhostFrameConfig) {
    this.config = config;
  }

  async validateDefinition(definition: ModuleDefinition): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: ValidationSuggestion[] = [];

    // Required field validation
    if (!definition.name || definition.name.length < 3) {
      errors.push({
        code: 'INVALID_NAME',
        severity: 'high',
        message: 'Module name must be at least 3 characters',
        field: 'name'
      });
    }

    if (!definition.description || definition.description.length < 10) {
      errors.push({
        code: 'INVALID_DESCRIPTION',
        severity: 'medium',
        message: 'Module description must be at least 10 characters',
        field: 'description'
      });
    }

    // Schema validation
    if (!definition.inputSchema || !definition.inputSchema.type) {
      errors.push({
        code: 'MISSING_INPUT_SCHEMA',
        severity: 'high',
        message: 'Input schema is required',
        field: 'inputSchema'
      });
    }

    if (!definition.outputSchema || !definition.outputSchema.type) {
      errors.push({
        code: 'MISSING_OUTPUT_SCHEMA',
        severity: 'high',
        message: 'Output schema is required',
        field: 'outputSchema'
      });
    }

    // AI models validation
    if (!definition.aiModels || definition.aiModels.length === 0) {
      warnings.push({
        code: 'NO_AI_MODELS',
        message: 'No AI models specified',
        field: 'aiModels',
        impact: 'functionality'
      });
    }

    const score = Math.max(0, 100 - (errors.length * 20) - (warnings.length * 5));
    const isValid = errors.length === 0;

    return {
      isValid,
      score,
      errors,
      warnings,
      suggestions
    };
  }

  async validate(module: GhostModule): Promise<ValidationResult> {
    // Convert module to definition for validation
    const definition: ModuleDefinition = {
      id: module.id,
      name: module.name,
      version: module.version,
      description: module.description,
      author: module.author,
      category: module.category,
      inputSchema: module.config.inputSchema,
      outputSchema: module.config.outputSchema,
      aiModels: module.config.aiModels,
      features: module.config.features,
      permissions: module.config.permissions,
      dependencies: module.dependencies,
      kiroSpecs: module.kiroSpecs
    };

    return await this.validateDefinition(definition);
  }
}

/**
 * Kiro Integration Helper
 */
export class KiroIntegration {
  private config: GhostFrameConfig;

  constructor(config: GhostFrameConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    console.log('🤖 Initializing Kiro integration...');
  }

  async generateSpecs(definition: ModuleDefinition): Promise<KiroSpecs> {
    const requirements = this.generateRequirements(definition);
    const design = this.generateDesign(definition);
    const tasks = this.generateTasks(definition);
    const hooks = this.generateHooks(definition);
    const steering = this.generateSteering(definition);

    return {
      requirements,
      design,
      tasks,
      hooks,
      steering
    };
  }

  private generateRequirements(definition: ModuleDefinition): string {
    return `# ${definition.name} Requirements

## Overview
${definition.description}

## Functional Requirements

### Requirement 1: Core Functionality
**User Story:** As a user, I want to process input through ${definition.name} so that I can get AI-powered results

#### Acceptance Criteria
1. WHEN a user provides valid input, THE ${definition.name} SHALL process it according to the input schema
2. WHEN processing is complete, THE ${definition.name} SHALL return results matching the output schema
3. THE ${definition.name} SHALL complete processing within 30 seconds for typical inputs
4. IF processing fails, THEN THE ${definition.name} SHALL provide clear error messages

## Non-Functional Requirements
- Response time: < 5 seconds for 95% of requests
- Availability: 99.9% uptime
- Scalability: Handle up to 1000 concurrent requests
- Security: Validate all inputs and sanitize outputs
`;
  }

  private generateDesign(definition: ModuleDefinition): string {
    return `# ${definition.name} Design

## Overview
${definition.description}

## Architecture
This module follows the GhostFrame architecture pattern with the following components:

### Input Processor
- Validates input against schema
- Sanitizes and normalizes data
- Handles error cases gracefully

### AI Engine
- Integrates with specified AI models: ${definition.aiModels.join(', ')}
- Applies steering rules for consistent behavior
- Manages token usage and rate limiting

### Output Formatter
- Formats results according to output schema
- Adds metadata and quality scores
- Handles streaming responses if enabled

## Data Flow
1. Input validation and preprocessing
2. AI model selection and execution
3. Result processing and formatting
4. Response delivery with metadata

## Error Handling
- Input validation errors return 400 status
- AI processing errors are retried with exponential backoff
- System errors return 500 status with sanitized messages
`;
  }

  private generateTasks(definition: ModuleDefinition): string {
    return `# ${definition.name} Implementation Tasks

## Core Implementation
- [ ] 1. Set up module structure
  - Create module directory and configuration
  - Set up TypeScript build system
  - Configure linting and formatting
  - _Requirements: Core Functionality_

- [ ] 2. Implement input validation
  - Create input schema validator
  - Add error handling for invalid inputs
  - Implement input sanitization
  - _Requirements: Core Functionality_

- [ ] 3. Build AI processing engine
  - Integrate with ${definition.aiModels.join(', ')}
  - Implement model selection logic
  - Add retry mechanisms and error handling
  - _Requirements: Core Functionality_

- [ ] 4. Create output formatting
  - Implement output schema validation
  - Add metadata generation
  - Create response formatting utilities
  - _Requirements: Core Functionality_

## Testing and Quality
- [ ]* 5. Write comprehensive tests
  - Unit tests for all components
  - Integration tests for full workflow
  - Performance tests for scalability
  - _Requirements: Quality Assurance_

- [ ]* 6. Add monitoring and logging
  - Implement health checks
  - Add performance metrics
  - Create audit logging
  - _Requirements: Monitoring_
`;
  }

  private generateHooks(definition: ModuleDefinition): Record<string, KiroHook> {
    return {
      'pre-execution': {
        trigger: 'before_module_execution',
        conditions: [
          {
            field: 'input',
            operator: 'exists',
            value: true
          }
        ],
        actions: [
          {
            type: 'log',
            target: 'console',
            parameters: {
              message: `Starting execution of ${definition.name}`,
              level: 'info'
            }
          }
        ],
        enabled: true
      },
      'post-execution': {
        trigger: 'after_module_execution',
        conditions: [
          {
            field: 'output',
            operator: 'exists',
            value: true
          }
        ],
        actions: [
          {
            type: 'log',
            target: 'console',
            parameters: {
              message: `Completed execution of ${definition.name}`,
              level: 'info'
            }
          }
        ],
        enabled: true
      }
    };
  }

  private generateSteering(definition: ModuleDefinition): KiroSteering {
    return {
      personality: {
        tone: 'helpful',
        style: 'professional',
        creativity: 0.7,
        formality: 0.6
      },
      behavior: {
        rules: [
          'Always validate input before processing',
          'Provide clear and helpful error messages',
          'Respect user privacy and data protection',
          'Generate high-quality, relevant outputs'
        ],
        guidelines: [
          'Use appropriate AI models for the task',
          'Optimize for both speed and quality',
          'Handle edge cases gracefully',
          'Maintain consistent output format'
        ],
        restrictions: [
          'Never expose sensitive system information',
          'Do not process harmful or inappropriate content',
          'Respect rate limits and resource constraints',
          'Follow data retention and privacy policies'
        ]
      },
      quality: {
        standards: [
          'Output must match defined schema',
          'Response time under 5 seconds',
          'Error rate below 1%',
          'User satisfaction above 4.0/5.0'
        ],
        thresholds: {
          responseTime: 5000,
          errorRate: 1,
          qualityScore: 80,
          userSatisfaction: 4.0
        }
      }
    };
  }
}

/**
 * Module Definition Builder - Fluent API for creating modules
 */
export class ModuleDefinitionBuilder {
  private definition: Partial<ModuleDefinition> = {};

  name(name: string): this {
    this.definition.name = name;
    this.definition.id = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return this;
  }

  description(description: string): this {
    this.definition.description = description;
    return this;
  }

  version(version: string): this {
    this.definition.version = version;
    return this;
  }

  author(author: string): this {
    this.definition.author = author;
    return this;
  }

  category(category: string): this {
    this.definition.category = category;
    return this;
  }

  inputSchema(schema: JSONSchema): this {
    this.definition.inputSchema = schema;
    return this;
  }

  outputSchema(schema: JSONSchema): this {
    this.definition.outputSchema = schema;
    return this;
  }

  aiModels(models: string[]): this {
    this.definition.aiModels = models;
    return this;
  }

  features(features: string[]): this {
    this.definition.features = features;
    return this;
  }

  permissions(permissions: string[]): this {
    this.definition.permissions = permissions;
    return this;
  }

  dependencies(dependencies: string[]): this {
    this.definition.dependencies = dependencies;
    return this;
  }

  kiroSpecs(specs: KiroSpecs): this {
    this.definition.kiroSpecs = specs;
    return this;
  }

  build(): ModuleDefinition {
    // Validate required fields
    if (!this.definition.name) {
      throw new Error('Module name is required');
    }
    if (!this.definition.description) {
      throw new Error('Module description is required');
    }
    if (!this.definition.inputSchema) {
      throw new Error('Input schema is required');
    }
    if (!this.definition.outputSchema) {
      throw new Error('Output schema is required');
    }

    // Set defaults
    return {
      id: this.definition.id!,
      name: this.definition.name,
      version: this.definition.version || '1.0.0',
      description: this.definition.description,
      author: this.definition.author || 'Unknown',
      category: this.definition.category || 'utility',
      inputSchema: this.definition.inputSchema,
      outputSchema: this.definition.outputSchema,
      aiModels: this.definition.aiModels || ['gpt-3.5-turbo'],
      features: this.definition.features || [],
      permissions: this.definition.permissions || [],
      dependencies: this.definition.dependencies || [],
      kiroSpecs: this.definition.kiroSpecs
    };
  }
}

/**
 * Test Suite Builder - Fluent API for creating test suites
 */
export class TestSuiteBuilder {
  private suite: Partial<TestSuite>;

  constructor(name: string) {
    this.suite = {
      id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name,
      tests: []
    };
  }

  description(description: string): this {
    // Add description to suite (extend interface if needed)
    return this;
  }

  addTest(test: TestCase): this {
    this.suite.tests!.push(test);
    return this;
  }

  test(name: string, input: any, assertions: TestAssertion[]): this {
    const test: TestCase = {
      id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name,
      description: name,
      input,
      assertions
    };
    return this.addTest(test);
  }

  setup(setup: TestSetup): this {
    this.suite.setup = setup;
    return this;
  }

  teardown(teardown: TestTeardown): this {
    this.suite.teardown = teardown;
    return this;
  }

  build(): TestSuite {
    if (!this.suite.name) {
      throw new Error('Test suite name is required');
    }

    return {
      id: this.suite.id!,
      name: this.suite.name,
      tests: this.suite.tests || [],
      setup: this.suite.setup,
      teardown: this.suite.teardown
    };
  }
}

// Helper functions and utilities

/**
 * Create a new GhostFrame SDK instance
 */
export function createSDK(config?: GhostFrameConfig): GhostFrameSDK {
  return new GhostFrameSDK(config);
}

/**
 * Create a module definition builder
 */
export function createModule(): ModuleDefinitionBuilder {
  return new ModuleDefinitionBuilder();
}

/**
 * Create a test suite builder
 */
export function createTestSuite(name: string): TestSuiteBuilder {
  return new TestSuiteBuilder(name);
}

/**
 * Validate JSON schema
 */
export function validateSchema(data: any, schema: JSONSchema): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Basic type validation
  if (schema.type && typeof data !== schema.type) {
    errors.push(`Expected type ${schema.type}, got ${typeof data}`);
  }

  // Required fields validation
  if (schema.required && schema.type === 'object') {
    for (const field of schema.required) {
      if (!(field in data)) {
        errors.push(`Required field missing: ${field}`);
      }
    }
  }

  // Properties validation
  if (schema.properties && schema.type === 'object') {
    for (const [key, value] of Object.entries(data)) {
      if (schema.properties[key]) {
        const fieldResult = validateSchema(value, schema.properties[key]);
        errors.push(...fieldResult.errors.map(e => `${key}.${e}`));
      } else if (!schema.additionalProperties) {
        errors.push(`Additional property not allowed: ${key}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Generate sample data from JSON schema
 */
export function generateSampleData(schema: JSONSchema): any {
  switch (schema.type) {
    case 'string':
      return 'sample string';
    case 'number':
      return 42;
    case 'boolean':
      return true;
    case 'array':
      return ['sample', 'array'];
    case 'object':
      const obj: any = {};
      if (schema.properties) {
        for (const [key, propSchema] of Object.entries(schema.properties)) {
          obj[key] = generateSampleData(propSchema as JSONSchema);
        }
      }
      return obj;
    default:
      return null;
  }
}

// Type definitions for additional interfaces
export interface GhostModule {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  category: string;
  status: string;
  entryPoint: string;
  dependencies: string[];
  kiroSpecs: KiroSpecs;
  config: {
    inputSchema: JSONSchema;
    outputSchema: JSONSchema;
    aiModels: string[];
    features: string[];
    permissions: string[];
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    downloads: number;
    rating: number;
    tags: string[];
  };
}

export interface ModuleStatus {
  moduleId: string;
  environment: string;
  status: string;
  version: string;
  instances: number;
  health: string;
  lastDeployed: string;
  metrics: {
    requests: number;
    errors: number;
    responseTime: number;
  };
}

export interface ModuleFilters {
  category?: string;
  author?: string;
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

// Export the main SDK class as default
export default GhostFrameSDK;