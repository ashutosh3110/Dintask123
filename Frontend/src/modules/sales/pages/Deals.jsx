import React, { useState, useMemo } from 'react';
import {
    CheckSquare,
    Filter,
    Plus,
    Search,
    Calendar,
    DollarSign,
    User,
    Clock,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Badge } from '@/shared/components/ui/badge';
import useAuthStore from '@/store/authStore';
import useSalesStore from '@/store/salesStore';

const Deals = () => {
    const { user } = useAuthStore();
    const { salesReps, getSalesRepByEmail } = useSalesStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStage, setSelectedStage] = useState('all');
    const [selectedPriority, setSelectedPriority] = useState('all');
    const [sortBy, setSortBy] = useState('deadline');
    const [sortOrder, setSortOrder] = useState('asc');

    // Get current sales rep data
    const salesRep = useMemo(() => {
        return getSalesRepByEmail(user?.email);
    }, [user?.email, getSalesRepByEmail]);

    // Mock deals data - enhanced with more details
    const mockDeals = [
        { id: 'D001', client: 'ABC Corp', amount: 15000, stage: 'Negotiation', priority: 'high', deadline: '2026-02-15', created: '2026-01-20', owner: 'John Sales' },
        { id: 'D002', client: 'XYZ Ltd', amount: 8500, stage: 'Proposal', priority: 'medium', deadline: '2026-02-20', created: '2026-01-25', owner: 'John Sales' },
        { id: 'D003', client: '123 Industries', amount: 22000, stage: 'Closed Won', priority: 'high', deadline: '2026-02-05', created: '2026-01-10', owner: 'John Sales' },
        { id: 'D004', client: 'Acme Inc', amount: 5000, stage: 'Qualification', priority: 'low', deadline: '2026-02-28', created: '2026-01-30', owner: 'John Sales' },
        { id: 'D005', client: 'Global Tech', amount: 30000, stage: 'Closed Lost', priority: 'high', deadline: '2026-01-30', created: '2026-01-05', owner: 'John Sales' },
        { id: 'D006', client: 'Tech Solutions', amount: 12500, stage: 'Proposal', priority: 'medium', deadline: '2026-03-10', created: '2026-01-28', owner: 'John Sales' },
        { id: 'D007', client: 'Digital Innovations', amount: 18000, stage: 'Negotiation', priority: 'high', deadline: '2026-02-12', created: '2026-01-15', owner: 'John Sales' },
        { id: 'D008', client: 'Future Tech', amount: 9500, stage: 'Qualification', priority: 'medium', deadline: '2026-03-05', created: '2026-01-22', owner: 'John Sales' }
    ];

    // Filter and sort deals
    const filteredDeals = useMemo(() => {
        return mockDeals
            .filter(deal => {
                const matchesSearch = deal.client.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesStage = selectedStage === 'all' || deal.stage === selectedStage;
                const matchesPriority = selectedPriority === 'all' || deal.priority === selectedPriority;
                return matchesSearch && matchesStage && matchesPriority;
            })
            .sort((a, b) => {
                let aVal, bVal;
                switch (sortBy) {
                    case 'amount':
                        aVal = a.amount;
                        bVal = b.amount;
                        break;
                    case 'deadline':
                        aVal = new Date(a.deadline);
                        bVal = new Date(b.deadline);
                        break;
                    case 'stage':
                        aVal = a.stage;
                        bVal = b.stage;
                        break;
                    case 'priority':
                        aVal = a.priority;
                        bVal = b.priority;
                        break;
                    default:
                        aVal = new Date(a.deadline);
                        bVal = new Date(b.deadline);
                }
                if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
    }, [searchTerm, selectedStage, selectedPriority, sortBy, sortOrder]);

    // Calculate deal statistics
    const dealStats = useMemo(() => {
        const totalDeals = filteredDeals.length;
        const totalValue = filteredDeals.reduce((sum, deal) => sum + deal.amount, 0);
        const wonDeals = filteredDeals.filter(d => d.stage === 'Closed Won').length;
        const lostDeals = filteredDeals.filter(d => d.stage === 'Closed Lost').length;
        const activeDeals = totalDeals - wonDeals - lostDeals;
        const avgDealValue = totalDeals > 0 ? Math.round(totalValue / totalDeals) : 0;
        const winRate = totalDeals > 0 ? Math.round((wonDeals / (wonDeals + lostDeals)) * 100) : 0;

        return {
            totalDeals,
            totalValue,
            wonDeals,
            lostDeals,
            activeDeals,
            avgDealValue,
            winRate
        };
    }, [filteredDeals]);

    const getStageColor = (stage) => {
        const colors = {
            'Qualification': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            'Proposal': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
            'Negotiation': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
            'Closed Won': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            'Closed Lost': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        };
        return colors[stage] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const handleAddDeal = () => {
        // Mock add deal functionality
        alert('Add new deal functionality would open here');
    };

    const handleViewDeal = (dealId) => {
        // Mock view deal functionality
        alert(`Viewing deal ${dealId}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">My Deals</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and track all your sales deals</p>
                </div>
                <Button className="gap-2" onClick={handleAddDeal}>
                    <Plus size={16} />
                    New Deal
                </Button>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-bold">Deal Pipeline</CardTitle>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                            <Input 
                                placeholder="Search deals..." 
                                className="pl-8 w-[200px]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={selectedStage} onValueChange={setSelectedStage}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by Stage" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Stages</SelectItem>
                                <SelectItem value="Qualification">Qualification</SelectItem>
                                <SelectItem value="Proposal">Proposal</SelectItem>
                                <SelectItem value="Negotiation">Negotiation</SelectItem>
                                <SelectItem value="Closed Won">Closed Won</SelectItem>
                                <SelectItem value="Closed Lost">Closed Lost</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Filter by Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Priorities</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
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
                                    <TableHead>Deal ID</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead onClick={() => handleSort('amount')} className="cursor-pointer">
                                        <div className="flex items-center gap-1">
                                            Amount
                                            {sortBy === 'amount' && (
                                                sortOrder === 'asc' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead onClick={() => handleSort('stage')} className="cursor-pointer">
                                        <div className="flex items-center gap-1">
                                            Stage
                                            {sortBy === 'stage' && (
                                                sortOrder === 'asc' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />
                                            )}
                                        </div>
                                    </TableHead>
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
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredDeals.map((deal) => (
                                    <TableRow key={deal.id}>
                                        <TableCell className="font-medium">{deal.id}</TableCell>
                                        <TableCell className="flex items-center gap-2">
                                            <User size={16} className="text-slate-400" />
                                            {deal.client}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <DollarSign size={16} className="inline-block mr-1 text-emerald-500" />
                                            ${deal.amount.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStageColor(deal.stage)}>
                                                {deal.stage}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                deal.priority === 'high' ? 'destructive' :
                                                deal.priority === 'medium' ? 'warning' : 'secondary'
                                            }>
                                                {deal.priority}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="flex items-center gap-2">
                                            <Calendar size={14} className="text-slate-400" />
                                            {deal.deadline}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => handleViewDeal(deal.id)}>
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Deal Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm text-slate-500">Total Deals</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{dealStats.totalDeals}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-slate-500">Won Deals</p>
                                <p className="text-2xl font-bold text-emerald-600">{dealStats.wonDeals}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-slate-500">Lost Deals</p>
                                <p className="text-2xl font-bold text-red-600">{dealStats.lostDeals}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-slate-500">Active Deals</p>
                                <p className="text-2xl font-bold text-blue-600">{dealStats.activeDeals}</p>
                            </div>
                        </div>
                        <div className="mt-6 space-y-3">
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Total Pipeline Value</span>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">${dealStats.totalValue.toLocaleString()}</span>
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full" style={{ width: `${Math.min(100, (dealStats.totalValue / 200000) * 100)}%` }}></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-slate-500">Avg. Deal Value</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">${dealStats.avgDealValue.toLocaleString()}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-slate-500">Win Rate</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">{dealStats.winRate}%</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <TrendingUp size={16} className="text-emerald-500" />
                                <span className="text-emerald-600 font-medium">+12% from last month</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Upcoming Deadlines</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {filteredDeals
                                .filter(d => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost')
                                .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                                .slice(0, 5)
                                .map((deal) => (
                                <div key={deal.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1">
                                            <Clock size={16} className="text-amber-500" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-slate-900 dark:text-white">{deal.client}</h4>
                                            <p className="text-xs text-slate-500 mt-0.5">{deal.deadline} • ${deal.amount.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <Badge className={getStageColor(deal.stage)}>
                                        {deal.stage}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Deals;