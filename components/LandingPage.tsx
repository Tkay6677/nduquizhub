'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { GraduationCap, Trophy, Users, Clock, Award, BookOpen, Star } from 'lucide-react';
import { toast } from 'sonner';

export function LandingPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    level: ''
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const res = await signIn('credentials', { email: formData.email, password: formData.password, redirect: false });
        if (res?.error) {
          toast.error('Invalid credentials.');
          return;
        }
        toast.success('Welcome back to NDU Quiz Hub!');
        router.push('/');
      } else {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password, department: formData.department, level: formData.level })
        });
        const data = await response.json();
        if (!response.ok) {
          toast.error(data.error || 'Registration failed.');
          return;
        }
        toast.success('Account created successfully! Welcome to NDU Quiz Hub!');
        await signIn('credentials', { email: formData.email, password: formData.password, redirect: false });
        router.push('/');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary rounded-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">NDU Quiz Hub</h1>
                <p className="text-sm text-muted-foreground">Niger Delta University</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Master Your Studies with
                <span className="block text-primary">Past Questions</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Practice with authentic past questions, track your progress, and compete with fellow students at Niger Delta University.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <BookOpen className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold">Authentic Questions</h3>
                  <p className="text-sm text-gray-600">Real past exam questions</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <Clock className="h-8 w-8 text-accent" />
                <div>
                  <h3 className="font-semibold">Timed Practice</h3>
                  <p className="text-sm text-gray-600">Exam-like conditions</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <div>
                  <h3 className="font-semibold">Leaderboards</h3>
                  <p className="text-sm text-gray-600">Compete with peers</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <Award className="h-8 w-8 text-green-500" />
                <div>
                  <h3 className="font-semibold">Earn Badges</h3>
                  <p className="text-sm text-gray-600">Achievement rewards</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">1000+</div>
                <div className="text-sm text-gray-600">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">15+</div>
                <div className="text-sm text-gray-600">Departments</div>
              </div>
            </div>
          </div>

          {/* Auth Form */}
          <div className="lg:pl-8">
            <Card className="w-full max-w-md mx-auto shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                  {isLogin ? 'Welcome Back' : 'Join NDU Quiz Hub'}
                </CardTitle>  
                <CardDescription>
                  {isLogin 
                    ? 'Sign in to continue your learning journey'
                    : 'Create your account to start practicing'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                    />
                  </div>

                  {!isLogin && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your department" />
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
                        <Select value={formData.level} onValueChange={(value) => setFormData({...formData, level: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your level" />
                          </SelectTrigger>
                          <SelectContent>
                            {levels.map((level) => (
                              <SelectItem key={level} value={level}>{level} Level</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  <Button type="submit" className="w-full">
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </Button>
                </form>

                <div className="mt-4 text-center">
                  <Button
                    variant="link"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm"
                  >
                    {isLogin 
                      ? "Don't have an account? Sign up" 
                      : "Already have an account? Sign in"
                    }
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}