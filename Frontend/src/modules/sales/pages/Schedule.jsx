import React from 'react';
import {
    Calendar as CalendarIcon,
    Plus,
    Filter,
    Search,
    Clock,
    User,
    DollarSign,
    Bell
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Badge } from '@/shared/components/ui/badge';

const Schedule = () => {
    // Mock schedule data - in a real app, this would come from a store
    const scheduleItems = [
        {
            id: 'SCH001',
            title: 'Client Meeting - ABC Corp',
            type: 'meeting',
            time: '10:00 AM - 11:00 AM',
            date: '2026-01-29',
            location: 'Conference Room A',
            participants: ['John Sales', 'Client Rep'],
            status: 'upcoming'
        },
        {
            id: 'SCH002',
            title: 'Proposal Presentation - XYZ Ltd',
            type: 'presentation',
            time: '1:30 PM - 2:30 PM',
            date: '2026-01-29',
            location: 'Virtual (Zoom)',
            participants: ['John Sales', 'Client Team'],
            status: 'upcoming'
        },
        {
            id: 'SCH003',
            title: 'Follow-up Call - 123 Industries',
            type: 'call',
            time: '3:00 PM - 3:30 PM',
            date: '2026-01-29',
            location: 'Phone Call',
            participants: ['John Sales', 'Client Contact'],
            status: 'upcoming'
        },
        {
            id: 'SCH004',
            title: 'Sales Team Weekly Meeting',
            type: 'team',
            time: '9:00 AM - 10:00 AM',
            date: '2026-01-30',
            location: 'Conference Room B',
            participants: ['Sales Team', 'Manager'],
            status: 'upcoming'
        },
        {
            id: 'SCH005',
            title: 'Client Dinner - Global Tech',
            type: 'event',
            time: '7:00 PM - 9:00 PM',
            date: '2026-02-01',
            location: 'Fancy Restaurant',
            participants: ['John Sales', 'Client Executives'],
            status: 'upcoming'
        }
    ];

    const getTypeColor = (type) => {
        const colors = {
            'meeting': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            'presentation': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
            'call': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            'team': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
            'event': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
        };
        return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Schedule</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your sales meetings and events</p>
                </div>
                <Button className="gap-2">
                    <Plus size={16} />
                    Add Event
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="md:col-span-2 border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-bold">Calendar View</CardTitle>
                        <div className="flex items-center gap-2">
                            <Select>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="January" />
                                </SelectTrigger>
                                <SelectContent>
                                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
                                        <SelectItem key={month} value={month.toLowerCase()}>{month}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select>
                                <SelectTrigger className="w-[100px]">
                                    <SelectValue placeholder="2026" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2025">2025</SelectItem>
                                    <SelectItem value="2026">2026</SelectItem>
                                    <SelectItem value="2027">2027</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px] flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <div className="text-center">
                                <CalendarIcon className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                                <p className="text-slate-500 dark:text-slate-400">Interactive calendar component</p>
                                <p className="text-xs text-slate-400 mt-1">Displaying events for January 2026</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Today's Events</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {scheduleItems.filter(item => item.date === '2026-01-29').map((item) => (
                                <div key={item.id} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-medium text-slate-900 dark:text-white">{item.title}</h4>
                                        <Badge className={getTypeColor(item.type)}>
                                            {item.type}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                                        <Clock size={12} />
                                        <span>{item.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <User size={12} />
                                        <span>{item.participants.join(', ')}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-bold">Upcoming Events</CardTitle>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                            <Input placeholder="Search events..." className="pl-8 w-[200px]" />
                        </div>
                        <Button variant="outline" size="icon">
                            <Filter size={16} />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="all">
                        <TabsList className="mb-4">
                            <TabsTrigger value="all">All Events</TabsTrigger>
                            <TabsTrigger value="meetings">Meetings</TabsTrigger>
                            <TabsTrigger value="presentations">Presentations</TabsTrigger>
                            <TabsTrigger value="calls">Calls</TabsTrigger>
                        </TabsList>
                        <TabsContent value="all" className="space-y-3">
                            {scheduleItems.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1">
                                            <CalendarIcon size={20} className="text-primary-500" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="text-sm font-medium text-slate-900 dark:text-white">{item.title}</h4>
                                                <Badge className={getTypeColor(item.type)}>
                                                    {item.type}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <Clock size={12} />
                                                    <span>{item.date} • {item.time}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <User size={12} />
                                                    <span>{item.participants.join(', ')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm">View</Button>
                                </div>
                            ))}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default Schedule;