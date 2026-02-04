import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import { ShieldCheck, LogIn, Lock } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

const SalesLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        const success = await login(email, password, 'sales');
        if (success) {
            toast.success('Sales access verified');
            navigate('/sales');
        } else {
            toast.error(error || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 font-sans">
            <Card className="w-full max-w-sm border-slate-200 dark:border-slate-800 shadow-xl shadow-primary-100/50 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden">
                <div className="h-2 bg-primary-600 w-full" />
                <CardHeader className="text-center space-y-1 pt-8">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-xl shadow-primary-500/10 border border-slate-50 dark:border-slate-800">
                            <img src="/src/assets/logo.png" alt="DinTask" className="h-10 w-10 object-contain" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Sales Portal
                    </CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400">
                        CRM & Sales Management
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Sales Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="sales@dintask.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-11 border-slate-200 focus:ring-primary-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <a href="/sales/forgot-password" className="text-xs font-medium text-primary-600 hover:text-primary-500">
                                    Forgot password?
                                </a>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-11 border-slate-200 focus:ring-primary-500"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 text-base font-semibold transition-all bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-200 dark:shadow-none"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2 text-white">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Verifying...
                                </div>
                            ) : (
                                <><LogIn size={18} className="mr-2" /> Authenticate</>
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 pb-6 border-t border-slate-100 dark:border-slate-800 pt-6 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="w-full p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                        <p className="text-xs text-slate-500 mb-2">
                            Don't have an account? <Link to="/sales/register" className="font-bold text-primary-600 dark:text-primary-400 hover:underline">Register</Link>
                        </p>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Demo Sales</span>
                        <span className="text-xs font-mono text-slate-600 dark:text-slate-300">sales@dintask.com / sales123</span>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default SalesLogin;