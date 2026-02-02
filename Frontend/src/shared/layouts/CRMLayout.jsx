import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    TrendingUp,
    PhoneCall,
    Contact,
    Menu,
    ArrowLeft,
    LogOut
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/shared/components/ui/sheet';
import { cn } from '@/shared/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

const CRMLayout = ({ role }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const sidebarItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Overview', path: `/${role}/crm` },
        { icon: <Users size={20} />, label: 'Leads', path: `/${role}/crm/leads` },
        { icon: <TrendingUp size={20} />, label: 'Pipeline', path: `/${role}/crm/pipeline` },
        ...(role !== 'manager' ? [{ icon: <PhoneCall size={20} />, label: 'Follow Ups', path: `/${role}/crm/follow-ups` }] : []),
        { icon: <Contact size={20} />, label: 'Contacts', path: `/${role}/crm/contacts` },
    ];

    const SidebarContent = () => (
        <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
            <div className="p-6">
                <div className="flex items-center gap-3.5 mb-8 px-2">
                    <div className="h-10 w-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 text-white">
                        <TrendingUp size={22} className="stroke-[2.5px]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 dark:text-white leading-none tracking-tight">DinTask</h1>
                        <p className="text-[11px] font-bold text-primary-600 tracking-[0.2em] uppercase mt-1.5 opacity-90">CRM Suite</p>
                    </div>
                </div>

                <div className="mb-6 px-1">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 h-10 font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 group border border-dashed border-slate-200 dark:border-slate-700"
                        onClick={() => navigate(`/${role}`)}
                    >
                        <div className="bg-slate-200 dark:bg-slate-700 rounded-md p-1 group-hover:scale-90 transition-transform">
                            <ArrowLeft size={14} className="text-slate-600 dark:text-slate-300" />
                        </div>
                        <span className="truncate text-xs">Back to {role === 'superadmin' ? 'Admin Panel' : 'Main Dashboard'}</span>
                    </Button>
                </div>

                <div className="space-y-1.5">
                    {sidebarItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => {
                                    navigate(item.path);
                                    setIsMobileOpen(false);
                                }}
                                className={cn(
                                    "w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                    isActive
                                        ? "bg-primary-600 text-white shadow-lg shadow-primary-500/25 translate-x-1"
                                        : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white hover:pl-5"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 z-0"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10 transition-transform duration-300 group-hover:scale-110">{item.icon}</span>
                                <span className={cn(
                                    "relative z-10 text-sm font-bold tracking-wide transition-all duration-300",
                                    isActive ? "opacity-100" : "opacity-90 group-hover:opacity-100"
                                )}>
                                    {item.label}
                                </span>
                                {isActive && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white/40 z-10"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-800">
                <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary-50 dark:bg-primary-900/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-125 duration-500" />

                    <p className="text-xs font-black text-slate-900 dark:text-white mb-1 relative z-10">Need Assistance?</p>
                    <p className="text-[10px] text-slate-500 mb-3 relative z-10 leading-relaxed">Check our CRM documentation for advanced features and guides.</p>
                    <Button size="sm" variant="secondary" className="w-full text-[10px] font-bold bg-white dark:bg-slate-700 shadow-sm h-8 relative z-10 hover:shadow-md transition-shadow">
                        View Documentation
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-display">
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 h-full shrink-0">
                <SidebarContent />
            </div>

            {/* Mobile Header & Sidebar */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                        <TrendingUp className="text-white" size={16} />
                    </div>
                    <span className="font-black text-slate-900 dark:text-white">DinTask CRM</span>
                </div>
                <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu size={20} />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 border-r-0 w-80">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto md:p-8 p-4 pt-20 md:pt-8">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default CRMLayout;
