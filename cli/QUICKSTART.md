# 🎃 GhostFrame CLI - Quick Start

## Test the CLI in 5 Minutes

### For Windows Users:

```cmd
cd cli
test-cli.bat
```

### For Mac/Linux Users:

```bash
cd cli
chmod +x test-cli.sh
./test-cli.sh
```

### Manual Testing (Step by Step):

```bash
# 1. Navigate to CLI directory
cd cli

# 2. Install dependencies
npm install

# 3. Build TypeScript
npm run build

# 4. Link globally for testing
npm link

# 5. Verify it works
gf --version
gf --help

# 6. Create a test module
cd ..
mkdir test-workspace
cd test-workspace
gf init my-first-module --template education

# 7. Test the module
cd my-first-module
gf validate
gf build

# 8. Run CLI tests
cd ../../cli
npm test
```

## Quick Command Reference

```bash
# Module Management
gf init <name>              # Create new module
gf dev                      # Start dev server
gf build                    # Build for production
gf validate                 # Validate Kiro compliance
gf test                     # Run tests
gf publish                  # Publish to registry

# Authentication
gf login                    # Login to GhostFrame
gf logout                   # Logout

# Registry
gf registry search <query>  # Search modules
gf registry install <id>    # Install module

# Configuration
gf config set <key> <val>   # Set config
gf config get <key>         # Get config
gf config list              # List all config

# Information
gf info                     # Show module info
gf --version                # Show CLI version
gf --help                   # Show help
```

## What to Test

✅ **Basic Commands**
- `gf --version` - Shows version
- `gf --help` - Shows help
- `gf init test-module` - Creates module

✅ **Module Workflow**
- `gf validate` - Validates module
- `gf test` - Runs tests
- `gf build` - Builds module

✅ **Configuration**
- `gf config list` - Shows config
- `gf config set apiUrl https://test.com` - Sets value
- `gf config get apiUrl` - Gets value

## Expected Output Examples

### `gf --version`
```
1.0.0
```

### `gf init my-module`
```
🎃 Initializing GhostFrame module...
✅ Module my-module created successfully!

🚀 Next steps:
   cd my-module
   ghostframe dev - Start development server
   ghostframe validate - Validate Kiro compliance
   ghostframe test - Run tests
```

### `gf validate`
```
🎃 Running Kiro compliance validation...

🔍 Validation Results:

✅ STRUCTURE: 100/100
✅ KIRO: 90/100
✅ CONFIGURATION: 95/100
✅ DEPENDENCIES: 100/100

📊 Overall Score: 96/100

✅ Module validation passed!
```

## Troubleshooting

**Command not found?**
```bash
cd cli
npm link
```

**Build errors?**
```bash
cd cli
rm -rf dist node_modules
npm install
npm run build
```

**Tests failing?**
```bash
cd cli
npm test -- --clearCache
npm test
```

## Next Steps

After testing:
1. Read [USAGE.md](./USAGE.md) for complete guide
2. Check [TESTING_GUIDE.md](./TESTING_GUIDE.md) for detailed testing
3. Review [README.md](./README.md) for documentation

---

**Ready to test? Run the commands above! 🎃**
