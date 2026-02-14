import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '@/store/authStore';

import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/components/ui/tabs';

const SuperAdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error, isAuthenticated, role } = useAuthStore();
    const navigate = useNavigate();

    // Auto-redirect if already logged in
    useEffect(() => {
        if (isAuthenticated && role === 'superadmin') {
            navigate('/superadmin');
        }
    }, [isAuthenticated, role, navigate]);

    const handleLogin = async (e, role) => {
        e.preventDefault();

        // Map UI role to system role
        const systemRole = role === 'admin' ? 'superadmin' : 'superadmin_staff';

        const result = await login(email, password, systemRole);
        if (result.success) {
            toast.success('System Access Granted');
            navigate('/superadmin');
        } else {
            toast.error(result.error || 'Access Denied');
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-slate-950 font-sans">
            {/* Brand Side - Exact match with Admin Login */}
            <div className="hidden md:flex md:w-1/2 bg-slate-900 relative items-center justify-center p-12 overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
                <div className="relative z-10 text-white space-y-6 max-w-md">
                    <div className="h-14 w-14 rounded-2xl bg-primary-600 flex items-center justify-center mb-6 shadow-xl shadow-primary-900/30">
                        <img src="/dintask-logo.png" alt="DinTask" className="h-9 w-9 object-contain" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">Master control for your enterprise.</h1>
                    <p className="text-slate-400 text-lg">Oversee all organizations, manage subscriptions, and monitor system health with the Master Control Platform.</p>
                </div>
            </div>

            {/* Login Side */}
            <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center md:text-left space-y-2">
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                            System <span className="text-primary-600">Portal</span>
                        </h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Authenticating Root Protocol Access</p>
                    </div>

                    <Card className="border-2 border-slate-100 shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
                        <CardContent className="pt-10 pb-10 px-8 space-y-8">
                            <Tabs defaultValue="admin" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl p-1.5 mb-8">
                                    <TabsTrigger value="admin" className="rounded-xl h-10 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-md">Super Admin</TabsTrigger>
                                    <TabsTrigger value="employee" className="rounded-xl h-10 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-md">Operations Staff</TabsTrigger>
                                </TabsList>

                                <TabsContent value="admin">
                                    <form onSubmit={(e) => handleLogin(e, 'admin')} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="admin-email" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Administrator Protocol ID</Label>
                                            <Input
                                                id="admin-email"
                                                type="email"
                                                placeholder="ROOT@DINTASK.EXE"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="h-14 rounded-2xl bg-slate-50 border-none dark:bg-slate-800 font-bold focus-visible:ring-primary-500/20 text-xs"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="admin-password">Secure Password</Label>
                                                <Link to="/superadmin/forgot-password" size="sm" className="text-xs font-bold text-primary-600 hover:text-primary-500 uppercase tracking-tight">
                                                    Forgot?
                                                </Link>
                                            </div>
                                            <Input
                                                id="admin-password"
                                                type="password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="h-11 rounded-lg"
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            className="w-full h-14 text-[10px] font-black uppercase tracking-[0.2em] bg-primary-600 hover:bg-primary-700 text-white shadow-xl shadow-primary-900/20 rounded-2xl active:scale-95 transition-all"
                                            disabled={loading}
                                        >
                                            {loading ? 'MODULATING...' : 'ESTABLISH SECURE LINK'}
                                        </Button>
                                    </form>
                                </TabsContent>

                                <TabsContent value="employee">
                                    <form onSubmit={(e) => handleLogin(e, 'employee')} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="emp-email">Staff Email</Label>
                                            <Input
                                                id="emp-email"
                                                type="email"
                                                placeholder="staff@dintask.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="h-11 rounded-lg"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="emp-password">Access Code</Label>
                                                <Link to="/superadmin/forgot-password" size="sm" className="text-xs font-bold text-primary-600 hover:text-primary-500 uppercase tracking-tight">
                                                    Forgot?
                                                </Link>
                                            </div>
                                            <Input
                                                id="emp-password"
                                                type="password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="h-11 rounded-lg"
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            className="w-full h-14 text-[10px] font-black uppercase tracking-[0.2em] bg-slate-900 hover:bg-black text-white shadow-xl shadow-slate-900/20 rounded-2xl active:scale-95 transition-all"
                                            disabled={loading}
                                        >
                                            {loading ? 'MODULATING...' : 'ESTABLISH SECURE LINK'}
                                        </Button>
                                    </form>
                                </TabsContent>
                            </Tabs>

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2">
                                <span className="text-xs text-slate-500">New Administrator?</span>
                                <Link to="/superadmin/register" className="text-xs font-bold text-primary-600 hover:text-primary-500 uppercase tracking-tight underline decoration-2 underline-offset-4">
                                    Initialize Root
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-4 text-center">

                        <p className="text-xs text-slate-400 font-mono">
                            SECURE SYSTEM CONNECTION // 2026 DINTASK
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminLogin;
