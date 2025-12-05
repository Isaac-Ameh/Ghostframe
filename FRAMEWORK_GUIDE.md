# 🎃 GhostFrame Framework Guide

**The Complete Guide to Building AI Applications with GhostFrame**

---

## 📦 What You Get

When you download GhostFrame, you get a **complete, production-ready AI development framework**:

```
ghostframe/
├── backend/              # Express + TypeScript API Server
├── frontend/             # Next.js 14 + React Frontend
├── modules/              # Example AI Modules
├── sdk/                  # GhostFrame TypeScript SDK
├── .kiro/                # Kiro Integration (Specs, Hooks, Steering)
└── docs/                 # Comprehensive Documentation
```

---

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Clone or download GhostFrame
git clone https://github.com/your-org/ghostframe.git
cd ghostframe

# 2. Install dependencies
npm run install:all

# 3. Configure environment
cp backend/.env.example backend/.env
# Add your GROQ_API_KEY (free at https://console.groq.com)

# 4. Start development
npm run dev

# ✅ Done! Visit http://localhost:3000
```

---

## 🏗️ Architecture Overview

### Backend (`/backend`)

**Production-Ready Express API with:**

- ✅ **AI Router** - Multi-provider AI integration (Groq, OpenAI, Anthropic, Gemini)
- ✅ **Content Processing** - PDF, DOCX, TXT extraction and processing
- ✅ **File Upload** - Secure file handling with Multer
- ✅ **Rate Limiting** - Protect your API from abuse
- ✅ **Security** - Helmet.js security headers, CORS configuration
- ✅ **Logging** - Winston-based structured logging
- ✅ **Error Handling** - Comprehensive error management
- ✅ **Environment Config** - Centralized configuration management

**Key Services:**

```typescript
// AI Router - Intelligent multi-provider routing
backend/src/services/AIRouter.ts

// AI Provider Services
backend/src/services/GroqService.ts
backend/src/services/OpenAIService.ts
backend/src/services/AnthropicService.ts

// Content Processing
backend/src/controllers/contentProcessor.ts

// Kiro Integration
backend/src/services/SteeringEngine.ts
backend/src/services/HookManager.ts
backend/src/services/KiroSpecGenerator.ts
```

### Frontend (`/frontend`)

**Next.js 14 Starter with:**

- ✅ **App Router** - Modern Next.js 14 architecture
- ✅ **TypeScript** - Full type safety
- ✅ **Tailwind CSS** - Utility-first styling
- ✅ **Framer Motion** - Smooth animations
- ✅ **Reusable Components** - Pre-built UI components
- ✅ **Responsive Design** - Mobile-first approach

**Key Components:**

```typescript
// Layout Components
frontend/components/Layout/AppLayout.tsx
frontend/components/Navbar.tsx

// Demo Pages
frontend/app/story-spirit/page.tsx
frontend/app/quiz-ghost/page.tsx

// Reusable Components
frontend/components/FileUploader.tsx
frontend/components/ResultsViewer.tsx
```

### SDK (`/sdk`)

**Comprehensive TypeScript SDK for:**

- ✅ **Module Creation** - Build AI modules programmatically
- ✅ **Testing** - Built-in test runner and assertions
- ✅ **Validation** - Schema and quality validation
- ✅ **Kiro Integration** - Auto-generate specs, hooks, and steering
- ✅ **Deployment** - Deploy modules to production

**Usage Example:**

```typescript
import { GhostFrameSDK } from './sdk/src/GhostFrameSDK';

const sdk = new GhostFrameSDK({
  apiKey: 'your-api-key',
  environment: 'development'
});

await sdk.initialize();

// Create a new module
const module = await sdk.createModule({
  name: 'My AI Feature',
  description: 'Custom AI-powered feature',
  inputSchema: { type: 'object', properties: { text: { type: 'string' } } },
  outputSchema: { type: 'object', properties: { result: { type: 'string' } } },
  aiModels: ['mixtral-8x7b-32768']
});

// Execute the module
const result = await sdk.executeModule({
  moduleId: module.id,
  sessionId: 'session-123',
  input: { text: 'Hello, AI!' }
});
```

### Kiro Integration (`/.kiro`)

**Full Kiro Ecosystem Support:**

```
.kiro/
├── specs/              # Spec-driven development
│   └── ghostframe/
│       ├── requirements.md
│       ├── design.md
│       └── tasks.md
├── hooks/              # Automated workflows
│   └── auto-content-processing.md
└── steering/           # AI behavior guidance
    └── ai-generation-guidelines.md
```

---

## 🎯 Core Features

### 1. Multi-Provider AI Integration

**Seamlessly switch between AI providers:**

```typescript
// backend/src/services/AIRouter.ts
const aiRouter = new AIRouter();

// Automatically routes to best available provider
const response = await aiRouter.generate({
  prompt: 'Generate a story about...',
  provider: 'groq', // or 'openai', 'anthropic', 'gemini'
  model: 'mixtral-8x7b-32768'
});
```

**Supported Providers:**
- **Groq** - Fast, free inference (recommended for development)
- **OpenAI** - GPT-3.5, GPT-4, GPT-4-turbo
- **Anthropic** - Claude 3 (Opus, Sonnet, Haiku)
- **Google Gemini** - Gemini Pro

### 2. Content Processing

**Extract text from multiple formats:**

```typescript
// backend/src/controllers/contentProcessor.ts
import { processContent } from './controllers/contentProcessor';

// Supports PDF, DOCX, TXT
const content = await processContent(file);
// Returns: { text, metadata, wordCount, ... }
```

### 3. File Upload System

**Secure file handling with validation:**

```typescript
// backend/src/routes/upload.ts
// Configured with:
// - File size limits (10MB default)
// - Type validation (PDF, DOCX, TXT)
// - Secure storage
// - Automatic cleanup
```

### 4. Rate Limiting

**Protect your API:**

```typescript
// backend/src/middleware/rateLimiter.ts
// Pre-configured limits:
// - API: 100 requests per 15 minutes
// - File upload: 10 uploads per hour
// - AI generation: 20 requests per hour
```

### 5. Logging System

**Structured logging with Winston:**

```typescript
// backend/src/utils/logger.ts
import logger from './utils/logger';

logger.info('Processing started', { userId, contentId });
logger.error('Processing failed', { error, context });
```

### 6. Error Handling

**Comprehensive error management:**

```typescript
// backend/src/middleware/errorHandler.ts
// Handles:
// - Validation errors (400)
// - Authentication errors (401)
// - Not found errors (404)
// - Server errors (500)
// - AI provider errors
```

---

## 🛠️ Building Your First AI Feature

### Step 1: Create Backend Route

```typescript
// backend/src/routes/myfeature.ts
import express from 'express';
import { AIRouter } from '../services/AIRouter';

const router = express.Router();
const aiRouter = new AIRouter();

router.post('/generate', async (req, res) => {
  try {
    const { input } = req.body;
    
    const result = await aiRouter.generate({
      prompt: `Process this: ${input}`,
      provider: 'groq',
      model: 'mixtral-8x7b-32768'
    });
    
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

### Step 2: Register Route

```typescript
// backend/src/server.ts
import myFeatureRoutes from './routes/myfeature';
app.use('/api/myfeature', myFeatureRoutes);
```

### Step 3: Create Frontend Page

```typescript
// frontend/app/myfeature/page.tsx
'use client';

import { useState } from 'react';

export default function MyFeaturePage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const response = await fetch('http://localhost:3001/api/myfeature/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input })
    });
    const data = await response.json();
    setResult(data.result);
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">My AI Feature</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full p-4 border rounded"
        rows={6}
      />
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="mt-4 px-6 py-2 bg-purple-600 text-white rounded"
      >
        {loading ? 'Generating...' : 'Generate'}
      </button>
      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          {result}
        </div>
      )}
    </div>
  );
}
```

### Step 4: Test It!

```bash
npm run dev
# Visit http://localhost:3000/myfeature
```

---

## 🤖 Kiro Integration

### Specs (Spec-Driven Development)

**Create `.kiro/specs/myfeature/requirements.md`:**

```markdown
# My Feature Requirements

## Overview
AI-powered feature that processes user input

## Functional Requirements

### Requirement 1: Input Processing
**User Story:** As a user, I want to input text so that I can get AI-generated results

#### Acceptance Criteria
1. WHEN a user provides text input, THE system SHALL validate it
2. WHEN input is valid, THE system SHALL process it with AI
3. THE system SHALL return results within 5 seconds
```

### Hooks (Automated Workflows)

**Create `.kiro/hooks/myfeature-processing.md`:**

```markdown
# My Feature Processing Hook

**Trigger:** When user submits input
**Action:** Automatically process with AI and log results

## Configuration
- Event: `input_submitted`
- Handler: `processWithAI`
- Async: true
```

### Steering (AI Behavior)

**Create `.kiro/steering/myfeature-behavior.md`:**

```markdown
# My Feature AI Behavior

## Personality
- Tone: Helpful and professional
- Style: Clear and concise
- Creativity: 0.7

## Rules
1. Always validate input before processing
2. Provide clear error messages
3. Generate high-quality outputs
4. Respect user privacy

## Quality Standards
- Response time: < 5 seconds
- Accuracy: > 90%
- User satisfaction: > 4.0/5.0
```

---

## 📊 Example Modules

### Story Spirit

**AI-powered story generation from any content**

```typescript
// modules/story-spirit/src/StorySpiritModule.ts
// Features:
// - Multiple genres (educational, adventure, mystery, fantasy, sci-fi)
// - Audience targeting (children, teens, adults)
// - Character generation
// - Theme extraction
// - Customizable length and tone
```

### Quiz Ghost

**Educational quiz generation from content**

```typescript
// modules/quiz-ghost/src/QuizGhostModule.ts
// Features:
// - Multiple difficulty levels
// - Various question types (multiple choice, true/false, short answer)
// - Automatic grading
// - Detailed explanations
// - Progress tracking
```

---

## 🚀 Deployment

### Frontend (Vercel)

```bash
cd frontend
vercel --prod
```

### Backend (Render.com)

1. Connect GitHub repo
2. Select `backend` directory
3. Set environment variables
4. Deploy!

**Environment Variables:**
```env
GROQ_API_KEY=your_key
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

---

## 📚 Best Practices

### 1. Environment Configuration

```typescript
// Always use environment variables
const apiKey = process.env.GROQ_API_KEY;
const port = process.env.PORT || 3001;
```

### 2. Error Handling

```typescript
// Always handle errors gracefully
try {
  const result = await aiRouter.generate(prompt);
  return result;
} catch (error) {
  logger.error('AI generation failed', { error });
  throw new Error('Failed to generate content');
}
```

### 3. Input Validation

```typescript
// Always validate user input
if (!input || input.length < 10) {
  throw new Error('Input must be at least 10 characters');
}
```

### 4. Rate Limiting

```typescript
// Protect your endpoints
import { apiLimiter } from './middleware/rateLimiter';
app.use('/api/expensive-operation', apiLimiter);
```

### 5. Logging

```typescript
// Log important events
logger.info('Processing started', { userId, contentId });
logger.error('Processing failed', { error, context });
```

---

## 🎯 Advanced Features

### Custom AI Providers

```typescript
// Add your own AI provider
class CustomAIService {
  async generate(prompt: string): Promise<string> {
    // Your implementation
  }
}
```

### Streaming Responses

```typescript
// Stream AI responses
router.post('/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  
  const stream = await aiRouter.generateStream(prompt);
  
  for await (const chunk of stream) {
    res.write(`data: ${JSON.stringify(chunk)}\n\n`);
  }
  
  res.end();
});
```

### Caching

```typescript
// Cache expensive operations
import { cache } from './utils/cache';

const result = await cache.get(cacheKey) || 
  await cache.set(cacheKey, await expensiveOperation());
```

---

## 🆘 Troubleshooting

### Backend Won't Start
- Check port 3001 is available
- Verify `.env` file exists
- Confirm API keys are valid

### Frontend Won't Start
- Check port 3000 is available
- Verify `.env.local` exists
- Clear `.next` cache: `rm -rf .next`

### AI Requests Failing
- Verify API key is correct
- Check internet connection
- Review rate limits
- Check backend logs

### File Uploads Not Working
- Verify `uploads` directory exists
- Check file size limits
- Ensure file types are supported

---

## 📖 Additional Resources

- **README.md** - Project overview
- **QUICKSTART.md** - 5-minute setup guide
- **SETUP_CHECKLIST.md** - Verification checklist
- **API Documentation** - `/docs` endpoint
- **Example Code** - `/modules` directory

---

## 🎉 You're Ready!

You now have everything you need to build world-class AI applications with GhostFrame.

**Next Steps:**
1. Explore the example modules
2. Build your first AI feature
3. Deploy to production
4. Share with the community!

**Need Help?**
- 📧 Email: support@ghostframe.dev
- 🐛 Issues: GitHub Issues
- 💬 Community: Discord

---

**Built with 💀 for the Kiroween Hackathon 2024**

*GhostFrame - Where dead tech learns new tricks!* 👻
