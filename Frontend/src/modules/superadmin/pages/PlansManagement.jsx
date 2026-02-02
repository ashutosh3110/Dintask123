import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Trash2,
    Edit2,
    Check,
    X,
    CreditCard,
    Zap,
    Users,
    ShieldCheck,
    Search,
    IndianRupee,
    Briefcase
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Badge } from '@/shared/components/ui/badge';
import { toast } from 'sonner';
import useSuperAdminStore from '@/store/superAdminStore';
import { cn } from '@/shared/utils/cn';

const PlansManagement = () => {
    const { plans, addPlan, deletePlan, updatePlan } = useSuperAdminStore();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newPlan, setNewPlan] = useState({
        name: '',
        price: '',
        limit: '',
        isActive: true,
        trialDays: 0
    });

    const filteredPlans = plans.filter(plan =>
        plan.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddPlan = (e) => {
        e.preventDefault();
        if (!newPlan.name || !newPlan.price || !newPlan.limit) {
            toast.error("Please fill in all required fields");
            return;
        }

        addPlan({
            ...newPlan,
            price: Number(newPlan.price),
            limit: Number(newPlan.limit),
            trialDays: Number(newPlan.trialDays)
        });

        toast.success("Plan added successfully!");
        setIsAddModalOpen(false);
        setNewPlan({
            name: '',
            price: '',
            limit: '',
            isActive: true,
            trialDays: 0
        });
    };

    const handleDeletePlan = (id, name) => {
        if (window.confirm(`Are you sure you want to delete the ${name} plan?`)) {
            deletePlan(id);
            toast.success(`${name} plan deleted successfully`);
        }
    };

    const togglePlanStatus = (id, currentStatus) => {
        updatePlan(id, { isActive: !currentStatus });
        toast.success(`Plan ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                        Subscription Plans <CreditCard className="text-primary-600" size={28} />
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Manage and scale your platform's subscription tiers.
                    </p>
                </div>
                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-primary-600 hover:bg-primary-700 h-12 px-6 rounded-2xl font-bold shadow-lg shadow-primary-500/20 gap-2"
                >
                    <Plus size={20} /> Create New Plan
                </Button>
            </div>

            {/* Toolbar */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <Input
                        placeholder="Search plans by name..."
                        className="h-12 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus-visible:ring-primary-500/30"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Badge className="bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 px-4 py-1.5 rounded-full border-none h-auto">
                        {plans.length} Total Plans
                    </Badge>
                </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {filteredPlans.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2, delay: index * 0.1 }}
                        >
                            <Card className={cn(
                                "overflow-hidden border-2 transition-all duration-300 rounded-[2.5rem]",
                                plan.isActive
                                    ? "border-slate-200 dark:border-slate-800 hover:border-primary-500/50"
                                    : "border-slate-100 dark:border-slate-900 opacity-70 grayscale"
                            )}>
                                <CardHeader className="p-8 pb-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800 text-primary-600 shadow-inner">
                                            {plan.name === 'Enterprise' ? <ShieldCheck size={32} /> : plan.limit > 10 ? <Zap size={32} /> : <Briefcase size={32} />}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => togglePlanStatus(plan.id, plan.isActive)}
                                                className={cn(
                                                    "w-10 h-10 rounded-full transition-colors",
                                                    plan.isActive ? "text-emerald-500 hover:bg-emerald-50" : "text-amber-500 hover:bg-amber-50"
                                                )}
                                                title={plan.isActive ? "Deactivate" : "Activate"}
                                            >
                                                {plan.isActive ? <Check size={20} /> : <X size={20} />}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeletePlan(plan.id, plan.name)}
                                                className="w-10 h-10 rounded-full text-red-500 hover:bg-red-50"
                                                title="Delete Plan"
                                            >
                                                <Trash2 size={20} />
                                            </Button>
                                        </div>
                                    </div>
                                    <CardTitle className="text-2xl font-black text-slate-900 dark:text-white">{plan.name}</CardTitle>
                                    <CardDescription className="text-slate-500 dark:text-slate-400 font-medium">Standard License Package</CardDescription>
                                </CardHeader>
                                <CardContent className="p-8 pt-4 space-y-8">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black text-slate-900 dark:text-white">₹{plan.price.toLocaleString('en-IN')}</span>
                                        <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">/ month</span>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
                                            <Users size={18} className="text-primary-500" />
                                            Up to {plan.limit} Team Members
                                        </div>
                                        <div className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
                                            <ShieldCheck size={18} className="text-primary-500" />
                                            {plan.trialDays > 0 ? `${plan.trialDays} Day Free Trial` : 'Full Access'}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
                                            <Zap size={18} className="text-emerald-500" />
                                            Unlimited CRM Access
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="w-full h-12 rounded-2xl border-slate-200 dark:border-slate-800 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                                    >
                                        Edit Bundle Details
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Add Plan Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Create New Plan</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Define price and limitations.</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setIsAddModalOpen(false)} className="rounded-full">
                                    <X size={20} />
                                </Button>
                            </div>

                            <form onSubmit={handleAddPlan} className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="font-bold">Plan Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Starter, Pro, Enterprise"
                                        className="h-12 rounded-2xl"
                                        value={newPlan.name}
                                        onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="price" className="font-bold">Monthly Price (₹)</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            placeholder="999"
                                            className="h-12 rounded-2xl"
                                            value={newPlan.price}
                                            onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="limit" className="font-bold">Member Limit</Label>
                                        <Input
                                            id="limit"
                                            type="number"
                                            placeholder="5"
                                            className="h-12 rounded-2xl"
                                            value={newPlan.limit}
                                            onChange={(e) => setNewPlan({ ...newPlan, limit: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="trial" className="font-bold">Trial Days</Label>
                                    <Input
                                        id="trial"
                                        type="number"
                                        placeholder="7"
                                        className="h-12 rounded-2xl"
                                        value={newPlan.trialDays}
                                        onChange={(e) => setNewPlan({ ...newPlan, trialDays: e.target.value })}
                                    />
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="flex-1 h-12 rounded-2xl text-slate-500 font-bold"
                                        onClick={() => setIsAddModalOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 h-12 rounded-2xl bg-primary-600 hover:bg-primary-700 font-bold shadow-lg shadow-primary-500/20"
                                    >
                                        Create Plan
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PlansManagement;
