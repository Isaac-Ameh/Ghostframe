'use client';

// 🎃 GhostFrame Marketplace Documentation
// Guide for publishing and discovering modules

import Link from 'next/link';

export default function MarketplaceDocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <Link href="/docs" className="text-purple-400 hover:text-purple-300 mb-4 inline-block">
            ← Back to Docs
          </Link>
          <h1 className="text-5xl font-bold text-white mb-4">
            📦 Marketplace Guide
          </h1>
          <p className="text-xl text-gray-300">
            Learn how to publish, discover, and install modules from the GhostFrame Marketplace
          </p>
        </div>

        <div className="space-y-12">
          {/* Overview */}
          <section className="bg-gray-800 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Overview</h2>
            <p className="text-gray-300 mb-4">
              The GhostFrame Marketplace is a public platform where developers can share their AI modules
              with the community. Users can discover, install, and review modules built by others.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-2xl mb-2">🔍</div>
                <h3 className="font-bold text-white mb-2">Discover</h3>
                <p className="text-sm text-gray-300">Browse and search thousands of modules</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-2xl mb-2">⬇️</div>
                <h3 className="font-bold text-white mb-2">Install</h3>
                <p className="text-sm text-gray-300">One-click installation with dependencies</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-2xl mb-2">⭐</div>
                <h3 className="font-bold text-white mb-2">Review</h3>
                <p className="text-sm text-gray-300">Rate and review modules you've used</p>
              </div>
            </div>
          </section>

          {/* Publishing */}
          <section className="bg-gray-800 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Publishing Your Module</h2>
            
            <h3 className="text-xl font-bold text-white mb-3 mt-6">1. Prepare Your Module</h3>
            <div className="bg-gray-900 p-4 rounded-lg mb-4">
              <pre className="text-gray-300 text-sm overflow-x-auto">
{`# Ensure your module is complete
ghostframe validate ./my-module

# Test your module locally
ghostframe test ./my-module`}
              </pre>
            </div>

            <h3 className="text-xl font-bold text-white mb-3 mt-6">2. Add Marketplace Metadata</h3>
            <p className="text-gray-300 mb-4">
              Your module needs additional metadata for the marketplace:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>Tags (for discoverability)</li>
              <li>Categories (education, productivity, etc.)</li>
              <li>License type (MIT, Apache, etc.)</li>
              <li>README with usage instructions</li>
              <li>Changelog documenting versions</li>
            </ul>

            <h3 className="text-xl font-bold text-white mb-3 mt-6">3. Publish to Marketplace</h3>
            <div className="bg-gray-900 p-4 rounded-lg mb-4">
              <pre className="text-gray-300 text-sm overflow-x-auto">
{`# Via CLI
ghostframe marketplace publish ./my-module

# Or via web interface
# Visit: /marketplace/submit`}
              </pre>
            </div>

            <h3 className="text-xl font-bold text-white mb-3 mt-6">4. Moderation Review</h3>
            <p className="text-gray-300 mb-4">
              Your module will go through automated checks:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>✅ Security scan for vulnerabilities</li>
              <li>✅ Quality check for code standards</li>
              <li>✅ Documentation completeness</li>
              <li>✅ Kiro compliance verification</li>
              <li>✅ License validation</li>
            </ul>
          </section>

          {/* Installing */}
          <section className="bg-gray-800 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Installing Modules</h2>
            
            <h3 className="text-xl font-bold text-white mb-3">Via Web Interface</h3>
            <p className="text-gray-300 mb-4">
              1. Browse the marketplace at <Link href="/marketplace" className="text-purple-400 hover:text-purple-300">/marketplace</Link>
              <br />
              2. Click on a module to view details
              <br />
              3. Click the "Install" button
              <br />
              4. Follow the installation instructions
            </p>

            <h3 className="text-xl font-bold text-white mb-3 mt-6">Via CLI</h3>
            <div className="bg-gray-900 p-4 rounded-lg mb-4">
              <pre className="text-gray-300 text-sm overflow-x-auto">
{`# Search for modules
ghostframe marketplace search "quiz"

# Install a module
ghostframe marketplace install quiz-ghost

# View installed modules
ghostframe modules list`}
              </pre>
            </div>
          </section>

          {/* Reviews */}
          <section className="bg-gray-800 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Reviews & Ratings</h2>
            <p className="text-gray-300 mb-4">
              Help the community by reviewing modules you've used:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Rate modules from 1-5 stars</li>
              <li>Write detailed reviews with pros/cons</li>
              <li>Mark helpful reviews from others</li>
              <li>Report inappropriate content</li>
            </ul>
            <div className="bg-purple-900/30 border border-purple-500 rounded-lg p-4 mt-4">
              <p className="text-purple-200 text-sm">
                💡 <strong>Tip:</strong> Verified reviews (from users who installed the module) are weighted higher in ratings.
              </p>
            </div>
          </section>

          {/* Best Practices */}
          <section className="bg-gray-800 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Best Practices</h2>
            
            <h3 className="text-xl font-bold text-white mb-3">For Publishers</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
              <li>Write comprehensive README with examples</li>
              <li>Include screenshots or demo videos</li>
              <li>Keep your module updated</li>
              <li>Respond to user reviews and issues</li>
              <li>Use semantic versioning</li>
              <li>Document breaking changes in changelog</li>
            </ul>

            <h3 className="text-xl font-bold text-white mb-3">For Users</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Check module ratings and reviews before installing</li>
              <li>Review compatibility with your framework version</li>
              <li>Test modules in development environment first</li>
              <li>Leave constructive feedback for authors</li>
              <li>Report security issues responsibly</li>
            </ul>
          </section>

          {/* Support */}
          <section className="bg-gray-800 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Support & Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/docs/cli" className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors">
                <h3 className="font-bold text-white mb-2">📘 CLI Documentation</h3>
                <p className="text-sm text-gray-300">Learn all CLI commands</p>
              </Link>
              <Link href="/community" className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors">
                <h3 className="font-bold text-white mb-2">💬 Community</h3>
                <p className="text-sm text-gray-300">Get help from the community</p>
              </Link>
              <Link href="/docs/framework" className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors">
                <h3 className="font-bold text-white mb-2">🏗️ Framework Guide</h3>
                <p className="text-sm text-gray-300">Understand the framework</p>
              </Link>
              <Link href="/marketplace" className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors">
                <h3 className="font-bold text-white mb-2">🛒 Browse Marketplace</h3>
                <p className="text-sm text-gray-300">Explore available modules</p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
