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
import { 
  Plus, 
  Edit, 
  Trash2, 
  BookOpen, 
  Users, 
  Clock,
  Search,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';

export function CourseManagement() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('ALL');
  const [newCourse, setNewCourse] = useState({
    code: '',
    title: '',
    department: '',
    level: '',
    difficulty: '',
    instructor: '',
    description: '',
    timeLimit: 60
  });

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await fetch('/api/admin/courses');
        const data = await res.json();
        setCourses(data.map((c: any) => ({
  ...c,
  id: c._id,
  difficulty: c.difficulty || (parseInt(c.level) >= 300 ? 'Advanced' : parseInt(c.level) >= 200 ? 'Intermediate' : 'Beginner')
})));
      } catch {
        toast.error('Failed to load courses');
      }
    };
    loadCourses();
  }, []);

  const departments = [
    'Computer Science',
    'Engineering',
    'Medicine',
    'Law',
    'Business Administration',
    'Sciences',
    'Arts',
    'Education'
  ];

  const levels = ['100', '200', '300', '400', '500'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'ALL' || course.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleAddCourse = async () => {
    if (!newCourse.code || !newCourse.title || !newCourse.department || !newCourse.difficulty) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setCourses(prev => [...prev, {
  ...created,
  id: created._id,
  difficulty: created.difficulty
}]);
      setIsAddDialogOpen(false);
      toast.success('Course added successfully!');
      setNewCourse({ code: '', title: '', department: '', level: '', difficulty: '', instructor: '', description: '', timeLimit: 60 });
    } catch {
      toast.error('Failed to add course');
    }
  };

  const handleEditCourse = (course: any) => {
    setEditingCourse(course);
    setNewCourse({
      code: course.code,
      title: course.title,
      department: course.department,
      level: course.level,
      difficulty: course.difficulty,
      instructor: course.instructor,
      description: course.description,
      timeLimit: course.timeLimit
    });
  };

  const handleUpdateCourse = async () => {
    if (!editingCourse) return;

    try {
      const res = await fetch(`/api/admin/courses/${editingCourse.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse),
      });
      if (!res.ok) throw new Error();
      setCourses(prev => prev.map(course => course.id === editingCourse.id ? {
  ...course,
  ...newCourse,
  difficulty: newCourse.difficulty
} : course));
      setEditingCourse(null);
      setNewCourse({ code: '', title: '', department: '', level: '', difficulty: '', instructor: '', description: '', timeLimit: 60 });
      toast.success('Course updated successfully!');
    } catch {
      toast.error('Failed to update course');
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setCourses(prev => prev.filter(course => course.id !== courseId));
      toast.success('Course deleted successfully!');
    } catch {
      toast.error('Failed to delete course');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Course Management</h1>
          <p className="text-muted-foreground">Manage courses, instructors, and course settings</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
              <DialogDescription>
                Create a new course for students to practice with past questions
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Course Code *</Label>
                <Input
                  id="code"
                  placeholder="e.g., CSC 201"
                  value={newCourse.code}
                  onChange={(e) => setNewCourse({...newCourse, code: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Computer Programming"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select value={newCourse.department} onValueChange={(value) => setNewCourse({...newCourse, department: value})}>
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
              
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select value={newCourse.level} onValueChange={(value) => setNewCourse({...newCourse, level: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>{level} Level</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty *</Label>
                <Select value={newCourse.difficulty} onValueChange={(value) => setNewCourse({...newCourse, difficulty: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  placeholder="60"
                  value={newCourse.timeLimit}
                  onChange={(e) => setNewCourse({...newCourse, timeLimit: parseInt(e.target.value) || 60})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Course description and objectives..."
                value={newCourse.description}
                onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCourse}>
                Add Course
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses, codes, or instructors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="w-48">
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="card-hover">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{course.code}</Badge>
                    <Badge className={getStatusColor(course.status)}>
                      {course.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>
                    {course.department} • {course.level} Level
                  </CardDescription>
                </div>
                <BookOpen className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p><strong>Instructor:</strong> {course.instructor}</p>
                <p className="mt-1">{course.description}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold">{course.questions}</div>
                  <div className="text-muted-foreground">Questions</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{course.students}</div>
                  <div className="text-muted-foreground">Students</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{course.timeLimit}m</div>
                  <div className="text-muted-foreground">Time Limit</div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleEditCourse(course)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteCourse(course.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No courses found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Edit Course Dialog */}
      <Dialog open={!!editingCourse} onOpenChange={() => setEditingCourse(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Update course information and settings
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-code">Course Code *</Label>
              <Input
                id="edit-code"
                value={newCourse.code}
                onChange={(e) => setNewCourse({...newCourse, code: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-title">Course Title *</Label>
              <Input
                id="edit-title"
                value={newCourse.title}
                onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-department">Department *</Label>
              <Select value={newCourse.department} onValueChange={(value) => setNewCourse({...newCourse, department: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-level">Level</Label>
              <Select value={newCourse.level} onValueChange={(value) => setNewCourse({...newCourse, level: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>{level} Level</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-difficulty">Difficulty *</Label>
              <Select value={newCourse.difficulty} onValueChange={(value) => setNewCourse({...newCourse, difficulty: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-instructor">Instructor</Label>
              <Input
                id="edit-instructor"
                value={newCourse.instructor}
                onChange={(e) => setNewCourse({...newCourse, instructor: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-timeLimit">Time Limit (minutes)</Label>
              <Input
                id="edit-timeLimit"
                type="number"
                value={newCourse.timeLimit}
                onChange={(e) => setNewCourse({...newCourse, timeLimit: parseInt(e.target.value) || 60})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={newCourse.description}
              onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setEditingCourse(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCourse}>
              Update Course
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}