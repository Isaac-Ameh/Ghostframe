# 🎃 GhostFrame CLI - Developer Testing Guide

## Quick Start Testing

### 1. Build the CLI

```bash
# Navigate to CLI directory
cd cli

# Install dependencies
npm install

# Build TypeScript
npm run build

# Run tests
npm test
```

### 2. Test Locally (Without Global Install)

```bash
# From the cli directory, link it locally
npm link

# Now you can use 'gf' or 'ghostframe' commands
gf --version
gf --help
```

### 3. Test in a Separate Directory

```bash
# Create a test directory
mkdir ~/ghostframe-test
cd ~/ghostframe-test

# Test init command
gf init test-module --template education

# Navigate to created module
cd test-module

# Test other commands
gf validate
gf test
gf build
```

## Detailed Testing Steps

### Step 1: Build and Link

```bash
# In the cli directory
cd cli

# Install dependencies
npm install

# Build TypeScript to JavaScript
npm run build

# This creates the dist/ folder with compiled code
ls dist/

# Link globally for local testing
npm link

# Verify installation
which gf
gf --version
```

### Step 2: Test Module Initialization

```bash
# Create a test workspace
mkdir ~/gf-test-workspace
cd ~/gf-test-workspace

# Test education template
gf init quiz-module --template education

# Test creative template
gf init story-module --template creative

# Test productivity template
gf init task-module --template productivity

# Test research template
gf init data-module --template research

# Verify structure
ls -la quiz-module/
```

Expected structure:
```
quiz-module/
├── src/
│   ├── index.ts
│   ├── components/
│   ├── services/
│   └── types/
├── tests/
│   └── quiz-module.test.ts
├── .kiro/
│   ├── specs/
│   ├── hooks/
│   └── steering/
├── package.json
├── tsconfig.json
├── jest.config.json
├── ghostframe.config.json
└── README.md
```

### Step 3: Test Validation

```bash
cd quiz-module

# Basic validation
gf validate

# Strict validation
gf validate --strict

# With performance checks
gf validate --performance

# With security scanning
gf validate --security

# Full validation
gf validate --strict --performance --security
```

Expected output:
```
🎃 Running Kiro compliance validation...

🔍 Validation Results:

✅ STRUCTURE: 100/100
✅ KIRO: 90/100
✅ CONFIGURATION: 95/100
✅ DEPENDENCIES: 100/100
✅ PERFORMANCE: 85/100
✅ SECURITY: 95/100

📊 Overall Score: 94/100

✅ Module validation passed!
```

### Step 4: Test Development Server

```bash
# Start dev server (this will watch for changes)
gf dev

# In another terminal, make changes to src/index.ts
# The server should auto-reload

# Stop with Ctrl+C
```

### Step 5: Test Testing Framework

```bash
# Run tests
gf test

# Run with coverage
gf test --coverage

# Run in watch mode (for development)
gf test --watch

# Verbose output
gf test --verbose
```

Expected output:
```
🎃 Running module tests...

 PASS  tests/quiz-module.test.ts
  QuizModule
    Module Properties
      ✓ should have correct module properties (5ms)
    Content Processing
      ✓ should process valid content successfully (15ms)
      ✓ should reject empty content (3ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total

✅ All tests passed!
```

### Step 6: Test Build

```bash
# Standard build
gf build

# Production build with minification
gf build --minify

# With source maps
gf build --source-maps

# Verify output
ls -la dist/
```

### Step 7: Test Configuration

```bash
# Set config values
gf config set apiUrl https://api.ghostframe.dev
gf config set defaultTemplate creative

# Get config values
gf config get apiUrl

# List all config
gf config list
```

Expected output:
```
🔧 GhostFrame CLI Configuration:

  apiUrl = https://api.ghostframe.dev
  registryUrl = http://localhost:3001/api/registry
  defaultTemplate = creative
  autoValidate = true
  colorOutput = true
```

### Step 8: Test Authentication (Mock)

```bash
# Test login (will fail without backend running)
gf login

# Test with API key
gf login --api-key test-key-123

# Test logout
gf logout
```

### Step 9: Test Registry Commands (Mock)

```bash
# Search for modules
gf registry search quiz

# Search with filters
gf registry search quiz --category education --limit 5

# Install module (mock)
gf registry install quiz-master
```

### Step 10: Test Info Command

```bash
# Show module info
gf info

# With analytics
gf info --analytics

# With validation status
gf info --validation
```

## Running Automated Tests

### Unit Tests

```bash
cd cli

# Run all unit tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run specific test file
npm test -- GhostFrameCLI.test.ts
```

### Integration Tests

```bash
# Run integration tests
npm test -- integration/cliWorkflow.test.ts

# Run with verbose output
npm test -- --verbose integration/
```

## Testing with Backend Running

### 1. Start Backend

```bash
# In a separate terminal, start the backend
cd backend
npm install
npm run dev
```

### 2. Test Full Workflow

```bash
# Create module
gf init full-test-module --template education
cd full-test-module

# Login (requires backend)
gf login
# Enter credentials when prompted

# Validate (will hit backend API)
gf validate --strict

# Test
gf test --coverage

# Build
gf build --minify

# Publish (dry run)
gf publish --dry-run

# Publish (requires authentication)
gf publish
```

## Manual Testing Checklist

### ✅ Installation & Setup
- [ ] `npm install` works without errors
- [ ] `npm run build` compiles successfully
- [ ] `npm link` creates global commands
- [ ] `gf --version` shows correct version
- [ ] `gf --help` displays help text

### ✅ Module Initialization
- [ ] `gf init` prompts for name and template
- [ ] `gf init my-module` creates module
- [ ] All 4 templates work (education, creative, productivity, research)
- [ ] Generated files have correct content
- [ ] Directory structure is correct
- [ ] `--skip-install` flag works

### ✅ Development
- [ ] `gf dev` starts server
- [ ] Server runs on correct port
- [ ] `--port` flag changes port
- [ ] File watching works
- [ ] Ctrl+C stops server

### ✅ Validation
- [ ] `gf validate` runs all checks
- [ ] `--strict` mode works
- [ ] `--performance` flag works
- [ ] `--security` flag works
- [ ] Validation results display correctly
- [ ] Scores are calculated properly

### ✅ Testing
- [ ] `gf test` runs tests
- [ ] `--coverage` generates report
- [ ] `--watch` mode works
- [ ] `--verbose` shows details
- [ ] Test results display correctly

### ✅ Building
- [ ] `gf build` compiles code
- [ ] `--minify` flag works
- [ ] `--source-maps` flag works
- [ ] Output in dist/ folder
- [ ] No compilation errors

### ✅ Publishing
- [ ] `gf publish --dry-run` simulates publish
- [ ] Validation runs before publish
- [ ] Authentication check works
- [ ] `--tag` flag works
- [ ] Success message displays

### ✅ Authentication
- [ ] `gf login` prompts for credentials
- [ ] `--api-key` flag works
- [ ] Credentials are cached
- [ ] `gf logout` clears credentials

### ✅ Registry
- [ ] `gf registry search` works
- [ ] Search filters work
- [ ] `gf registry install` works
- [ ] Results display correctly

### ✅ Configuration
- [ ] `gf config set` saves values
- [ ] `gf config get` retrieves values
- [ ] `gf config list` shows all config
- [ ] Config persists between sessions

### ✅ Info
- [ ] `gf info` displays module data
- [ ] `--analytics` flag works
- [ ] `--validation` flag works
- [ ] Data formats correctly

### ✅ Error Handling
- [ ] Invalid commands show error
- [ ] Missing arguments prompt user
- [ ] Network errors handled gracefully
- [ ] File errors show helpful messages
- [ ] Authentication errors clear

### ✅ User Experience
- [ ] Colors display correctly
- [ ] Spinners animate properly
- [ ] Progress indicators work
- [ ] Success messages are clear
- [ ] Error messages are helpful
- [ ] Help text is comprehensive

## Debugging Tips

### Enable Verbose Logging

```bash
# Set debug environment variable
export DEBUG=ghostframe:*

# Run command
gf validate
```

### Check Generated Files

```bash
# After init, inspect files
cd test-module
cat ghostframe.config.json
cat package.json
cat src/index.ts
cat .kiro/specs/module.md
```

### Test API Connectivity

```bash
# Check if backend is running
curl http://localhost:3001/api/health

# Test validation endpoint
curl -X POST http://localhost:3001/api/modules/validate \
  -H "Content-Type: application/json" \
  -d '{"moduleId": "test"}'
```

### Inspect Config File

```bash
# View CLI config
cat ~/.ghostframe/config.json

# Edit manually if needed
nano ~/.ghostframe/config.json
```

### Clean and Rebuild

```bash
cd cli

# Remove build artifacts
rm -rf dist/
rm -rf node_modules/

# Reinstall and rebuild
npm install
npm run build

# Relink
npm link
```

## Common Issues & Solutions

### Issue: Command not found

```bash
# Solution: Relink the CLI
cd cli
npm link

# Verify
which gf
```

### Issue: TypeScript errors

```bash
# Solution: Rebuild
cd cli
npm run build
```

### Issue: Tests failing

```bash
# Solution: Clear Jest cache
cd cli
npm test -- --clearCache
npm test
```

### Issue: Module already exists

```bash
# Solution: Remove existing module
rm -rf test-module
gf init test-module
```

### Issue: Authentication fails

```bash
# Solution: Clear credentials and retry
gf logout
gf login
```

## Performance Testing

### Test CLI Startup Time

```bash
# Measure command execution time
time gf --version
time gf --help
time gf validate
```

### Test Module Generation Speed

```bash
# Time module creation
time gf init perf-test-module --skip-install
```

### Test Build Performance

```bash
cd test-module

# Time build
time gf build

# Time with minification
time gf build --minify
```

## CI/CD Testing

### Test in GitHub Actions

Create `.github/workflows/test-cli.yml`:

```yaml
name: Test CLI
on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install CLI
        run: |
          cd cli
          npm install
          npm run build
          npm link
      
      - name: Test Commands
        run: |
          gf --version
          gf init test-module --template education --skip-install
          cd test-module
          gf validate
          gf build
      
      - name: Run Tests
        run: |
          cd cli
          npm test
```

## Next Steps

After testing locally:

1. **Fix any issues** found during testing
2. **Update documentation** based on findings
3. **Add more tests** for edge cases
4. **Optimize performance** if needed
5. **Prepare for publishing** to npm

## Support

If you encounter issues:

1. Check the [USAGE.md](./USAGE.md) guide
2. Review [README.md](./README.md)
3. Check existing tests in `src/__tests__/`
4. Open an issue on GitHub

---

**Happy Testing! 🎃**
