# 🎃 Quiz Ghost

AI-powered quiz generation from any content with adaptive difficulty.

## Features

- **Multiple Question Types**: Multiple choice, true/false, short answer
- **Adaptive Difficulty**: Automatically adjusts to content complexity
- **Topic Extraction**: Identifies key concepts automatically
- **Customizable**: Configure question count, types, and difficulty
- **Fast Processing**: Generates quizzes in seconds

## Installation

```bash
ghostframe registry install quiz-ghost
```

## Usage

```typescript
import QuizGhostModule from '@ghostframe/quiz-ghost';

const quizGhost = new QuizGhostModule({
  aiProvider: 'openai',
  maxQuestions: 20,
  defaultDifficulty: 'medium'
});

const result = await quizGhost.execute({
  content: 'Your educational content here...',
  options: {
    questionCount: 10,
    difficulty: 'medium',
    questionTypes: ['multiple-choice', 'true-false'],
    title: 'My Quiz'
  }
});

console.log(result.quiz);
```

## Configuration

```typescript
interface QuizConfig {
  aiProvider?: 'openai' | 'anthropic' | 'mock';
  apiKey?: string;
  maxQuestions?: number;
  defaultDifficulty?: 'easy' | 'medium' | 'hard';
}
```

## Question Types

### Multiple Choice
4 options with one correct answer and explanation.

### True/False
Binary choice with detailed explanation.

### Short Answer
Open-ended questions for deeper understanding.

## API

### `execute(input: QuizInput): Promise<QuizOutput>`

Main method to generate quiz from content.

### `validateInput(input: QuizInput): boolean`

Validates input before processing.

### `getInfo()`

Returns module information and capabilities.

## Examples

### Basic Quiz
```typescript
const result = await quizGhost.execute({
  content: 'The Earth orbits the Sun...',
  options: { questionCount: 5 }
});
```

### Advanced Quiz
```typescript
const result = await quizGhost.execute({
  content: fileContent,
  options: {
    questionCount: 15,
    difficulty: 'hard',
    questionTypes: ['multiple-choice', 'short-answer'],
    title: 'Advanced Physics Quiz'
  }
});
```

## License

MIT
