import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Badge } from '@/shared/components/ui/badge';
import { Label } from '@/shared/components/ui/label';
import { Calendar } from '@/shared/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Textarea } from '@/shared/components/ui/textarea';
import { Plus, Calendar as CalendarIcon, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import useCRMStore from '@/store/crmStore';

const FollowUps = () => {
  const {
    leads,
    followUps,
    addFollowUp,
    updateFollowUp,
    deleteFollowUp,
  } = useCRMStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [open, setOpen] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [time, setTime] = useState('12:00');
  const [formData, setFormData] = useState({
    leadId: '',
    type: 'Call',
    notes: '',
    status: 'Scheduled',
  });

  const followUpTypes = ['Call', 'Meeting', 'Email', 'WhatsApp'];
  const followUpStatuses = ['Scheduled', 'Completed', 'Missed', 'Cancelled'];

  const filteredFollowUps = useMemo(() => {
    return followUps.filter((followUp) => {
      const lead = leads.find(l => l.id === followUp.leadId);
      const matchesSearch = 
        lead?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead?.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || followUp.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [followUps, leads, searchTerm, filterStatus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const scheduledAt = new Date(selectedDate);
    const [hours, minutes] = time.split(':').map(Number);
    scheduledAt.setHours(hours, minutes, 0, 0);

    const followUpData = {
      ...formData,
      scheduledAt: scheduledAt.toISOString(),
    };

    if (editingFollowUp) {
      updateFollowUp(editingFollowUp.id, followUpData);
    } else {
      addFollowUp(followUpData);
      // Auto-create task in task management system
      console.log('Auto-creating task for follow-up:', followUpData);
    }
    resetForm();
    setOpen(false);
  };

  const handleEdit = (followUp) => {
    setEditingFollowUp(followUp);
    setFormData(followUp);
    setSelectedDate(new Date(followUp.scheduledAt));
    setTime(format(new Date(followUp.scheduledAt), 'HH:mm'));
    setOpen(true);
  };

  const handleDelete = (followUpId) => {
    if (confirm('Are you sure you want to delete this follow-up?')) {
      deleteFollowUp(followUpId);
    }
  };

  const handleStatusChange = (followUpId, status) => {
    updateFollowUp(followUpId, { status });
    // Update task status in task management system
    console.log('Updating task status:', status);
  };

  const resetForm = () => {
    setEditingFollowUp(null);
    setFormData({
      leadId: '',
      type: 'Call',
      notes: '',
      status: 'Scheduled',
    });
    setSelectedDate(new Date());
    setTime('12:00');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Follow-ups & Reminders</h1>
          <p className="text-muted-foreground">Schedule and manage your follow-ups</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Follow-up
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingFollowUp ? 'Edit Follow-up' : 'Schedule New Follow-up'}</DialogTitle>
              <DialogDescription>
                {editingFollowUp ? 'Update the follow-up information below.' : 'Enter the follow-up details below.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="leadId">Lead</Label>
                <Select
                  value={formData.leadId}
                  onValueChange={(value) => setFormData({ ...formData, leadId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select lead" />
                  </SelectTrigger>
                  <SelectContent>
                    {leads.map((lead) => (
                      <SelectItem key={lead.id} value={lead.id}>
                        {lead.name} ({lead.company})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {followUpTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date & Time</Label>
                <div className="flex gap-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[200px] justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(selectedDate, 'PPP')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <div className="relative flex-1">
                    <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="time"
                      className="pl-8"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add any additional notes"
                />
              </div>
              {editingFollowUp && (
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {followUpStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingFollowUp ? 'Update Follow-up' : 'Schedule Follow-up'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Follow-ups List</CardTitle>
          <CardDescription>Manage your scheduled follow-ups and reminders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Input
                placeholder="Search follow-ups by lead or company..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {followUpStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFollowUps.map((followUp) => {
                  const lead = leads.find(l => l.id === followUp.leadId);
                  return (
                    <TableRow key={followUp.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{lead?.name}</div>
                          <div className="text-sm text-muted-foreground">{lead?.company}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{followUp.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>{format(new Date(followUp.scheduledAt), 'PPP')}</div>
                        <div className="text-sm text-muted-foreground">{format(new Date(followUp.scheduledAt), 'HH:mm')}</div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            followUp.status === 'Completed' ? 'success' :
                            followUp.status === 'Missed' ? 'destructive' :
                            followUp.status === 'Cancelled' ? 'secondary' :
                            'primary'
                          }
                        >
                          {followUp.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {followUp.notes}
                      </TableCell>
                      <TableCell className="flex gap-2">
                        {followUp.status === 'Scheduled' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-500 hover:text-green-600"
                              onClick={() => handleStatusChange(followUp.id, 'Completed')}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => handleStatusChange(followUp.id, 'Cancelled')}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(followUp)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDelete(followUp.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {filteredFollowUps.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No follow-ups found. Try adjusting your search or filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FollowUps;