# 🎃 Quiz Ghost Module Documentation

## Overview

Quiz Ghost is a reference implementation of an educational AI module built with the GhostFrame framework. It demonstrates how to create intelligent content processing modules that generate interactive educational content from uploaded materials.

## Features

- **AI-Powered Quiz Generation**: Automatically creates multiple-choice, true/false, and short-answer questions from uploaded content
- **Interactive Quiz Interface**: Engaging user interface with real-time feedback and scoring
- **Educational Domain Optimization**: Specialized for educational content with appropriate difficulty scaling
- **Spooky Theming**: Halloween-inspired design that makes learning fun and memorable
- **Kiro Integration**: Full compatibility with Kiro agent workflows and automation

## Architecture

### Backend Components

```
quiz-ghost/
├── controllers/
│   └── quizGenerator.ts      # Main quiz generation logic
├── services/
│   ├── ContentProcessor.ts   # Content analysis and preprocessing
│   └── QuizAI.ts            # AI-powered question generation
├── types/
│   └── quiz.ts              # TypeScript interfaces and types
└── tests/
    └── quizGenerator.test.ts # Unit tests
```

### Frontend Components

```
components/QuizGhost/
├── QuizGenerator.tsx         # Quiz creation interface
├── QuizInterface.tsx         # Interactive quiz display
├── QuestionCard.tsx          # Individual question component
└── ScoreDisplay.tsx          # Results and scoring
```

## API Reference

### Generate Quiz

**Endpoint:** `POST /api/quiz/generate`

**Request Body:**
```typescript
interface QuizGenerationRequest {
  content: string;
  options: {
    questionCount: number;
    difficulty: 'easy' | 'medium' | 'hard';
    questionTypes: ('multiple_choice' | 'true_false' | 'short_answer')[];
    subject?: string;
    gradeLevel?: string;
  };
}
```

**Response:**
```typescript
interface QuizGenerationResponse {
  quiz: {
    id: string;
    title: string;
    description: string;
    questions: Question[];
    metadata: {
      difficulty: string;
      estimatedTime: number;
      subject: string;
      createdAt: string;
    };
  };
  analytics: {
    processingTime: number;
    contentAnalysis: {
      wordCount: number;
      readabilityScore: number;
      topicCoverage: string[];
    };
  };
}
```

### Question Types

#### Multiple Choice Question
```typescript
interface MultipleChoiceQuestion {
  id: string;
  type: 'multiple_choice';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: number;
  points: number;
}
```

#### True/False Question
```typescript
interface TrueFalseQuestion {
  id: string;
  type: 'true_false';
  question: string;
  correctAnswer: boolean;
  explanation: string;
  difficulty: number;
  points: number;
}
```

#### Short Answer Question
```typescript
interface ShortAnswerQuestion {
  id: string;
  type: 'short_answer';
  question: string;
  acceptedAnswers: string[];
  explanation: string;
  difficulty: number;
  points: number;
}
```

## Usage Examples

### Basic Quiz Generation

```typescript
import { QuizGenerator } from './services/QuizGenerator';

const generator = new QuizGenerator();

// Generate a quiz from text content
const quiz = await generator.generateQuiz({
  content: "The water cycle is the continuous movement of water...",
  options: {
    questionCount: 10,
    difficulty: 'medium',
    questionTypes: ['multiple_choice', 'true_false'],
    subject: 'Science',
    gradeLevel: '6th'
  }
});

console.log(`Generated ${quiz.questions.length} questions`);
```

### Frontend Integration

```tsx
import { QuizGenerator } from '@/components/QuizGhost/QuizGenerator';
import { QuizInterface } from '@/components/QuizGhost/QuizInterface';

export default function QuizPage() {
  const [quiz, setQuiz] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateQuiz = async (content: string, options: QuizOptions) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, options })
      });
      const result = await response.json();
      setQuiz(result.quiz);
    } catch (error) {
      console.error('Quiz generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      {!quiz ? (
        <QuizGenerator 
          onGenerate={handleGenerateQuiz}
          isLoading={isGenerating}
        />
      ) : (
        <QuizInterface 
          quiz={quiz}
          onComplete={(results) => console.log('Quiz completed:', results)}
        />
      )}
    </div>
  );
}
```

## Kiro Integration

### Specifications

Quiz Ghost includes comprehensive Kiro specifications:

- **Requirements**: EARS-compliant user stories and acceptance criteria
- **Design**: Detailed architecture and component specifications  
- **Tasks**: Implementation roadmap with clear deliverables

### Hooks

The module includes several automation hooks:

#### Content Processing Hook
```yaml
name: Quiz Ghost Content Processing
trigger: content.uploaded
conditions:
  - field: data.contentType
    operator: equals
    value: educational
actions:
  - type: process_content
    target: quiz-generator
    parameters:
      autoGenerate: true
      questionCount: 10
```

#### Quality Assurance Hook
```yaml
name: Quiz Quality Validation
trigger: quiz.generated
actions:
  - type: validate_quality
    target: quiz-validator
    parameters:
      minAccuracy: 0.85
      checkBias: true
```

### Steering Rules

Quiz Ghost follows educational domain steering guidelines:

```yaml
behavior_rules:
  question_generation:
    - rule: educational_value
      condition: output.educational_score < 0.8
      action: regenerate_with_focus
      priority: high
    
    - rule: age_appropriateness
      condition: !age_appropriate(output, target_grade)
      action: adjust_complexity
      priority: critical

quality_standards:
  - Generated questions must be educationally valuable and age-appropriate
  - Questions should be clear, unambiguous, and properly formatted
  - Difficulty levels should align with specified grade levels
  - Content should promote critical thinking and knowledge retention
```

## Development Guide

### Setting Up Development Environment

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/ghostframe.git
   cd ghostframe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp backend/.env.example backend/.env
   # Configure your AI service API keys
   ```

4. **Start development servers**
   ```bash
   # Backend
   cd backend && npm run dev
   
   # Frontend (in another terminal)
   cd frontend && npm run dev
   ```

### Creating Custom Question Types

To add a new question type, follow these steps:

1. **Define the interface**
   ```typescript
   // backend/src/types/quiz.ts
   interface CustomQuestion extends BaseQuestion {
     type: 'custom_type';
     customField: string;
     // Add your custom fields
   }
   ```

2. **Implement the generator**
   ```typescript
   // backend/src/services/QuizAI.ts
   async generateCustomQuestion(content: string): Promise<CustomQuestion> {
     // Your generation logic here
     return {
       id: generateId(),
       type: 'custom_type',
       question: 'Generated question...',
       customField: 'Custom value',
       // ... other fields
     };
   }
   ```

3. **Add frontend component**
   ```tsx
   // frontend/components/QuizGhost/CustomQuestionCard.tsx
   export function CustomQuestionCard({ question, onAnswer }: Props) {
     return (
       <div className="question-card">
         <h3>{question.question}</h3>
         {/* Your custom UI here */}
       </div>
     );
   }
   ```

### Testing

Run the test suite to ensure everything works correctly:

```bash
# Backend tests
cd backend && npm test

# Frontend tests  
cd frontend && npm test

# Integration tests
npm run test:integration
```

## Performance Optimization

### Content Processing

- **Chunking**: Large documents are automatically chunked for optimal processing
- **Caching**: Generated questions are cached to avoid regeneration
- **Batch Processing**: Multiple content pieces can be processed simultaneously

### AI Optimization

- **Model Selection**: Different AI models for different question types
- **Prompt Engineering**: Optimized prompts for educational content
- **Quality Filtering**: Automatic filtering of low-quality questions

### Frontend Performance

- **Lazy Loading**: Components are loaded on demand
- **Virtual Scrolling**: Efficient rendering of large question lists
- **State Management**: Optimized state updates for smooth interactions

## Troubleshooting

### Common Issues

#### Quiz Generation Fails
```
Error: Failed to generate quiz from content
```
**Solution**: Check that your content is substantial enough (minimum 100 words) and in a supported format.

#### Low Quality Questions
```
Warning: Generated questions below quality threshold
```
**Solution**: Ensure your source content is well-structured and educational. Consider preprocessing the content to improve clarity.

#### Slow Performance
```
Warning: Quiz generation taking longer than expected
```
**Solution**: Check your AI service API limits and consider upgrading your plan. Large documents may need to be split into smaller chunks.

### Debug Mode

Enable debug mode for detailed logging:

```bash
DEBUG=quiz-ghost:* npm run dev
```

### Support

For additional support:

- Check the [GitHub Issues](https://github.com/your-org/ghostframe/issues)
- Join our [Discord Community](https://discord.gg/ghostframe)
- Read the [Framework Documentation](/docs/framework)

## Contributing

We welcome contributions to Quiz Ghost! Please see our [Contributing Guide](../CONTRIBUTING.md) for details on:

- Code style and standards
- Testing requirements
- Pull request process
- Issue reporting

## License

Quiz Ghost is part of the GhostFrame project and is licensed under the MIT License. See [LICENSE](../LICENSE) for details.

---

*Built with 🎃 by the GhostFrame community*