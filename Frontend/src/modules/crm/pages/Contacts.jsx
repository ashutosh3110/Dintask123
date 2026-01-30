import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Badge } from '@/shared/components/ui/badge';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Plus, UserPlus, Phone, Mail, Building, History } from 'lucide-react';
import useCRMStore from '@/store/crmStore';

const Contacts = () => {
  const {
    leads,
  } = useCRMStore();

  // Mock contacts data
  const [contacts, setContacts] = useState([
    {
      id: 'CONTACT-001',
      name: 'John Doe',
      mobile: '+1234567890',
      email: 'john.doe@example.com',
      company: 'ABC Corp',
      position: 'CEO',
      convertedFrom: 'LEAD-001',
      convertedAt: new Date().toISOString(),
      owner: 'EMP-001',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterOwner, setFilterOwner] = useState('all');
  const [open, setOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    company: '',
    position: '',
    notes: '',
  });

  // Contact history (mock data)
  const contactHistory = [
    {
      id: 'HIST-001',
      contactId: 'CONTACT-001',
      type: 'Call',
      description: 'Discussed project requirements',
      date: new Date().toISOString(),
      createdBy: 'EMP-001',
    },
    {
      id: 'HIST-002',
      contactId: 'CONTACT-001',
      type: 'Email',
      description: 'Sent project proposal',
      date: new Date().toISOString(),
      createdBy: 'EMP-001',
    },
  ];

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const matchesSearch = 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.mobile.includes(searchTerm);
      const matchesOwner = filterOwner === 'all' || contact.owner === filterOwner;
      return matchesSearch && matchesOwner;
    });
  }, [contacts, searchTerm, filterOwner]);

  const handleConvertLead = (lead) => {
    setSelectedLead(lead);
    setFormData({
      name: lead.name,
      mobile: lead.mobile,
      email: lead.email,
      company: lead.company,
      position: '',
      notes: '',
    });
    setOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedLead) {
      const newContact = {
        id: `CONTACT-${Math.floor(1000 + Math.random() * 9000)}`,
        ...formData,
        convertedFrom: selectedLead.id,
        convertedAt: new Date().toISOString(),
        owner: selectedLead.owner,
      };
      setContacts([...contacts, newContact]);
      setOpen(false);
      setSelectedLead(null);
      // In a real implementation, we would update the lead status to 'Converted'
      console.log('Lead converted to contact:', newContact);
    }
  };

  const getContactHistory = (contactId) => {
    return contactHistory.filter(entry => entry.contactId === contactId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contacts</h1>
          <p className="text-muted-foreground">Manage your converted contacts</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Convert Lead to Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Convert Lead to Contact</DialogTitle>
              <DialogDescription>
                Convert selected lead to a contact
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add any additional information"
                />
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Convert to Contact
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Available Leads for Conversion */}
      <Card>
        <CardHeader>
          <CardTitle>Available Leads for Conversion</CardTitle>
          <CardDescription>Convert qualified leads to contacts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.id}</TableCell>
                    <TableCell>{lead.name}</TableCell>
                    <TableCell>{lead.company}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>
                      <Badge variant="primary">{lead.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleConvertLead(lead)}
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Convert
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Contacts List */}
      <Card>
        <CardHeader>
          <CardTitle>Contacts List</CardTitle>
          <CardDescription>Manage your converted contacts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Input
                placeholder="Search contacts by name, email, or company..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterOwner} onValueChange={setFilterOwner}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by owner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Owners</SelectItem>
                <SelectItem value="EMP-001">John Doe</SelectItem>
                <SelectItem value="EMP-002">Jane Smith</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>History</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">{contact.id}</TableCell>
                    <TableCell>{contact.name}</TableCell>
                    <TableCell>{contact.company}</TableCell>
                    <TableCell>{contact.position}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.mobile}</TableCell>
                    <TableCell>
                      {contact.owner === 'EMP-001' ? 'John Doe' : 'Jane Smith'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Show contact history
                          console.log('Contact history:', getContactHistory(contact.id));
                        }}
                      >
                        <History className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredContacts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No contacts found. Try adjusting your search or filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Contacts;