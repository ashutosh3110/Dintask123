import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, Globe, Zap as ZapIcon, Layout, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Switch } from "@/shared/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { fadeInUp } from '@/shared/utils/animations';

const Preferences = () => {
    const navigate = useNavigate();
    const [settings, setSettings] = useState({
        darkMode: document.documentElement.classList.contains('dark'),
        hapticFeedback: true,
        reducedMotion: false,
        autoSync: true,
        language: 'en'
    });

    const toggleDarkMode = () => {
        const isDark = !settings.darkMode;
        setSettings({ ...settings, darkMode: isDark });
        document.documentElement.classList.toggle('dark');
        toast.info(`${isDark ? 'Dark' : 'Light'} mode enabled`);
    };

    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
        toast.success('Preference updated');
    };

    const handleLanguageChange = (value) => {
        setSettings(prev => ({ ...prev, language: value }));
        toast.success(`Language changed to ${value === 'en' ? 'English' : value === 'es' ? 'Spanish' : value === 'fr' ? 'French' : 'German'}`);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen pb-32">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
                <div className="flex items-center p-4 justify-between max-w-[480px] mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="text-lg font-bold">Workspace</h2>
                    <div className="w-10"></div>
                </div>
            </div>

            <div className="max-w-[480px] mx-auto px-6 pt-4 space-y-8">
                {/* Appearance */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Appearance</h3>
                    <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
                        <CardContent className="p-0 divide-y divide-slate-50 dark:divide-slate-800">
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800">
                                        {settings.darkMode ? <Moon size={18} className="text-blue-500" /> : <Sun size={18} className="text-amber-500" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Dark Mode</p>
                                        <p className="text-[10px] text-slate-400 font-medium">Toggle dark interface</p>
                                    </div>
                                </div>
                                <Switch checked={settings.darkMode} onCheckedChange={toggleDarkMode} />
                            </div>
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800">
                                        <Layout size={18} className="text-purple-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Compact Mode</p>
                                        <p className="text-[10px] text-slate-400 font-medium">Show more content at once</p>
                                    </div>
                                </div>
                                <Switch checked={settings.reducedMotion} onCheckedChange={() => toggleSetting('reducedMotion')} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* System */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">System</h3>
                    <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
                        <CardContent className="p-0 divide-y divide-slate-50 dark:divide-slate-800">
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800">
                                        <Monitor size={18} className="text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Auto Sync</p>
                                        <p className="text-[10px] text-slate-400 font-medium">Always keep data up to date</p>
                                    </div>
                                </div>
                                <Switch checked={settings.autoSync} onCheckedChange={() => toggleSetting('autoSync')} />
                            </div>
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800">
                                        <Globe size={18} className="text-indigo-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Language</p>
                                        <p className="text-[10px] text-slate-400 font-medium">Select preferred language</p>
                                    </div>
                                </div>
                                <Select value={settings.language} onValueChange={handleLanguageChange}>
                                    <SelectTrigger className="w-[140px] h-8 text-xs font-bold bg-slate-50 dark:bg-slate-800 border-none rounded-lg">
                                        <SelectValue placeholder="Language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English (US)</SelectItem>
                                        <SelectItem value="es">Español</SelectItem>
                                        <SelectItem value="fr">Français</SelectItem>
                                        <SelectItem value="de">Deutsch</SelectItem>
                                        <SelectItem value="hi">Hindi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Power */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                    <Card className="bg-gradient-to-br from-primary-600 to-indigo-700 border-none shadow-xl shadow-primary-500/20 rounded-3xl p-6 text-white relative overflow-hidden">
                        <ZapIcon className="absolute -top-4 -right-4 size-24 opacity-10 rotate-12" />
                        <div className="relative z-10">
                            <h3 className="text-lg font-black mb-2">Power User?</h3>
                            <p className="text-xs opacity-80 mb-4 leading-relaxed">Unlock advanced keyboard shortcuts and automation features in our desktop application.</p>
                            <Button className="bg-white text-primary font-black hover:bg-slate-50 transition-all rounded-xl h-10 text-xs">Explore Desktop</Button>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default Preferences;
