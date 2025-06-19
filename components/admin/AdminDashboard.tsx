'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

import { 
  Settings, 
  Users, 
  BookOpen, 
  Calendar, 
  BarChart3, 
  Shield,
  LogOut,
  Plus,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { CourseManagement } from './CourseManagement';
import { QuestionManagement } from './QuestionManagement';
import { EventManagement } from './EventManagement';
import { UserManagement } from './UserManagement';
import { Analytics } from './Analytics';
//import { SystemSettings } from './SystemSettings';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: session, status } = useSession();
  if (status === 'loading') return null;
  const user = session?.user;

  if (!user) return null;

  // Overview stats state
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuestions: 0,
    totalCourses: 0,
    activeEvents: 0,
    todayQuizzes: 0,
    systemHealth: 100
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [usersRes, questionsRes, coursesRes, eventsRes] = await Promise.all([
          fetch('/api/admin/users'),
          fetch('/api/admin/questions'),
          fetch('/api/admin/courses'),
          fetch('/api/admin/events')
        ]);
        if (!usersRes.ok || !questionsRes.ok || !coursesRes.ok || !eventsRes.ok) throw new Error();
        const users = await usersRes.json();
        const questions = await questionsRes.json();
        const courses = await coursesRes.json();
        const events = await eventsRes.json();
        const today = new Date().toISOString().split('T')[0];
        setStats({
          totalUsers: users.length,
          totalQuestions: questions.length,
          totalCourses: courses.length,
          activeEvents: events.length,
          todayQuizzes: questions.filter((q: any) => new Date(q.createdAt).toISOString().split('T')[0] === today).length,
          systemHealth: 100
        });
      } catch {
        toast.error('Failed to load overview stats');
      }
    };
    loadStats();
  }, []);



  // Dynamic stats loaded from server
  const recentActivity = [
    { action: 'New user registered', user: 'Sarah Johnson', time: '2 minutes ago', type: 'user' },
    { action: 'Quiz completed', user: 'Michael Chen', course: 'Data Structures', time: '5 minutes ago', type: 'quiz' },
    { action: 'Question added', course: 'Computer Programming', time: '15 minutes ago', type: 'content' },
    { action: 'Event created', event: 'Mid-Semester Quiz Competition', time: '1 hour ago', type: 'event' },
    { action: 'System backup completed', time: '2 hours ago', type: 'system' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return <Users className="h-4 w-4 text-blue-500" />;
      case 'quiz': return <BookOpen className="h-4 w-4 text-green-500" />;
      case 'content': return <Plus className="h-4 w-4 text-purple-500" />;
      case 'event': return <Calendar className="h-4 w-4 text-orange-500" />;
      case 'system': return <Settings className="h-4 w-4 text-gray-500" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">NDU Quiz Hub - Admin</h1>
                <p className="text-sm text-muted-foreground">System Administration Panel</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-1">
                <Button
                  variant={activeTab === 'overview' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </Button>
                <Button
                  variant={activeTab === 'courses' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('courses')}
                >
                  Courses
                </Button>
                <Button
                  variant={activeTab === 'questions' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('questions')}
                >
                  Questions
                </Button>
                <Button
                  variant={activeTab === 'events' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('events')}
                >
                  Events
                </Button>
                <Button
                  variant={activeTab === 'users' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('users')}
                >
                  Users
                </Button>
                <Button
                  variant={activeTab === 'analytics' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('analytics')}
                >
                  Analytics
                </Button>
                <Button
                  variant={activeTab === 'settings' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('settings')}
                >
                  Settings
                </Button>
              </nav>
              
              <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: '/' })}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="quiz-gradient rounded-xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h2>
                  <p className="text-blue-100 mb-4">
                    System Administrator • NDU Quiz Hub
                  </p>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>{stats.totalUsers} Active Users</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4" />
                      <span>{stats.todayQuizzes} Quizzes Today</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>{stats.systemHealth}% System Health</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold mb-2">{stats.systemHealth}%</div>
                  <div className="text-blue-100">System Status</div>
                  <Badge className="mt-2 bg-green-500">All Systems Operational</Badge>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                      <p className="text-2xl font-bold">{stats.totalUsers}</p>
                      <p className="text-xs text-green-600">+12% from last month</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Questions</p>
                      <p className="text-2xl font-bold">{stats.totalQuestions}</p>
                      <p className="text-xs text-green-600">+8% from last month</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Courses</p>
                      <p className="text-2xl font-bold">{stats.totalCourses}</p>
                      <p className="text-xs text-blue-600">+3 new this month</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Events</p>
                      <p className="text-2xl font-bold">{stats.activeEvents}</p>
                      <p className="text-xs text-orange-600">2 ending soon</p>
                    </div>
                    <Calendar className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                  <CardDescription>Latest system activities and user actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.user && `by ${activity.user}`}
                          {activity.course && ` • ${activity.course}`}
                          {activity.event && ` • ${activity.event}`}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* System Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5" />
                    <span>System Alerts</span>
                  </CardTitle>
                  <CardDescription>Important notifications and system status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-sm text-green-800">System Backup Completed</p>
                      <p className="text-xs text-green-600">Daily backup successful at 2:00 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-sm text-blue-800">High User Activity</p>
                      <p className="text-xs text-blue-600">89 quizzes completed today (+15% from yesterday)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <Calendar className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-medium text-sm text-orange-800">Event Reminder</p>
                      <p className="text-xs text-orange-600">Mid-Semester Competition ends in 2 days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button 
                    className="h-20 flex-col space-y-2" 
                    variant="outline"
                    onClick={() => setActiveTab('courses')}
                  >
                    <Plus className="h-6 w-6" />
                    <span>Add Course</span>
                  </Button>
                  <Button 
                    className="h-20 flex-col space-y-2" 
                    variant="outline"
                    onClick={() => setActiveTab('questions')}
                  >
                    <BookOpen className="h-6 w-6" />
                    <span>Upload Questions</span>
                  </Button>
                  <Button 
                    className="h-20 flex-col space-y-2" 
                    variant="outline"
                    onClick={() => setActiveTab('events')}
                  >
                    <Calendar className="h-6 w-6" />
                    <span>Create Event</span>
                  </Button>
                  <Button 
                    className="h-20 flex-col space-y-2" 
                    variant="outline"
                    onClick={() => setActiveTab('analytics')}
                  >
                    <BarChart3 className="h-6 w-6" />
                    <span>View Analytics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'courses' && <CourseManagement />}
        {activeTab === 'questions' && <QuestionManagement />}
        {activeTab === 'events' && <EventManagement />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'analytics' && <Analytics />}
        {/* {activeTab === 'settings' && <SystemSettings />} */}
      </div>
    </div>
  );
}