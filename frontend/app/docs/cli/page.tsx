// 🎃 GhostFrame CLI Documentation
// Comprehensive guide for the GhostFrame command-line interface

'use client';

import React, { useState } from 'react';
import { Terminal, Download, Zap, Shield, Package, Code, CheckCircle, AlertCircle } from 'lucide-react';

export default function CLIDocumentationPage() {
  const [activeTab, setActiveTab] = useState('installation');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-orange-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Terminal className="w-12 h-12 text-orange-500" />
            <h1 className="text-5xl font-bold">GhostFrame CLI</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Professional command-line tool for building, testing, and publishing GhostFrame modules
          </p>
        </div>

        {/* Quick Start Banner */}
        <div className="bg-gradient-to-r from-orange-600 to-purple-600 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <Zap className="w-8 h-8 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold mb-2">Quick Start</h3>
              <div className="bg-black/30 rounded p-3 font-mono text-sm">
                <div>npm install -g ghostframe-cli</div>
                <div className="mt-2">ghostframe init my-module</div>
                <div className="mt-2">cd my-module && ghostframe dev</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-700">
          {[
            { id: 'installation', label: 'Installation', icon: Download },
            { id: 'commands', label: 'Commands', icon: Terminal },
            { id: 'workflow', label: 'Workflow', icon: Code },
            { id: 'examples', label: 'Examples', icon: Package }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="bg-gray-900/50 backdrop-blur rounded-lg p-8">
          {activeTab === 'installation' && <InstallationSection />}
          {activeTab === 'commands' && <CommandsSection />}
          {activeTab === 'workflow' && <WorkflowSection />}
          {activeTab === 'examples' && <ExamplesSection />}
        </div>
      </div>
    </div>
  );
}

// Installation Section
function InstallationSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-4">Installation</h2>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <Download className="w-5 h-5 text-green-500" />
          Global Installation
        </h3>
        <p className="text-gray-300 mb-4">
          Install the GhostFrame CLI globally to use it from anywhere:
        </p>
        <div className="bg-black rounded p-4 font-mono text-sm">
          npm install -g ghostframe-cli
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-3">Requirements</h3>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span>Node.js 16.0.0 or higher</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span>npm or yarn package manager</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span>Git (for version control)</span>
          </li>
        </ul>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-3">Verify Installation</h3>
        <p className="text-gray-300 mb-4">Check that the CLI is installed correctly:</p>
        <div className="bg-black rounded p-4 font-mono text-sm space-y-2">
          <div>ghostframe --version</div>
          <div className="text-gray-500"># Output: 1.0.0</div>
          <div className="mt-3">ghostframe --help</div>
          <div className="text-gray-500"># Shows available commands</div>
        </div>
      </div>
    </div>
  );
}


// Commands Section
function CommandsSection() {
  const commands = [
    {
      name: 'init',
      description: 'Initialize a new GhostFrame module',
      usage: 'ghostframe init [name]',
      options: [
        { flag: '-t, --template <type>', desc: 'Module template (education, creative, productivity, research)' },
        { flag: '-n, --name <name>', desc: 'Module name' },
        { flag: '--skip-install', desc: 'Skip npm install' }
      ],
      example: 'ghostframe init my-quiz-module --template education'
    },
    {
      name: 'dev',
      description: 'Start development server with live reload',
      usage: 'ghostframe dev',
      options: [
        { flag: '-p, --port <port>', desc: 'Port number (default: 3000)' },
        { flag: '--watch', desc: 'Enable file watching' }
      ],
      example: 'ghostframe dev --port 8080'
    },
    {
      name: 'validate',
      description: 'Run Kiro compliance validation',
      usage: 'ghostframe validate',
      options: [
        { flag: '-s, --strict', desc: 'Enable strict validation mode' },
        { flag: '--performance', desc: 'Include performance benchmarks' },
        { flag: '--security', desc: 'Include security scanning' }
      ],
      example: 'ghostframe validate --strict --security'
    },
    {
      name: 'test',
      description: 'Run module tests',
      usage: 'ghostframe test',
      options: [
        { flag: '--watch', desc: 'Run tests in watch mode' },
        { flag: '--coverage', desc: 'Generate coverage report' },
        { flag: '--verbose', desc: 'Verbose output' }
      ],
      example: 'ghostframe test --coverage'
    },
    {
      name: 'publish',
      description: 'Publish module to GhostFrame Registry',
      usage: 'ghostframe publish',
      options: [
        { flag: '--dry-run', desc: 'Simulate publish without actually publishing' },
        { flag: '--tag <tag>', desc: 'Publish with specific tag (default: latest)' }
      ],
      example: 'ghostframe publish --dry-run'
    },
    {
      name: 'login',
      description: 'Authenticate with GhostFrame',
      usage: 'ghostframe login',
      options: [
        { flag: '--api-key <key>', desc: 'Use API key for authentication' }
      ],
      example: 'ghostframe login'
    },
    {
      name: 'info',
      description: 'Show module analytics and status',
      usage: 'ghostframe info',
      options: [
        { flag: '--analytics', desc: 'Show detailed analytics' },
        { flag: '--validation', desc: 'Show validation status' }
      ],
      example: 'ghostframe info --analytics'
    },
    {
      name: 'build',
      description: 'Build module for production',
      usage: 'ghostframe build',
      options: [
        { flag: '--minify', desc: 'Minify output' },
        { flag: '--source-maps', desc: 'Generate source maps' }
      ],
      example: 'ghostframe build --minify'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-4">CLI Commands</h2>
      <p className="text-gray-300 mb-6">
        Complete reference for all GhostFrame CLI commands
      </p>

      {commands.map((cmd, idx) => (
        <div key={idx} className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-semibold text-orange-400">
                ghostframe {cmd.name}
              </h3>
              <p className="text-gray-300 mt-1">{cmd.description}</p>
            </div>
            <Terminal className="w-6 h-6 text-purple-400 flex-shrink-0" />
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-2">Usage</h4>
              <div className="bg-black rounded p-3 font-mono text-sm text-green-400">
                {cmd.usage}
              </div>
            </div>

            {cmd.options.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-2">Options</h4>
                <div className="space-y-2">
                  {cmd.options.map((opt, i) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <code className="text-purple-400 font-mono">{opt.flag}</code>
                      <span className="text-gray-300">{opt.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-2">Example</h4>
              <div className="bg-black rounded p-3 font-mono text-sm text-blue-400">
                {cmd.example}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


// Workflow Section
function WorkflowSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-4">Development Workflow</h2>
      <p className="text-gray-300 mb-6">
        Complete workflow from module creation to publishing
      </p>

      <div className="space-y-4">
        {/* Step 1 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="bg-purple-600 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">
              1
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">Initialize Module</h3>
              <p className="text-gray-300 mb-3">
                Create a new module from a template
              </p>
              <div className="bg-black rounded p-3 font-mono text-sm">
                ghostframe init my-module --template education
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="bg-purple-600 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">
              2
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">Authenticate</h3>
              <p className="text-gray-300 mb-3">
                Login to GhostFrame Registry
              </p>
              <div className="bg-black rounded p-3 font-mono text-sm">
                ghostframe login
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="bg-purple-600 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">
              3
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">Develop & Test</h3>
              <p className="text-gray-300 mb-3">
                Start development server and run tests
              </p>
              <div className="bg-black rounded p-3 font-mono text-sm space-y-2">
                <div>cd my-module</div>
                <div>ghostframe dev</div>
                <div className="text-gray-500"># In another terminal:</div>
                <div>ghostframe test --coverage</div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="bg-purple-600 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">
              4
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">Validate</h3>
              <p className="text-gray-300 mb-3">
                Run Kiro compliance validation
              </p>
              <div className="bg-black rounded p-3 font-mono text-sm">
                ghostframe validate --strict --security
              </div>
            </div>
          </div>
        </div>

        {/* Step 5 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="bg-purple-600 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">
              5
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">Publish</h3>
              <p className="text-gray-300 mb-3">
                Publish to GhostFrame Registry
              </p>
              <div className="bg-black rounded p-3 font-mono text-sm space-y-2">
                <div>ghostframe publish --dry-run</div>
                <div className="text-gray-500"># If dry-run succeeds:</div>
                <div>ghostframe publish</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// Examples Section
function ExamplesSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-4">Real-World Examples</h2>

      {/* Example 1: Education Module */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-3 text-orange-400">
          Creating an Education Module
        </h3>
        <div className="bg-black rounded p-4 font-mono text-sm space-y-2">
          <div className="text-green-400"># Initialize education module</div>
          <div>ghostframe init quiz-master --template education</div>
          <div>cd quiz-master</div>
          <div className="mt-3 text-green-400"># Start development</div>
          <div>ghostframe dev --port 3000</div>
          <div className="mt-3 text-green-400"># Run tests</div>
          <div>ghostframe test --watch</div>
          <div className="mt-3 text-green-400"># Validate and publish</div>
          <div>ghostframe validate --strict</div>
          <div>ghostframe publish</div>
        </div>
      </div>

      {/* Example 2: Creative Module */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-3 text-orange-400">
          Creating a Creative Module
        </h3>
        <div className="bg-black rounded p-4 font-mono text-sm space-y-2">
          <div className="text-green-400"># Initialize creative module</div>
          <div>ghostframe init story-weaver --template creative</div>
          <div>cd story-weaver</div>
          <div className="mt-3 text-green-400"># Build and test</div>
          <div>ghostframe build --minify</div>
          <div>ghostframe test --coverage</div>
          <div className="mt-3 text-green-400"># Check module info</div>
          <div>ghostframe info --analytics</div>
        </div>
      </div>

      {/* Example 3: CI/CD Integration */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-3 text-orange-400">
          CI/CD Integration
        </h3>
        <p className="text-gray-300 mb-3">
          Example GitHub Actions workflow for automated testing and publishing:
        </p>
        <div className="bg-black rounded p-4 font-mono text-sm space-y-2">
          <div className="text-purple-400">name: GhostFrame CI/CD</div>
          <div className="text-purple-400">on: [push, pull_request]</div>
          <div className="mt-2">jobs:</div>
          <div>  test:</div>
          <div>    runs-on: ubuntu-latest</div>
          <div>    steps:</div>
          <div>      - uses: actions/checkout@v2</div>
          <div>      - run: npm install -g ghostframe-cli</div>
          <div>      - run: npm install</div>
          <div>      - run: ghostframe test --coverage</div>
          <div>      - run: ghostframe validate --strict</div>
          <div className="mt-2">  publish:</div>
          <div>    needs: test</div>
          <div>    if: github.ref == 'refs/heads/main'</div>
          <div>    runs-on: ubuntu-latest</div>
          <div>    steps:</div>
          <div>      - uses: actions/checkout@v2</div>
          <div>      - run: npm install -g ghostframe-cli</div>
          <div>      - run: ghostframe login --api-key $&#123;&#123; secrets.GF_API_KEY &#125;&#125;</div>
          <div>      - run: ghostframe publish</div>
        </div>
      </div>

      {/* Configuration Example */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-3 text-orange-400">
          CLI Configuration
        </h3>
        <p className="text-gray-300 mb-3">
          Configure CLI settings in ~/.ghostframe/config.json:
        </p>
        <div className="bg-black rounded p-4 font-mono text-sm">
          <div>&#123;</div>
          <div>  "apiUrl": "https://api.ghostframe.dev",</div>
          <div>  "registryUrl": "https://registry.ghostframe.dev",</div>
          <div>  "defaultTemplate": "education",</div>
          <div>  "autoValidate": true,</div>
          <div>  "colorOutput": true</div>
          <div>&#125;</div>
        </div>
      </div>

      {/* Tips & Best Practices */}
      <div className="bg-gradient-to-r from-purple-900 to-orange-900 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-6 h-6" />
          Tips & Best Practices
        </h3>
        <ul className="space-y-3 text-gray-200">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Always run validation before publishing</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Use --dry-run to test publish without actually publishing</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Keep your modules under 100KB for optimal performance</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Write comprehensive tests with at least 80% coverage</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Use semantic versioning for module versions</span>
          </li>
          <li className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <span>Never commit API keys or tokens to version control</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
