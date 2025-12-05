'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Home, Sparkles, Loader2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

interface Question {
  id: string;
  question: string;
  type: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
  difficulty: string;
}

interface QuizResult {
  metadata: {
    quizId: string;
    title: string;
    totalQuestions: number;
    difficulty: string;
    topics: string[];
  };
  questions: Question[];
}

interface SubmissionResult {
  score: {
    correct: number;
    total: number;
    percentage: number;
    points: number;
    maxPoints: number;
  };
  results: Array<{
    questionId: string;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
    points: number;
  }>;
}

export default function QuizGhostPage() {
  const [content, setContent] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<QuizResult | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<SubmissionResult | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!content.trim()) {
      setError('Please enter some content to generate a quiz from');
      return;
    }

    setLoading(true);
    setError('');
    setQuiz(null);
    setAnswers({});
    setSubmitted(false);
    setResults(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}/api/ai/generate-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          questionCount,
          difficulty,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setQuiz(data.data);
      } else {
        setError(data.error || 'Failed to generate quiz');
      }
    } catch (err) {
      setError('Failed to generate quiz. Please check that the backend is running and the Groq API key is configured.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!quiz) return;

    // Calculate results
    let correctAnswers = 0;
    let totalPoints = 0;

    const resultsList = quiz.questions.map(question => {
      const userAnswer = answers[question.id] || 'No answer';
      
      // Extract just the letter from the user's answer (e.g., "C) Machine Learning" -> "C")
      const userAnswerLetter = userAnswer.match(/^([A-D])\)/)?.[1] || userAnswer;
      
      // Extract just the letter from the correct answer if it includes the full text
      const correctAnswerLetter = question.correctAnswer.match(/^([A-D])\)/)?.[1] || question.correctAnswer;
      
      const isCorrect = userAnswerLetter === correctAnswerLetter;

      if (isCorrect) {
        correctAnswers++;
        totalPoints += question.points;
      }

      // Find the full text of the correct answer option
      const correctAnswerFull = question.options.find(opt => 
        opt.startsWith(correctAnswerLetter + ')')
      ) || question.correctAnswer;

      return {
        questionId: question.id,
        question: question.question,
        userAnswer,
        correctAnswer: correctAnswerFull,
        isCorrect,
        explanation: question.explanation,
        points: isCorrect ? question.points : 0
      };
    });

    const percentage = Math.round((correctAnswers / quiz.questions.length) * 100);
    const maxPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);

    setResults({
      score: {
        correct: correctAnswers,
        total: quiz.questions.length,
        percentage,
        points: totalPoints,
        maxPoints
      },
      results: resultsList
    });

    setSubmitted(true);
  };

  // Dynamic sample content - no hardcoded templates
  const sampleContent = `Artificial Intelligence (AI) is a branch of computer science that aims to create intelligent machines capable of performing tasks that typically require human intelligence. These tasks include learning, reasoning, problem-solving, perception, and language understanding. AI systems can be categorized into narrow AI, which is designed for specific tasks, and general AI, which would have human-like cognitive abilities across various domains. Machine learning, a subset of AI, enables systems to automatically learn and improve from experience without being explicitly programmed.`;

  return (
    <div className="py-20 px-4 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/">
            <button className="ghost-button inline-flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </button>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-8xl mb-6 floating-ghost"
          >
            🧠
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold text-ghost-white mb-4 creepster-heading">
            Quiz Ghost
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Generate intelligent quizzes from any content with AI
          </p>
        </motion.div>

        {!quiz && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="ghost-card p-6"
            >
              <h2 className="text-2xl font-bold text-ghost-white mb-4 flex items-center">
                <Sparkles className="h-6 w-6 text-pumpkin-orange mr-2" />
                Input Content
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Your Content</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste any educational content here - articles, notes, textbook excerpts, or any text you want to create a quiz from..."
                    className="w-full h-48 bg-gray-800 border border-gray-700 rounded-lg p-4 text-gray-200 focus:border-pumpkin-orange focus:outline-none resize-none"
                  />
                  <button
                    onClick={() => setContent(sampleContent)}
                    className="mt-2 text-sm text-spectral-green hover:text-spectral-green/80"
                  >
                    Use sample content
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Questions</label>
                    <select
                      value={questionCount}
                      onChange={(e) => setQuestionCount(Number(e.target.value))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-200 focus:border-pumpkin-orange focus:outline-none"
                    >
                      <option value={3}>3 Questions</option>
                      <option value={5}>5 Questions</option>
                      <option value={10}>10 Questions</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Difficulty</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-200 focus:border-pumpkin-orange focus:outline-none"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={loading || !content.trim()}
                  className="w-full ghost-button-primary flex items-center justify-center space-x-2 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Generating Quiz...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="h-5 w-5" />
                      <span>Generate Quiz</span>
                    </>
                  )}
                </button>

                {error && (
                  <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-300">
                    {error}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Preview Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="ghost-card p-6"
            >
              <h2 className="text-2xl font-bold text-ghost-white mb-4 flex items-center">
                <Brain className="h-6 w-6 text-spectral-green mr-2" />
                Quiz Preview
              </h2>

              {!loading && (
                <div className="text-center py-12 text-gray-400">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-6xl mb-4"
                  >
                    📝
                  </motion.div>
                  <p>Your quiz will appear here...</p>
                </div>
              )}

              {loading && (
                <div className="text-center py-12">
                  <Loader2 className="h-12 w-12 text-pumpkin-orange mx-auto mb-4 animate-spin" />
                  <p className="text-gray-300">The Quiz Ghost is crafting your questions...</p>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {quiz && !submitted && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="ghost-card p-8"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-ghost-white mb-2">{quiz.metadata.title}</h2>
              <div className="flex flex-wrap gap-2">
                <span className="text-sm bg-specter-purple/20 text-specter-purple px-3 py-1 rounded">
                  {quiz.metadata.totalQuestions} Questions
                </span>
                <span className="text-sm bg-pumpkin-orange/20 text-pumpkin-orange px-3 py-1 rounded">
                  {quiz.metadata.difficulty}
                </span>
              </div>
            </div>

            <div className="space-y-8">
              {quiz.questions.map((question, idx) => (
                <div key={question.id} className="bg-gray-800/50 rounded-lg p-6">
                  <div className="flex items-start mb-4">
                    <span className="bg-pumpkin-orange text-grave-black font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-ghost-white mb-4">{question.question}</h3>
                      <div className="space-y-2">
                        {question.options.map((option, optIdx) => (
                          <label
                            key={optIdx}
                            className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                              answers[question.id] === option
                                ? 'bg-pumpkin-orange/20 border-2 border-pumpkin-orange'
                                : 'bg-gray-700/50 border-2 border-transparent hover:bg-gray-700'
                            }`}
                          >
                            <input
                              type="radio"
                              name={question.id}
                              value={option}
                              checked={answers[question.id] === option}
                              onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                              className="mr-3"
                            />
                            <span className="text-gray-200">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length !== quiz.questions.length}
                className="flex-1 ghost-button-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Quiz
              </button>
              <button
                onClick={() => {
                  setQuiz(null);
                  setAnswers({});
                }}
                className="ghost-button py-4 px-8"
              >
                Start Over
              </button>
            </div>
          </motion.div>
        )}

        {submitted && results && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Score Card */}
            <div className="ghost-card p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="text-6xl mb-4"
              >
                {results.score.percentage >= 70 ? '🎉' : results.score.percentage >= 50 ? '👍' : '📚'}
              </motion.div>
              <h2 className="text-4xl font-bold text-ghost-white mb-2">
                {results.score.percentage}%
              </h2>
              <p className="text-xl text-gray-300 mb-4">
                {results.score.correct} out of {results.score.total} correct
              </p>
              <p className="text-lg text-pumpkin-orange">
                {results.score.points} / {results.score.maxPoints} points
              </p>
            </div>

            {/* Detailed Results */}
            <div className="ghost-card p-8">
              <h3 className="text-2xl font-bold text-ghost-white mb-6">Detailed Results</h3>
              <div className="space-y-6">
                {results.results.map((result, idx) => (
                  <div key={result.questionId} className="bg-gray-800/50 rounded-lg p-6">
                    <div className="flex items-start mb-4">
                      <span className="bg-pumpkin-orange text-grave-black font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-ghost-white mb-3">{result.question}</h4>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center">
                            {result.isCorrect ? (
                              <CheckCircle className="h-5 w-5 text-spectral-green mr-2" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500 mr-2" />
                            )}
                            <span className={result.isCorrect ? 'text-spectral-green' : 'text-red-400'}>
                              Your answer: {result.userAnswer}
                            </span>
                          </div>
                          {!result.isCorrect && (
                            <div className="flex items-center">
                              <CheckCircle className="h-5 w-5 text-spectral-green mr-2" />
                              <span className="text-spectral-green">
                                Correct answer: {result.correctAnswer}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="bg-gray-700/50 rounded-lg p-4">
                          <p className="text-sm text-gray-300">{result.explanation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setQuiz(null);
                  setAnswers({});
                  setSubmitted(false);
                  setResults(null);
                }}
                className="w-full ghost-button-primary py-4 mt-8"
              >
                Generate New Quiz
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
