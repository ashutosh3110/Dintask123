import React, { useState, useMemo } from 'react';
import { BarChart3, PieChart, LineChart, Download, Filter, Search, TrendingUp, TrendingDown, Target, Users, FileText, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import useAuthStore from '@/store/authStore';
import useSalesStore from '@/store/salesStore';
import useSalesTargetsStore from '@/store/salesTargetsStore';

const SalesReports = () => {
    const { user } = useAuthStore();
    const { salesReps, getSalesRepByEmail } = useSalesStore();
    const {
        individualTargets,
        teamTargets,
        actualPerformance,
        calculateIndividualProgress,
        calculateTeamProgress,
        getIndividualTargetsByPeriod,
        getTeamTargetsByPeriod,
        getActualPerformanceByPeriod
    } = useSalesTargetsStore();
    
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [filters, setFilters] = useState({ status: 'all', type: 'all' });
    const [targetPeriod, setTargetPeriod] = useState('monthly');

    // Get current sales rep data
    const salesRep = useMemo(() => {
        return getSalesRepByEmail(user?.email);
    }, [user?.email, getSalesRepByEmail]);
    
    // Map reporting period to target period
    const reportingToTargetPeriod = {
        week: 'monthly',
        month: 'monthly',
        quarter: 'quarterly',
        year: 'yearly'
    };
    
    // Calculate target progress for reporting
    const targetReportData = useMemo(() => {
        const mappedPeriod = reportingToTargetPeriod[selectedPeriod] || 'monthly';
        return {
            individual: {
                revenue: calculateIndividualProgress(mappedPeriod, 'revenue'),
                deals: calculateIndividualProgress(mappedPeriod, 'deals'),
                clients: calculateIndividualProgress(mappedPeriod, 'clients')
            },
            team: {
                revenue: calculateTeamProgress(mappedPeriod, 'revenue'),
                deals: calculateTeamProgress(mappedPeriod, 'deals'),
                clients: calculateTeamProgress(mappedPeriod, 'clients')
            },
            individualTarget: getIndividualTargetsByPeriod(mappedPeriod),
            teamTarget: getTeamTargetsByPeriod(mappedPeriod),
            actual: getActualPerformanceByPeriod(mappedPeriod)
        };
    }, [selectedPeriod, calculateIndividualProgress, calculateTeamProgress, getIndividualTargetsByPeriod, getTeamTargetsByPeriod, getActualPerformanceByPeriod]);

    // Calculate report metrics based on selected period
    const reportMetrics = useMemo(() => {
        if (!salesRep) {
            return {
                totalRevenue: 0,
                totalDeals: 0,
                avgDealValue: 0,
                revenueChange: 0,
                dealsChange: 0,
                avgValueChange: 0
            };
        }

        // Mock data based on period
        const metrics = {
            week: {
                totalRevenue: 24560,
                totalDeals: 5,
                avgDealValue: 4912,
                revenueChange: 15.2,
                dealsChange: 25,
                avgValueChange: -7.5
            },
            month: {
                totalRevenue: 124560,
                totalDeals: 28,
                avgDealValue: 4448,
                revenueChange: 12.5,
                dealsChange: 8,
                avgValueChange: -2
            },
            quarter: {
                totalRevenue: 389000,
                totalDeals: 85,
                avgDealValue: 4576,
                revenueChange: 18.3,
                dealsChange: 12,
                avgValueChange: 5.2
            },
            year: {
                totalRevenue: 1567800,
                totalDeals: 342,
                avgDealValue: 4584,
                revenueChange: 22.1,
                dealsChange: 15,
                avgValueChange: 6.8
            }
        };

        return metrics[selectedPeriod] || metrics.month;
    }, [salesRep, selectedPeriod]);

    const handleExport = () => {
        // Mock export functionality
        alert(`Exporting ${selectedPeriod} sales report...`);
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Sales Reports</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Track and analyze your sales performance</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="quarter">This Quarter</SelectItem>
                            <SelectItem value="year">This Year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filters.status} onValueChange={(v) => handleFilterChange('status', v)}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="lost">Lost</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="gap-2">
                        <Filter size={16} />
                        Filter
                    </Button>
                    <Button className="gap-2" onClick={handleExport}>
                        <Download size={16} />
                        Export
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-none shadow-sm">
                    <CardHeader className="p-4">
                        <CardTitle className="text-base font-bold">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">${reportMetrics.totalRevenue.toLocaleString()}</div>
                        <div className={`text-sm mt-1 flex items-center gap-1 ${reportMetrics.revenueChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {reportMetrics.revenueChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            {reportMetrics.revenueChange >= 0 ? '+' : ''}{reportMetrics.revenueChange}% from previous period
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                    <CardHeader className="p-4">
                        <CardTitle className="text-base font-bold">Total Deals</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{reportMetrics.totalDeals}</div>
                        <div className={`text-sm mt-1 flex items-center gap-1 ${reportMetrics.dealsChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {reportMetrics.dealsChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            {reportMetrics.dealsChange >= 0 ? '+' : ''}{reportMetrics.dealsChange}% from previous period
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                    <CardHeader className="p-4">
                        <CardTitle className="text-base font-bold">Avg. Deal Value</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">${reportMetrics.avgDealValue.toLocaleString()}</div>
                        <div className={`text-sm mt-1 flex items-center gap-1 ${reportMetrics.avgValueChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {reportMetrics.avgValueChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            {reportMetrics.avgValueChange >= 0 ? '+' : ''}{reportMetrics.avgValueChange}% from previous period
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="revenue">
                <TabsList className="mb-4">
                    <TabsTrigger value="revenue">Revenue</TabsTrigger>
                    <TabsTrigger value="deals">Deals</TabsTrigger>
                    <TabsTrigger value="clients">Clients</TabsTrigger>
                    <TabsTrigger value="targets">Targets</TabsTrigger>
                </TabsList>
                <TabsContent value="revenue" className="space-y-4">
                    <Card className="border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-bold">Revenue Breakdown</CardTitle>
                            <div className="flex items-center gap-2">
                                <Select className="w-[150px]">
                                    <SelectTrigger>
                                        <SelectValue placeholder="View By" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="month">Month</SelectItem>
                                        <SelectItem value="product">Product</SelectItem>
                                        <SelectItem value="region">Region</SelectItem>
                                        <SelectItem value="client">Client</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="ghost" size="icon" onClick={() => handleExport()}>
                                    <Download size={16} />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="h-[300px] flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div className="text-center">
                                    <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                                    <p className="text-slate-500 dark:text-slate-400">Revenue by {selectedPeriod === 'month' ? 'Month' : 'Quarter'}</p>
                                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                        <div className="p-3 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                                            <p className="text-slate-400">Top Revenue Source</p>
                                            <p className="font-bold text-slate-900 dark:text-white">Software Sales</p>
                                            <p className="text-emerald-500">${(reportMetrics.totalRevenue * 0.45).toLocaleString()}</p>
                                        </div>
                                        <div className="p-3 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                                            <p className="text-slate-400">Growth Rate</p>
                                            <p className="font-bold text-slate-900 dark:text-white">{reportMetrics.revenueChange}%</p>
                                            <p className="text-emerald-500">vs previous {selectedPeriod}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="deals" className="space-y-4">
                    <Card className="border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-bold">Deal Pipeline</CardTitle>
                            <div className="flex items-center gap-2">
                                <Select className="w-[150px]">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Stage" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Stages</SelectItem>
                                        <SelectItem value="qualified">Qualified</SelectItem>
                                        <SelectItem value="proposal">Proposal</SelectItem>
                                        <SelectItem value="negotiation">Negotiation</SelectItem>
                                        <SelectItem value="closed">Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="ghost" size="icon" onClick={() => handleExport()}>
                                    <Download size={16} />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="h-[300px] flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div className="text-center">
                                    <PieChart className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                                    <p className="text-slate-500 dark:text-slate-400">Deal Distribution by Stage</p>
                                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                        <div className="p-3 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                                            <p className="text-slate-400">Win Rate</p>
                                            <p className="font-bold text-slate-900 dark:text-white">68%</p>
                                            <p className="text-emerald-500">of all qualified deals</p>
                                        </div>
                                        <div className="p-3 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                                            <p className="text-slate-400">Avg. Sales Cycle</p>
                                            <p className="font-bold text-slate-900 dark:text-white">24 days</p>
                                            <p className="text-amber-500">vs 30 days target</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="clients" className="space-y-4">
                    <Card className="border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-bold">Client Growth</CardTitle>
                            <div className="flex items-center gap-2">
                                <Select className="w-[150px]">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Segment" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Clients</SelectItem>
                                        <SelectItem value="new">New Clients</SelectItem>
                                        <SelectItem value="existing">Existing Clients</SelectItem>
                                        <SelectItem value="enterprise">Enterprise</SelectItem>
                                        <SelectItem value="smb">SMB</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="ghost" size="icon" onClick={() => handleExport()}>
                                    <Download size={16} />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="h-[300px] flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div className="text-center">
                                    <LineChart className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                                    <p className="text-slate-500 dark:text-slate-400">Client Acquisition Trend</p>
                                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                        <div className="p-3 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                                            <p className="text-slate-400">New Clients</p>
                                            <p className="font-bold text-slate-900 dark:text-white">12</p>
                                            <p className="text-emerald-500">this {selectedPeriod}</p>
                                        </div>
                                        <div className="p-3 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                                            <p className="text-slate-400">Retention Rate</p>
                                            <p className="font-bold text-slate-900 dark:text-white">85%</p>
                                            <p className="text-emerald-500">vs industry avg 75%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                {/* Sales Targets Tab */}
                <TabsContent value="targets" className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-bold">Sales Target Performance</h3>
                            <p className="text-slate-500 dark:text-slate-400">Track progress against individual and team targets</p>
                        </div>
                        <Select value={targetPeriod} onValueChange={setTargetPeriod}>
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
                                    {targetPeriod.charAt(0).toUpperCase() + targetPeriod.slice(1)}
                                </span>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {['revenue', 'deals', 'clients'].map((metric) => {
                                    const individualProgress = calculateIndividualProgress(targetPeriod, metric);
                                    const individualTarget = getIndividualTargetsByPeriod(targetPeriod)[metric];
                                    const actual = getActualPerformanceByPeriod(targetPeriod)[metric];
                                    
                                    return (
                                        <div key={metric} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                                                    {metric === 'revenue' ? 'Revenue' : metric}
                                                </span>
                                                <span className="text-sm font-bold">
                                                    {metric === 'revenue' ? 
                                                        `$${actual?.toLocaleString()} / $${individualTarget?.toLocaleString()}` :
                                                        `${actual} / ${individualTarget}`
                                                    }
                                                </span>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-xs text-slate-500">
                                                    <span>Progress</span>
                                                    <span className="font-bold">{individualProgress}%</span>
                                                </div>
                                                <Progress value={individualProgress} className="h-2" />
                                            </div>
                                        </div>
                                    );
                                })}
                                
                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                                            Overall Progress
                                        </span>
                                        <span className="text-sm font-bold">
                                            {Math.round((targetReportData.individual.revenue + targetReportData.individual.deals + targetReportData.individual.clients) / 3)}%
                                        </span>
                                    </div>
                                    <div className="space-y-1 mt-2">
                                        <Progress 
                                            value={Math.round((targetReportData.individual.revenue + targetReportData.individual.deals + targetReportData.individual.clients) / 3)} 
                                            className="h-2" 
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        {/* Team Targets */}
                        <Card className="border-none shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <Users size={20} className="text-primary-600" />
                                    Team Targets
                                </CardTitle>
                                <span className="text-sm font-medium text-slate-500">
                                    {targetPeriod.charAt(0).toUpperCase() + targetPeriod.slice(1)}
                                </span>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {['revenue', 'deals', 'clients'].map((metric) => {
                                    const teamProgress = calculateTeamProgress(targetPeriod, metric);
                                    const teamTarget = getTeamTargetsByPeriod(targetPeriod)[metric];
                                    const actual = getActualPerformanceByPeriod(targetPeriod)[metric];
                                    
                                    return (
                                        <div key={metric} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                                                    {metric === 'revenue' ? 'Revenue' : metric}
                                                </span>
                                                <span className="text-sm font-bold">
                                                    {metric === 'revenue' ? 
                                                        `$${actual?.toLocaleString()} / $${teamTarget?.toLocaleString()}` :
                                                        `${actual} / ${teamTarget}`
                                                    }
                                                </span>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-xs text-slate-500">
                                                    <span>Progress</span>
                                                    <span className="font-bold">{teamProgress}%</span>
                                                </div>
                                                <Progress value={teamProgress} className="h-2" />
                                            </div>
                                        </div>
                                    );
                                })}
                                
                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                                            Overall Team Progress
                                        </span>
                                        <span className="text-sm font-bold">
                                            {Math.round((targetReportData.team.revenue + targetReportData.team.deals + targetReportData.team.clients) / 3)}%
                                        </span>
                                    </div>
                                    <div className="space-y-1 mt-2">
                                        <Progress 
                                            value={Math.round((targetReportData.team.revenue + targetReportData.team.deals + targetReportData.team.clients) / 3)} 
                                            className="h-2" 
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    
                    {/* Target Comparison */}
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Target vs Actual Comparison</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="h-[300px] flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div className="text-center">
                                    <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                                    <p className="text-slate-500 dark:text-slate-400">Target vs Actual Performance</p>
                                    <div className="mt-6 grid grid-cols-3 gap-6 text-sm">
                                        <div className="p-4 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                                            <div className="flex items-center justify-center mb-3">
                                                <DollarSign size={24} className="text-blue-500" />
                                            </div>
                                            <h4 className="font-bold text-slate-900 dark:text-white mb-1">Revenue</h4>
                                            <div className="space-y-1">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Target:</span>
                                                    <span className="font-medium">${targetReportData.individualTarget.revenue?.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Actual:</span>
                                                    <span className="font-medium">${targetReportData.actual.revenue?.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Progress:</span>
                                                    <span className="font-bold text-emerald-600">{targetReportData.individual.revenue}%</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="p-4 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                                            <div className="flex items-center justify-center mb-3">
                                                <FileText size={24} className="text-amber-500" />
                                            </div>
                                            <h4 className="font-bold text-slate-900 dark:text-white mb-1">Deals</h4>
                                            <div className="space-y-1">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Target:</span>
                                                    <span className="font-medium">{targetReportData.individualTarget.deals}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Actual:</span>
                                                    <span className="font-medium">{targetReportData.actual.deals}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Progress:</span>
                                                    <span className="font-bold text-emerald-600">{targetReportData.individual.deals}%</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="p-4 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                                            <div className="flex items-center justify-center mb-3">
                                                <Users size={24} className="text-purple-500" />
                                            </div>
                                            <h4 className="font-bold text-slate-900 dark:text-white mb-1">Clients</h4>
                                            <div className="space-y-1">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Target:</span>
                                                    <span className="font-medium">{targetReportData.individualTarget.clients}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Actual:</span>
                                                    <span className="font-medium">{targetReportData.actual.clients}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Progress:</span>
                                                    <span className="font-bold text-emerald-600">{targetReportData.individual.clients}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SalesReports;