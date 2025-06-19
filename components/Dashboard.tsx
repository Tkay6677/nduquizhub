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
  Settings,
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

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function loadProfile() {
      const res = await fetch('/api/profile');
      if (res.ok) {
        setProfile(await res.json());
      }
    }
    loadProfile();
  }, []);

  if (!user) return null;

  const recentActivity = [
    { course: 'Computer Programming', score: 85, date: '2 days ago' },
    { course: 'Data Structures', score: 92, date: '1 week ago' },
    { course: 'Database Systems', score: 78, date: '1 week ago' },
  ];

  const upcomingQuizzes = [
    { course: 'Algorithm Analysis', department: 'Computer Science', questions: 20 },
    { course: 'Software Engineering', department: 'Computer Science', questions: 15 },
    { course: 'Computer Networks', department: 'Computer Science', questions: 25 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">NDU Quiz Hub</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-1">
                <Button
                  variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('dashboard')}
                >
                  Dashboard
                </Button>
                <Button
                  variant={activeTab === 'quiz' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('quiz')}
                >
                  Take Quiz
                </Button>
                <Button
                  variant={activeTab === 'leaderboard' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('leaderboard')}
                >
                  Leaderboard
                </Button>
                <Button
                  variant={activeTab === 'profile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('profile')}
                >
                  Profile
                </Button>
              </nav>
              
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="quiz-gradient rounded-xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h2>
                  <p className="text-blue-100 mb-4">
                    {profile?.department} Department • {profile?.level} Level
                  </p>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4" />
                      <span>{profile?.quizzesCompleted} Quizzes Completed</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4" />
                      <span>{profile?.averageScore}% Average Score</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4" />
                      <span>{profile?.badges?.length} Badges Earned</span>
                    </div>
                  </div>
                </div>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => setActiveTab('quiz')}
                  className="bg-white text-primary hover:bg-gray-100"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Quiz
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Score</p>
                      <p className="text-2xl font-bold">{profile?.totalScore ?? user.totalScore}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Quizzes</p>
                      <p className="text-2xl font-bold">{profile?.quizzesCompleted ?? user.quizzesCompleted}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                      <p className="text-2xl font-bold">{profile?.averageScore ?? user.averageScore}%</p>
                    </div>
                    <Target className="h-8 w-8 text-accent" />
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