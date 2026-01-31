import React, { useState, useMemo } from 'react';
import {
    CheckSquare,
    Filter,
    Plus,
    Search,
    Calendar,
    IndianRupee,
    User,
    Clock,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Phone,
    Mail,
    Building
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Badge } from '@/shared/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import useCRMStore from '@/store/crmStore';
import useAuthStore from '@/store/authStore';
import useSalesStore from '@/store/salesStore';
import { toast } from 'sonner';


const Deals = () => {
    const { user } = useAuthStore();
    const { salesReps, getSalesRepByEmail } = useSalesStore();
    const { leads, addLead, updateLead, deleteLead, pipelineStages } = useCRMStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStage, setSelectedStage] = useState('all');
    const [selectedPriority, setSelectedPriority] = useState('all');
    const [sortBy, setSortBy] = useState('deadline');
    const [sortOrder, setSortOrder] = useState('asc');

    // Dialog state
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState(null);

    // Add Deal Dialog state
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newDealData, setNewDealData] = useState({
        clientName: '',
        amount: '',
        status: 'New',
        priority: 'medium'
    });

    // Get current sales rep data
    const salesRep = useMemo(() => {
        return getSalesRepByEmail(user?.email);
    }, [user?.email, getSalesRepByEmail]);

    // Filter and sort deals (leads that are treated as deals)
    const filteredDeals = useMemo(() => {
        if (!salesRep && !user) return [];

        // In a real app, we'd filter by owner. For demo purposes, we show all or filtered by mocked owner IDs if matched
        // let myDeals = leads.filter(lead => lead.owner === salesRep?.id || lead.owner === user?.id);
        let myDeals = leads; // Show all for visibility in this demo context

        return myDeals
            .filter(deal => {
                const matchesSearch = (deal.company || deal.name).toLowerCase().includes(searchTerm.toLowerCase());
                const matchesStage = selectedStage === 'all' || deal.status === selectedStage;
                const matchesPriority = selectedPriority === 'all' || deal.priority === selectedPriority;
                return matchesSearch && matchesStage && matchesPriority;
            })
            .sort((a, b) => {
                let aVal, bVal;
                switch (sortBy) {
                    case 'amount':
                        aVal = a.amount || 0;
                        bVal = b.amount || 0;
                        break;
                    case 'deadline':
                        aVal = a.deadline ? new Date(a.deadline) : new Date(8640000000000000);
                        bVal = b.deadline ? new Date(b.deadline) : new Date(8640000000000000);
                        break;
                    case 'stage':
                        aVal = a.status || '';
                        bVal = b.status || '';
                        break;
                    case 'priority':
                        const priorityOrder = { low: 1, medium: 2, high: 3 };
                        aVal = priorityOrder[a.priority] || 0;
                        bVal = priorityOrder[b.priority] || 0;
                        break;
                    default:
                        aVal = a.deadline ? new Date(a.deadline) : new Date(8640000000000000);
                        bVal = b.deadline ? new Date(b.deadline) : new Date(8640000000000000);
                }
                if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
    }, [leads, searchTerm, selectedStage, selectedPriority, sortBy, sortOrder, salesRep, user]);

    // Calculate deal statistics
    const dealStats = useMemo(() => {
        const totalDeals = filteredDeals.length;
        const totalValue = filteredDeals.reduce((sum, deal) => sum + (deal.amount || 0), 0);
        const wonDeals = filteredDeals.filter(d => d.status === 'Won').length;
        const lostDeals = filteredDeals.filter(d => d.status === 'Lost').length;
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
            winRate: isNaN(winRate) ? 0 : winRate
        };
    }, [filteredDeals]);

    const getStageColor = (stage) => {
        const colors = {
            'New': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            'Contacted': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
            'Meeting Done': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
            'Proposal Sent': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
            'Won': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            'Lost': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
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
        setIsAddOpen(true);
    };

    const submitNewDeal = () => {
        if (!newDealData.clientName) {
            toast.error("Client Name is required");
            return;
        }

        const newDeal = {
            name: newDealData.clientName, // Using name for company/client name mapping
            company: newDealData.clientName,
            status: newDealData.status,
            priority: newDealData.priority,
            amount: parseFloat(newDealData.amount) || 0,
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            owner: user?.id || 'demo-user',
            email: `contact@${newDealData.clientName.replace(/\s+/g, '').toLowerCase()}.com`,
            mobile: '555-0000',
            source: 'Manual'
        };
        addLead(newDeal);
        toast.success(`Deal created for ${newDealData.clientName}`);
        setIsAddOpen(false);
        setNewDealData({
            clientName: '',
            amount: '',
            status: 'New',
            priority: 'medium'
        });
    };

    const handleViewDeal = (dealId) => {
        const deal = leads.find(l => l.id === dealId);
        if (deal) {
            setSelectedDeal(deal);
            setIsViewOpen(true);
        }
    };

    const handleDeleteDeal = () => {
        if (selectedDeal) {
            deleteLead(selectedDeal.id);
            toast.success("Deal deleted successfully");
            setIsViewOpen(false);
            setSelectedDeal(null);
        }
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
                                {pipelineStages && pipelineStages.map(stage => (
                                    <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                                ))}
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
                                {filteredDeals.length > 0 ? (
                                    filteredDeals.map((deal) => (
                                        <TableRow key={deal.id}>
                                            <TableCell className="font-medium">{deal.id}</TableCell>
                                            <TableCell className="flex items-center gap-2">
                                                <User size={16} className="text-slate-400" />
                                                {deal.company || deal.name}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <IndianRupee size={16} className="inline-block mr-1 text-emerald-500" />
                                                ₹{(deal.amount || 0).toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getStageColor(deal.status)}>
                                                    {deal.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    deal.priority === 'high' ? 'destructive' :
                                                        deal.priority === 'medium' ? 'warning' : 'secondary'
                                                }>
                                                    {deal.priority || 'medium'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="flex items-center gap-2">
                                                <Calendar size={14} className="text-slate-400" />
                                                {deal.deadline ? new Date(deal.deadline).toLocaleDateString() : 'No deadline'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" onClick={() => handleViewDeal(deal.id)}>
                                                    View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            No deals found.
                                        </TableCell>
                                    </TableRow>
                                )}
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
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">₹{dealStats.totalValue.toLocaleString()}</span>
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full" style={{ width: `${Math.min(100, (dealStats.totalValue / (dealStats.totalValue * 2 || 1)) * 100)}%` }}></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-slate-500">Avg. Deal Value</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">₹{dealStats.avgDealValue.toLocaleString()}</p>
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
                                .filter(d => d.status !== 'Won' && d.status !== 'Lost' && d.deadline)
                                .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                                .slice(0, 5)
                                .map((deal) => (
                                    <div key={deal.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1">
                                                <Clock size={16} className="text-amber-500" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-slate-900 dark:text-white">{deal.company || deal.name}</h4>
                                                <p className="text-xs text-slate-500 mt-0.5">{new Date(deal.deadline).toLocaleDateString()} • ₹{(deal.amount || 0).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <Badge className={getStageColor(deal.status)}>
                                            {deal.status}
                                        </Badge>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* Deal Details Dialog */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{selectedDeal?.company || selectedDeal?.name}</DialogTitle>
                        <DialogDescription>
                            Deal Details & Information
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-500">Amount</span>
                            <span className="text-lg font-bold text-emerald-600">
                                ₹{(selectedDeal?.amount || 0).toLocaleString()}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-500">Stage</span>
                            <Badge className={selectedDeal ? getStageColor(selectedDeal.status) : ''}>
                                {selectedDeal?.status}
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-500">Priority</span>
                            <Badge variant="outline" className="capitalize">
                                {selectedDeal?.priority || 'medium'}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                                <div className="flex items-center gap-2 mb-1 text-slate-500">
                                    <User size={14} />
                                    <span className="text-xs font-bold">Contact Person</span>
                                </div>
                                <p className="text-sm font-medium">{selectedDeal?.name}</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                                <div className="flex items-center gap-2 mb-1 text-slate-500">
                                    <Building size={14} />
                                    <span className="text-xs font-bold">Company</span>
                                </div>
                                <p className="text-sm font-medium">{selectedDeal?.company}</p>
                            </div>
                        </div>

                        <div className="space-y-2 mt-2">
                            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                <Mail size={16} />
                                {selectedDeal?.email || 'N/A'}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                <Phone size={16} />
                                {selectedDeal?.mobile || 'N/A'}
                            </div>
                        </div>

                        {selectedDeal?.notes && (
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg mt-2">
                                <p className="text-xs font-bold text-slate-500 mb-1">Notes</p>
                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                    {selectedDeal.notes}
                                </p>
                            </div>
                        )}

                        <div className="text-xs text-slate-400 text-right mt-2">
                            Source: {selectedDeal?.source || 'Unknown'} • ID: {selectedDeal?.id}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="destructive" onClick={handleDeleteDeal}>Delete Deal</Button>
                        <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Deal Dialog */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create New Deal</DialogTitle>
                        <DialogDescription>
                            Add a new sales deal to your pipeline. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="clientName" className="text-right">
                                Client
                            </Label>
                            <Input
                                id="clientName"
                                value={newDealData.clientName}
                                onChange={(e) => setNewDealData({ ...newDealData, clientName: e.target.value })}
                                className="col-span-3"
                                placeholder="Client/Company Name"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                                Amount
                            </Label>
                            <Input
                                id="amount"
                                type="number"
                                value={newDealData.amount}
                                onChange={(e) => setNewDealData({ ...newDealData, amount: e.target.value })}
                                className="col-span-3"
                                placeholder="5000"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                                Status
                            </Label>
                            <Select
                                value={newDealData.status}
                                onValueChange={(val) => setNewDealData({ ...newDealData, status: val })}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="New">New</SelectItem>
                                    <SelectItem value="Contacted">Contacted</SelectItem>
                                    <SelectItem value="Meeting Done">Meeting Done</SelectItem>
                                    <SelectItem value="Proposal Sent">Proposal Sent</SelectItem>
                                    <SelectItem value="Won">Won</SelectItem>
                                    <SelectItem value="Lost">Lost</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="priority" className="text-right">
                                Priority
                            </Label>
                            <Select
                                value={newDealData.priority}
                                onValueChange={(val) => setNewDealData({ ...newDealData, priority: val })}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={submitNewDeal}>Save Deal</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
};


export default Deals;