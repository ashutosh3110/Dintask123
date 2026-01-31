import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Palette,
    Save,
    Eye,
    Smartphone,
    TrendingUp,
    Bell,
    Mail,
    MessageSquare,
    Clock,
    Moon,
    AlertCircle,
    Lock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';
import { Separator } from '@/shared/components/ui/separator';
import useAuthStore from '@/store/authStore';
import { toast } from 'sonner';

const ManagerSettings = () => {
    const { user, updateProfile, changePassword } = useAuthStore();
    const location = useLocation();
    const isNotificationsPage = location.pathname.includes('/notifications');

    // Profile State
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        department: 'Product Engineering',
        role: 'Lead Manager'
    });

    // Password State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                department: user.department || 'Product Engineering',
                role: user.roleTitle || 'Lead Manager'
            });
        }
    }, [user]);

    const handleSaveAll = async () => {
        if (!profileData.name || !profileData.email) {
            toast.error("Name and Email are required");
            return;
        }

        setIsLoading(true);
        try {
            await updateProfile(profileData);
            toast.success("Settings saved successfully");
        } catch (error) {
            toast.error("Failed to save settings");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            toast.error("All password fields are required");
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            await changePassword(passwordData.currentPassword, passwordData.newPassword);
            toast.success("Password changed successfully");
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error("Failed to change password");
        } finally {
            setIsLoading(false);
        }
    };

    if (isNotificationsPage) {
        return (
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="text-left">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Notification Preferences</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Choose how and when you want to be notified.
                        </p>
                    </div>
                    <Button className="gap-2 px-6">
                        <Save size={18} />
                        Save Preferences
                    </Button>
                </div>

                <div className="grid gap-6">
                    {/* General Channels */}
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader className="border-b border-slate-50 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary-50 dark:bg-primary-900/10 rounded-lg text-primary-600">
                                    <Bell size={20} />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-bold">General Channels</CardTitle>
                                    <CardDescription>Control where you receive your notifications.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5 text-left">
                                    <Label className="text-base font-bold">Email Notifications</Label>
                                    <p className="text-sm text-slate-500">Receive daily summaries and urgent alerts via email.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5 text-left">
                                    <Label className="text-base font-bold">Push Notifications</Label>
                                    <p className="text-sm text-slate-500">Receive real-time updates on your desktop or mobile.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5 text-left">
                                    <Label className="text-base font-bold">In-App Badges</Label>
                                    <p className="text-sm text-slate-500">Show red badge indicators on the dashboard.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Activity Alerts */}
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader className="border-b border-slate-50 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/10 rounded-lg text-blue-600">
                                    <AlertCircle size={20} />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-bold">Activity Alerts</CardTitle>
                                    <CardDescription>Select which activities trigger a notification.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 grid gap-6 md:grid-cols-2">
                            <div className="flex items-start gap-3 space-y-0">
                                <Switch id="tasks" defaultChecked />
                                <div className="text-left">
                                    <Label htmlFor="tasks" className="font-bold">Task Assignments</Label>
                                    <p className="text-xs text-slate-500 mt-1">When tasks are assigned or completed.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 space-y-0">
                                <Switch id="mentions" defaultChecked />
                                <div className="text-left">
                                    <Label htmlFor="mentions" className="font-bold">Mentions & Comments</Label>
                                    <p className="text-xs text-slate-500 mt-1">When someone mentions you in a note.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 space-y-0">
                                <Switch id="team" defaultChecked />
                                <div className="text-left">
                                    <Label htmlFor="team" className="font-bold">Team Updates</Label>
                                    <p className="text-xs text-slate-500 mt-1">Daily status changes of your team.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 space-y-0">
                                <Switch id="system" />
                                <div className="text-left">
                                    <Label htmlFor="system" className="font-bold">System Announcements</Label>
                                    <p className="text-xs text-slate-500 mt-1">Platform updates and maintenance.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quiet Hours */}
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader className="border-b border-slate-50 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg text-indigo-600">
                                    <Moon size={20} />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-bold">Quiet Hours</CardTitle>
                                    <CardDescription>Pause notifications during specific times.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="space-y-0.5 text-left">
                                    <Label className="text-base font-bold">Enable Quiet Mode</Label>
                                    <p className="text-sm text-slate-500">Mute all non-urgent notifications.</p>
                                </div>
                                <Switch />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 text-left">
                                    <Label className="text-xs font-bold text-slate-400 uppercase">Start Time</Label>
                                    <Input type="time" defaultValue="22:00" className="rounded-xl" />
                                </div>
                                <div className="space-y-2 text-left">
                                    <Label className="text-xs font-bold text-slate-400 uppercase">End Time</Label>
                                    <Input type="time" defaultValue="08:00" className="rounded-xl" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // Default Profile View
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-left">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Account Settings</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Configure your profile, security, and team notification preferences.
                    </p>
                </div>
                <Button className="gap-2 px-6" onClick={handleSaveAll} disabled={isLoading}>
                    <Save size={18} />
                    {isLoading ? 'Saving...' : 'Save All Changes'}
                </Button>
            </div>

            <div className="space-y-6">
                <Card className="border-none shadow-sm overflow-hidden">
                    <CardHeader className="border-b border-slate-50 dark:border-slate-800">
                        <CardTitle className="text-lg font-bold">Public Profile</CardTitle>
                        <CardDescription>This information will be visible to your team members.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">


                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2 text-left">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                                <Input
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    className="rounded-xl h-11 border-slate-100 dark:border-slate-800"
                                />
                            </div>
                            <div className="space-y-2 text-left">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                                <Input
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    className="rounded-xl h-11 border-slate-100 dark:border-slate-800"
                                />
                            </div>
                            <div className="space-y-2 text-left">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Department</label>
                                <Input
                                    value={profileData.department}
                                    onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                                    className="rounded-xl h-11 border-slate-100 dark:border-slate-800"
                                />
                            </div>
                            <div className="space-y-2 text-left">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Role Title</label>
                                <Input
                                    value={profileData.role}
                                    onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                                    className="rounded-xl h-11 border-slate-100 dark:border-slate-800"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Password / Security Section */}
                <Card className="border-none shadow-sm overflow-hidden">
                    <CardHeader className="border-b border-slate-50 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-50 dark:bg-amber-900/10 rounded-lg text-amber-600">
                                <Lock size={20} />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-bold">Security</CardTitle>
                                <CardDescription>Update your password and security settings.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-end">
                            <div className="space-y-2 text-left">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Current Password</label>
                                <Input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    placeholder="••••••••"
                                    className="rounded-xl h-11 border-slate-100 dark:border-slate-800"
                                />
                            </div>
                            <div className="space-y-2 text-left">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">New Password</label>
                                <Input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    placeholder="••••••••"
                                    className="rounded-xl h-11 border-slate-100 dark:border-slate-800"
                                />
                            </div>
                            <div className="space-y-2 text-left">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Confirm Password</label>
                                <Input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    placeholder="••••••••"
                                    className="rounded-xl h-11 border-slate-100 dark:border-slate-800"
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button variant="outline" onClick={handlePasswordChange} disabled={isLoading}>
                                Update Password
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm overflow-hidden">
                    <CardHeader className="border-b border-slate-50 dark:border-slate-800">
                        <CardTitle className="text-lg font-bold">Manager Preferences</CardTitle>
                        <CardDescription>Customize your dashboard and team management experience.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        {[
                            { title: 'Auto-delegate status', desc: 'Notify team immediately when tasks are assigned to you for delegation.', icon: Smartphone },
                            { title: 'Performance tracking', desc: 'Enable detailed weekly progress reports for all team members.', icon: TrendingUp },
                            { title: 'Visibility mode', desc: 'Show your current activity status to team members.', icon: Eye }
                        ].map((pref, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white dark:bg-slate-900 rounded-lg text-slate-400">
                                        <pref.icon size={20} />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-none">{pref.title}</h4>
                                        <p className="text-[10px] text-slate-500 font-medium mt-1">{pref.desc}</p>
                                    </div>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ManagerSettings;
