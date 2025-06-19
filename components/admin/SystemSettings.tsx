'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Shield, 
  Bell,
  Database,
  Mail,
  Globe,
  Lock,
  Users,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

export function SystemSettings() {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'NDU Quiz Hub',
    siteDescription: 'Niger Delta University Online Quiz Platform',
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: false,
    
    // Quiz Settings
    defaultQuizTimeLimit: 60,
    maxQuestionsPerQuiz: 50,
    allowRetakes: true,
    showAnswersAfterSubmission: true,
    randomizeQuestions: true,
    
    // Security Settings
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireStrongPasswords: true,
    enableTwoFactor: false,
    
    // Email Settings
    emailProvider: 'smtp',
    smtpHost: 'smtp.ndu.edu.ng',
    smtpPort: 587,
    smtpUsername: 'noreply@ndu.edu.ng',
    smtpPassword: '',
    emailFromName: 'NDU Quiz Hub',
    
    // Notification Settings
    enableEmailNotifications: true,
    enablePushNotifications: false,
    notifyOnNewUser: true,
    notifyOnQuizCompletion: false,
    notifyOnSystemErrors: true,
    
    // Backup Settings
    autoBackup: true,
    backupFrequency: 'daily',
    backupRetention: 30,
    
    // Performance Settings
    cacheEnabled: true,
    cacheTimeout: 3600,
    compressionEnabled: true,
    cdnEnabled: false
  });

  const [activeTab, setActiveTab] = useState('general');

  const handleSaveSettings = () => {
    // In a real application, this would save to the backend
    toast.success('Settings saved successfully!');
  };

  const handleResetSettings = () => {
    // Reset to default values
    toast.info('Settings reset to defaults');
  };

  const handleTestEmail = () => {
    toast.success('Test email sent successfully!');
  };

  const handleBackupNow = () => {
    toast.success('Backup initiated successfully!');
  };

  const handleClearCache = () => {
    toast.success('Cache cleared successfully!');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'quiz', label: 'Quiz Settings', icon: Clock },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'backup', label: 'Backup', icon: Database },
    { id: 'performance', label: 'Performance', icon: RefreshCw }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleResetSettings}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSaveSettings}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Settings Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center space-x-2"
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{tab.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Settings Content */}
      <div className="space-y-6">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic site configuration and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={settings.siteName}
                      onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="siteDescription">Site Description</Label>
                    <Input
                      id="siteDescription"
                      value={settings.siteDescription}
                      onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Temporarily disable access to the site
                      </p>
                    </div>
                    <Switch
                      id="maintenanceMode"
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allowRegistration">Allow Registration</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow new users to register accounts
                      </p>
                    </div>
                    <Switch
                      id="allowRegistration"
                      checked={settings.allowRegistration}
                      onCheckedChange={(checked) => setSettings({...settings, allowRegistration: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="requireEmailVerification">Email Verification</Label>
                      <p className="text-sm text-muted-foreground">
                        Require email verification for new accounts
                      </p>
                    </div>
                    <Switch
                      id="requireEmailVerification"
                      checked={settings.requireEmailVerification}
                      onCheckedChange={(checked) => setSettings({...settings, requireEmailVerification: checked})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Configuration</CardTitle>
                <CardDescription>Default settings for quiz behavior and limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="defaultQuizTimeLimit">Default Time Limit (minutes)</Label>
                    <Input
                      id="defaultQuizTimeLimit"
                      type="number"
                      value={settings.defaultQuizTimeLimit}
                      onChange={(e) => setSettings({...settings, defaultQuizTimeLimit: parseInt(e.target.value) || 60})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxQuestionsPerQuiz">Max Questions per Quiz</Label>
                    <Input
                      id="maxQuestionsPerQuiz"
                      type="number"
                      value={settings.maxQuestionsPerQuiz}
                      onChange={(e) => setSettings({...settings, maxQuestionsPerQuiz: parseInt(e.target.value) || 50})}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allowRetakes">Allow Quiz Retakes</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow students to retake quizzes
                      </p>
                    </div>
                    <Switch
                      id="allowRetakes"
                      checked={settings.allowRetakes}