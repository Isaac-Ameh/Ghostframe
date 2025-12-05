# 👻 GhostFrame - AI Starter Framework

**Where dead tech learns new tricks.**

GhostFrame is a production-ready AI starter framework for building intelligent applications with Kiro. Skip the boilerplate and start building AI-powered experiences in minutes.

Built for the **Kiroween Hackathon 2024** 🎃

---

## 🚀 What is GhostFrame?

GhostFrame is a **complete starter framework** that provides everything you need to build AI-powered applications:

- ✅ **Backend Foundation** - Express + TypeScript server with AI routing
- ✅ **Frontend Foundation** - Next.js 14 + React + Tailwind CSS
- ✅ **AI Integration** - Multi-provider support (OpenAI, Groq, Gemini, Anthropic)
- ✅ **Content Processing** - File upload, PDF/DOCX extraction, text processing
- ✅ **Production Ready** - Security, logging, error handling, rate limiting
- ✅ **Two Working Demos** - Story Spirit & Quiz Ghost showcasing capabilities

---

## 🎯 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Isaac-Ameh/Ghostframe.git
cd ghostframe

# Install dependencies
npm run install:all

# Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Add your AI API keys to backend/.env
# GROQ_API_KEY=your_key_here
# OPENAI_API_KEY=your_key_here (optional)

# Start development servers
npm run dev
```

Visit:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

---

## 📦 What's Included

### Backend (`/backend`)
```
✅ Express + TypeScript server
✅ AI Router (multi-provider support)
✅ File upload & content extraction (PDF, DOCX, TXT)
✅ Rate limiting & security (Helmet, CORS)
✅ Logging system (Winston)
✅ Error handling middleware
✅ Environment configuration
```

### Frontend (`/frontend`)
```
✅ Next.js 14 + React + TypeScript
✅ Tailwind CSS styling
✅ Reusable AI components
✅ File upload interface
✅ Results visualization
✅ Responsive design
```

### AI Services (`/backend/src/services`)
```
✅ AIRouter - Multi-provider AI routing
✅ GroqService - Groq API integration
✅ OpenAIService - OpenAI API integration
✅ AnthropicService - Claude API integration
✅ Content extraction utilities
```

### Demo Modules (`/modules`)
```
✅ Story Spirit - Creative story generation from content
✅ Quiz Ghost - Educational quiz generation from content
```

---

## 🎨 Demo Applications

### 1. Story Spirit
Transform any content into engaging stories with AI.

**Features:**
- Multiple genres (educational, adventure, mystery, fantasy, sci-fi)
- Audience targeting (children, teens, adults)
- Character generation
- Theme extraction

### 2. Quiz Ghost
Generate educational quizzes from any content.

**Features:**
- Multiple difficulty levels
- Various question types
- Automatic grading
- Detailed explanations

---

## 🛠️ Building Your Own Module

GhostFrame makes it easy to create your own AI-powered features:

```typescript
// Example: Create a new AI module
import { AIRouter } from './services/AIRouter';

export async function myAIFeature(content: string) {
  const aiRouter = new AIRouter();
  
  const result = await aiRouter.generate({
    prompt: `Process this content: ${content}`,
    provider: 'groq',
    model: 'mixtral-8x7b-32768'
  });
  
  return result;
}
```

---

## 📚 Project Structure

```
ghostframe/
├── backend/              # Express API server
│   ├── src/
│   │   ├── routes/      # API endpoints
│   │   ├── services/    # AI services & utilities
│   │   ├── controllers/ # Business logic
│   │   ├── middleware/  # Express middleware
│   │   └── utils/       # Helper functions
│   └── package.json
├── frontend/            # Next.js frontend
│   ├── app/            # Next.js 14 app directory
│   ├── components/     # React components
│   └── package.json
├── modules/            # Demo modules
│   ├── story-spirit/
│   └── quiz-ghost/
├── sdk/               # GhostFrame SDK
└── docs/              # Documentation
```

---

## 🔧 Configuration

### Backend Environment Variables

```env
# AI Provider API Keys
GROQ_API_KEY=your_groq_key
OPENAI_API_KEY=your_openai_key (optional)
ANTHROPIC_API_KEY=your_anthropic_key (optional)

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

### Frontend Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## 🚢 Deployment

### Backend Deployment (Render, Railway, etc.)

```bash
cd backend
npm run build
npm start
```

### Frontend Deployment (Vercel, Netlify)

```bash
cd frontend
npm run build
```

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment guides.

---

## 🎯 Use Cases

GhostFrame is perfect for building:

- 📚 **Educational Tools** - Quiz generators, study guides, tutoring systems
- ✍️ **Content Creation** - Story generators, writing assistants, content transformers
- 🔍 **Research Tools** - Document analysis, summarization, insights extraction
- 🎮 **Interactive Experiences** - AI-powered games, chatbots, virtual assistants
- 📊 **Data Processing** - Text analysis, classification, extraction

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🎃 Built for Kiroween Hackathon 2024

GhostFrame was created for the Kiroween Hackathon to showcase the power of Kiro's AI agent architecture combined with a modular, extensible framework.

**Team:** [Your Team Name]
**Hackathon:** Kiroween 2024

---

## 🔗 Links

- 📚 [Documentation](docs/)
- 🐙 [GitHub Repository](https://github.com/Isaac-Ameh/Ghostframe)
- 🎯 [Live Demo](https://ghostframe-demo.vercel.app)
- 💬 [Community Discord](https://discord.gg/vXjncVTx)

---

## 💀 Support

Need help? 

- 📖 Check the [Documentation](docs/)
- 💬 Join our [Discord Community](https://discord.gg/vXjncVTx)
- 🐛 Report issues on [GitHub](https://github.com/Isaac-Ameh/Ghostframe/issues)

---

**Built with 💀 for the Kiroween Hackathon 2024**

*GhostFrame - Where dead tech learns new tricks!* 👻
