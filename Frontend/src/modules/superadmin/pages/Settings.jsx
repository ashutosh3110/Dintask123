import React, { useState, useEffect } from 'react';
import {
    Shield,
    Settings as SettingsIcon,
    Globe,
    Save,
    RefreshCw,
    Check,
    AlertTriangle,
    Mail,
    Lock
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Switch } from "@/shared/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Separator } from "@/shared/components/ui/separator";
import { Badge } from "@/shared/components/ui/badge";
import { fadeInUp, staggerContainer, scaleOnTap } from '@/shared/utils/animations';
import { cn } from '@/shared/utils/cn';
import useSuperAdminStore from '@/store/superAdminStore';

const SuperAdminSettings = () => {
    const { systemSettings, updateSystemSettings } = useSuperAdminStore();
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    // Local state for form handling before save
    const [formData, setFormData] = useState({
        platformName: '',
        supportEmail: '',
        maintenanceMode: false,
        force2FA: false,
        sessionTimeout: 24
    });

    useEffect(() => {
        if (systemSettings) {
            setFormData(systemSettings);
        }
    }, [systemSettings]);

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        setIsSaved(false);
    };

    const handleSave = () => {
        setIsSaving(true);
        // Simulate network request
        setTimeout(() => {
            updateSystemSettings(formData);
            setIsSaving(false);
            setIsSaved(true);
            toast.success('System settings updated globally');
            setTimeout(() => setIsSaved(false), 2000);
        }, 800);
    };

    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="space-y-8 pb-20 max-w-6xl mx-auto"
        >
            <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                        System Settings
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
                        Manage global parameters, security protocols, and platform identity.
                    </p>
                </div>
                <motion.div {...scaleOnTap}>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving || isSaved}
                        className={cn(
                            "gap-2 rounded-xl h-11 px-6 font-bold transition-all duration-300 shadow-lg shadow-primary-500/20",
                            isSaved ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-primary-600 hover:bg-primary-700"
                        )}
                    >
                        <AnimatePresence mode='wait' initial={false}>
                            {isSaving ? (
                                <motion.div
                                    key="saving"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                >
                                    <RefreshCw className="animate-spin" size={18} />
                                </motion.div>
                            ) : isSaved ? (
                                <motion.div
                                    key="saved"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                >
                                    <Check size={18} strokeWidth={3} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                >
                                    <Save size={18} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <span>{isSaving ? 'Saving...' : isSaved ? 'All Changes Saved' : 'Save Changes'}</span>
                    </Button>
                </motion.div>
            </motion.div>

            <Tabs defaultValue="general" className="w-full">
                <div className="flex flex-col lg:flex-row gap-8">
                    <motion.aside variants={fadeInUp} className="lg:w-72 shrink-0">
                        <TabsList className="flex lg:flex-col h-auto bg-transparent p-0 gap-2 w-full overflow-x-auto lg:overflow-visible no-scrollbar pb-2 lg:pb-0">
                            {[
                                { id: 'general', icon: SettingsIcon, label: 'General Configuration', desc: 'Branding & Contact' },
                                { id: 'security', icon: Shield, label: 'Security & Access', desc: '2FA, Sessions' },
                                { id: 'network', icon: Globe, label: 'Network Status', desc: 'Server Nodes' },
                            ].map(tab => (
                                <TabsTrigger
                                    key={tab.id}
                                    value={tab.id}
                                    className="relative overflow-hidden group justify-between px-5 py-4 h-auto w-full data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 border border-transparent data-[state=active]:border-slate-100 dark:data-[state=active]:border-slate-800 data-[state=active]:shadow-sm rounded-2xl transition-all text-left"
                                >
                                    <div className="flex items-center gap-4 z-10">
                                        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 group-data-[state=active]:bg-primary-50 group-data-[state=active]:text-primary-600 transition-colors">
                                            <tab.icon size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-700 dark:text-slate-200 group-data-[state=active]:text-primary-900 dark:group-data-[state=active]:text-white">{tab.label}</p>
                                            <p className="text-[10px] font-medium text-slate-400 group-data-[state=active]:text-slate-500">{tab.desc}</p>
                                        </div>
                                    </div>
                                    {/* Active Indicator */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 scale-y-0 group-data-[state=active]:scale-y-100 transition-transform origin-center" />
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </motion.aside>

                    <main className="flex-1 min-w-0">
                        <TabsContent value="general" className="m-0 space-y-6">
                            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
                                <motion.div variants={fadeInUp}>
                                    <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-[2rem]">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <SettingsIcon className="text-primary-500" size={20} />
                                                Platform Settings
                                            </CardTitle>
                                            <CardDescription>Configure basic platform details</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label>Platform Name</Label>
                                                    <div className="relative">
                                                        <Globe className="absolute left-3 top-3 text-slate-400" size={16} />
                                                        <Input
                                                            value={formData.platformName}
                                                            onChange={(e) => handleChange('platformName', e.target.value)}
                                                            className="pl-10 h-11"
                                                            placeholder="e.g. My SaaS CRM"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Support Email</Label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-3 text-slate-400" size={16} />
                                                        <Input
                                                            value={formData.supportEmail}
                                                            onChange={(e) => handleChange('supportEmail', e.target.value)}
                                                            className="pl-10 h-11"
                                                            placeholder="support@example.com"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <AlertTriangle size={16} className="text-amber-600" />
                                                        <Label className="text-amber-900 dark:text-amber-500 font-bold">Maintenance Mode</Label>
                                                    </div>
                                                    <p className="text-xs text-amber-700/80 dark:text-amber-500/70">
                                                        Prevent users from logging in during scheduled maintenance.
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={formData.maintenanceMode}
                                                    onCheckedChange={(checked) => handleChange('maintenanceMode', checked)}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="security" className="m-0 space-y-6">
                            <motion.div variants={fadeInUp} initial="initial" animate="animate">
                                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-[2rem]">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Shield className="text-emerald-500" size={20} />
                                            Security Policies
                                        </CardTitle>
                                        <CardDescription>Enforce security across the organization</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex items-center justify-between p-1">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Lock size={16} className="text-slate-500" />
                                                    <Label className="font-bold">Enforce Two-Factor Authentication (2FA)</Label>
                                                </div>
                                                <p className="text-xs text-slate-500">Require all admins to set up 2FA.</p>
                                            </div>
                                            <Switch
                                                checked={formData.force2FA}
                                                onCheckedChange={(checked) => handleChange('force2FA', checked)}
                                            />
                                        </div>

                                        <Separator />

                                        <div className="space-y-4">
                                            <Label>Session Timeout (Hours)</Label>
                                            <div className="flex items-center gap-4">
                                                <Input
                                                    type="number"
                                                    value={formData.sessionTimeout}
                                                    onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
                                                    className="w-32 h-11"
                                                    min={1}
                                                    max={72}
                                                />
                                                <p className="text-xs text-slate-500">
                                                    Users will be automatically logged out after {formData.sessionTimeout} hours of inactivity.
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="network" className="m-0 space-y-6">
                            <motion.div variants={fadeInUp} initial="initial" animate="animate">
                                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-[2rem]">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Globe className="text-blue-500" size={20} />
                                            Server Nodes Status
                                        </CardTitle>
                                        <CardDescription>Real-time cluster health monitoring</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {[1, 2, 3].map(node => (
                                            <div
                                                key={node}
                                                className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                                                        <div className="absolute inset-0 rounded-full bg-emerald-500/50 animate-ping" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Cluster Node-{node}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">AWS-Mumbai</span>
                                                            <span className="text-[10px] text-slate-300">•</span>
                                                            <span className="text-[10px] font-bold text-slate-400">{Math.floor(Math.random() * 20) + 10}ms execution</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 dark:border-emerald-900/30 text-[9px] font-black tracking-widest px-2.5 py-1">
                                                        OPERATIONAL
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                    <CardFooter className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-b-[2rem]">
                                        <p className="text-xs text-slate-500 text-center w-full">System metrics updated just now</p>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        </TabsContent>
                    </main>
                </div>
            </Tabs>
        </motion.div>
    );
};

export default SuperAdminSettings;
