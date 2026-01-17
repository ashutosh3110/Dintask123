import React, { useState } from 'react';
import {
    Shield,
    Settings as SettingsIcon,
    Database,
    Server,
    Mail,
    Lock,
    Save,
    RefreshCw,
    Globe,
    Bell,
    Cpu,
    Check
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

const SuperAdminSettings = () => {
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setIsSaved(true);
            toast.success('System settings updated globally');
            setTimeout(() => setIsSaved(false), 2000);
        }, 1200);
    };

    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="space-y-6 pb-20"
        >
            <motion.div variants={fadeInUp}>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    System Configuration <Cpu className="text-primary-600" size={28} />
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    Global platform parameters and security management.
                </p>
            </motion.div>

            <Tabs defaultValue="general" className="w-full">
                <div className="flex flex-col lg:flex-row gap-8">
                    <motion.aside variants={fadeInUp} className="lg:w-64 space-y-2">
                        <TabsList className="flex lg:flex-col h-auto bg-transparent p-0 gap-1 w-full overflow-x-auto lg:overflow-visible no-scrollbar">
                            <TabsTrigger
                                value="general"
                                className="justify-start px-4 py-3 h-auto w-full data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm rounded-xl transition-all gap-3 font-bold"
                            >
                                <SettingsIcon size={18} />
                                <span>General</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="security"
                                className="justify-start px-4 py-3 h-auto w-full data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm rounded-xl transition-all gap-3 font-bold"
                            >
                                <Shield size={18} />
                                <span>Security</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="network"
                                className="justify-start px-4 py-3 h-auto w-full data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm rounded-xl transition-all gap-3 font-bold"
                            >
                                <Globe size={18} />
                                <span>Network</span>
                            </TabsTrigger>
                        </TabsList>
                    </motion.aside>

                    <main className="flex-1 max-w-2xl">
                        <TabsContent value="general" className="m-0 space-y-6">
                            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
                                <motion.div variants={fadeInUp}>
                                    <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
                                        <CardHeader className="p-4 md:p-8 pb-4">
                                            <CardTitle className="text-xl font-black text-slate-900 dark:text-white">Platform Branding</CardTitle>
                                            <CardDescription>Visual identification for all tenants</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6 p-4 md:p-8 pt-2">
                                            <div className="grid gap-2">
                                                <Label className="text-xs font-bold uppercase text-slate-500 tracking-wide">Platform Name</Label>
                                                <Input defaultValue="DinTask CRM" className="bg-slate-50 dark:bg-slate-800 border-none h-12 rounded-xl font-bold focus-visible:ring-primary-500" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label className="text-xs font-bold uppercase text-slate-500 tracking-wide">Support Email</Label>
                                                <Input defaultValue="support@dintask.com" type="email" className="bg-slate-50 dark:bg-slate-800 border-none h-12 rounded-xl font-bold focus-visible:ring-primary-500" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                <motion.div variants={fadeInUp}>
                                    <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
                                        <CardHeader className="p-4 md:p-8 pb-4">
                                            <CardTitle className="text-xl font-black text-slate-900 dark:text-white">System Maintenance</CardTitle>
                                            <CardDescription>Control global platform availability</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4 px-4 md:px-8 pt-2">
                                            <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
                                                <div className="space-y-1">
                                                    <Label className="text-amber-700 dark:text-amber-500 font-bold">Maintenance Mode</Label>
                                                    <p className="text-[10px] font-medium text-amber-600 dark:text-amber-500/70">Disables login for all non-super admins</p>
                                                </div>
                                                <Switch />
                                            </div>
                                        </CardContent>
                                        <CardFooter className="bg-slate-50/50 dark:bg-slate-800/30 px-4 md:px-8 py-6 flex justify-end">
                                            <motion.div {...scaleOnTap}>
                                                <Button
                                                    onClick={handleSave}
                                                    disabled={isSaving}
                                                    className={cn(
                                                        "gap-2 rounded-xl h-11 px-6 font-bold transition-all duration-300",
                                                        isSaved ? "bg-emerald-500 hover:bg-emerald-600 text-white" : ""
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
                                                    <span>{isSaving ? 'Saving...' : isSaved ? 'Saved Successfully' : 'Keep Changes'}</span>
                                                </Button>
                                            </motion.div>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="security" className="m-0 space-y-6">
                            <motion.div variants={fadeInUp} initial="initial" animate="animate">
                                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
                                    <CardHeader className="p-4 md:p-8 pb-4">
                                        <CardTitle className="text-xl font-black text-slate-900 dark:text-white">Global Security Policies</CardTitle>
                                        <CardDescription>Enforce strict security across all admin accounts</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2 p-4 md:p-8 pt-2">
                                        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">Force 2FA</p>
                                                <p className="text-[10px] font-medium text-slate-400">All admins must enable two-factor authentication</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <Separator className="bg-slate-50 dark:bg-slate-800" />
                                        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">Session Expiry</p>
                                                <p className="text-[10px] font-medium text-slate-400">Force logout after 24 hours of inactivity</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="bg-slate-50/50 dark:bg-slate-800/30 px-4 md:px-8 py-6 flex justify-end">
                                        <Button variant="outline" onClick={handleSave} className="gap-2 rounded-xl h-11 border-slate-200 font-bold">
                                            Apply Security Rules
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="network" className="m-0 space-y-6">
                            <motion.div variants={fadeInUp} initial="initial" animate="animate">
                                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
                                    <CardHeader className="p-4 md:p-8 pb-4">
                                        <CardTitle className="text-xl font-black text-slate-900 dark:text-white">Server Nodes</CardTitle>
                                        <CardDescription>Monitor platform cluster health</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 p-4 md:p-8 pt-2">
                                        {[1, 2].map(node => (
                                            <motion.div
                                                key={node}
                                                whileHover={{ scale: 1.02 }}
                                                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 transition-all"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900 dark:text-white">Cluster Node-0{node}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Region: AWS-Mumbai / Latency: {12 * node}ms</p>
                                                    </div>
                                                </div>
                                                <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-none text-[9px] font-black tracking-widest px-2.5 py-1 rounded-lg shadow-sm">ONLINE</Badge>
                                            </motion.div>
                                        ))}
                                    </CardContent>
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
