import React, { useMemo, useState } from 'react';
import {
    LayoutDashboard,
    DollarSign,
    Users,
    BarChart3,
    Clock,
    AlertCircle,
    TrendingUp,
    Calendar as CalendarIcon,
    ArrowRight,
    Target,
    Users as UsersIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import useAuthStore from '@/store/authStore';
import useSalesStore from '@/store/salesStore';
import useSalesTargetsStore from '@/store/salesTargetsStore';
import { fadeInUp, staggerContainer } from '@/shared/utils/animations';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Progress } from '@/shared/components/ui/progress';
import { cn } from '@/shared/utils/cn';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

const SalesDashboard = () => {
    const { user } = useAuthStore();
    const { salesReps, getSalesRepByEmail } = useSalesStore();
    const {
        individualTargets,
        teamTargets,
        actualPerformance,
        calculateIndividualProgress,
        calculateTeamProgress
    } = useSalesTargetsStore();
    
    const [selectedPeriod, setSelectedPeriod] = useState('monthly');

    // Get current sales rep data from store
    const salesRep = useMemo(() => {
        return getSalesRepByEmail(user?.email);
    }, [user?.email, getSalesRepByEmail]);
    
    // Calculate target progress for the selected period
    const targetProgress = useMemo(() => {
        return {
            individual: {
                revenue: calculateIndividualProgress(selectedPeriod, 'revenue'),
                deals: calculateIndividualProgress(selectedPeriod, 'deals'),
                clients: calculateIndividualProgress(selectedPeriod, 'clients')
            },
            team: {
                revenue: calculateTeamProgress(selectedPeriod, 'revenue'),
                deals: calculateTeamProgress(selectedPeriod, 'deals'),
                clients: calculateTeamProgress(selectedPeriod, 'clients')
            },
            actual: actualPerformance[selectedPeriod] || {},
            individualTarget: individualTargets[selectedPeriod] || {},
            teamTarget: teamTargets[selectedPeriod] || {}
        };
    }, [selectedPeriod, individualTargets, teamTargets, actualPerformance, calculateIndividualProgress, calculateTeamProgress]);

    // Sales stats from store data
    const stats = useMemo(() => {
        if (!salesRep) {
            return [
                { title: 'Total Sales', value: '$0', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/10', trend: 'No data' },
                { title: 'Active Deals', value: '0', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/10', trend: 'No data' },
                { title: 'Conversion Rate', value: '0%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/10', trend: 'No data' },
                { title: 'Clients', value: '0', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/10', trend: 'No data' }
            ];
        }

        return [
            {
                title: 'Total Sales',
                value: `$${salesRep.totalSales.toLocaleString()}`,
                icon: DollarSign,
                color: 'text-blue-600',
                bg: 'bg-blue-50 dark:bg-blue-900/10',
                trend: '+12% from last month'
            },
            {
                title: 'Active Deals',
                value: salesRep.activeDeals.toString(),
                icon: AlertCircle,
                color: 'text-amber-600',
                bg: 'bg-amber-50 dark:bg-amber-900/10',
                trend: '3 high priority'
            },
            {
                title: 'Conversion Rate',
                value: `${salesRep.conversionRate}%`,
                icon: TrendingUp,
                color: 'text-emerald-600',
                bg: 'bg-emerald-50 dark:bg-emerald-900/10',
                trend: 'Up by 5%'
            },
            {
                title: 'Clients',
                value: salesRep.clients.toString(),
                icon: Users,
                color: 'text-purple-600',
                bg: 'bg-purple-50 dark:bg-purple-900/10',
                trend: '+3 new this week'
            }
        ];
    }, [salesRep]);

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
                        Here's what's happening with your sales today.
                    </p>
                </motion.div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2">
                        <CalendarIcon size={18} />
                        View Schedule
                    </Button>
                    <Button className="gap-2">
                        <DollarSign size={18} />
                        Add Sale
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
            
            {/* Sales Targets Section */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Sales Targets
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Track your individual and team progress against targets
                        </p>
                    </div>
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select Period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Individual Targets */}
                    <Card className="border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Target size={20} className="text-primary-600" />
                                Individual Targets
                            </CardTitle>
                            <span className="text-sm font-medium text-slate-500">
                                {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}
                            </span>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {['revenue', 'deals', 'clients'].map((metric) => (
                                <div key={metric} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                                            {metric === 'revenue' ? 'Revenue' : metric}
                                        </span>
                                        <span className="text-sm font-bold">
                                            {metric === 'revenue' ? 
                                                `$${targetProgress.actual[metric]?.toLocaleString()} / $${targetProgress.individualTarget[metric]?.toLocaleString()}` :
                                                `${targetProgress.actual[metric]} / ${targetProgress.individualTarget[metric]}`
                                            }
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs text-slate-500">
                                            <span>Progress</span>
                                            <span className="font-bold">{targetProgress.individual[metric]}%</span>
                                        </div>
                                        <Progress value={targetProgress.individual[metric]} className="h-2" />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    
                    {/* Team Targets */}
                    <Card className="border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <UsersIcon size={20} className="text-primary-600" />
                                Team Targets
                            </CardTitle>
                            <span className="text-sm font-medium text-slate-500">
                                {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}
                            </span>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {['revenue', 'deals', 'clients'].map((metric) => (
                                <div key={metric} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                                            {metric === 'revenue' ? 'Revenue' : metric}
                                        </span>
                                        <span className="text-sm font-bold">
                                            {metric === 'revenue' ? 
                                                `$${targetProgress.actual[metric]?.toLocaleString()} / $${targetProgress.teamTarget[metric]?.toLocaleString()}` :
                                                `${targetProgress.actual[metric]} / ${targetProgress.teamTarget[metric]}`
                                            }
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs text-slate-500">
                                            <span>Progress</span>
                                            <span className="font-bold">{targetProgress.team[metric]}%</span>
                                        </div>
                                        <Progress value={targetProgress.team[metric]} className="h-2" />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Recent Sales */}
                <Card className="lg:col-span-2 border-none shadow-sm h-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Clock className="text-primary-500" size={20} />
                            Recent Sales Activity
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="text-primary-600 gap-1">
                            View All <ArrowRight size={14} />
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {salesRep?.recentSales?.map((sale) => (
                            <div key={sale.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-2 h-10 rounded-full",
                                        sale.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                                    )} />
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">Sale #{sale.id}</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">{sale.client} - ${sale.amount.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold text-slate-900 dark:text-white">{sale.progress}%</div>
                                    <Progress value={sale.progress} className="w-20 h-1.5 mt-1" />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Sales Performance */}
                <Card className="border-none shadow-sm h-full">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Sales Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {salesRep?.performance?.map((monthData) => {
                            // Calculate percentage of target (assuming $30k is target)
                            const target = 30000;
                            const value = Math.min(Math.round((monthData.revenue / target) * 100), 100);
                            return (
                                <div key={monthData.month} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">{monthData.month}</span>
                                        <span className="text-xs text-slate-500 font-bold">${monthData.revenue.toLocaleString()}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px] text-slate-400">
                                            <span>Target</span>
                                            <span>{value}%</span>
                                        </div>
                                        <Progress value={value} className="h-1" />
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

export default SalesDashboard;