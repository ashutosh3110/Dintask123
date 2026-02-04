import React, { useMemo } from 'react';
import {
    CheckCircle2,
    Clock,
    AlertCircle,
    Users,
    TrendingUp,
    MoreVertical,
    Plus,
    BarChart3,
    Calendar as CalendarIcon
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { motion } from 'framer-motion';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import useTaskStore from '@/store/taskStore';
import useAuthStore from '@/store/authStore';
import useManagerStore from '@/store/managerStore';
import useEmployeeStore from '@/store/employeeStore';
import useScheduleStore from '@/store/scheduleStore';
import { fadeInUp, staggerContainer, scaleOnTap } from '@/shared/utils/animations';
import { format, isSameDay } from 'date-fns';

const AdminDashboard = () => {
    const { user } = useAuthStore();
    const { tasks } = useTaskStore();
    const { managers } = useManagerStore();
    const { employees } = useEmployeeStore();

    // Mock data for the chart
    const chartData = [
        { name: 'Mon', completed: 4, pending: 2 },
        { name: 'Tue', completed: 7, pending: 5 },
        { name: 'Wed', completed: 5, pending: 8 },
        { name: 'Thu', completed: 12, pending: 4 },
        { name: 'Fri', completed: 8, pending: 6 },
        { name: 'Sat', completed: 3, pending: 2 },
        { name: 'Sun', completed: 2, pending: 1 },
    ];

    const { schedules } = useScheduleStore();

    const adminMeetings = useMemo(() => {
        const today = new Date();
        return schedules.filter(s =>
            s.assignedTo?.toLowerCase().includes('admin') &&
            (new Date(s.date) >= new Date(today.setHours(0, 0, 0, 0)))
        ).sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [schedules]);

    const stats = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        return [
            {
                title: "Today's Tasks",
                value: tasks.filter(t => t.createdAt.startsWith(today)).length,
                icon: Clock,
                color: "text-blue-600",
                bg: "bg-blue-50 dark:bg-blue-900/20",
                description: "+2 from yesterday"
            },
            {
                title: "Completed Today",
                value: tasks.filter(t => t.status === 'completed' && t.completedAt?.startsWith(today)).length,
                icon: CheckCircle2,
                color: "text-emerald-600",
                bg: "bg-emerald-50 dark:bg-emerald-900/20",
                description: "85% completion rate"
            },
            {
                title: "Tasks Pending Mgr",
                value: tasks.filter(t => t.assignedToManager && t.status === 'pending' && !t.delegatedBy).length,
                icon: AlertCircle,
                color: "text-amber-600",
                bg: "bg-amber-50 dark:bg-amber-900/20",
                description: "Awaiting delegation"
            },
            {
                title: "Active Managers",
                value: managers.length,
                icon: Users,
                color: "text-purple-600",
                bg: "bg-purple-50 dark:bg-purple-900/20",
                description: `${employees.length} employees reporting`
            }
        ];
    }, [tasks]);

    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="space-y-6"
        >
            <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Welcome back, <span className="font-semibold text-primary-600">{user?.name}</span>. Here's what's happening today.
                    </p>
                </div>
                <motion.div {...scaleOnTap}>
                    <Button className="flex items-center gap-2 shadow-lg shadow-primary-200 dark:shadow-none bg-primary-600 hover:bg-primary-700">
                        <Plus size={18} />
                        <span>Create New Task</span>
                    </Button>
                </motion.div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, i) => (
                    <motion.div key={i} variants={fadeInUp}>
                        <Card className="border-none shadow-md shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 duration-300`}>
                                        <stat.icon size={24} />
                                    </div>
                                    <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">
                                        {stat.description}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <motion.div variants={fadeInUp} className="lg:col-span-2">
                    <Card className="h-full border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold">Task Completion Trend</CardTitle>
                                <CardDescription>Weekly overview of task performance</CardDescription>
                            </div>
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                <TrendingUp className="text-emerald-500" size={20} />
                            </div>
                        </CardHeader>
                        <CardContent className="h-[300px] mt-4">
                            <ResponsiveContainer width="100%" height="100%" debounce={50}>
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: 'none',
                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                            backgroundColor: '#1e293b',
                                            color: '#fff'
                                        }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="completed"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorCompleted)"
                                        animationDuration={1500}
                                        animationBegin={500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Daily Progress */}
                <motion.div variants={fadeInUp}>
                    <Card className="h-full border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Daily Progress</CardTitle>
                            <CardDescription>Today's completion targets</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 font-medium">Overall Completion</span>
                                    <span className="font-bold text-slate-900 dark:text-white">68%</span>
                                </div>
                                <Progress value={68} className="h-2.5 bg-slate-100 dark:bg-slate-800" />
                            </div>

                            <div className="space-y-4 mt-8">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Quick Actions</h4>
                                <div className="grid grid-cols-1 gap-2">
                                    <motion.div {...scaleOnTap}>
                                        <Button variant="outline" className="w-full justify-start gap-3 h-12 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors rounded-xl">
                                            <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                                                <Users size={16} />
                                            </div>
                                            <span className="text-sm font-semibold">Assign Pending Tasks</span>
                                        </Button>
                                    </motion.div>
                                    <motion.div {...scaleOnTap}>
                                        <Button variant="outline" className="w-full justify-start gap-3 h-12 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors rounded-xl">
                                            <div className="p-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg">
                                                <BarChart3 size={16} />
                                            </div>
                                            <span className="text-sm font-semibold">Generate Report</span>
                                        </Button>
                                    </motion.div>
                                    <motion.div {...scaleOnTap}>
                                        <Button variant="outline" className="w-full justify-start gap-3 h-12 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors rounded-xl">
                                            <div className="p-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg">
                                                <CalendarIcon size={16} />
                                            </div>
                                            <span className="text-sm font-semibold">Schedule Sync Meeting</span>
                                        </Button>
                                    </motion.div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Admin Follow-ups / Meetings */}
                <motion.div variants={fadeInUp} className="lg:col-span-3">
                    <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden rounded-2xl">
                        <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <Clock className="text-primary-600" size={20} />
                                    Admin Meetings & Follow-ups
                                </CardTitle>
                                <Badge variant="outline" className="text-[10px] font-black">{adminMeetings.length} Scheduled</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                                {adminMeetings.length > 0 ? adminMeetings.slice(0, 6).map(meeting => (
                                    <div key={meeting.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary-100 dark:hover:border-primary-900 transition-all group">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600">
                                                <CalendarIcon size={18} />
                                            </div>
                                            <Badge className="text-[9px] bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-none capitalize">{meeting.type}</Badge>
                                        </div>
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-1 truncate">{meeting.title}</h4>
                                        <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                                            <div className="flex items-center gap-1">
                                                <Clock size={12} />
                                                <span>{format(new Date(meeting.date), 'MMM dd')} - {meeting.time}</span>
                                            </div>
                                        </div>
                                        {meeting.description && (
                                            <p className="text-[11px] text-slate-400 mt-2 line-clamp-1 italic">"{meeting.description}"</p>
                                        )}
                                    </div>
                                )) : (
                                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 grayscale opacity-50">
                                        <CalendarIcon size={48} className="mb-2" />
                                        <p className="text-sm font-medium">No meetings scheduled with you.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;
