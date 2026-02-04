import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Target, Award, XCircle, Briefcase, Filter, MapPin } from 'lucide-react';
import useCRMStore from '@/store/crmStore';
import useScheduleStore from '@/store/scheduleStore';
import { fadeInUp, staggerContainer } from '@/shared/utils/animations';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { Badge } from '@/shared/components/ui/badge';

const AdminDashboard = () => {
  const { leads, getPipelineData } = useCRMStore();
  const { schedules } = useScheduleStore();

  const adminMeetings = (schedules || []).filter(s =>
    s.assignedTo?.toLowerCase().includes('admin')
  ).sort((a, b) => new Date(a.date) - new Date(b.date));

  // Sample data for charts
  const pipelineData = getPipelineData();
  const employeePerformance = [
    { name: 'John Doe', leads: 15, won: 8, lost: 2 },
    { name: 'Jane Smith', leads: 20, won: 12, lost: 3 },
    { name: 'Mike Johnson', leads: 10, won: 5, lost: 1 },
  ];

  const leadDistribution = pipelineData.map(stage => ({
    name: stage.stage,
    value: stage.leads.length,
  }));

  const totalLeads = leads.length;
  const activeDeals = leads.filter(lead =>
    ['Contacted', 'Follow-Up', 'Interested', 'Meeting Done', 'Proposal Sent'].includes(lead.status)
  ).length;
  const wonDeals = leads.filter(lead => lead.status === 'Won').length;
  const lostDeals = leads.filter(lead => lead.status === 'Lost').length;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

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
            Admin CRM Dashboard <TrendingUp className="text-primary-600" size={28} />
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Strategic overview of company sales performance
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Leads', value: totalLeads, icon: Users, color: 'blue', desc: '+15% from last month' },
          { title: 'Active Deals', value: activeDeals, icon: Briefcase, color: 'indigo', desc: '+8% from last month' },
          { title: 'Won Deals', value: wonDeals, icon: Award, color: 'emerald', desc: '+20% from last month' },
          { title: 'Lost Deals', value: lostDeals, icon: XCircle, color: 'red', desc: '-10% from last month' }
        ].map((item, index) => (
          <motion.div key={index} variants={fadeInUp}>
            <Card className={`border-none shadow-lg shadow-${item.color}-500/10 bg-gradient-to-br from-white to-${item.color}-50/50 dark:from-slate-900 dark:to-slate-800/50 relative overflow-hidden h-full`}>
              <div className={`absolute top-0 right-0 p-4 opacity-5 text-${item.color}-600 dark:text-${item.color}-400`}>
                <item.icon size={80} />
              </div>
              <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                <CardTitle className={`text-sm font-bold text-${item.color}-600 dark:text-${item.color}-400 uppercase tracking-wider`}>{item.title}</CardTitle>
                <div className={`p-2 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded-lg text-${item.color}-600 dark:text-${item.color}-400`}>
                  <item.icon size={18} />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{item.value}</div>
                <p className="text-xs font-medium text-slate-500">{item.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div variants={fadeInUp}>
        <Tabs defaultValue="pipeline" className="w-full">
          <div className="flex items-center justify-between mb-6 overflow-x-auto no-scrollbar pb-1">
            <TabsList className="bg-transparent gap-2 h-auto p-0">
              <TabsTrigger
                value="pipeline"
                className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-2.5 text-xs font-bold data-[state=active]:bg-primary-600 data-[state=active]:text-white data-[state=active]:border-primary-600 transition-all shadow-sm flex items-center gap-2"
              >
                <Target size={14} /> Sales Pipeline
              </TabsTrigger>
              <TabsTrigger
                value="employee"
                className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-2.5 text-xs font-bold data-[state=active]:bg-primary-600 data-[state=active]:text-white data-[state=active]:border-primary-600 transition-all shadow-sm flex items-center gap-2"
              >
                <Users size={14} /> Employee Performance
              </TabsTrigger>
              <TabsTrigger
                value="leads"
                className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-2.5 text-xs font-bold data-[state=active]:bg-primary-600 data-[state=active]:text-white data-[state=active]:border-primary-600 transition-all shadow-sm flex items-center gap-2"
              >
                <Filter size={14} /> Lead Sources
              </TabsTrigger>
              <TabsTrigger
                value="schedule"
                className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-2.5 text-xs font-bold data-[state=active]:bg-primary-600 data-[state=active]:text-white data-[state=active]:border-primary-600 transition-all shadow-sm flex items-center gap-2"
              >
                <CalendarIcon size={14} /> My Schedule
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="pipeline" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-none shadow-sm rounded-2xl bg-white dark:bg-slate-900 overflow-hidden">
                <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 px-6 py-4">
                  <CardTitle className="text-lg font-bold">Pipeline Overview</CardTitle>
                  <CardDescription>Deals distribution by stage</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={leadDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                        <Tooltip
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                          cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                        />
                        <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40}>
                          {leadDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm rounded-2xl bg-white dark:bg-slate-900 overflow-hidden">
                <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 px-6 py-4">
                  <CardTitle className="text-lg font-bold">Lead Status Distribution</CardTitle>
                  <CardDescription>Percentage breakdown</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-80 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={leadDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {leadDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 mt-4">
                    {leadDistribution.slice(0, 5).map((entry, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-xs font-medium text-slate-500">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="employee" className="mt-0">
            <Card className="border-none shadow-sm rounded-2xl bg-white dark:bg-slate-900 overflow-hidden">
              <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 px-6 py-4">
                <CardTitle className="text-lg font-bold">Employee Performance Matrix</CardTitle>
                <CardDescription>Comparative analysis of sales team</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                        <TableHead className="w-[200px] whitespace-nowrap px-6 h-12 text-xs font-bold uppercase tracking-wider text-slate-500">Employee</TableHead>
                        <TableHead className="text-center whitespace-nowrap h-12 text-xs font-bold uppercase tracking-wider text-slate-500">Total Leads</TableHead>
                        <TableHead className="text-center whitespace-nowrap h-12 text-xs font-bold uppercase tracking-wider text-slate-500">Won</TableHead>
                        <TableHead className="text-center whitespace-nowrap h-12 text-xs font-bold uppercase tracking-wider text-slate-500">Lost</TableHead>
                        <TableHead className="text-right whitespace-nowrap px-6 h-12 text-xs font-bold uppercase tracking-wider text-slate-500">Win Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employeePerformance.map((employee) => (
                        <TableRow key={employee.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 border-slate-100 dark:border-slate-800 transition-colors">
                          <TableCell className="font-bold px-6 py-4 whitespace-nowrap text-slate-700 dark:text-slate-300">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold">
                                {employee.name.charAt(0)}
                              </div>
                              {employee.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-medium">{employee.leads}</TableCell>
                          <TableCell className="text-center font-medium text-emerald-600">{employee.won}</TableCell>
                          <TableCell className="text-center font-medium text-red-500">{employee.lost}</TableCell>
                          <TableCell className="text-right px-6">
                            <span className={cn(
                              "px-2.5 py-1 rounded-full text-xs font-bold",
                              (employee.won / (employee.won + employee.lost)) > 0.7 ? "bg-emerald-100 text-emerald-700" :
                                (employee.won / (employee.won + employee.lost)) > 0.4 ? "bg-blue-100 text-blue-700" :
                                  "bg-orange-100 text-orange-700"
                            )}>
                              {((employee.won / (employee.won + employee.lost)) * 100).toFixed(0)}%
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leads" className="mt-0">
            <Card className="border-none shadow-sm rounded-2xl bg-white dark:bg-slate-900 overflow-hidden">
              <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 px-6 py-4">
                <CardTitle className="text-lg font-bold">Lead Sources</CardTitle>
                <CardDescription>Acquisition channel effectiveness</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { source: 'Website', count: 45 },
                      { source: 'Call', count: 30 },
                      { source: 'WhatsApp', count: 25 },
                      { source: 'Referral', count: 15 },
                      { source: 'Manual', count: 10 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="source" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
                      <Bar dataKey="count" fill="#8884d8" radius={[6, 6, 0, 0]} barSize={50}>
                        {
                          [0, 1, 2, 3, 4].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))
                        }
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="schedule" className="mt-0">
            <Card className="border-none shadow-sm rounded-2xl bg-white dark:bg-slate-900 overflow-hidden">
              <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold">Upcoming Meetings & Follow-ups</CardTitle>
                    <CardDescription>Scheduled events involving Admin</CardDescription>
                  </div>
                  <Badge className="bg-primary-600">{adminMeetings.length} Total</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {adminMeetings.length > 0 ? (
                    adminMeetings.map(meeting => (
                      <div key={meeting.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex flex-col items-center justify-center text-primary-600">
                            <span className="text-[10px] font-black uppercase">{format(new Date(meeting.date), 'MMM')}</span>
                            <span className="text-sm font-bold leading-none">{format(new Date(meeting.date), 'dd')}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">{meeting.title}</h4>
                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                              <span className="flex items-center gap-1"><Clock size={12} /> {meeting.time}</span>
                              <span className="flex items-center gap-1"><MapPin size={12} /> {meeting.location || 'Remote'}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="capitalize">{meeting.type}</Badge>
                      </div>
                    ))
                  ) : (
                    <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                      <CalendarIcon size={48} className="opacity-20 mb-3" />
                      <p className="font-bold">No upcoming schedule for Admin</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;