import React from 'react';
import { Users, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Badge } from '@/shared/components/ui/badge';

const Clients = () => {
    // Simple mock clients data for testing
    const mockClients = [
        {
            id: 'C001',
            name: 'ABC Corp',
            email: 'contact@abccorp.com',
            status: 'active'
        },
        {
            id: 'C002',
            name: 'XYZ Ltd',
            email: 'info@xyzltd.com',
            status: 'active'
        },
        {
            id: 'C003',
            name: '123 Industries',
            email: 'sales@123industries.com',
            status: 'inactive'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Clients</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and track all your clients</p>
                </div>
                <Button className="gap-2">
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
                                    <TableHead>Email</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockClients.map((client) => (
                                    <TableRow key={client.id}>
                                        <TableCell className="font-medium">{client.id}</TableCell>
                                        <TableCell className="font-medium">{client.name}</TableCell>
                                        <TableCell>{client.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                                                {client.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
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
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{mockClients.length}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-slate-500">Active Clients</p>
                            <p className="text-2xl font-bold text-emerald-600">
                                {mockClients.filter(c => c.status === 'active').length}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-slate-500">Inactive Clients</p>
                            <p className="text-2xl font-bold text-red-600">
                                {mockClients.filter(c => c.status === 'inactive').length}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Clients;