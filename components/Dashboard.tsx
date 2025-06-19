'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useSession, signOut } from 'next-auth/react';
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  Target, 
  Star, 
  TrendingUp, 
  Users,
  Award,
  LogOut,
  Menu,
  X,
  Play
} from 'lucide-react';
import { QuizSelection } from './QuizSelection';
import { Leaderboard } from './Leaderboard';
import { ProfileStats } from './ProfileStats';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { data: session, status } = useSession();
  if (status === 'loading') return null;
  const user = session?.user;
  const logout = () => signOut({ callbackUrl: '/' });

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [popularCourses, setPopularCourses] = useState<Array<{
    course: string;
    department: string;
    questions: number;
    attempts: number;
    averageScore: number;
  }>>([]);

  useEffect(() => {
    async function loadData() {
      // Load user profile
      const profileRes = await fetch('/api/profile');
      if (profileRes.ok) {
        setProfile(await profileRes.json());
      }

      // Load popular courses
      const coursesRes = await fetch('/api/courses/popular');
      if (coursesRes.ok) {
        const data = await coursesRes.json();
        setPopularCourses(data);
      }
    }
    loadData();
  }, []);

  if (!user) return null;

  const recentActivity = profile?.recentActivity || [];
  const upcomingQuizzes = popularCourses.length > 0 
    ? popularCourses 
    : [
        { course: 'Algorithm Analysis', department: 'Computer Science', questions: 20, attempts: 0, averageScore: 0 },
        { course: 'Software Engineering', department: 'Computer Science', questions: 15, attempts: 0, averageScore: 0 },
        { course: 'Computer Networks', department: 'Computer Science', questions: 25, attempts: 0, averageScore: 0 },
      ];

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showMobileMenu && !target.closest('.mobile-menu-button')) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMobileMenu]);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="p-1.5 sm:p-2 bg-primary rounded-lg">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="max-w-[140px] sm:max-w-none">
                <h1 className="text-sm sm:text-lg font-semibold truncate">NDU Quiz Hub</h1>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Welcome, {user.name?.split(' ')[0]}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <nav className="hidden sm:flex space-x-1">
                <Button
                  variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                  size="sm"
                  className="text-xs sm:text-sm px-2 sm:px-3"
                  onClick={() => setActiveTab('dashboard')}
                >
                  Dashboard
                </Button>
                <Button
                  variant={activeTab === 'quiz' ? 'default' : 'ghost'}
                  size="sm"
                  className="text-xs sm:text-sm px-2 sm:px-3"
                  onClick={() => setActiveTab('quiz')}
                >
                  Take Quiz
                </Button>
                <Button
                  variant={activeTab === 'leaderboard' ? 'default' : 'ghost'}
                  size="sm"
                  className="hidden sm:inline-flex text-xs sm:text-sm px-2 sm:px-3"
                  onClick={() => setActiveTab('leaderboard')}
                >
                  Leaderboard
                </Button>
                <Button
                  variant={activeTab === 'profile' ? 'default' : 'ghost'}
                  size="sm"
                  className="hidden sm:inline-flex text-xs sm:text-sm px-2 sm:px-3"
                  onClick={() => setActiveTab('profile')}
                >
                  Profile
                </Button>
              </nav>
              
              {/* Mobile menu button */}
              <div className="sm:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                {showMobileMenu && (
                  <div className="absolute right-2 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setActiveTab('dashboard');
                          setShowMobileMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('quiz');
                          setShowMobileMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Take Quiz
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('leaderboard');
                          setShowMobileMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Leaderboard
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('profile');
                          setShowMobileMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </button>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t border-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="hidden sm:flex items-center"
              >
                <LogOut className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Welcome Section */}
            <div className="quiz-gradient rounded-xl p-4 sm:p-6 md:p-8 text-white">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="w-full sm:w-auto">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {user.name}!</h2>
                  <p className="text-blue-100 mb-3 sm:mb-4 text-sm sm:text-base">
                    {profile?.department} Department • {profile?.level} Level
                  </p>
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:flex sm:items-center gap-3 sm:gap-6 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">{profile?.quizzesCompleted} Quizzes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">{profile?.averageScore}% Avg Score</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">{profile?.badges?.length} Badges</span>
                    </div>
                  </div>
                </div>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => setActiveTab('quiz')}
                  className="w-full sm:w-auto mt-4 sm:mt-0 bg-white text-primary hover:bg-gray-100 whitespace-nowrap"
                >
                  <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Start Quiz
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              <Card className="card-hover h-full">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Score</p>
                      <p className="text-xl sm:text-2xl font-bold">{profile?.totalScore ?? user.totalScore}</p>
                    </div>
                    <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-hover h-full">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">Quizzes</p>
                      <p className="text-xl sm:text-2xl font-bold">{profile?.quizzesCompleted ?? user.quizzesCompleted}</p>
                    </div>
                    <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-hover h-full">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">Avg. Score</p>
                      <p className="text-xl sm:text-2xl font-bold">{profile?.averageScore ?? user.averageScore}%</p>
                    </div>
                    <Target className="h-6 w-6 sm:h-8 sm:w-8 text-accent flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Badges</p>
                      <p className="text-2xl font-bold">{profile?.badges?.length ?? user.badges.length}</p>
                    </div>
                    <Award className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity: { course: string; score: number; date: string }, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{activity.course}</p>
                        <p className="text-sm text-muted-foreground">{activity.date}</p>
                      </div>
                      <Badge variant={activity.score >= 80 ? 'default' : 'secondary'}>
                        {activity.score}%
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Upcoming Quizzes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Popular Quizzes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingQuizzes.map((quiz: { course: string; department: string; questions: number }, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{quiz.course}</p>
                        <p className="text-sm text-muted-foreground">{quiz.questions} questions</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Start
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Badges Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Your Badges</span>
                </CardTitle>
                <CardDescription>
                  Achievements you've unlocked on your learning journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {(profile?.badges || user.badges).map((badge: string, index: number) => (
                    <Badge key={index} variant="secondary" className="p-2 badge-glow">
                      <Star className="h-4 w-4 mr-1" />
                      {badge}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'quiz' && <QuizSelection />}
        {activeTab === 'leaderboard' && <Leaderboard />}
        {activeTab === 'profile' && <ProfileStats />}
      </div>
    </div>
  );
}