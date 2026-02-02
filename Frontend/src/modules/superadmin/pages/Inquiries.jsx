import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail,
    Phone,
    Building2,
    Calendar,
    Clock,
    MoreHorizontal,
    CheckCircle2,
    Clock3,
    AlertCircle,
    Search,
    Filter,
    ChevronRight,
    MessageSquare
} from 'lucide-react';
import useSuperAdminStore from '@/store/superAdminStore';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { format } from 'date-fns';

const Inquiries = () => {
    const { inquiries, updateInquiryStatus } = useSuperAdminStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const filteredInquiries = inquiries.filter(inq => {
        const matchesSearch =
            inq.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inq.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inq.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inq.workEmail.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterStatus === 'all' || inq.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'new':
                return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-none px-2.5 py-0.5 rounded-full flex items-center gap-1.5"><Clock3 size={12} strokeWidth={2.5} /> New</Badge>;
            case 'replied':
                return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-none px-2.5 py-0.5 rounded-full flex items-center gap-1.5"><CheckCircle2 size={12} strokeWidth={2.5} /> Replied</Badge>;
            case 'archived':
                return <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-none px-2.5 py-0.5 rounded-full flex items-center gap-1.5"><AlertCircle size={12} strokeWidth={2.5} /> Archived</Badge>;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Subscription Inquiries</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage and respond to Pro and Enterprise inquiries.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs font-bold px-3 py-1 border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
                        {filteredInquiries.length} Total Inquiries
                    </Badge>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                        placeholder="Search by name, email, or company..."
                        className="pl-10 h-11 bg-slate-50 dark:bg-slate-800/50 border-none focus-visible:ring-primary-500/30"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
                    {['all', 'new', 'replied', 'archived'].map((status) => (
                        <Button
                            key={status}
                            variant={filterStatus === status ? 'default' : 'ghost'}
                            size="sm"
                            className={filterStatus === status ? 'bg-primary-600 shadow-md shadow-primary-500/20' : 'text-slate-500 dark:text-slate-400'}
                            onClick={() => setFilterStatus(status)}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredInquiries.length > 0 ? (
                        filteredInquiries.map((inq, index) => (
                            <motion.div
                                key={inq.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                            >
                                <Card className="overflow-hidden border-slate-200 dark:border-slate-800 hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-none transition-all duration-300">
                                    <div className={`h-1.5 w-full ${inq.status === 'new' ? 'bg-primary-500' : inq.status === 'replied' ? 'bg-green-500' : 'bg-slate-400'}`} />
                                    <CardContent className="p-0">
                                        <div className="flex flex-col lg:flex-row lg:items-center p-6 gap-6">
                                            <div className="flex-1 space-y-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-slate-800 dark:text-white font-bold text-lg">
                                                            {inq.firstName[0]}{inq.lastName[0]}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                                                                    {inq.firstName} {inq.lastName}
                                                                </h3>
                                                                {getStatusBadge(inq.status)}
                                                            </div>
                                                            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-1.5 mt-0.5">
                                                                <Building2 size={14} strokeWidth={2.5} /> {inq.company}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="lg:hidden">
                                                        <InquiryActions inq={inq} updateStatus={updateInquiryStatus} />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 pt-2">
                                                    <div className="flex items-center gap-2.5 text-sm font-medium text-slate-600 dark:text-slate-400">
                                                        <Mail size={16} className="text-slate-400" />
                                                        <span className="truncate">{inq.workEmail}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2.5 text-sm font-medium text-slate-600 dark:text-slate-400">
                                                        <Phone size={16} className="text-slate-400" />
                                                        <span>{inq.phone}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2.5 text-sm font-medium text-slate-600 dark:text-slate-400">
                                                        <Calendar size={16} className="text-slate-400" />
                                                        <span>{inq.planSelected} Plan</span>
                                                    </div>
                                                </div>

                                                {inq.questions && (
                                                    <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-sm italic text-slate-600 dark:text-slate-400 relative">
                                                        <MessageSquare className="absolute -top-3 -left-3 p-1 w-7 h-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-full text-primary-500 shadow-sm" />
                                                        "{inq.questions}"
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col justify-between items-end gap-4 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-4 lg:pt-0 lg:pl-6 min-w-[180px]">
                                                <div className="text-right space-y-1 w-full flex flex-row lg:flex-col justify-between items-center lg:items-end">
                                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                                        <Clock size={12} /> Received
                                                    </div>
                                                    <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                        {format(new Date(inq.date), 'MMM dd, yyyy')}
                                                        <span className="block text-[11px] font-medium text-slate-400">{format(new Date(inq.date), 'HH:mm aaa')}</span>
                                                    </div>
                                                </div>

                                                <div className="hidden lg:block w-full">
                                                    <InquiryActions inq={inq} updateStatus={updateInquiryStatus} fullWidth />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    ) : (
                        <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-700 mb-4">
                                <Search size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No inquiries found</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                                We couldn't find any inquiries matching your search or filters.
                            </p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const InquiryActions = ({ inq, updateStatus, fullWidth = false }) => (
    <div className={fullWidth ? "w-full space-y-2" : "flex items-center gap-2"}>
        <Button
            size="sm"
            className={fullWidth ? "w-full font-bold bg-primary-600 hover:bg-primary-700" : "font-bold bg-primary-600 hover:bg-primary-700"}
            onClick={() => window.open(`mailto:${inq.workEmail}?subject=Regarding your DinTask ${inq.planSelected} Plan Inquiry`)}
        >
            <Mail size={16} className="mr-2" /> Reply Email
        </Button>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full border border-slate-200 dark:border-slate-700">
                    <MoreHorizontal size={18} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 font-sans">
                <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => updateStatus(inq.id, 'replied')} className="flex items-center gap-2 py-2.5">
                    <CheckCircle2 size={16} className="text-green-500" />
                    <span className="font-medium">Mark as Replied</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateStatus(inq.id, 'new')} className="flex items-center gap-2 py-2.5">
                    <Clock3 size={16} className="text-blue-500" />
                    <span className="font-medium">Mark as New</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => updateStatus(inq.id, 'archived')} className="flex items-center gap-2 py-2.5 text-slate-500">
                    <AlertCircle size={16} />
                    <span className="font-medium">Archive Inquiry</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
);

export default Inquiries;
