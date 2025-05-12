
import React from 'react';
import { useRecruiter } from '@/context/RecruiterContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Users, Briefcase, User, CheckCircle, Clock } from 'lucide-react';

const Dashboard = () => {
  const { jobs, cvs, matches } = useRecruiter();
  
  // Calculate statistics
  const activeJobs = jobs.filter(job => job.status === 'active').length;
  const totalCandidates = cvs.length;
  const totalMatches = matches.length;
  const shortlistedCandidates = matches.filter(match => match.status === 'shortlisted').length;
  
  // Data for pie chart
  const statusData = [
    { name: 'New', value: matches.filter(m => m.status === 'new').length, color: '#3498db' },
    { name: 'Reviewed', value: matches.filter(m => m.status === 'reviewed').length, color: '#f39c12' },
    { name: 'Shortlisted', value: matches.filter(m => m.status === 'shortlisted').length, color: '#2ecc71' },
    { name: 'Rejected', value: matches.filter(m => m.status === 'rejected').length, color: '#e74c3c' },
    { name: 'Interview', value: matches.filter(m => m.status === 'interview_scheduled').length, color: '#9b59b6' },
  ];
  
  // Top 5 candidates with highest match score
  const topCandidates = [...matches]
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5)
    .map(match => {
      const candidate = cvs.find(cv => cv.id === match.candidateId);
      return {
        name: candidate?.candidateName || 'Unknown',
        score: Math.round(match.matchScore * 100)
      };
    });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-recruit-primary">Recruitment Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline">Export Report</Button>
          <Button>New Job</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{activeJobs}</div>
              <Briefcase className="h-5 w-5 text-recruit-secondary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{totalCandidates}</div>
              <Users className="h-5 w-5 text-recruit-secondary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Candidate Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{totalMatches}</div>
              <User className="h-5 w-5 text-recruit-secondary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Shortlisted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{shortlistedCandidates}</div>
              <CheckCircle className="h-5 w-5 text-recruit-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="candidates">Top Candidates</TabsTrigger>
          <TabsTrigger value="timeline">Recent Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Candidate Status</CardTitle>
                <CardDescription>Distribution of candidates by current status</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Candidates</CardTitle>
                <CardDescription>Candidates with highest match scores</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topCandidates} layout="vertical">
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis type="category" dataKey="name" width={150} />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Match Score']}
                      labelFormatter={() => 'Candidate'}
                    />
                    <Bar dataKey="score" fill="#0f4c81" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="candidates">
          <Card>
            <CardHeader>
              <CardTitle>Top Matching Candidates</CardTitle>
              <CardDescription>Detailed view of highest-scoring candidates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCandidates.map((candidate, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-recruit-primary flex items-center justify-center text-white">
                        {candidate.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{candidate.name}</p>
                        <p className="text-sm text-muted-foreground">Match Score: {candidate.score}%</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View Profile</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Timeline of recruitment activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-recruit-secondary/20 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-recruit-secondary" />
                      </div>
                      <div className="w-0.5 h-full bg-border" />
                    </div>
                    <div className="pb-4">
                      <p className="font-medium">
                        {["Candidate shortlisted", "New CV uploaded", "Interview scheduled", "Job posted", "Match analysis completed"][idx]}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {`${idx + 1} hour${idx === 0 ? '' : 's'} ago`}
                      </p>
                      <p className="text-sm mt-1">
                        {[
                          "Alex Johnson was shortlisted for Full Stack Developer position",
                          "New CV uploaded for Jordan Patel",
                          "Interview scheduled with Morgan Smith for Data Scientist role",
                          "New job posted: UI/UX Designer at Creative Solutions",
                          "Match analysis completed for Data Scientist position"
                        ][idx]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
