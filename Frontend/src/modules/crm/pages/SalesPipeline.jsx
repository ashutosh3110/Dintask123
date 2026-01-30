import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import { GripVertical } from 'lucide-react';
import useCRMStore from '@/store/crmStore';

const SalesPipeline = () => {
  const {
    leads,
    pipelineStages,
    getPipelineData,
    moveLead,
  } = useCRMStore();

  const [draggedLead, setDraggedLead] = useState(null);
  const [draggedFromStage, setDraggedFromStage] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [reason, setReason] = useState('');

  const pipelineData = getPipelineData();

  const handleDragStart = (leadId, stage) => {
    setDraggedLead(leadId);
    setDraggedFromStage(stage);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (toStage) => {
    if (draggedLead && draggedFromStage !== toStage) {
      moveLead(draggedLead, draggedFromStage, toStage);
      if (toStage === 'Won' || toStage === 'Lost') {
        const lead = leads.find(l => l.id === draggedLead);
        setSelectedLead(lead);
        setOpen(true);
      }
    }
    setDraggedLead(null);
    setDraggedFromStage(null);
  };

  const handleSubmitReason = () => {
    // Reason can be saved to lead notes or separate field
    console.log('Reason submitted:', reason);
    setOpen(false);
    setReason('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales Pipeline</h1>
          <p className="text-muted-foreground">Track and manage your deals through the sales process</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pipelineData.map(({ stage, leads: stageLeads }) => (
          <Card
            key={stage}
            className="h-full flex flex-col"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(stage)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{stage}</CardTitle>
                <Badge variant="secondary">{stageLeads.length}</Badge>
              </div>
              <CardDescription>Drag leads between stages</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-2">
              {stageLeads.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-muted-foreground border-2 border-dashed border-muted-foreground/30 rounded-lg">
                  No leads in this stage
                </div>
              ) : (
                stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 cursor-move hover:shadow-md transition-shadow"
                    draggable
                    onDragStart={() => handleDragStart(lead.id, stage)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <h4 className="font-medium">{lead.name}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{lead.company}</p>
                        <p className="text-xs text-muted-foreground mt-1">{lead.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" size="sm">{lead.source}</Badge>
                          <span className="text-xs text-muted-foreground">{lead.owner === 'EMP-001' ? 'John Doe' : 'Jane Smith'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Won/Lost Reason Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedLead && selectedLead.status === 'Won' ? 'Deal Won' : 'Deal Lost'}
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for this outcome
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder={`Enter reason why this deal was ${selectedLead && selectedLead.status.toLowerCase()}`}
                className="min-h-[100px]"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitReason}>
              Save Reason
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesPipeline;