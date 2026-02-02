import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Calendar as CalendarIcon, CheckCircle, Clock, AlertCircle, TrendingUp, Users, ListTodo } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import useCRMStore from '@/store/crmStore';
import useAuthStore from '@/store/authStore';
import useTaskStore from '@/store/taskStore';
import { fadeInUp, staggerContainer } from '@/shared/utils/animations';
import { cn } from '@/shared/utils/cn';

const EmployeeDashboard = () => {
  const { user } = useAuthStore();
  const { tasks } = useTaskStore();
  const {
    leads,
    followUps,
  } = useCRMStore();

  const currentUserId = user?.id;

  // Filter data for current user
  const assignedLeads = useMemo(() => {
    if (!currentUserId) return [];
    return leads.filter(lead => lead.owner === currentUserId);
  }, [leads, currentUserId]);

  const todayFollowUps = useMemo(() => {
    if (!currentUserId) return [];
    const today = new Date();
    return followUps.filter(followUp => {
      // Find the lead to check ownership (if followUp doesn't have owner, assume lead owner)
      const lead = leads.find(l => l.id === followUp.leadId);
      const isOwner = lead?.owner === currentUserId; // simplified check

      const followUpDate = new Date(followUp.scheduledAt);
      return (
        isOwner &&
        followUpDate.toDateString() === today.toDateString() &&
        followUp.status !== 'Completed'
      );
    });
  }, [followUps, leads, currentUserId]);

  const pendingTasks = useMemo(() => {
    if (!currentUserId) return [];
    return tasks.filter(task =>
      task.status !== 'completed' &&
      (Array.isArray(task.assignedTo) ? task.assignedTo.includes(currentUserId) : task.assignedTo === currentUserId)
    );
  }, [tasks, currentUserId]);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-8 pb-10"
    >
      <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            My CRM Dashboard <TrendingUp className="text-primary-600" size={28} />
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Overview of your assigned leads and daily tasks
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div variants={fadeInUp}>
          <Card className="border-none shadow-lg shadow-indigo-500/10 bg-gradient-to-br from-white to-indigo-50/50 dark:from-slate-900 dark:to-slate-800/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Users size={100} />
            </div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Assigned Leads</CardTitle>
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                <Users size={20} />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-black text-slate-900 dark:text-white mb-1">{assignedLeads.length}</div>
              <p className="text-xs font-medium text-slate-500">Total active leads</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="border-none shadow-lg shadow-amber-500/10 bg-gradient-to-br from-white to-amber-50/50 dark:from-slate-900 dark:to-slate-800/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <CalendarIcon size={100} />
            </div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Today's Follow-ups</CardTitle>
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
                <CalendarIcon size={20} />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-black text-slate-900 dark:text-white mb-1">{todayFollowUps.length}</div>
              <p className="text-xs font-medium text-slate-500">Scheduled for today</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="border-none shadow-lg shadow-emerald-500/10 bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-900 dark:to-slate-800/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <ListTodo size={100} />
            </div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Pending Tasks</CardTitle>
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                <ListTodo size={20} />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-black text-slate-900 dark:text-white mb-1">{pendingTasks.length}</div>
              <p className="text-xs font-medium text-slate-500">Awaiting completion</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={fadeInUp}>
        <Tabs defaultValue="leads" className="w-full">
          <div className="flex items-center justify-between mb-4 overflow-x-auto no-scrollbar pb-2">
            <TabsList className="bg-transparent gap-2 h-auto p-0">
              <TabsTrigger
                value="leads"
                className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-slate-900 transition-all shadow-sm"
              >
                My Leads
              </TabsTrigger>
              <TabsTrigger
                value="followups"
                className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-bold data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=active]:border-amber-500 transition-all shadow-sm"
              >
                Today's Follow-ups
              </TabsTrigger>
              <TabsTrigger
                value="tasks"
                className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-bold data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:border-emerald-500 transition-all shadow-sm"
              >
                Pending Tasks
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="leads" className="mt-0">
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
              <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 px-6 py-4">
                <CardTitle className="text-lg font-bold">Assigned Leads List</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                        <TableHead className="whitespace-nowrap px-6 h-12 text-xs font-bold uppercase tracking-wider text-slate-500">Lead ID</TableHead>
                        <TableHead className="whitespace-nowrap h-12 text-xs font-bold uppercase tracking-wider text-slate-500">Name</TableHead>
                        <TableHead className="whitespace-nowrap h-12 text-xs font-bold uppercase tracking-wider text-slate-500">Company</TableHead>
                        <TableHead className="whitespace-nowrap h-12 text-xs font-bold uppercase tracking-wider text-slate-500">Status</TableHead>
                        <TableHead className="whitespace-nowrap h-12 text-xs font-bold uppercase tracking-wider text-slate-500">Source</TableHead>
                        <TableHead className="whitespace-nowrap h-12 text-xs font-bold uppercase tracking-wider text-slate-500">Created Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignedLeads.map((lead) => (
                        <TableRow key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 border-slate-100 dark:border-slate-800 transition-colors">
                          <TableCell className="font-bold px-6 py-4 whitespace-nowrap text-slate-700 dark:text-slate-300">{lead.id}</TableCell>
                          <TableCell className="whitespace-nowrap font-medium text-slate-900 dark:text-white">{lead.name}</TableCell>
                          <TableCell className="whitespace-nowrap text-slate-500">{lead.company}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Badge
                              className={cn(
                                "px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-none",
                                lead.status === 'Won' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                                  lead.status === 'Lost' ? 'bg-red-100 text-red-700 border-red-200' :
                                    lead.status === 'Interested' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                      'bg-slate-100 text-slate-700 border-slate-200'
                              )}
                            >
                              {lead.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-slate-500">{lead.source}</TableCell>
                          <TableCell className="whitespace-nowrap text-slate-500">{format(new Date(lead.createdAt), 'PPP')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {assignedLeads.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                    <Users size={48} className="opacity-20 mb-3" />
                    <p className="font-medium">No leads assigned to you yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="followups" className="mt-0">
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
              <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 px-6 py-4">
                <CardTitle className="text-lg font-bold">Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {todayFollowUps.length > 0 ? (
                    todayFollowUps.map((followUp) => {
                      const lead = leads.find(l => l.id === followUp.leadId);
                      return (
                        <div key={followUp.id} className="flex flex-col sm:flex-row gap-4 p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow group">
                          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                            <CalendarIcon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                              <div className="font-bold text-slate-900 dark:text-white truncate text-base">
                                {lead?.name} <span className="text-slate-400 font-normal text-sm">from {lead?.company}</span>
                              </div>
                              <Badge variant="secondary" className="w-fit bg-amber-100 text-amber-700 border-amber-200">{followUp.type}</Badge>
                            </div>
                            <div className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-3">
                              <Clock size={14} />
                              {format(new Date(followUp.scheduledAt), 'h:mm a')}
                              <span className="w-1 h-1 rounded-full bg-slate-300" />
                              <span className="truncate">{followUp.notes}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button size="sm" className="h-8 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs gap-1.5 shadow-sm shadow-emerald-500/20">
                                <CheckCircle size={14} /> Complete
                              </Button>
                              <Button size="sm" variant="outline" className="h-8 rounded-lg border-slate-200 font-bold text-xs gap-1.5 hover:bg-slate-50">
                                <AlertCircle size={14} /> Reschedule
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                      <CalendarIcon size={48} className="opacity-20 mb-3" />
                      <p className="font-medium">No follow-ups scheduled for today.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="mt-0">
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
              <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 px-6 py-4">
                <CardTitle className="text-lg font-bold">Pending CRM Tasks</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                        <TableHead className="whitespace-nowrap px-6 h-12 text-xs font-bold uppercase tracking-wider text-slate-500">Task ID</TableHead>
                        <TableHead className="whitespace-nowrap h-12 text-xs font-bold uppercase tracking-wider text-slate-500">Title</TableHead>
                        <TableHead className="whitespace-nowrap h-12 text-xs font-bold uppercase tracking-wider text-slate-500">Deadline</TableHead>
                        <TableHead className="whitespace-nowrap h-12 text-xs font-bold uppercase tracking-wider text-slate-500">Priority</TableHead>
                        <TableHead className="whitespace-nowrap h-12 text-xs font-bold uppercase tracking-wider text-slate-500">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingTasks.map((task) => (
                        <TableRow key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 border-slate-100 dark:border-slate-800 transition-colors">
                          <TableCell className="font-bold px-6 py-4 whitespace-nowrap text-slate-700 dark:text-slate-300">{task.id}</TableCell>
                          <TableCell className="whitespace-nowrap font-medium text-slate-900 dark:text-white">{task.title}</TableCell>
                          <TableCell className="whitespace-nowrap text-slate-500">{format(new Date(task.deadline), 'PPP HH:mm')}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Badge
                              className={cn(
                                "px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-none",
                                task.priority === 'High' ? 'bg-red-100 text-red-700 border-red-200' :
                                  task.priority === 'Medium' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                    'bg-blue-100 text-blue-700 border-blue-200'
                              )}
                            >
                              {task.priority}
                            </Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Badge variant="outline" className="text-slate-600 border-slate-300 px-2.5 py-0.5">{task.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {pendingTasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                    <ListTodo size={48} className="opacity-20 mb-3" />
                    <p className="font-medium">No pending tasks.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default EmployeeDashboard;