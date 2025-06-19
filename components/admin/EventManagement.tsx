'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  Users, 
  Trophy,
  Search,
  Filter,
  Play,
  Pause,
  Square,
  Clock,
  Target
} from 'lucide-react';
import { toast } from 'sonner';

export function EventManagement() {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Mid-Semester Quiz Competition',
      description: 'A competitive quiz event for all Computer Science students to test their knowledge across multiple courses.',
      type: 'competition',
      department: 'Computer Science',
      startDate: '2024-02-15',
      endDate: '2024-02-20',
      startTime: '10:00',
      endTime: '16:00',
      maxParticipants: 100,
      currentParticipants: 67,
      courses: ['CSC 201', 'CSC 301'],
      prizes: ['₦50,000', '₦30,000', '₦20,000'],
      status: 'active',
      isPublic: true,
      requiresRegistration: true,
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      title: 'Engineering Mathematics Challenge',
      description: 'Test your mathematical skills in this challenging quiz covering calculus, linear algebra, and differential equations.',
      type: 'challenge',
      department: 'Engineering',
      startDate: '2024-02-25',
      endDate: '2024-02-25',
      startTime: '14:00',
      endTime: '16:00',
      maxParticipants: 50,
      currentParticipants: 23,
      courses: ['ENG 201', 'ENG 301'],
      prizes: ['Certificate', 'Badge'],
      status: 'upcoming',
      isPublic: true,
      requiresRegistration: false,
      createdAt: '2024-01-20'
    },
    {
      id: 3,
      title: 'Weekly Practice Session',
      description: 'Regular practice session for students to improve their quiz-taking skills.',
      type: 'practice',
      department: 'All Departments',
      startDate: '2024-02-10',
      endDate: '2024-02-10',
      startTime: '09:00',
      endTime: '11:00',
      maxParticipants: 200,
      currentParticipants: 156,
      courses: ['All Courses'],
      prizes: [],
      status: 'completed',
      isPublic: true,
      requiresRegistration: false,
      createdAt: '2024-01-05'
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: 'competition',
    department: '',
    startDate: '',
    endDate: '',
    startTime: '10:00',
    endTime: '16:00',
    maxParticipants: 100,
    courses: [] as string[],
    prizes: [] as string[],
    isPublic: true,
    requiresRegistration: true
  });

  const departments = [
    'All Departments',
    'Computer Science',
    'Engineering',
    'Medicine',
    'Law',
    'Business Administration',
    'Sciences',
    'Arts',
    'Education'
  ];

  const eventTypes = [
    { value: 'competition', label: 'Competition' },
    { value: 'challenge', label: 'Challenge' },
    { value: 'practice', label: 'Practice Session' },
    { value: 'tournament', label: 'Tournament' }
  ];

  const courses = [
    'CSC 201', 'CSC 301', 'CSC 401', 'CSC 402',
    'ENG 201', 'ENG 301', 'MED 201', 'LAW 201'
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || event.status === filterStatus;
    const matchesType = filterType === 'ALL' || event.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.department || !newEvent.startDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const event = {
      id: Date.now(),
      ...newEvent,
      currentParticipants: 0,
      status: 'upcoming',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setEvents([...events, event]);
    setNewEvent({
      title: '',
      description: '',
      type: 'competition',
      department: '',
      startDate: '',
      endDate: '',
      startTime: '10:00',
      endTime: '16:00',
      maxParticipants: 100,
      courses: [],
      prizes: [],
      isPublic: true,
      requiresRegistration: true
    });
    setIsAddDialogOpen(false);
    toast.success('Event created successfully!');
  };

  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
    setNewEvent({
      title: event.title,
      description: event.description,
      type: event.type,
      department: event.department,
      startDate: event.startDate,
      endDate: event.endDate,
      startTime: event.startTime,
      endTime: event.endTime,
      maxParticipants: event.maxParticipants,
      courses: event.courses,
      prizes: event.prizes,
      isPublic: event.isPublic,
      requiresRegistration: event.requiresRegistration
    });
  };

  const handleUpdateEvent = () => {
    if (!editingEvent) return;

    setEvents(events.map(event => 
      event.id === editingEvent.id 
        ? { ...event, ...newEvent }
        : event
    ));
    
    setEditingEvent(null);
    setNewEvent({
      title: '',
      description: '',
      type: 'competition',
      department: '',
      startDate: '',
      endDate: '',
      startTime: '10:00',
      endTime: '16:00',
      maxParticipants: 100,
      courses: [],
      prizes: [],
      isPublic: true,
      requiresRegistration: true
    });
    toast.success('Event updated successfully!');
  };

  const handleDeleteEvent = (eventId: number) => {
    setEvents(events.filter(event => event.id !== eventId));
    toast.success('Event deleted successfully!');
  };

  const handleEventAction = (eventId: number, action: string) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        switch (action) {
          case 'start':
            return { ...event, status: 'active' };
          case 'pause':
            return { ...event, status: 'paused' };
          case 'end':
            return { ...event, status: 'completed' };
          default:
            return event;
        }
      }
      return event;
    }));
    toast.success(`Event ${action}ed successfully!`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'competition': return 'bg-purple-100 text-purple-800';
      case 'challenge': return 'bg-orange-100 text-orange-800';
      case 'practice': return 'bg-blue-100 text-blue-800';
      case 'tournament': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="h-4 w-4" />;
      case 'paused': return <Pause className="h-4 w-4" />;
      case 'completed': return <Square className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Event Management</h1>
          <p className="text-muted-foreground">Create and manage quiz competitions, challenges, and practice sessions</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Set up a new quiz event for students
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Mid-Semester Quiz Competition"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Event Type</Label>
                  <Select value={newEvent.type} onValueChange={(value) => setNewEvent({...newEvent, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select value={newEvent.department} onValueChange={(value) => setNewEvent({...newEvent, department: value})}>
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
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newEvent.startDate}
                    onChange={(e) => setNewEvent({...newEvent, startDate: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newEvent.endDate}
                    onChange={(e) => setNewEvent({...newEvent, endDate: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={newEvent.maxParticipants}
                    onChange={(e) => setNewEvent({...newEvent, maxParticipants: parseInt(e.target.value) || 100})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the event, rules, and objectives..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isPublic">Public Event</Label>
                    <p className="text-sm text-muted-foreground">
                      Make this event visible to all students
                    </p>
                  </div>
                  <Switch
                    id="isPublic"
                    checked={newEvent.isPublic}
                    onCheckedChange={(checked) => setNewEvent({...newEvent, isPublic: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="requiresRegistration">Requires Registration</Label>
                    <p className="text-sm text-muted-foreground">
                      Students must register before participating
                    </p>
                  </div>
                  <Switch
                    id="requiresRegistration"
                    checked={newEvent.requiresRegistration}
                    onCheckedChange={(checked) => setNewEvent({...newEvent, requiresRegistration: checked})}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEvent}>
                Create Event
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
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="w-32">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-40">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="card-hover">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(event.status)}>
                      {getStatusIcon(event.status)}
                      <span className="ml-1">{event.status}</span>
                    </Badge>
                    <Badge className={getTypeColor(event.type)}>
                      {event.type}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <CardDescription>{event.department}</CardDescription>
                </div>
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {event.description}
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{event.startDate} {event.endDate && event.endDate !== event.startDate && `- ${event.endDate}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span>{event.startTime} - {event.endTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Participants:</span>
                  <span>{event.currentParticipants}/{event.maxParticipants}</span>
                </div>
              </div>
              
              {event.prizes.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">Prizes</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {event.prizes.map((prize, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {prize}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex space-x-2">
                {event.status === 'upcoming' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEventAction(event.id, 'start')}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Start
                  </Button>
                )}
                
                {event.status === 'active' && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEventAction(event.id, 'pause')}
                    >
                      <Pause className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEventAction(event.id, 'end')}
                    >
                      <Square className="h-4 w-4" />
                    </Button>
                  </>
                )}
                
                {event.status === 'paused' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEventAction(event.id, 'start')}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditEvent(event)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteEvent(event.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No events found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Edit Event Dialog */}
      <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update event information and settings
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-title">Event Title *</Label>
                <Input
                  id="edit-title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-type">Event Type</Label>
                <Select value={newEvent.type} onValueChange={(value) => setNewEvent({...newEvent, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-department">Department *</Label>
                <Select value={newEvent.department} onValueChange={(value) => setNewEvent({...newEvent, department: value})}>
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
                <Label htmlFor="edit-startDate">Start Date *</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={newEvent.startDate}
                  onChange={(e) => setNewEvent({...newEvent, startDate: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-endDate">End Date</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={newEvent.endDate}
                  onChange={(e) => setNewEvent({...newEvent, endDate: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-startTime">Start Time</Label>
                <Input
                  id="edit-startTime"
                  type="time"
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-endTime">End Time</Label>
                <Input
                  id="edit-endTime"
                  type="time"
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-maxParticipants">Max Participants</Label>
                <Input
                  id="edit-maxParticipants"
                  type="number"
                  value={newEvent.maxParticipants}
                  onChange={(e) => setNewEvent({...newEvent, maxParticipants: parseInt(e.target.value) || 100})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                rows={3}
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="edit-isPublic">Public Event</Label>
                  <p className="text-sm text-muted-foreground">
                    Make this event visible to all students
                  </p>
                </div>
                <Switch
                  id="edit-isPublic"
                  checked={newEvent.isPublic}
                  onCheckedChange={(checked) => setNewEvent({...newEvent, isPublic: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="edit-requiresRegistration">Requires Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Students must register before participating
                  </p>
                </div>
                <Switch
                  id="edit-requiresRegistration"
                  checked={newEvent.requiresRegistration}
                  onCheckedChange={(checked) => setNewEvent({...newEvent, requiresRegistration: checked})}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setEditingEvent(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateEvent}>
              Update Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}