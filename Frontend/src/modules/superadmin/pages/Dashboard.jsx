import React, { useMemo } from 'react';
import {
    Users,
    Building2,
    IndianRupee,
    TrendingUp,
    Activity,
    ArrowUpRight,
    Globe,
    ShieldCheck,
    Zap,
    MoreVertical,
    ChevronRight
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { motion } from 'framer-motion';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/shared/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import useSuperAdminStore from '@/store/superAdminStore';
import { cn } from '@/shared/utils/cn';
import { fadeInUp, staggerContainer, scaleOnTap } from '@/shared/utils/animations';

import { useNavigate } from 'react-router-dom';

import useAuthStore from '@/store/authStore';

const SuperAdminDashboard = () => {
    const navigate = useNavigate();
    const { admins, plans, stats } = useSuperAdminStore();
    const { role } = useAuthStore();
    const isSuperAdmin = role === 'superadmin';

    const chartData = [
        { name: 'Jul', revenue: 250000, growth: 12 },
        { name: 'Aug', revenue: 310000, growth: 15 },
        { name: 'Sep', revenue: 280000, growth: 10 },
        { name: 'Oct', revenue: 350000, growth: 18 },
        { name: 'Nov', revenue: 420000, growth: 22 },
        { name: 'Dec', revenue: 485000, growth: 25 },
    ];

    const pieData = [
        { name: 'Starter', value: 4, color: '#94a3b8' },
        { name: 'Pro Team', value: 6, color: '#3b82f6' },
        { name: 'Business', value: 2, color: '#8b5cf6' },
    ];

    const summaryCards = [
        {
            title: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
            trend: '+12.5%',
            icon: <IndianRupee className="text-emerald-500" size={20} />,
            bg: 'bg-emerald-50 dark:bg-emerald-900/10',
            restricted: true // Only for superadmin
        },
        {
            title: 'Active Companies',
            value: stats.activeCompanies,
            trend: '+2',
            icon: <Building2 className="text-blue-500" size={20} />,
            bg: 'bg-blue-50 dark:bg-blue-900/10'
        },
        {
            title: 'Global Staff',
            value: stats.totalStaff,
            trend: '+8%',
            icon: <Users className="text-purple-500" size={20} />,
            bg: 'bg-purple-50 dark:bg-purple-900/10'
        },
        {
            title: 'Avg. Completion',
            value: `${stats.avgCompletionRate}%`,
            trend: '+3.2%',
            icon: <Activity className="text-amber-500" size={20} />,
            bg: 'bg-amber-50 dark:bg-amber-900/10'
        },
    ].filter(card => !card.restricted || isSuperAdmin);

    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="space-y-6 pb-12"
        >
            <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                        System Overview <ShieldCheck className="text-primary-600 fill-primary-600/10" size={28} />
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">
                        Monitoring health and growth across all tenants.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Badge className="bg-primary-50 text-primary-600 border-primary-100 dark:bg-primary-900/20 dark:border-primary-900/30 px-3 py-1.5 h-auto text-xs gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Global System Healthy
                    </Badge>
                    <motion.div {...scaleOnTap}>
                        <Button variant="outline" className="h-10 text-xs font-bold gap-2 rounded-xl">
                            <Globe size={14} />
                            Network Status
                        </Button>
                    </motion.div>
                </div>
            </motion.div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {summaryCards.map((card, i) => (
                    <motion.div key={i} variants={fadeInUp}>
                        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 group hover:shadow-md transition-shadow duration-300 overflow-hidden rounded-3xl">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={cn("p-2.5 rounded-2xl group-hover:scale-110 transition-transform duration-500", card.bg)}>
                                        {card.icon}
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                                        <ArrowUpRight size={10} />
                                        {card.trend}
                                    </div>
                                </div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{card.title}</p>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">{card.value}</h3>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Growth Chart */}
                {isSuperAdmin && (
                    <motion.div variants={fadeInUp} className="lg:col-span-2">
                        <Card className="h-full border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden rounded-[2rem]">
                            <CardHeader className="flex flex-row items-center justify-between px-8 pt-8">
                                <div>
                                    <CardTitle className="text-lg font-bold">Revenue Growth</CardTitle>
                                    <CardDescription>Platform-wide monthly performance</CardDescription>
                                </div>
                                <Select defaultValue="6">
                                    <SelectTrigger className="w-[120px] h-9 text-[10px] bg-slate-50 border-none dark:bg-slate-800 rounded-xl">
                                        <SelectValue placeholder="Period" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="6">Last 6 Months</SelectItem>
                                        <SelectItem value="12">Last Year</SelectItem>
                                    </SelectContent>
                                </Select>
                            </CardHeader>
                            <CardContent className="px-8 pb-8">
                                <div className="h-[300px] w-full mt-4">
                                    <ResponsiveContainer width="100%" height="100%" debounce={50}>
                                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                                                dy={10}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                                            />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="revenue"
                                                stroke="#3b82f6"
                                                strokeWidth={4}
                                                fillOpacity={1}
                                                fill="url(#colorRev)"
                                                animationDuration={2000}
                                                animationBegin={500}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Plan Distribution */}
                <motion.div variants={fadeInUp}>
                    <Card className="h-full border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden rounded-[2rem]">
                        <CardHeader className="px-8 pt-8">
                            <CardTitle className="text-lg font-bold">Plan Adoption</CardTitle>
                            <CardDescription>Subscription tier distribution</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center px-8 pb-8">
                            <div className="h-[220px] w-full">
                                <ResponsiveContainer width="100%" height="100%" debounce={50}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={85}
                                            paddingAngle={8}
                                            dataKey="value"
                                            animationDuration={1500}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="w-full space-y-3 mt-6">
                                {pieData.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50/50 dark:bg-slate-800/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                                            <span className="text-slate-500 font-bold tracking-tight">{item.name}</span>
                                        </div>
                                        <span className="font-black text-slate-900 dark:text-white">{item.value} Companies</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Recent Activity Table */}
            <motion.div variants={fadeInUp}>
                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 md:px-8 py-6 gap-4">
                        <div>
                            <CardTitle className="text-lg font-bold">Recent Company Registrations</CardTitle>
                            <CardDescription>Newly boarded administrative accounts</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/superadmin/admins')} className="text-xs font-black uppercase tracking-widest gap-1 text-primary-600 hover:bg-primary-50 rounded-xl w-full sm:w-auto justify-center">
                            View All <ChevronRight size={14} />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-slate-50 dark:border-slate-800">
                                        <TableHead className="pl-4 md:pl-8 text-[10px] font-black uppercase tracking-widest text-slate-400 min-w-[200px]">Company Name</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 min-w-[150px]">Admin Owner</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 min-w-[100px]">Current Plan</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 min-w-[100px]">Joined</TableHead>
                                        <TableHead className="text-right pr-4 md:pr-8 text-[10px] font-black uppercase tracking-widest text-slate-400 min-w-[100px]">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {admins.slice(0, 3).map((adm) => (
                                        <TableRow
                                            key={adm.id}
                                            className="border-slate-50 dark:border-slate-800 group cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-shadow duration-300"
                                            onClick={() => navigate('/superadmin/admins')}
                                        >
                                            <TableCell className="pl-4 md:pl-8 font-black text-slate-900 dark:text-white text-sm">
                                                {adm.name}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-7 w-7 border-2 border-white dark:border-slate-800 shadow-sm">
                                                        <AvatarFallback className="text-[10px] font-black bg-primary-50 text-primary-600">{adm.owner.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{adm.owner}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-[10px] font-black border-none bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase tracking-widest px-2 py-1 rounded-lg">
                                                    {adm.plan}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
                                                {adm.joinedDate}
                                            </TableCell>
                                            <TableCell className="text-right pr-4 md:pr-8">
                                                <Badge className={cn(
                                                    "text-[9px] h-6 px-2.5 font-black uppercase tracking-widest rounded-full",
                                                    adm.status === 'active' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" :
                                                        adm.status === 'pending' ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]"
                                                )}>
                                                    {adm.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
};

export default SuperAdminDashboard;
