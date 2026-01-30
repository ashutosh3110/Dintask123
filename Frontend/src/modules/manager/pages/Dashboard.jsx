import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    CheckSquare,
    Users,
    BarChart3,
    Clock,
    AlertCircle,
    TrendingUp,
    Calendar as CalendarIcon,
    ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import useAuthStore from '@/store/authStore';
import useTaskStore from '@/store/taskStore';
import useEmployeeStore from '@/store/employeeStore';
import { fadeInUp, staggerContainer } from '@/shared/utils/animations';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Progress } from '@/shared/components/ui/progress';
import { cn } from '@/shared/utils/cn';

const ManagerDashboard = () => {
    const { user } = useAuthStore();
    const tasks = useTaskStore(state => state.tasks);
    const employees = useEmployeeStore(state => state.employees);
    const navigate = useNavigate();

    // Manager statistics
    const stats = useMemo(() => {
        const managerTasks = tasks.filter(t => t.assignedToManager === user?.id);
        const teamTasks = tasks.filter(t => t.delegatedBy === user?.id);
        const myTasksToComplete = managerTasks.filter(t => !t.delegatedBy); // Assigned to manager directly

        const completedTeamTasks = teamTasks.filter(t => t.status === 'completed');
        const completionRate = teamTasks.length > 0
            ? Math.round((completedTeamTasks.length / teamTasks.length) * 100)
            : 0;

        return [
            {
                title: 'My Tasks',
                value: myTasksToComplete.length,
                icon: CheckSquare,
                color: 'text-blue-600',
                bg: 'bg-blue-50 dark:bg-blue-900/10',
                trend: '+2 from yesterday'
            },
            {
                title: 'Pending Delegation',
                value: managerTasks.filter(t => !t.delegatedBy && t.status !== 'completed').length,
                icon: AlertCircle,
                color: 'text-amber-600',
                bg: 'bg-amber-50 dark:bg-amber-900/10',
                trend: '3 urgent'
            },
            {
                title: 'Team Progress',
                value: `${completionRate}%`,
                icon: TrendingUp,
                color: 'text-emerald-600',
                bg: 'bg-emerald-50 dark:bg-emerald-900/10',
                trend: 'Overall completion'
            },
            {
                title: 'Online Team',
                value: employees.filter(e => e.managerId === user?.id && e.status === 'active').length,
                icon: Users,
                color: 'text-purple-600',
                bg: 'bg-purple-50 dark:bg-purple-900/10',
                trend: `of ${employees.filter(e => e.managerId === user?.id).length} members`
            }
        ];
    }, [tasks, employees, user]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-1"
                >
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Welcome back, <span className="text-primary-600">{user?.name}</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Here's what's happening with your team today.
                    </p>
                </motion.div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2" onClick={() => navigate('/manager/schedule')}>
                        <CalendarIcon size={18} />
                        View Schedule
                    </Button>
                    <Button className="gap-2" onClick={() => navigate('/manager/delegation')}>
                        <CheckSquare size={18} />
                        Delegate Tasks
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
                {stats.map((stat, index) => (
                    <motion.div key={index} variants={fadeInUp}>
                        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={cn("p-2 rounded-lg", stat.bg)}>
                                        <stat.icon className={cn("w-6 h-6", stat.color)} />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">
                                        Active
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        {stat.title}
                                    </h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {stat.value}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400">
                                        {stat.trend}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* Content Grid */}
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Recent Tasks */}
                <Card className="lg:col-span-2 border-none shadow-sm h-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Clock className="text-primary-500" size={20} />
                            Recent Team Activity
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="text-primary-600 gap-1">
                            View All <ArrowRight size={14} />
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {tasks.filter(t => t.delegatedBy === user?.id).slice(0, 5).map((task) => (
                            <div key={task.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-2 h-10 rounded-full",
                                        task.priority === 'urgent' ? 'bg-red-500' :
                                            task.priority === 'high' ? 'bg-orange-500' : 'bg-blue-500'
                                    )} />
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">{task.title}</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">Assigned to: {employees.find(e => e.id === task.assignedTo?.[0])?.name || 'Multiple'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold text-slate-900 dark:text-white">{task.progress}%</div>
                                    <Progress value={task.progress} className="w-20 h-1.5 mt-1" />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Team Status */}
                <Card className="border-none shadow-sm h-full">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Team Workload</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {employees.filter(e => e.managerId === user?.id).map((member) => {
                            const memberTasks = tasks.filter(t => t.assignedTo?.includes(member.id));
                            const completionPercentage = memberTasks.length > 0
                                ? Math.round((memberTasks.filter(t => t.status === 'completed').length / memberTasks.length) * 100)
                                : 0;

                            return (
                                <div key={member.id} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full overflow-hidden">
                                                <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                            </div>
                                            <span className="text-sm font-medium text-slate-900 dark:text-white">{member.name}</span>
                                        </div>
                                        <span className="text-xs text-slate-500 font-bold">{memberTasks.length} Tasks</span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px] text-slate-400">
                                            <span>Efficiency</span>
                                            <span>{completionPercentage}%</span>
                                        </div>
                                        <Progress value={completionPercentage} className="h-1" />
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ManagerDashboard;
