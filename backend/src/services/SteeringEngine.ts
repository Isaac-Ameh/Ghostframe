// 🎃 GhostFrame Steering Document Engine
// Applies AI behavior guidelines and validates steering compliance

export interface SteeringRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  action: string;
  priority: number;
  domain: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIGuideline {
  id: string;
  title: string;
  content: string;
  domain: string;
  category: 'behavior' | 'quality' | 'safety' | 'performance';
  applicability: SteeringScope;
  examples: string[];
  version: string;
}

export interface SteeringScope {
  modules: string[];
  domains: string[];
  contentTypes: string[];
  userTypes: string[];
}

export interface QualityStandard {
  id: string;
  name: string;
  metric: string;
  threshold: number;
  description: string;
  domain: string;
  measurementMethod: string;
  isRequired: boolean;
}

export interface SteeringContext {
  moduleId: string;
  domain: string;
  contentType?: string;
  userType?: string;
  content: string;
  metadata: Record<string, any>;
}

export interface SteeringResult {
  originalContent: string;
  processedContent: string;
  appliedRules: AppliedRule[];
  qualityScore: number;
  complianceReport: ComplianceReport;
  recommendations: string[];
}

export interface AppliedRule {
  ruleId: string;
  ruleName: string;
  applied: boolean;
  reason: string;
  impact: string;
  confidence: number;
}

export interface ComplianceReport {
  overallScore: number;
  passedStandards: string[];
  failedStandards: string[];
  warnings: string[];
  recommendations: string[];
}

export interface SteeringDocument {
  id: string;
  title: string;
  content: string;
  domain: string;
  rules: SteeringRule[];
  guidelines: AIGuideline[];
  qualityStandards: QualityStandard[];
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

export class SteeringEngine {
  private rules: Map<string, SteeringRule>;
  private guidelines: Map<string, AIGuideline>;
  private qualityStandards: Map<string, QualityStandard>;
  private steeringDocuments: Map<string, SteeringDocument>;

  constructor() {
    this.rules = new Map();
    this.guidelines = new Map();
    this.qualityStandards = new Map();
    this.steeringDocuments = new Map();
    
    this.initializeDefaultRules();
    this.initializeDefaultGuidelines();
    this.initializeDefaultStandards();
    this.initializeDemoDocuments();
  }

  /**
   * Apply steering rules to content
   */
  async applySteeringRules(content: string, context: SteeringContext): Promise<SteeringResult> {
    const applicableRules = this.getApplicableRules(context);
    const appliedRules: AppliedRule[] = [];
    let processedContent = content;

    console.log(`🎃 Applying ${applicableRules.length} steering rules for ${context.domain}`);

    // Apply each rule
    for (const rule of applicableRules) {
      try {
        const ruleResult = await this.applyRule(rule, processedContent, context);
        appliedRules.push(ruleResult);
        
        if (ruleResult.applied) {
          processedContent = this.processContentWithRule(processedContent, rule, context);
        }
      } catch (error) {
        console.error(`Failed to apply rule ${rule.id}:`, error);
        appliedRules.push({
          ruleId: rule.id,
          ruleName: rule.name,
          applied: false,
          reason: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          impact: 'none',
          confidence: 0
        });
      }
    }

    // Calculate quality score
    const qualityScore = await this.calculateQualityScore(processedContent, context);
    
    // Generate compliance report
    const complianceReport = await this.generateComplianceReport(processedContent, context);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(appliedRules, complianceReport, context);

    return {
      originalContent: content,
      processedContent,
      appliedRules,
      qualityScore,
      complianceReport,
      recommendations
    };
  }

  /**
   * Validate steering compliance for a module
   */
  async validateSteeringCompliance(moduleId: string, content: string, domain: string): Promise<ComplianceReport> {
    const context: SteeringContext = {
      moduleId,
      domain,
      content,
      metadata: { validationMode: true }
    };

    const applicableStandards = this.getApplicableQualityStandards(context);
    const passedStandards: string[] = [];
    const failedStandards: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    let totalScore = 0;
    let maxScore = 0;

    for (const standard of applicableStandards) {
      const score = await this.evaluateQualityStandard(standard, content, context);
      maxScore += 100;

      if (score >= standard.threshold) {
        passedStandards.push(standard.name);
        totalScore += score;
      } else {
        failedStandards.push(standard.name);
        totalScore += score;
        
        if (standard.isRequired) {
          warnings.push(`Required standard "${standard.name}" not met (${score}/${standard.threshold})`);
        }
        
        recommendations.push(`Improve ${standard.metric} to meet ${standard.name} standard`);
      }
    }

    const overallScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 100;

    return {
      overallScore,
      passedStandards,
      failedStandards,
      warnings,
      recommendations
    };
  }

  /**
   * Generate steering document for a module
   */
  async generateSteeringDocument(moduleId: string, domain: string, customRules?: SteeringRule[]): Promise<SteeringDocument> {
    const domainRules = Array.from(this.rules.values()).filter(rule => 
      rule.domain === domain || rule.domain === 'general'
    );
    
    const domainGuidelines = Array.from(this.guidelines.values()).filter(guideline =>
      guideline.domain === domain || guideline.domain === 'general'
    );
    
    const domainStandards = Array.from(this.qualityStandards.values()).filter(standard =>
      standard.domain === domain || standard.domain === 'general'
    );

    const allRules = customRules ? [...domainRules, ...customRules] : domainRules;

    const content = this.generateSteeringDocumentContent(moduleId, domain, allRules, domainGuidelines, domainStandards);

    const document: SteeringDocument = {
      id: `steering-${moduleId}`,
      title: `${moduleId} Steering Document`,
      content,
      domain,
      rules: allRules,
      guidelines: domainGuidelines,
      qualityStandards: domainStandards,
      version: '1.0.0',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.steeringDocuments.set(document.id, document);
    return document;
  }

  /**
   * Update steering rules dynamically
   */
  async updateSteeringRules(rules: SteeringRule[]): Promise<void> {
    for (const rule of rules) {
      const existingRule = this.rules.get(rule.id);
      
      if (existingRule) {
        const updatedRule = {
          ...existingRule,
          ...rule,
          updatedAt: new Date()
        };
        this.rules.set(rule.id, updatedRule);
      } else {
        const newRule = {
          ...rule,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.rules.set(rule.id, newRule);
      }
    }

    console.log(`🎃 Updated ${rules.length} steering rules`);
  }

  /**
   * Get steering rules for a domain
   */
  getDomainRules(domain: string): SteeringRule[] {
    return Array.from(this.rules.values()).filter(rule => 
      rule.domain === domain || rule.domain === 'general'
    );
  }

  /**
   * Get quality standards for a domain
   */
  getDomainStandards(domain: string): QualityStandard[] {
    return Array.from(this.qualityStandards.values()).filter(standard =>
      standard.domain === domain || standard.domain === 'general'
    );
  }

  /**
   * Get AI guidelines for a domain
   */
  getDomainGuidelines(domain: string): AIGuideline[] {
    return Array.from(this.guidelines.values()).filter(guideline =>
      guideline.domain === domain || guideline.domain === 'general'
    );
  }

  // Private methods

  private getApplicableRules(context: SteeringContext): SteeringRule[] {
    return Array.from(this.rules.values()).filter(rule => {
      if (!rule.isActive) return false;
      
      // Check domain match
      if (rule.domain !== 'general' && rule.domain !== context.domain) {
        return false;
      }
      
      // Evaluate condition (simplified)
      return this.evaluateRuleCondition(rule.condition, context);
    });
  }

  private getApplicableQualityStandards(context: SteeringContext): QualityStandard[] {
    return Array.from(this.qualityStandards.values()).filter(standard =>
      standard.domain === context.domain || standard.domain === 'general'
    );
  }

  private evaluateRuleCondition(condition: string, context: SteeringContext): boolean {
    // Simplified condition evaluation
    // In a real implementation, this would be more sophisticated
    
    if (condition === 'always') return true;
    if (condition.includes('domain')) {
      return condition.includes(context.domain);
    }
    if (condition.includes('contentType') && context.contentType) {
      return condition.includes(context.contentType);
    }
    
    return true; // Default to applicable
  }

  private async applyRule(rule: SteeringRule, content: string, context: SteeringContext): Promise<AppliedRule> {
    // Simulate rule application
    const shouldApply = this.evaluateRuleCondition(rule.condition, context);
    
    if (!shouldApply) {
      return {
        ruleId: rule.id,
        ruleName: rule.name,
        applied: false,
        reason: 'Condition not met',
        impact: 'none',
        confidence: 0
      };
    }

    // Simulate rule impact assessment
    const impact = this.assessRuleImpact(rule, content, context);
    const confidence = this.calculateRuleConfidence(rule, context);

    return {
      ruleId: rule.id,
      ruleName: rule.name,
      applied: true,
      reason: `Applied ${rule.action} based on ${rule.condition}`,
      impact,
      confidence
    };
  }

  private processContentWithRule(content: string, rule: SteeringRule, context: SteeringContext): string {
    // Simulate content processing based on rule
    // In a real implementation, this would apply actual transformations
    
    switch (rule.action) {
      case 'enhance_clarity':
        return this.enhanceContentClarity(content);
      case 'ensure_safety':
        return this.ensureContentSafety(content);
      case 'improve_quality':
        return this.improveContentQuality(content);
      case 'adapt_tone':
        return this.adaptContentTone(content, context);
      default:
        return content;
    }
  }

  private enhanceContentClarity(content: string): string {
    // Simulate clarity enhancement
    return content.replace(/\b(very|really|quite)\s+/g, ''); // Remove filler words
  }

  private ensureContentSafety(content: string): string {
    // Simulate safety filtering
    const unsafePatterns = ['harmful', 'dangerous', 'inappropriate'];
    let safeContent = content;
    
    for (const pattern of unsafePatterns) {
      safeContent = safeContent.replace(new RegExp(pattern, 'gi'), '[content filtered]');
    }
    
    return safeContent;
  }

  private improveContentQuality(content: string): string {
    // Simulate quality improvement
    return content.replace(/\s+/g, ' ').trim(); // Normalize whitespace
  }

  private adaptContentTone(content: string, context: SteeringContext): string {
    // Simulate tone adaptation based on domain
    if (context.domain === 'education') {
      return content.replace(/\b(cool|awesome|amazing)\b/g, 'excellent');
    }
    return content;
  }

  private assessRuleImpact(rule: SteeringRule, content: string, context: SteeringContext): string {
    // Simulate impact assessment
    const impacts = ['minor', 'moderate', 'significant'];
    return impacts[Math.floor(Math.random() * impacts.length)];
  }

  private calculateRuleConfidence(rule: SteeringRule, context: SteeringContext): number {
    // Simulate confidence calculation
    return Math.round(70 + Math.random() * 30); // 70-100%
  }

  private async calculateQualityScore(content: string, context: SteeringContext): Promise<number> {
    const standards = this.getApplicableQualityStandards(context);
    let totalScore = 0;
    let standardCount = 0;

    for (const standard of standards) {
      const score = await this.evaluateQualityStandard(standard, content, context);
      totalScore += score;
      standardCount++;
    }

    return standardCount > 0 ? Math.round(totalScore / standardCount) : 100;
  }

  private async evaluateQualityStandard(standard: QualityStandard, content: string, context: SteeringContext): Promise<number> {
    // Simulate quality standard evaluation
    switch (standard.metric) {
      case 'content_length':
        return Math.min(100, (content.length / 100) * 10); // Score based on length
      case 'clarity':
        return 85 + Math.random() * 15; // 85-100%
      case 'relevance':
        return 80 + Math.random() * 20; // 80-100%
      case 'safety':
        return 95 + Math.random() * 5; // 95-100%
      default:
        return 85; // Default score
    }
  }

  private async generateComplianceReport(content: string, context: SteeringContext): Promise<ComplianceReport> {
    return this.validateSteeringCompliance(context.moduleId, content, context.domain);
  }

  private generateRecommendations(appliedRules: AppliedRule[], complianceReport: ComplianceReport, context: SteeringContext): string[] {
    const recommendations: string[] = [];

    // Add recommendations based on failed rules
    const failedRules = appliedRules.filter(rule => !rule.applied);
    for (const rule of failedRules) {
      recommendations.push(`Consider addressing: ${rule.reason}`);
    }

    // Add recommendations from compliance report
    recommendations.push(...complianceReport.recommendations);

    // Add domain-specific recommendations
    if (context.domain === 'education') {
      recommendations.push('Ensure content is age-appropriate and educationally valuable');
    } else if (context.domain === 'storytelling') {
      recommendations.push('Maintain narrative coherence and character consistency');
    }

    return [...new Set(recommendations)]; // Remove duplicates
  }

  private generateSteeringDocumentContent(
    moduleId: string, 
    domain: string, 
    rules: SteeringRule[], 
    guidelines: AIGuideline[], 
    standards: QualityStandard[]
  ): string {
    return `# ${moduleId} Steering Document

## Overview
This document defines AI behavior guidelines and quality standards for the ${moduleId} module in the ${domain} domain.

## Behavior Rules
${rules.map(rule => `- **${rule.name}**: ${rule.description} (Priority: ${rule.priority})`).join('\n')}

## AI Guidelines
${guidelines.map(guideline => `### ${guideline.title}\n${guideline.content}`).join('\n\n')}

## Quality Standards
${standards.map(standard => `- **${standard.name}**: ${standard.description} (Threshold: ${standard.threshold})`).join('\n')}

## Integration
- Framework: GhostFrame
- Domain: ${domain}
- Version: 1.0.0
- Last Updated: ${new Date().toISOString()}
`;
  }

  private initializeDefaultRules(): void {
    const defaultRules: SteeringRule[] = [
      {
        id: 'general-clarity',
        name: 'Content Clarity',
        description: 'Ensure all generated content is clear and understandable',
        condition: 'always',
        action: 'enhance_clarity',
        priority: 1,
        domain: 'general',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'general-safety',
        name: 'Content Safety',
        description: 'Filter harmful or inappropriate content',
        condition: 'always',
        action: 'ensure_safety',
        priority: 1,
        domain: 'general',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'education-pedagogical',
        name: 'Educational Value',
        description: 'Ensure content has clear educational objectives',
        condition: 'domain == education',
        action: 'improve_quality',
        priority: 2,
        domain: 'education',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'storytelling-coherence',
        name: 'Narrative Coherence',
        description: 'Maintain consistent narrative structure and character development',
        condition: 'domain == storytelling',
        action: 'improve_quality',
        priority: 2,
        domain: 'storytelling',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const rule of defaultRules) {
      this.rules.set(rule.id, rule);
    }
  }

  private initializeDefaultGuidelines(): void {
    const defaultGuidelines: AIGuideline[] = [
      {
        id: 'general-helpfulness',
        title: 'Helpfulness',
        content: 'AI responses should be helpful, informative, and directly address user needs.',
        domain: 'general',
        category: 'behavior',
        applicability: { modules: [], domains: [], contentTypes: [], userTypes: [] },
        examples: ['Provide clear explanations', 'Offer actionable advice', 'Address user questions directly'],
        version: '1.0.0'
      },
      {
        id: 'education-pedagogy',
        title: 'Educational Effectiveness',
        content: 'Educational content should follow sound pedagogical principles and promote active learning.',
        domain: 'education',
        category: 'quality',
        applicability: { modules: [], domains: ['education'], contentTypes: [], userTypes: [] },
        examples: ['Use scaffolding techniques', 'Provide immediate feedback', 'Encourage critical thinking'],
        version: '1.0.0'
      }
    ];

    for (const guideline of defaultGuidelines) {
      this.guidelines.set(guideline.id, guideline);
    }
  }

  private initializeDefaultStandards(): void {
    const defaultStandards: QualityStandard[] = [
      {
        id: 'general-clarity',
        name: 'Content Clarity',
        metric: 'clarity',
        threshold: 80,
        description: 'Content must be clear and understandable',
        domain: 'general',
        measurementMethod: 'Automated readability analysis',
        isRequired: true
      },
      {
        id: 'general-safety',
        name: 'Content Safety',
        metric: 'safety',
        threshold: 95,
        description: 'Content must be safe and appropriate',
        domain: 'general',
        measurementMethod: 'Safety filter analysis',
        isRequired: true
      },
      {
        id: 'education-relevance',
        name: 'Educational Relevance',
        metric: 'relevance',
        threshold: 85,
        description: 'Educational content must be relevant to learning objectives',
        domain: 'education',
        measurementMethod: 'Semantic similarity analysis',
        isRequired: true
      }
    ];

    for (const standard of defaultStandards) {
      this.qualityStandards.set(standard.id, standard);
    }
  }

  private initializeDemoDocuments(): void {
    // Generate demo steering documents for Quiz Ghost and Story Spirit
    this.generateSteeringDocument('quiz-ghost-demo', 'education');
    this.generateSteeringDocument('story-spirit-demo', 'storytelling');
    
    console.log('👻 Demo steering documents initialized');
  }
}

// Singleton instance
export const steeringEngine = new SteeringEngine();