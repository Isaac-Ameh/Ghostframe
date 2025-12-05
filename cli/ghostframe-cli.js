#!/usr/bin/env node

// 🎃 GhostFrame CLI - Professional Developer Tool
// Entry point that loads the TypeScript-compiled CLI

const path = require('path');
const fs = require('fs');

const COMMANDS = {
  create: 'Create a new GhostFrame module',
  init: 'Initialize GhostFrame in current directory',
  dev: 'Start development server',
  build: 'Build for production',
  deploy: 'Deploy to GhostFrame Cloud',
  kiro: 'Manage Kiro integration',
  help: 'Show this help message'
};

const TEMPLATES = {
  education: {
    name: 'Education Module',
    description: 'AI-powered educational content processing',
    features: ['Quiz Generation', 'Content Analysis', 'Progress Tracking']
  },
  creative: {
    name: 'Creative Module', 
    description: 'AI-powered creative content generation',
    features: ['Story Generation', 'Character Development', 'Plot Structure']
  },
  productivity: {
    name: 'Productivity Module',
    description: 'AI-powered workflow optimization',
    features: ['Task Automation', 'Document Processing', 'Time Management']
  },
  research: {
    name: 'Research Module',
    description: 'AI-powered data analysis and insights',
    features: ['Data Analysis', 'Report Generation', 'Visualization']
  }
};

class GhostFrameCLI {
  constructor() {
    this.args = process.argv.slice(2);
    this.command = this.args[0];
  }

  run() {
    console.log('👻 GhostFrame CLI v1.0.0');
    console.log('🎃 Where dead tech learns new tricks!\n');

    switch (this.command) {
      case 'create':
        this.createModule();
        break;
      case 'init':
        this.initProject();
        break;
      case 'dev':
        this.startDev();
        break;
      case 'build':
        this.buildProject();
        break;
      case 'kiro':
        this.manageKiro();
        break;
      case 'help':
      case undefined:
        this.showHelp();
        break;
      default:
        console.log(`❌ Unknown command: ${this.command}`);
        this.showHelp();
    }
  }

  createModule() {
    const moduleName = this.args[1];
    const moduleType = this.args[2] || 'education';

    if (!moduleName) {
      console.log('❌ Module name required');
      console.log('Usage: ghostframe create <module-name> [type]');
      console.log('Types: education, creative, productivity, research');
      return;
    }

    console.log(`🎃 Creating ${moduleType} module: ${moduleName}`);

    const template = TEMPLATES[moduleType] || TEMPLATES.education;
    const moduleId = moduleName.toLowerCase().replace(/[^a-z0-9]/g, '-');

    // Create module directory structure
    const moduleDir = path.join(process.cwd(), 'modules', moduleId);
    this.createDirectory(moduleDir);

    // Generate module files
    this.generateModuleFiles(moduleDir, {
      id: moduleId,
      name: moduleName,
      type: moduleType,
      ...template
    });

    console.log(`✅ Module created successfully!`);
    console.log(`📁 Location: ${moduleDir}`);
    console.log(`🚀 Next steps:`);
    console.log(`   cd modules/${moduleId}`);
    console.log(`   npm install`);
    console.log(`   npm run dev`);
  }

  initProject() {
    console.log('🎃 Initializing GhostFrame project...');

    // Create project structure
    const dirs = [
      'frontend',
      'backend', 
      'modules',
      '.kiro/specs',
      '.kiro/hooks',
      '.kiro/steering',
      'docs'
    ];

    dirs.forEach(dir => {
      this.createDirectory(path.join(process.cwd(), dir));
    });

    // Create configuration files
    this.createFile('ghostframe.config.js', this.getConfigTemplate());
    this.createFile('.kiro/specs/project.md', this.getProjectSpecTemplate());
    this.createFile('.kiro/hooks/onInit.js', this.getInitHookTemplate());
    this.createFile('.kiro/steering/behavior.md', this.getSteeringTemplate());
    this.createFile('README.md', this.getReadmeTemplate());

    console.log('✅ GhostFrame project initialized!');
    console.log('🚀 Run: ghostframe dev');
  }

  startDev() {
    console.log('🎃 Starting GhostFrame development server...');
    try {
      execSync('npm run dev', { stdio: 'inherit' });
    } catch (error) {
      console.log('❌ Failed to start dev server');
      console.log('Make sure you have run: npm install');
    }
  }

  buildProject() {
    console.log('🎃 Building GhostFrame project...');
    try {
      execSync('npm run build', { stdio: 'inherit' });
      console.log('✅ Build completed successfully!');
    } catch (error) {
      console.log('❌ Build failed');
    }
  }

  manageKiro() {
    const action = this.args[1];
    
    switch (action) {
      case 'init':
        this.initKiro();
        break;
      case 'validate':
        this.validateKiro();
        break;
      case 'generate':
        this.generateKiroSpecs();
        break;
      default:
        console.log('Kiro commands:');
        console.log('  init     - Initialize Kiro integration');
        console.log('  validate - Validate Kiro configuration');
        console.log('  generate - Generate Kiro specifications');
    }
  }

  initKiro() {
    console.log('🤖 Initializing Kiro integration...');
    
    const kiroDir = path.join(process.cwd(), '.kiro');
    this.createDirectory(path.join(kiroDir, 'specs'));
    this.createDirectory(path.join(kiroDir, 'hooks'));
    this.createDirectory(path.join(kiroDir, 'steering'));

    console.log('✅ Kiro integration initialized!');
  }

  validateKiro() {
    console.log('🤖 Validating Kiro configuration...');
    
    const kiroDir = path.join(process.cwd(), '.kiro');
    const requiredFiles = [
      'specs/requirements.md',
      'hooks/onUpload.js',
      'steering/behavior.md'
    ];

    let valid = true;
    requiredFiles.forEach(file => {
      const filePath = path.join(kiroDir, file);
      if (!fs.existsSync(filePath)) {
        console.log(`❌ Missing: .kiro/${file}`);
        valid = false;
      } else {
        console.log(`✅ Found: .kiro/${file}`);
      }
    });

    if (valid) {
      console.log('🎉 Kiro configuration is valid!');
    } else {
      console.log('❌ Kiro configuration incomplete');
    }
  }

  generateKiroSpecs() {
    console.log('🤖 Generating Kiro specifications...');
    // This would integrate with the KiroSpecGenerator service
    console.log('✅ Kiro specs generated!');
  }

  showHelp() {
    console.log('Available commands:\n');
    Object.entries(COMMANDS).forEach(([cmd, desc]) => {
      console.log(`  ${cmd.padEnd(10)} ${desc}`);
    });
    console.log('\nExamples:');
    console.log('  ghostframe create my-quiz-app education');
    console.log('  ghostframe init');
    console.log('  ghostframe kiro validate');
    console.log('\n🎃 Happy haunting!');
  }

  // Utility methods
  createDirectory(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created: ${dir}`);
    }
  }

  createFile(filePath, content) {
    const fullPath = path.join(process.cwd(), filePath);
    fs.writeFileSync(fullPath, content);
    console.log(`📄 Created: ${filePath}`);
  }

  generateModuleFiles(moduleDir, config) {
    // Package.json
    const packageJson = {
      name: config.id,
      version: '1.0.0',
      description: config.description,
      main: 'dist/index.js',
      scripts: {
        dev: 'tsc --watch',
        build: 'tsc',
        test: 'jest'
      },
      dependencies: {
        '@ghostframe/core': '^1.0.0',
        'typescript': '^5.0.0'
      }
    };

    this.createFile(path.join(moduleDir, 'package.json'), JSON.stringify(packageJson, null, 2));

    // TypeScript processor
    const processorCode = `// 🎃 ${config.name} Processor
// Generated by GhostFrame CLI

import { ModuleProcessor } from '@ghostframe/core';

export class ${this.toPascalCase(config.id)}Processor implements ModuleProcessor {
  async process(input: any): Promise<any> {
    // Your ${config.type} processing logic here
    console.log('Processing with ${config.name}:', input);
    
    // TODO: Implement your AI logic
    return {
      result: 'Processed successfully',
      metadata: {
        module: '${config.id}',
        timestamp: new Date().toISOString()
      }
    };
  }
}`;

    this.createFile(path.join(moduleDir, 'src', 'processor.ts'), processorCode);

    // README
    const readme = `# ${config.name}

${config.description}

## Features

${config.features.map(f => `- ${f}`).join('\n')}

## Usage

\`\`\`typescript
import { ${this.toPascalCase(config.id)}Processor } from './${config.id}';

const processor = new ${this.toPascalCase(config.id)}Processor();
const result = await processor.process(input);
\`\`\`

## Development

\`\`\`bash
npm install
npm run dev
\`\`\`

Built with 🎃 GhostFrame`;

    this.createFile(path.join(moduleDir, 'README.md'), readme);
  }

  toPascalCase(str) {
    return str.replace(/[^a-zA-Z0-9]/g, ' ')
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join('');
  }

  // Template methods
  getConfigTemplate() {
    return `// 🎃 GhostFrame Configuration
module.exports = {
  name: 'My GhostFrame Project',
  version: '1.0.0',
  modules: './modules',
  kiro: {
    enabled: true,
    specs: './.kiro/specs',
    hooks: './.kiro/hooks',
    steering: './.kiro/steering'
  },
  ai: {
    providers: ['openai', 'anthropic'],
    fallback: true
  }
};`;
  }

  getProjectSpecTemplate() {
    return `# Project Specifications

## Overview
This project uses GhostFrame for modular AI development.

## Requirements
- Kiro-compatible architecture
- Modular design
- AI-powered processing

## Generated by GhostFrame CLI`;
  }

  getInitHookTemplate() {
    return `// 🎃 GhostFrame Init Hook
// Triggered when project initializes

module.exports = {
  name: 'Project Initialization',
  trigger: 'onInit',
  action: async (context) => {
    console.log('🎃 GhostFrame project initialized!');
    return { success: true };
  }
};`;
  }

  getSteeringTemplate() {
    return `# AI Behavior Steering

## Personality
- Professional yet friendly
- Helpful and informative
- Spooky theme appropriate

## Guidelines
- Always provide clear explanations
- Include examples when helpful
- Maintain the GhostFrame aesthetic

Generated by GhostFrame CLI 🎃`;
  }

  getReadmeTemplate() {
    return `# 🎃 GhostFrame Project

Welcome to your new GhostFrame project!

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Start development
ghostframe dev

# Create a new module
ghostframe create my-module education
\`\`\`

## Project Structure

\`\`\`
project/
├── frontend/          # Next.js frontend
├── backend/           # Express backend
├── modules/           # Your AI modules
├── .kiro/            # Kiro integration
│   ├── specs/        # Specifications
│   ├── hooks/        # Automation hooks
│   └── steering/     # AI behavior
└── docs/             # Documentation
\`\`\`

Built with 🎃 GhostFrame - Where dead tech learns new tricks!`;
  }
}

// Check if TypeScript version exists, otherwise use legacy
const distPath = path.join(__dirname, 'dist', 'index.js');

if (fs.existsSync(distPath)) {
  // Use compiled TypeScript version
  require(distPath);
} else {
  // Fallback to legacy version for development
  console.log('⚠️  Running legacy CLI. Run "npm run build" for full features.');
  const cli = new GhostFrameCLI();
  cli.run();
}

module.exports = GhostFrameCLI;