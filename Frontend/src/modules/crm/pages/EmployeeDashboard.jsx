import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Calendar as CalendarIcon, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import useCRMStore from '@/store/crmStore';

import useAuthStore from '@/store/authStore';
import useTaskStore from '@/store/taskStore';

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My CRM Dashboard</h1>
          <p className="text-muted-foreground">Overview of your assigned leads and tasks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Assigned Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedLeads.length}</div>
            <p className="text-xs text-muted-foreground">Total leads assigned to you</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Follow-ups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayFollowUps.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks.length}</div>
            <p className="text-xs text-muted-foreground">Tasks waiting for completion</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="leads" className="w-full">
        <TabsList>
          <TabsTrigger value="leads">My Leads</TabsTrigger>
          <TabsTrigger value="followups">Today's Follow-ups</TabsTrigger>
          <TabsTrigger value="tasks">Pending Tasks</TabsTrigger>
        </TabsList>
        <TabsContent value="leads" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Leads</CardTitle>
              <CardDescription>Leads assigned to you with their current status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lead ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Created Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignedLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.id}</TableCell>
                        <TableCell>{lead.name}</TableCell>
                        <TableCell>{lead.company}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              lead.status === 'Won' ? 'success' :
                                lead.status === 'Lost' ? 'destructive' :
                                  lead.status === 'Interested' ? 'warning' :
                                    'primary'
                            }
                          >
                            {lead.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{lead.source}</TableCell>
                        <TableCell>{format(new Date(lead.createdAt), 'PPP')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {assignedLeads.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No leads assigned to you yet.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="followups" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Follow-ups</CardTitle>
              <CardDescription>Your scheduled follow-ups for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayFollowUps.length > 0 ? (
                  todayFollowUps.map((followUp) => {
                    const lead = leads.find(l => l.id === followUp.leadId);
                    return (
                      <div key={followUp.id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className="flex-shrink-0 mt-1">
                          <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{lead?.name} ({lead?.company})</div>
                            <Badge variant="secondary">{followUp.type}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {format(new Date(followUp.scheduledAt), 'HH:mm')} · {followUp.notes}
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button variant="ghost" size="sm">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Complete
                            </Button>
                            <Button variant="ghost" size="sm">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              Reschedule
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No follow-ups scheduled for today.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tasks" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Tasks</CardTitle>
              <CardDescription>Your pending tasks related to CRM</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.id}</TableCell>
                        <TableCell>{task.title}</TableCell>
                        <TableCell>{format(new Date(task.deadline), 'PPP HH:mm')}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              task.priority === 'High' ? 'destructive' :
                                task.priority === 'Medium' ? 'warning' :
                                  'secondary'
                            }
                          >
                            {task.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="primary">{task.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {pendingTasks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No pending tasks.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeDashboard;