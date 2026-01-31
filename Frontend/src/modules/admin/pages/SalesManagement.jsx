import React, { useState, useMemo } from 'react';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Briefcase,
    TrendingUp,
    IndianRupee,
    Users,
    Download,
    Shield,
    Filter,
    MoreHorizontal,
    Calendar,
    Building2,
    UserCircle
} from 'lucide-react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import useSalesStore from '@/store/salesStore';
import useCRMStore from '@/store/crmStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from '@/shared/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Label } from '@/shared/components/ui/label';
import { cn } from '@/shared/utils/cn';
import { format } from 'date-fns';
import { toast } from 'sonner';

const SalesManagement = () => {
    const { salesReps, addSalesRep, updateSalesRep, deleteSalesRep } = useSalesStore();
    const { leads, getPipelineData, moveLead, addLead, assignLead } = useCRMStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [isAddRepModalOpen, setIsAddRepModalOpen] = useState(false);
    const [isAddDealModalOpen, setIsAddDealModalOpen] = useState(false);
    const [newRepData, setNewRepData] = useState({ name: '', email: '' });
    const [newDealData, setNewDealData] = useState({
        name: '',
        company: '',
        amount: '',
        priority: 'medium',
        stage: 'New',
        owner: '',
        email: ''
    });

    const [parent] = useAutoAnimate();
    const [pipelineSearchTerm, setPipelineSearchTerm] = useState('');

    const filteredReps = useMemo(() => {
        return salesReps.filter(rep =>
            rep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rep.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [salesReps, searchTerm]);

    const pipelineData = getPipelineData();
    const processedPipeline = useMemo(() => {
        return pipelineData.map(column => {
            const filteredLeads = column.leads.filter(lead => {
                if (!lead) return false;
                const matchesSearch = lead.name.toLowerCase().includes(pipelineSearchTerm.toLowerCase()) ||
                    lead.company.toLowerCase().includes(pipelineSearchTerm.toLowerCase());
                return matchesSearch;
            });
            return { ...column, leads: filteredLeads };
        });
    }, [pipelineData, pipelineSearchTerm]);


    const handleAddRep = (e) => {
        e.preventDefault();
        addSalesRep({ ...newRepData });
        setNewRepData({ name: '', email: '' });
        setIsAddRepModalOpen(false);
        toast.success("Sales Representative added");
    };

    const handleAddDeal = () => {
        if (!newDealData.name || !newDealData.company) {
            toast.error("Name and Company are required");
            return;
        }

        const deal = {
            ...newDealData,
            amount: parseFloat(newDealData.amount) || 0,
            createdAt: new Date().toISOString(),
            status: newDealData.stage
        };

        const addedLead = addLead(deal);
        if (newDealData.stage !== 'New') {
            moveLead(addedLead.id, 'New', newDealData.stage);
        }

        setIsAddDealModalOpen(false);
        setNewDealData({
            name: '', company: '', amount: '', priority: 'medium', stage: 'New', owner: '', email: ''
        });
        toast.success("New deal created and assigned");
    };

    const getRepName = (id) => {
        const rep = salesReps.find(r => r.id === id);
        return rep ? rep.name : 'Unassigned';
    };

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'bg-red-100 text-red-700 border-red-200';
            case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Sales & Pipeline Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage sales team, assign deals, and track global pipeline.</p>
                </div>
            </div>

            <Tabs defaultValue="team" className="space-y-6">
                <TabsList className="bg-white dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800 rounded-xl h-auto">
                    <TabsTrigger value="team" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700">Team Management</TabsTrigger>
                    <TabsTrigger value="pipeline" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700">Global Pipeline</TabsTrigger>
                </TabsList>

                <TabsContent value="team" className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Stats Overview */}
                        <div className="grid gap-6 md:grid-cols-4 w-full">
                            {[
                                { label: 'Total Reps', value: salesReps.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                                { label: 'Active Deals', value: salesReps.reduce((acc, curr) => acc + (curr.activeDeals || 0), 0), icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                { label: 'Total Revenue', value: `₹${salesReps.reduce((acc, curr) => acc + (curr.totalSales || 0), 0).toLocaleString()}`, icon: IndianRupee, color: 'text-purple-600', bg: 'bg-purple-50' },
                                { label: 'Avg Conversion', value: `${salesReps.length > 0 ? (salesReps.reduce((acc, curr) => acc + (curr.conversionRate || 0), 0) / salesReps.length).toFixed(1) : 0}%`, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' }
                            ].map((stat, i) => (
                                <Card key={i} className="border-none shadow-sm flex-1">
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <div className={cn("p-3 rounded-2xl", stat.bg)}>
                                            <stat.icon size={20} className={stat.color} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                            <p className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="relative w-[300px]">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search representatives..."
                                className="pl-9 h-10 border-slate-100 dark:border-slate-800 rounded-xl"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="gap-2 border-slate-200 dark:border-slate-800 h-10">
                                <Download size={16} />
                                <span>Export</span>
                            </Button>
                            <Button onClick={() => setIsAddRepModalOpen(true)} className="gap-2 bg-primary-600 hover:bg-primary-700 h-10">
                                <Plus size={16} />
                                <span>Add Rep</span>
                            </Button>
                        </div>
                    </div>

                    <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-50 dark:border-slate-800">
                                        <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Representative</th>
                                        <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Active Deals</th>
                                        <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Total Sales</th>
                                        <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Conversion</th>
                                        <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody ref={parent}>
                                    {filteredReps.map((rep) => (
                                        <tr key={rep.id} className="border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 transition-colors group">
                                            <td className="p-5">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-800 shadow-sm">
                                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${rep.name}`} />
                                                        <AvatarFallback className="bg-primary-50 text-primary-600 font-bold">{rep.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white leading-none">{rep.name}</p>
                                                        <p className="text-xs text-slate-500 mt-1">{rep.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2">
                                                    <Briefcase size={14} className="text-slate-400" />
                                                    <span className="text-sm font-bold text-slate-700">{rep.activeDeals || 0} Deals</span>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2">
                                                    <IndianRupee size={14} className="text-emerald-500" />
                                                    <span className="text-sm font-bold text-emerald-700">₹{(rep.totalSales || 0).toLocaleString()}</span>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <Badge variant="outline" className="rounded-lg font-bold text-[10px] bg-slate-50 text-slate-600 tracking-wider">
                                                    {rep.conversionRate || 0}%
                                                </Badge>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2">
                                                    <div className={cn("h-1.5 w-1.5 rounded-full", rep.status === 'active' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-300")} />
                                                    <span className={cn("text-xs font-bold uppercase tracking-widest", rep.status === 'active' ? "text-emerald-600" : "text-slate-400")}> {rep.status} </span>
                                                </div>
                                            </td>
                                            <td className="p-5 text-right">
                                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"> <Edit2 size={14} /> </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg" onClick={() => deleteSalesRep(rep.id)}> <Trash2 size={14} /> </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredReps.length === 0 && (
                                <div className="p-20 text-center">
                                    <Shield className="mx-auto h-12 w-12 text-slate-200 mb-4" />
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">No sales reps found</h3>
                                    <p className="text-slate-500 dark:text-slate-400 mt-1">Try adjusting your search or filters.</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="pipeline" className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="relative w-full md:w-[350px]">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search deals, companies..."
                                className="pl-9 h-10 border-slate-100 dark:border-slate-800 rounded-xl"
                                value={pipelineSearchTerm}
                                onChange={(e) => setPipelineSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button onClick={() => setIsAddDealModalOpen(true)} className="gap-2 bg-primary-600 hover:bg-primary-700 h-10">
                            <Plus size={16} />
                            <span>Add Deal</span>
                        </Button>
                    </div>

                    <div className="flex overflow-x-auto pb-4 gap-6 custom-scrollbar">
                        {processedPipeline.map(({ stage, leads: stageLeads }) => (
                            <div key={stage} className="flex flex-col w-[300px] bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 h-full max-h-[calc(100vh-350px)] min-h-[500px]">
                                <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-t-xl sticky top-0 z-10">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-bold text-slate-700 dark:text-slate-200">{stage}</h3>
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                                            {stageLeads.length}
                                        </Badge>
                                    </div>
                                    <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className={cn("h-full bg-primary-500 rounded-full",
                                            stage === 'Won' ? 'bg-emerald-500' :
                                                stage === 'Lost' ? 'bg-red-500' : 'bg-primary-500'
                                        )} style={{ width: '100%' }} />
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                                    {stageLeads.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-24 text-slate-400 text-sm italic">
                                            No deals
                                        </div>
                                    ) : (
                                        stageLeads.map((lead) => (
                                            <div key={lead.id} className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 group hover:shadow-md transition-all">
                                                <div className="flex justify-between items-start mb-2">
                                                    <Badge variant="outline" className={cn("text-[10px] uppercase font-bold px-1.5 py-0.5 border", getPriorityColor(lead.priority))}>
                                                        {lead.priority}
                                                    </Badge>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 text-slate-400 hover:text-slate-600">
                                                        <MoreHorizontal size={14} />
                                                    </Button>
                                                </div>
                                                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1 line-clamp-2">{lead.name}</h4>
                                                <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
                                                    <Building2 size={12} />
                                                    <span className="truncate">{lead.company}</span>
                                                </div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Avatar className="h-5 w-5 border border-white">
                                                        <AvatarFallback className="text-[10px] bg-slate-100 text-slate-600">{getRepName(lead.owner).charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-xs text-slate-500 truncate">{getRepName(lead.owner)}</span>
                                                </div>
                                                <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800">
                                                    <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
                                                        <IndianRupee size={12} />
                                                        {Number(lead.amount || 0).toLocaleString()}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                                        <Calendar size={10} />
                                                        {lead.deadline ? format(new Date(lead.deadline), 'MMM d') : 'No date'}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Add Rep Dialog */}
            <Dialog open={isAddRepModalOpen} onOpenChange={setIsAddRepModalOpen}>
                <DialogContent className="sm:max-w-md rounded-3xl">
                    <DialogHeader>
                        <DialogTitle>Add New Sales Rep</DialogTitle>
                        <DialogDescription>Create a new sales representative account.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddRep} className="space-y-4 py-4">
                        <div className="grid gap-2 text-left">
                            <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                            <Input value={newRepData.name} onChange={(e) => setNewRepData({ ...newRepData, name: e.target.value })} placeholder="Rep Name" className="rounded-xl h-11" required />
                        </div>
                        <div className="grid gap-2 text-left">
                            <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                            <Input type="email" value={newRepData.email} onChange={(e) => setNewRepData({ ...newRepData, email: e.target.value })} placeholder="sales@dintask.com" className="rounded-xl h-11" required />
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsAddRepModalOpen(false)} className="rounded-xl h-11 px-6">Cancel</Button>
                            <Button type="submit" className="rounded-xl h-11 px-6 bg-primary-600 hover:bg-primary-700">Add Rep</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Add Deal Dialog */}
            <Dialog open={isAddDealModalOpen} onOpenChange={setIsAddDealModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Deal</DialogTitle>
                        <DialogDescription>Create a new deal and assign it to a team member.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Deal Name</Label>
                            <Input id="name" value={newDealData.name} onChange={(e) => setNewDealData({ ...newDealData, name: e.target.value })} placeholder="e.g. Website Redesign" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="company">Company</Label>
                            <Input id="company" value={newDealData.company} onChange={(e) => setNewDealData({ ...newDealData, company: e.target.value })} placeholder="Client Company" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="amount">Value (₹)</Label>
                                <Input id="amount" type="number" value={newDealData.amount} onChange={(e) => setNewDealData({ ...newDealData, amount: e.target.value })} placeholder="50000" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="priority">Priority</Label>
                                <Select value={newDealData.priority} onValueChange={(val) => setNewDealData({ ...newDealData, priority: val })}>
                                    <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="owner">Assign To</Label>
                            <Select value={newDealData.owner} onValueChange={(val) => setNewDealData({ ...newDealData, owner: val })}>
                                <SelectTrigger><SelectValue placeholder="Select Sales Rep" /></SelectTrigger>
                                <SelectContent>
                                    {salesReps.map(rep => (
                                        <SelectItem key={rep.id} value={rep.id}>{rep.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDealModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddDeal}>Create Deal</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SalesManagement;
