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
                      onCheckedChange={(checked) => setSettings({...settings, allowRetakes: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="showAnswersAfterSubmission">Show Answers After Submission</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow students to see correct answers after submitting
                      </p>
                    </div>
                    <Switch
                      id="showAnswersAfterSubmission"
                      checked={settings.showAnswersAfterSubmission}
                      onCheckedChange={(checked) => setSettings({...settings, showAnswersAfterSubmission: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="randomizeQuestions">Randomize Questions</Label>
                      <p className="text-sm text-muted-foreground">
                        Show questions in random order
                      </p>
                    </div>
                    <Switch
                      id="randomizeQuestions"
                      checked={settings.randomizeQuestions}
                      onCheckedChange={(checked) => setSettings({...settings, randomizeQuestions: checked})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure security and access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value) || 30})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={settings.maxLoginAttempts}
                      onChange={(e) => setSettings({...settings, maxLoginAttempts: parseInt(e.target.value) || 5})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                    <Input
                      id="passwordMinLength"
                      type="number"
                      value={settings.passwordMinLength}
                      onChange={(e) => setSettings({...settings, passwordMinLength: parseInt(e.target.value) || 8})}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="requireStrongPasswords">Require Strong Passwords</Label>
                      <p className="text-sm text-muted-foreground">
                        Enforce complex password requirements
                      </p>
                    </div>
                    <Switch
                      id="requireStrongPasswords"
                      checked={settings.requireStrongPasswords}
                      onCheckedChange={(checked) => setSettings({...settings, requireStrongPasswords: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableTwoFactor">Enable Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to user accounts
                      </p>
                    </div>
                    <Switch
                      id="enableTwoFactor"
                      checked={settings.enableTwoFactor}
                      onCheckedChange={(checked) => setSettings({...settings, enableTwoFactor: checked})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'email' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>Configure email server and notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Email Provider</Label>
                  <Select
                    value={settings.emailProvider}
                    onValueChange={(value) => setSettings({...settings, emailProvider: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select email provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smtp">SMTP</SelectItem>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="mailgun">Mailgun</SelectItem>
                      <SelectItem value="ses">Amazon SES</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={settings.smtpHost}
                      onChange={(e) => setSettings({...settings, smtpHost: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      type="number"
                      value={settings.smtpPort}
                      onChange={(e) => setSettings({...settings, smtpPort: parseInt(e.target.value) || 587})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtpUsername">SMTP Username</Label>
                    <Input
                      id="smtpUsername"
                      value={settings.smtpUsername}
                      onChange={(e) => setSettings({...settings, smtpUsername: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={settings.smtpPassword}
                      onChange={(e) => setSettings({...settings, smtpPassword: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emailFromName">From Name</Label>
                    <Input
                      id="emailFromName"
                      value={settings.emailFromName}
                      onChange={(e) => setSettings({...settings, emailFromName: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button variant="outline" onClick={handleTestEmail}>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Test Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure system notifications and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableEmailNotifications">Enable Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send email notifications for important events
                      </p>
                    </div>
                    <Switch
                      id="enableEmailNotifications"
                      checked={settings.enableEmailNotifications}
                      onCheckedChange={(checked) => setSettings({...settings, enableEmailNotifications: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enablePushNotifications">Enable Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send browser push notifications
                      </p>
                    </div>
                    <Switch
                      id="enablePushNotifications"
                      checked={settings.enablePushNotifications}
                      onCheckedChange={(checked) => setSettings({...settings, enablePushNotifications: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifyOnNewUser">Notify on New User Registration</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notification when a new user signs up
                      </p>
                    </div>
                    <Switch
                      id="notifyOnNewUser"
                      checked={settings.notifyOnNewUser}
                      onCheckedChange={(checked) => setSettings({...settings, notifyOnNewUser: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifyOnQuizCompletion">Notify on Quiz Completion</Label>
                      <p className="text-sm text-muted-foreground">
                        Send notification when a quiz is completed
                      </p>
                    </div>
                    <Switch
                      id="notifyOnQuizCompletion"
                      checked={settings.notifyOnQuizCompletion}
                      onCheckedChange={(checked) => setSettings({...settings, notifyOnQuizCompletion: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifyOnSystemErrors">Notify on System Errors</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications for system errors
                      </p>
                    </div>
                    <Switch
                      id="notifyOnSystemErrors"
                      checked={settings.notifyOnSystemErrors}
                      onCheckedChange={(checked) => setSettings({...settings, notifyOnSystemErrors: checked})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'backup' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Backup & Restore</CardTitle>
                <CardDescription>Manage system backups and data restoration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoBackup">Automatic Backups</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable automatic database backups
                      </p>
                    </div>
                    <Switch
                      id="autoBackup"
                      checked={settings.autoBackup}
                      onCheckedChange={(checked) => setSettings({...settings, autoBackup: checked})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Backup Frequency</Label>
                      <Select
                        value={settings.backupFrequency}
                        onValueChange={(value) => setSettings({...settings, backupFrequency: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="backupRetention">Retention Period (days)</Label>
                      <Input
                        id="backupRetention"
                        type="number"
                        value={settings.backupRetention}
                        onChange={(e) => setSettings({...settings, backupRetention: parseInt(e.target.value) || 30})}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={handleBackupNow}>
                      <Database className="h-4 w-4 mr-2" />
                      Create Backup Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Settings</CardTitle>
                <CardDescription>Optimize system performance and caching</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="cacheEnabled">Enable Caching</Label>
                      <p className="text-sm text-muted-foreground">
                        Improve performance by caching frequently accessed data
                      </p>
                    </div>
                    <Switch
                      id="cacheEnabled"
                      checked={settings.cacheEnabled}
                      onCheckedChange={(checked) => setSettings({...settings, cacheEnabled: checked})}
                    />
                  </div>
                  
                  {settings.cacheEnabled && (
                    <div className="space-y-2 pl-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cacheTimeout">Cache Timeout (seconds)</Label>
                          <Input
                            id="cacheTimeout"
                            type="number"
                            value={settings.cacheTimeout}
                            onChange={(e) => setSettings({...settings, cacheTimeout: parseInt(e.target.value) || 3600})}
                          />
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <Button variant="outline" size="sm" onClick={handleClearCache}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Clear Cache Now
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="compressionEnabled">Enable Compression</Label>
                      <p className="text-sm text-muted-foreground">
                        Compress responses to reduce bandwidth usage
                      </p>
                    </div>
                    <Switch
                      id="compressionEnabled"
                      checked={settings.compressionEnabled}
                      onCheckedChange={(checked) => setSettings({...settings, compressionEnabled: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="cdnEnabled">Enable CDN</Label>
                      <p className="text-sm text-muted-foreground">
                        Use Content Delivery Network for static assets
                      </p>
                    </div>
                    <Switch
                      id="cdnEnabled"
                      checked={settings.cdnEnabled}
                      onCheckedChange={(checked) => setSettings({...settings, cdnEnabled: checked})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}