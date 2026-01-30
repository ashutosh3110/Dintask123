import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar as CalendarIcon,
    StickyNote,
    User,
    Bell,
    Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { cn } from '@/shared/utils/cn';
import useAuthStore from '@/store/authStore';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/components/ui/avatar';
import { scaleOnTap } from '@/shared/utils/animations';

const EmployeeLayout = () => {
    const location = useLocation();

    const navItems = [
        { name: 'Home', path: '/employee', icon: LayoutDashboard },
        { name: 'Calendar', path: '/employee/calendar', icon: CalendarIcon },
        { name: 'Notes', path: '/employee/notes', icon: StickyNote },
        { name: 'Profile', path: '/employee/profile', icon: User },
    ];

    const mainPaths = ['/employee', '/employee/calendar', '/employee/notes', '/employee/profile'];
    const showFooter = mainPaths.includes(location.pathname);

    return (
        <div className="fixed inset-0 h-[100dvh] w-full flex flex-col bg-background-light dark:bg-background-dark font-display transition-colors duration-300 overflow-hidden">
            {/* Page Content */}
            <main className="flex-1 overflow-y-auto no-scrollbar relative w-full h-full overscroll-y-contain">
                <div className={cn(
                    "max-w-[480px] mx-auto w-full min-h-full",
                    showFooter ? "pb-28" : "pb-6"
                )}>
                    <Outlet />
                </div>
            </main>

            {/* Floating Bottom Navigation */}
            <AnimatePresence>
                {showFooter && (
                    <motion.nav
                        initial={{ y: 100, x: '-50%', opacity: 0 }}
                        animate={{ y: 0, x: '-50%', opacity: 1 }}
                        exit={{ y: 100, x: '-50%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed bottom-6 left-1/2 w-[94%] max-w-[440px] h-16 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[28px] border border-white/30 dark:border-slate-800/40 shadow-[0_15px_35px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-50 px-3 flex items-center justify-around overflow-hidden"
                    >
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/employee'}
                                className="relative flex-1 h-full flex items-center justify-center py-1"
                            >
                                {({ isActive }) => (
                                    <>
                                        {/* Minimalist Classy Selector */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="nav-selector-bg"
                                                className="absolute inset-x-2 inset-y-2.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-sm z-0"
                                                initial={false}
                                                transition={{ type: 'spring', bounce: 0.1, duration: 0.6 }}
                                            />
                                        )}

                                        <motion.div
                                            className={cn(
                                                "relative z-10 flex flex-col items-center justify-center transition-all duration-300",
                                                isActive
                                                    ? "text-primary dark:text-primary-400 scale-110"
                                                    : "text-slate-500 dark:text-slate-400 opacity-70 hover:opacity-100"
                                            )}
                                        >
                                            <div className="relative">
                                                <item.icon
                                                    size={19}
                                                    className={cn(
                                                        "transition-all duration-300",
                                                        isActive ? "stroke-[2.2px]" : "stroke-[1.8px]"
                                                    )}
                                                />
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="nav-glow"
                                                        className="absolute -inset-1.5 bg-primary/10 dark:bg-primary-400/10 rounded-full blur-md -z-10"
                                                    />
                                                )}
                                            </div>
                                            <span className={cn(
                                                "text-[8px] font-bold mt-1 tracking-wider uppercase transition-all duration-300",
                                                isActive ? "text-primary dark:text-primary-400" : "text-slate-400 dark:text-slate-500"
                                            )}>
                                                {item.name}
                                            </span>
                                        </motion.div>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </motion.nav>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EmployeeLayout;
