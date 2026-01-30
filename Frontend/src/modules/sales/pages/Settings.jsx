import React from 'react';
import { User, Bell, Shield, Palette, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

const SalesSettings = () => {
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
                                <Input id="name" defaultValue="Sales Representative" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" defaultValue="sales@example.com" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" defaultValue="+1 (555) 123-4567" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="department">Department</Label>
                                <Select defaultValue="sales">
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
                                <Button variant="outline">Cancel</Button>
                                <Button>Save Changes</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Actions */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Account Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Change Password</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Update your account password regularly for security.</p>
                            <Button variant="outline" className="w-full mt-2">
                                Change Password
                            </Button>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Preferences</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Manage your email subscription settings.</p>
                            <Button variant="outline" className="w-full mt-2">
                                Manage Preferences
                            </Button>
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