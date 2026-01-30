import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import useCRMStore from '@/store/crmStore';

const AdminDashboard = () => {
  const { leads, getPipelineData } = useCRMStore();

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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin CRM Dashboard</h1>
          <p className="text-muted-foreground">Overview of all company CRM data</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDeals}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Won Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wonDeals}</div>
            <p className="text-xs text-muted-foreground">+20% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Lost Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lostDeals}</div>
            <p className="text-xs text-muted-foreground">-10% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pipeline" className="w-full">
        <TabsList>
          <TabsTrigger value="pipeline">Sales Pipeline</TabsTrigger>
          <TabsTrigger value="employee">Employee Performance</TabsTrigger>
          <TabsTrigger value="leads">Lead Distribution</TabsTrigger>
        </TabsList>
        <TabsContent value="pipeline" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Pipeline Overview</CardTitle>
                <CardDescription>Deals by stage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={leadDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Lead Status Distribution</CardTitle>
                <CardDescription>Percentage by status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={leadDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {leadDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="employee" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Performance</CardTitle>
              <CardDescription>Leads managed and deals closed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Total Leads</TableHead>
                      <TableHead>Won Deals</TableHead>
                      <TableHead>Lost Deals</TableHead>
                      <TableHead>Win Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employeePerformance.map((employee) => (
                      <TableRow key={employee.name}>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>{employee.leads}</TableCell>
                        <TableCell>{employee.won}</TableCell>
                        <TableCell>{employee.lost}</TableCell>
                        <TableCell>
                          {((employee.won / (employee.won + employee.lost)) * 100).toFixed(0)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="h-80 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={employeePerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="leads" name="Total Leads" fill="#3b82f6" />
                    <Bar dataKey="won" name="Won Deals" fill="#10b981" />
                    <Bar dataKey="lost" name="Lost Deals" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="leads" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lead Source Distribution</CardTitle>
              <CardDescription>Where your leads are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { source: 'Website', count: 45 },
                    { source: 'Call', count: 30 },
                    { source: 'WhatsApp', count: 25 },
                    { source: 'Referral', count: 15 },
                    { source: 'Manual', count: 10 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="source" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;