// 🎃 GhostFrame CLI Validation Runner
// Runs comprehensive Kiro compliance validation

import fs from 'fs-extra';
import path from 'path';
import axios from 'axios';

export interface ValidationOptions {
  moduleConfig: any;
  strictMode: boolean;
  performanceBenchmarks: boolean;
  securityScanning: boolean;
}

export interface ValidationResult {
  overall: {
    status: 'passed' | 'warning' | 'failed';
    score: number;
    message: string;
  };
  categories: {
    [category: string]: {
      status: 'passed' | 'warning' | 'failed';
      score: number;
      issues: Array<{
        severity: 'error' | 'warning' | 'info';
        message: string;
        file?: string;
        line?: number;
      }>;
    };
  };
  timestamp: string;
}

export class ValidationRunner {
  private apiClient: any;

  constructor() {
    this.apiClient = axios.create({
      baseURL: process.env.GHOSTFRAME_API_URL || 'http://localhost:3001/api',
      timeout: 30000
    });
  }

  /**
   * Run comprehensive module validation
   */
  async validateModule(options: ValidationOptions): Promise<ValidationResult> {
    const result: ValidationResult = {
      overall: { status: 'passed', score: 100, message: '' },
      categories: {},
      timestamp: new Date().toISOString()
    };

    try {
      // Run local validations
      await this.validateModuleStructure(options, result);
      await this.validateKiroCompliance(options, result);
      await this.validateConfiguration(options, result);
      await this.validateDependencies(options, result);

      if (options.performanceBenchmarks) {
        await this.validatePerformance(options, result);
      }

      if (options.securityScanning) {
        await this.validateSecurity(options, result);
      }

      // Run remote validation if API is available
      try {
        await this.runRemoteValidation(options, result);
      } catch (error) {
        console.warn('Remote validation unavailable, using local validation only');
      }

      // Calculate overall score and status
      this.calculateOverallResult(result);

    } catch (error) {
      result.overall = {
        status: 'failed',
        score: 0,
        message: `Validation failed: ${error instanceof Error ? error.message : error}`
      };
    }

    return result;
  }

  private async validateModuleStructure(options: ValidationOptions, result: ValidationResult): Promise<void> {
    const issues: any[] = [];
    let score = 100;

    // Check required files
    const requiredFiles = [
      'package.json',
      'ghostframe.config.json',
      'src/index.ts',
      'README.md',
      '.kiro/specs/module.md',
      '.kiro/hooks/index.ts',
      '.kiro/steering/behavior.md'
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(process.cwd(), file);
      if (!await fs.pathExists(filePath)) {
        issues.push({
          severity: 'error',
          message: `Missing required file: ${file}`,
          file
        });
        score -= 15;
      }
    }

    // Check directory structure
    const requiredDirs = [
      'src',
      '.kiro',
      '.kiro/specs',
      '.kiro/hooks',
      '.kiro/steering'
    ];

    for (const dir of requiredDirs) {
      const dirPath = path.join(process.cwd(), dir);
      if (!await fs.pathExists(dirPath)) {
        issues.push({
          severity: 'error',
          message: `Missing required directory: ${dir}`,
          file: dir
        });
        score -= 10;
      }
    }

    // Check TypeScript configuration
    const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
    if (await fs.pathExists(tsConfigPath)) {
      try {
        const tsConfig = await fs.readJson(tsConfigPath);
        if (!tsConfig.compilerOptions || !tsConfig.compilerOptions.strict) {
          issues.push({
            severity: 'warning',
            message: 'TypeScript strict mode is recommended',
            file: 'tsconfig.json'
          });
          score -= 5;
        }
      } catch (error) {
        issues.push({
          severity: 'error',
          message: 'Invalid tsconfig.json format',
          file: 'tsconfig.json'
        });
        score -= 10;
      }
    }

    result.categories.structure = {
      status: score >= 80 ? 'passed' : score >= 60 ? 'warning' : 'failed',
      score: Math.max(0, score),
      issues
    };
  }

  private async validateKiroCompliance(options: ValidationOptions, result: ValidationResult): Promise<void> {
    const issues: any[] = [];
    let score = 100;

    // Validate ghostframe.config.json
    const configPath = path.join(process.cwd(), 'ghostframe.config.json');
    if (await fs.pathExists(configPath)) {
      try {
        const config = await fs.readJson(configPath);

        // Check required fields
        const requiredFields = ['id', 'name', 'version', 'category', 'kiroCompatibility'];
        for (const field of requiredFields) {
          if (!config[field]) {
            issues.push({
              severity: 'error',
              message: `Missing required field in config: ${field}`,
              file: 'ghostframe.config.json'
            });
            score -= 15;
          }
        }

        // Validate schemas
        if (!config.config?.inputSchema || !config.config?.outputSchema) {
          issues.push({
            severity: 'error',
            message: 'Input and output schemas are required',
            file: 'ghostframe.config.json'
          });
          score -= 20;
        }

        // Validate Kiro compatibility version
        if (config.kiroCompatibility && !config.kiroCompatibility.match(/^\d+\.\d+\.\d+$/)) {
          issues.push({
            severity: 'error',
            message: 'Invalid Kiro compatibility version format',
            file: 'ghostframe.config.json'
          });
          score -= 10;
        }

      } catch (error) {
        issues.push({
          severity: 'error',
          message: 'Invalid ghostframe.config.json format',
          file: 'ghostframe.config.json'
        });
        score -= 30;
      }
    }

    // Validate Kiro specs
    const specsPath = path.join(process.cwd(), '.kiro', 'specs', 'module.md');
    if (await fs.pathExists(specsPath)) {
      const specs = await fs.readFile(specsPath, 'utf8');
      if (specs.length < 100) {
        issues.push({
          severity: 'warning',
          message: 'Kiro specs appear incomplete (too short)',
          file: '.kiro/specs/module.md'
        });
        score -= 5;
      }
    }

    // Validate hooks
    const hooksPath = path.join(process.cwd(), '.kiro', 'hooks', 'index.ts');
    if (await fs.pathExists(hooksPath)) {
      const hooks = await fs.readFile(hooksPath, 'utf8');
      if (!hooks.includes('handleContentUpload') || !hooks.includes('handleProcessingComplete')) {
        issues.push({
          severity: 'warning',
          message: 'Missing recommended hook handlers',
          file: '.kiro/hooks/index.ts'
        });
        score -= 10;
      }
    }

    // Validate steering
    const steeringPath = path.join(process.cwd(), '.kiro', 'steering', 'behavior.md');
    if (await fs.pathExists(steeringPath)) {
      const steering = await fs.readFile(steeringPath, 'utf8');
      if (steering.length < 50) {
        issues.push({
          severity: 'warning',
          message: 'Steering guidelines appear incomplete',
          file: '.kiro/steering/behavior.md'
        });
        score -= 5;
      }
    }

    result.categories.kiro = {
      status: score >= 80 ? 'passed' : score >= 60 ? 'warning' : 'failed',
      score: Math.max(0, score),
      issues
    };
  }

  private async validateConfiguration(options: ValidationOptions, result: ValidationResult): Promise<void> {
    const issues: any[] = [];
    let score = 100;

    // Validate package.json
    const packagePath = path.join(process.cwd(), 'package.json');
    if (await fs.pathExists(packagePath)) {
      try {
        const pkg = await fs.readJson(packagePath);

        // Check required fields
        if (!pkg.name || !pkg.version || !pkg.description) {
          issues.push({
            severity: 'error',
            message: 'Missing required package.json fields (name, version, description)',
            file: 'package.json'
          });
          score -= 20;
        }

        // Check version format
        if (pkg.version && !pkg.version.match(/^\d+\.\d+\.\d+$/)) {
          issues.push({
            severity: 'error',
            message: 'Invalid version format (use semantic versioning)',
            file: 'package.json'
          });
          score -= 10;
        }

        // Check scripts
        const requiredScripts = ['build', 'test'];
        for (const script of requiredScripts) {
          if (!pkg.scripts?.[script]) {
            issues.push({
              severity: 'warning',
              message: `Missing recommended script: ${script}`,
              file: 'package.json'
            });
            score -= 5;
          }
        }

        // Check dependencies
        if (!pkg.dependencies || Object.keys(pkg.dependencies).length === 0) {
          issues.push({
            severity: 'warning',
            message: 'No dependencies specified',
            file: 'package.json'
          });
          score -= 5;
        }

      } catch (error) {
        issues.push({
          severity: 'error',
          message: 'Invalid package.json format',
          file: 'package.json'
        });
        score -= 30;
      }
    }

    result.categories.configuration = {
      status: score >= 80 ? 'passed' : score >= 60 ? 'warning' : 'failed',
      score: Math.max(0, score),
      issues
    };
  }

  private async validateDependencies(options: ValidationOptions, result: ValidationResult): Promise<void> {
    const issues: any[] = [];
    let score = 100;

    try {
      const packagePath = path.join(process.cwd(), 'package.json');
      if (await fs.pathExists(packagePath)) {
        const pkg = await fs.readJson(packagePath);
        
        // Check for security vulnerabilities (simplified check)
        const dependencies = { ...pkg.dependencies, ...pkg.devDependencies };
        
        // Check for outdated or vulnerable packages (mock implementation)
        const vulnerablePackages = ['lodash@4.17.20', 'axios@0.21.0']; // Example
        
        for (const [name, version] of Object.entries(dependencies)) {
          const depString = `${name}@${version}`;
          if (vulnerablePackages.some(vuln => depString.includes(vuln))) {
            issues.push({
              severity: 'warning',
              message: `Potentially vulnerable dependency: ${name}@${version}`,
              file: 'package.json'
            });
            score -= 10;
          }
        }

        // Check for missing peer dependencies
        if (pkg.peerDependencies) {
          for (const peerDep of Object.keys(pkg.peerDependencies)) {
            if (!dependencies[peerDep]) {
              issues.push({
                severity: 'warning',
                message: `Peer dependency not installed: ${peerDep}`,
                file: 'package.json'
              });
              score -= 5;
            }
          }
        }
      }

    } catch (error) {
      issues.push({
        severity: 'error',
        message: `Dependency validation failed: ${error instanceof Error ? error.message : error}`,
        file: 'package.json'
      });
      score -= 20;
    }

    result.categories.dependencies = {
      status: score >= 80 ? 'passed' : score >= 60 ? 'warning' : 'failed',
      score: Math.max(0, score),
      issues
    };
  }

  private async validatePerformance(options: ValidationOptions, result: ValidationResult): Promise<void> {
    const issues: any[] = [];
    let score = 100;

    try {
      // Check for performance-related configurations
      const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
      if (await fs.pathExists(tsConfigPath)) {
        const tsConfig = await fs.readJson(tsConfigPath);
        
        if (!tsConfig.compilerOptions?.sourceMap) {
          issues.push({
            severity: 'info',
            message: 'Source maps disabled - may impact debugging performance',
            file: 'tsconfig.json'
          });
          score -= 2;
        }

        if (tsConfig.compilerOptions?.target === 'ES5') {
          issues.push({
            severity: 'warning',
            message: 'ES5 target may impact runtime performance',
            file: 'tsconfig.json'
          });
          score -= 5;
        }
      }

      // Check bundle size (mock implementation)
      const srcPath = path.join(process.cwd(), 'src');
      if (await fs.pathExists(srcPath)) {
        const files = await fs.readdir(srcPath, { recursive: true });
        const totalFiles = files.length;
        
        if (totalFiles > 50) {
          issues.push({
            severity: 'warning',
            message: `Large number of source files (${totalFiles}) may impact build performance`,
            file: 'src/'
          });
          score -= 5;
        }
      }

    } catch (error) {
      issues.push({
        severity: 'warning',
        message: `Performance validation failed: ${error instanceof Error ? error.message : error}`
      });
      score -= 10;
    }

    result.categories.performance = {
      status: score >= 80 ? 'passed' : score >= 60 ? 'warning' : 'failed',
      score: Math.max(0, score),
      issues
    };
  }

  private async validateSecurity(options: ValidationOptions, result: ValidationResult): Promise<void> {
    const issues: any[] = [];
    let score = 100;

    try {
      // Check for common security issues
      const packagePath = path.join(process.cwd(), 'package.json');
      if (await fs.pathExists(packagePath)) {
        const pkg = await fs.readJson(packagePath);

        // Check for scripts that might be security risks
        if (pkg.scripts) {
          for (const [scriptName, scriptCommand] of Object.entries(pkg.scripts)) {
            if (typeof scriptCommand === 'string') {
              if (scriptCommand.includes('curl') || scriptCommand.includes('wget')) {
                issues.push({
                  severity: 'warning',
                  message: `Script "${scriptName}" contains network commands that may pose security risks`,
                  file: 'package.json'
                });
                score -= 10;
              }

              if (scriptCommand.includes('rm -rf') || scriptCommand.includes('del /f')) {
                issues.push({
                  severity: 'warning',
                  message: `Script "${scriptName}" contains destructive commands`,
                  file: 'package.json'
                });
                score -= 15;
              }
            }
          }
        }
      }

      // Check for sensitive files that shouldn't be included
      const sensitiveFiles = ['.env', '.env.local', 'id_rsa', 'id_dsa', '.aws/credentials'];
      for (const file of sensitiveFiles) {
        const filePath = path.join(process.cwd(), file);
        if (await fs.pathExists(filePath)) {
          issues.push({
            severity: 'error',
            message: `Sensitive file detected: ${file}`,
            file
          });
          score -= 20;
        }
      }

      // Check .gitignore for security
      const gitignorePath = path.join(process.cwd(), '.gitignore');
      if (await fs.pathExists(gitignorePath)) {
        const gitignore = await fs.readFile(gitignorePath, 'utf8');
        const requiredIgnores = ['.env', 'node_modules', '*.log'];
        
        for (const ignore of requiredIgnores) {
          if (!gitignore.includes(ignore)) {
            issues.push({
              severity: 'warning',
              message: `Missing .gitignore entry: ${ignore}`,
              file: '.gitignore'
            });
            score -= 5;
          }
        }
      } else {
        issues.push({
          severity: 'warning',
          message: 'Missing .gitignore file',
          file: '.gitignore'
        });
        score -= 10;
      }

    } catch (error) {
      issues.push({
        severity: 'warning',
        message: `Security validation failed: ${error instanceof Error ? error.message : error}`
      });
      score -= 10;
    }

    result.categories.security = {
      status: score >= 80 ? 'passed' : score >= 60 ? 'warning' : 'failed',
      score: Math.max(0, score),
      issues
    };
  }

  private async runRemoteValidation(options: ValidationOptions, result: ValidationResult): Promise<void> {
    try {
      const response = await this.apiClient.post('/modules/validate', {
        moduleConfig: options.moduleConfig,
        strictMode: options.strictMode,
        performanceBenchmarks: options.performanceBenchmarks,
        securityScanning: options.securityScanning
      });

      // Merge remote validation results
      if (response.data.success && response.data.data) {
        const remoteResult = response.data.data;
        
        // Merge categories
        Object.keys(remoteResult.categories || {}).forEach(category => {
          if (result.categories[category]) {
            // Combine scores (weighted average)
            const localScore = result.categories[category].score;
            const remoteScore = remoteResult.categories[category].score;
            result.categories[category].score = Math.round((localScore + remoteScore) / 2);
            
            // Combine issues
            result.categories[category].issues.push(
              ...(remoteResult.categories[category].issues || [])
            );
            
            // Update status based on combined score
            const combinedScore = result.categories[category].score;
            result.categories[category].status = 
              combinedScore >= 80 ? 'passed' : 
              combinedScore >= 60 ? 'warning' : 'failed';
          } else {
            result.categories[category] = remoteResult.categories[category];
          }
        });
      }

    } catch (error) {
      // Remote validation failed, continue with local validation only
      console.warn('Remote validation unavailable:', error instanceof Error ? error.message : error);
    }
  }

  private calculateOverallResult(result: ValidationResult): void {
    const categories = Object.values(result.categories);
    
    if (categories.length === 0) {
      result.overall = {
        status: 'failed',
        score: 0,
        message: 'No validation categories completed'
      };
      return;
    }

    // Calculate weighted average score
    const totalScore = categories.reduce((sum, cat) => sum + cat.score, 0);
    const averageScore = Math.round(totalScore / categories.length);

    // Count issues by severity
    const errorCount = categories.reduce((sum, cat) => 
      sum + cat.issues.filter(issue => issue.severity === 'error').length, 0);
    const warningCount = categories.reduce((sum, cat) => 
      sum + cat.issues.filter(issue => issue.severity === 'warning').length, 0);

    // Determine overall status
    let status: 'passed' | 'warning' | 'failed';
    let message: string;

    if (errorCount > 0) {
      status = 'failed';
      message = `Validation failed with ${errorCount} error(s) and ${warningCount} warning(s)`;
    } else if (warningCount > 0 || averageScore < 80) {
      status = 'warning';
      message = `Validation completed with ${warningCount} warning(s)`;
    } else {
      status = 'passed';
      message = 'All validation checks passed successfully';
    }

    result.overall = {
      status,
      score: averageScore,
      message
    };
  }
}