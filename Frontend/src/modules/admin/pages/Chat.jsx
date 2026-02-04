import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    Search,
    Send,
    MessageSquare,
    User,
    ArrowLeft,
    MoreVertical,
    Phone,
    Video,
    Info,
    CheckCheck,
    Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { cn } from '@/shared/utils/cn';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';

import useAuthStore from '@/store/authStore';
import useEmployeeStore from '@/store/employeeStore';
import useChatStore from '@/store/chatStore';

const AdminChat = () => {
    const { user: currentUser } = useAuthStore();
    const { employees } = useEmployeeStore();
    const { messages, sendMessage } = useChatStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [activeChatId, setActiveChatId] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef(null);

    // Filter employees in the same workspace (or all for now as it's a demo)
    const availablePartners = useMemo(() => {
        // Admins can chat with everyone for now, or filter by their workspace
        return employees.filter(e => e.id !== currentUser?.id);
    }, [employees, currentUser]);

    // Get unique conversation partners
    const chatPartners = useMemo(() => {
        const partners = new Set();
        messages.forEach(msg => {
            if (msg.senderId === currentUser?.id) partners.add(msg.receiverId);
            if (msg.receiverId === currentUser?.id) partners.add(msg.senderId);
        });

        // Current active chats + all available partners (filtered by search)
        const combinedPartners = Array.from(new Set([...Array.from(partners), ...availablePartners.map(p => p.id)]));

        return combinedPartners.map(id => {
            const member = employees.find(e => e.id === id);
            if (!member) return null;

            const lastMsg = messages
                .filter(m => (m.senderId === id && m.receiverId === currentUser?.id) || (m.senderId === currentUser?.id && m.receiverId === id))
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

            return {
                ...member,
                lastMessage: lastMsg?.text || 'No messages yet',
                lastMessageTime: lastMsg?.timestamp || null,
            };
        }).filter(Boolean).filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [messages, availablePartners, employees, currentUser, searchTerm]);

    const activePartner = useMemo(() => {
        return chatPartners.find(p => p.id === activeChatId);
    }, [chatPartners, activeChatId]);

    const activeMessages = useMemo(() => {
        if (!activeChatId) return [];
        return messages.filter(msg =>
            (msg.senderId === currentUser?.id && msg.receiverId === activeChatId) ||
            (msg.senderId === activeChatId && msg.receiverId === currentUser?.id)
        ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }, [messages, activeChatId, currentUser]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [activeMessages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChatId) return;

        sendMessage(currentUser.id, activeChatId, newMessage);
        setNewMessage('');
    };

    return (
        <div className="flex h-[calc(100vh-120px)] bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800">
            {/* Sidebar */}
            <div className={cn(
                "w-full md:w-80 flex-shrink-0 border-r border-slate-100 dark:border-slate-800 flex flex-col",
                activeChatId ? "hidden md:flex" : "flex"
            )}>
                <div className="p-6 border-b border-slate-50 dark:border-slate-800">
                    <h1 className="text-xl font-black text-slate-900 dark:text-white mb-4">Direct Message</h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search employee..."
                            className="h-10 pl-10 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="p-2 space-y-1">
                        {chatPartners.map((partner) => (
                            <button
                                key={partner.id}
                                onClick={() => setActiveChatId(partner.id)}
                                className={cn(
                                    "w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left group",
                                    activeChatId === partner.id
                                        ? "bg-primary-50 dark:bg-primary-900/10"
                                        : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                )}
                            >
                                <div className="relative">
                                    <Avatar className="h-12 w-12 ring-2 ring-white dark:ring-slate-900 shadow-sm">
                                        <AvatarImage src={partner.avatar} />
                                        <AvatarFallback className="bg-primary-100 text-primary-700 font-bold">
                                            {partner.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <h3 className={cn(
                                            "text-sm font-bold truncate",
                                            activeChatId === partner.id ? "text-primary-700 dark:text-primary-400" : "text-slate-900 dark:text-white"
                                        )}>
                                            {partner.name}
                                        </h3>
                                        {partner.lastMessageTime && (
                                            <span className="text-[10px] text-slate-400 font-medium">
                                                {format(new Date(partner.lastMessageTime), 'HH:mm')}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400 truncate font-medium">
                                        {partner.lastMessage}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className={cn(
                "flex-1 flex flex-col bg-slate-50/30 dark:bg-slate-900/10",
                !activeChatId ? "hidden md:flex items-center justify-center" : "flex"
            )}>
                {activeChatId ? (
                    <>
                        {/* Chat Header */}
                        <div className="px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden"
                                    onClick={() => setActiveChatId(null)}
                                >
                                    <ArrowLeft size={20} />
                                </Button>
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={activePartner?.avatar} />
                                    <AvatarFallback className="bg-primary-100 text-primary-700 font-bold">
                                        {activePartner?.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1">
                                        {activePartner?.name}
                                    </h2>
                                    <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">
                                        Active Now
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary">
                                    <Phone size={18} />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary">
                                    <Video size={18} />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary">
                                    <MoreVertical size={18} />
                                </Button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6" ref={scrollRef}>
                            <div className="space-y-6">
                                {activeMessages.map((msg) => {
                                    const isMe = msg.senderId === currentUser?.id;
                                    return (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className={cn(
                                                "flex w-full",
                                                isMe ? "justify-end" : "justify-start"
                                            )}
                                        >
                                            <div className={cn(
                                                "max-w-[70%] space-y-1",
                                                isMe ? "items-end" : "items-start"
                                            )}>
                                                <div className={cn(
                                                    "px-5 py-3 rounded-[2rem] text-sm font-medium shadow-sm",
                                                    isMe
                                                        ? "bg-primary text-white rounded-tr-none"
                                                        : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none border border-slate-100 dark:border-slate-700"
                                                )}>
                                                    {msg.text}
                                                </div>
                                                <div className={cn("flex items-center gap-1.5 px-2", isMe ? "justify-end" : "justify-start")}>
                                                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                                                        {format(new Date(msg.timestamp), 'HH:mm')}
                                                    </span>
                                                    {isMe && <CheckCheck size={12} className="text-primary-500" />}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Chat Input */}
                        <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                            <form
                                onSubmit={handleSendMessage}
                                className="relative flex items-center gap-3"
                            >
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your official message..."
                                    className="h-14 pl-6 pr-14 bg-slate-50 dark:bg-slate-800/50 border-none rounded-3xl focus:ring-2 focus:ring-primary/20 text-sm font-medium placeholder:text-slate-300 transition-all shadow-inner"
                                />
                                <Button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="h-14 w-14 rounded-3xl bg-primary text-white shadow-xl shadow-primary/30 hover:shadow-primary/40 active:scale-95 transition-all flex items-center justify-center p-0 flex-shrink-0"
                                >
                                    <Send size={22} className="ml-1" />
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="text-center space-y-4 max-w-sm px-10">
                        <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary mx-auto mb-6 shadow-inner">
                            <MessageSquare size={44} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Admin Messenger</h2>
                        <p className="text-sm text-slate-400 font-medium leading-relaxed">
                            Connect directly with any employee in your organization. Send updates, queries or feedback instantly.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminChat;
