# 🎃 GhostFrame CLI - Complete Usage Guide

## Table of Contents

1. [Installation](#installation)
2. [Getting Started](#getting-started)
3. [Command Reference](#command-reference)
4. [Workflows](#workflows)
5. [Configuration](#configuration)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

## Installation

### Global Installation (Recommended)

```bash
npm install -g ghostframe-cli
```

### Local Installation

```bash
npm install --save-dev ghostframe-cli
```

Then use with npx:
```bash
npx ghostframe <command>
```

### Verify Installation

```bash
ghostframe --version
# or
gf --version
```

## Getting Started

### Create Your First Module

```bash
# Initialize a new education module
gf init quiz-master --template education

# Navigate to the module
cd quiz-master

# Install dependencies
npm install

# Start development
gf dev
```

### Authenticate with GhostFrame

```bash
# Interactive login
gf login

# Or use API key
gf login --api-key YOUR_API_KEY
```

## Command Reference

### Module Initialization

#### `gf init [name]`

Creates a new GhostFrame module with complete project structure.

**Arguments:**
- `name` - Module name (optional, will prompt if not provided)

**Options:**
- `-t, --template <type>` - Template type: education, creative, productivity, research
- `-n, --name <name>` - Module name
- `--skip-install` - Skip automatic npm install

**Generated Structure:**
```
my-module/
├── src/
│   ├── index.ts              # Main module entry
│   ├── components/           # UI components
│   ├── services/             # Business logic
│   └── types/                # TypeScript types
├── tests/
│   └── index.test.ts         # Test suite
├── .kiro/
│   ├── specs/                # Kiro specifications
│   ├── hooks/                # Event hooks
│   └── steering/             # AI behavior rules
├── docs/
│   └── README.md             # Documentation
├── package.json
├── tsconfig.json
├── jest.config.json
├── ghostframe.config.json    # Module configuration
└── README.md
```

**Examples:**
```bash
# Interactive mode
gf init

# Quick start with defaults
gf init my-module

# Specify template
gf init quiz-app --template education

# Skip dependency installation
gf init my-module --skip-install
```

### Development

#### `gf dev`

Starts a local development server with hot reload.

**Options:**
- `-p, --port <port>` - Server port (default: 3000)
- `--watch` - Enable file watching (default: true)

**Features:**
- Hot module replacement
- TypeScript compilation
- Live error reporting
- Auto-restart on file changes

**Examples:**
```bash
# Start on default port
gf dev

# Custom port
gf dev --port 8080

# Disable watch mode
gf dev --no-watch
```

### Testing

#### `gf test`

Runs the module test suite using Jest.

**Options:**
- `--watch` - Run in watch mode
- `--coverage` - Generate coverage report
- `--verbose` - Detailed output
- `--updateSnapshot` - Update snapshots

**Coverage Thresholds:**
- Lines: 70%
- Functions: 70%
- Branches: 70%
- Statements: 70%

**Examples:**
```bash
# Run all tests
gf test

# Watch mode for development
gf test --watch

# Generate coverage report
gf test --coverage

# Verbose output
gf test --verbose

# Update snapshots
gf test --updateSnapshot
```

### Validation

#### `gf validate`

Runs comprehensive Kiro compliance validation.

**Options:**
- `-s, --strict` - Strict validation mode
- `--performance` - Include performance benchmarks
- `--security` - Include security scanning

**Validation Categories:**
1. **Structure** - File and directory organization
2. **Kiro Compliance** - Kiro integration requirements
3. **Configuration** - package.json and config files
4. **Dependencies** - Package security and versions
5. **Performance** - Build size and optimization
6. **Security** - Vulnerability scanning

**Scoring:**
- 90-100: Excellent
- 80-89: Good
- 70-79: Acceptable
- Below 70: Needs improvement

**Examples:**
```bash
# Standard validation
gf validate

# Strict mode (fails on warnings)
gf validate --strict

# Full validation with all checks
gf validate --strict --performance --security
```

### Building

#### `gf build`

Builds the module for production.

**Options:**
- `--minify` - Minify output
- `--source-maps` - Generate source maps

**Build Process:**
1. TypeScript compilation
2. Code optimization
3. Asset bundling
4. Type declaration generation

**Output:**
```
dist/
├── index.js              # Compiled JavaScript
├── index.d.ts            # Type declarations
├── index.js.map          # Source map (if enabled)
└── ...
```

**Examples:**
```bash
# Standard build
gf build

# Production build with minification
gf build --minify

# Development build with source maps
gf build --source-maps
```

### Publishing

#### `gf publish`

Publishes the module to GhostFrame Registry.

**Options:**
- `--dry-run` - Test publish without uploading
- `--tag <tag>` - Version tag (default: latest)

**Pre-publish Checks:**
1. Authentication verification
2. Module validation
3. Test execution
4. Version verification

**Examples:**
```bash
# Dry run (recommended first)
gf publish --dry-run

# Publish to registry
gf publish

# Publish with beta tag
gf publish --tag beta

# Publish with specific tag
gf publish --tag v2.0.0-alpha
```

### Module Information

#### `gf info`

Displays module analytics and status.

**Options:**
- `--analytics` - Show detailed analytics
- `--validation` - Show validation status

**Information Displayed:**
- Module metadata
- Version information
- Download statistics
- Active users
- Execution count
- Validation status
- Rating

**Examples:**
```bash
# Basic info
gf info

# With analytics
gf info --analytics

# With validation status
gf info --validation

# Full details
gf info --analytics --validation
```

### Registry Operations

#### `gf registry search <query>`

Searches for modules in the registry.

**Options:**
- `-c, --category <category>` - Filter by category
- `-a, --author <author>` - Filter by author
- `--limit <limit>` - Result limit (default: 10)

**Examples:**
```bash
# Search for quiz modules
gf registry search quiz

# Filter by category
gf registry search quiz --category education

# Filter by author
gf registry search --author john-doe

# Limit results
gf registry search quiz --limit 5
```

#### `gf registry install <moduleId>`

Installs a module from the registry.

**Options:**
- `--save-dev` - Save as dev dependency

**Examples:**
```bash
# Install module
gf registry install quiz-master

# Install as dev dependency
gf registry install test-utils --save-dev
```

### Configuration Management

#### `gf config set <key> <value>`

Sets a configuration value.

**Examples:**
```bash
gf config set apiUrl https://api.ghostframe.dev
gf config set defaultTemplate creative
gf config set autoValidate true
```

#### `gf config get <key>`

Gets a configuration value.

**Examples:**
```bash
gf config get apiUrl
gf config get defaultTemplate
```

#### `gf config list`

Lists all configuration values.

**Example:**
```bash
gf config list
```

### Authentication

#### `gf login`

Authenticates with GhostFrame.

**Options:**
- `--api-key <key>` - Use API key

**Examples:**
```bash
# Interactive login
gf login

# API key login
gf login --api-key YOUR_API_KEY
```

#### `gf logout`

Clears authentication credentials.

**Example:**
```bash
gf logout
```

## Workflows

### Complete Development Workflow

```bash
# 1. Create module
gf init my-awesome-module --template education
cd my-awesome-module

# 2. Authenticate
gf login

# 3. Develop
gf dev
# Make your changes...

# 4. Test
gf test --coverage

# 5. Validate
gf validate --strict --security

# 6. Build
gf build --minify

# 7. Publish (dry run first)
gf publish --dry-run
gf publish
```

### Quick Iteration Workflow

```bash
# Terminal 1: Development server
gf dev

# Terminal 2: Test watcher
gf test --watch

# Make changes, tests run automatically
# When ready:
gf validate && gf publish
```

### CI/CD Workflow

```bash
# Install CLI
npm install -g ghostframe-cli

# Run tests
gf test --coverage

# Validate
gf validate --strict

# Build
gf build --minify

# Publish (if on main branch)
gf login --api-key $API_KEY
gf publish
```

## Configuration

### CLI Configuration File

Location: `~/.ghostframe/config.json`

```json
{
  "apiUrl": "https://api.ghostframe.dev",
  "registryUrl": "https://registry.ghostframe.dev",
  "defaultTemplate": "education",
  "autoValidate": true,
  "colorOutput": true,
  "authToken": "***",
  "user": {
    "id": "user-id",
    "username": "username"
  }
}
```

### Module Configuration

Location: `ghostframe.config.json`

```json
{
  "id": "my-module",
  "name": "My Module",
  "version": "1.0.0",
  "description": "Module description",
  "category": "education",
  "kiroCompatibility": "1.0.0",
  "config": {
    "inputSchema": { ... },
    "outputSchema": { ... },
    "supportedContentTypes": ["text/plain"],
    "processingModes": ["realtime", "batch"]
  }
}
```

## Best Practices

### Module Development

✅ **Use TypeScript**
- Type safety
- Better IDE support
- Easier refactoring

✅ **Write Tests**
- Aim for 80%+ coverage
- Test edge cases
- Use meaningful test names

✅ **Validate Regularly**
```bash
gf validate --strict
```

✅ **Keep Modules Small**
- Under 100KB recommended
- Modular design
- Single responsibility

✅ **Document Everything**
- Clear README
- API documentation
- Usage examples

### Publishing

✅ **Always Dry Run First**
```bash
gf publish --dry-run
```

✅ **Use Semantic Versioning**
- Major: Breaking changes
- Minor: New features
- Patch: Bug fixes

✅ **Tag Appropriately**
- `latest` for stable releases
- `beta` for testing
- `alpha` for early access

### Security

⚠️ **Never Commit Secrets**
- Use environment variables
- Add `.env` to `.gitignore`
- Use API keys for CI/CD

⚠️ **Validate Dependencies**
```bash
gf validate --security
```

⚠️ **Keep Dependencies Updated**
```bash
npm audit fix
```

## Troubleshooting

### Command Not Found

**Problem:** `gf: command not found`

**Solution:**
```bash
# Reinstall globally
npm install -g ghostframe-cli

# Check npm global path
npm config get prefix

# Add to PATH if needed
export PATH=$PATH:$(npm config get prefix)/bin
```

### Authentication Errors

**Problem:** `401 Unauthorized`

**Solution:**
```bash
# Clear and re-authenticate
gf logout
gf login

# Or use API key
gf login --api-key YOUR_API_KEY
```

### Validation Failures

**Problem:** Module fails validation

**Solution:**
```bash
# Run with verbose output
gf validate --strict --verbose

# Check specific issues
gf validate --security

# Fix issues and re-validate
gf validate
```

### Build Errors

**Problem:** TypeScript compilation errors

**Solution:**
```bash
# Check TypeScript configuration
cat tsconfig.json

# Install missing types
npm install --save-dev @types/node

# Clean and rebuild
rm -rf dist
gf build
```

### Test Failures

**Problem:** Tests failing

**Solution:**
```bash
# Run with verbose output
gf test --verbose

# Update snapshots if needed
gf test --updateSnapshot

# Check coverage
gf test --coverage
```

### Module Not Found

**Problem:** `Not in a GhostFrame module directory`

**Solution:**
```bash
# Check for config file
ls ghostframe.config.json

# Initialize if needed
gf init my-module

# Or navigate to module directory
cd path/to/module
```

## Support

Need help? We're here for you!

- 📧 Email: support@ghostframe.dev
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/ghostframe/issues)
- 📖 Docs: [GhostFrame Documentation](https://docs.ghostframe.dev)
- 💬 Discord: [Join our community](https://discord.gg/ghostframe)

---

Built with 🎃 GhostFrame - Where dead tech learns new tricks!
