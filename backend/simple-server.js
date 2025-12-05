// 🎃 GhostFrame Simple Server (No Dependencies)
// Minimal server to test authentication and marketplace

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3001;

// Simple in-memory data
const users = [
  { id: '1', email: 'demo@ghostframe.dev', username: 'demo', password: 'demo123', name: 'Demo User' }
];

const modules = [
  {
    id: 'quiz-ghost',
    name: 'Quiz Ghost',
    description: 'AI-powered quiz generation from any content with adaptive difficernecersn eaiteatak aajdsfj: '1.0.s0',asdhor: 'GhostFrame Team',
    a: ['education', 'quiz', 'ai'],
    downloads: 1247,
    rating: 4.8,
    reviews: 156,
    featured: true,
    trending: true
  },
  {
    id: 'story-spirit',
    name: 'Story Spirit',
    description: 'Transform any content into engaging stories with AI-powered narrative generation.',
    version: '1.0.0',
    author: 'GhostFrame Team',
    tags: ['creative', 'story', 'ai'],
    downloads: 892,
    rating: 4.6,
    reviews: 98,
    featured: true,
    trending: false
  }
];

// Simple CORS headers
function setCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Simple JSON response
function sendJSON(res, data, status = 200) {
  setCORSHeaders(res);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// Parse JSON body
function parseBody(req, callback) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      callback(null, JSON.parse(body));
    } catch (e) {
      callback(e, null);
    }
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  console.log(`${method} ${pathname}`);

  // Handle OPTIONS (CORS preflight)
  if (method === 'OPTIONS') {
    setCORSHeaders(res);
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check
  if (pathname === '/health') {
    sendJSON(res, { status: 'ok', message: 'GhostFrame backend is running!' });
    return;
  }

  // Login endpoint
  if (pathname === '/api/auth/login' && method === 'POST') {
    parseBody(req, (err, body) => {
      if (err) {
        sendJSON(res, { error: 'Invalid JSON' }, 400);
        return;
      }

      const { email, password } = body;
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        sendJSON(res, {
          success: true,
          user: { id: user.id, email: user.email, username: user.username, name: user.name },
          token: 'fake-jwt-token-' + user.id
        });
      } else {
        sendJSON(res, { error: 'Invalid credentials' }, 401);
      }
    });
    return;
  }

  // Register endpoint
  if (pathname === '/api/auth/register' && method === 'POST') {
    parseBody(req, (err, body) => {
      if (err) {
        sendJSON(res, { error: 'Invalid JSON' }, 400);
        return;
      }

      const { email, username, password, name } = body;
      
      // Check if user exists
      if (users.find(u => u.email === email)) {
        sendJSON(res, { error: 'User already exists' }, 400);
        return;
      }

      // Create new user
      const newUser = {
        id: String(users.length + 1),
        email,
        username,
        password,
        name
      };
      users.push(newUser);

      sendJSON(res, {
        success: true,
        user: { id: newUser.id, email: newUser.email, username: newUser.username, name: newUser.name },
        token: 'fake-jwt-token-' + newUser.id
      });
    });
    return;
  }

  // Get modules
  if (pathname === '/api/marketplace/modules' && method === 'GET') {
    const query = parsedUrl.query.query;
    let filteredModules = modules;

    if (query) {
      filteredModules = modules.filter(m => 
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.description.toLowerCase().includes(query.toLowerCase()) ||
        m.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    }

    sendJSON(res, {
      modules: filteredModules,
      total: filteredModules.length,
      page: 1,
      limit: 20
    });
    return;
  }

  // Get featured modules
  if (pathname === '/api/marketplace/featured' && method === 'GET') {
    sendJSON(res, {
      featured: modules.filter(m => m.featured),
      trending: modules.filter(m => m.trending)
    });
    return;
  }

  // Get single module
  if (pathname.startsWith('/api/marketplace/modules/') && method === 'GET') {
    const moduleId = pathname.split('/').pop();
    const module = modules.find(m => m.id === moduleId);

    if (module) {
      sendJSON(res, module);
    } else {
      sendJSON(res, { error: 'Module not found' }, 404);
    }
    return;
  }

  // AI Quiz generation (mock)
  if (pathname === '/api/ai/generate-quiz' && method === 'POST') {
    parseBody(req, (err, body) => {
      if (err) {
        sendJSON(res, { error: 'Invalid JSON' }, 400);
        return;
      }

      // Mock quiz response using Groq-style format
      const mockQuiz = {
        title: "Sample Quiz",
        description: "Generated from your content",
        questions: [
          {
            id: 1,
            type: "multiple-choice",
            question: "What is the main topic of the provided content?",
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: 0,
            explanation: "This is the correct answer based on the content analysis.",
            difficulty: "medium",
            topic: "general"
          },
          {
            id: 2,
            type: "true-false",
            question: "The content discusses advanced concepts.",
            options: ["True", "False"],
            correctAnswer: 0,
            explanation: "Based on the complexity analysis of the content.",
            difficulty: "easy",
            topic: "general"
          }
        ],
        metadata: {
          totalQuestions: 2,
          estimatedTime: "5 minutes",
          topics: ["general"]
        }
      };

      sendJSON(res, { success: true, data: mockQuiz, provider: 'groq-mock' });
    });
    return;
  }

  // Default 404
  sendJSON(res, { error: 'Not found' }, 404);
});

server.listen(PORT, () => {
  console.log('🎃 GhostFrame Simple Backend');
  console.log('============================');
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
  console.log(`✅ API endpoints ready`);
  console.log(`✅ CORS enabled for frontend`);
  console.log('');
  console.log('📋 Test endpoints:');
  console.log('  POST /api/auth/login');
  console.log('  POST /api/auth/register');
  console.log('  GET  /api/marketplace/modules');
  console.log('  GET  /api/marketplace/featured');
  console.log('  POST /api/ai/generate-quiz');
  console.log('');
  console.log('🎯 Ready for frontend connection!');
});