// 🎃 GhostFrame Hook Automation System
// Manages automated workflows and event-driven processing

import { EventEmitter } from 'events';
import { KiroModule } from '../types/framework';

export interface HookDefinition {
  id: string;
  name: string;
  moduleId: string;
  version: string;
  trigger: HookTrigger;
  conditions: HookCondition[];
  actions: HookAction[];
  metadata: HookMetadata;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface HookTrigger {
  event: string;
  source: 'framework' | 'module' | 'user' | 'system';
  pattern?: string;
  schedule?: CronSchedule;
}

export interface HookCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'exists' | 'matches';
  value: any;
  required: boolean;
}

export interface HookAction {
  type: 'process_content' | 'notify_user' | 'update_status' | 'trigger_workflow' | 'store_result' | 'send_webhook';
  target: string;
  parameters: Record<string, any>;
  timeout: number;
  retryPolicy: RetryPolicy;
}

export interface HookMetadata {
  description: string;
  tags: string[];
  priority: 'low' | 'normal' | 'high' | 'critical';
  category: string;
  author: string;
}

export interface CronSchedule {
  expression: string;
  timezone?: string;
  enabled: boolean;
}

export interface RetryPolicy {
  maxAttempts: number;
  backoffStrategy: 'linear' | 'exponential' | 'fixed';
  initialDelay: number;
  maxDelay: number;
}

export interface HookExecution {
  id: string;
  hookId: string;
  triggeredAt: Date;
  completedAt?: Date;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'timeout';
  context: HookContext;
  result?: HookResult;
  error?: string;
  duration?: number;
  retryCount: number;
}

export interface HookContext {
  event: string;
  source: string;
  data: any;
  user?: {
    id: string;
    permissions: string[];
  };
  module?: {
    id: string;
    version: string;
  };
  timestamp: Date;
  correlationId: string;
}

export interface HookResult {
  success: boolean;
  data?: any;
  message?: string;
  nextActions?: string[];
  metrics?: {
    processingTime: number;
    resourcesUsed: Record<string, number>;
    qualityScore?: number;
  };
}

export interface HookMonitoringData {
  totalHooks: number;
  activeHooks: number;
  executionsToday: number;
  successRate: number;
  averageExecutionTime: number;
  failureReasons: Record<string, number>;
  performanceMetrics: PerformanceMetrics;
}

export interface PerformanceMetrics {
  throughput: number;
  latency: {
    p50: number;
    p95: number;
    p99: number;
  };
  errorRate: number;
  resourceUtilization: {
    cpu: number;
    memory: number;
    network: number;
  };
}

export class HookManager extends EventEmitter {
  private hooks: Map<string, HookDefinition>;
  private executions: Map<string, HookExecution>;
  private scheduledJobs: Map<string, NodeJS.Timeout>;
  private isRunning: boolean;
  private executionQueue: HookExecution[];
  private maxConcurrentExecutions: number;
  private currentExecutions: Set<string>;

  constructor() {
    super();
    this.hooks = new Map();
    this.executions = new Map();
    this.scheduledJobs = new Map();
    this.isRunning = false;
    this.executionQueue = [];
    this.maxConcurrentExecutions = 10;
    this.currentExecutions = new Set();
    
    this.initializeDefaultHooks();
  }

  /**
   * Start the hook manager
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.startExecutionProcessor();
    this.schedulePeriodicTasks();
    
    console.log('🎃 Hook Manager started successfully');
    this.emit('manager:started');
  }

  /**
   * Stop the hook manager
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    
    // Clear scheduled jobs
    for (const [jobId, timeout] of this.scheduledJobs) {
      clearTimeout(timeout);
    }
    this.scheduledJobs.clear();

    // Wait for current executions to complete
    while (this.currentExecutions.size > 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('🎃 Hook Manager stopped');
    this.emit('manager:stopped');
  }

  /**
   * Register a new hook
   */
  async registerHook(hookDefinition: Partial<HookDefinition>): Promise<string> {
    const hookId = this.generateHookId();
    
    const hook: HookDefinition = {
      id: hookId,
      name: hookDefinition.name || 'Unnamed Hook',
      moduleId: hookDefinition.moduleId || 'unknown',
      version: hookDefinition.version || '1.0.0',
      trigger: hookDefinition.trigger || { event: 'default', source: 'system' },
      conditions: hookDefinition.conditions || [],
      actions: hookDefinition.actions || [],
      metadata: hookDefinition.metadata || {
        description: 'Auto-generated hook',
        tags: [],
        priority: 'normal',
        category: 'general',
        author: 'system'
      },
      isActive: hookDefinition.isActive !== false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.validateHook(hook);
    this.hooks.set(hookId, hook);

    // Set up scheduling if needed
    if (hook.trigger.schedule) {
      this.scheduleHook(hookId, hook.trigger.schedule.expression);
    }

    console.log(`🎣 Hook registered: ${hook.name} (${hookId})`);
    this.emit('hook:registered', { hookId, hook });
    
    return hookId;
  }

  /**
   * Execute a specific hook
   */
  async executeHook(hookId: string, context: HookContext): Promise<HookResult> {
    const hook = this.hooks.get(hookId);
    if (!hook) {
      throw new Error(`Hook ${hookId} not found`);
    }

    if (!hook.isActive) {
      throw new Error(`Hook ${hookId} is not active`);
    }

    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    const execution: HookExecution = {
      id: executionId,
      hookId,
      triggeredAt: new Date(),
      status: 'running',
      context,
      retryCount: 0
    };

    this.executions.set(executionId, execution);
    this.currentExecutions.add(executionId);

    try {
      // Check conditions
      if (!this.evaluateConditions(hook.conditions, context)) {
        execution.status = 'completed';
        execution.completedAt = new Date();
        execution.result = {
          success: false,
          message: 'Hook conditions not met',
          nextActions: []
        };
        return execution.result;
      }

      // Execute actions
      const actionResults = [];
      for (const action of hook.actions) {
        const actionResult = await this.executeAction(action, context);
        actionResults.push(actionResult);
        
        // Stop on first failure if configured
        if (!actionResult.success && action.retryPolicy?.maxAttempts === 0) {
          break;
        }
      }

      const duration = Date.now() - startTime;
      const success = actionResults.every(r => r.success);
      
      execution.status = success ? 'completed' : 'failed';
      execution.completedAt = new Date();
      execution.duration = duration;
      execution.result = {
        success,
        data: actionResults,
        message: success ? 'Hook executed successfully' : 'Some actions failed',
        nextActions: [],
        metrics: {
          processingTime: duration,
          resourcesUsed: { memory: 0, cpu: 0 },
          qualityScore: success ? 1.0 : 0.5
        }
      };

      this.emit('hook:executed', { hookId, execution });
      return execution.result;

    } catch (error) {
      const duration = Date.now() - startTime;
      execution.status = 'failed';
      execution.completedAt = new Date();
      execution.duration = duration;
      execution.error = error instanceof Error ? error.message : 'Unknown error';
      execution.result = {
        success: false,
        message: `Hook execution failed: ${execution.error}`,
        nextActions: []
      };

      this.emit('hook:failed', { hookId, execution, error });
      return execution.result;

    } finally {
      this.currentExecutions.delete(executionId);
    }
  }

  /**
   * Get all registered hooks
   */
  getAllHooks(): HookDefinition[] {
    return Array.from(this.hooks.values());
  }

  /**
   * Get hook by ID
   */
  getHook(hookId: string): HookDefinition | undefined {
    return this.hooks.get(hookId);
  }

  /**
   * Trigger hooks by event
   */
  async triggerEvent(eventName: string, data: any, source: string = 'system'): Promise<HookResult[]> {
    const matchingHooks = Array.from(this.hooks.values()).filter(
      hook => hook.isActive && 
              hook.trigger.event === eventName &&
              (hook.trigger.source === source || hook.trigger.source === 'system')
    );

    const results: HookResult[] = [];
    const context: HookContext = {
      event: eventName,
      source,
      data,
      timestamp: new Date(),
      correlationId: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    for (const hook of matchingHooks) {
      try {
        const result = await this.executeHook(hook.id, context);
        results.push(result);
      } catch (error) {
        console.error(`Failed to execute hook ${hook.id}:`, error);
        results.push({
          success: false,
          message: `Hook execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          nextActions: []
        });
      }
    }

    return results;
  }

  /**
   * Get monitoring data
   */
  getMonitoringData(): HookMonitoringData {
    const totalHooks = this.hooks.size;
    const activeHooks = Array.from(this.hooks.values()).filter(h => h.isActive).length;
    const executions = Array.from(this.executions.values());
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const executionsToday = executions.filter(e => e.triggeredAt >= today).length;
    const successfulExecutions = executions.filter(e => e.result?.success).length;
    const successRate = executions.length > 0 ? (successfulExecutions / executions.length) * 100 : 0;
    
    const executionTimes = executions
      .filter(e => e.duration)
      .map(e => e.duration!);
    const averageExecutionTime = executionTimes.length > 0 
      ? executionTimes.reduce((a, b) => a + b, 0) / executionTimes.length 
      : 0;

    const failureReasons: Record<string, number> = {};
    executions
      .filter(e => !e.result?.success && e.error)
      .forEach(e => {
        const reason = e.error || 'Unknown error';
        failureReasons[reason] = (failureReasons[reason] || 0) + 1;
      });

    return {
      totalHooks,
      activeHooks,
      executionsToday,
      successRate,
      averageExecutionTime,
      failureReasons,
      performanceMetrics: {
        throughput: executionsToday,
        latency: {
          p50: this.calculatePercentile(executionTimes, 0.5),
          p95: this.calculatePercentile(executionTimes, 0.95),
          p99: this.calculatePercentile(executionTimes, 0.99)
        },
        errorRate: 100 - successRate,
        resourceUtilization: {
          cpu: this.currentExecutions.size * 10, // Simulated
          memory: this.hooks.size * 5, // Simulated
          network: executionsToday * 2 // Simulated
        }
      }
    };
  }

  /**
   * Schedule a hook for periodic execution
   */
  private scheduleHook(hookId: string, cronExpression: string): void {
    const hook = this.hooks.get(hookId);
    if (!hook) {
      throw new Error(`Hook ${hookId} not found`);
    }

    // Clear existing schedule
    if (this.scheduledJobs.has(hookId)) {
      clearTimeout(this.scheduledJobs.get(hookId)!);
    }

    // Parse cron expression (simplified)
    const interval = this.parseCronExpression(cronExpression);
    
    const timer = setInterval(async () => {
      try {
        const context: HookContext = {
          event: 'scheduled',
          source: 'system',
          data: { trigger: 'schedule', expression: cronExpression },
          timestamp: new Date(),
          correlationId: `scheduled_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };

        await this.executeHook(hookId, context);
      } catch (error) {
        console.error(`Scheduled hook ${hookId} execution failed:`, error);
      }
    }, interval);

    this.scheduledJobs.set(hookId, timer);
    console.log(`⏰ Hook ${hook.name} scheduled with interval: ${interval}ms`);
  }

  /**
   * Start execution processor
   */
  private startExecutionProcessor(): void {
    setInterval(() => {
      this.processExecutionQueue();
    }, 1000);
  }

  /**
   * Process execution queue
   */
  private processExecutionQueue(): void {
    while (this.executionQueue.length > 0 && this.currentExecutions.size < this.maxConcurrentExecutions) {
      const execution = this.executionQueue.shift();
      if (execution) {
        this.executeHook(execution.hookId, execution.context).catch(error => {
          console.error(`Queued hook execution failed:`, error);
        });
      }
    }
  }

  /**
   * Schedule periodic tasks
   */
  private schedulePeriodicTasks(): void {
    // Clean up old executions every hour
    setInterval(() => {
      this.cleanupOldExecutions();
    }, 3600000);

    // Update monitoring metrics every 5 minutes
    setInterval(() => {
      this.updateMonitoringMetrics();
    }, 300000);
  }

  /**
   * Clean up old executions
   */
  private cleanupOldExecutions(): void {
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
    const executionsToDelete: string[] = [];

    for (const [id, execution] of this.executions) {
      if (execution.triggeredAt < cutoffTime) {
        executionsToDelete.push(id);
      }
    }

    executionsToDelete.forEach(id => this.executions.delete(id));
    
    if (executionsToDelete.length > 0) {
      console.log(`🧹 Cleaned up ${executionsToDelete.length} old hook executions`);
    }
  }

  /**
   * Update monitoring metrics
   */
  private updateMonitoringMetrics(): void {
    const metrics = this.getMonitoringData();
    this.emit('metrics:updated', metrics);
  }

  /**
   * Calculate percentile
   */
  private calculatePercentile(values: number[], percentile: number): number {
    if (values.length === 0) return 0;
    
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * percentile) - 1;
    return sorted[Math.max(0, index)];
  }

  /**
   * Execute action
   */
  private async executeAction(action: HookAction, context: HookContext): Promise<{ success: boolean; result?: any; error?: string }> {
    try {
      let result: any;
      
      switch (action.type) {
        case 'process_content':
          result = await this.processContentAction(action, context);
          break;
        case 'notify_user':
          result = await this.notifyUserAction(action, context);
          break;
        case 'update_status':
          result = await this.updateStatusAction(action, context);
          break;
        case 'trigger_workflow':
          result = await this.triggerWorkflowAction(action, context);
          break;
        case 'store_result':
          result = await this.storeResultAction(action, context);
          break;
        case 'send_webhook':
          result = await this.sendWebhookAction(action, context);
          break;
        default:
          throw new Error(`Unknown action type: ${action.type}`);
      }

      return { success: true, result };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Action implementations
  private async processContentAction(action: HookAction, context: HookContext): Promise<any> {
    console.log(`Processing content for ${action.target}:`, action.parameters);
    return {
      action: 'process_content',
      target: action.target,
      processed: true,
      timestamp: new Date()
    };
  }

  private async notifyUserAction(action: HookAction, context: HookContext): Promise<any> {
    console.log(`Notifying user via ${action.target}:`, action.parameters);
    return {
      action: 'notify_user',
      channel: action.target,
      sent: true,
      timestamp: new Date()
    };
  }

  private async updateStatusAction(action: HookAction, context: HookContext): Promise<any> {
    console.log(`Updating status for ${action.target}:`, action.parameters);
    return {
      action: 'update_status',
      target: action.target,
      updated: true,
      timestamp: new Date()
    };
  }

  private async triggerWorkflowAction(action: HookAction, context: HookContext): Promise<any> {
    console.log(`Triggering workflow ${action.target}:`, action.parameters);
    return {
      action: 'trigger_workflow',
      workflow: action.target,
      triggered: true,
      timestamp: new Date()
    };
  }

  private async storeResultAction(action: HookAction, context: HookContext): Promise<any> {
    console.log(`Storing result to ${action.target}:`, action.parameters);
    return {
      action: 'store_result',
      storage: action.target,
      stored: true,
      timestamp: new Date()
    };
  }

  private async sendWebhookAction(action: HookAction, context: HookContext): Promise<any> {
    console.log(`Sending webhook to ${action.target}:`, action.parameters);
    return {
      action: 'send_webhook',
      url: action.target,
      sent: true,
      timestamp: new Date()
    };
  }

  /**
   * Validate hook definition
   */
  private validateHook(hook: HookDefinition): void {
    if (!hook.name || hook.name.trim().length === 0) {
      throw new Error('Hook name is required');
    }

    if (!hook.moduleId || hook.moduleId.trim().length === 0) {
      throw new Error('Hook moduleId is required');
    }

    if (!hook.trigger || !hook.trigger.event) {
      throw new Error('Hook must have a valid trigger with event');
    }

    if (!hook.actions || hook.actions.length === 0) {
      throw new Error('Hook must have at least one action');
    }

    // Validate actions
    for (const action of hook.actions) {
      if (!action.type || !action.target) {
        throw new Error('Each action must have type and target');
      }
    }
  }

  /**
   * Evaluate conditions
   */
  private evaluateConditions(conditions: HookCondition[], context: HookContext): boolean {
    if (!conditions || conditions.length === 0) {
      return true;
    }

    return conditions.every(condition => {
      const value = this.getContextValue(condition.field, context);
      
      switch (condition.operator) {
        case 'equals':
          return value === condition.value;
        case 'contains':
          return String(value).includes(String(condition.value));
        case 'greater_than':
          return Number(value) > Number(condition.value);
        case 'less_than':
          return Number(value) < Number(condition.value);
        case 'exists':
          return value !== undefined && value !== null;
        case 'matches':
          return new RegExp(String(condition.value)).test(String(value));
        default:
          return false;
      }
    });
  }

  /**
   * Get value from context
   */
  private getContextValue(field: string, context: HookContext): any {
    const parts = field.split('.');
    let value: any = context;
    
    for (const part of parts) {
      value = value?.[part];
    }
    
    return value;
  }

  /**
   * Generate unique hook ID
   */
  private generateHookId(): string {
    return `hook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Parse cron expression (simplified)
   */
  private parseCronExpression(expression: string): number {
    // Simplified cron parsing - in production would use a proper cron library
    const patterns: Record<string, number> = {
      '* * * * *': 60000,        // every minute
      '*/5 * * * *': 300000,     // every 5 minutes
      '0 * * * *': 3600000,      // every hour
      '0 0 * * *': 86400000,     // every day
    };
    
    return patterns[expression] || 300000; // default to 5 minutes
  }

  /**
   * Get hook templates by category
   */
  getHookTemplates(category?: string): any[] {
    const templates = [
      {
        id: 'content-processing',
        name: 'Content Processing Hook',
        category: 'content',
        description: 'Automatically process uploaded content',
        variables: ['contentType', 'processingOptions'],
        template: {
          trigger: { event: 'content.uploaded', source: 'framework' },
          actions: [
            { type: 'process_content', target: 'content-processor' },
            { type: 'notify_user', target: 'email' }
          ]
        }
      },
      {
        id: 'user-notification',
        name: 'User Notification Hook',
        category: 'notification',
        description: 'Send notifications to users',
        variables: ['notificationType', 'recipients'],
        template: {
          trigger: { event: 'user.action', source: 'framework' },
          actions: [
            { type: 'notify_user', target: 'email' }
          ]
        }
      },
      {
        id: 'workflow-automation',
        name: 'Workflow Automation Hook',
        category: 'automation',
        description: 'Automate complex workflows',
        variables: ['workflowType', 'conditions'],
        template: {
          trigger: { event: 'workflow.trigger', source: 'system' },
          actions: [
            { type: 'trigger_workflow', target: 'workflow-engine' }
          ]
        }
      }
    ];

    if (category) {
      return templates.filter(t => t.category === category);
    }
    return templates;
  }

  /**
   * Create hook from template
   */
  createHookFromTemplate(templateId: string, variables: Record<string, any>, moduleId: string): HookDefinition {
    const templates = this.getHookTemplates();
    const template = templates.find(t => t.id === templateId);
    
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    // Replace variables in template
    const hookDefinition: Partial<HookDefinition> = {
      name: template.name.replace(/\{(\w+)\}/g, (match: string, key: string) => variables[key] || match),
      moduleId,
      trigger: { ...template.template.trigger },
      actions: template.template.actions.map((action: any) => ({
        ...action,
        parameters: { ...action.parameters, ...variables },
        timeout: 30000,
        retryPolicy: {
          maxAttempts: 3,
          backoffStrategy: 'exponential' as const,
          initialDelay: 1000,
          maxDelay: 10000
        }
      })),
      conditions: [],
      metadata: {
        description: template.description,
        tags: [template.category],
        priority: 'normal' as const,
        category: template.category,
        author: 'template'
      }
    };

    return hookDefinition as HookDefinition;
  }

  /**
   * Get hooks for a specific module
   */
  getModuleHooks(moduleId: string): HookDefinition[] {
    return Array.from(this.hooks.values()).filter(hook => hook.moduleId === moduleId);
  }

  /**
   * Initialize default hooks
   */
  private initializeDefaultHooks(): void {
    // Content processing hook
    this.registerHook({
      name: 'Content Upload Processing',
      moduleId: 'framework-core',
      trigger: {
        event: 'content.uploaded',
        source: 'framework'
      },
      conditions: [
        { field: 'data.contentType', operator: 'exists', value: true, required: true }
      ],
      actions: [
        {
          type: 'process_content',
          target: 'content-processor',
          parameters: { autoProcess: true },
          timeout: 30000,
          retryPolicy: {
            maxAttempts: 3,
            backoffStrategy: 'exponential',
            initialDelay: 1000,
            maxDelay: 10000
          }
        },
        {
          type: 'notify_user',
          target: 'email',
          parameters: { template: 'content-processed' },
          timeout: 5000,
          retryPolicy: {
            maxAttempts: 2,
            backoffStrategy: 'linear',
            initialDelay: 500,
            maxDelay: 2000
          }
        }
      ],
      metadata: {
        description: 'Automatically processes uploaded content and notifies users',
        tags: ['content', 'processing', 'automation'],
        priority: 'high',
        category: 'content',
        author: 'framework'
      }
    });

    console.log('🎣 Default hooks initialized');
  }
}

// Singleton instance
export const hookManager = new HookManager();