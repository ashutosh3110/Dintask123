import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import useEmployeeStore from '@/store/employeeStore';
import { ShieldCheck, UserPlus, Link2 } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

const ManagerRegister = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const referralCode = queryParams.get('ref');

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const addPendingRequest = useEmployeeStore(state => state.addPendingRequest);

    const handleRegister = async (e) => {
        e.preventDefault();
        const { fullName, email, password, confirmPassword } = formData;

        if (!fullName || !email || !password || !confirmPassword) {
            toast.error('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            if (referralCode) {
                addPendingRequest({
                    fullName,
                    email,
                    password,
                    workspaceId: referralCode,
                    role: 'Manager'
                });
                toast.success('Join request sent! Waiting for Admin approval.');
                navigate('/employee/success-join');
            } else {
                await new Promise(resolve => setTimeout(resolve, 1500));
                toast.success('Manager account application submitted. Please login.');
                navigate('/manager/login');
            }
        } catch {
            toast.error('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 font-sans">
            <Card className="w-full max-w-sm border-slate-200 dark:border-slate-800 shadow-xl shadow-primary-100/50 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden">
                <div className="h-2 bg-primary-600 w-full" />
                <CardHeader className="text-center space-y-1 pt-8">
                    <div className="flex justify-center mb-4">
                        <div className={cn(
                            "p-3 rounded-2xl transition-colors",
                            referralCode ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "bg-primary-50 dark:bg-primary-900/20 text-primary-600"
                        )}>
                            {referralCode ? <Link2 className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {referralCode ? 'Join as Manager' : 'Manager Registration'}
                    </CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400">
                        {referralCode ? (
                            <span className="flex items-center justify-center gap-1 text-emerald-600 font-bold dark:text-emerald-400">
                                Workspace: {referralCode}
                            </span>
                        ) : 'Create your management account'}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                type="text"
                                placeholder="Jane Admin"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="h-11 border-slate-200 focus:ring-primary-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Work Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="manager@dintask.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="h-11 border-slate-200 focus:ring-primary-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                className="h-11 border-slate-200 focus:ring-primary-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
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
                                    Creating Account...
                                </div>
                            ) : (
                                <><UserPlus size={18} className="mr-2" /> Register</>
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 pb-6 border-t border-slate-100 dark:border-slate-800 pt-6 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="text-center">
                        <p className="text-xs text-slate-500">
                            Already have an account? <Link to="/manager/login" className="font-bold text-primary-600 dark:text-primary-400 hover:underline">Sign In</Link>
                        </p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ManagerRegister;
