import React, { useMemo } from 'react';
import {
    BarChart3,
    FileText,
    Download,
    TrendingUp,
    Clock,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Calendar as CalendarIcon,
    PieChart as PieChartIcon
} from 'lucide-react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line
} from 'recharts';
import { motion } from 'framer-motion';
import useAuthStore from '@/store/authStore';
import useTaskStore from '@/store/taskStore';
import useEmployeeStore from '@/store/employeeStore';
import { fadeInUp, staggerContainer } from '@/shared/utils/animations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils/cn';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-sm font-black text-slate-900 dark:text-white mb-2">{label}</p>
                <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-200" /> Total: {data.total}
                    </p>
                    <p className="text-xs font-black flex items-center gap-2" style={{ color: data.color }}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} /> Completed: {data.completed}
                    </p>
                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Success Rate</p>
                        <p className="text-lg font-black" style={{ color: data.color }}>
                            {data.percentage}%
                        </p>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

const ManagerReports = () => {
    const { user } = useAuthStore();
    const tasks = useTaskStore(state => state.tasks);
    const employees = useEmployeeStore(state => state.employees);

    // Filter tasks managed by this manager
    const teamTasks = useMemo(() => tasks.filter(t => t.delegatedBy === user?.id || t.assignedToManager === user?.id), [tasks, user]);

    // Filter employees reporting to this manager
    const teamMembers = useMemo(() => employees.filter(emp => emp.managerId === user?.id), [employees, user]);

    // Stats Calculation
    const stats = useMemo(() => {
        const total = teamTasks.length;
        const completed = teamTasks.filter(t => t.status === 'completed').length;
        const pending = teamTasks.filter(t => t.status === 'pending').length;
        const highPriority = teamTasks.filter(t => t.priority === 'high' || t.priority === 'urgent').length;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        return [
            {
                title: 'Total Team Tasks',
                value: total,
                icon: BarChart3,
                color: 'text-blue-600',
                bg: 'bg-blue-50 dark:bg-blue-900/20',
                trend: '+12%',
                isPositive: true
            },
            {
                title: 'Completion Rate',
                value: `${completionRate}%`,
                icon: TrendingUp,
                color: 'text-emerald-600',
                bg: 'bg-emerald-50 dark:bg-emerald-900/20',
                trend: '+5.4%',
                isPositive: true
            },
            {
                title: 'Pending Tasks',
                value: pending,
                icon: Clock,
                color: 'text-amber-600',
                bg: 'bg-amber-50 dark:bg-amber-900/20',
                trend: '-2',
                isPositive: true
            },
            {
                title: 'Urgent Action',
                value: highPriority,
                icon: FileText,
                color: 'text-rose-600',
                bg: 'bg-rose-50 dark:bg-rose-900/20',
                trend: 'Requires Attention',
                isWarning: true
            }
        ];
    }, [teamTasks]);

    // Chart data
    const statusData = useMemo(() => {
        const completed = teamTasks.filter(t => t.status === 'completed').length;
        const pending = teamTasks.filter(t => t.status === 'pending').length;
        const inProgress = teamTasks.filter(t => t.status === 'in-progress' || (t.progress > 0 && t.progress < 100)).length;

        return [
            { name: 'Completed', value: completed, color: '#10b981' },
            { name: 'In Progress', value: inProgress, color: '#3b82f6' },
            { name: 'Pending', value: pending, color: '#f59e0b' }
        ].filter(d => d.value > 0);
    }, [teamTasks]);

    // Performance Data (Tasks per Employee)
    const performanceData = useMemo(() => {
        return teamMembers.map(emp => {
            const empTasks = teamTasks.filter(t => t.assignedTo?.includes(emp.id));
            const total = empTasks.length;
            const completed = empTasks.filter(t => t.status === 'completed').length;
            const percentage = total > 0 ? (completed / total) * 100 : 0;

            let color = '#3b82f6'; // Default Blue
            if (percentage >= 80) color = '#10b981'; // Emerald (High)
            else if (percentage < 40) color = '#f43f5e'; // Rose/Red (Low)
            else if (percentage < 70) color = '#f59e0b'; // Amber (Medium)

            return {
                name: emp.name.split(' ')[0],
                completed,
                total,
                color,
                percentage: Math.round(percentage)
            };
        }).sort((a, b) => b.total - a.total);
    }, [teamMembers, teamTasks]);

    const weeklyData = [
        { name: 'Mon', count: 4 },
        { name: 'Tue', count: 7 },
        { name: 'Wed', count: 5 },
        { name: 'Thu', count: 12 },
        { name: 'Fri', count: 8 },
        { name: 'Sat', count: 3 },
        { name: 'Sun', count: 2 }
    ];

    // Dummy Activity Log
    const activityLog = [
        { id: 1, time: '10 mins ago', user: 'Zaid Khan', action: 'Completed', task: 'Mobile App Navigation Fix', status: 'completed' },
        { id: 2, time: '45 mins ago', user: 'Sarah Doe', action: 'Updated Progress', task: 'Q1 Sales Report', status: 'in-progress' },
        { id: 3, time: '2 hours ago', user: 'Zaid Khan', action: 'Left Comment', task: 'API Documentation', status: 'pending' },
        { id: 4, time: 'Yesterday', user: 'John Smith', action: 'Started', task: 'UI Component Library', status: 'in-progress' },
        { id: 5, time: 'Yesterday', user: 'Admin', action: 'Assigned', task: 'Quarterly Audit', status: 'pending' }
    ];

    const handleExportExcel = () => {
        const exportData = teamTasks.map(task => ({
            ID: task.id,
            Title: task.title,
            Status: task.status,
            Priority: task.priority,
            Progress: `${task.progress}%`,
            Deadline: format(new Date(task.deadline), 'MMM dd, yyyy HH:mm'),
            AssignedBy: task.assignedBy === 'admin' ? 'Admin' : 'Manager',
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Tasks Report");
        XLSX.writeFile(wb, `Team_Report_${user?.name.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.xlsx`);
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-8 pb-12"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Analytics <span className="text-primary-600">&</span> Insights</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                        Real-time overview of your team's productivity and task fulfillment.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-2xl gap-2 font-bold border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <CalendarIcon size={18} className="text-primary-500" />
                        Last 30 Days
                    </Button>
                    <Button
                        onClick={handleExportExcel}
                        className="h-12 px-6 rounded-2xl gap-2 font-bold bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/20"
                    >
                        <Download size={18} />
                        Export Excel
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, idx) => (
                    <motion.div key={idx} variants={fadeInUp}>
                        <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-[2rem] overflow-hidden group">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110", stat.bg)}>
                                        <stat.icon className={stat.color} size={24} />
                                    </div>
                                    <div className={cn(
                                        "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full",
                                        stat.isWarning ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
                                    )}>
                                        {stat.trend}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</h3>
                                    <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wider">{stat.title}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid gap-8 lg:grid-cols-2">
                {/* Performance Chart */}
                <motion.div variants={fadeInUp}>
                    <Card className="border-none shadow-sm rounded-[2.5rem] p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-black text-slate-900 dark:text-white">Team Performance</CardTitle>
                                    <CardDescription className="font-medium text-slate-400">Total vs Completed tasks per member</CardDescription>
                                </div>
                                <BarChart3 className="text-primary-500" size={24} />
                            </div>
                        </CardHeader>
                        <CardContent className="h-[350px] pt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                                        content={<CustomTooltip />}
                                    />
                                    <Bar dataKey="total" fill="#e2e8f0" radius={[10, 10, 0, 0]} barSize={24} />
                                    <Bar dataKey="completed" radius={[10, 10, 0, 0]} barSize={24}>
                                        {performanceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Status Distribution */}
                <motion.div variants={fadeInUp}>
                    <Card className="border-none shadow-sm rounded-[2.5rem] p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-black text-slate-900 dark:text-white">Task Distribution</CardTitle>
                                    <CardDescription className="font-medium text-slate-400">Current workflow breakdown</CardDescription>
                                </div>
                                <PieChartIcon className="text-primary-500" size={24} />
                            </div>
                        </CardHeader>
                        <CardContent className="h-[350px] pt-4 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={85}
                                        outerRadius={115}
                                        paddingAngle={8}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                <p className="text-3xl font-black text-slate-900 dark:text-white">{teamTasks.length}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tasks</p>
                            </div>
                            <div className="flex justify-center gap-6 mt-4">
                                {statusData.map((s) => (
                                    <div key={s.name} className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">{s.name}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Completion Trend */}
            <motion.div variants={fadeInUp}>
                <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden">
                    <div className="p-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-black">Velocity Report</h3>
                                <p className="text-slate-400 font-bold mt-1">Weekly completion output trend</p>
                            </div>
                            <TrendingUp className="text-emerald-400" size={32} />
                        </div>
                    </div>
                    <CardContent className="h-[300px] p-8 bg-white dark:bg-slate-900">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#ec4899"
                                    strokeWidth={6}
                                    dot={{ r: 8, fill: '#ec4899', strokeWidth: 4, stroke: '#fff' }}
                                    activeDot={{ r: 10, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Activity Table */}
            <motion.div variants={fadeInUp}>
                <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between bg-white dark:bg-slate-900">
                        <div>
                            <CardTitle className="text-2xl font-black text-slate-900 dark:text-white">Activity Log</CardTitle>
                            <CardDescription className="font-bold text-slate-400">Live feed of team interactions and updates</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="font-black text-xs uppercase tracking-widest text-primary-600 hover:text-primary-700 hover:bg-primary-50">
                            View All Log
                        </Button>
                    </CardHeader>
                    <div className="overflow-x-auto bg-white dark:bg-slate-900">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-y border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20">
                                    <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Timestamp</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Team Member</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Action Type</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Related Task</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activityLog.map((log) => (
                                    <tr key={log.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                        <td className="p-6 font-bold text-xs text-slate-400">{log.time}</td>
                                        <td className="p-6 font-black text-sm text-slate-900 dark:text-white capitalize">{log.user}</td>
                                        <td className="p-6">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                log.status === 'completed' ? "bg-emerald-100 text-emerald-600" :
                                                    log.status === 'in-progress' ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"
                                            )}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="p-6 font-bold text-sm text-slate-600 dark:text-slate-400 group-hover:text-primary-600 transition-colors">
                                            {log.task}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    );
};

export default ManagerReports;
