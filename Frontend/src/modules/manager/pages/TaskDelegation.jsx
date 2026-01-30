import React, { useMemo, useState } from 'react';
import {
    Users,
    Search,
    Filter,
    Clock,
    AlertCircle,
    CheckCircle2,
    Calendar as CalendarIcon,
    ChevronRight,
    ArrowRightLeft,
    UserPlus,
    UserMinus,
    MessageSquare,
    MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '@/store/authStore';
import useTaskStore from '@/store/taskStore';
import useEmployeeStore from '@/store/employeeStore';
import { fadeInUp, staggerContainer } from '@/shared/utils/animations';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { cn } from '@/shared/utils/cn';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import { toast } from 'sonner';

const TaskDelegation = () => {
    const { user } = useAuthStore();
    const tasks = useTaskStore(state => state.tasks);
    const delegateTaskToEmployee = useTaskStore(state => state.delegateTaskToEmployee);
    const employees = useEmployeeStore(state => state.employees);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelegateClick = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleDelegateTask = (employeeId) => {
        if (!selectedTask) return;

        delegateTaskToEmployee(selectedTask.id, employeeId, user.id, "Delegated via Manager Dashboard");
        toast.success(`Task delegated successfully`);
        setIsModalOpen(false);
        setSelectedTask(null);
    };

    const pendingTasks = useMemo(() => {
        return tasks.filter(t =>
            t.assignedToManager === user?.id &&
            !t.delegatedBy &&
            t.status !== 'completed'
        ).filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [tasks, user, searchTerm]);

    const delegatedTasks = useMemo(() => {
        return tasks.filter(t =>
            t.delegatedBy === user?.id
        ).filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [tasks, user, searchTerm]);

    const teamMembers = useMemo(() => {
        return employees.filter(e => e.managerId === user?.id);
    }, [employees, user]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Task Delegation</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Delegate tasks assigned by Admin to your team members.
                    </p>
                </div>
            </div>

            {/* Search and Stats */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search tasks..."
                        className="pl-10 h-11 border-none shadow-sm dark:bg-slate-900"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        <Badge className="bg-amber-500 text-white border-none">{pendingTasks.length}</Badge>
                        <span className="text-xs font-bold text-slate-500 uppercase">Pending</span>
                    </div>
                    <div className="w-px h-4 bg-slate-200 dark:bg-slate-800"></div>
                    <div className="flex items-center gap-2">
                        <Badge className="bg-primary-500 text-white border-none">{delegatedTasks.length}</Badge>
                        <span className="text-xs font-bold text-slate-500 uppercase">Delegated</span>
                    </div>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Pending Delegation */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <ArrowRightLeft className="text-amber-500" size={20} />
                            Pending Delegation
                        </h2>
                    </div>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="grid gap-4"
                    >
                        {pendingTasks.length > 0 ? pendingTasks.map((task) => (
                            <motion.div key={task.id} variants={fadeInUp}>
                                <Card className="border-none shadow-sm hover:shadow-md transition-shadow group">
                                    <CardContent className="p-4">
                                        <div className="space-y-4 text-left">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1">
                                                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">
                                                        {task.title}
                                                    </h3>
                                                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        <span className="flex items-center gap-1">
                                                            <CalendarIcon size={12} />
                                                            {new Date(task.deadline).toLocaleDateString()}
                                                        </span>
                                                        <span className={cn(
                                                            "px-2 py-0.5 rounded-full border border-current",
                                                            task.priority === 'urgent' ? 'text-red-500' : 'text-blue-500'
                                                        )}>
                                                            {task.priority}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    className="rounded-xl h-9 px-4 gap-2 text-xs font-bold"
                                                    onClick={() => handleDelegateClick(task)}
                                                >
                                                    Delegate <UserPlus size={14} />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )) : (
                            <div className="text-center py-12 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                                <p className="text-sm text-slate-400 font-medium">No tasks pending delegation</p>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Already Delegated */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold flex items-center gap-2 text-left">
                        <CheckCircle2 className="text-emerald-500" size={20} />
                        Delegated Tasks
                    </h2>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="grid gap-4"
                    >
                        {delegatedTasks.length > 0 ? delegatedTasks.map((task) => {
                            const assignee = teamMembers.find(e => task.assignedTo?.includes(e.id));
                            return (
                                <motion.div key={task.id} variants={fadeInUp}>
                                    <Card className="border-none shadow-sm opacity-80 hover:opacity-100 transition-all group">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                                    <div className="relative">
                                                        <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-800 shadow-sm">
                                                            <AvatarImage src={assignee?.avatar} />
                                                            <AvatarFallback className="bg-primary-100 text-primary-600 text-xs font-bold">
                                                                {assignee?.name?.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5 border border-slate-100 dark:border-slate-800">
                                                            <CheckCircle2 className="text-emerald-500" size={12} />
                                                        </div>
                                                    </div>
                                                    <div className="min-w-0 flex-1 text-left">
                                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                                            {task.title}
                                                        </h3>
                                                        <p className="text-[10px] text-slate-500 font-medium truncate">
                                                            Assigned to <span className="text-primary-600 font-bold">{assignee?.name}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-[10px] border-slate-200 dark:border-slate-800 capitalize">
                                                        {task.status}
                                                    </Badge>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400">
                                                        <MoreVertical size={16} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        }) : (
                            <div className="text-center py-12 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                                <p className="text-sm text-slate-400 font-medium">No active delegations</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
            {/* Delegation Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delegate Task: {selectedTask?.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <p className="text-sm text-slate-500">Select a team member to assign this task to:</p>
                        <div className="grid gap-2">
                            {teamMembers.map(member => (
                                <div
                                    key={member.id}
                                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group"
                                    onClick={() => handleDelegateTask(member.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={member.avatar} />
                                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{member.name}</p>
                                            <p className="text-[10px] text-slate-500">{member.role}</p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100">Select</Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TaskDelegation;
