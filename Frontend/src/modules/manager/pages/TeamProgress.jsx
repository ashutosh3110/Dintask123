import React, { useMemo } from 'react';
import {
    BarChart3,
    TrendingUp,
    CheckCircle2,
    Clock,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
    Users,
    Target
} from 'lucide-react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import { motion } from 'framer-motion';
import useAuthStore from '@/store/authStore';
import useTaskStore from '@/store/taskStore';
import useEmployeeStore from '@/store/employeeStore';
import { fadeInUp, staggerContainer } from '@/shared/utils/animations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Progress } from '@/shared/components/ui/progress';
import { cn } from '@/shared/utils/cn';
import { toast } from 'sonner';

const TeamProgress = () => {
    const { user } = useAuthStore();
    const tasks = useTaskStore(state => state.tasks);
    const employees = useEmployeeStore(state => state.employees);

    const teamTasks = useMemo(() => {
        return tasks.filter(t => t.delegatedBy === user?.id);
    }, [tasks, user]);

    const performanceData = useMemo(() => {
        const teamMembers = employees.filter(e => e.managerId === user?.id);
        return teamMembers.map(member => {
            const memberTasks = tasks.filter(t => t.assignedTo?.includes(member.id));
            const completed = memberTasks.filter(t => t.status === 'completed').length;
            const activeTasks = memberTasks.length - completed;
            const rate = memberTasks.length > 0 ? Math.round((completed / memberTasks.length) * 100) : 0;
            return {
                name: member.name.split(' ')[0],
                tasks: memberTasks.length,
                completed: completed,
                rate: rate,
                efficiency: Math.min(100, rate + (activeTasks > 0 ? 10 : 0)) // Just a fake calc
            };
        });
    }, [tasks, employees, user]);

    const stats = useMemo(() => {
        const completed = teamTasks.filter(t => t.status === 'completed').length;
        const pending = teamTasks.filter(t => t.status !== 'completed').length;
        const total = teamTasks.length;
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

        return [
            { title: 'Total Team Tasks', value: total, icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/10' },
            { title: 'Success Rate', value: `${rate}%`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
            { title: 'Pending Actions', value: pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/10' },
            { title: 'Goal Completion', value: '12/15', icon: Target, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/10' }
        ];
    }, [teamTasks]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-left">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Team Progress</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Detailed analytics and performance tracking for your team.
                    </p>
                </div>
                <Button className="gap-2" onClick={() => toast.success("Report exported successfully!")}>
                    <BarChart3 size={18} />
                    Export Detailed Report
                </Button>
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
                        <Card className="border-none shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className={cn("p-3 rounded-2xl", stat.bg)}>
                                        <stat.icon className={cn("w-6 h-6", stat.color)} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.title}</p>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Performance Chart */}
                <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Member Performance</CardTitle>
                        <CardDescription>Tasks completion rate by team member</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        padding: '12px'
                                    }}
                                />
                                <Bar dataKey="rate" radius={[8, 8, 0, 0]} barSize={40}>
                                    {performanceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.rate > 80 ? '#10b981' : entry.rate > 50 ? '#3b82f6' : '#f59e0b'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Top Performers */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Top Performers</CardTitle>
                        <CardDescription>Efficiency leaderboard</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {performanceData.sort((a, b) => b.rate - a.rate).slice(0, 5).map((member, index) => (
                            <div key={member.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                        {index + 1}
                                    </div>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{member.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TrendingUp size={14} className="text-emerald-500" />
                                    <span className="text-sm font-bold text-emerald-500">{member.rate}%</span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default TeamProgress;
