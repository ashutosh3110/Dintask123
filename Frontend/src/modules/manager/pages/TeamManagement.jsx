import React, { useMemo, useState } from 'react';
import {
    Users,
    Search,
    Mail,
    Phone,
    MapPin,
    Calendar as CalendarIcon,
    MoreVertical,
    MessageSquare,
    CheckSquare,
    Clock,
    TrendingUp,
    Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '@/store/authStore';
import useEmployeeStore from '@/store/employeeStore';
import useTaskStore from '@/store/taskStore';
import { fadeInUp, staggerContainer } from '@/shared/utils/animations';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { cn } from '@/shared/utils/cn';

import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import useNotificationStore from '@/store/notificationStore';

const TeamManagement = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const employees = useEmployeeStore(state => state.employees);
    const tasks = useTaskStore(state => state.tasks);
    const [searchTerm, setSearchTerm] = useState('');
    const addNotification = useNotificationStore(state => state.addNotification);

    const teamMembers = useMemo(() => {
        return employees.filter(e =>
            e.managerId === user?.id &&
            e.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [employees, user, searchTerm]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-emerald-500';
            case 'away': return 'bg-amber-500';
            case 'offline': return 'bg-slate-300';
            default: return 'bg-slate-300';
        }
    };
    const [selectedMember, setSelectedMember] = useState(null);
    const [messageContent, setMessageContent] = useState("");
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

    const handleOpenMessageModal = (member) => {
        setSelectedMember(member);
        setMessageContent("");
        setIsMessageModalOpen(true);
    };

    const handleSendMessage = () => {
        if (!messageContent.trim()) {
            toast.error("Please enter a message");
            return;
        }

        addNotification({
            title: `Message from ${user?.name || 'Manager'}`,
            description: messageContent,
            category: 'message',
            recipientId: selectedMember?.id // Ideally used for filtering
        });

        toast.success(`Message sent to ${selectedMember.name}`);
        setIsMessageModalOpen(false);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-left">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Team Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        View and manage your team members and their work status.
                    </p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search team members..."
                        className="pl-10 h-11 border-none shadow-sm dark:bg-slate-900"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Team Grid */}
            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
                <AnimatePresence mode="popLayout">
                    {teamMembers.length > 0 ? teamMembers.map((member) => {
                        const memberTasks = tasks.filter(t => t.assignedTo?.includes(member.id));
                        const activeTasks = memberTasks.filter(t => t.status !== 'completed').length;
                        const completedTasks = memberTasks.filter(t => t.status === 'completed').length;

                        return (
                            <motion.div key={member.id} variants={fadeInUp} layout>
                                <Card className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                                    <div className="h-2 bg-primary-500/10 group-hover:bg-primary-500 transition-colors" />
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <Avatar className="h-16 w-16 border-2 border-primary-50 dark:border-primary-900/20">
                                                        <AvatarImage src={member.avatar} />
                                                        <AvatarFallback className="bg-primary-100 text-primary-600 font-bold text-xl">
                                                            {member.name.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className={cn(
                                                        "absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900",
                                                        getStatusColor(member.status)
                                                    )} />
                                                </div>
                                                <div className="text-left">
                                                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">
                                                        {member.name}
                                                    </h3>
                                                    <p className="text-xs text-slate-500 font-medium">{member.role}</p>
                                                    <Badge variant="secondary" className="mt-2 text-[8px] font-black uppercase tracking-[0.2em] bg-slate-100 dark:bg-slate-800">
                                                        {member.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-slate-400">
                                                <MoreVertical size={18} />
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-left">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active</p>
                                                <p className="text-lg font-bold text-slate-900 dark:text-white">{activeTasks}</p>
                                            </div>
                                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-left">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Completed</p>
                                                <p className="text-lg font-bold text-slate-900 dark:text-white">{completedTasks}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                                <Mail size={14} className="text-slate-400" />
                                                <span className="truncate">{member.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                                <CheckSquare size={14} className="text-primary-500" />
                                                <span>Workload: {activeTasks > 5 ? 'High' : activeTasks > 2 ? 'Moderate' : 'Low'}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 mt-6">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full rounded-xl gap-2 font-bold text-[10px] uppercase tracking-widest border-slate-200"
                                                onClick={() => handleOpenMessageModal(member)}
                                            >
                                                <MessageSquare size={14} /> Message
                                            </Button>
                                            <Button
                                                variant="default"
                                                size="sm"
                                                className="w-full rounded-xl gap-2 font-bold text-[10px] uppercase tracking-widest"
                                                onClick={() => navigate('/manager/progress')}
                                            >
                                                <Clock size={14} /> Tracker
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    }) : (
                        <div className="col-span-full text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                            <Users size={48} className="text-slate-200 mx-auto mb-4" />
                            <h3 className="text-lg font-bold">No team members found</h3>
                            <p className="text-sm text-slate-500">Try adjusting your search term.</p>
                        </div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Message Modal */}
            <Dialog open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Message {selectedMember?.name}</DialogTitle>
                        <DialogDescription>
                            Send a direct message to your team member.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                placeholder="Type your message here..."
                                value={messageContent}
                                onChange={(e) => setMessageContent(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsMessageModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSendMessage}>Send Message</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TeamManagement;
