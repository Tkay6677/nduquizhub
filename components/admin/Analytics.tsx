'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Trophy,
  Calendar,
  Target,
  Activity,
  PieChart,
  LineChart
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalUsers: 0,
    averageScore: 0,
    completionRate: 0,
    activeUsers: 0,
    newUsers: 0,
    topPerformers: 0,
    eventsCompleted: 0
  });

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [usersRes, questionsRes, eventsRes] = await Promise.all([
          fetch('/api/admin/users'),
          fetch('/api/admin/questions'),
          fetch('/api/admin/events')
        ]);
        if (!usersRes.ok || !questionsRes.ok || !eventsRes.ok) throw new Error();
        const users = await usersRes.json();
        const questions = await questionsRes.json();
        const events = await eventsRes.json();
        const today = new Date().toISOString().split('T')[0];
        const totalQuizzes = questions.length;
        const totalUsers = users.length;
        const averageScore = users.reduce((sum: number, u: any) => sum + (u.averageScore || 0), 0) / (users.length || 1);
        const activeUsers = users.filter((u: any) => u.lastActive && new Date(u.lastActive).toISOString().split('T')[0] === today).length;
        const newUsers = users.filter((u: any) => u.joinDate && new Date(u.joinDate).toISOString().split('T')[0] === today).length;
        const eventsCompleted = events.length;
        const topPerformers = users.sort((a: any, b: any) => (b.averageScore || 0) - (a.averageScore || 0)).slice(0, 5).length;
        setStats({ totalQuizzes, totalUsers, averageScore, completionRate: 0, activeUsers, newUsers, topPerformers, eventsCompleted });
      } catch {
        toast.error('Failed to load analytics');
      }
    };
    loadAnalytics();
  }, [timeRange]);


  const departmentStats = [
    { department: 'Computer Science', users: 245, avgScore: 82.1, quizzes: 456 },
    { department: 'Engineering', users: 198, avgScore: 79.3, quizzes: 387 },
    { department: 'Medicine', users: 167, avgScore: 85.2, quizzes: 298 },
    { department: 'Law', users: 134, avgScore: 76.8, quizzes: 234 },
    { department: 'Business Administration', users: 112, avgScore: 74.5, quizzes: 189 }
  ];

  const coursePerformance = [
    { course: 'CSC 201 - Computer Programming', attempts: 234, avgScore: 78.5, difficulty: 'Medium' },
    { course: 'CSC 301 - Data Structures', attempts: 189, avgScore: 72.3, difficulty: 'Hard' },
    { course: 'ENG 201 - Engineering Mathematics', attempts: 156, avgScore: 81.2, difficulty: 'Hard' },
    { course: 'MED 201 - Anatomy', attempts: 134, avgScore: 85.7, difficulty: 'Medium' },
    { course: 'LAW 201 - Constitutional Law', attempts: 98, avgScore: 76.9, difficulty: 'Medium' }
  ];

  const recentActivity = [
    { type: 'quiz_completed', count: 89, change: '+12%', period: 'Today' },
    { type: 'new_registrations', count: 15, change: '+8%', period: 'Today' },
    { type: 'events_created', count: 3, change: '+50%', period: 'This week' },
    { type: 'questions_added', count: 45, change: '+23%', period: 'This week' }
  ];

  const topPerformers = [
    { name: 'Sarah Johnson', department: 'Computer Science', score: 95.2, quizzes: 18 },
    { name: 'Michael Chen', department: 'Engineering', score: 93.8, quizzes: 16 },
    { name: 'Emma Davis', department: 'Medicine', score: 92.5, quizzes: 14 },
    { name: 'James Wilson', department: 'Law', score: 91.3, quizzes: 12 },
    { name: 'Lisa Anderson', department: 'Business Administration', score: 90.7, quizzes: 15 }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getChangeColor = (change: string) => {
    return change.startsWith('+') ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive insights into system performance and user engagement</p>
        </div>
        
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="computer-science">Computer Science</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="medicine">Medicine</SelectItem>
              <SelectItem value="law">Law</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Quizzes</p>
                <p className="text-2xl font-bold">{stats.totalQuizzes}</p>
                <p className="text-xs text-green-600">+15% from last month</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{stats.activeUsers}</p>
                <p className="text-xs text-green-600">+8% from last week</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold">{stats.averageScore}%</p>
                <p className="text-xs text-green-600">+2.3% improvement</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{stats.completionRate}%</p>
                <p className="text-xs text-green-600">+1.2% from last month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Department Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Department Performance</span>
            </CardTitle>
            <CardDescription>Performance metrics by department</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {departmentStats.map((dept, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold">{dept.department}</h4>
                  <p className="text-sm text-muted-foreground">{dept.users} users • {dept.quizzes} quizzes</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">{dept.avgScore}%</div>
                  <div className="text-sm text-muted-foreground">Avg Score</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Key metrics and changes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold capitalize">{activity.type.replace('_', ' ')}</h4>
                  <p className="text-sm text-muted-foreground">{activity.period}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">{activity.count}</div>
                  <div className={`text-sm ${getChangeColor(activity.change)}`}>
                    {activity.change}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Course Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Course Performance</span>
          </CardTitle>
          <CardDescription>Most popular courses and their performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {coursePerformance.map((course, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold">{course.course}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getDifficultyColor(course.difficulty)}>
                      {course.difficulty}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {course.attempts} attempts
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-semibold">{course.avgScore}%</div>
                  <div className="text-sm text-muted-foreground">Average Score</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Top Performers</span>
          </CardTitle>
          <CardDescription>Students with highest average scores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full font-bold">
                  {index + 1}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-semibold">{performer.name}</h4>
                  <p className="text-sm text-muted-foreground">{performer.department}</p>
                </div>
                
                <div className="text-center">
                  <div className="font-semibold">{performer.quizzes}</div>
                  <div className="text-sm text-muted-foreground">Quizzes</div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-semibold text-green-600">{performer.score}%</div>
                  <div className="text-sm text-muted-foreground">Avg Score</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Server Uptime</span>
                <span className="font-semibold text-green-600">99.9%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Response Time</span>
                <span className="font-semibold">245ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Database Health</span>
                <span className="font-semibold text-green-600">Excellent</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Usage Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Peak Hours</span>
                <span className="font-semibold">2PM - 6PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Most Active Day</span>
                <span className="font-semibold">Wednesday</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Mobile Usage</span>
                <span className="font-semibold">68%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Growth Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">User Growth</span>
                <span className="font-semibold text-green-600">+12%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Quiz Completion</span>
                <span className="font-semibold text-green-600">+8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Engagement Rate</span>
                <span className="font-semibold text-green-600">+15%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}