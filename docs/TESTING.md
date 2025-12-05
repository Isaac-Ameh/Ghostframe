# 🧪 GhostFrame Framework Testing Guide

This document outlines the comprehensive testing strategy for the GhostFrame framework, covering unit tests, integration tests, and performance testing for both the core framework and demo applications.

## 🎯 Testing Overview

GhostFrame uses a multi-layered testing approach to ensure framework reliability, extensibility, and demo application quality:

- **Framework Unit Tests** - Test core framework components and utilities
- **Demo Application Tests** - Test educational domain demo implementations
- **Integration Tests** - Test complete workflows and cross-domain compatibility
- **Performance Tests** - Ensure framework scalability and demo responsiveness
- **Extensibility Tests** - Verify framework can be extended to new domains
- **Type Safety** - TypeScript compilation and framework type definitions
- **Code Quality** - ESLint and Prettier for consistent framework standards

## 🏗️ Test Structure

```
ghostframe/
├── backend/
│   ├── src/__tests__/
│   │   ├── controllers/          # Framework controller tests + demo logic tests
│   │   ├── routes/              # API endpoint tests for framework and demos
│   │   ├── integration/         # End-to-end framework workflow tests
│   │   ├── performance/         # Framework scalability and demo performance tests
│   │   └── setup.ts            # Test configuration for framework testing
│   ├── jest.config.js          # Jest configuration for framework testing
│   └── package.json            # Framework and demo test scripts
├── frontend/
│   ├── __tests__/
│   │   ├── components/         # Framework component tests + demo component tests
│   │   ├── lib/               # Utility function tests
│   │   └── integration/       # User workflow tests
│   ├── jest.config.js         # Jest configuration
│   ├── jest.setup.js          # Test setup and mocks
│   └── package.json           # Test scripts
└── scripts/
    ├── test-all.sh           # Unix test runner
    └── test-all.bat          # Windows test runner
```

## 🚀 Running Tests

### Quick Start

Run all tests across the entire project:

```bash
# Unix/Linux/macOS
./scripts/test-all.sh

# Windows
scripts\test-all.bat
```

### Individual Test Suites

#### Backend Tests

```bash
cd backend

# All backend tests
npm test

# Unit tests only
npm test -- --testPathPattern="controllers|routes"

# Integration tests
npm test -- --testPathPattern=integration

# Performance tests
npm test -- --testPathPattern=performance

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage
```

#### Frontend Tests

```bash
cd frontend

# All frontend tests
npm test

# Unit tests only
npm test -- --testPathPattern=components

# Integration tests
npm test -- --testPathPattern=integration

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage
```

### Type Checking

```bash
# Backend
cd backend && npm run type-check

# Frontend
cd frontend && npm run type-check
```

### Code Quality

```bash
# Backend linting
cd backend && npm run lint

# Frontend linting
cd frontend && npm run lint
```

## 🧪 Test Categories

### Unit Tests

**Backend Unit Tests** (`backend/src/__tests__/controllers/`)
- `contentProcessor.test.ts` - Content analysis and processing
- `quizGenerator.test.ts` - Quiz generation logic
- `storyGenerator.test.ts` - Story creation algorithms
- `flashcardGenerator.test.ts` - Flashcard extraction

**Frontend Unit Tests** (`frontend/__tests__/components/`)
- `AppLayout.test.tsx` - Layout component functionality
- `GhostNavigation.test.tsx` - Navigation behavior
- `SpookyLoader.test.tsx` - Loading animations
- `api.test.ts` - API client functionality

### Integration Tests

**Backend Integration** (`backend/src/__tests__/integration/`)
- `fullWorkflow.test.ts` - Complete upload → generate → retrieve workflows
- Tests all three AI modules (Quiz, Story, Flashcards)
- Error handling across modules
- Data consistency validation
- Concurrent request handling

**Frontend Integration** (`frontend/__tests__/integration/`)
- `userWorkflows.test.tsx` - User interaction flows
- Form validation and submission
- Component state management
- Error handling and loading states

### Performance Tests

**Load Testing** (`backend/src/__tests__/performance/`)
- `loadTesting.test.ts` - Response time benchmarks
- File processing performance (small, medium, large files)
- Quiz generation speed (3, 10, 20 questions)
- Concurrent request handling (5-10 simultaneous requests)
- Memory usage monitoring

**Performance Benchmarks:**
- Small file processing: < 1 second
- Medium file processing: < 2 seconds  
- Large file processing: < 5 seconds
- Quiz generation (5 questions): < 2 seconds
- Quiz generation (20 questions): < 10 seconds
- Concurrent requests (5x): < 10 seconds total

### API Tests

**Route Testing** (`backend/src/__tests__/routes/`)
- `upload.test.ts` - File upload and processing endpoints
- `quiz.test.ts` - Quiz generation and retrieval
- `story.test.ts` - Story creation endpoints
- `flashcards.test.ts` - Flashcard generation

**Test Coverage:**
- ✅ POST /api/upload - File upload and processing
- ✅ GET /api/upload - List processed content
- ✅ GET /api/upload/:id - Retrieve specific content
- ✅ POST /api/quiz/generate - Generate quiz
- ✅ GET /api/quiz/:id - Retrieve quiz
- ✅ POST /api/quiz/:id/submit - Submit answers
- ✅ POST /api/story/generate - Generate story
- ✅ POST /api/flashcards/generate - Generate flashcards
- ✅ POST /api/flashcards/:id/review - Update review status

## 🎭 Test Data and Mocks

### Mock Data

**Content Samples:**
```typescript
const mockContent = {
  contentId: 'test-content-1',
  originalFilename: 'test.txt',
  processedText: 'Machine learning is a subset of artificial intelligence...',
  keyTopics: ['Machine Learning', 'AI', 'Technology'],
  wordCount: 100,
  metadata: {
    title: 'ML Basics',
    subject: 'Computer Science',
    difficulty: 'intermediate'
  }
}
```

**API Mocks:**
- Framer Motion animations
- Next.js navigation
- File upload simulation
- API response mocking

### Test Utilities

**Custom Matchers:**
- Response time validation
- Content structure validation
- Error message verification

**Helper Functions:**
- Mock file creation
- API response builders
- Test data generators

## 📊 Coverage Requirements

### Minimum Coverage Targets

- **Backend Controllers**: 80% line coverage
- **Frontend Components**: 75% line coverage
- **API Routes**: 90% line coverage
- **Critical Paths**: 95% coverage (upload, generation workflows)

### Coverage Reports

Generate detailed coverage reports:

```bash
# Backend coverage
cd backend && npm run test:coverage

# Frontend coverage  
cd frontend && npm run test:coverage
```

Reports are generated in:
- `backend/coverage/` - Backend coverage HTML report
- `frontend/coverage/` - Frontend coverage HTML report

## 🐛 Debugging Tests

### Common Issues

**Backend Test Failures:**
```bash
# Clear Jest cache
npx jest --clearCache

# Run specific test file
npm test -- contentProcessor.test.ts

# Debug mode
npm test -- --detectOpenHandles --forceExit
```

**Frontend Test Failures:**
```bash
# Clear Next.js cache
rm -rf .next

# Run specific test
npm test -- AppLayout.test.tsx

# Debug React Testing Library
npm test -- --verbose
```

### Test Environment

**Environment Variables:**
```bash
# Backend testing
NODE_ENV=test
PORT=3001

# Frontend testing  
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Database/Storage:**
- Tests use in-memory storage
- No persistent data between test runs
- Automatic cleanup after each test

## 🚀 Continuous Integration

### GitHub Actions (Future)

```yaml
name: GhostFrame Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: ./scripts/test-all.sh
```

### Pre-commit Hooks

```bash
# Install Husky (already configured)
npm install

# Pre-commit will run:
# - TypeScript compilation
# - ESLint checks
# - Unit tests for changed files
```

## 📈 Performance Monitoring

### Benchmarks

**Content Processing:**
- Text files (1KB): ~100ms
- PDF files (1MB): ~500ms
- Large documents (10MB): ~2s

**AI Generation:**
- Quiz (5 questions): ~1s
- Story (500 words): ~2s
- Flashcards (10 cards): ~800ms

### Memory Usage

- Baseline memory: ~50MB
- Peak processing: ~150MB
- Memory leaks: < 10MB increase per 100 operations

## 🎃 Hackathon Testing Strategy

### Pre-Demo Checklist

- [ ] All unit tests passing
- [ ] Integration workflows functional
- [ ] Performance benchmarks met
- [ ] Error handling graceful
- [ ] UI components responsive
- [ ] API endpoints stable

### Demo Scenarios

1. **Happy Path**: Upload → Generate Quiz → Take Quiz → View Results
2. **Story Flow**: Upload → Generate Story → Read Story
3. **Flashcard Flow**: Upload → Generate Cards → Study Session
4. **Error Handling**: Invalid files, network errors, edge cases

### Quick Validation

```bash
# 30-second health check
./scripts/test-all.sh --quick

# Smoke tests only
npm test -- --testNamePattern="should.*successfully"
```

## 🤝 Contributing Tests

### Writing New Tests

1. **Follow naming conventions**: `ComponentName.test.tsx`
2. **Use descriptive test names**: `should generate quiz with correct question count`
3. **Test both success and error cases**
4. **Mock external dependencies**
5. **Keep tests focused and isolated**

### Test Review Checklist

- [ ] Tests cover happy path and edge cases
- [ ] Proper mocking of dependencies
- [ ] Assertions are specific and meaningful
- [ ] Tests are fast and reliable
- [ ] Documentation updated if needed

---

**Ready to test the spirits?** 👻🧪

*Run `./scripts/test-all.sh` to ensure GhostFrame is ready for the hackathon!*