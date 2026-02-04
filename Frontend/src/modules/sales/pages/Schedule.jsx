import React, { useState, useMemo } from 'react';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Plus,
    Clock,
    Search,
    Filter,
    Phone,
    Video,
    Briefcase,
    CheckSquare,
    Users
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import useAuthStore from '@/store/authStore';
import useTaskStore from '@/store/taskStore';
import useScheduleStore from '@/store/scheduleStore';
import useCRMStore from '@/store/crmStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/utils/cn';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Calendar } from "@/shared/components/ui/calendar";
import { toast } from "sonner";

const SalesSchedule = () => {
    const { user } = useAuthStore();
    const { tasks } = useTaskStore();
    const { schedules, addScheduleEvent, deleteScheduleEvent } = useScheduleStore();
    const { followUps, leads } = useCRMStore();

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedFilter, setSelectedFilter] = useState('all'); // all, meeting, call, task

    // Modal States
    const [isAddEventOpen, setIsAddEventOpen] = useState(false);
    const [isViewEventOpen, setIsViewEventOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Form State
    const [newEventData, setNewEventData] = useState({
        title: '',
        description: '',
        date: new Date(),
        time: '09:00',
        type: 'meeting', // meeting, call, task, other
        participants: [],
        assignedTo: ''
    });

    // Calendar logic
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const getDailyEvents = (day) => {
        // 1. Tasks assigned to user (or demo user '1') with deadline on this day
        const myTasks = tasks.filter(t => {
            const isAssigned = t.assignedTo?.some(id => id === user?.id || id === '1');
            return isAssigned && t.deadline && isSameDay(new Date(t.deadline), day);
        }).map(t => ({
            ...t,
            id: t.id,
            title: t.title,
            type: 'task',
            time: format(new Date(t.deadline), 'HH:mm'),
            date: t.deadline
        }));

        // 2. Schedule events (custom)
        const mySchedules = schedules.filter(s =>
            // Filter by user normally, for demo showing all
            isSameDay(new Date(s.date), day)
        ).map(s => ({
            ...s,
            source: 'schedule'
        }));

        // 3. CRM Follow-ups (calls/meetings)
        const myFollowUps = followUps.filter(f =>
            f.scheduledAt && isSameDay(new Date(f.scheduledAt), day)
        ).map(f => {
            const lead = leads.find(l => l.id === f.leadId);
            return {
                id: f.id,
                title: `${f.type === 'meeting' ? 'Meeting' : 'Call'} with ${lead?.name || 'Lead'}`,
                description: f.notes,
                type: f.type === 'meeting' ? 'meeting' : 'call',
                time: format(new Date(f.scheduledAt), 'HH:mm'),
                date: f.scheduledAt,
                source: 'crm'
            };
        });

        // Combine all
        let allEvents = [...myTasks, ...mySchedules, ...myFollowUps];

        // Apply filters
        if (selectedFilter !== 'all') {
            allEvents = allEvents.filter(e => e.type === selectedFilter);
        }

        return allEvents.sort((a, b) => {
            return (a.time || '00:00').localeCompare(b.time || '00:00');
        });
    };

    const handleCreateEvent = () => {
        if (!newEventData.title || !newEventData.date) {
            toast.error("Please fill in the required fields");
            return;
        }

        const event = {
            ...newEventData,
            managerId: user?.id, // Using same field for ownership
            date: newEventData.date.toISOString(),
        };

        addScheduleEvent(event);
        toast.success("Event created successfully");
        setIsAddEventOpen(false);
        setNewEventData({
            title: '',
            description: '',
            date: new Date(),
            time: '09:00',
            type: 'meeting',
            participants: [],
            assignedTo: ''
        });
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setIsViewEventOpen(true);
    };

    const handleDeleteEvent = () => {
        if (selectedEvent?.source === 'crm') {
            toast.error("Manage follow-ups in the Deals or Leads section.");
            return;
        }
        if (selectedEvent?.type === 'task') {
            toast.error("Cannot delete tasks from schedule view. Go to Tasks.");
            return;
        }
        deleteScheduleEvent(selectedEvent.id);
        toast.success("Event deleted");
        setIsViewEventOpen(false);
    };

    const getEventTypeColor = (type) => {
        switch (type) {
            case 'meeting': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
            case 'call': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
            case 'task': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
            default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-left">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Review Schedule</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Manage your appointments, calls, and deadlines.
                    </p>
                </div>
                <Button className="gap-2" onClick={() => setIsAddEventOpen(true)}>
                    <Plus size={18} />
                    New Event
                </Button>
            </div>

            <div className="grid gap-8 lg:grid-cols-4">
                {/* Filters/Sidebar */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Filters</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button
                                variant={selectedFilter === 'all' ? 'default' : 'outline'}
                                className="w-full justify-start gap-2 h-10 rounded-xl"
                                onClick={() => setSelectedFilter('all')}
                            >
                                <CalendarIcon size={16} /> All Events
                            </Button>
                            <Button
                                variant={selectedFilter === 'meeting' ? 'default' : 'outline'}
                                className="w-full justify-start gap-2 h-10 rounded-xl"
                                onClick={() => setSelectedFilter('meeting')}
                            >
                                <Video size={16} /> Meetings
                            </Button>
                            <Button
                                variant={selectedFilter === 'call' ? 'default' : 'outline'}
                                className="w-full justify-start gap-2 h-10 rounded-xl"
                                onClick={() => setSelectedFilter('call')}
                            >
                                <Phone size={16} /> Calls
                            </Button>
                            <Button
                                variant={selectedFilter === 'task' ? 'default' : 'outline'}
                                className="w-full justify-start gap-2 h-10 rounded-xl"
                                onClick={() => setSelectedFilter('task')}
                            >
                                <CheckSquare size={16} /> Tasks
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-primary-600 text-white overflow-hidden">
                        <CardContent className="p-6 space-y-4">
                            <Clock size={32} className="opacity-50" />
                            <div>
                                <h3 className="font-bold text-lg">Next Up</h3>
                                <p className="text-xs text-primary-100 mt-1">Check your upcoming client meeting at 2:00 PM.</p>
                            </div>
                            <Button variant="secondary" size="sm" className="w-full font-bold text-primary-600">View Details</Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Calendar Grid */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            {format(currentDate, 'MMMM yyyy')}
                        </h2>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
                                <ChevronLeft size={20} />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>Today</Button>
                            <Button variant="ghost" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
                                <ChevronRight size={20} />
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                <div key={day} className="p-4 text-center text-xs font-black text-slate-400 uppercase tracking-widest font-display">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7">
                            {calendarDays.map((day, idx) => {
                                const events = getDailyEvents(day);
                                return (
                                    <div
                                        key={day.toString()}
                                        className={cn(
                                            "min-h-[120px] p-2 border-r border-b border-slate-50 dark:border-slate-800 last:border-r-0 transition-colors",
                                            !isSameMonth(day, monthStart) ? "bg-slate-50/20 dark:bg-slate-800/10 opacity-30" : "hover:bg-slate-50/50 dark:hover:bg-slate-800/30",
                                            isSameDay(day, new Date()) && "bg-primary-50/30 dark:bg-primary-900/10"
                                        )}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className={cn(
                                                "text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full leading-none transition-all",
                                                isSameDay(day, new Date()) ? "bg-primary-600 text-white" : "text-slate-400 group-hover:text-slate-900"
                                            )}>
                                                {format(day, 'd')}
                                            </span>
                                            {events.length > 0 && (
                                                <Badge className="h-4 px-1.5 text-[8px] bg-primary-100 text-primary-600 border-none font-black uppercase">
                                                    {events.length}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="space-y-1 overflow-hidden">
                                            {events.slice(0, 3).map((event, eIdx) => (
                                                <div
                                                    key={eIdx}
                                                    onClick={() => handleEventClick(event)}
                                                    className={cn(
                                                        "px-1.5 py-0.5 rounded text-[8px] font-bold truncate transition-all cursor-pointer hover:opacity-80",
                                                        getEventTypeColor(event.type)
                                                    )}>
                                                    {event.time && <span className="mr-1 opacity-75">{event.time}</span>}
                                                    {event.title}
                                                </div>
                                            ))}
                                            {events.length > 3 && (
                                                <div className="text-[8px] font-bold text-slate-400 pl-1">
                                                    + {events.length - 3} more
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Event Dialog */}
            <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Event</DialogTitle>
                        <DialogDescription>
                            Schedule a new meeting, call, or reminder.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Event Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g., Client Lunch with XYZ Corp"
                                value={newEventData.title}
                                onChange={(e) => setNewEventData({ ...newEventData, title: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !newEventData.date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {newEventData.date ? format(newEventData.date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={newEventData.date}
                                            onSelect={(date) => setNewEventData({ ...newEventData, date: date })}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="time">Time</Label>
                                <Input
                                    id="time"
                                    type="time"
                                    value={newEventData.time}
                                    onChange={(e) => setNewEventData({ ...newEventData, time: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="type">Event Type</Label>
                            <Select
                                value={newEventData.type}
                                onValueChange={(value) => setNewEventData({ ...newEventData, type: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="meeting">Meeting</SelectItem>
                                    <SelectItem value="call">Call</SelectItem>
                                    <SelectItem value="deadline">Deadline</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="assignedTo">Assign To (Admin/Manager/Employee)</Label>
                            <Input
                                id="assignedTo"
                                placeholder="Type recipient name or role..."
                                value={newEventData.assignedTo}
                                onChange={(e) => setNewEventData({ ...newEventData, assignedTo: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Add details..."
                                value={newEventData.description}
                                onChange={(e) => setNewEventData({ ...newEventData, description: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateEvent}>Create Event</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View/Edit Event Dialog */}
            <Dialog open={isViewEventOpen} onOpenChange={setIsViewEventOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedEvent?.title}</DialogTitle>
                        <DialogDescription>
                            {selectedEvent?.date && format(new Date(selectedEvent.date), "PPP")} at {selectedEvent?.time}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="flex items-center gap-2">
                            <Badge className={cn("uppercase tracking-widest text-[10px]", getEventTypeColor(selectedEvent?.type || 'other'))}>
                                {selectedEvent?.type}
                            </Badge>
                            {selectedEvent?.source === 'crm' && (
                                <Badge variant="outline" className="text-[10px]">
                                    CRM
                                </Badge>
                            )}
                        </div>

                        {selectedEvent?.assignedTo && (
                            <div className="flex items-center gap-2 text-sm font-bold text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-3 py-2 rounded-xl">
                                <Users size={16} />
                                Assigned to: {selectedEvent.assignedTo}
                            </div>
                        )}

                        {selectedEvent?.description && (
                            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-sm text-slate-600 dark:text-slate-300">
                                {selectedEvent.description}
                            </div>
                        )}

                        <div className="text-xs text-slate-500">
                            Source: {selectedEvent?.source === 'crm' ? 'CRM Integration' : selectedEvent?.type === 'task' ? 'Task Manager' : 'Manual Entry'}
                        </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        {/* Only allow deleting manual events */}
                        {selectedEvent?.source === 'schedule' && (
                            <Button variant="destructive" onClick={handleDeleteEvent}>Delete Event</Button>
                        )}
                        <Button variant="outline" onClick={() => setIsViewEventOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SalesSchedule;