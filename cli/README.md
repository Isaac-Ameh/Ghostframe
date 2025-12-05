# 🎃 GhostFrame CLI

Professional command-line interface for building, testing, and publishing GhostFrame modules.

## Installation

```bash
npm install -g ghostframe-cli
```

## Quick Start

```bash
# Initialize a new module
ghostframe init my-module --template education

# Or use the short alias
gf init my-module --template education

# Navigate to module directory
cd my-module

# Start development server
gf dev

# Run tests
gf test --coverage

# Validate Kiro compliance
gf validate --strict

# Publish to registry
gf publish
```

## Commands

### `gf init [name]`

Initialize a new GhostFrame module from a template.

**Options:**
- `-t, --template <type>` - Module template (education, creative, productivity, research)
- `-n, --name <name>` - Module name
- `--skip-install` - Skip npm install

**Examples:**
```bash
gf init quiz-master --template education
gf init story-weaver --template creative
gf init task-optimizer --template productivity
```

### `gf dev`

Start development server with live reload.

**Options:**
- `-p, --port <port>` - Port number (default: 3000)
- `--watch` - Enable file watching

**Examples:**
```bash
gf dev
gf dev --port 8080
```

### `gf validate`

Run Kiro compliance validation on the module.

**Options:**
- `-s, --strict` - Enable strict validation mode
- `--performance` - Include performance benchmarks
- `--security` - Include security scanning

**Examples:**
```bash
gf validate
gf validate --strict --security
```

### `gf test`

Run module tests using Jest.

**Options:**
- `--watch` - Run tests in watch mode
- `--coverage` - Generate coverage report
- `--verbose` - Verbose output

**Examples:**
```bash
gf test
gf test --coverage
gf test --watch
```

### `gf publish`

Publish module to GhostFrame Registry.

**Options:**
- `--dry-run` - Simulate publish without actually publishing
- `--tag <tag>` - Publish with specific tag (default: latest)

**Examples:**
```bash
gf publish --dry-run
gf publish
gf publish --tag beta
```

### `gf login`

Authenticate with GhostFrame.

**Options:**
- `--api-key <key>` - Use API key for authentication

**Examples:**
```bash
gf login
gf login --api-key YOUR_API_KEY
```

### `gf logout`

Clear authentication credentials.

```bash
gf logout
```

### `gf info`

Show module analytics, validation status, and metadata.

**Options:**
- `--analytics` - Show detailed analytics
- `--validation` - Show validation status

**Examples:**
```bash
gf info
gf info --analytics --validation
```

### `gf build`

Build module for production.

**Options:**
- `--minify` - Minify output
- `--source-maps` - Generate source maps

**Examples:**
```bash
gf build
gf build --minify --source-maps
```

### `gf registry search <query>`

Search modules in the registry.

**Options:**
- `-c, --category <category>` - Filter by category
- `-a, --author <author>` - Filter by author
- `--limit <limit>` - Limit results (default: 10)

**Examples:**
```bash
gf registry search quiz
gf registry search quiz --category education
```

### `gf registry install <moduleId>`

Install module from registry.

**Options:**
- `--save-dev` - Save as dev dependency

**Examples:**
```bash
gf registry install quiz-master
gf registry install story-spirit --save-dev
```

### `gf config`

Manage CLI configuration.

**Subcommands:**
- `set <key> <value>` - Set configuration value
- `get <key>` - Get configuration value
- `list` - List all configuration

**Examples:**
```bash
gf config set apiUrl https://api.ghostframe.dev
gf config get apiUrl
gf config list
```

## Configuration

The CLI stores configuration in `~/.ghostframe/config.json`:

```json
{
  "apiUrl": "http://localhost:3001/api",
  "registryUrl": "http://localhost:3001/api/registry",
  "defaultTemplate": "education",
  "autoValidate": true,
  "colorOutput": true
}
```

## Module Templates

### Education
AI-powered educational content processing with quiz generation, content analysis, and progress tracking.

### Creative
AI-powered creative content generation with story generation, character development, and plot structure.

### Productivity
AI-powered workflow optimization with task automation, document processing, and time management.

### Research
AI-powered data analysis and insights with data analysis, report generation, and visualization.

## Development Workflow

1. **Initialize Module**
   ```bash
   gf init my-module --template education
   cd my-module
   ```

2. **Authenticate**
   ```bash
   gf login
   ```

3. **Develop & Test**
   ```bash
   gf dev
   # In another terminal:
   gf test --coverage
   ```

4. **Validate**
   ```bash
   gf validate --strict --security
   ```

5. **Publish**
   ```bash
   gf publish --dry-run
   gf publish
   ```

## CI/CD Integration

### GitHub Actions

```yaml
name: GhostFrame CI/CD
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install -g ghostframe-cli
      - run: npm install
      - run: gf test --coverage
      - run: gf validate --strict

  publish:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install -g ghostframe-cli
      - run: gf login --api-key ${{ secrets.GF_API_KEY }}
      - run: gf publish
```

## Best Practices

✅ **Always validate before publishing**
```bash
gf validate --strict --security
```

✅ **Use dry-run to test publish**
```bash
gf publish --dry-run
```

✅ **Write comprehensive tests**
```bash
gf test --coverage
# Aim for 80%+ coverage
```

✅ **Keep modules under 100KB**
```bash
gf build --minify
```

✅ **Use semantic versioning**
- Major: Breaking changes (1.0.0 → 2.0.0)
- Minor: New features (1.0.0 → 1.1.0)
- Patch: Bug fixes (1.0.0 → 1.0.1)

⚠️ **Never commit sensitive data**
- Add `.env` to `.gitignore`
- Use environment variables
- Never hardcode API keys

## Troubleshooting

### Command not found

```bash
# Reinstall globally
npm install -g ghostframe-cli

# Verify installation
gf --version
```

### Authentication issues

```bash
# Clear credentials and re-login
gf logout
gf login
```

### Validation failures

```bash
# Run with verbose output
gf validate --strict --verbose

# Check specific issues
gf validate --security
```

### Module not found

```bash
# Ensure you're in a module directory
ls ghostframe.config.json

# Initialize if needed
gf init my-module
```

## Requirements

- Node.js 16.0.0 or higher
- npm or yarn package manager
- Git (for version control)

## Support

- 📧 Email: support@ghostframe.dev
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/ghostframe/issues)
- 📖 Docs: [GhostFrame Documentation](https://docs.ghostframe.dev)

## License

MIT

---

Built with 🎃 GhostFrame - Where dead tech learns new tricks!
