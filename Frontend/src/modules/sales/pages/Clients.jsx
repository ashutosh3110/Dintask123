import React, { useMemo } from 'react';
import { Users, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Badge } from '@/shared/components/ui/badge';
import useCRMStore from '@/store/crmStore';
import useAuthStore from '@/store/authStore';

const Clients = () => {
    const { user } = useAuthStore();
    const { leads, addLead } = useCRMStore();

    // In a real app, we might filter by owner or show all depending on permissions
    // const myClients = leads.filter(l => l.owner === user?.id);
    const myClients = leads;

    const stats = useMemo(() => {
        return {
            total: myClients.length,
            active: myClients.filter(c => c.status === 'Won').length,
            inactive: myClients.filter(c => c.status !== 'Won').length
        };
    }, [myClients]);

    const handleAddClient = () => {
        const name = window.prompt("Enter Client Name:");
        if (!name) return;
        const company = window.prompt("Enter Company:");
        const email = window.prompt("Enter Email:");

        // Add as a 'Won' lead (Active Client)
        const newClient = {
            name,
            company,
            email,
            status: 'Won',
            owner: user?.id,
            createdAt: new Date().toISOString(),
            source: 'Manual'
        };
        addLead(newClient);
        alert('Client added successfully!');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Clients</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and track all your clients</p>
                </div>
                <Button className="gap-2" onClick={handleAddClient}>
                    <Plus size={16} />
                    New Client
                </Button>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-bold">Client List</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Client ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {myClients.length > 0 ? (
                                    myClients.map((client) => (
                                        <TableRow key={client.id}>
                                            <TableCell className="font-medium">{client.id}</TableCell>
                                            <TableCell className="font-medium">{client.name}</TableCell>
                                            <TableCell>{client.company}</TableCell>
                                            <TableCell>{client.email}</TableCell>
                                            <TableCell>
                                                <Badge variant={client.status === 'Won' ? 'default' : 'secondary'}>
                                                    {client.status === 'Won' ? 'Active' : 'Potential'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            No clients found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-bold">Client Statistics</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <p className="text-sm text-slate-500">Total Clients</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-slate-500">Active Clients</p>
                            <p className="text-2xl font-bold text-emerald-600">
                                {stats.active}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-slate-500">Potential/Inactive</p>
                            <p className="text-2xl font-bold text-amber-600">
                                {stats.inactive}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Clients;