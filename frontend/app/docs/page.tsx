'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, Zap, Code, Layers, Download, FileCode, Brain, Shield, Rocket } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-orange-900 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-white mb-4 creepster-heading">
            📚 Framework Guide
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to build world-class AI applications with GhostFrame
          </p>
        </motion.div>

        {/* Quick Start */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-gray-800 mb-8"
        >
          <div className="flex items-center mb-6">
            <Rocket className="h-8 w-8 text-pumpkin-orange mr-3" />
            <h2 className="text-3xl font-bold text-white">Quick Start</h2>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-6 font-mono text-sm mb-6">
            <div className="text-gray-400"># Clone the repository</div>
            <div className="text-green-400">git clone https://github.com/Isaac-Ameh/Ghostframe.git</div>
            <div className="text-gray-400 mt-4"># Install dependencies</div>
            <div className="text-green-400">cd ghostframe && npm run install:all</div>
            <div className="text-gray-400 mt-4"># Configure environment</div>
            <div className="text-green-400">cp backend/.env.example backend/.env</div>
            <div className="text-gray-400 mt-4"># Add your API key to backend/.env</div>
            <div className="text-yellow-400">GROQ_API_KEY=your_key_here</div>
            <div className="text-gray-400 mt-4"># Start development servers</div>
            <div className="text-green-400">npm run dev</div>
          </div>
          <p className="text-gray-300">
            ⚡ That's it! You're now running GhostFrame locally. Visit{' '}
            <code className="text-pumpkin-orange bg-gray-800 px-2 py-1 rounded">http://localhost:3000</code>
          </p>
        </motion.div>

        {/* What's Included */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <Package className="h-8 w-8 text-spectral-green mr-3" />
            What's Included
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Backend */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
              <Code className="h-12 w-12 text-pumpkin-orange mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Backend Foundation</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>✅ Express + TypeScript server</li>
                <li>✅ AI Router (multi-provider)</li>
                <li>✅ File upload & processing</li>
                <li>✅ Rate limiting & security</li>
                <li>✅ Logging (Winston)</li>
                <li>✅ Error handling</li>
              </ul>
            </div>

            {/* Frontend */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
              <Layers className="h-12 w-12 text-spectral-green mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Frontend Foundation</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>✅ Next.js 14 + React</li>
                <li>✅ TypeScript throughout</li>
                <li>✅ Tailwind CSS styling</li>
                <li>✅ Reusable components</li>
                <li>✅ Framer Motion animations</li>
                <li>✅ Responsive design</li>
              </ul>
            </div>

            {/* AI Integration */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
              <Brain className="h-12 w-12 text-specter-purple mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">AI Integration</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>✅ Groq API (fast & free)</li>
                <li>✅ OpenAI support</li>
                <li>✅ Anthropic Claude</li>
                <li>✅ Google Gemini</li>
                <li>✅ Streaming responses</li>
                <li>✅ Error handling & retries</li>
              </ul>
            </div>

            {/* Content Processing */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
              <FileCode className="h-12 w-12 text-pumpkin-orange mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Content Processing</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>✅ PDF extraction</li>
                <li>✅ DOCX extraction</li>
                <li>✅ Text processing</li>
                <li>✅ File validation</li>
                <li>✅ Metadata extraction</li>
                <li>✅ Content analysis</li>
              </ul>
            </div>

            {/* Security */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
              <Shield className="h-12 w-12 text-spectral-green mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Production Ready</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>✅ Helmet.js security</li>
                <li>✅ CORS configuration</li>
                <li>✅ Rate limiting</li>
                <li>✅ Input validation</li>
                <li>✅ Error boundaries</li>
                <li>✅ Environment config</li>
              </ul>
            </div>

            {/* Kiro Integration */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
              <Zap className="h-12 w-12 text-specter-purple mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Kiro Integration</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>✅ .kiro/ folder structure</li>
                <li>✅ Specs support</li>
                <li>✅ Hooks support</li>
                <li>✅ Steering support</li>
                <li>✅ Context management</li>
                <li>✅ Agent-ready</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Project Structure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-gray-800 mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-6">📁 Project Structure</h2>
          <div className="bg-gray-800/50 rounded-lg p-6 font-mono text-sm text-gray-300">
            <div>ghostframe/</div>
            <div className="ml-4">├── backend/          <span className="text-gray-500"># Express API server</span></div>
            <div className="ml-8">├── src/</div>
            <div className="ml-12">├── services/    <span className="text-gray-500"># AI Router, providers</span></div>
            <div className="ml-12">├── routes/      <span className="text-gray-500"># API endpoints</span></div>
            <div className="ml-12">├── controllers/ <span className="text-gray-500"># Business logic</span></div>
            <div className="ml-12">├── middleware/  <span className="text-gray-500"># Express middleware</span></div>
            <div className="ml-12">└── utils/       <span className="text-gray-500"># Helper functions</span></div>
            <div className="ml-4 mt-2">├── frontend/         <span className="text-gray-500"># Next.js frontend</span></div>
            <div className="ml-8">├── app/          <span className="text-gray-500"># Pages & routes</span></div>
            <div className="ml-8">└── components/   <span className="text-gray-500"># React components</span></div>
            <div className="ml-4 mt-2">├── modules/          <span className="text-gray-500"># Example modules</span></div>
            <div className="ml-8">├── story-spirit/ <span className="text-gray-500"># Story generation</span></div>
            <div className="ml-8">└── quiz-ghost/   <span className="text-gray-500"># Quiz generation</span></div>
            <div className="ml-4 mt-2">├── .kiro/            <span className="text-gray-500"># Kiro integration</span></div>
            <div className="ml-8">├── specs/        <span className="text-gray-500"># Spec files</span></div>
            <div className="ml-8">├── hooks/        <span className="text-gray-500"># Agent hooks</span></div>
            <div className="ml-8">└── steering/     <span className="text-gray-500"># AI behavior rules</span></div>
            <div className="ml-4 mt-2">└── docs/             <span className="text-gray-500"># Documentation</span></div>
          </div>
        </motion.div>

        {/* Building Your First Feature */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-gray-800 mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-6">🚀 Build Your First AI Feature</h2>
          <div className="space-y-6">
            
            <div>
              <h3 className="text-xl font-semibold text-pumpkin-orange mb-3">1. Create a Route</h3>
              <div className="bg-gray-800/50 rounded-lg p-4 font-mono text-sm">
                <div className="text-gray-400">// backend/src/routes/myfeature.ts</div>
                <div className="text-blue-400 mt-2">import</div> <span className="text-white">express</span> <div className="text-blue-400 inline">from</div> <span className="text-green-400">'express'</span>;
                <div className="text-blue-400">import</div> {'{ AIRouter }'} <div className="text-blue-400 inline">from</div> <span className="text-green-400">'../services/AIRouter'</span>;
                <div className="mt-2 text-blue-400">const</div> <span className="text-white">router = express.Router();</span>
                <div className="text-blue-400">const</div> <span className="text-white">aiRouter = </span><div className="text-blue-400 inline">new</div> <span className="text-white">AIRouter();</span>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-spectral-green mb-3">2. Add AI Logic</h3>
              <div className="bg-gray-800/50 rounded-lg p-4 font-mono text-sm text-gray-300">
                <div>router.post('/generate', async (req, res) =&gt; {'{'}</div>
                <div className="ml-4">const result = await aiRouter.generate({'{'}</div>
                <div className="ml-8">prompt: `Your prompt here`,</div>
                <div className="ml-8">provider: 'groq',</div>
                <div className="ml-8">model: 'mixtral-8x7b-32768'</div>
                <div className="ml-4">{'}'});</div>
                <div className="ml-4">res.json(result);</div>
                <div>{'}'});</div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-specter-purple mb-3">3. Create Frontend Page</h3>
              <div className="bg-gray-800/50 rounded-lg p-4 font-mono text-sm text-gray-300">
                <div>// frontend/app/myfeature/page.tsx</div>
                <div className="mt-2">export default function MyFeature() {'{'}</div>
                <div className="ml-4">// Your React component here</div>
                <div>{'}'}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Download & Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Build?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href="https://github.com/Isaac-Ameh/Ghostframe/archive/refs/heads/main.zip"
              className="inline-flex items-center px-8 py-4 bg-pumpkin-orange hover:bg-specter-purple text-white font-bold rounded-lg transition-all transform hover:scale-105"
              style={{ boxShadow: '0 0 20px rgba(127, 255, 0, 0.3)' }}
            >
              <Download className="mr-2 h-5 w-5" />
              Download Framework
            </a>
            <a
              href="https://github.com/Isaac-Ameh/Ghostframe"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-all"
            >
              View on GitHub
            </a>
          </div>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <Link href="/story-spirit" className="hover:text-spectral-green transition-colors">
              Try Story Demo
            </Link>
            <Link href="/quiz-ghost" className="hover:text-spectral-green transition-colors">
              Try Quiz Demo
            </Link>
            <Link href="/" className="hover:text-spectral-green transition-colors">
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
