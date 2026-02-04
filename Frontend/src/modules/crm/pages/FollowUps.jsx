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
import { Plus, Calendar as CalendarIcon, Clock, CheckCircle2, XCircle, Search, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import useCRMStore from '@/store/crmStore';

import { cn } from '@/shared/utils/cn';

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

  // Lead Search Autocomplete State
  const [leadSearch, setLeadSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const followUpTypes = ['Call', 'Meeting', 'Email', 'WhatsApp'];
  const followUpStatuses = ['Scheduled', 'Completed', 'Missed', 'Cancelled'];

  const suggestedLeads = useMemo(() => {
    if (!leadSearch) return [];
    const searchLower = leadSearch.toLowerCase();
    return leads.filter(lead =>
      lead.name.toLowerCase().includes(searchLower) ||
      lead.company.toLowerCase().includes(searchLower)
    );
  }, [leads, leadSearch]);

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

    // Validate lead selection
    if (!formData.leadId) {
      alert("Please select a valid lead from the suggestions.");
      return;
    }

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

    // Set lead search input
    const lead = leads.find(l => l.id === followUp.leadId);
    if (lead) setLeadSearch(lead.name);

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
    setLeadSearch(''); // Reset search
    setSelectedDate(new Date());
    setTime('12:00');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 px-1 sm:px-0">
          <div className="lg:hidden w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 shrink-0">
            <img src="/src/assets/logo.png" alt="DinTask" className="h-full w-full object-cover" />
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase">Follow-ups <span className="text-primary-600">& Reminders</span></h1>
            <p className="text-[10px] sm:text-sm text-slate-500 dark:text-slate-400 font-medium tracking-wide mt-1 uppercase">Interaction schedule</p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="h-9 sm:h-11 px-4 sm:px-6 shadow-lg shadow-primary-500/20 bg-primary-600 hover:bg-primary-700 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98]">
              <Plus className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Schedule Follow-up</span>
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
              <div className="space-y-2 relative">
                <Label htmlFor="leadId">Lead</Label>
                <div className="relative">
                  <Input
                    placeholder="Search for a lead..."
                    value={leadSearch}
                    onChange={(e) => {
                      setLeadSearch(e.target.value);
                      setShowSuggestions(true);
                      // Clear leadId if user changes input, forcing them to re-select
                      if (formData.leadId) setFormData({ ...formData, leadId: '' });
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    // Delay hiding suggestions to allow clicking on an item
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className={cn(
                      "w-full",
                      !formData.leadId && leadSearch && "border-amber-500 focus-visible:ring-amber-500" // Highlight if searching but not selected
                    )}
                  />
                  {formData.leadId && (
                    <div className="absolute right-3 top-2.5 text-green-500">
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                </div>

                {showSuggestions && leadSearch && !formData.leadId && (
                  <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {suggestedLeads.length > 0 ? (
                      suggestedLeads.map((lead) => (
                        <div
                          key={lead.id}
                          className="px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors flex flex-col gap-0.5"
                          onMouseDown={(e) => {
                            // Prevent default to ensure input doesn't blur immediately if we want to keep focus,
                            // but here we actually likely want to allow the selection and then close.
                            // The key is onMouseDown fires before onBlur.
                            e.preventDefault();
                            setFormData({ ...formData, leadId: lead.id });
                            setLeadSearch(`${lead.name} (${lead.company})`); // Set full descriptive name
                            setShowSuggestions(false);
                          }}
                        >
                          <span className="text-sm font-medium text-slate-900 dark:text-white">{lead.name}</span>
                          <span className="text-xs text-slate-500">{lead.company}</span>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-slate-500 text-center">
                        No leads found matching "{leadSearch}"
                      </div>
                    )}
                  </div>
                )}
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

      <Card className="border-none shadow-sm shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden">
        <CardContent className="p-3 sm:p-5">
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search follow-ups..."
                className="pl-10 h-10 sm:h-11 bg-slate-50 border-none dark:bg-slate-800 rounded-xl sm:rounded-2xl font-bold text-[11px] sm:text-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[180px] h-10 sm:h-11 bg-slate-50 border-none dark:bg-slate-800 rounded-xl sm:rounded-2xl font-bold text-[11px] sm:text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 dark:border-slate-800">
                <SelectItem value="all" className="text-xs font-bold font-black uppercase">All Statuses</SelectItem>
                {followUpStatuses.map((status) => (
                  <SelectItem key={status} value={status} className="text-xs font-bold font-black uppercase">
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto hidden lg:block">
            <Table>
              <TableHeader>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Lead Info</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Type</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Schedule</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Status</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Notes</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </TableHeader>
              <TableBody>
                {filteredFollowUps.map((followUp) => {
                  const lead = leads.find(l => l.id === followUp.leadId);
                  return (
                    <TableRow key={followUp.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 border-slate-100 dark:border-slate-800 transition-colors">
                      <TableCell className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black uppercase text-slate-500">
                            {lead?.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-900 dark:text-white leading-tight">{lead?.name}</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{lead?.company}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="p-4">
                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">{followUp.type}</Badge>
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="flex flex-col gap-0.5">
                          <div className="text-[11px] font-black text-slate-700 dark:text-slate-300">{format(new Date(followUp.scheduledAt), 'PPP')}</div>
                          <div className="flex items-center gap-1 text-[9px] text-slate-400 font-medium">
                            <Clock size={10} /> {format(new Date(followUp.scheduledAt), 'HH:mm')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="p-4">
                        <Badge
                          className={cn(
                            "text-[9px] font-black uppercase tracking-widest h-5 px-2",
                            followUp.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 shadow-none border-none' :
                              followUp.status === 'Missed' ? 'bg-red-50 text-red-600 shadow-none border-none' :
                                'bg-primary-50 text-primary-600 shadow-none border-none'
                          )}
                        >
                          {followUp.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-4 max-w-[150px] truncate text-[10px] text-slate-500 font-medium">
                        {followUp.notes || '—'}
                      </TableCell>
                      <TableCell className="p-4 text-right">
                        <div className="flex justify-end gap-1">
                          {followUp.status === 'Scheduled' && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-emerald-500 hover:bg-emerald-50 rounded-lg"
                                onClick={() => handleStatusChange(followUp.id, 'Completed')}
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:bg-red-50 rounded-lg"
                                onClick={() => handleStatusChange(followUp.id, 'Cancelled')}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                            onClick={() => handleEdit(followUp)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                            onClick={() => handleDelete(followUp.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card List */}
          <div className="lg:hidden space-y-3">
            {filteredFollowUps.map((followUp) => {
              const lead = leads.find(l => l.id === followUp.leadId);
              const isPast = new Date(followUp.scheduledAt) < new Date() && followUp.status === 'Scheduled';
              return (
                <div key={followUp.id} className="p-4 rounded-2xl bg-slate-50/30 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950/30 text-primary-600 flex items-center justify-center text-[10px] font-black uppercase">
                        {lead?.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[13px] font-black text-slate-900 dark:text-white leading-tight">{lead?.name}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{lead?.company}</p>
                      </div>
                    </div>
                    <Badge
                      className={cn(
                        "text-[8px] font-black uppercase tracking-widest h-5 px-2",
                        followUp.status === 'Completed' ? 'bg-emerald-100/50 text-emerald-600' :
                          followUp.status === 'Missed' || isPast ? 'bg-red-100/50 text-red-600' :
                            'bg-slate-100/80 dark:bg-slate-800 text-slate-500'
                      )}
                    >
                      {isPast ? 'Overdue' : followUp.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 bg-white dark:bg-slate-900/50 rounded-xl shadow-sm">
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Schedule</p>
                      <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate">{format(new Date(followUp.scheduledAt), 'MMM d, yyyy')}</p>
                      <p className="text-[9px] text-slate-500 truncate flex items-center gap-1"><Clock size={10} /> {format(new Date(followUp.scheduledAt), 'HH:mm')}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Interaction</p>
                      <Badge variant="outline" className="text-[8px] font-black h-5 border-slate-100 dark:border-slate-800">{followUp.type}</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex gap-2">
                      {followUp.status === 'Scheduled' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 rounded-xl bg-white dark:bg-slate-900 text-emerald-600 font-black text-[9px] uppercase tracking-widest border-slate-100 dark:border-slate-800"
                            onClick={() => handleStatusChange(followUp.id, 'Completed')}
                          >
                            Done
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 rounded-xl bg-white dark:bg-slate-900 text-red-500 font-black text-[9px] uppercase tracking-widest border-slate-100 dark:border-slate-800"
                            onClick={() => handleStatusChange(followUp.id, 'Cancelled')}
                          >
                            Skip
                          </Button>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 border border-slate-100 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm"
                        onClick={() => handleEdit(followUp)}
                      >
                        <Edit size={12} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 border border-slate-100 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm"
                        onClick={() => handleDelete(followUp.id)}
                      >
                        <Trash2 size={12} className="text-red-400" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
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