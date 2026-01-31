import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import {
  GripVertical,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  IndianRupee,
  UserCircle,
  Building2,
  Edit2,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import useCRMStore from '@/store/crmStore';
import { cn } from '@/shared/utils/cn';
import { format } from 'date-fns';
import { toast } from 'sonner';

const SalesPipeline = () => {
  const {
    leads,
    getPipelineData,
    moveLead,
    addLead,
    editLead,
    deleteLead,
    pipelineStages
  } = useCRMStore();

  const [draggedLead, setDraggedLead] = useState(null);
  const [draggedFromStage, setDraggedFromStage] = useState(null);
  const [isOutcomeOpen, setIsOutcomeOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [editingDealData, setEditingDealData] = useState(null);
  const [outcomeReason, setOutcomeReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');

  // New Deal Form State
  const [newDealData, setNewDealData] = useState({
    name: '',
    company: '',
    amount: '',
    priority: 'medium',
    stage: 'New',
    email: ''
  });

  const pipelineData = getPipelineData();

  // Calculate totals and filter data
  const processedPipeline = useMemo(() => {
    return pipelineData.map(column => {
      const filteredLeads = column.leads.filter(lead => {
        if (!lead) return false;
        const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.company.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPriority = filterPriority === 'all' || lead.priority === filterPriority;
        return matchesSearch && matchesPriority;
      });

      const totalValue = filteredLeads.reduce((sum, lead) => sum + (Number(lead.amount) || 0), 0);

      return {
        ...column,
        leads: filteredLeads,
        totalValue
      };
    });
  }, [pipelineData, searchTerm, filterPriority]);

  const handleDragStart = (e, leadId, stage) => {
    setDraggedLead(leadId);
    setDraggedFromStage(stage);
    // Add a ghost class to the dragged element if needed
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (toStage) => {
    if (draggedLead && draggedFromStage !== toStage) {
      moveLead(draggedLead, draggedFromStage, toStage);

      if (toStage === 'Won' || toStage === 'Lost') {
        const lead = leads.find(l => l.id === draggedLead);
        setSelectedLead({ ...lead, status: toStage }); // Temporarily update status for dialog
        setIsOutcomeOpen(true);
      } else {
        toast.success(`Deal moved to ${toStage}`);
      }
    }
    setDraggedLead(null);
    setDraggedFromStage(null);
  };

  const handleSubmitReason = () => {
    toast.success(`Deal marked as ${selectedLead.status}`);
    setIsOutcomeOpen(false);
    setOutcomeReason('');
    setSelectedLead(null);
  };

  const handleAddDeal = () => {
    if (!newDealData.name || !newDealData.company) {
      toast.error("Name and Company are required");
      return;
    }

    const deal = {
      ...newDealData,
      amount: parseFloat(newDealData.amount) || 0,
      owner: 'EMP-001', // Mock owner
      createdAt: new Date().toISOString(),
      status: newDealData.stage // Ensure status matches stage
    };

    const addedLead = addLead(deal);

    if (newDealData.stage !== 'New') {
      moveLead(addedLead.id, 'New', newDealData.stage);
    }

    toast.success("New deal added to pipeline");
    setIsAddOpen(false);
    setNewDealData({
      name: '',
      company: '',
      amount: '',
      priority: 'medium',
      stage: 'New',
      email: ''
    });
  };

  const handleEditClick = (lead) => {
    setEditingDealData({
      ...lead,
      amount: lead.amount.toString() // Ensure amount is editable string
    });
    setIsEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingDealData.name || !editingDealData.company) {
      toast.error("Name and Company are required");
      return;
    }

    editLead(editingDealData.id, {
      ...editingDealData,
      amount: parseFloat(editingDealData.amount) || 0
    });

    toast.success("Deal updated successfully");
    setIsEditOpen(false);
    setEditingDealData(null);
  };

  const handleDeleteDeal = (id) => {
    if (confirm('Are you sure you want to delete this deal?')) {
      deleteLead(id);
      toast.success("Deal deleted");
    }
  };


  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-4">
      {/* Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Sales Pipeline</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage and track your deal flow.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search deals..."
              className="pl-9 h-10 w-[200px] lg:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-[140px] h-10">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setIsAddOpen(true)} className="gap-2 h-10 bg-primary-600 hover:bg-primary-700">
            <Plus size={18} />
            Add Deal
          </Button>
        </div>
      </div>

      {/* Kanban Board Area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex h-full gap-6 min-w-max px-1">
          {processedPipeline.map(({ stage, leads: stageLeads, totalValue }) => (
            <div
              key={stage}
              className="flex flex-col w-[320px] bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 h-full max-h-full"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(stage)}
            >
              {/* Column Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-t-xl sticky top-0 z-10">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-700 dark:text-slate-200">{stage}</h3>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                    {stageLeads.length}
                  </Badge>
                </div>
                <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className={cn("h-full bg-primary-500 rounded-full",
                    stage === 'Won' ? 'bg-emerald-500' :
                      stage === 'Lost' ? 'bg-red-500' : 'bg-primary-500'
                  )} style={{ width: '100%' }} />
                </div>
                <div className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  Total: <span className="font-bold text-slate-900 dark:text-white">₹{totalValue.toLocaleString()}</span>
                </div>
              </div>

              {/* Column Content (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                {stageLeads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50">
                    <p className="text-sm">No deals</p>
                  </div>
                ) : (
                  stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id, stage)}
                      className="group bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-primary-200 transition-all relative"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <Badge
                          variant="outline"
                          className={cn("text-[10px] uppercase font-bold px-1.5 py-0.5 border", getPriorityColor(lead.priority))}
                        >
                          {lead.priority}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-slate-600">
                              <MoreHorizontal size={14} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditClick(lead)}>
                              <Edit2 className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDeleteDeal(lead.id)}>
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1 line-clamp-2">{lead.name}</h4>

                      <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
                        <Building2 size={12} />
                        <span className="truncate max-w-[150px]">{lead.company}</span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800">
                        <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
                          <IndianRupee size={12} />
                          {Number(lead.amount || 0).toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Calendar size={10} />
                          {lead.deadline ? format(new Date(lead.deadline), 'MMM d') : 'No date'}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Outcome Dialog */}
      <Dialog open={isOutcomeOpen} onOpenChange={setIsOutcomeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedLead?.status === 'Won' ? '🎉 Deal Won!' : 'Deal Lost'}
            </DialogTitle>
            <DialogDescription>
              Please provide a reason or notes for this outcome to verify.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason / Notes</Label>
              <Textarea
                id="reason"
                placeholder={selectedLead?.status === 'Won' ? "What went well?" : "Why did we lose this deal?"}
                className="min-h-[100px]"
                value={outcomeReason}
                onChange={(e) => setOutcomeReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsOutcomeOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitReason} className={selectedLead?.status === 'Won' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}>
              Confirm {selectedLead?.status}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Deal Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Deal</DialogTitle>
            <DialogDescription>Create a new opportunity in your pipeline.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={newDealData.name}
                onChange={(e) => setNewDealData({ ...newDealData, name: e.target.value })}
                className="col-span-3"
                placeholder="Deal Name / Contact"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">Company</Label>
              <Input
                id="company"
                value={newDealData.company}
                onChange={(e) => setNewDealData({ ...newDealData, company: e.target.value })}
                className="col-span-3"
                placeholder="Company Name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">Value (₹)</Label>
              <Input
                id="amount"
                type="number"
                value={newDealData.amount}
                onChange={(e) => setNewDealData({ ...newDealData, amount: e.target.value })}
                className="col-span-3"
                placeholder="50000"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">Priority</Label>
              <Select
                value={newDealData.priority}
                onValueChange={(val) => setNewDealData({ ...newDealData, priority: val })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAddDeal}>Create Deal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Deal Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Deal</DialogTitle>
            <DialogDescription>Update deal details.</DialogDescription>
          </DialogHeader>
          {editingDealData && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">Name</Label>
                <Input
                  id="edit-name"
                  value={editingDealData.name}
                  onChange={(e) => setEditingDealData({ ...editingDealData, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-company" className="text-right">Company</Label>
                <Input
                  id="edit-company"
                  value={editingDealData.company}
                  onChange={(e) => setEditingDealData({ ...editingDealData, company: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-amount" className="text-right">Value (₹)</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  value={editingDealData.amount}
                  onChange={(e) => setEditingDealData({ ...editingDealData, amount: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-priority" className="text-right">Priority</Label>
                <Select
                  value={editingDealData.priority}
                  onValueChange={(val) => setEditingDealData({ ...editingDealData, priority: val })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesPipeline;