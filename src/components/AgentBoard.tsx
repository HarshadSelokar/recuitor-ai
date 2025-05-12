
import React from 'react';
import { useRecruiter } from '@/context/RecruiterContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Activity, BookOpen, Brain, MessageSquare, User, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AgentBoard = () => {
  const { agents, toggleAgent } = useRecruiter();

  // Sample data for agent activity
  const activityData = [
    { name: 'JD Analyzer', tasks: 124, success: 118, failure: 6 },
    { name: 'CV Parser', tasks: 235, success: 228, failure: 7 },
    { name: 'Matcher', tasks: 187, success: 187, failure: 0 },
    { name: 'Reviewer', tasks: 156, success: 152, failure: 4 },
    { name: 'Communicator', tasks: 98, success: 96, failure: 2 },
  ];
  
  // Sample data for agent accuracy
  const accuracyData = [
    { name: 'JD Analyzer', value: 95 },
    { name: 'CV Parser', value: 97 },
    { name: 'Matcher', value: 100 },
    { name: 'Reviewer', value: 97 },
    { name: 'Communicator', value: 98 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Agent icon mapping
  const getAgentIcon = (role: string) => {
    switch (role) {
      case 'reader': return <BookOpen className="h-6 w-6 text-blue-500" />;
      case 'matcher': return <Users className="h-6 w-6 text-green-500" />;
      case 'reviewer': return <User className="h-6 w-6 text-yellow-500" />;
      case 'communicator': return <MessageSquare className="h-6 w-6 text-purple-500" />;
      default: return <Brain className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-recruit-primary">AI Agent Management</h1>
        <Button>Configure New Agent</Button>
      </div>
      
      <Tabs defaultValue="agents" className="w-full">
        <TabsList>
          <TabsTrigger value="agents">Active Agents</TabsTrigger>
          <TabsTrigger value="analytics">Agent Analytics</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="agents" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map(agent => (
              <Card key={agent.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="relative pb-2">
                  <div className="absolute right-6 top-6">
                    <Switch 
                      checked={agent.active} 
                      onCheckedChange={() => toggleAgent(agent.id)}
                    />
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    {getAgentIcon(agent.role)}
                    <CardTitle>{agent.name}</CardTitle>
                  </div>
                  <CardDescription>{agent.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Badge variant={agent.active ? "default" : "outline"}>
                      {agent.active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="secondary">{agent.role.charAt(0).toUpperCase() + agent.role.slice(1)}</Badge>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tasks Processed</span>
                      <span className="font-medium">{activityData.find(d => d.name.includes(agent.role))?.tasks || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Success Rate</span>
                      <span className="font-medium">{accuracyData.find(d => d.name.includes(agent.role))?.value || 0}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Active</span>
                      <span className="font-medium">2 minutes ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Agent Activity</CardTitle>
                <CardDescription>Tasks processed by each agent</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={activityData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="success" stackId="a" fill="#2ecc71" name="Successful" />
                    <Bar dataKey="failure" stackId="a" fill="#e74c3c" name="Failed" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Agent Accuracy</CardTitle>
                <CardDescription>Success rate for each agent</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={accuracyData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {accuracyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Accuracy']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Agent Performance Metrics</CardTitle>
              <CardDescription>Detailed analysis of agent effectiveness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted">
                    <tr>
                      <th scope="col" className="px-6 py-3">Agent</th>
                      <th scope="col" className="px-6 py-3">Tasks Processed</th>
                      <th scope="col" className="px-6 py-3">Success Rate</th>
                      <th scope="col" className="px-6 py-3">Avg. Processing Time</th>
                      <th scope="col" className="px-6 py-3">Last 24h Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agents.map((agent, idx) => (
                      <tr key={idx} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                        <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
                          {agent.name}
                        </th>
                        <td className="px-6 py-4">
                          {activityData.find(d => d.name.includes(agent.role))?.tasks || 0}
                        </td>
                        <td className="px-6 py-4">
                          {accuracyData.find(d => d.name.includes(agent.role))?.value || 0}%
                        </td>
                        <td className="px-6 py-4">
                          {Math.floor(Math.random() * 1000) + 100}ms
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            <div className="bg-gray-200 h-2 w-24 rounded-full overflow-hidden">
                              <div 
                                className="bg-recruit-primary h-full" 
                                style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
              <CardDescription>Recent agent activity and system events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 10 }).map((_, idx) => {
                  const agent = agents[Math.floor(Math.random() * agents.length)];
                  const actions = [
                    "processed a job description",
                    "analyzed a candidate CV",
                    "matched candidates to job",
                    "reviewed match results",
                    "generated communication template"
                  ];
                  const action = actions[Math.floor(Math.random() * actions.length)];
                  const time = `${Math.floor(Math.random() * 59) + 1} minute${idx === 0 ? '' : 's'} ago`;
                  
                  return (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-muted/50 rounded-md">
                      <div className="mt-0.5">
                        {getAgentIcon(agent.role)}
                      </div>
                      <div>
                        <p className="font-medium">{agent.name} {action}</p>
                        <p className="text-sm text-muted-foreground">{time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentBoard;
