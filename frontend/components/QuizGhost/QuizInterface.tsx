'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Brain, ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react';

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  points: number;
}

export interface QuizMetadata {
  quizId: string;
  title: string;
  description: string;
  totalQuestions: number;
  totalPoints: number;
  estimatedTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
}

export interface Quiz {
  metadata: QuizMetadata;
  questions: QuizQuestion[];
}

export interface QuizResults {
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
  completedAt: Date;
}

interface QuizInterfaceProps {
  quiz: Quiz;
  onComplete: (results: QuizResults) => void;
  onRestart?: () => void;
}

export const QuizInterface: React.FC<QuizInterfaceProps> = ({ 
  quiz, 
  onComplete, 
  onRestart 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<QuizResults | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Calculate results
    let correctAnswers = 0;
    let totalPoints = 0;
    
    const questionResults = quiz.questions.map(question => {
      const userAnswer = answers[question.id] || 'No answer';
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        correctAnswers++;
        totalPoints += question.points;
      }

      return {
        questionId: question.id,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
        points: isCorrect ? question.points : 0
      };
    });

    const percentage = Math.round((correctAnswers / quiz.questions.length) * 100);
    const maxPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);

    const finalResults: QuizResults = {
      score: {
        correct: correctAnswers,
        total: quiz.questions.length,
        percentage,
        points: totalPoints,
        maxPoints
      },
      results: questionResults,
      completedAt: new Date()
    };

    setResults(finalResults);
    setShowResults(true);
    setIsSubmitting(false);
    onComplete(finalResults);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setResults(null);
    setTimeElapsed(0);
    onRestart?.();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-spectral-green';
      case 'medium': return 'text-haunted-orange';
      case 'hard': return 'text-eerie-purple';
      default: return 'text-gray-400';
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-spectral-green';
    if (percentage >= 60) return 'text-haunted-orange';
    return 'text-red-400';
  };

  if (showResults && results) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto"
      >
        {/* Results Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-6xl mb-4"
          >
            {results.score.percentage >= 80 ? '🎉' : results.score.percentage >= 60 ? '👻' : '💀'}
          </motion.div>
          <h2 className="text-3xl font-bold text-ghost-white mb-2">
            Quiz Complete!
          </h2>
          <div className={`text-2xl font-bold ${getScoreColor(results.score.percentage)}`}>
            {results.score.percentage}% ({results.score.correct}/{results.score.total})
          </div>
          <p className="text-gray-400 mt-2">
            {results.score.points}/{results.score.maxPoints} points • {formatTime(timeElapsed)}
          </p>
        </div>

        {/* Score Breakdown */}
        <div className="ghost-card mb-8">
          <h3 className="text-xl font-semibold text-ghost-white mb-4">Score Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-spectral-green">
                {results.score.correct}
              </div>
              <div className="text-sm text-gray-400">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {results.score.total - results.score.correct}
              </div>
              <div className="text-sm text-gray-400">Incorrect</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-haunted-orange">
                {results.score.points}
              </div>
              <div className="text-sm text-gray-400">Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-eerie-purple">
                {formatTime(timeElapsed)}
              </div>
              <div className="text-sm text-gray-400">Time</div>
            </div>
          </div>
        </div>

        {/* Question Review */}
        <div className="space-y-4 mb-8">
          <h3 className="text-xl font-semibold text-ghost-white">Question Review</h3>
          {results.results.map((result, index) => (
            <motion.div
              key={result.questionId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`ghost-card border-l-4 ${
                result.isCorrect ? 'border-spectral-green' : 'border-red-400'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  {result.isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-spectral-green" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-ghost-white mb-2">
                    Question {index + 1}: {result.question}
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="text-gray-400">Your answer: </span>
                      <span className={result.isCorrect ? 'text-spectral-green' : 'text-red-400'}>
                        {result.userAnswer}
                      </span>
                    </div>
                    {!result.isCorrect && (
                      <div>
                        <span className="text-gray-400">Correct answer: </span>
                        <span className="text-spectral-green">{result.correctAnswer}</span>
                      </div>
                    )}
                    <div className="text-gray-300 mt-2 p-3 bg-phantom-gray/30 rounded">
                      {result.explanation}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${result.isCorrect ? 'text-spectral-green' : 'text-red-400'}`}>
                    {result.points} pts
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleRestart}
            className="ghost-button flex items-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Quiz Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-ghost-white">{quiz.metadata.title}</h2>
            <p className="text-gray-400">{quiz.metadata.description}</p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{formatTime(timeElapsed)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Brain className="h-4 w-4" />
              <span className={getDifficultyColor(quiz.metadata.difficulty)}>
                {quiz.metadata.difficulty}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-phantom-gray rounded-full h-2 mb-4">
          <motion.div
            className="bg-gradient-to-r from-spectral-green to-eerie-purple h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="flex justify-between text-sm text-gray-400">
          <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="ghost-card mb-8"
        >
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-haunted-orange font-medium">
                {currentQuestion.topic}
              </span>
              <span className="text-sm text-gray-400">
                {currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'}
              </span>
            </div>
            <h3 className="text-xl font-medium text-ghost-white leading-relaxed">
              {currentQuestion.question}
            </h3>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
              <>
                {currentQuestion.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswerSelect(option)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      answers[currentQuestion.id] === option
                        ? 'border-eerie-purple bg-eerie-purple/20 text-ghost-white'
                        : 'border-phantom-gray hover:border-eerie-purple/50 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        answers[currentQuestion.id] === option
                          ? 'border-eerie-purple bg-eerie-purple'
                          : 'border-gray-400'
                      }`}>
                        {answers[currentQuestion.id] === option && (
                          <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </motion.button>
                ))}
              </>
            )}

            {currentQuestion.type === 'true-false' && (
              <div className="grid grid-cols-2 gap-4">
                {['True', 'False'].map((option) => (
                  <motion.button
                    key={option}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswerSelect(option)}
                    className={`p-4 rounded-lg border transition-all ${
                      answers[currentQuestion.id] === option
                        ? 'border-eerie-purple bg-eerie-purple/20 text-ghost-white'
                        : 'border-phantom-gray hover:border-eerie-purple/50 text-gray-300'
                    }`}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'short-answer' && (
              <textarea
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerSelect(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full p-4 bg-phantom-gray border border-phantom-gray rounded-lg text-ghost-white placeholder-gray-400 focus:border-eerie-purple focus:outline-none resize-none"
                rows={4}
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={isFirstQuestion}
          className={`ghost-button flex items-center space-x-2 ${
            isFirstQuestion ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        <div className="text-center">
          <div className="text-sm text-gray-400">
            {Object.keys(answers).length} of {quiz.questions.length} answered
          </div>
        </div>

        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || Object.keys(answers).length === 0}
            className={`ghost-button-primary flex items-center space-x-2 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>Submit Quiz</span>
                <CheckCircle className="h-4 w-4" />
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!answers[currentQuestion.id]}
            className={`ghost-button-primary flex items-center space-x-2 ${
              !answers[currentQuestion.id] ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};