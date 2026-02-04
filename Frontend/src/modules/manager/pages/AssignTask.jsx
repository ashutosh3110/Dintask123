import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar as CalendarIcon,
    CheckSquare,
    AlertCircle,
    User,
    AlignLeft,
    Type,
    Flag,
    Plus,
    Save
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Calendar } from '@/shared/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { cn } from '@/shared/utils/cn';

import useAuthStore from '@/store/authStore';
import useTaskStore from '@/store/taskStore';
import useEmployeeStore from '@/store/employeeStore';
import useNotificationStore from '@/store/notificationStore';

const AssignTask = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const addTask = useTaskStore(state => state.addTask);
    const employees = useEmployeeStore(state => state.employees);
    const addNotification = useNotificationStore(state => state.addNotification);

    // Filter employees managed by the current user
    const subEmployees = employees.filter(e => e.managerId === user?.id);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [date, setDate] = useState();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        assignedTo: '',
        labels: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.assignedTo || !date) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));

            const newTask = {
                title: formData.title,
                description: formData.description,
                deadline: date.toISOString(),
                priority: formData.priority,
                status: 'pending',
                assignedTo: [formData.assignedTo], // Array of IDs
                assignedBy: user.id || 'manager',
                assignedToManager: user.id, // Keeping it within manager's scope
                delegatedBy: user.id, // Explicitly marked as delegated/assigned by manager
                createdAt: new Date().toISOString(),
                progress: 0,
                labels: formData.labels.split(',').map(l => l.trim()).filter(l => l),
                activity: [
                    {
                        type: 'system',
                        user: user.name || 'Manager',
                        content: 'created and assigned this task',
                        time: 'Just now'
                    }
                ]
            };

            addTask(newTask);

            // Send notification to the assignee
            addNotification({
                title: 'New Task Assigned',
                description: `You have been assigned: "${newTask.title}" by ${user.name}`,
                category: 'task',
                recipientId: formData.assignedTo
            });

            toast.success("Task assigned successfully!");
            navigate('/manager/delegation'); // Redirect to delegation view
        } catch (error) {
            toast.error("Failed to assign task");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col gap-2">
                <Button
                    variant="ghost"
                    className="w-fit p-0 h-auto hover:bg-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 mb-2"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </Button>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Assign New Task</h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Create a new task and assign it directly to a team member.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>Task Details</CardTitle>
                            <CardDescription>Enter the core information for this task.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="flex items-center gap-2">
                                    <Type size={14} className="text-slate-400" />
                                    Task Title <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="e.g. Update Q3 Financial Report"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="dark:bg-slate-900"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="flex items-center gap-2">
                                    <AlignLeft size={14} className="text-slate-400" />
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Provide detailed instructions..."
                                    className="min-h-[120px] dark:bg-slate-900 resize-none"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <AlertCircle size={14} className="text-slate-400" />
                                        Priority
                                    </Label>
                                    <Select
                                        value={formData.priority}
                                        onValueChange={(val) => handleSelectChange('priority', val)}
                                    >
                                        <SelectTrigger className="dark:bg-slate-900">
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low Priority</SelectItem>
                                            <SelectItem value="medium">Medium Priority</SelectItem>
                                            <SelectItem value="high">High Priority</SelectItem>
                                            <SelectItem value="urgent">Urgent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="labels" className="flex items-center gap-2">
                                        <Flag size={14} className="text-slate-400" />
                                        Labels (comma separated)
                                    </Label>
                                    <Input
                                        id="labels"
                                        name="labels"
                                        placeholder="Design, Urgent, Review"
                                        value={formData.labels}
                                        onChange={handleInputChange}
                                        className="dark:bg-slate-900"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Controls */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>Assignment</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <User size={14} className="text-slate-400" />
                                    Assign To <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.assignedTo}
                                    onValueChange={(val) => handleSelectChange('assignedTo', val)}
                                >
                                    <SelectTrigger className="h-14 dark:bg-slate-900">
                                        <SelectValue placeholder="Select team member" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subEmployees.length > 0 ? (
                                            subEmployees.map(emp => (
                                                <SelectItem key={emp.id} value={emp.id}>
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarImage src={emp.avatar} />
                                                            <AvatarFallback>{emp.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <span>{emp.name}</span>
                                                    </div>
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div className="p-2 text-xs text-center text-slate-500">No team members found</div>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <CalendarIcon size={14} className="text-slate-400" />
                                    Due Date <span className="text-red-500">*</span>
                                </Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal dark:bg-slate-900",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <Button
                                className="w-full h-12 gap-2 text-md font-bold mt-4"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>Assigning...</>
                                ) : (
                                    <>
                                        <Plus size={18} /> Assign Task
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
            {/* Recent Assignments */}
            <div className="mt-8">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">Recent Assignments</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {useTaskStore(state => state.tasks)
                        .filter(t => t.delegatedBy === user?.id)
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .slice(0, 3)
                        .map(task => {
                            const assignee = employees.find(e => task.assignedTo?.includes(e.id));
                            return (
                                <Card key={task.id} className="border-none shadow-sm hover:shadow-md transition-shadow group">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary-600 transition-colors">{task.title}</h3>
                                            <span className={cn(
                                                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border",
                                                task.priority === 'urgent' ? "bg-red-50 text-red-600 border-red-100" :
                                                    task.priority === 'high' ? "bg-orange-50 text-orange-600 border-orange-100" :
                                                        task.priority === 'medium' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                            "bg-slate-50 text-slate-500 border-slate-100"
                                            )}>
                                                {task.priority}
                                            </span>
                                        </div>
                                        <CardDescription className="line-clamp-2 text-xs mt-1">
                                            {task.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src={assignee?.avatar} />
                                                    <AvatarFallback>{assignee?.name?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                                    {assignee?.name || 'Unassigned'}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-slate-400">
                                                {new Date(task.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                </div>
            </div>
        </div>
    );
};

export default AssignTask;
