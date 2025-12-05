# 🛠️ GhostFrame CLI Reference

The GhostFrame CLI is your primary tool for developing, testing, and deploying Ghost modules. This comprehensive reference covers all commands, options, and workflows.

## Installation

```bash
# Install globally
npm install -g @ghostframe/cli

# Or via yarn
yarn global add @ghostframe/cli

# Verify installation
ghostframe --version
```

## Global Options

These options are available for all commands:

```bash
--help, -h          Show help information
--version, -v       Show version number
--config <path>     Use custom config file
--debug             Enable debug output
--quiet, -q         Suppress non-essential output
--no-color          Disable colored output
```

## Commands Overview

| Command | Description |
|---------|-------------|
| [`init`](#init) | Initialize a new GhostFrame project |
| [`create`](#create) | Create a new Ghost module |
| [`validate`](#validate) | Validate module configuration and code |
| [`test`](#test) | Run module tests |
| [`build`](#build) | Build module for deployment |
| [`deploy`](#deploy) | Deploy module to GhostFrame |
| [`status`](#status) | Check module deployment status |
| [`logs`](#logs) | View module logs |
| [`config`](#config) | Manage CLI configuration |
| [`login`](#login) | Authenticate with GhostFrame |
| [`templates`](#templates) | Manage module templates |
| [`generate`](#generate) | Generate code and configurations |
| [`dev`](#dev) | Start development server |

---

## `init`

Initialize a new GhostFrame project with the recommended structure.

### Usage

```bash
ghostframe init [directory] [options]
```

### Options

```bash
-t, --template <template>    Template to use (basic, educational, business, custom)
-n, --name <name>           Project name
-d, --directory <dir>       Target directory (defaults to project name)
--skip-install              Skip npm install
--skip-git                  Skip git initialization
```

### Examples

```bash
# Interactive initialization
ghostframe init

# Quick setup with template
ghostframe init my-project --template educational --name "My AI Project"

# Initialize in current directory
ghostframe init . --name "Current Project"
```

### Generated Structure

```
my-project/
├── .kiro/                  # Kiro specifications
│   ├── specs/
│   ├── hooks/
│   └── steering/
├── modules/                # Ghost modules
├── docs/                   # Documentation
├── scripts/                # Development scripts
├── .gitignore
├── package.json
├── README.md
└── ghostframe.config.json
```

---

## `create`

Create a new Ghost module with scaffolding, tests, and configuration.

### Usage

```bash
ghostframe create [options]
```

### Options

```bash
-t, --template <template>    Module template (basic, ai-text, ai-vision, utility)
-n, --name <name>           Module name
-c, --category <category>   Module category
-i, --interactive           Interactive mode with prompts
--skip-tests                Don't generate test files
--skip-docker               Don't generate Docker configuration
--skip-kiro                 Don't generate Kiro specifications
```

### Interactive Mode

```bash
ghostframe create --interactive
```

Prompts you for:
- Module name and description
- Category (education, productivity, entertainment, utility, research, communication)
- Features (AI processing, file upload, real-time, batch, caching, auth, analytics)
- AI models (GPT-3.5, GPT-4, Claude 3 Sonnet, Claude 3 Haiku)
- Additional options (tests, Docker, Kiro specs)

### Examples

```bash
# Interactive creation (recommended)
ghostframe create --interactive

# Quick creation with defaults
ghostframe create --name text-processor --category productivity

# Create from template
ghostframe create --template ai-vision --name image-analyzer

# Minimal module without extras
ghostframe create --name simple-module --skip-tests --skip-docker
```

### Generated Module Structure

```
modules/my-module/
├── src/
│   ├── index.ts           # Main module implementation
│   ├── types.ts           # Type definitions
│   └── utils.ts           # Utility functions
├── tests/
│   ├── index.test.ts      # Unit tests
│   └── integration.test.ts # Integration tests
├── .kiro/
│   ├── requirements.md    # Kiro requirements
│   ├── design.md          # Kiro design
│   └── tasks.md           # Kiro tasks
├── package.json
├── ghostframe.config.json # Module configuration
├── Dockerfile
└── README.md
```

---

## `validate`

Validate module configuration, code quality, and GhostFrame compliance.

### Usage

```bash
ghostframe validate [options]
```

### Options

```bash
-p, --path <path>           Module path (default: current directory)
-f, --fix                   Auto-fix issues where possible
--strict                    Use strict validation rules
--format <format>           Output format (text, json, junit)
--output <file>             Write results to file
```

### Validation Checks

- **Structure**: Required files and directories
- **Configuration**: Schema validation and completeness
- **Code Quality**: TypeScript compilation and linting
- **Kiro Compliance**: Specifications format and completeness
- **Security**: Basic security scanning
- **Performance**: Resource usage estimates

### Examples

```bash
# Validate current module
ghostframe validate

# Validate specific module with auto-fix
ghostframe validate --path ./modules/text-processor --fix

# Strict validation for production
ghostframe validate --strict

# Export results to file
ghostframe validate --format json --output validation-report.json
```

### Sample Output

```
🎃 Validating module: text-processor

📋 Validation Results:
Score: 92/100
Status: ✅ Valid

✅ Structure: All required files present
✅ Configuration: Valid schema and complete
⚠️  Code Quality: 2 linting warnings
✅ Kiro Compliance: Specifications complete
✅ Security: No vulnerabilities found
⚠️  Performance: Memory usage could be optimized

⚠️  Warnings:
  • Unused import in src/utils.ts:5
  • Consider adding input size limits for better performance

💡 Suggestions:
  • Add performance benchmarks
  • Consider implementing caching for repeated requests
  • Add more comprehensive error handling
```

---

## `test`

Run comprehensive tests for your Ghost modules.

### Usage

```bash
ghostframe test [options]
```

### Options

```bash
-p, --path <path>           Module path (default: current directory)
-w, --watch                 Watch mode for continuous testing
-c, --coverage              Generate coverage report
--unit                      Run unit tests only
--integration               Run integration tests only
--performance               Run performance tests
--security                  Run security tests
--timeout <ms>              Test timeout in milliseconds
--reporter <reporter>       Test reporter (spec, json, junit, tap)
--output <file>             Write results to file
```

### Test Types

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test module integration with GhostFrame
- **Performance Tests**: Benchmark execution time and resource usage
- **Security Tests**: Scan for vulnerabilities and security issues

### Examples

```bash
# Run all tests
ghostframe test

# Run with coverage
ghostframe test --coverage

# Watch mode for development
ghostframe test --watch

# Run specific test types
ghostframe test --unit --integration

# Performance testing
ghostframe test --performance --timeout 30000

# Export results
ghostframe test --reporter junit --output test-results.xml
```

### Sample Output

```
🧪 Running tests for text-processor...

Unit Tests:
  ✅ Module initialization (45ms)
  ✅ Input validation (23ms)
  ✅ Text processing (156ms)
  ✅ Output formatting (12ms)
  ✅ Error handling (34ms)

Integration Tests:
  ✅ GhostFrame integration (234ms)
  ✅ AI model integration (1.2s)
  ✅ Kiro hooks execution (89ms)

Performance Tests:
  ✅ Small text processing (< 100ms)
  ✅ Large text processing (< 2s)
  ✅ Memory usage (< 50MB)

Test Results:
Passed: 11
Failed: 0
Skipped: 0
Duration: 2.1s
Coverage: 94.2%

✅ All tests passed!
```

---

## `build`

Build your module for deployment with optimization and packaging.

### Usage

```bash
ghostframe build [options]
```

### Options

```bash
-p, --path <path>           Module path (default: current directory)
-e, --environment <env>     Target environment (development, staging, production)
--optimize                  Enable optimizations (minification, tree-shaking)
--docker                    Build Docker image
--platform <platform>      Target platform (linux/amd64, linux/arm64)
--tag <tag>                 Docker image tag
--push                      Push Docker image to registry
```

### Build Process

1. **TypeScript Compilation**: Compile TypeScript to JavaScript
2. **Dependency Resolution**: Bundle required dependencies
3. **Optimization**: Minify and optimize code (if enabled)
4. **Asset Processing**: Process static assets and configurations
5. **Docker Image**: Build container image (if enabled)
6. **Validation**: Final validation of build artifacts

### Examples

```bash
# Basic build
ghostframe build

# Production build with optimizations
ghostframe build --environment production --optimize

# Build Docker image
ghostframe build --docker --tag my-module:1.0.0

# Build and push to registry
ghostframe build --docker --push --tag my-module:latest
```

### Sample Output

```
🎃 Building module: text-processor

📦 Build Process:
  ✅ TypeScript compilation (1.2s)
  ✅ Dependency resolution (0.8s)
  ✅ Code optimization (0.5s)
  ✅ Asset processing (0.3s)
  ✅ Docker image build (15.2s)
  ✅ Final validation (0.4s)

📊 Build Results:
  Bundle size: 2.3MB (compressed: 0.8MB)
  Dependencies: 12 packages
  Docker image: text-processor:1.0.0 (45MB)
  Build time: 18.4s

✅ Build completed successfully!
```

---

## `deploy`

Deploy your module to GhostFrame environments.

### Usage

```bash
ghostframe deploy [options]
```

### Options

```bash
-p, --path <path>           Module path (default: current directory)
-e, --environment <env>     Target environment (development, staging, production)
--version <version>         Module version (defaults to package.json version)
--strategy <strategy>       Deployment strategy (blue_green, rolling, canary)
--force                     Force deployment (skip validation)
--rollback                  Enable automatic rollback on failure
--notify <channels>         Notification channels (email, slack, webhook)
```

### Deployment Process

1. **Pre-deployment Validation**: Ensure module is ready for deployment
2. **Build**: Build module for target environment
3. **Upload**: Upload module to GhostFrame registry
4. **Deploy**: Deploy using specified strategy
5. **Health Checks**: Verify deployment health
6. **Notifications**: Send deployment notifications

### Examples

```bash
# Deploy to development
ghostframe deploy --environment development

# Production deployment with rollback
ghostframe deploy --environment production --rollback --notify slack

# Canary deployment
ghostframe deploy --environment production --strategy canary

# Force deployment (skip validation)
ghostframe deploy --environment staging --force
```

### Sample Output

```
🚀 Deploying text-processor to production...

📋 Pre-deployment Checks:
  ✅ Module validation passed (score: 95/100)
  ✅ Security scan passed (no vulnerabilities)
  ✅ Performance tests passed
  ✅ Dependencies verified

📦 Deployment Process:
  ✅ Build completed (18.4s)
  ✅ Upload to registry (3.2s)
  ✅ Blue-green deployment started (45.6s)
  ✅ Health checks passed (12.3s)
  ✅ Traffic switched to new version (2.1s)

✅ Deployment successful!
  Deployment ID: deploy_abc123def456
  Environment: production
  Version: 1.2.0
  URL: https://api.ghostframe.dev/modules/text-processor
  Instances: 3
  Health: Healthy
```

---

## `status`

Check the deployment status and health of your modules.

### Usage

```bash
ghostframe status [options]
```

### Options

```bash
-m, --module <module>       Module ID or name
-e, --environment <env>     Environment filter
--format <format>           Output format (text, json, table)
--watch                     Watch mode for real-time updates
```

### Examples

```bash
# Check status of specific module
ghostframe status --module text-processor

# Check all modules in production
ghostframe status --environment production

# Watch mode for real-time updates
ghostframe status --module text-processor --watch

# JSON output for scripting
ghostframe status --format json
```

### Sample Output

```
📊 Module Status: text-processor

Environment: production
Status: ✅ Running
Version: 1.2.0
Instances: 3/3 healthy
Last Deployed: 2024-01-15 14:30:22 UTC
Uptime: 2d 14h 23m

📈 Metrics (Last 24h):
  Requests: 15,247
  Errors: 12 (0.08%)
  Avg Response Time: 245ms
  P95 Response Time: 890ms
  CPU Usage: 23%
  Memory Usage: 156MB

🔗 URLs:
  API: https://api.ghostframe.dev/modules/text-processor
  Dashboard: https://app.ghostframe.dev/modules/text-processor
  Logs: https://app.ghostframe.dev/modules/text-processor/logs
```

---

## `logs`

View and stream logs from your deployed modules.

### Usage

```bash
ghostframe logs [options]
```

### Options

```bash
-m, --module <module>       Module ID or name (required)
-e, --environment <env>     Environment (default: production)
-f, --follow                Follow logs in real-time
-n, --lines <lines>         Number of lines to show (default: 100)
--since <time>              Show logs since time (e.g., "1h", "30m", "2024-01-15")
--level <level>             Filter by log level (debug, info, warn, error)
--format <format>           Output format (text, json)
```

### Examples

```bash
# View recent logs
ghostframe logs --module text-processor

# Follow logs in real-time
ghostframe logs --module text-processor --follow

# Show last 500 lines
ghostframe logs --module text-processor --lines 500

# Filter by error level
ghostframe logs --module text-processor --level error

# Show logs from last hour
ghostframe logs --module text-processor --since 1h
```

### Sample Output

```
📋 Logs: text-processor (production)

2024-01-15 16:45:23 INFO  Module started successfully
2024-01-15 16:45:24 INFO  Health check passed
2024-01-15 16:45:30 INFO  Processing request: req_abc123
2024-01-15 16:45:31 DEBUG AI model response received (245ms)
2024-01-15 16:45:31 INFO  Request completed: req_abc123 (1.2s)
2024-01-15 16:45:35 INFO  Processing request: req_def456
2024-01-15 16:45:36 WARN  Input text length exceeds recommended limit
2024-01-15 16:45:38 INFO  Request completed: req_def456 (2.8s)
2024-01-15 16:45:42 ERROR Failed to process request: req_ghi789
2024-01-15 16:45:42 ERROR   Cause: AI model timeout after 30s

Following logs... (Press Ctrl+C to exit)
```

---

## `config`

Manage CLI configuration settings.

### Usage

```bash
ghostframe config [options]
```

### Options

```bash
--set <key=value>           Set configuration value
--get <key>                 Get configuration value
--list                      List all configuration
--unset <key>               Remove configuration value
--reset                     Reset to default configuration
```

### Configuration Keys

- `apiKey`: Your GhostFrame API key
- `apiEndpoint`: API endpoint URL
- `defaultEnvironment`: Default deployment environment
- `editor`: Preferred editor for file editing
- `registry`: Docker registry for images
- `namespace`: Default Kubernetes namespace

### Examples

```bash
# Set API key
ghostframe config --set apiKey=gf_abc123def456

# Set default environment
ghostframe config --set defaultEnvironment=staging

# Get current API endpoint
ghostframe config --get apiEndpoint

# List all configuration
ghostframe config --list

# Reset to defaults
ghostframe config --reset
```

---

## `login`

Authenticate with GhostFrame using your API key or interactive login.

### Usage

```bash
ghostframe login [options]
```

### Options

```bash
--api-key <key>             API key for authentication
--endpoint <url>            Custom API endpoint
--browser                   Use browser-based authentication
```

### Examples

```bash
# Interactive login
ghostframe login

# Login with API key
ghostframe login --api-key gf_abc123def456

# Login to custom endpoint
ghostframe login --endpoint https://custom.ghostframe.dev
```

---

## `templates`

Manage module templates for scaffolding new modules.

### Usage

```bash
ghostframe templates [options]
```

### Options

```bash
--list                      List available templates
--update                    Update template repository
--create <name>             Create new template
--install <url>             Install template from URL
--remove <name>             Remove installed template
```

### Examples

```bash
# List available templates
ghostframe templates --list

# Update templates
ghostframe templates --update

# Create custom template
ghostframe templates --create my-custom-template
```

---

## `generate`

Generate code, configurations, and documentation.

### Usage

```bash
ghostframe generate [type] [options]
```

### Types

- `kiro-specs`: Generate Kiro specifications
- `tests`: Generate test files
- `docs`: Generate documentation
- `ci`: Generate CI/CD configuration
- `docker`: Generate Docker configuration

### Options

```bash
-p, --path <path>           Target path
--force                     Overwrite existing files
--template <template>       Use specific template
```

### Examples

```bash
# Generate Kiro specifications
ghostframe generate kiro-specs

# Generate test files
ghostframe generate tests --force

# Generate documentation
ghostframe generate docs

# Generate CI/CD configuration
ghostframe generate ci
```

---

## `dev`

Start a local development server for testing modules.

### Usage

```bash
ghostframe dev [options]
```

### Options

```bash
-p, --port <port>           Server port (default: 3000)
--hot-reload                Enable hot reload
--debug                     Enable debug mode
--mock-ai                   Use mock AI responses
```

### Examples

```bash
# Start development server
ghostframe dev

# Start with hot reload
ghostframe dev --hot-reload --debug

# Start on custom port
ghostframe dev --port 8080
```

---

## Configuration File

The CLI uses a configuration file located at `~/.ghostframe/config.json`:

```json
{
  "apiKey": "gf_your_api_key_here",
  "apiEndpoint": "https://api.ghostframe.dev",
  "defaultEnvironment": "development",
  "editor": "code",
  "registry": "ghcr.io/ghostframe",
  "namespace": "default"
}
```

## Environment Variables

You can also configure the CLI using environment variables:

```bash
export GHOSTFRAME_API_KEY="gf_your_api_key_here"
export GHOSTFRAME_API_ENDPOINT="https://api.ghostframe.dev"
export GHOSTFRAME_ENVIRONMENT="development"
```

## Troubleshooting

### Common Issues

**Authentication Failed**
```bash
# Check your API key
ghostframe config --get apiKey

# Re-authenticate
ghostframe login
```

**Module Not Found**
```bash
# Ensure you're in the correct directory
pwd

# Check module configuration
ghostframe validate
```

**Deployment Failed**
```bash
# Check module status
ghostframe status --module your-module

# View deployment logs
ghostframe logs --module your-module --since 1h
```

### Debug Mode

Enable debug mode for detailed output:

```bash
ghostframe --debug <command>
```

### Getting Help

```bash
# General help
ghostframe --help

# Command-specific help
ghostframe <command> --help

# Examples
ghostframe deploy --help
```

---

## Next Steps

- **[SDK Documentation](../sdk/README.md)** - Learn about the TypeScript SDK
- **[Module Development](../modules/README.md)** - Deep dive into module development
- **[Deployment Guide](../deployment/README.md)** - Advanced deployment strategies
- **[Troubleshooting](../troubleshooting/README.md)** - Common issues and solutions