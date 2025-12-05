// 🎃 GhostFrame Core Framework Types
// Defines the foundational types for the modular AI framework

export interface KiroModule {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  category: ModuleCategory;
  kiroCompatibility: string;
  
  // Module Dependencies
  dependencies?: string[];
  
  // Module Configuration
  config: ModuleConfig;
  
  // Kiro Integration Points
  specs: KiroSpecs;
  hooks: KiroHooks;
  steering: KiroSteering;
  
  // Module Lifecycle
  status: ModuleStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ModuleConfig {
  // Input/Output definitions
  inputSchema: any; // JSON Schema for input validation
  outputSchema: any; // JSON Schema for output validation
  
  // Processing capabilities
  supportedContentTypes: string[];
  processingModes: ProcessingMode[];
  
  // UI Configuration
  uiComponents: UIComponentConfig[];
  
  // API Endpoints
  endpoints: ModuleEndpoint[];
}

export interface KiroSpecs {
  // Spec-driven development integration
  specFiles: string[];
  requirements: ModuleRequirement[];
  testCases: ModuleTestCase[];
}

export interface KiroHooks {
  // Automated workflow integration
  onContentUpload?: string; // Hook function name
  onProcessingComplete?: string;
  onUserInteraction?: string;
  onModuleInstall?: string;
  onModuleUpdate?: string;
}

export interface KiroSteering {
  // AI behavior guidance
  behaviorRules: BehaviorRule[];
  contextGuidelines: string[];
  qualityStandards: QualityStandard[];
}

export interface ModuleEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  handler: string; // Function name in module
  middleware?: string[];
  rateLimit?: RateLimitConfig;
}

export interface UIComponentConfig {
  componentType: 'generator' | 'viewer' | 'editor' | 'dashboard';
  componentPath: string;
  props: Record<string, any>;
  permissions: string[];
}

export interface BehaviorRule {
  id: string;
  condition: string;
  action: string;
  priority: number;
}

export interface QualityStandard {
  metric: string;
  threshold: number;
  description: string;
}

export interface ModuleRequirement {
  id: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'implemented' | 'tested';
}

export interface ModuleTestCase {
  id: string;
  description: string;
  input: any;
  expectedOutput: any;
  status: 'pass' | 'fail' | 'pending';
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export type ModuleCategory = 
  | 'education' 
  | 'storytelling' 
  | 'research' 
  | 'productivity' 
  | 'games' 
  | 'creative' 
  | 'analytics' 
  | 'communication'
  | 'other';

export type ProcessingMode = 
  | 'realtime' 
  | 'batch' 
  | 'streaming' 
  | 'interactive';

export type ModuleStatus = 
  | 'draft' 
  | 'registered' 
  | 'active' 
  | 'deprecated' 
  | 'disabled';

// Framework Registry Types
export interface ModuleRegistry {
  modules: Map<string, KiroModule>;
  categories: Map<ModuleCategory, string[]>;
  dependencies: Map<string, string[]>;
}

export interface ModuleInstallation {
  moduleId: string;
  userId: string;
  installationId: string;
  config: Record<string, any>;
  status: 'installing' | 'active' | 'error' | 'disabled';
  installedAt: Date;
  lastUsed?: Date;
}

// Framework Events
export interface FrameworkEvent {
  type: 'module_registered' | 'module_installed' | 'module_executed' | 'content_processed';
  moduleId: string;
  userId?: string;
  data: any;
  timestamp: Date;
}

// Developer API Types
export interface DeveloperAccount {
  id: string;
  username: string;
  email: string;
  name?: string;
  apiKey: string;
  modules: string[];
  permissions: DeveloperPermission[];
  createdAt: Date;
}

export type DeveloperPermission = 
  | 'module_create' 
  | 'module_publish' 
  | 'module_update' 
  | 'module_delete' 
  | 'registry_read' 
  | 'analytics_access';