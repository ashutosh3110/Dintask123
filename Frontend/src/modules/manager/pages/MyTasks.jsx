import React, { useMemo, useState } from 'react';
import {
    CheckSquare,
    Search,
    Filter,
    Clock,
    AlertCircle,
    CheckCircle2,
    Calendar as CalendarIcon,
    ChevronRight,
    MessageSquare,
    Link as LinkIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '@/store/authStore';
import useTaskStore from '@/store/taskStore';
import { fadeInUp, staggerContainer } from '@/shared/utils/animations';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/utils/cn';

import { toast } from 'sonner';

const MyTasks = () => {
    const { user } = useAuthStore();
    const tasks = useTaskStore(state => state.tasks);
    const completeTask = useTaskStore(state => state.completeTask);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const handleCompleteTask = (taskId) => {
        completeTask(taskId, "Manager Dashboard", { completedBy: user.id });
        toast.success("Task marked as completed");
    };

    const myTasks = useMemo(() => {
        return tasks.filter(t =>
            t.assignedToManager === user?.id &&
            !t.delegatedBy // Tasks assigned to manager directly for completion
        ).filter(t => {
            const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [tasks, user, searchTerm, statusFilter]);

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent': return 'bg-red-500';
            case 'high': return 'bg-orange-500';
            case 'medium': return 'bg-blue-500';
            default: return 'bg-slate-400';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">My Personal Tasks</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Tasks assigned to you by Admin for completion.
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search my tasks..."
                        className="pl-10 h-11 border-none shadow-sm dark:bg-slate-900"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant={statusFilter === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setStatusFilter('all')}
                        className="rounded-full px-4"
                    >
                        All
                    </Button>
                    <Button
                        variant={statusFilter === 'pending' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setStatusFilter('pending')}
                        className="rounded-full px-4"
                    >
                        Pending
                    </Button>
                    <Button
                        variant={statusFilter === 'completed' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setStatusFilter('completed')}
                        className="rounded-full px-4"
                    >
                        Completed
                    </Button>
                </div>
            </div>

            {/* Task List */}
            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid gap-4"
            >
                <AnimatePresence mode="popLayout">
                    {myTasks.length > 0 ? myTasks.map((task) => (
                        <motion.div
                            key={task.id}
                            variants={fadeInUp}
                            layout
                        >
                            <Card className="border-none shadow-sm hover:shadow-md transition-shadow group overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row">
                                        <div className={cn("w-full md:w-2 transition-all duration-300", getPriorityColor(task.priority))} />
                                        <div className="flex-1 p-5">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="space-y-3 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-widest px-2">
                                                            {task.priority}
                                                        </Badge>
                                                        {task.status === 'completed' && (
                                                            <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[10px] font-bold uppercase tracking-widest px-2">
                                                                Completed
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">
                                                            {task.title}
                                                        </h3>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                                                            {task.description}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400">
                                                        <div className="flex items-center gap-1.5">
                                                            <CalendarIcon size={14} />
                                                            {new Date(task.deadline).toLocaleDateString()}
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <MessageSquare size={14} />
                                                            {task.activity?.length || 0} Comments
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Clock size={14} />
                                                            Added {new Date(task.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-3">
                                                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary-50 hover:text-primary-600">
                                                        <ChevronRight size={20} />
                                                    </Button>
                                                    {task.status !== 'completed' && (
                                                        <Button
                                                            size="sm"
                                                            className="rounded-full px-4 text-[10px] font-bold uppercase tracking-widest bg-emerald-500 hover:bg-emerald-600 text-white"
                                                            onClick={() => handleCompleteTask(task.id)}
                                                        >
                                                            Complete Task
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800"
                        >
                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <CheckSquare className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No tasks found</h3>
                            <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                                You don't have any personal tasks matching these filters.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default MyTasks;
