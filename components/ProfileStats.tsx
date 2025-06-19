'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  User, 
  Trophy, 
  Target, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Award,
  Star,
  Clock,
  CheckCircle
} from 'lucide-react';

export function ProfileStats() {
  const { data: session, status } = useSession();
  if (status === 'loading') return null;
  const sessionUser = session?.user; // only used for auth check
  const [profile, setProfile] = useState<{ name: string; department: string; level: string; badges: string[]; totalScore: number; quizzesCompleted: number; averageScore: number; recentActivity: { course: string; score: number; date: string; duration: string; }[] } | null>(null);
  useEffect(() => {
    async function loadProfile() {
      const res = await fetch('/api/profile');
      if (res.ok) setProfile(await res.json());
    }
    loadProfile();
  }, []);

  if (!profile) return <div>Loading profile…</div>;


  if (!sessionUser) return null; // ensure authenticated

  const achievements = [
    {
      name: 'First Quiz',
      description: 'Completed your first quiz',
      icon: CheckCircle,
      color: 'text-green-500',
      earned: profile.badges.includes('First Quiz')
    },
    {
      name: 'Quiz Master',
      description: 'Scored above 90% on 5 quizzes',
      icon: Trophy,
      color: 'text-yellow-500',
      earned: profile.badges.includes('Quiz Master')
    },
    {
      name: 'Perfect Score',
      description: 'Achieved 100% on a quiz',
      icon: Star,
      color: 'text-purple-500',
      earned: profile.badges.includes('Perfect Score')
    },
    {
      name: 'Speed Demon',
      description: 'Completed a timed quiz with time to spare',
      icon: Clock,
      color: 'text-blue-500',
      earned: profile.badges.includes('Speed Demon')
    },
    {
      name: 'Consistency King',
      description: 'Maintained high scores across multiple subjects',
      icon: Target,
      color: 'text-red-500',
      earned: profile.badges.includes('Consistency King')
    },
    {
      name: 'Scholar',
      description: 'Completed 20 quizzes',
      icon: BookOpen,
      color: 'text-indigo-500',
      earned: profile.quizzesCompleted >= 20
    }
  ];



  const subjectStats = [
    { subject: 'Programming Languages', quizzes: 8, average: 87.5, bestScore: 95 },
    { subject: 'Data Structures', quizzes: 6, average: 82.3, bestScore: 92 },
    { subject: 'Database Systems', quizzes: 4, average: 79.8, bestScore: 88 },
    { subject: 'Software Engineering', quizzes: 3, average: 91.2, bestScore: 95 },
    { subject: 'Computer Networks', quizzes: 2, average: 74.5, bestScore: 78 }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return 'default';
    if (score >= 80) return 'secondary';
    return 'outline';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <p className="text-muted-foreground">Track your progress and achievements</p>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">
                {profile.name.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <p className="text-muted-foreground mb-4">
                {profile.department} Department • {profile.level} Level
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{profile.totalScore}</div>
                  <div className="text-sm text-muted-foreground">Total Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{profile.quizzesCompleted}</div>
                  <div className="text-sm text-muted-foreground">Quizzes</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(profile.averageScore)}`}>
                    {profile.averageScore}%
                  </div>
                  <div className="text-sm text-muted-foreground">Average</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{profile.badges.length}</div>
                  <div className="text-sm text-muted-foreground">Badges</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Achievements</span>
            </CardTitle>
            <CardDescription>Your learning milestones and badges</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${
                    achievement.earned ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                  }`}
                >
                  <IconComponent 
                    className={`h-8 w-8 ${
                      achievement.earned ? achievement.color : 'text-gray-400'
                    }`} 
                  />
                  <div className="flex-1">
                    <h4 className={`font-semibold ${
                      achievement.earned ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {achievement.name}
                    </h4>
                    <p className={`text-sm ${
                      achievement.earned ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.earned && (
                    <Badge className="bg-green-500">Earned</Badge>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Subject Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Subject Performance</span>
            </CardTitle>
            <CardDescription>Your performance across different subjects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subjectStats.map((subject, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{subject.subject}</h4>
                  <Badge variant="outline">{subject.quizzes} quizzes</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Average: {subject.average}%</span>
                  <span>Best: {subject.bestScore}%</span>
                </div>
                <Progress value={subject.average} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
          <CardDescription>Your latest quiz attempts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profile?.recentActivity?.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-semibold">{activity.course}</h4>
                    <p className="text-sm text-muted-foreground">
                      {activity.date} • {activity.duration}
                    </p>
                  </div>
                </div>
                <Badge variant={getScoreBadgeVariant(activity.score)}>
                  {activity.score}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Earned Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>Your Badges</span>
          </CardTitle>
          <CardDescription>All the badges you've earned</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {profile.badges.map((badge, index) => (
              <Badge key={index} variant="secondary" className="p-3 badge-glow">
                <Award className="h-4 w-4 mr-2" />
                {badge}
              </Badge>
            ))}
            {profile.badges.length === 0 && (
              <p className="text-muted-foreground">No badges earned yet. Keep taking quizzes to unlock achievements!</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}