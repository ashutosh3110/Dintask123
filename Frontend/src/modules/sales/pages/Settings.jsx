import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Palette, Globe, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { toast } from 'sonner';
import useAuthStore from '@/store/authStore';

const SalesSettings = () => {
    const { user, updateProfile, changePassword } = useAuthStore();

    // Profile State
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '+1 (555) 123-4567',
        department: 'sales'
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
                phone: user.phone || '+1 (555) 123-4567',
                department: user.department || 'sales'
            });
        }
    }, [user]);

    const handleProfileUpdate = async () => {
        if (!profileData.name || !profileData.email) {
            toast.error("Name and Email are required");
            return;
        }
        setIsLoading(true);
        try {
            await updateProfile(profileData);
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error("Failed to update profile");
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

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Customize your sales account and preferences</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Profile Information */}
                <Card className="lg:col-span-2 border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <User size={20} className="text-primary-500" />
                            Profile Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="department">Department</Label>
                                <Select
                                    value={profileData.department}
                                    onValueChange={(val) => setProfileData({ ...profileData, department: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sales">Sales</SelectItem>
                                        <SelectItem value="marketing">Marketing</SelectItem>
                                        <SelectItem value="support">Support</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => toast.info('Changes discarded')}>Cancel</Button>
                                <Button onClick={handleProfileUpdate} disabled={isLoading}>
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Actions */}
                <Card className="border-none shadow-sm h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Lock size={20} className="text-amber-500" />
                            Security
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Change Password</h3>
                            <div className="space-y-2">
                                <Input
                                    type="password"
                                    placeholder="Current Password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                />
                                <Input
                                    type="password"
                                    placeholder="New Password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                />
                                <Input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                />
                            </div>
                            <Button className="w-full" onClick={handlePasswordChange} disabled={isLoading}>
                                Update Password
                            </Button>
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Preferences</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Manage your email subscription settings.</p>
                                <Button variant="outline" className="w-full h-8 text-xs" onClick={() => toast.info('Preference center not available in demo')}>
                                    Manage Preferences
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Notifications */}
            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Bell size={20} className="text-primary-500" />
                        Notifications
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Notifications</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Receive email alerts for new deals and updates.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Deal Updates</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Get notified when deals progress.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Reminders</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Receive reminders for follow-ups.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SalesSettings;