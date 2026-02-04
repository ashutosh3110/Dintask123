import React, { useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import {
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/shared/components/ui/dialog';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/utils/cn';
import { fadeInUp, staggerContainer, scaleOnTap } from '@/shared/utils/animations';

const EmployeeCalendar = () => {
    const calendarRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [view, setView] = useState('dayGridMonth');
    const [currentDate, setCurrentDate] = useState(new Date());

    const events = [
        {
            id: '1',
            title: 'Weekly Sync Meeting',
            start: new Date().toISOString().split('T')[0] + 'T10:00:00',
            end: new Date().toISOString().split('T')[0] + 'T11:00:00',
            color: '#3b82f6',
            extendedProps: { type: 'meeting', location: 'Zoom', description: 'Discussing project progress and blockers.', dotColor: 'bg-blue-500' }
        },
        {
            id: '2',
            title: 'Frontend Review',
            start: new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T14:30:00',
            color: '#10b981',
            extendedProps: { type: 'review', location: 'Office Room 4', description: 'Reviewing the new dashboard designs.', dotColor: 'bg-emerald-500' }
        },
        {
            id: '3',
            title: 'Design Workshop',
            start: new Date(Date.now() + 172800000).toISOString().split('T')[0] + 'T11:00:00',
            color: '#8b5cf6',
            extendedProps: { type: 'workshop', location: 'Meeting Room B', description: 'Internal design feedback session.', dotColor: 'bg-purple-500' }
        }
    ];

    const handleEventClick = (info) => {
        setSelectedEvent(info.event);
        setIsModalOpen(true);
    };

    const handleNext = () => {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.next();
        setCurrentDate(calendarApi.getDate());
    };

    const handlePrev = () => {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.prev();
        setCurrentDate(calendarApi.getDate());
    };

    const handleViewChange = (newView) => {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.changeView(newView);
        setView(newView);
    };

    const handleToday = () => {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.today();
        setCurrentDate(calendarApi.getDate());
    };

    const groupedEvents = events.reduce((acc, event) => {
        const date = new Date(event.start);
        const dayName = format(date, 'EEEE').toUpperCase();
        if (!acc[dayName]) acc[dayName] = [];
        acc[dayName].push(event);
        return acc;
    }, {});

    const sortedDays = Object.keys(groupedEvents).sort((a, b) => {
        const daysOrder = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        return daysOrder.indexOf(a) - daysOrder.indexOf(b);
    });

    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="space-y-8 pb-32 lg:pb-12"
        >
            {/* Header Area */}
            <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Schedule</h2>
                    <p className="text-sm text-slate-500 font-medium">Manage your time and team meetings</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn("h-8 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", view === 'dayGridMonth' ? "bg-white dark:bg-slate-700 shadow-sm text-primary-600 dark:text-white" : "text-slate-500")}
                            onClick={() => handleViewChange('dayGridMonth')}
                        >
                            Month
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn("h-8 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", view === 'listWeek' ? "bg-white dark:bg-slate-700 shadow-sm text-primary-600 dark:text-white" : "text-slate-500")}
                            onClick={() => handleViewChange('listWeek')}
                        >
                            List
                        </Button>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Main Calendar View */}
                <motion.div variants={fadeInUp} className="lg:col-span-8">
                    <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20">
                            <div className="flex items-center gap-4">
                                <h3 className="text-lg font-black text-slate-900 dark:text-white capitalize">
                                    {format(currentDate, view === 'listWeek' ? 'MMM dd, yyyy' : 'MMMM yyyy')}
                                </h3>
                                <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-100 dark:border-slate-700 shadow-sm">
                                    <button onClick={handlePrev} className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition-all">
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button onClick={handleToday} className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary-600 transition-colors">
                                        TODAY
                                    </button>
                                    <button onClick={handleNext} className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition-all">
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <CardContent className="p-0">
                            <div className="employee-calendar-wrapper">
                                <FullCalendar
                                    ref={calendarRef}
                                    plugins={[dayGridPlugin, listPlugin, interactionPlugin]}
                                    initialView="dayGridMonth"
                                    headerToolbar={false}
                                    events={events}
                                    height="auto"
                                    aspectRatio={1.5}
                                    eventClick={handleEventClick}
                                    dayMaxEvents={2}
                                    eventContent={(eventInfo) => (
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg overflow-hidden cursor-pointer transition-transform active:scale-95">
                                            <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", eventInfo.event.extendedProps.dotColor || "bg-primary-500")} />
                                            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 truncate">
                                                {eventInfo.event.title}
                                            </span>
                                        </div>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Sidebar Schedule */}
                <motion.div variants={fadeInUp} className="lg:col-span-4 space-y-6">
                    <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">Quick Glance</h3>
                    <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800">
                        <CardContent className="p-6 space-y-8">
                            {sortedDays.map(day => (
                                <div key={day} className="space-y-4">
                                    <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                                        {day}
                                    </h4>
                                    <div className="space-y-3">
                                        {groupedEvents[day].map(event => {
                                            const start = new Date(event.start);
                                            const end = event.end ? new Date(event.end) : null;
                                            const timeRange = end
                                                ? `${format(start, 'h:mma').toLowerCase()} - ${format(end, 'h:mma').toLowerCase()}`
                                                : format(start, 'h:mma').toLowerCase();

                                            return (
                                                <div
                                                    key={event.id}
                                                    className="flex items-center bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl p-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer group"
                                                    onClick={() => { setSelectedEvent({ title: event.title, start: new Date(event.start), extendedProps: event.extendedProps }); setIsModalOpen(true); }}
                                                >
                                                    <div className="w-[110px] shrink-0">
                                                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                                            {timeRange}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <div className={cn("w-2 h-2 rounded-full", event.extendedProps.dotColor || "bg-primary-500")} />
                                                        <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate">
                                                            {event.title}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                            {events.length === 0 && (
                                <div className="text-center py-8">
                                    <CalendarIcon className="size-12 mx-auto text-slate-200 mb-2" />
                                    <p className="text-xs text-slate-400 font-medium">No events scheduled</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Event Details Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[440px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
                    <div className="bg-primary/5 p-8 pb-4">
                        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-primary-600 mb-6 font-bold">
                            <CalendarIcon size={28} />
                        </div>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black tracking-tight">{selectedEvent?.title}</DialogTitle>
                            <DialogDescription className="text-[10px] font-black text-primary/60 uppercase tracking-widest mt-1">
                                {selectedEvent?.extendedProps?.type || 'Scheduled Event'}
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="p-8 pt-6 space-y-6">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-1.5">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Slot</p>
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                                    <Clock size={14} className="text-primary-500" />
                                    {selectedEvent ? format(new Date(selectedEvent.start), 'p') : ''}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Date</p>
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                                    <CalendarIcon size={14} className="text-primary-500" />
                                    {selectedEvent ? format(new Date(selectedEvent.start), 'MMM dd, yyyy') : ''}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Venue / Location</p>
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                                <MapPin size={14} className="text-red-500" />
                                {selectedEvent?.extendedProps?.location || 'Not specified'}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">More Details</p>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                    {selectedEvent?.extendedProps?.description || 'No additional notes provided.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 pt-0">
                        <Button onClick={() => setIsModalOpen(false)} className="w-full rounded-2xl h-14 font-black transition-all active:scale-[0.98]">
                            Close Details
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <style>{`
                .employee-calendar-wrapper .fc {
                    --fc-border-color: transparent;
                    --fc-daygrid-dot-event-bg-color: transparent;
                }
                .employee-calendar-wrapper td, .employee-calendar-wrapper th {
                    border: 1px solid rgba(0,0,0,0.02) !important;
                }
                .dark .employee-calendar-wrapper td, .dark .employee-calendar-wrapper th {
                    border: 1px solid rgba(255,255,255,0.02) !important;
                }
                .employee-calendar-wrapper .fc-col-header-cell {
                    padding: 12px 0;
                    text-transform: uppercase;
                    font-size: 10px;
                    font-weight: 900;
                    letter-spacing: 0.1em;
                    color: #94a3b8;
                }
                .employee-calendar-wrapper .fc-daygrid-day-number {
                    font-size: 12px;
                    font-weight: 700;
                    padding: 8px !important;
                    color: #64748b;
                }
                .employee-calendar-wrapper .fc-day-today {
                    background: rgba(59, 130, 246, 0.04) !important;
                }
                .employee-calendar-wrapper .fc-event {
                    background: transparent !important;
                }
            `}</style>
        </motion.div>
    );
};

export default EmployeeCalendar;
