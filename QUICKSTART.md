# 🚀 GhostFrame Quick Start Guide

Get up and running with GhostFrame in 5 minutes!

---

## Step 1: Clone & Install

```bash
# Clone the repository
git clone https://github.com/Isaac-Ameh/Ghostframe.git
cd ghostframe

# Install all dependencies
npm run install:all
```

---

## Step 2: Configure Environment

### Backend Configuration

```bash
# Copy environment template
cp backend/.env.example backend/.env
```

Edit `backend/.env` and add your API keys:

```env
# Required: Get a free API key from https://console.groq.com
GROQ_API_KEY=your_groq_api_key_here

# Optional: Add other providers
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key

# Server settings (defaults are fine for development)
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend Configuration

```bash
# Copy environment template
cp frontend/.env.example frontend/.env.local
```

The defaults should work fine:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## Step 3: Start Development Servers

```bash
# Start both frontend and backend
npm run dev
```

This will start:
- **Backend** on http://localhost:3001
- **Frontend** on http://localhost:3000

---

## Step 4: Try the Demos

### Story Spirit Demo
1. Visit http://localhost:3000
2. Click "Meet the Story Spirit"
3. Upload a text file or paste content
4. Watch AI generate a creative story!

### Quiz Ghost Demo
1. Visit http://localhost:3000
2. Click "Try the Quiz Ghost"
3. Upload educational content
4. Get AI-generated quiz questions!

---

## Step 5: Build Your Own Feature

Create a new AI-powered feature in minutes:

### 1. Add a new route

Create `backend/src/routes/myfeature.ts`:

```typescript
import express from 'express';
import { AIRouter } from '../services/AIRouter';

const router = express.Router();
const aiRouter = new AIRouter();

router.post('/generate', async (req, res) => {
  try {
    const { content } = req.body;
    
    const result = await aiRouter.generate({
      prompt: `Transform this content: ${content}`,
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

### 2. Register the route

Add to `backend/src/server.ts`:

```typescript
import myFeatureRoutes from './routes/myfeature';
app.use('/api/myfeature', myFeatureRoutes);
```

### 3. Create frontend page

Create `frontend/app/myfeature/page.tsx`:

```typescript
'use client';

import { useState } from 'react';

export default function MyFeaturePage() {
  const [content, setContent] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/myfeature/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">My AI Feature</h1>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-4 border rounded"
        rows={6}
        placeholder="Enter your content..."
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
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
```

### 4. Test it!

Visit http://localhost:3000/myfeature

---

## 🎯 Next Steps

- 📚 Read the [full documentation](docs/)
- 🔧 Explore the [AI services](backend/src/services/)
- 🎨 Customize the [frontend components](frontend/components/)
- 🚀 Deploy to production (see [DEPLOYMENT.md](docs/DEPLOYMENT.md))

---

## 🆘 Troubleshooting

### Backend won't start
- Check that port 3001 is available
- Verify your `.env` file has valid API keys
- Run `npm install` in the backend directory

### Frontend won't start
- Check that port 3000 is available
- Verify `.env.local` exists
- Run `npm install` in the frontend directory

### AI requests failing
- Verify your GROQ_API_KEY is valid
- Check backend logs for errors
- Ensure you have internet connection

### File uploads not working
- Check `UPLOAD_DIR` in `.env`
- Verify the directory exists and is writable
- Check `MAX_FILE_SIZE` setting

---

## 💡 Tips

1. **Use Groq for fast responses** - It's free and blazing fast
2. **Start with the demos** - They show best practices
3. **Check the logs** - Backend logs show all AI requests
4. **Use TypeScript** - Get better autocomplete and type safety
5. **Read the code** - The demos are well-commented

---

## 🎃 Happy Building!

You're now ready to build amazing AI-powered applications with GhostFrame!

Need help? Check the [docs](docs/) or join our [Discord](https://discord.gg/vXjncVTx).

**Built with 💀 for the Kiroween Hackathon 2024**
