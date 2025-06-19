// components/Leaderboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  name: string;
  department: string;
  level: string;
  totalScore: number;
  quizzesCompleted: number;
  averageScore: number;
  badges: string[];
}

export function Leaderboard() {
  const { data: session, status } = useSession();
  if (status === 'loading') return <div>Loading leaderboard…</div>;
  const user = session?.user as any;

  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch('/api/leaderboard');
        if (!res.ok) throw new Error('Fetch error');
        setData(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  const getRankIcon = (r: number) =>
    r === 1 ? <Trophy className="h-6 w-6 text-yellow-500" /> :
    r === 2 ? <Medal className="h-6 w-6 text-gray-400" /> :
    r === 3 ? <Award className="h-6 w-6 text-amber-600" /> :
    <div className="w-6 h-6 flex items-center justify-center text-sm font-bold text-muted-foreground">#{r}</div>;

  const getBadgeColor = (r: number) =>
    r === 1 ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
    r === 2 ? 'bg-gray-100 text-gray-800 border-gray-300' :
    r === 3 ? 'bg-amber-100 text-amber-800 border-amber-300' :
    'bg-blue-100 text-blue-800 border-blue-300';

  if (loading) return <div>Loading leaderboard…</div>;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground">See how you rank against peers</p>
      </div>

      {/* Top 3 */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {data.slice(0, 3).map((stu, i) => {
          const rank = i + 1;
          const me = user?.id === stu.id;
          return (
            <Card
              key={stu.id}
              className={`text-center ${
                rank === 1
                  ? 'md:order-2 scale-105 border-yellow-300 bg-gradient-to-b from-yellow-50 to-white'
                  : rank === 2
                  ? 'md:order-1'
                  : 'md:order-3'
              } ${me ? 'ring-2 ring-primary' : ''}`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-center mb-2">{getRankIcon(rank)}</div>
                <CardTitle className="text-lg">{stu.name}</CardTitle>
                <CardDescription>
                  {stu.department} • {stu.level} Level
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stu.totalScore}</div>
                  <div className="text-sm text-muted-foreground">Total Score</div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center">
                    <div className="font-semibold">{stu.averageScore}%</div>
                    <div className="text-muted-foreground">Average</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{stu.quizzesCompleted}</div>
                    <div className="text-muted-foreground">Quizzes</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 justify-center">
                  {stu.badges.slice(0, 2).map((b, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {b}
                    </Badge>
                  ))}
                  {stu.badges.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{stu.badges.length - 2}
                    </Badge>
                  )}
                </div>
                {me && <Badge className="w-full bg-primary">Your Rank</Badge>}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Full list */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Full Rankings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.map((stu, i) => {
              const rank = i + 1;
              const me = user?.id === stu.id;
              return (
                <div
                  key={stu.id}
                  className={`flex items-center space-x-4 p-4 rounded-lg border ${getBadgeColor(
                    rank
                  )} ${me ? 'ring-2 ring-primary' : ''}`}
                >
                  <div className="flex items-center space-x-2">
                    {getRankIcon(rank)}
                    <span className="font-semibold">{rank}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{stu.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {stu.department} • {stu.level} Level
                    </div>
                  </div>
                  <div className="text-right space-y-1 text-sm">
                    <div>{stu.totalScore} Score</div>
                    <div>{stu.averageScore}% Avg</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}