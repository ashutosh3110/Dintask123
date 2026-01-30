import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    CheckSquare,
    Users,
    BarChart3,
    Calendar as CalendarIcon,
    CreditCard,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    Menu,
    User,
    Bell,
    Shield,
    Palette,
    Globe,
    ChevronDown,
    Briefcase,
    ListChecks
} from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { Button } from '@/shared/components/ui/button';
import useAuthStore from '@/store/authStore';

const Sidebar = ({ role, isOpen, setIsOpen, isCollapsed, setIsCollapsed }) => {
    const logout = useAuthStore(state => state.logout);
    const navigate = useNavigate();
    const location = useLocation();
    const isManager = role === 'manager';
    const isAdmin = role === 'admin';
    const [isSettingsOpen, setIsSettingsOpen] = useState(
        (isManager && location.pathname.startsWith('/manager/settings')) ||
        (isAdmin && location.pathname.startsWith('/admin/settings'))
    );
    const adminSearchParams = isAdmin ? new URLSearchParams(location.search) : null;
    const adminActiveTab = isAdmin ? (adminSearchParams.get('tab') || 'profile') : null;

    const handleLogout = () => {
        logout();
        if (role === 'superadmin') navigate('/superadmin/login');
        else if (role === 'admin') navigate('/admin/login');
        else if (role === 'manager') navigate('/manager/login');
        else navigate('/employee/login');
    };

    const navItems = [
        ...(role === 'manager'
            ? [
                { name: 'Dashboard', path: '/manager', icon: LayoutDashboard },
                { name: 'Assign Task', path: '/manager/assign-task', icon: CheckSquare },
                { name: 'My Tasks', path: '/manager/my-tasks', icon: ListChecks },
                { name: 'Delegation', path: '/manager/delegation', icon: Users },
                { name: 'Team', path: '/manager/team', icon: Users },
                { name: 'CRM', path: '/manager/crm', icon: Briefcase },
                { name: 'Progress', path: '/manager/progress', icon: BarChart3 },
                { name: 'Schedule', path: '/manager/schedule', icon: CalendarIcon },
                { name: 'Settings', path: '/manager/settings', icon: Settings },
                { name: 'Reports', path: '/manager/reports', icon: BarChart3 },
            ]
            : []),
        ...(role === 'sales'
            ? [
                { name: 'Dashboard', path: '/sales', icon: LayoutDashboard },
                { name: 'CRM', path: '/sales/crm', icon: Briefcase },
                { name: 'Deals', path: '/sales/deals', icon: CheckSquare },
                { name: 'Sales Tasks', path: '/sales/tasks', icon: CheckSquare },
                { name: 'Clients', path: '/sales/clients', icon: Users },
                { name: 'Reports', path: '/sales/reports', icon: BarChart3 },
                { name: 'Schedule', path: '/sales/schedule', icon: CalendarIcon },
                { name: 'Settings', path: '/sales/settings', icon: Settings },
            ]
            : []),
        ...(role === 'admin'
            ? [
                { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
                { name: 'Tasks', path: `/${role}/tasks`, icon: CheckSquare },
                { name: 'CRM', path: '/admin/crm', icon: Briefcase },
                { name: 'Managers', path: '/admin/managers', icon: ShieldCheck },
                { name: 'Employees', path: '/admin/employees', icon: Users },
                { name: 'Reports', path: `/${role}/reports`, icon: BarChart3 },
                { name: 'Calendar', path: `/${role}/calendar`, icon: CalendarIcon },
                { name: 'Subscription', path: '/admin/subscription', icon: CreditCard },
                { name: 'Settings', path: `/${role}/settings`, icon: Settings },
            ]
            : []),
        ...(role === 'superadmin'
            ? [
                { name: 'Dashboard', path: '/superadmin', icon: LayoutDashboard },
                { name: 'CRM', path: '/superadmin/crm', icon: Briefcase },
                { name: 'Admins', path: '/superadmin/admins', icon: Users },
                { name: 'Plans', path: '/superadmin/plans', icon: CreditCard },
                { name: 'Settings', path: `/${role}/settings`, icon: Settings },
            ]
            : []),
    ];

    const managerSettingsSubItems = isManager
        ? [
            { name: 'Profile Information', path: '/manager/settings/profile', icon: User },
            { name: 'Notifications', path: '/manager/settings/notifications', icon: Bell },
        ]
        : [];

    const adminSettingsSubItems = isAdmin
        ? [
            { name: 'Profile', path: '/admin/settings?tab=profile', icon: User, tab: 'profile' },
            { name: 'Notifications', path: '/admin/settings?tab=notifications', icon: Bell, tab: 'notifications' },
            { name: 'Security', path: '/admin/settings?tab=security', icon: Shield, tab: 'security' },
            { name: 'Appearance', path: '/admin/settings?tab=appearance', icon: Palette, tab: 'appearance' },
        ]
        : [];

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 z-50 overflow-hidden",
                isCollapsed ? "w-20" : "w-64",
                // Mobile responsiveness: slide in/out
                isOpen ? "translate-x-0" : "-translate-x-full",
                // Desktop: always visible (reset translation)
                "lg:translate-x-0"
            )}
        >
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 mb-6 border-b border-slate-100 dark:border-slate-800 h-16">
                    {!isCollapsed && (
                        <div className="flex items-center gap-2 font-bold text-xl text-primary-600">
                            <ShieldCheck className="w-8 h-8" />
                            <span>DinTask</span>
                        </div>
                    )}
                    {isCollapsed && <ShieldCheck className="w-8 h-8 text-primary-600 mx-auto" />}

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:flex"
                    >
                        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </Button>
                </div>

                <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isSettingsItem = (isManager || isAdmin) && item.name === 'Settings';

                        if (isSettingsItem) {
                            return (
                                <div key={item.path}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsSettingsOpen(prev => !prev);
                                        }}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium group",
                                            "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                                        )}
                                    >
                                        <item.icon size={20} className={cn(
                                            "min-w-[20px]",
                                            isCollapsed ? "mx-auto" : ""
                                        )} />
                                        {!isCollapsed && (
                                            <>
                                                <span className="truncate flex-1">{item.name}</span>
                                                <ChevronDown
                                                    size={16}
                                                    className={cn(
                                                        "transition-transform",
                                                        !isSettingsOpen && "-rotate-90"
                                                    )}
                                                />
                                            </>
                                        )}
                                        {isCollapsed && (
                                            <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                                                {item.name}
                                            </div>
                                        )}
                                    </button>

                                    {!isCollapsed && isSettingsOpen && (
                                        <div className="mt-1 space-y-1">
                                            {(isManager ? managerSettingsSubItems : adminSettingsSubItems).map((subItem) => {
                                                const isActiveSub = isManager
                                                    ? location.pathname === subItem.path
                                                    : adminActiveTab === subItem.tab;

                                                return (
                                                    <NavLink
                                                        key={subItem.name}
                                                        to={subItem.path}
                                                        end
                                                        onClick={() => setIsOpen(false)}
                                                        className={() => cn(
                                                            "flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-medium group ml-6",
                                                            isActiveSub
                                                                ? "bg-primary-50 text-primary-600 dark:bg-primary-900/10 dark:text-primary-400"
                                                                : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                                                        )}
                                                    >
                                                        <subItem.icon size={16} className="min-w-[16px]" />
                                                        <span className="truncate">{subItem.name}</span>
                                                    </NavLink>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === `/${role}`}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) => cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium group",
                                    isActive
                                        ? "bg-primary-50 text-primary-600 dark:bg-primary-900/10 dark:text-primary-400"
                                        : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                                )}
                            >
                                <item.icon size={20} className={cn(
                                    "min-w-[20px]",
                                    isCollapsed ? "mx-auto" : ""
                                )} />
                                {!isCollapsed && <span className="truncate">{item.name}</span>}
                                {isCollapsed && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                                        {item.name}
                                    </div>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="p-3 border-t border-slate-100 dark:border-slate-800">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10",
                            isCollapsed && "justify-center"
                        )}
                        onClick={handleLogout}
                    >
                        <LogOut size={20} />
                        {!isCollapsed && <span className="ml-3">Logout</span>}
                    </Button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
