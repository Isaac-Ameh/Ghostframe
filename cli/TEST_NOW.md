# 🎃 Test the GhostFrame CLI Right Now!

## Copy & Paste These Commands (Windows)

Open PowerShell or Command Prompt and run:

```powershell
# Navigate to CLI directory
cd cli

# Install dependencies
npm install

# Build the CLI
npm run build

# Link it globally
npm link

# Test it works
gf --version
gf --help

# Create a test module
cd ..
mkdir test-cli-demo
cd test-cli-demo
gf init my-test-module --template education --skip-install

# Check what was created
dir my-test-module

# Navigate into module
cd my-test-module

# Test validation (will show warnings - that's expected)
gf validate

# Test config commands
gf config list
gf config set testKey testValue
gf config get testKey

# Go back and run CLI tests
cd ..\..\cli
npm test
```

## What You Should See

### After `gf --version`:
```
1.0.0
```

### After `gf init my-test-module`:
```
🎃 Initializing GhostFrame module...
Creating education module: my-test-module
✅ Module my-test-module created successfully!

🚀 Next steps:
   cd my-test-module
   ghostframe dev - Start development server
   ghostframe validate - Validate Kiro compliance
   ghostframe test - Run tests
```

### After `gf validate`:
```
🎃 Running Kiro compliance validation...
Analyzing module structure...

🔍 Validation Results:

✅ STRUCTURE: 100/100
✅ KIRO: 90/100
⚠️  CONFIGURATION: 85/100
   ⚠️  Missing recommended script: dev
✅ DEPENDENCIES: 100/100

📊 Overall Score: 94/100

⚠️  Module validation completed with warnings
```

### After `npm test`:
```
PASS  src/__tests__/GhostFrameCLI.test.ts
  GhostFrameCLI
    initModule
      ✓ should initialize a new module successfully
      ✓ should fail if directory already exists
    validateModule
      ✓ should validate module successfully
      ✓ should fail validation with errors
    publishModule
      ✓ should publish module successfully
      ✓ should not publish if not authenticated

Test Suites: 2 passed, 2 total
Tests:       15 passed, 15 total
```

## Quick Test Checklist

Run these commands and check off each one:

- [ ] `cd cli` - Navigate to CLI directory
- [ ] `npm install` - Install dependencies (should complete without errors)
- [ ] `npm run build` - Build TypeScript (should create dist/ folder)
- [ ] `npm link` - Link globally (should show success message)
- [ ] `gf --version` - Should show "1.0.0"
- [ ] `gf --help` - Should show command list
- [ ] `gf init test-module` - Should create module directory
- [ ] `cd test-module` - Navigate into module
- [ ] `gf validate` - Should run validation checks
- [ ] `gf config list` - Should show configuration
- [ ] `cd ../cli` - Go back to CLI directory
- [ ] `npm test` - Should pass all tests

## If Something Goes Wrong

### "gf: command not found"
```powershell
cd cli
npm link
# Try again
gf --version
```

### "Cannot find module"
```powershell
cd cli
npm install
npm run build
npm link
```

### "Tests failing"
```powershell
cd cli
npm test -- --clearCache
npm test
```

### "Module already exists"
```powershell
# Remove the test directory
rmdir /s test-cli-demo
# Try again
mkdir test-cli-demo
cd test-cli-demo
gf init my-test-module
```

## Alternative: Use the Test Script

### Windows:
```cmd
cd cli
test-cli.bat
```

### Mac/Linux:
```bash
cd cli
chmod +x test-cli.sh
./test-cli.sh
```

## What Gets Created

When you run `gf init my-test-module`, you get:

```
my-test-module/
├── src/
│   ├── index.ts              # Main module code
│   ├── components/           # UI components
│   ├── services/             # Business logic
│   └── types/                # TypeScript types
├── tests/
│   └── my-test-module.test.ts # Test suite
├── .kiro/
│   ├── specs/
│   │   └── module.md         # Kiro specifications
│   ├── hooks/
│   │   └── index.ts          # Event hooks
│   └── steering/
│       └── behavior.md       # AI behavior rules
├── docs/
│   └── README.md             # Documentation
├── package.json              # Package config
├── tsconfig.json             # TypeScript config
├── jest.config.json          # Jest config
├── ghostframe.config.json    # Module config
├── .gitignore                # Git ignore
└── README.md                 # Module README
```

## Next Steps After Testing

1. **Explore the generated module:**
   ```powershell
   cd test-cli-demo/my-test-module
   type ghostframe.config.json
   type src/index.ts
   type .kiro/specs/module.md
   ```

2. **Try other commands:**
   ```powershell
   gf build
   gf config set apiUrl https://api.ghostframe.dev
   gf info
   ```

3. **Read the documentation:**
   - [QUICKSTART.md](./QUICKSTART.md) - 5-minute guide
   - [USAGE.md](./USAGE.md) - Complete reference
   - [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Detailed testing
   - [README.md](./README.md) - Overview

4. **Test with backend running:**
   ```powershell
   # Terminal 1: Start backend
   cd backend
   npm install
   npm run dev

   # Terminal 2: Test CLI with backend
   cd test-cli-demo/my-test-module
   gf login
   gf validate --strict
   gf publish --dry-run
   ```

## Success Criteria

You've successfully tested the CLI if:

✅ All commands run without errors
✅ Module is created with correct structure
✅ Validation runs and shows results
✅ Configuration commands work
✅ All tests pass (npm test)
✅ Help and version commands work

## Time Estimate

- **Quick test**: 5 minutes
- **Full test**: 15 minutes
- **With backend**: 30 minutes

## Support

Need help?

- Check [TESTING_GUIDE.md](./TESTING_GUIDE.md) for detailed troubleshooting
- Review [USAGE.md](./USAGE.md) for command reference
- See [QUICKSTART.md](./QUICKSTART.md) for quick examples

---

**Ready? Copy the commands above and start testing! 🎃**
