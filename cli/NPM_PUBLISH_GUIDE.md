# 🎃 GhostFrame CLI - NPM Publishing Guide

## 📦 Quick Publish to NPM

### Step 1: Login to NPM
```bash
npm login
```
Enter your npm credentials when prompted.

### Step 2: Build the CLI
```bash
cd cli
npm run build
```

### Step 3: Test Locally (Optional)
```bash
npm link
ghostframe --help
```

### Step 4: Publish to NPM
```bash
npm publish
```

That's it! Your CLI will be live at: `https://www.npmjs.com/package/@ghostframe/cli`

---

## 🎯 Installation for Users

Once published, anyone can install with:
```bash
npm install -g @ghostframe/cli
```

Then use:
```bash
ghostframe --help
ghostframe registry search "quiz"
ghostframe login
```

---

## 🏆 For Kiro Blog Prize Submission

### What to Include in Your Blog Post:

1. **Installation Command:**
   ```bash
   npm install -g @ghostframe/cli
   ```

2. **Quick Demo:**
   ```bash
   # Search for modules
   ghostframe registry search "quiz"
   
   # Login to GhostFrame
   ghostframe login
   
   # Create new module
   ghostframe create my-module
   ```

3. **Key Features:**
   - 🤖 Groq AI integration for fast inference
   - 🎯 Professional CLI with beautiful output
   - 📦 Module marketplace integration
   - 🔐 User authentication
   - 🚀 Real API connections (not mocks!)

4. **Screenshots to Include:**
   - CLI help output
   - Module search results
   - Login flow
   - Module creation

5. **Technical Highlights:**
   - Built with TypeScript
   - Uses Commander.js for CLI
   - Axios for API calls
   - Chalk for colored output
   - Ora for spinners

---

## 📝 Package Details

- **Name:** `@ghostframe/cli`
- **Version:** `1.0.0`
- **Commands:** `ghostframe` or `gf`
- **License:** MIT
- **Node:** >=16.0.0

---

## 🚀 Update & Republish

To publish updates:

1. Update version in `package.json`:
   ```json
   "version": "1.0.1"
   ```

2. Build and publish:
   ```bash
   npm run build
   npm publish
   ```

---

## 🎃 Ready for Kiro Blog!

Your CLI is production-ready and can be published to npm immediately. Once published, you can write your blog post showcasing:

- Real working CLI tool
- Live npm package
- Groq AI integration
- Professional developer experience

Good luck with the blog prize! 🏆
