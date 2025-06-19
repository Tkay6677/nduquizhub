'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { BookOpen, Clock, Users, Play, Settings } from 'lucide-react';
import { QuizPage } from './QuizPage';

export function QuizSelection() {
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isTimedQuiz, setIsTimedQuiz] = useState(false);
  const [showAnswersDuring, setShowAnswersDuring] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const departments = [
    'All Departments',
    'Computer Science',
    'Engineering',
    'Medicine',
    'Law',
    'Business Administration',
    'Sciences',
    'Arts',
    'Education'
  ];

  const [courses, setCourses] = useState<any[]>([]);
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        if (!res.ok) throw new Error();
        const data = await res.json();
        const coursesWithDifficulty = data.map((c: any) => ({
          ...c,
          difficulty: parseInt(c.level) >= 300 ? 'Advanced' : parseInt(c.level) >= 200 ? 'Intermediate' : 'Beginner'
        }));
        setCourses(coursesWithDifficulty);
      } catch {
        toast.error('Failed to load courses');
      }
    };
    loadCourses();
  }, []);

  const filteredCourses = selectedDepartment && selectedDepartment !== 'All Departments'
    ? courses.filter(course => course.department === selectedDepartment)
    : courses;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (selectedCourse) {
    return (
      <QuizPage 
        course={selectedCourse}
        isTimedQuiz={isTimedQuiz}
        showAnswersDuring={showAnswersDuring}
        onBack={() => setSelectedCourse(null)}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Select a Quiz</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose from our collection of past questions and customize your quiz experience
        </p>
      </div>

      {/* Filters and Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Quiz Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Department Filter</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="timed-quiz">Timed Quiz</Label>
                <p className="text-sm text-muted-foreground">
                  Add time pressure to simulate exam conditions
                </p>
              </div>
              <Switch
                id="timed-quiz"
                checked={isTimedQuiz}
                onCheckedChange={setIsTimedQuiz}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-answers">Show Answers During Quiz</Label>
                <p className="text-sm text-muted-foreground">
                  See correct answers immediately after each question
                </p>
              </div>
              <Switch
                id="show-answers"
                checked={showAnswersDuring}
                onCheckedChange={setShowAnswersDuring}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="card-hover cursor-pointer group">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {course.title}
                  </CardTitle>
                  <Badge className={getDifficultyColor(course.difficulty)}>
                    {course.difficulty}
                  </Badge>
                </div>
                <BookOpen className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{course.questions} questions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{course.timeLimit} min</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{course.averageScore}% avg</span>
                </div>
              </div>
              
              <Button 
                className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                onClick={() => setSelectedCourse(course)}
              >
                <Play className="h-4 w-4 mr-2" />
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No courses found</h3>
          <p className="text-muted-foreground">Try selecting a different department filter</p>
        </div>
      )}
    </div>
  );
}