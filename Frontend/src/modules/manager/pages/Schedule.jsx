import React, { useState, useMemo } from 'react';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Plus,
    Clock,
    Users,
    Search,
    Filter
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '@/store/authStore';
import useEmployeeStore from '@/store/employeeStore';
import useTaskStore from '@/store/taskStore';
import useScheduleStore from '@/store/scheduleStore';
import { fadeInUp, staggerContainer } from '@/shared/utils/animations';
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

const ManagerSchedule = () => {
    const { user } = useAuthStore();
    const employees = useEmployeeStore(state => state.employees);
    const tasks = useTaskStore(state => state.tasks);
    const { schedules, addScheduleEvent, deleteScheduleEvent } = useScheduleStore();

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedMember, setSelectedMember] = useState('all');

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
        type: 'meeting', // meeting, deadline, reminder
        participants: []
    });

    const teamMembers = useMemo(() => {
        return employees.filter(e => e.managerId === user?.id);
    }, [employees, user]);

    // Calendar logic
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const getDailyEvents = (day) => {
        const teamTasks = tasks.filter(t => (t.delegatedBy === user?.id || t.assignedToManager === user?.id) && isSameDay(new Date(t.deadline), day));
        const userSchedules = schedules.filter(s => (s.managerId === user?.id) && isSameDay(new Date(s.date), day));

        let filteredSchedules = userSchedules;
        if (selectedMember !== 'all') {
            // Filter schedules if they are targeted to a specific user (if logic supports it)
            // For now assuming schedules are general or just for manager to see. 
            // If we wanna filter tasks:
        }

        const taskEvents = teamTasks.map(t => ({ ...t, type: 'task', date: t.deadline }));
        const scheduleEvents = filteredSchedules.map(s => ({ ...s, type: s.type || 'schedule', date: s.date }));

        return [...taskEvents, ...scheduleEvents];
    };

    const handleCreateEvent = () => {
        if (!newEventData.title || !newEventData.date) {
            toast.error("Please fill in the required fields");
            return;
        }

        const event = {
            ...newEventData,
            managerId: user?.id,
            // If date is a Date object, keep it, store expects ISO string possibly? 
            // The store example uses date string. Let's ensure consistency.
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
            participants: []
        });
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setIsViewEventOpen(true);
    };

    const handleDeleteEvent = () => {
        if (selectedEvent?.type === 'task') {
            toast.error("Cannot delete tasks from schedule view. Go to Tasks.");
            return;
        }
        deleteScheduleEvent(selectedEvent.id);
        toast.success("Event deleted");
        setIsViewEventOpen(false);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-left">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Team Schedule</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Coordinate tasks and manage team availability.
                    </p>
                </div>
                <Button className="gap-2" onClick={() => setIsAddEventOpen(true)}>
                    <Plus size={18} />
                    New Schedule Event
                </Button>
            </div>

            <div className="grid gap-8 lg:grid-cols-4">
                {/* Filters/Sidebar */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Team Filter</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button
                                variant={selectedMember === 'all' ? 'default' : 'outline'}
                                className="w-full justify-start gap-2 h-10 rounded-xl"
                                onClick={() => setSelectedMember('all')}
                            >
                                <Users size={16} /> All Team
                            </Button>
                            {teamMembers.map((member) => (
                                <Button
                                    key={member.id}
                                    variant={selectedMember === member.id ? 'default' : 'outline'}
                                    className="w-full justify-start gap-2 h-10 rounded-xl"
                                    onClick={() => setSelectedMember(member.id)}
                                >
                                    <div className="w-5 h-5 rounded-full overflow-hidden">
                                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="truncate">{member.name}</span>
                                </Button>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-primary-600 text-white overflow-hidden">
                        <CardContent className="p-6 space-y-4">
                            <Clock size={32} className="opacity-50" />
                            <div>
                                <h3 className="font-bold text-lg">Daily Briefing</h3>
                                <p className="text-xs text-primary-100 mt-1">Don't forget the team sync at 10:00 AM today.</p>
                            </div>
                            <Button variant="secondary" size="sm" className="w-full font-bold text-primary-600">Join Meet</Button>
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
                                                    {events.length} Items
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
                                                        event.type === 'task' ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" :
                                                            event.type === 'meeting' ? "bg-purple-100 text-purple-600" :
                                                                "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
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
                        <DialogTitle>Add Schedule Event</DialogTitle>
                        <DialogDescription>
                            Create a new meeting, reminder, or event for your team.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Event Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g., Weekly Team Sync"
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
                                    <SelectItem value="reminder">Reminder</SelectItem>
                                    <SelectItem value="deadline">Deadline</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
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
                            <Badge variant="outline" className="uppercase tracking-widest text-[10px]">
                                {selectedEvent?.type}
                            </Badge>
                            {selectedEvent?.type === 'task' && <Badge className="bg-blue-100 text-blue-600">Task</Badge>}
                        </div>

                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            {selectedEvent?.description || "No description provided."}
                        </p>

                        {selectedEvent?.participants && selectedEvent.participants.length > 0 && (
                            <div className="flex -space-x-2 overflow-hidden">
                                {selectedEvent.participants.map((p, i) => (
                                    <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-slate-200 flex items-center justify-center text-xs font-bold">
                                        {p.charAt(0)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        {selectedEvent?.type !== 'task' && (
                            <Button variant="destructive" onClick={handleDeleteEvent}>Delete Event</Button>
                        )}
                        <Button variant="outline" onClick={() => setIsViewEventOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ManagerSchedule;
