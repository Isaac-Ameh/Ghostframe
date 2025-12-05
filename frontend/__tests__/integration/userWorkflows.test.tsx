import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QuizGenerator } from '@/components/QuizGhost/QuizGenerator'
import { StoryGenerator } from '@/components/StorySpirit/StoryGenerator'

// Mock API
const mockApi = {
  get: jest.fn(),
  post: jest.fn(),
}

jest.mock('@/lib/api', () => ({
  api: mockApi,
}))

describe('User Workflow Integration Tests', () => {
  const mockContent = [
    {
      contentId: 'test-content-1',
      originalFilename: 'test.txt',
      summary: 'Test content about machine learning',
      keyTopics: ['Machine Learning', 'AI', 'Technology'],
      wordCount: 100,
      metadata: {
        title: 'ML Basics',
        subject: 'Computer Science',
        difficulty: 'intermediate',
        tags: ['AI', 'ML'],
      },
      readabilityScore: {
        difficulty: 'intermediate',
        estimatedReadingTime: 2,
      },
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Quiz Generation Workflow', () => {
    it('should allow user to select content and generate quiz', async () => {
      const user = userEvent.setup()
      const mockOnGenerate = jest.fn()

      mockApi.post.mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            metadata: { quizId: 'quiz-123', totalQuestions: 5 },
            questions: Array(5).fill({
              id: 'q1',
              question: 'Test question?',
              options: ['A', 'B', 'C', 'D'],
              correctAnswer: 'A',
              explanation: 'Test explanation',
            }),
          },
        },
      })

      render(
        <QuizGenerator
          availableContent={mockContent}
          onGenerateQuiz={mockOnGenerate}
          isGenerating={false}
        />
      )

      // Select content
      const contentCard = screen.getByText('ML Basics')
      await user.click(contentCard)

      // Adjust settings
      const mediumDifficulty = screen.getByText('Medium')
      await user.click(mediumDifficulty)

      // Generate quiz
      const generateButton = screen.getByText('Generate Quiz')
      await user.click(generateButton)

      expect(mockOnGenerate).toHaveBeenCalledWith({
        contentId: 'test-content-1',
        questionCount: 5,
        difficulty: 'medium',
        questionTypes: ['multiple-choice'],
        focusTopics: undefined,
      })
    })

    it('should handle advanced options correctly', async () => {
      const user = userEvent.setup()
      const mockOnGenerate = jest.fn()

      render(
        <QuizGenerator
          availableContent={mockContent}
          onGenerateQuiz={mockOnGenerate}
          isGenerating={false}
        />
      )

      // Select content
      await user.click(screen.getByText('ML Basics'))

      // Show advanced options
      await user.click(screen.getByText('Show Advanced Options'))

      // Select multiple question types
      await user.click(screen.getByText('True/False'))
      await user.click(screen.getByText('Short Answer'))

      // Select focus topics
      await user.click(screen.getByText('Machine Learning'))
      await user.click(screen.getByText('AI'))

      // Generate quiz
      await user.click(screen.getByText('Generate Quiz'))

      expect(mockOnGenerate).toHaveBeenCalledWith(
        expect.objectContaining({
          questionTypes: expect.arrayContaining(['multiple-choice', 'true-false', 'short-answer']),
          focusTopics: expect.arrayContaining(['Machine Learning', 'AI']),
        })
      )
    })

    it('should show validation errors for invalid input', async () => {
      const user = userEvent.setup()
      const mockOnGenerate = jest.fn()

      render(
        <QuizGenerator
          availableContent={mockContent}
          onGenerateQuiz={mockOnGenerate}
          isGenerating={false}
        />
      )

      // Try to generate without selecting content
      const generateButton = screen.queryByText('Generate Quiz')
      expect(generateButton).not.toBeInTheDocument()

      // Select content but deselect all question types
      await user.click(screen.getByText('ML Basics'))
      await user.click(screen.getByText('Multiple Choice')) // Deselect

      // Should show validation message
      await waitFor(() => {
        expect(screen.getByText('Please select at least one question type')).toBeInTheDocument()
      })
    })
  })

  describe('Story Generation Workflow', () => {
    it('should allow user to customize story settings', async () => {
      const user = userEvent.setup()
      const mockOnGenerate = jest.fn()

      render(
        <StoryGenerator
          availableContent={mockContent}
          onGenerateStory={mockOnGenerate}
          isGenerating={false}
        />
      )

      // Select content
      await user.click(screen.getByText('ML Basics'))

      // Select theme
      await user.click(screen.getByText('Sci-Fi'))

      // Select audience
      await user.click(screen.getByText('Adults'))

      // Select length
      await user.click(screen.getByText('Long'))

      // Generate story
      await user.click(screen.getByText('Generate Story'))

      expect(mockOnGenerate).toHaveBeenCalledWith({
        contentId: 'test-content-1',
        theme: 'sci-fi',
        targetAudience: 'adults',
        length: 'long',
        customPrompt: undefined,
        includeCharacters: undefined,
        setting: undefined,
      })
    })

    it('should handle advanced story options', async () => {
      const user = userEvent.setup()
      const mockOnGenerate = jest.fn()

      render(
        <StoryGenerator
          availableContent={mockContent}
          onGenerateStory={mockOnGenerate}
          isGenerating={false}
        />
      )

      // Select content
      await user.click(screen.getByText('ML Basics'))

      // Show advanced options
      await user.click(screen.getByText('Show Advanced Options'))

      // Add custom prompt
      const promptInput = screen.getByPlaceholderText('Add specific instructions for your story...')
      await user.type(promptInput, 'Make it exciting and educational')

      // Add setting
      const settingInput = screen.getByPlaceholderText(/space station/i)
      await user.type(settingInput, 'A futuristic AI laboratory')

      // Add character
      const characterInput = screen.getByPlaceholderText('Add character name...')
      await user.type(characterInput, 'Dr. Sarah Chen')
      await user.click(screen.getByText('Add'))

      // Generate story
      await user.click(screen.getByText('Generate Story'))

      expect(mockOnGenerate).toHaveBeenCalledWith(
        expect.objectContaining({
          customPrompt: 'Make it exciting and educational',
          setting: 'A futuristic AI laboratory',
          includeCharacters: ['Dr. Sarah Chen'],
        })
      )
    })
  })

  describe('Error Handling Workflows', () => {
    it('should handle API errors gracefully', async () => {
      const user = userEvent.setup()
      const mockOnGenerate = jest.fn().mockRejectedValueOnce(new Error('API Error'))

      // Mock console.error to avoid noise in tests
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      render(
        <QuizGenerator
          availableContent={mockContent}
          onGenerateQuiz={mockOnGenerate}
          isGenerating={false}
        />
      )

      // Select content and generate
      await user.click(screen.getByText('ML Basics'))
      await user.click(screen.getByText('Generate Quiz'))

      // Should handle error gracefully
      await waitFor(() => {
        expect(mockOnGenerate).toHaveBeenCalled()
      })

      consoleSpy.mockRestore()
    })

    it('should show loading state during generation', () => {
      render(
        <QuizGenerator
          availableContent={mockContent}
          onGenerateQuiz={jest.fn()}
          isGenerating={true}
        />
      )

      expect(screen.getByText('The Quiz Ghost is conjuring your questions...')).toBeInTheDocument()
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('should handle empty content list', () => {
      render(
        <QuizGenerator
          availableContent={[]}
          onGenerateQuiz={jest.fn()}
          isGenerating={false}
        />
      )

      expect(screen.getByText('No content available for quiz generation')).toBeInTheDocument()
      expect(screen.getByText('Upload some learning materials first to create quizzes')).toBeInTheDocument()
    })
  })

  describe('Accessibility Workflows', () => {
    it('should be navigable with keyboard', async () => {
      const user = userEvent.setup()

      render(
        <QuizGenerator
          availableContent={mockContent}
          onGenerateQuiz={jest.fn()}
          isGenerating={false}
        />
      )

      // Should be able to navigate with Tab
      await user.tab()
      expect(document.activeElement).toBeInTheDocument()

      // Should be able to select content with Enter/Space
      const contentCard = screen.getByText('ML Basics')
      contentCard.focus()
      await user.keyboard('{Enter}')

      // Content should be selected
      expect(contentCard.closest('div')).toHaveClass('border-eerie-purple')
    })

    it('should have proper ARIA labels', () => {
      render(
        <QuizGenerator
          availableContent={mockContent}
          onGenerateQuiz={jest.fn()}
          isGenerating={false}
        />
      )

      // Check for proper labeling
      expect(screen.getByText('Select Content')).toBeInTheDocument()
      expect(screen.getByText('Quiz Settings')).toBeInTheDocument()

      // Form elements should have labels
      const difficultyButtons = screen.getAllByRole('button')
      expect(difficultyButtons.length).toBeGreaterThan(0)
    })
  })
})