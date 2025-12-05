'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Book, Code, Zap, Shield, Users, Layers } from 'lucide-react';

export default function FrameworkDocsPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link href="/framework" className="inline-flex items-center text-spectral-green hover:text-spectral-green/80 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Framework
          </Link>
          
          <h1 className="text-4xl md:text-6xl font-bold text-ghost-white mb-6">
            🎃 GhostFrame
            <span className="block text-2xl md:text-3xl text-spectral-green mt-2">
              Developer Documentation
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl">
            Complete guide to building AI modules with the GhostFrame framework. 
            Learn how to create, deploy, and manage intelligent content processing modules.
          </p>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          <div className="bg-midnight-black/50 border border-spectral-green/30 rounded-xl p-6">
            <Book className="h-8 w-8 text-spectral-green mb-4" />
            <h3 className="text-xl font-bold text-ghost-white mb-2">Getting Started</h3>
            <p className="text-gray-300 mb-4">Learn the basics of GhostFrame and create your first module.</p>
            <a href="#getting-started" className="text-spectral-green hover:text-spectral-green/80">
              Read Guide →
            </a>
          </div>

          <div className="bg-midnight-black/50 border border-spectral-green/30 rounded-xl p-6">
            <Code className="h-8 w-8 text-spectral-green mb-4" />
            <h3 className="text-xl font-bold text-ghost-white mb-2">API Reference</h3>
            <p className="text-gray-300 mb-4">Complete API documentation and code examples.</p>
            <a href="#api-reference" className="text-spectral-green hover:text-spectral-green/80">
              View API →
            </a>
          </div>

          <div className="bg-midnight-black/50 border border-spectral-green/30 rounded-xl p-6">
            <Zap className="h-8 w-8 text-spectral-green mb-4" />
            <h3 className="text-xl font-bold text-ghost-white mb-2">Examples</h3>
            <p className="text-gray-300 mb-4">Real-world examples and implementation patterns.</p>
            <a href="#examples" className="text-spectral-green hover:text-spectral-green/80">
              See Examples →
            </a>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-8 bg-midnight-black/30 border border-spectral-green/20 rounded-xl p-6">
              <h3 className="text-lg font-bold text-ghost-white mb-4">Documentation</h3>
              <nav className="space-y-2">
                <a 
                  href="#getting-started" 
                  className="group flex items-center text-gray-300 hover:text-spectral-green py-2 px-3 rounded-lg hover:bg-spectral-green/10 transition-all duration-300"
                >
                  <span className="mr-3 group-hover:scale-110 transition-transform">📚</span>
                  <span className="group-hover:translate-x-1 transition-transform">Getting Started</span>
                </a>
                <a 
                  href="#architecture" 
                  className="group flex items-center text-gray-300 hover:text-spectral-green py-2 px-3 rounded-lg hover:bg-spectral-green/10 transition-all duration-300"
                >
                  <span className="mr-3 group-hover:scale-110 transition-transform">🏗️</span>
                  <span className="group-hover:translate-x-1 transition-transform">Architecture</span>
                </a>
                <a 
                  href="#module-development" 
                  className="group flex items-center text-gray-300 hover:text-spectral-green py-2 px-3 rounded-lg hover:bg-spectral-green/10 transition-all duration-300"
                >
                  <span className="mr-3 group-hover:scale-110 transition-transform">🔧</span>
                  <span className="group-hover:translate-x-1 transition-transform">Module Development</span>
                </a>
                <a 
                  href="#kiro-integration" 
                  className="group flex items-center text-gray-300 hover:text-spectral-green py-2 px-3 rounded-lg hover:bg-spectral-green/10 transition-all duration-300"
                >
                  <span className="mr-3 group-hover:scale-110 transition-transform">🤖</span>
                  <span className="group-hover:translate-x-1 transition-transform">Kiro Integration</span>
                </a>
                <a 
                  href="#api-reference" 
                  className="group flex items-center text-gray-300 hover:text-spectral-green py-2 px-3 rounded-lg hover:bg-spectral-green/10 transition-all duration-300"
                >
                  <span className="mr-3 group-hover:scale-110 transition-transform">📡</span>
                  <span className="group-hover:translate-x-1 transition-transform">API Reference</span>
                </a>
                <a 
                  href="#examples" 
                  className="group flex items-center text-gray-300 hover:text-spectral-green py-2 px-3 rounded-lg hover:bg-spectral-green/10 transition-all duration-300"
                >
                  <span className="mr-3 group-hover:scale-110 transition-transform">💡</span>
                  <span className="group-hover:translate-x-1 transition-transform">Examples</span>
                </a>
              </nav>
            </div>
          </motion.div>

          {/* Main Documentation Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3 space-y-12"
          >
            {/* Getting Started */}
            <section id="getting-started" className="scroll-mt-8">
              <h2 className="text-3xl font-bold text-ghost-white mb-6 flex items-center">
                <Book className="h-8 w-8 text-spectral-green mr-3" />
                Getting Started
              </h2>
              
              <div className="bg-midnight-black/30 border border-spectral-green/20 rounded-xl p-8 mb-8">
                <h3 className="text-xl font-bold text-ghost-white mb-4">What is GhostFrame?</h3>
                <p className="text-gray-300 mb-6">
                  GhostFrame is a modular AI framework designed for building intelligent content processing applications. 
                  It provides a standardized way to create, deploy, and manage AI modules with built-in Kiro integration 
                  for automated workflows and agent-driven development.
                </p>

                <h4 className="text-lg font-semibold text-ghost-white mb-3">Key Features</h4>
                <ul className="text-gray-300 space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="text-spectral-green mr-2">•</span>
                    <span><strong>Modular Architecture:</strong> Build reusable AI processing modules</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-spectral-green mr-2">•</span>
                    <span><strong>Kiro Integration:</strong> Full compatibility with Kiro agent workflows</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-spectral-green mr-2">•</span>
                    <span><strong>Type Safety:</strong> Built with TypeScript for robust development</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-spectral-green mr-2">•</span>
                    <span><strong>Developer Tools:</strong> Comprehensive tooling and documentation</span>
                  </li>
                </ul>

                <h4 className="text-lg font-semibold text-ghost-white mb-3">Quick Start</h4>
                <div className="bg-black/50 border border-spectral-green/30 rounded-lg p-4 mb-4">
                  <code className="text-spectral-green text-sm">
                    # Clone the framework<br/>
                    git clone https://github.com/Isaac-Ameh/Ghostframe.git<br/><br/>
                    # Install dependencies<br/>
                    npm install<br/><br/>
                    # Start development server<br/>
                    npm run dev
                  </code>
                </div>
              </div>
            </section>

            {/* Architecture */}
            <section id="architecture" className="scroll-mt-8">
              <h2 className="text-3xl font-bold text-ghost-white mb-6 flex items-center">
                <Layers className="h-8 w-8 text-spectral-green mr-3" />
                Architecture
              </h2>
              
              <div className="bg-midnight-black/30 border border-spectral-green/20 rounded-xl p-8 mb-8">
                <h3 className="text-xl font-bold text-ghost-white mb-4">System Overview</h3>
                <p className="text-gray-300 mb-6">
                  GhostFrame follows a layered architecture with clear separation of concerns:
                </p>

                {/* Architecture Diagram */}
                <div className="bg-black/50 border border-spectral-green/30 rounded-xl p-8 mb-8">
                  <h4 className="text-lg font-semibold text-ghost-white mb-6 text-center">GhostFrame Architecture Flow</h4>
                  <div className="flex flex-col items-center space-y-4 text-sm">
                    {/* User Layer */}
                    <div className="flex items-center space-x-2 bg-spectral-green/20 border border-spectral-green/50 rounded-lg px-4 py-2">
                      <span className="text-2xl">👤</span>
                      <span className="text-ghost-white font-semibold">User</span>
                    </div>
                    
                    <div className="text-spectral-green text-xl">↓</div>
                    
                    {/* Frontend Layer */}
                    <div className="flex items-center space-x-2 bg-blue-500/20 border border-blue-500/50 rounded-lg px-4 py-2">
                      <span className="text-2xl">🎨</span>
                      <span className="text-ghost-white font-semibold">Frontend (Next.js + Tailwind)</span>
                    </div>
                    
                    <div className="text-spectral-green text-xl">↓</div>
                    
                    {/* Backend Layer */}
                    <div className="flex items-center space-x-2 bg-purple-500/20 border border-purple-500/50 rounded-lg px-4 py-2">
                      <span className="text-2xl">⚙️</span>
                      <span className="text-ghost-white font-semibold">Backend (Express + TypeScript)</span>
                    </div>
                    
                    <div className="text-spectral-green text-xl">↓</div>
                    
                    {/* Module Registry */}
                    <div className="flex items-center space-x-2 bg-orange-500/20 border border-orange-500/50 rounded-lg px-4 py-2">
                      <span className="text-2xl">📦</span>
                      <span className="text-ghost-white font-semibold">Module Registry (/api/framework/modules)</span>
                    </div>
                    
                    <div className="text-spectral-green text-xl">↓</div>
                    
                    {/* AI Modules */}
                    <div className="flex flex-wrap justify-center gap-4 mb-4">
                      <div className="flex items-center space-x-2 bg-green-500/20 border border-green-500/50 rounded-lg px-3 py-2">
                        <span className="text-xl">🎃</span>
                        <span className="text-ghost-white text-sm">Quiz Ghost</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-green-500/20 border border-green-500/50 rounded-lg px-3 py-2">
                        <span className="text-xl">👻</span>
                        <span className="text-ghost-white text-sm">Story Spirit</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-green-500/20 border border-green-500/50 rounded-lg px-3 py-2">
                        <span className="text-xl">🔮</span>
                        <span className="text-ghost-white text-sm">Custom Modules</span>
                      </div>
                    </div>
                    
                    <div className="text-spectral-green text-xl">↓</div>
                    
                    {/* Kiro Integration */}
                    <div className="bg-gradient-to-r from-spectral-green/20 to-purple-500/20 border border-spectral-green/50 rounded-xl p-4">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-2xl">🤖</span>
                          <span className="text-ghost-white font-semibold">Kiro Agent Engine</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 text-xs">
                          <div className="bg-spectral-green/30 rounded px-2 py-1 text-ghost-white">📋 .kiro/specs</div>
                          <div className="bg-spectral-green/30 rounded px-2 py-1 text-ghost-white">🎣 hooks</div>
                          <div className="bg-spectral-green/30 rounded px-2 py-1 text-ghost-white">🧭 steering</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-black/30 border border-spectral-green/20 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-ghost-white mb-2">Frontend Layer</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Next.js 14 with App Router</li>
                      <li>• React 18 with TypeScript</li>
                      <li>• Tailwind CSS for styling</li>
                      <li>• Framer Motion for animations</li>
                    </ul>
                  </div>

                  <div className="bg-black/30 border border-spectral-green/20 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-ghost-white mb-2">Backend Layer</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Node.js with Express</li>
                      <li>• TypeScript for type safety</li>
                      <li>• Modular service architecture</li>
                      <li>• RESTful API design</li>
                    </ul>
                  </div>

                  <div className="bg-black/30 border border-spectral-green/20 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-ghost-white mb-2">Module System</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Plugin-based architecture</li>
                      <li>• Dynamic module loading</li>
                      <li>• Standardized interfaces</li>
                      <li>• Hot-swappable modules</li>
                    </ul>
                  </div>

                  <div className="bg-black/30 border border-spectral-green/20 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-ghost-white mb-2">Kiro Integration</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Automated spec generation</li>
                      <li>• Hook-based workflows</li>
                      <li>• Steering engine integration</li>
                      <li>• Agent orchestration</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Module Development */}
            <section id="module-development" className="scroll-mt-8">
              <h2 className="text-3xl font-bold text-ghost-white mb-6 flex items-center">
                <Code className="h-8 w-8 text-spectral-green mr-3" />
                Module Development
              </h2>
              
              <div className="bg-midnight-black/30 border border-spectral-green/20 rounded-xl p-8 mb-8">
                <h3 className="text-xl font-bold text-ghost-white mb-4">Creating Your First Module</h3>
                
                <p className="text-gray-300 mb-6">
                  Modules in GhostFrame are self-contained units that process content and generate AI-powered results. 
                  Each module follows a standardized structure and interface.
                </p>

                <h4 className="text-lg font-semibold text-ghost-white mb-3">Module Structure</h4>
                <div className="bg-black/50 border border-spectral-green/30 rounded-lg p-4 mb-6">
                  <code className="text-spectral-green text-sm">
                    my-module/<br/>
                    ├── module.config.json     # Module configuration<br/>
                    ├── src/<br/>
                    │   ├── processor.ts       # Main processing logic<br/>
                    │   ├── types.ts          # Type definitions<br/>
                    │   └── utils.ts          # Utility functions<br/>
                    ├── kiro/<br/>
                    │   ├── requirements.md   # Kiro requirements spec<br/>
                    │   ├── design.md         # Design documentation<br/>
                    │   ├── tasks.md          # Implementation tasks<br/>
                    │   └── hooks/            # Automation hooks<br/>
                    └── tests/<br/>
                        └── processor.test.ts  # Unit tests
                  </code>
                </div>

                <h4 className="text-lg font-semibold text-ghost-white mb-3">.kiro/ Folder Structure</h4>
                <div className="bg-black/50 border border-spectral-green/30 rounded-lg p-4 mb-6">
                  <code className="text-spectral-green text-sm">
                    {`.kiro/
├── specs/
│   ├── requirements.md    # EARS-compliant requirements
│   ├── design.md         # Architecture documentation  
│   └── tasks.md          # Implementation roadmap
├── hooks/
│   ├── onUpload.js       # Content upload automation
│   ├── onGenerate.js     # AI generation triggers
│   └── onComplete.js     # Post-processing workflows
└── steering/
    ├── personality.md    # AI personality guidelines
    ├── behavior.md       # Behavior rules and patterns
    └── quality.md        # Quality standards and metrics`}
                  </code>
                </div>

                <h4 className="text-lg font-semibold text-ghost-white mb-3">Basic Module Interface</h4>
                <div className="bg-black/50 border border-spectral-green/30 rounded-lg p-4 mb-6">
                  <code className="text-spectral-green text-sm">
                    {`interface KiroModule {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  category: ModuleCategory;
  config: ModuleConfig;
  processor: ContentProcessor;
  hooks?: HookDefinition[];
  steering?: SteeringRules;
}`}
                  </code>
                </div>
              </div>
            </section>

            {/* Kiro Integration */}
            <section id="kiro-integration" className="scroll-mt-8">
              <h2 className="text-3xl font-bold text-ghost-white mb-6 flex items-center">
                <Zap className="h-8 w-8 text-spectral-green mr-3" />
                Kiro Integration
              </h2>
              
              <div className="bg-midnight-black/30 border border-spectral-green/20 rounded-xl p-8 mb-8">
                <h3 className="text-xl font-bold text-ghost-white mb-4">Automated Workflows</h3>
                
                <p className="text-gray-300 mb-6">
                  GhostFrame modules are designed for seamless integration with Kiro's agent-driven development workflow. 
                  This includes automated spec generation, hook-based automation, and intelligent steering.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-black/30 border border-spectral-green/20 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-ghost-white mb-2">Specifications</h4>
                    <p className="text-gray-300 text-sm mb-3">
                      Automatically generated requirements, design, and task specifications.
                    </p>
                    <ul className="text-gray-300 text-xs space-y-1">
                      <li>• EARS-compliant requirements</li>
                      <li>• Comprehensive design docs</li>
                      <li>• Actionable task lists</li>
                    </ul>
                  </div>

                  <div className="bg-black/30 border border-spectral-green/20 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-ghost-white mb-2">Hooks</h4>
                    <p className="text-gray-300 text-sm mb-3">
                      Event-driven automation for content processing workflows.
                    </p>
                    <ul className="text-gray-300 text-xs space-y-1">
                      <li>• Content processing triggers</li>
                      <li>• Quality assurance automation</li>
                      <li>• Result optimization</li>
                    </ul>
                  </div>

                  <div className="bg-black/30 border border-spectral-green/20 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-ghost-white mb-2">Steering</h4>
                    <p className="text-gray-300 text-sm mb-3">
                      AI behavior guidance and quality standards enforcement.
                    </p>
                    <ul className="text-gray-300 text-xs space-y-1">
                      <li>• Behavior rules</li>
                      <li>• Quality thresholds</li>
                      <li>• Context adaptation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* API Reference */}
            <section id="api-reference" className="scroll-mt-8">
              <h2 className="text-3xl font-bold text-ghost-white mb-6 flex items-center">
                <Shield className="h-8 w-8 text-spectral-green mr-3" />
                API Reference
              </h2>
              
              <div className="bg-midnight-black/30 border border-spectral-green/20 rounded-xl p-8 mb-8">
                <h3 className="text-xl font-bold text-ghost-white mb-4">Core Endpoints</h3>
                
                <div className="space-y-6">
                  <div className="bg-black/30 border border-spectral-green/20 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-ghost-white mb-2">Module Registry</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="bg-spectral-green text-black px-2 py-1 rounded text-xs font-bold">GET</span>
                        <code className="text-spectral-green">/api/framework/modules</code>
                        <span className="text-gray-300">List all modules</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">POST</span>
                        <code className="text-spectral-green">/api/framework/modules</code>
                        <span className="text-gray-300">Register new module</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-spectral-green text-black px-2 py-1 rounded text-xs font-bold">GET</span>
                        <code className="text-spectral-green">/api/framework/modules/:id</code>
                        <span className="text-gray-300">Get module details</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/30 border border-spectral-green/20 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-ghost-white mb-2">Template Generation</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">POST</span>
                        <code className="text-spectral-green">/api/framework/generate</code>
                        <span className="text-gray-300">Generate module template</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/30 border border-spectral-green/20 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-ghost-white mb-2">Developer Authentication</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">POST</span>
                        <code className="text-spectral-green">/api/auth/developer/register</code>
                        <span className="text-gray-300">Register developer</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">POST</span>
                        <code className="text-spectral-green">/api/auth/developer/login</code>
                        <span className="text-gray-300">Developer login</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Examples */}
            <section id="examples" className="scroll-mt-8">
              <h2 className="text-3xl font-bold text-ghost-white mb-6 flex items-center">
                <Users className="h-8 w-8 text-spectral-green mr-3" />
                Examples
              </h2>
              
              <div className="bg-midnight-black/30 border border-spectral-green/20 rounded-xl p-8 mb-8">
                <h3 className="text-xl font-bold text-ghost-white mb-4">Built-in Modules</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-black/30 border border-spectral-green/20 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-ghost-white mb-2">Quiz Ghost</h4>
                    <p className="text-gray-300 text-sm mb-3">
                      Educational content processing module that generates interactive quizzes from uploaded content.
                    </p>
                    <div className="text-xs text-gray-400">
                      <strong>Category:</strong> Education<br/>
                      <strong>Input:</strong> Text, PDF, Documents<br/>
                      <strong>Output:</strong> Interactive Quizzes
                    </div>
                  </div>

                  <div className="bg-black/30 border border-spectral-green/20 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-ghost-white mb-2">Story Spirit</h4>
                    <p className="text-gray-300 text-sm mb-3">
                      Creative storytelling module that transforms content into engaging narratives and stories.
                    </p>
                    <div className="text-xs text-gray-400">
                      <strong>Category:</strong> Creative<br/>
                      <strong>Input:</strong> Text, Concepts, Themes<br/>
                      <strong>Output:</strong> Stories, Narratives
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="border-t border-spectral-green/20 pt-8 mt-16">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400 text-sm mb-4 md:mb-0">
                  © 2024 GhostFrame. Built with 🎃 for the AI community.
                </p>
                <div className="flex space-x-6">
                  <Link href="/framework" className="text-spectral-green hover:text-spectral-green/80">
                    Framework
                  </Link>
                  <Link href="https://github.com/Isaac-Ameh/Ghostframe" className="text-spectral-green hover:text-spectral-green/80">
                    GitHub
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}over:text-spectral-green/80 text-sm">
                    Framework Home
                  </Link>
                  <Link href="/framework/create" className="text-spectral-green hover:text-spectral-green/80 text-sm">
                    Create Module
                  </Link>
                  <a href="https://github.com/your-org/ghostframe" className="text-spectral-green hover:text-spectral-green/80 text-sm">
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}