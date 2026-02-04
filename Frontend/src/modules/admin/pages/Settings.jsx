import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    User,
    Bell,
    Shield,
    Palette,
    Lock,
    Mail,
    Smartphone,
    Check,
    Save,
    Eye,
    EyeOff,
    RefreshCw,
    Camera
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Switch } from "@/shared/components/ui/switch";
import { Separator } from "@/shared/components/ui/separator";
import useAuthStore from '@/store/authStore';
import { fadeInUp, staggerContainer } from '@/shared/utils/animations';
import { cn } from '@/shared/utils/cn';

const Settings = () => {
    const { user, updateProfile, changePassword } = useAuthStore();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'profile';
    const [isSaving, setIsSaving] = useState(false);

    // Form States
    const [profileForm, setProfileForm] = useState({ name: '', email: '' });
    const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
    const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

    useEffect(() => {
        if (user) {
            setProfileForm({ name: user.name, email: user.email });
        }
    }, [user]);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const success = await updateProfile(profileForm);
        setIsSaving(false);
        if (success) toast.success('Profile updated successfully');
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
            toast.error('Please fill all password fields');
            return;
        }
        if (passwordForm.new !== passwordForm.confirm) {
            toast.error('New passwords do not match');
            return;
        }
        if (passwordForm.new.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setIsSaving(true);
        const success = await changePassword(passwordForm.current, passwordForm.new);
        setIsSaving(false);

        if (success) {
            toast.success('Password changed successfully');
            setPasswordForm({ current: '', new: '', confirm: '' });
        }
    };

    const tabs = [
        { id: 'profile', icon: User, label: 'Profile' },
        { id: 'security', icon: Shield, label: 'Security' },
        { id: 'appearance', icon: Palette, label: 'Appearance' },
    ];

    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="space-y-8 pb-20 max-w-5xl mx-auto"
        >
            <motion.div variants={fadeInUp}>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Admin <span className="text-primary-600">Settings</span></h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage your workspace identity and security credentials.</p>
            </motion.div>

            {/* Tab Navigation */}
            <motion.div variants={fadeInUp} className="flex gap-2 overflow-x-auto no-scrollbar bg-white dark:bg-slate-900 p-2 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
                {tabs.map((tab) => (
                    <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? 'default' : 'ghost'}
                        onClick={() => setSearchParams({ tab: tab.id })}
                        className={cn(
                            "flex-1 h-12 rounded-2xl gap-2 font-bold transition-all",
                            activeTab === tab.id
                                ? "bg-primary-600 shadow-lg shadow-primary-500/20 text-white"
                                : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                        )}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </Button>
                ))}
            </motion.div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'profile' && (
                        <Card className="border-none shadow-xl shadow-slate-200/30 dark:shadow-none bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
                            <CardHeader className="p-8 pb-0">
                                <CardTitle className="text-2xl font-black">Public Profile</CardTitle>
                                <CardDescription className="font-bold text-slate-400">Basic information about your admin account</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="flex items-center gap-6">
                                    <div className="relative group">
                                        <div className="w-20 h-20 rounded-3xl bg-primary-100 dark:bg-slate-800 flex items-center justify-center text-2xl font-black text-primary-600">
                                            {user?.name?.charAt(0)}
                                        </div>
                                        <button className="absolute -bottom-1 -right-1 p-1.5 bg-white dark:bg-slate-700 rounded-lg shadow-md border border-slate-100 dark:border-slate-600">
                                            <Camera size={14} />
                                        </button>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-black text-slate-900 dark:text-white capitalize">{user?.name}</h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Admin Owner</p>
                                    </div>
                                </div>

                                <Separator />

                                <form onSubmit={handleProfileSubmit} className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</Label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <Input
                                                    value={profileForm.name}
                                                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                                    className="pl-12 h-14 rounded-2xl bg-slate-50 border-none dark:bg-slate-800 font-bold focus:ring-primary-500/20"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <Input
                                                    value={profileForm.email}
                                                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                                    className="pl-12 h-14 rounded-2xl bg-slate-50 border-none dark:bg-slate-800 font-bold"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={isSaving} className="h-14 px-8 rounded-2xl font-black bg-primary-600 hover:bg-primary-700 shadow-xl shadow-primary-500/20">
                                            {isSaving ? <RefreshCw className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
                                            Update Profile
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'security' && (
                        <Card className="border-none shadow-xl shadow-slate-200/30 dark:shadow-none bg-white dark:bg-slate-900 rounded-[2.5rem]">
                            <CardHeader className="p-8 pb-0">
                                <CardTitle className="text-2xl font-black">Password & Security</CardTitle>
                                <CardDescription className="font-bold text-slate-400">Secure your account with a strong password</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8">
                                <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-2xl">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <Input
                                                type={showPasswords.current ? "text" : "password"}
                                                value={passwordForm.current}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                                                className="pl-12 pr-12 h-14 rounded-2xl bg-slate-50 border-none dark:bg-slate-800 font-bold"
                                            />
                                            <button type="button" onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New Password</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <Input
                                                    type={showPasswords.new ? "text" : "password"}
                                                    value={passwordForm.new}
                                                    onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                                                    className="pl-12 h-14 rounded-2xl bg-slate-50 border-none dark:bg-slate-800 font-bold"
                                                />
                                                <button type="button" onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm New Password</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <Input
                                                    type={showPasswords.confirm ? "text" : "password"}
                                                    value={passwordForm.confirm}
                                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                                                    className="pl-12 h-14 rounded-2xl bg-slate-50 border-none dark:bg-slate-800 font-bold"
                                                />
                                                <button type="button" onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                    {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <Button type="submit" disabled={isSaving} className="h-14 px-10 rounded-2xl font-black bg-slate-900 dark:bg-white dark:text-slate-900 shadow-xl transition-all">
                                            {isSaving ? <RefreshCw className="animate-spin mr-2" size={18} /> : <Shield className="mr-2" size={18} />}
                                            Update Password
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}


                    {activeTab === 'appearance' && (
                        <Card className="border-none shadow-xl shadow-slate-200/30 dark:shadow-none bg-white dark:bg-slate-900 rounded-[2.5rem]">
                            <CardHeader className="p-8">
                                <CardTitle className="text-2xl font-black">Theme Customization</CardTitle>
                                <CardDescription className="font-bold text-slate-400">Choose your preferred dashboard style</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 pt-0">
                                <div className="grid grid-cols-2 gap-6">
                                    <div
                                        onClick={() => document.documentElement.classList.remove('dark')}
                                        className="p-6 rounded-[2rem] border-4 border-slate-100 dark:border-slate-800 cursor-pointer hover:border-primary-500 transition-all group"
                                    >
                                        <div className="aspect-video bg-slate-100 rounded-2xl mb-4 flex items-center justify-center">
                                            <Check className="text-primary-500 opacity-0 group-hover:opacity-100" />
                                        </div>
                                        <p className="text-center font-black uppercase tracking-widest text-slate-500">Light Mode</p>
                                    </div>
                                    <div
                                        onClick={() => document.documentElement.classList.add('dark')}
                                        className="p-6 rounded-[2rem] border-4 border-slate-100 dark:border-slate-800 cursor-pointer hover:border-primary-500 transition-all group"
                                    >
                                        <div className="aspect-video bg-slate-900 rounded-2xl mb-4 flex items-center justify-center">
                                            <Check className="text-primary-500 opacity-0 group-hover:opacity-100" />
                                        </div>
                                        <p className="text-center font-black uppercase tracking-widest text-slate-500">Dark Mode</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};

export default Settings;
