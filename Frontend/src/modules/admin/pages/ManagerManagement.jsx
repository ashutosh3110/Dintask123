import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Search,
    MoreVertical,
    Edit2,
    Trash2,
    Mail,
    Phone,
    Shield,
    Users,
    Briefcase,
    CheckCircle2,
    XCircle,
    Download,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import useManagerStore from '@/store/managerStore';
import useEmployeeStore from '@/store/employeeStore';
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
import { cn } from '@/shared/utils/cn';

const ManagerManagement = () => {
    const navigate = useNavigate();
    const { managers, addManager, updateManager, deleteManager } = useManagerStore();
    const { employees } = useEmployeeStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [expandedManager, setExpandedManager] = useState(null);
    const [newManager, setNewManager] = useState({ name: '', email: '', department: '' });
    const [parent] = useAutoAnimate();

    const filteredManagers = useMemo(() => {
        return managers.filter(m =>
            m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [managers, searchTerm]);

    const handleAddManager = (e) => {
        e.preventDefault();
        addManager({
            ...newManager,
            id: `M00${managers.length + 1}`,
            status: 'active',
            teamMembers: []
        });
        setNewManager({ name: '', email: '', department: '' });
        setIsAddModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Manager Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage department heads and their team hierarchies.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 border-slate-200 dark:border-slate-800">
                        <Download size={18} />
                        <span>Export CSV</span>
                    </Button>
                    <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="gap-2 shadow-lg shadow-primary-200 dark:shadow-none bg-primary-600 hover:bg-primary-700"
                    >
                        <Plus size={18} />
                        <span>Add New Manager</span>
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-6 md:grid-cols-4">
                {[
                    { label: 'Total Managers', value: managers.length, icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Active Teams', value: managers.filter(m => m.status === 'active').length, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Total Team Size', value: employees.length, icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Pending Apps', value: '0', icon: CheckCircle2, color: 'text-amber-600', bg: 'bg-amber-50' }
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm">
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

            {/* Toolbar */}
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl">
                <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search by name or email..."
                            className="pl-9 h-11 border-slate-100 dark:border-slate-800 rounded-xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Manager Table */}
            <Card className="border-none shadow-lg shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50 dark:border-slate-800">
                                <th className="p-5 w-10"></th>
                                <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Manager</th>
                                <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Department</th>
                                <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Team Size</th>
                                <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody ref={parent}>
                            {filteredManagers.map((mgr) => {
                                const teamMembers = employees.filter(e => e.managerId === mgr.id);
                                const teamCount = teamMembers.length;
                                const isExpanded = expandedManager === mgr.id;

                                return (
                                    <React.Fragment key={mgr.id}>
                                        <tr
                                            className={cn(
                                                "border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 transition-colors group cursor-pointer",
                                                isExpanded && "bg-slate-50/80 dark:bg-slate-800/80"
                                            )}
                                            onClick={() => setExpandedManager(isExpanded ? null : mgr.id)}
                                        >
                                            <td className="p-5">
                                                {isExpanded ? <ChevronUp size={16} className="text-primary-600" /> : <ChevronDown size={16} className="text-slate-400" />}
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-800 shadow-sm">
                                                        <AvatarImage src={mgr.avatar} />
                                                        <AvatarFallback className="bg-primary-50 text-primary-600 font-bold">{mgr.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white leading-none">{mgr.name}</p>
                                                        <p className="text-xs text-slate-500 mt-1">{mgr.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <Badge variant="outline" className="rounded-lg font-bold text-[10px] bg-slate-50 text-slate-600 tracking-wider">
                                                    {mgr.department}
                                                </Badge>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2">
                                                    <Users size={14} className="text-slate-400" />
                                                    <span className="text-sm font-bold text-slate-700">{teamCount} Members</span>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2">
                                                    <div className={cn(
                                                        "h-1.5 w-1.5 rounded-full",
                                                        mgr.status === 'active' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-300"
                                                    )} />
                                                    <span className={cn(
                                                        "text-xs font-bold uppercase tracking-widest",
                                                        mgr.status === 'active' ? "text-emerald-600" : "text-slate-400"
                                                    )}>
                                                        {mgr.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-5 text-right">
                                                <div className="flex justify-end gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg">
                                                        <Edit2 size={14} />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg" onClick={() => navigate('/admin/chat')}>
                                                        <MessageSquare size={14} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                        onClick={() => deleteManager(mgr.id)}
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                        {isExpanded && (
                                            <tr className="bg-slate-50/30 dark:bg-slate-800/20">
                                                <td colSpan={6} className="p-0">
                                                    <div className="px-16 py-6 animate-in slide-in-from-top-2 duration-300">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                                                Team Members
                                                                <Badge className="bg-primary-50 text-primary-700 hover:bg-primary-50 border-none px-2 py-0.5 text-[9px]">{teamCount} Total</Badge>
                                                            </h4>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            {teamMembers.length > 0 ? (
                                                                teamMembers.map(emp => (
                                                                    <div key={emp.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm group/employee">
                                                                        <div className="flex items-center gap-3">
                                                                            <Avatar className="h-10 w-10 border border-slate-100 shadow-sm">
                                                                                <AvatarImage src={emp.avatar} />
                                                                                <AvatarFallback className="bg-slate-50 text-slate-600 text-[10px] font-bold">{emp.name.charAt(0)}</AvatarFallback>
                                                                            </Avatar>
                                                                            <div>
                                                                                <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{emp.name}</p>
                                                                                <p className="text-[10px] text-slate-500 mt-1">{emp.role}</p>
                                                                            </div>
                                                                        </div>
                                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-primary-600 rounded-lg">
                                                                            <ExternalLink size={14} />
                                                                        </Button>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="col-span-3 py-8 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No team members assigned</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                    {filteredManagers.length === 0 && (
                        <div className="p-20 text-center">
                            <Shield className="mx-auto h-12 w-12 text-slate-200 mb-4" />
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No managers found</h3>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Try adjusting your search or filters.</p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Add Manager Dialog */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="sm:max-w-md rounded-3xl">
                    <DialogHeader>
                        <DialogTitle>Add New Manager</DialogTitle>
                        <DialogDescription>Create a new department head account.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddManager} className="space-y-4 py-4">
                        <div className="grid gap-2 text-left">
                            <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                            <Input
                                value={newManager.name}
                                onChange={(e) => setNewManager({ ...newManager, name: e.target.value })}
                                placeholder="Manager Name"
                                className="rounded-xl h-11"
                                required
                            />
                        </div>
                        <div className="grid gap-2 text-left">
                            <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                            <Input
                                type="email"
                                value={newManager.email}
                                onChange={(e) => setNewManager({ ...newManager, email: e.target.value })}
                                placeholder="manager@dintask.com"
                                className="rounded-xl h-11"
                                required
                            />
                        </div>
                        <div className="grid gap-2 text-left">
                            <label className="text-xs font-bold text-slate-500 uppercase">Department</label>
                            <Input
                                value={newManager.department}
                                onChange={(e) => setNewManager({ ...newManager, department: e.target.value })}
                                placeholder="Engineering, Operations, etc."
                                className="rounded-xl h-11"
                                required
                            />
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)} className="rounded-xl h-11 px-6">Cancel</Button>
                            <Button type="submit" className="rounded-xl h-11 px-6 bg-primary-600 hover:bg-primary-700">Create Manager</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ManagerManagement;
