'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

import { Clock, ArrowLeft, ArrowRight, CheckCircle, XCircle, Award } from 'lucide-react';
import { toast } from 'sonner';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizPageProps {
  course: any;
  isTimedQuiz: boolean;
  showAnswersDuring: boolean;
  onBack: () => void;
}

export function QuizPage({ course, isTimedQuiz, showAnswersDuring, onBack }: QuizPageProps) {
  const [questions] = useState<Question[]>([
    {
      id: 1,
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correctAnswer: 1,
      explanation: "Binary search divides the search space in half with each comparison, resulting in O(log n) time complexity."
    },
    {
      id: 2,
      question: "Which data structure uses LIFO (Last In, First Out) principle?",
      options: ["Queue", "Stack", "Array", "Linked List"],
      correctAnswer: 1,
      explanation: "Stack follows the LIFO principle where the last element added is the first one to be removed."
    },
    {
      id: 3,
      question: "What is the main purpose of a constructor in OOP?",
      options: ["To destroy objects", "To initialize objects", "To copy objects", "To compare objects"],
      correctAnswer: 1,
      explanation: "A constructor is used to initialize objects when they are created, setting up initial values and states."
    },
    {
      id: 4,
      question: "Which sorting algorithm has the best average-case time complexity?",
      options: ["Bubble Sort", "Selection Sort", "Quick Sort", "Insertion Sort"],
      correctAnswer: 2,
      explanation: "Quick Sort has an average-case time complexity of O(n log n), which is optimal for comparison-based sorting."
    },
    {
      id: 5,
      question: "What does SQL stand for?",
      options: ["Structured Query Language", "Simple Query Language", "System Query Language", "Standard Query Language"],
      correctAnswer: 0,
      explanation: "SQL stands for Structured Query Language, used for managing and querying relational databases."
    }
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState(isTimedQuiz ? course.timeLimit * 60 : 0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  

  useEffect(() => {
    if (isTimedQuiz && timeLeft > 0 && !isQuizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isTimedQuiz && timeLeft === 0 && !isQuizCompleted) {
      handleSubmitQuiz();
    }
  }, [timeLeft, isTimedQuiz, isQuizCompleted]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: answerIndex
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const handleSubmitQuiz = async () => {
    const score = calculateScore();
    setIsQuizCompleted(true);
    setShowResults(true);
    
    const badges: string[] = [];
    if (score === 100) {
      badges.push('Perfect Score');
      toast.success('🏆 Perfect Score! You earned a Perfect Score badge!');
    } else if (score >= 90) {
      badges.push('Quiz Master');
    } else if (score >= 80) {
      badges.push('High Achiever');
    }
    try {
      const res = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, badges, course: course.id, duration: course.timeLimit - Math.floor(timeLeft / 60) })
      });
      if (!res.ok) throw new Error('Submission failed');
      toast.success(`Quiz completed! Your score: ${score}%`);
    } catch (error) {
      toast.error('Error submitting results. Please try again.');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (showResults) {
    const score = calculateScore();
    const correctAnswers = questions.filter(q => selectedAnswers[q.id] === q.correctAnswer).length;

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="p-8 bg-gradient-to-r from-blue-50 to-amber-50 rounded-xl">
            <h1 className="text-3xl font-bold mb-4">Quiz Completed!</h1>
            <div className={`${getScoreColor(score)} text-6xl font-bold mb-4`}>{score}%</div>
            <p className="text-lg text-muted-foreground">
              You got {correctAnswers} out of {questions.length} questions correct
            </p>
            
            <div className="flex items-center justify-center space-x-8 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{correctAnswers}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{questions.length - correctAnswers}</div>
                <div className="text-sm text-muted-foreground">Incorrect</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{course.timeLimit - Math.floor(timeLeft / 60)}</div>
                <div className="text-sm text-muted-foreground">Minutes Used</div>
              </div>
            </div>
          </div>
        </div>

        {/* Answer Review */}
        <Card>
          <CardHeader>
            <CardTitle>Answer Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions.map((question, index) => {
              const userAnswer = selectedAnswers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <div key={question.id} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-start space-x-3 mb-3">
                    {isCorrect ? (
                      <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-500 mt-1" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">
                        Question {index + 1}: {question.question}
                      </h3>
                      
                      <div className="space-y-2 mb-3">
                        {question.options.map((option, optionIndex) => (
                          <div 
                            key={optionIndex}
                            className={`p-2 rounded ${
                              optionIndex === question.correctAnswer
                                ? 'bg-green-100 border-green-300'
                                : optionIndex === userAnswer && !isCorrect
                                ? 'bg-red-100 border-red-300'
                                : 'bg-gray-50'
                            }`}
                          >
                            {option}
                            {optionIndex === question.correctAnswer && (
                              <Badge className="ml-2 bg-green-500">Correct</Badge>
                            )}
                            {optionIndex === userAnswer && !isCorrect && (
                              <Badge variant="destructive" className="ml-2">Your Answer</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="text-sm"><strong>Explanation:</strong> {question.explanation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="flex justify-center space-x-4">
          <Button onClick={onBack} variant="outline">
            Take Another Quiz
          </Button>
          <Button onClick={() => window.location.reload()}>
            Retake This Quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>
        
        <div className="text-center">
          <h1 className="text-xl font-semibold">{course.title}</h1>
          <p className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {isTimedQuiz && (
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
              timeLeft < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            }`}>
              <Clock className="h-4 w-4" />
              <span className="font-mono">{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="min-h-[400px]">
        <CardHeader>
          <CardTitle className="text-lg">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup
            value={selectedAnswers[currentQuestion.id]?.toString()}
            onValueChange={(value) => handleAnswerSelect(parseInt(value))}
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {showAnswersDuring && selectedAnswers[currentQuestion.id] !== undefined && (
            <div className={`p-4 rounded-lg ${
              selectedAnswers[currentQuestion.id] === currentQuestion.correctAnswer
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                {selectedAnswers[currentQuestion.id] === currentQuestion.correctAnswer ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="font-semibold">
                  {selectedAnswers[currentQuestion.id] === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect'}
                </span>
              </div>
              <p className="text-sm">{currentQuestion.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex space-x-2">
          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              onClick={handleSubmitQuiz}
              disabled={Object.keys(selectedAnswers).length !== questions.length}
              className="bg-green-600 hover:bg-green-700"
            >
              <Award className="h-4 w-4 mr-2" />
              Submit Quiz
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              disabled={selectedAnswers[currentQuestion.id] === undefined}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Question Navigator */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            {questions.map((_, index) => (
              <Button
                key={index}
                variant={
                  index === currentQuestionIndex
                    ? 'default'
                    : selectedAnswers[questions[index].id] !== undefined
                    ? 'secondary'
                    : 'outline'
                }
                size="sm"
                onClick={() => setCurrentQuestionIndex(index)}
                className="w-10 h-10"
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}