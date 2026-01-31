import React, { useState, useMemo } from 'react';
import {
    CheckSquare,
    Plus,
    Filter,
    Search,
    PhoneCall,
    Mail,
    Calendar,
    Clock,
    Tag,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import useTaskStore from '@/store/taskStore';
import useCRMStore from '@/store/crmStore';
import useAuthStore from '@/store/authStore';
import useSalesStore from '@/store/salesStore';

const SalesTasks = () => {
    const { user } = useAuthStore();
    const { salesReps, getSalesRepByEmail } = useSalesStore();
    const { followUps, leads } = useCRMStore();
    const { tasks, addTask, updateTask, deleteTask } = useTaskStore();

    // State for filtering and sorting tasks
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedPriority, setSelectedPriority] = useState('all');
    const [sortBy, setSortBy] = useState('deadline');
    const [sortOrder, setSortOrder] = useState('asc');
    const [activeTab, setActiveTab] = useState('tasks');

    // Get current sales rep data
    const salesRep = useMemo(() => {
        return getSalesRepByEmail(user?.email);
    }, [user?.email, getSalesRepByEmail]);

    // Filter and sort sales tasks
    const filteredTasks = useMemo(() => {
        return tasks
            .filter(task => {
                // Filter tasks assigned to the current sales rep
                // Determine user ID - mock sales rep or auth user
                const userId = salesRep?.id || user?.id || '1';
                const isAssigned = task.assignedTo?.some(id => id === userId || id === '1'); // Allow '1' for demo visibility
                const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
                const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
                return isAssigned && matchesSearch && matchesStatus && matchesPriority;
            })
            .sort((a, b) => {
                let aVal, bVal;
                switch (sortBy) {
                    case 'title':
                        aVal = a.title.toLowerCase();
                        bVal = b.title.toLowerCase();
                        break;
                    case 'deadline':
                        aVal = new Date(a.deadline);
                        bVal = new Date(b.deadline);
                        break;
                    case 'priority':
                        const priorityOrder = { low: 1, medium: 2, high: 3, urgent: 4 };
                        aVal = priorityOrder[a.priority] || 0;
                        bVal = priorityOrder[b.priority] || 0;
                        break;
                    case 'status':
                        const statusOrder = { pending: 1, in_progress: 2, completed: 3 };
                        aVal = statusOrder[a.status] || 0;
                        bVal = statusOrder[b.status] || 0;
                        break;
                    default:
                        aVal = new Date(a.deadline);
                        bVal = new Date(b.deadline);
                }
                if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
    }, [tasks, searchTerm, selectedStatus, selectedPriority, sortBy, sortOrder, salesRep?.id, user?.id]);

    // Get recent sales activities (mapped from CRM followUps)
    const recentActivities = useMemo(() => {
        const sortedFollowUps = [...followUps].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return sortedFollowUps.slice(0, 10).map(fup => {
            const lead = leads.find(l => l.id === fup.leadId);
            return {
                id: fup.id,
                type: fup.type?.toLowerCase() || 'call',
                title: fup.type ? `${fup.type} with ${lead?.name || 'Unknown Client'}` : 'Follow-up',
                description: fup.notes || 'No notes',
                date: fup.scheduledAt || fup.createdAt,
                duration: fup.duration,
                outcome: fup.outcome || 'Pending',
                leadName: lead?.name
            };
        });
    }, [followUps, leads]);

    // Calculate task statistics
    const taskStats = useMemo(() => {
        const totalTasks = filteredTasks.length;
        const pendingTasks = filteredTasks.filter(t => t.status === 'pending').length;
        const inProgressTasks = filteredTasks.filter(t => t.status === 'in_progress').length;
        const completedTasks = filteredTasks.filter(t => t.status === 'completed').length;
        const highPriorityTasks = filteredTasks.filter(t => t.priority === 'high' || t.priority === 'urgent').length;

        return {
            totalTasks,
            pendingTasks,
            inProgressTasks,
            completedTasks,
            highPriorityTasks
        };
    }, [filteredTasks]);

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const handleAddTask = () => {
        const title = window.prompt("Enter Task Title:");
        if (!title) return;

        const priority = window.prompt("Priority (low, medium, high):", "medium");
        const deadline = window.prompt("Deadline (YYYY-MM-DD):", new Date().toISOString().split('T')[0]);

        const newTask = {
            title,
            priority: priority || 'medium',
            deadline: deadline ? new Date(deadline).toISOString() : new Date().toISOString(),
            status: 'pending',
            assignedTo: [user?.id],
            description: 'Created via Sales Tasks',
            createdBy: user?.id
        };
        addTask(newTask);
        alert('Task added successfully');
    };

    const handleTaskStatusChange = (taskId, newStatus) => {
        updateTask(taskId, { status: newStatus });
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'call':
                return <PhoneCall size={16} className="text-blue-500" />;
            case 'email':
                return <Mail size={16} className="text-purple-500" />;
            case 'meeting':
                return <Calendar size={16} className="text-emerald-500" />;
            default:
                return <Clock size={16} className="text-slate-400" />;
        }
    };

    const getActivityColor = (type) => {
        switch (type) {
            case 'call':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'email':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
            case 'meeting':
                return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
            default:
                return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400';
        }
    };

    const getPriorityBadgeVariant = (priority) => {
        switch (priority) {
            case 'high':
            case 'urgent':
                return 'destructive';
            case 'medium':
                return 'warning';
            case 'low':
                return 'secondary';
            default:
                return 'default';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Sales Tasks & Activities</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your sales tasks and track client interactions</p>
                </div>
                <Button className="gap-2" onClick={handleAddTask}>
                    <Plus size={16} />
                    New Task
                </Button>
            </div>

            {/* Task Statistics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card className="border-none shadow-sm">
                    <CardContent className="p-4">
                        <div className="text-sm font-medium text-slate-500">Total Tasks</div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{taskStats.totalTasks}</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                    <CardContent className="p-4">
                        <div className="text-sm font-medium text-slate-500">Pending</div>
                        <div className="text-2xl font-bold text-amber-600">{taskStats.pendingTasks}</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                    <CardContent className="p-4">
                        <div className="text-sm font-medium text-slate-500">In Progress</div>
                        <div className="text-2xl font-bold text-blue-600">{taskStats.inProgressTasks}</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                    <CardContent className="p-4">
                        <div className="text-sm font-medium text-slate-500">Completed</div>
                        <div className="text-2xl font-bold text-emerald-600">{taskStats.completedTasks}</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                    <CardContent className="p-4">
                        <div className="text-sm font-medium text-slate-500">High Priority</div>
                        <div className="text-2xl font-bold text-red-600">{taskStats.highPriorityTasks}</div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="tasks" onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    <TabsTrigger value="activities">Activities</TabsTrigger>
                </TabsList>

                <TabsContent value="tasks">
                    <Card className="border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-bold">My Sales Tasks</CardTitle>
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Search tasks..."
                                        className="pl-8 w-[200px]"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue placeholder="Priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Priorities</SelectItem>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="urgent">Urgent</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" size="icon">
                                    <Filter size={16} />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Task ID</TableHead>
                                            <TableHead>Title</TableHead>
                                            <TableHead onClick={() => handleSort('priority')} className="cursor-pointer">
                                                <div className="flex items-center gap-1">
                                                    Priority
                                                    {sortBy === 'priority' && (
                                                        sortOrder === 'asc' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />
                                                    )}
                                                </div>
                                            </TableHead>
                                            <TableHead onClick={() => handleSort('deadline')} className="cursor-pointer">
                                                <div className="flex items-center gap-1">
                                                    Deadline
                                                    {sortBy === 'deadline' && (
                                                        sortOrder === 'asc' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />
                                                    )}
                                                </div>
                                            </TableHead>
                                            <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
                                                <div className="flex items-center gap-1">
                                                    Status
                                                    {sortBy === 'status' && (
                                                        sortOrder === 'asc' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />
                                                    )}
                                                </div>
                                            </TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredTasks.map((task) => (
                                            <TableRow key={task.id}>
                                                <TableCell className="font-medium">{task.id}</TableCell>
                                                <TableCell className="font-medium">{task.title}</TableCell>
                                                <TableCell>
                                                    <Badge variant={getPriorityBadgeVariant(task.priority)}>
                                                        {task.priority}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{new Date(task.deadline).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        task.status === 'completed' ? 'default' :
                                                            task.status === 'in_progress' ? 'secondary' : 'outline'
                                                    }>
                                                        {task.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleTaskStatusChange(task.id, task.status === 'completed' ? 'pending' : 'completed')}
                                                        >
                                                            {task.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="activities">
                    <Card className="border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-bold">Recent Sales Activities</CardTitle>
                            <Button variant="ghost" size="sm">View All</Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex items-start gap-3 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                                        <div className="mt-1">
                                            {getActivityIcon(activity.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="text-sm font-medium text-slate-900 dark:text-white">{activity.title}</h4>
                                                <Badge className={getActivityColor(activity.type)}>
                                                    {activity.type}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-slate-500 mb-2">{activity.description}</p>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                                                <div className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {new Date(activity.date).toLocaleString()}
                                                    {activity.duration && (
                                                        <span>• {activity.duration} min</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Badge variant="secondary" size="sm">
                                                        {activity.outcome}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SalesTasks;