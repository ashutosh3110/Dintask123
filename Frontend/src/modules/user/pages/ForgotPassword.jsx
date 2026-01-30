import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Send, KeyRound, Lock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

const ForgotPassword = ({ returnPath = '/employee/login' }) => {
    // Steps: 0 = Email, 1 = OTP, 2 = New Password, 3 = Success
    const [step, setStep] = useState(0);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    // Step 1: Send OTP
    const handleSendOTP = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error('Please enter your email address');
            return;
        }
        setIsLoading(true);
        // Simulate API
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        setStep(1);
        toast.success(`OTP sent to ${email}`);
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (!otp || otp.length < 4) {
            toast.error('Please enter a valid OTP');
            return;
        }
        setIsLoading(true);
        // Simulate API
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock validation: accept any 4+ digit OTP
        setIsLoading(false);
        setStep(2);
        toast.success('OTP Verified Successfully');
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!newPassword || !confirmPassword) {
            toast.error('Please fill in all fields');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        setIsLoading(true);
        // Simulate API
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        setStep(3);
        toast.success('Password has been reset successfully');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 font-sans">
            <Card className="w-full max-w-sm border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden">
                <div className="h-2 bg-primary-500 w-full" />
                <CardHeader className="text-center space-y-1 pt-8">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-2xl bg-primary-50 dark:bg-primary-900/20 text-primary-600">
                            {step === 0 && <Mail className="w-8 h-8" />}
                            {step === 1 && <KeyRound className="w-8 h-8" />}
                            {step === 2 && <Lock className="w-8 h-8" />}
                            {step === 3 && <CheckCircle2 className="w-8 h-8" />}
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {step === 0 && 'Forgot Password?'}
                        {step === 1 && 'Verify OTP'}
                        {step === 2 && 'Reset Password'}
                        {step === 3 && 'All Set!'}
                    </CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400">
                        {step === 0 && "Enter your email to receive a code"}
                        {step === 1 && "Enter the code sent to your email"}
                        {step === 2 && "Create a secure new password"}
                        {step === 3 && "Your password has been updated"}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Step 0: Email Input */}
                    {step === 0 && (
                        <form onSubmit={handleSendOTP} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 h-11"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-11 text-base font-semibold bg-primary-600 hover:bg-primary-700"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Sending...' : <><Send size={18} className="mr-2" /> Send OTP</>}
                            </Button>
                        </form>
                    )}

                    {/* Step 1: OTP Input */}
                    {step === 1 && (
                        <form onSubmit={handleVerifyOTP} className="space-y-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-xs text-blue-700 dark:text-blue-300 text-center mb-4">
                                Code sent to <span className="font-bold">{email}</span>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="otp">One-Time Password</Label>
                                <Input
                                    id="otp"
                                    type="text"
                                    placeholder="• • • • • •"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 h-11 text-center font-mono text-lg tracking-widest"
                                    maxLength={6}
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-11 text-base font-semibold bg-primary-600 hover:bg-primary-700"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Verifying...' : 'Verify OTP'}
                            </Button>
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => setStep(0)}
                                    className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white underline"
                                >
                                    Change Email or Resend
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 2: New Password Input */}
                    {step === 2 && (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="new-pass">New Password</Label>
                                <Input
                                    id="new-pass"
                                    type="password"
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-pass">Confirm Password</Label>
                                <Input
                                    id="confirm-pass"
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 h-11"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-11 text-base font-semibold bg-primary-600 hover:bg-primary-700"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Updating...' : 'Set New Password'}
                            </Button>
                        </form>
                    )}

                    {/* Step 3: Success */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg text-sm text-emerald-700 dark:text-emerald-300 text-center">
                                Your password has been updated securely. You can now login with your new credentials.
                            </div>
                            <Button
                                onClick={() => navigate(returnPath)}
                                className="w-full h-11 text-base font-semibold bg-slate-900 hover:bg-slate-800 text-white"
                            >
                                <ArrowLeft size={18} className="mr-2" /> Back to Login
                            </Button>
                        </div>
                    )}
                </CardContent>

                {step !== 3 && (
                    <CardFooter className="flex flex-col space-y-4 pb-6 border-t border-slate-100 dark:border-slate-800 pt-6 bg-slate-50/50 dark:bg-slate-900/50">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/employee/login')}
                            className="text-slate-500 hover:text-slate-900 dark:hover:text-white"
                        >
                            <ArrowLeft size={16} className="mr-2" /> Cancel Process
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
};

export default ForgotPassword;
