import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar as CalendarIcon,
    StickyNote,
    User,
    Bell,
    Crown,
    Menu,
    LogOut,
    UserPlus,
    MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { cn } from '@/shared/utils/cn';
import useAuthStore from '@/store/authStore';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/components/ui/avatar';

const EmployeeLayout = () => {
    const location = useLocation();
    const { logout, user } = useAuthStore();

    const navItems = [
        { name: 'Home', path: '/employee', icon: LayoutDashboard },
        { name: 'Calendar', path: '/employee/calendar', icon: CalendarIcon },
        { name: 'Notes', path: '/employee/notes', icon: StickyNote },
        { name: 'Upgrade', path: '/employee/subscription', icon: Crown },
        { name: 'Join Workspace', path: '/employee/join', icon: UserPlus },
        { name: 'Chat', path: '/employee/chat', icon: MessageSquare },
        { name: 'Notifications', path: '/employee/notifications', icon: Bell },
        { name: 'Profile', path: '/employee/profile', icon: User },
    ];

    const mainPaths = ['/employee', '/employee/calendar', '/employee/notes', '/employee/profile', '/employee/subscription', '/employee/join', '/employee/chat', '/employee/notifications'];
    const showFooter = mainPaths.includes(location.pathname);

    const mobileNavItems = [
        { name: 'Home', path: '/employee', icon: LayoutDashboard },
        { name: 'Calendar', path: '/employee/calendar', icon: CalendarIcon },
        { name: 'Chat', path: '/employee/chat', icon: MessageSquare },
        { name: 'Alerts', path: '/employee/notifications', icon: Bell },
        { name: 'Profile', path: '/employee/profile', icon: User },
    ];

    return (
        <div className="fixed inset-0 h-[100dvh] w-full flex bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300 overflow-hidden">

            {/* Desktop Sidebar - Hidden on Mobile */}
            <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shrink-0 z-20">
                <div className="flex items-center gap-3 px-2 mb-8 mt-2">
                    <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold">
                        DT
                    </div>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">DinTask</span>
                </div>

                <nav className="flex-1 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/employee'}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                                isActive
                                    ? "bg-primary-50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon size={20} className={cn(
                                        "transition-colors",
                                        isActive ? "text-primary-600 dark:text-primary-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                                    )} />
                                    {item.name}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                        <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-700">
                            <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                {user?.name || 'Employee'}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                                {user?.email || 'employee@dintask.com'}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={logout}
                        className="w-full mt-2 justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                        <LogOut size={18} className="mr-2" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 w-full relative h-full overflow-hidden flex flex-col">
                {/* Desktop Top Header (Optional, for spacing or breadcrumbs) */}
                <header className="hidden md:flex items-center justify-between h-16 px-8 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm shrink-0">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                        {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        </Button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto no-scrollbar w-full p-0 md:p-6 lg:p-8">
                    <div className={cn(
                        "w-full h-full mx-auto",
                        // Mobile: constrained width
                        "max-w-[480px] md:max-w-5xl lg:max-w-7xl",
                        showFooter ? "pb-28 md:pb-6" : "pb-6"
                    )}>
                        <Outlet />
                    </div>
                </div>
            </main>

            {/* Mobile Bottom Navigation - Hidden on Desktop */}
            <AnimatePresence>
                {showFooter && (
                    <motion.nav
                        initial={{ y: 100, x: '-50%', opacity: 0 }}
                        animate={{ y: 0, x: '-50%', opacity: 1 }}
                        exit={{ y: 100, x: '-50%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="md:hidden fixed bottom-6 left-1/2 w-[94%] max-w-[440px] h-16 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[28px] border border-white/30 dark:border-slate-800/40 shadow-[0_15px_35px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-50 px-3 flex items-center justify-around overflow-hidden"
                    >
                        {mobileNavItems.map((item) => (
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
