import React, { useState } from 'react';
import {
    Building2,
    Search,
    Filter,
    MoreVertical,
    ShieldAlert,
    CheckCircle2,
    Clock,
    XOctagon,
    Eye,
    Trash2,
    ChevronRight,
    UserPlus
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/shared/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

import useSuperAdminStore from '@/store/superAdminStore';
import { cn } from '@/shared/utils/cn';
import { fadeInUp, staggerContainer, scaleOnTap } from '@/shared/utils/animations';

const AdminAccounts = () => {
    const { admins, updateAdminStatus, deleteAdmin } = useSuperAdminStore();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAdmins = admins.filter(adm =>
        adm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        adm.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        adm.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleStatusChange = (id, newStatus) => {
        updateAdminStatus(id, newStatus);
        toast.success(`Account status updated to ${newStatus}`);
    };

    const statusIcons = {
        active: <CheckCircle2 size={14} className="text-emerald-500" />,
        pending: <Clock size={14} className="text-amber-500" />,
        suspended: <XOctagon size={14} className="text-red-500" />
    };

    const statusColors = {
        active: "bg-emerald-50 text-emerald-600 border-emerald-100",
        pending: "bg-amber-50 text-amber-600 border-amber-100",
        suspended: "bg-red-50 text-red-600 border-red-100"
    };

    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="space-y-6 pb-12"
        >
            <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">Admin Accounts</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
                        Manage client companies and their platform access.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <motion.div {...scaleOnTap}>
                        <Button className="flex items-center gap-2 shadow-lg shadow-primary-200 dark:shadow-none bg-primary-600 hover:bg-primary-700 h-11 px-6 rounded-xl">
                            <UserPlus size={18} />
                            <span className="font-bold">Onboard Company</span>
                        </Button>
                    </motion.div>
                </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden rounded-[2rem]">
                    <div className="p-4 border-b border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search companies or owners..."
                                className="pl-10 h-11 bg-slate-50 border-none dark:bg-slate-800 rounded-2xl font-medium focus:ring-2 focus:ring-primary-500/10 transition-all text-xs"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Button variant="outline" className="h-11 text-xs font-bold gap-2 flex-1 sm:flex-none rounded-2xl border-slate-100 dark:border-slate-800">
                                <Filter size={14} />
                                Filters
                            </Button>
                        </div>
                    </div>

                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-slate-50 dark:border-slate-800">
                                        <TableHead className="pl-8 text-[10px] font-black uppercase tracking-widest text-slate-400 min-w-[200px]">Company & Owner</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 min-w-[100px]">Current Plan</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 min-w-[90px]">Team Size</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 min-w-[100px]">Tasks</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 min-w-[100px]">Status</TableHead>
                                        <TableHead className="text-right pr-8 text-[10px] font-black uppercase tracking-widest text-slate-400 min-w-[50px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <AnimatePresence mode="popLayout">
                                        {filteredAdmins.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-48 text-center text-slate-400">
                                                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-full w-fit mx-auto mb-4">
                                                        <ShieldAlert size={32} className="opacity-20 text-slate-900 dark:text-white" />
                                                    </div>
                                                    <p className="font-bold text-slate-900 dark:text-white">No administrative accounts found.</p>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredAdmins.map((adm) => (
                                                <motion.tr
                                                    key={adm.id}
                                                    variants={fadeInUp}
                                                    initial="initial"
                                                    animate="animate"
                                                    exit="exit"
                                                    layout
                                                    className="border-slate-50 dark:border-slate-800 group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                                                >
                                                    <TableCell className="pl-8">
                                                        <div className="space-y-1 py-1">
                                                            <p className="font-black text-slate-900 dark:text-white leading-tight text-sm tracking-tight">{adm.name}</p>
                                                            <p className="text-[10px] text-slate-400 flex items-center gap-1.5 font-bold">
                                                                {adm.owner} <span className="text-slate-200 dark:text-slate-700">•</span> {adm.email}
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-none bg-slate-100 dark:bg-slate-800 text-slate-500 px-2.5 py-1 rounded-lg">
                                                            {adm.plan}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-xs font-bold text-slate-600 dark:text-slate-400">
                                                        {adm.employees} Members
                                                    </TableCell>
                                                    <TableCell className="text-xs font-bold text-slate-600 dark:text-slate-400">
                                                        {adm.tasks} Generated
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={cn(
                                                            "text-[9px] h-6 font-black uppercase tracking-widest gap-1.5 border px-2.5 rounded-full shadow-sm",
                                                            statusColors[adm.status]
                                                        )}>
                                                            {statusIcons[adm.status]}
                                                            {adm.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right pr-8">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:bg-white dark:hover:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800">
                                                                    <MoreVertical size={18} />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-52 rounded-2xl p-2">
                                                                <DropdownMenuLabel className="text-xs font-black uppercase tracking-widest text-slate-400 px-2 py-1.5">Manage Account</DropdownMenuLabel>
                                                                <DropdownMenuItem className="gap-3 cursor-pointer rounded-xl font-bold text-xs py-2.5">
                                                                    <Eye size={16} className="text-primary-500" /> View Details
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator className="my-2" />
                                                                <DropdownMenuLabel className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 px-2 py-1.5">Set Status</DropdownMenuLabel>
                                                                <DropdownMenuItem className="gap-3 cursor-pointer rounded-xl font-bold text-xs py-2.5 text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50 dark:focus:bg-emerald-900/10" onClick={() => handleStatusChange(adm.id, 'active')}>
                                                                    <CheckCircle2 size={16} /> Mark Active
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="gap-3 cursor-pointer rounded-xl font-bold text-xs py-2.5 text-amber-600 focus:text-amber-700 focus:bg-amber-50 dark:focus:bg-amber-900/10" onClick={() => handleStatusChange(adm.id, 'pending')}>
                                                                    <Clock size={16} /> Mark Pending
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="gap-3 cursor-pointer rounded-xl font-bold text-xs py-2.5 text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-900/10" onClick={() => handleStatusChange(adm.id, 'suspended')}>
                                                                    <XOctagon size={16} /> Suspend Account
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator className="my-2" />
                                                                <DropdownMenuItem className="gap-3 cursor-pointer rounded-xl font-black text-xs py-2.5 text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-900/10" onClick={() => deleteAdmin(adm.id)}>
                                                                    <Trash2 size={16} /> Delete Company
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </motion.tr>
                                            ))
                                        )}
                                    </AnimatePresence>
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div variants={fadeInUp} className="p-8 rounded-[2rem] bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 flex flex-col items-center text-center group hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-500">
                    <div className="p-3 bg-white dark:bg-emerald-900/20 rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="text-emerald-500" size={28} />
                    </div>
                    <h4 className="text-3xl font-black text-emerald-700 dark:text-emerald-400 tracking-tighter">{admins.filter(a => a.status === 'active').length}</h4>
                    <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-500/70 uppercase tracking-[0.2em] mt-1">Fully Operational</p>
                </motion.div>
                <motion.div variants={fadeInUp} className="p-8 rounded-[2rem] bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 flex flex-col items-center text-center group hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-500">
                    <div className="p-3 bg-white dark:bg-amber-900/20 rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                        <Clock className="text-amber-500" size={28} />
                    </div>
                    <h4 className="text-3xl font-black text-amber-700 dark:text-amber-400 tracking-tighter">{admins.filter(a => a.status === 'pending').length}</h4>
                    <p className="text-[10px] font-black text-amber-600 dark:text-amber-500/70 uppercase tracking-[0.2em] mt-1">Pending Onboarding</p>
                </motion.div>
                <motion.div variants={fadeInUp} className="p-8 rounded-[2rem] bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 flex flex-col items-center text-center group hover:shadow-lg hover:shadow-red-500/5 transition-all duration-500">
                    <div className="p-3 bg-white dark:bg-red-900/20 rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                        <XOctagon className="text-red-500" size={28} />
                    </div>
                    <h4 className="text-3xl font-black text-red-700 dark:text-red-400 tracking-tighter">{admins.filter(a => a.status === 'suspended').length}</h4>
                    <p className="text-[10px] font-black text-red-600 dark:text-red-500/70 uppercase tracking-[0.2em] mt-1">Restricted Access</p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AdminAccounts;
