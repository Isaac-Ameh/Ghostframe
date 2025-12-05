# 🔧 GhostFrame TypeScript SDK

The GhostFrame SDK provides a comprehensive TypeScript library for building, testing, and integrating Ghost modules. It offers type-safe APIs, helper utilities, and seamless integration with the GhostFrame ecosystem.

## Installation

```bash
# Install via npm
npm install @ghostframe/sdk

# Or via yarn
yarn add @ghostframe/sdk
```

## Quick Start

```typescript
import { createSDK, createModule } from '@ghostframe/sdk';

// Initialize SDK
const sdk = createSDK({
  apiKey: 'your_api_key',
  environment: 'development'
});

await sdk.initialize();

// Create a module definition
const moduleDefinition = createModule()
  .name('text-processor')
  .description('AI-powered text processing module')
  .category('productivity')
  .inputSchema({
    type: 'object',
    properties: {
      text: { type: 'string', minLength: 1 }
    },
    required: ['text']
  })
  .outputSchema({
    type: 'object',
    properties: {
      result: { type: 'string' }
    },
    required: ['result']
  })
  .aiModels(['gpt-3.5-turbo'])
  .build();

// Create the module
const module = await sdk.createModule(moduleDefinition);

// Execute the module
const result = await sdk.executeModule({
  moduleId: module.id,
  sessionId: 'session_123',
  input: { text: 'Hello, world!' }
});

console.log(result.output);
```

## Core Concepts

### SDK Instance
The main SDK class that provides access to all GhostFrame functionality.

### Module Definitions
Type-safe definitions for creating new Ghost modules.

### Execution Context
Runtime context for module execution with input, options, and Kiro integration.

### Validation & Testing
Built-in validation and testing utilities for ensuring module quality.

## API Reference

For detailed API documentation, see:
- [API Reference](./api-reference.md)
- [Type Definitions](./types.md)
- [Examples](./examples.md)

## Next Steps

- [Module Development Guide](../modules/README.md)
- [Testing Framework](../testing/README.md)
- [Kiro Integration](../kiro/README.md)