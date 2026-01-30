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
        { icon: <PhoneCall size={20} />, label: 'Follow Ups', path: `/${role}/crm/follow-ups` },
        { icon: <Contact size={20} />, label: 'Contacts', path: `/${role}/crm/contacts` },
    ];

    const SidebarContent = () => (
        <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-10 w-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                        <TrendingUp className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 dark:text-white leading-none">DinTask</h1>
                        <p className="text-xs font-bold text-primary-600 tracking-widest uppercase mt-1">CRM Suite</p>
                    </div>
                </div>

                <Button
                    variant="outline"
                    className="w-full justify-start gap-2 mb-6 font-bold border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-slate-800"
                    onClick={() => navigate(`/${role}`)}
                >
                    <ArrowLeft size={16} />
                    Back to {role === 'superadmin' ? 'Super Admin' : role.charAt(0).toUpperCase() + role.slice(1)} Header
                </Button>

                <div className="space-y-1">
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
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                    isActive
                                        ? "bg-primary-600 text-white shadow-md shadow-primary-500/20"
                                        : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-primary-600 z-0"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">{item.icon}</span>
                                <span className="relative z-10 text-sm font-bold">{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-800">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4">
                    <p className="text-xs font-bold text-slate-900 dark:text-white mb-1">Need Help?</p>
                    <p className="text-[10px] text-slate-500 mb-3">Check our CRM documentation for advanced features.</p>
                    <Button size="sm" variant="secondary" className="w-full text-xs font-bold bg-white dark:bg-slate-700 shadow-sm h-8">View Docs</Button>
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
