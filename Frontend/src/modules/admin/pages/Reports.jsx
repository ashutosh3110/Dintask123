import React, { useState, useMemo } from 'react';
import {
    FileText,
    Download,
    Search,
    Calendar as CalendarIcon,
    Filter,
    ChevronDown,
    ArrowUpRight,
    Printer,
    Share2,
    CheckCircle2,
    TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';

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
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/shared/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";

import useTaskStore from '@/store/taskStore';
import useEmployeeStore from '@/store/employeeStore';
import { cn } from '@/shared/utils/cn';

const Reports = () => {
    const { tasks } = useTaskStore();
    const { employees } = useEmployeeStore();

    const [dateRange, setDateRange] = useState('7'); // days
    const [selectedEmployee, setSelectedEmployee] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = useMemo(() => {
        return tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesEmployee = selectedEmployee === 'all' || task.assignedTo.includes(selectedEmployee);
            const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;

            // Date filter mock (just filtering latest tasks based on dateRange)
            const now = new Date();
            const taskDate = new Date(task.createdAt);
            const diffDays = Math.ceil((now - taskDate) / (1000 * 60 * 60 * 24));
            const matchesDate = diffDays <= parseInt(dateRange);

            return matchesSearch && matchesEmployee && matchesStatus && matchesDate;
        });
    }, [tasks, searchTerm, selectedEmployee, selectedStatus, dateRange]);

    const reportStats = useMemo(() => {
        return {
            total: filteredData.length,
            completed: filteredData.filter(t => t.status === 'completed').length,
            completionRate: filteredData.length > 0
                ? Math.round((filteredData.filter(t => t.status === 'completed').length / filteredData.length) * 100)
                : 0
        };
    }, [filteredData]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Reports & Analytics</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Generate and export task performance reports.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" className="flex items-center gap-2 border-slate-200 dark:border-slate-800">
                        <Printer size={16} />
                        <span className="hidden sm:inline">Print</span>
                    </Button>
                    <Button className="flex items-center gap-2 shadow-lg shadow-primary-200 dark:shadow-none bg-emerald-600 hover:bg-emerald-700">
                        <Download size={16} />
                        <span>Export CSV</span>
                    </Button>
                </div>
            </div>

            {/* Filters Bar */}
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold ml-1">Period</Label>
                            <Select value={dateRange} onValueChange={setDateRange}>
                                <SelectTrigger className="h-10 bg-slate-50 border-none dark:bg-slate-800">
                                    <SelectValue placeholder="Select Period" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="7">Last 7 Days</SelectItem>
                                    <SelectItem value="30">Last 30 Days</SelectItem>
                                    <SelectItem value="90">Last Quarter</SelectItem>
                                    <SelectItem value="365">This Year</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold ml-1">Employee</Label>
                            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                                <SelectTrigger className="h-10 bg-slate-50 border-none dark:bg-slate-800">
                                    <SelectValue placeholder="All Members" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Members</SelectItem>
                                    {employees.map(emp => (
                                        <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold ml-1">Status</Label>
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger className="h-10 bg-slate-50 border-none dark:bg-slate-800">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold ml-1">Search</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Task name..."
                                    className="pl-9 h-10 bg-slate-50 border-none dark:bg-slate-800"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <FileText size={48} className="text-slate-900 dark:text-white" />
                    </div>
                    <CardContent className="p-6">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Generated</p>
                        <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-3xl font-bold text-slate-900 dark:text-white">{reportStats.total}</span>
                            <span className="text-xs text-slate-500">Tasks</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <CheckCircle2 size={48} className="text-emerald-500" />
                    </div>
                    <CardContent className="p-6">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Completed</p>
                        <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-3xl font-bold text-emerald-600">{reportStats.completed}</span>
                            <span className="text-xs text-slate-500">Tasks</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <TrendingUp size={48} className="text-primary-500" />
                    </div>
                    <CardContent className="p-6">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Completion Rate</p>
                        <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-3xl font-bold text-primary-600">{reportStats.completionRate}%</span>
                            <span className="text-primary-500 p-0.5 rounded bg-primary-50 dark:bg-primary-900/10">
                                <ArrowUpRight size={14} />
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Table */}
            <Card className="border-none shadow-md shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900">
                <CardHeader>
                    <CardTitle className="text-lg font-bold">Report Details</CardTitle>
                    <CardDescription>Line items based on selected filters</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                                    <TableHead className="pl-6 min-w-[200px]">Task Name</TableHead>
                                    <TableHead className="min-w-[120px]">Assigned To</TableHead>
                                    <TableHead className="min-w-[120px]">Created Date</TableHead>
                                    <TableHead className="min-w-[100px]">Status</TableHead>
                                    <TableHead className="text-right pr-6 min-w-[80px]">Efficiency</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-slate-400">
                                            No data available for the selected period.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredData.map((data) => (
                                        <TableRow key={data.id} className="border-slate-50 dark:border-slate-800">
                                            <TableCell className="pl-6 font-medium text-slate-900 dark:text-white">
                                                {data.title}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex -space-x-1">
                                                    {data.assignedTo.map(id => {
                                                        const emp = employees.find(e => e.id === id);
                                                        return (
                                                            <Avatar key={id} className="h-6 w-6 border-2 border-white dark:border-slate-900">
                                                                <AvatarImage src={emp?.avatar} />
                                                                <AvatarFallback className="text-[8px]">{emp?.name.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                        );
                                                    })}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-xs text-slate-500">
                                                {format(new Date(data.createdAt), 'MMM dd, yyyy')}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={data.status === 'completed' ? 'default' : 'secondary'} className={cn(
                                                    "text-[10px] h-5",
                                                    data.status === 'completed' ? "bg-emerald-500" : ""
                                                )}>
                                                    {data.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <span className={cn(
                                                    "text-xs font-bold",
                                                    data.priority === 'urgent' ? "text-red-500" : "text-slate-900 dark:text-slate-300"
                                                )}>
                                                    {data.status === 'completed' ? '100%' : '25%'}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Reports;
