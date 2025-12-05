# 🚀 Quick Start Guide

Get up and running with GhostFrame in under 10 minutes! This guide will walk you through creating, testing, and deploying your first AI module.

## Prerequisites

Before you begin, make sure you have:

- **Node.js 18+** installed on your system
- **npm** or **yarn** package manager
- A **GhostFrame account** (sign up at [ghostframe.dev](https://ghostframe.dev))
- Basic knowledge of **TypeScript/JavaScript**

## Step 1: Install the GhostFrame CLI

The GhostFrame CLI is your primary tool for module development:

```bash
# Install globally via npm
npm install -g @ghostframe/cli

# Or via yarn
yarn global add @ghostframe/cli

# Verify installation
ghostframe --version
```

## Step 2: Authenticate with GhostFrame

Connect your CLI to your GhostFrame account:

```bash
# Login with your API key
ghostframe login

# Or set your API key directly
ghostframe config --set apiKey=your_api_key_here
```

> 💡 **Tip**: Get your API key from the [GhostFrame Dashboard](https://app.ghostframe.dev/settings/api-keys)

## Step 3: Initialize Your Project

Create a new GhostFrame project:

```bash
# Create and navigate to your project directory
mkdir my-ghostframe-project
cd my-ghostframe-project

# Initialize the project
ghostframe init

# Follow the interactive prompts:
# ✓ Project name: my-ghostframe-project
# ✓ Template: Basic Framework Project
# ✓ Include examples: Yes
```

This creates the following structure:

```
my-ghostframe-project/
├── .kiro/                  # Kiro specifications
│   ├── specs/
│   ├── hooks/
│   └── steering/
├── modules/                # Your Ghost modules
├── docs/                   # Documentation
├── scripts/                # Development scripts
├── package.json
├── README.md
└── ghostframe.config.json  # Framework configuration
```

## Step 4: Create Your First Module

Let's create a simple text processing module:

```bash
# Create a new module interactively
ghostframe create --interactive
```

Follow the prompts:

```
🎃 Creating new Ghost module...

? Module name: text-summarizer
? Module description: AI-powered text summarization module
? Module category: productivity
? Select features:
  ◉ AI Text Processing
  ◉ Caching
  ◯ File Upload Support
  ◯ Real-time Processing
? Select AI models:
  ◉ GPT-3.5 Turbo
  ◯ GPT-4
  ◯ Claude 3 Sonnet
? Include test files? Yes
? Include Docker configuration? Yes

✅ Module created successfully!
```

This generates a complete module structure:

```
modules/text-summarizer/
├── src/
│   ├── index.ts           # Main module code
│   ├── types.ts           # Type definitions
│   └── utils.ts           # Utility functions
├── tests/
│   ├── index.test.ts      # Unit tests
│   └── integration.test.ts # Integration tests
├── package.json
├── ghostframe.config.json # Module configuration
├── Dockerfile
└── README.md
```

## Step 5: Examine the Generated Code

Let's look at the main module file:

```typescript
// modules/text-summarizer/src/index.ts
import { GhostModule, ExecutionContext, ExecutionResult } from '@ghostframe/sdk';

export default class TextSummarizerModule extends GhostModule {
  async execute(context: ExecutionContext): Promise<ExecutionResult> {
    const { input, options } = context;
    
    // Validate input
    if (!input.text || typeof input.text !== 'string') {
      throw new Error('Input must contain a "text" field with string content');
    }

    // Process with AI
    const summary = await this.processWithAI(input.text, {
      model: options?.aiModel || 'gpt-3.5-turbo',
      maxLength: options?.maxLength || 150
    });

    return {
      success: true,
      output: {
        summary,
        originalLength: input.text.length,
        summaryLength: summary.length,
        compressionRatio: (summary.length / input.text.length).toFixed(2)
      },
      metadata: {
        executionTime: Date.now() - context.startTime,
        aiModel: options?.aiModel || 'gpt-3.5-turbo',
        tokensUsed: this.estimateTokens(input.text + summary),
        qualityScore: 95
      }
    };
  }

  private async processWithAI(text: string, options: any): Promise<string> {
    // AI processing logic here
    const prompt = `Summarize the following text in ${options.maxLength} characters or less:\n\n${text}`;
    
    // Use the framework's AI gateway
    return await this.aiGateway.generate({
      model: options.model,
      prompt,
      maxTokens: Math.ceil(options.maxLength / 4), // Rough token estimation
      temperature: 0.3
    });
  }

  private estimateTokens(text: string): number {
    // Rough token estimation (1 token ≈ 4 characters)
    return Math.ceil(text.length / 4);
  }
}
```

## Step 6: Configure Your Module

The module configuration defines inputs, outputs, and behavior:

```json
// modules/text-summarizer/ghostframe.config.json
{
  "inputSchema": {
    "type": "object",
    "properties": {
      "text": {
        "type": "string",
        "description": "Text to summarize",
        "minLength": 50,
        "maxLength": 10000
      }
    },
    "required": ["text"]
  },
  "outputSchema": {
    "type": "object",
    "properties": {
      "summary": {
        "type": "string",
        "description": "Generated summary"
      },
      "originalLength": {
        "type": "number",
        "description": "Length of original text"
      },
      "summaryLength": {
        "type": "number",
        "description": "Length of summary"
      },
      "compressionRatio": {
        "type": "string",
        "description": "Compression ratio as string"
      }
    },
    "required": ["summary", "originalLength", "summaryLength", "compressionRatio"]
  },
  "aiModels": ["gpt-3.5-turbo"],
  "features": ["ai_text", "caching"],
  "permissions": [],
  "resources": {
    "cpu": "500m",
    "memory": "512Mi",
    "storage": "1Gi"
  }
}
```

## Step 7: Test Your Module

Run the generated tests to ensure everything works:

```bash
# Navigate to your module
cd modules/text-summarizer

# Run tests
ghostframe test

# Run with coverage
ghostframe test --coverage

# Run specific test types
ghostframe test --unit
ghostframe test --integration
```

Expected output:

```
🧪 Running tests...

✅ Basic functionality test (150ms)
✅ Input validation test (75ms)
✅ AI processing test (1200ms)
✅ Output format test (50ms)
✅ Error handling test (25ms)

Test Results:
Passed: 5
Failed: 0
Skipped: 0
Duration: 1500ms
Coverage: 92.5%

✅ All tests passed!
```

## Step 8: Validate Your Module

Ensure your module meets GhostFrame standards:

```bash
# Run validation
ghostframe validate

# Run with auto-fix for common issues
ghostframe validate --fix
```

Expected output:

```
🎃 Validating module...

📋 Validation Results:
Score: 95/100
Status: ✅ Valid

💡 Suggestions:
  • Consider adding more comprehensive error handling
  • Add performance benchmarks for large texts
  • Consider implementing streaming for very long summaries

✅ Module validation passed!
```

## Step 9: Deploy Your Module

Deploy to the development environment:

```bash
# Deploy to development
ghostframe deploy --environment development

# Deploy with specific version
ghostframe deploy --environment development --version 1.0.0
```

Expected output:

```
🚀 Deploying module to development...

✅ Deployment successful!
Deployment ID: deploy_1234567890
Environment: development
Version: 1.0.0
URL: https://dev.ghostframe.dev/modules/text-summarizer

Next steps:
  • Test your module: ghostframe test --environment development
  • View logs: ghostframe logs --module text-summarizer
  • Monitor performance: https://app.ghostframe.dev/modules/text-summarizer
```

## Step 10: Test Your Deployed Module

Test your module in the cloud:

```bash
# Test the deployed module
curl -X POST https://dev.ghostframe.dev/modules/text-summarizer/execute \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "text": "Artificial intelligence (AI) is intelligence demonstrated by machines, in contrast to the natural intelligence displayed by humans and animals. Leading AI textbooks define the field as the study of intelligent agents: any device that perceives its environment and takes actions that maximize its chance of successfully achieving its goals. Colloquially, the term artificial intelligence is often used to describe machines that mimic cognitive functions that humans associate with the human mind, such as learning and problem solving."
    },
    "options": {
      "maxLength": 100
    }
  }'
```

Expected response:

```json
{
  "success": true,
  "output": {
    "summary": "AI is machine intelligence that perceives environments and takes goal-oriented actions, mimicking human cognitive functions like learning and problem-solving.",
    "originalLength": 578,
    "summaryLength": 98,
    "compressionRatio": "0.17"
  },
  "metadata": {
    "executionTime": 1250,
    "aiModel": "gpt-3.5-turbo",
    "tokensUsed": 169,
    "qualityScore": 95
  }
}
```

## 🎉 Congratulations!

You've successfully:

- ✅ Set up GhostFrame development environment
- ✅ Created your first AI module
- ✅ Tested and validated your module
- ✅ Deployed to the cloud
- ✅ Tested your deployed module

## Next Steps

Now that you have a working module, explore these advanced topics:

### Enhance Your Module
- **[Add Kiro Integration](./kiro/README.md)** - Add hooks, steering, and specifications
- **[Improve Performance](./performance/README.md)** - Optimize for speed and efficiency
- **[Add Security](./security/README.md)** - Implement security best practices

### Build More Modules
- **[Module Patterns](./patterns/README.md)** - Learn common module patterns
- **[AI Model Integration](./ai-models/README.md)** - Work with different AI models
- **[Advanced Features](./modules/advanced.md)** - File uploads, streaming, real-time processing

### Production Deployment
- **[Environment Configuration](./environments/README.md)** - Set up staging and production
- **[Monitoring Setup](./monitoring/README.md)** - Monitor your modules in production
- **[Scaling Configuration](./scaling/README.md)** - Handle production traffic

### Explore Examples
- **[Example Modules](./examples/README.md)** - See real-world module implementations
- **[Tutorials](./tutorials/README.md)** - Step-by-step guides for specific use cases

## Need Help?

- 📖 **Documentation**: Continue reading this developer guide
- 💬 **Discord**: Join our [community Discord](https://discord.gg/ghostframe)
- 🐛 **Issues**: Report bugs on [GitHub](https://github.com/ghostframe/ghostframe/issues)
- 📧 **Support**: Email us at [support@ghostframe.dev](mailto:support@ghostframe.dev)

---

**Ready for more?** Check out [Your First Module](./first-module.md) for a deeper dive into module development! 🚀