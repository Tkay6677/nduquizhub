'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Download,
  Search,
  Filter,
  FileText,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';

export function QuestionManagement() {
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const res = await fetch('/api/admin/questions');
        const data = await res.json();
        setQuestions(data.map((q: any) => ({ ...q, id: q._id })));
      } catch {
        toast.error('Failed to load questions');
      }
    };
    loadQuestions();
  }, []);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('ALL');
  const [filterDifficulty, setFilterDifficulty] = useState('ALL');
  const [newQuestion, setNewQuestion] = useState({
    courseCode: '',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    difficulty: 'Medium',
    year: '2024',
    semester: 'First'
  });

  const [courses, setCourses] = useState<{ id: string; code: string; title: string }[]>([]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await fetch('/api/admin/courses');
        const data = await res.json();
        setCourses(data.map((c: any) => ({ id: c._id, code: c.code, title: c.title })));
      } catch {
        toast.error('Failed to load courses');
      }
    };
    loadCourses();
  }, []);

  const difficulties = ['Easy', 'Medium', 'Hard'];
  const semesters = ['First', 'Second'];
  const years = ['2024', '2023', '2022', '2021'];

  const filteredQuestions = questions.filter(question => {
    const search = searchTerm.toLowerCase();
    const qText = (question.question || '').toLowerCase();
    const code = (question.courseCode || '').toLowerCase();
    const title = (question.courseTitle || '').toLowerCase();
    const matchesSearch = qText.includes(search) || code.includes(search) || title.includes(search);
    const matchesCourse = filterCourse === 'ALL' || question.courseCode === filterCourse;
    const matchesDifficulty = filterDifficulty === 'ALL' || question.difficulty === filterDifficulty;
    return matchesSearch && matchesCourse && matchesDifficulty;
  });

  const handleAddQuestion = async () => {
    if (!newQuestion.courseCode || !newQuestion.question || newQuestion.options.some(opt => !opt.trim())) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      const courseInfo = courses.find(c => c.code === newQuestion.courseCode);
      const payload = { ...newQuestion, courseTitle: courseInfo?.title || '', courseId: courseInfo?.id || '' };
      const res = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setQuestions(prev => [...prev, { ...created, id: created._id }]);
      toast.success('Question added successfully!');
      setNewQuestion({
        courseCode: '',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        difficulty: 'Medium',
        year: '2024',
        semester: 'First'
      });
      setIsAddDialogOpen(false);
    } catch {
      toast.error('Failed to add question');
    }
  };

  const handleEditQuestion = (question: any) => {
    setEditingQuestion(question);
    setNewQuestion({
      courseCode: question.courseCode,
      question: question.question,
      options: [...question.options],
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      difficulty: question.difficulty,
      year: question.year,
      semester: question.semester
    });
  };

  const handleUpdateQuestion = async () => {
    if (!editingQuestion) return;

    const courseInfo = courses.find(c => c.code === newQuestion.courseCode);
    setQuestions(questions.map(question => 
      question.id === editingQuestion.id 
        ? { ...question, ...newQuestion, courseTitle: courseInfo?.title || '' }
        : question
    ));
    
    setEditingQuestion(null);
    setNewQuestion({
      courseCode: '',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      difficulty: 'Medium',
      year: '2024',
      semester: 'First'
    });
    toast.success('Question updated successfully!');
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      const res = await fetch(`/api/admin/questions/${questionId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setQuestions(prev => prev.filter(q => q.id !== questionId));
      toast.success('Question deleted successfully!');
    } catch {
      toast.error('Failed to delete question');
    }
    setQuestions(questions.filter(question => question.id !== questionId));
    toast.success('Question deleted successfully!');
  };

  const handleBulkUpload = () => {
    toast.info('Bulk upload feature coming soon!');
  };

  const handleExportQuestions = () => {
    const dataStr = JSON.stringify(filteredQuestions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'ndu-quiz-questions.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Questions exported successfully!');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({...newQuestion, options: newOptions});
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Question Management</h1>
          <p className="text-muted-foreground">Upload and manage past questions for all courses</p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleBulkUpload}>
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </Button>
          <Button variant="outline" onClick={handleExportQuestions}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Question</DialogTitle>
                <DialogDescription>
                  Create a new question for students to practice
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="course">Course *</Label>
                    <Select value={newQuestion.courseCode} onValueChange={(value) => setNewQuestion({...newQuestion, courseCode: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.code} value={course.code}>
                            {course.code} - {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select value={newQuestion.difficulty} onValueChange={(value) => setNewQuestion({...newQuestion, difficulty: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {difficulties.map((diff) => (
                          <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Select value={newQuestion.year} onValueChange={(value) => setNewQuestion({...newQuestion, year: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="semester">Semester</Label>
                    <Select value={newQuestion.semester} onValueChange={(value) => setNewQuestion({...newQuestion, semester: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {semesters.map((sem) => (
                          <SelectItem key={sem} value={sem}>{sem} Semester</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="question">Question *</Label>
                  <Textarea
                    id="question"
                    placeholder="Enter the question..."
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-4">
                  <Label>Answer Options *</Label>
                  <RadioGroup 
                    value={newQuestion.correctAnswer.toString()} 
                    onValueChange={(value) => setNewQuestion({...newQuestion, correctAnswer: parseInt(value)})}
                  >
                    {newQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="sr-only">Option {index + 1}</Label>
                        <Input
                          placeholder={`Option ${index + 1}`}
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          className="flex-1"
                        />
                        {newQuestion.correctAnswer === index && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    ))}
                  </RadioGroup>
                  <p className="text-sm text-muted-foreground">
                    Select the radio button next to the correct answer
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="explanation">Explanation</Label>
                  <Textarea
                    id="explanation"
                    placeholder="Explain why this is the correct answer..."
                    value={newQuestion.explanation}
                    onChange={(e) => setNewQuestion({...newQuestion, explanation: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddQuestion}>
                  Add Question
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions, courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="w-48">
              <Select value={filterCourse} onValueChange={setFilterCourse}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Courses</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.code} value={course.code}>{course.code}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-32">
              <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  {difficulties.map((diff) => (
                    <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <Card key={question.id} className="card-hover">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{question.courseCode}</Badge>
                    <Badge className={getDifficultyColor(question.difficulty)}>
                      {question.difficulty}
                    </Badge>
                    <Badge variant="secondary">{question.year} - {question.semester}</Badge>
                  </div>
                  <CardTitle className="text-lg">{question.courseTitle}</CardTitle>
                </div>
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium mb-3">{question.question}</p>
                <div className="grid grid-cols-2 gap-2">
                  {question.options.map((option: string, index: number) => (
                    <div 
                      key={index}
                      className={`p-2 rounded text-sm ${
                        index === question.correctAnswer
                          ? 'bg-green-100 border border-green-300 text-green-800'
                          : 'bg-white border'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                        <span>{option}</span>
                        {index === question.correctAnswer && (
                          <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {question.explanation && (
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm"><strong>Explanation:</strong> {question.explanation}</p>
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditQuestion(question)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredQuestions.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No questions found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Edit Question Dialog */}
      <Dialog open={!!editingQuestion} onOpenChange={() => setEditingQuestion(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
            <DialogDescription>
              Update question information and options
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-course">Course *</Label>
                <Select value={newQuestion.courseCode} onValueChange={(value) => setNewQuestion({...newQuestion, courseCode: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.code} value={course.code}>
                        {course.code} - {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-difficulty">Difficulty</Label>
                <Select value={newQuestion.difficulty} onValueChange={(value) => setNewQuestion({...newQuestion, difficulty: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((diff) => (
                      <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-year">Year</Label>
                <Select value={newQuestion.year} onValueChange={(value) => setNewQuestion({...newQuestion, year: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-semester">Semester</Label>
                <Select value={newQuestion.semester} onValueChange={(value) => setNewQuestion({...newQuestion, semester: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((sem) => (
                      <SelectItem key={sem} value={sem}>{sem} Semester</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-question">Question *</Label>
              <Textarea
                id="edit-question"
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                rows={3}
              />
            </div>
            
            <div className="space-y-4">
              <Label>Answer Options *</Label>
              <RadioGroup 
                value={newQuestion.correctAnswer.toString()} 
                onValueChange={(value) => setNewQuestion({...newQuestion, correctAnswer: parseInt(value)})}
              >
                {newQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <RadioGroupItem value={index.toString()} id={`edit-option-${index}`} />
                    <Label htmlFor={`edit-option-${index}`} className="sr-only">Option {index + 1}</Label>
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className="flex-1"
                    />
                    {newQuestion.correctAnswer === index && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-explanation">Explanation</Label>
              <Textarea
                id="edit-explanation"
                value={newQuestion.explanation}
                onChange={(e) => setNewQuestion({...newQuestion, explanation: e.target.value})}
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setEditingQuestion(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateQuestion}>
              Update Question
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}