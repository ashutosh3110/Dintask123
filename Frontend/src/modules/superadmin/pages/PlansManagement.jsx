import React, { useState } from 'react';
import {
    CreditCard,
    Plus,
    Edit3,
    Trash2,
    Check,
    X,
    Users,
    Zap,
    TrendingUp,
    Settings2,
    MoreVertical,
    ShieldCheck
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
import { Badge } from '@/shared/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/shared/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';

import useSuperAdminStore from '@/store/superAdminStore';
import { cn } from '@/shared/utils/cn';
import { fadeInUp, staggerContainer, scaleOnTap } from '@/shared/utils/animations';

const PlansManagement = () => {
    const { plans, updatePlan, addPlan } = useSuperAdminStore();
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleCreatePlan = () => {
        const newPlan = {
            name: 'New Tier',
            price: 1999,
            limit: 10,
            isActive: false,
            trialDays: 0
        };
        addPlan(newPlan);
        toast.success('New plan tier created');
    };

    const handleEditClick = (plan) => {
        setSelectedPlan({ ...plan });
        setIsEditModalOpen(true);
    };

    const handleSavePlan = (e) => {
        e.preventDefault();
        updatePlan(selectedPlan.id, selectedPlan);
        toast.success('Subscription plan updated');
        setIsEditModalOpen(false);
    };

    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="space-y-6 pb-12"
        >
            <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">Subscription Plans</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
                        Define pricing tiers and team seat limitations.
                    </p>
                </div>

                <motion.div {...scaleOnTap}>
                    <Button onClick={handleCreatePlan} className="flex items-center gap-2 shadow-lg shadow-primary-200 dark:shadow-none bg-emerald-600 hover:bg-emerald-700 h-11 px-6 rounded-xl">
                        <Plus size={18} />
                        <span className="font-bold">Create New Tier</span>
                    </Button>
                </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnimatePresence mode='popLayout'>
                    {plans.map((plan) => (
                        <motion.div key={plan.id} variants={fadeInUp} layout>
                            <Card className={cn(
                                "h-full border-none shadow-md shadow-slate-200/50 dark:shadow-none hover:shadow-xl transition-shadow duration-300 rounded-[2rem] overflow-hidden flex flex-col group relative",
                                plan.isActive ? "bg-white dark:bg-slate-900" : "bg-slate-50 dark:bg-slate-800 opacity-75 grayscale-[0.5]"
                            )}>
                                <div className={cn(
                                    "absolute top-0 left-0 w-full h-1.5 transition-colors duration-300",
                                    plan.name === 'Business' ? "bg-purple-500" : plan.name === 'Pro Team' ? "bg-primary-500" : "bg-slate-300"
                                )} />
                                <CardHeader className="pb-2 pt-8 px-8">
                                    <div className="flex justify-between items-start mb-4">
                                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-slate-100 bg-slate-50 dark:bg-slate-800 text-slate-400 px-2 py-1 rounded-lg">
                                            ID: {plan.id}
                                        </Badge>
                                        <Switch checked={plan.isActive} onCheckedChange={(val) => updatePlan(plan.id, { isActive: !!val })} />
                                    </div>
                                    <CardTitle className="text-2xl font-black flex items-center gap-2">
                                        {plan.name}
                                        {plan.trialDays > 0 && (
                                            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none text-[8px] uppercase tracking-widest">
                                                {plan.trialDays} Day Free Trial
                                            </Badge>
                                        )}
                                    </CardTitle>
                                    <CardDescription className="text-4xl font-black text-slate-900 dark:text-white mt-2 tracking-tighter flex items-end gap-1">
                                        ₹{plan.price}
                                        <span className="text-xs font-bold text-slate-400 mb-1 tracking-normal uppercase">
                                            {plan.trialDays > 0 ? '/ Month after trial' : '/ Month'}
                                        </span>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 space-y-6 pt-4 px-8">
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm">
                                                <Users size={18} className="text-primary-500" />
                                            </div>
                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Team Limit</span>
                                        </div>
                                        <span className="text-sm font-black text-slate-900 dark:text-white">{plan.limit} Seats</span>
                                    </div>

                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-3 text-xs font-medium text-slate-500">
                                            <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">
                                                <Check size={10} strokeWidth={4} />
                                            </div>
                                            Full Access to Dashboard
                                        </li>
                                        <li className="flex items-center gap-3 text-xs font-medium text-slate-500">
                                            <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">
                                                <Check size={10} strokeWidth={4} />
                                            </div>
                                            Mobile Employee App
                                        </li>
                                    </ul>
                                </CardContent>
                                <CardFooter className="pt-4 pb-8 px-8">
                                    <motion.div className="w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button variant="outline" className="w-full h-12 rounded-xl font-bold gap-2 border-slate-200 hover:border-primary-200 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all" onClick={() => handleEditClick(plan)}>
                                            <Edit3 size={16} />
                                            Edit Configuration
                                        </Button>
                                    </motion.div>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Plans Table for Bulk View */}
            <motion.div variants={fadeInUp}>
                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden rounded-[2rem]">
                    <CardHeader className="px-8 pt-8">
                        <CardTitle className="text-lg font-bold">Comprehensive Plan List</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-slate-50 dark:border-slate-800">
                                        <TableHead className="pl-8 text-[10px] font-black uppercase tracking-widest text-slate-400 min-w-[120px]">Tier Name</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 min-w-[100px]">Monthly Fee</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 min-w-[100px]">User Cap</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 min-w-[100px]">Status</TableHead>
                                        <TableHead className="text-right pr-8 text-[10px] font-black uppercase tracking-widest text-slate-400 min-w-[120px]">Last Modified</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {plans.map((plan) => (
                                        <TableRow key={plan.id} className="border-slate-50 dark:border-slate-800 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                            <TableCell className="pl-8 font-black text-slate-900 dark:text-white text-sm">{plan.name}</TableCell>
                                            <TableCell className="text-sm font-bold text-primary-600">₹{plan.price}/mo</TableCell>
                                            <TableCell className="text-xs font-bold text-slate-500">{plan.limit} Employees</TableCell>
                                            <TableCell>
                                                <Badge className={cn("text-[8px] h-5 font-black tracking-widest px-2", plan.isActive ? "bg-emerald-500" : "bg-slate-400")}>
                                                    {plan.isActive ? 'VISIBLE' : 'HIDDEN'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-8 text-[10px] text-slate-400 font-bold uppercase tracking-widest">TODAY, 14:15</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[400px] rounded-[2rem] p-0 overflow-hidden border-none gap-0">
                    <div className="p-6 pb-0">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black">Edit Pricing Tier</DialogTitle>
                            <DialogDescription className="font-medium text-slate-500">
                                Adjust pricing and limitations for the <span className="text-slate-900 dark:text-white font-bold">{selectedPlan?.name}</span> plan.
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                    {selectedPlan && (
                        <form onSubmit={handleSavePlan} className="grid gap-6 p-6">
                            <div className="grid gap-2">
                                <Label htmlFor="plan-name" className="text-xs font-bold uppercase text-slate-500 tracking-wide">Plan Name</Label>
                                <Input
                                    id="plan-name"
                                    value={selectedPlan.name}
                                    onChange={(e) => setSelectedPlan({ ...selectedPlan, name: e.target.value })}
                                    className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl h-12 font-bold focus-visible:ring-primary-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold uppercase text-slate-500 tracking-wide">Monthly Price (₹)</Label>
                                    <Input
                                        type="number"
                                        value={selectedPlan.price}
                                        onChange={(e) => setSelectedPlan({ ...selectedPlan, price: parseInt(e.target.value) })}
                                        className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl h-12 font-bold focus-visible:ring-primary-500"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold uppercase text-slate-500 tracking-wide">Employee Limit</Label>
                                    <Input
                                        type="number"
                                        value={selectedPlan.limit}
                                        onChange={(e) => setSelectedPlan({ ...selectedPlan, limit: parseInt(e.target.value) })}
                                        className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl h-12 font-bold focus-visible:ring-primary-500"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs font-bold uppercase text-slate-500 tracking-wide">Trial Period (Days)</Label>
                                <Input
                                    type="number"
                                    value={selectedPlan.trialDays || 0}
                                    onChange={(e) => setSelectedPlan({ ...selectedPlan, trialDays: parseInt(e.target.value) })}
                                    className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl h-12 font-bold focus-visible:ring-primary-500"
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-bold">Active Status</Label>
                                    <p className="text-[10px] text-slate-400 font-medium">Available for new registrations</p>
                                </div>
                                <Switch
                                    checked={selectedPlan.isActive}
                                    onCheckedChange={(val) => setSelectedPlan({ ...selectedPlan, isActive: !!val })}
                                />
                            </div>
                            <DialogFooter className="mt-2">
                                <Button onClick={handleSavePlan} className="w-full h-12 rounded-xl font-black text-sm shadow-lg shadow-primary-200/50 dark:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-transform">Update Plan Details</Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </motion.div>
    );
};

export default PlansManagement;
