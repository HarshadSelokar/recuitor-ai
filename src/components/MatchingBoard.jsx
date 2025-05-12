
import React, { useState, useEffect } from 'react';
import { useRecruiter } from '@/context/RecruiterContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, Briefcase, Search, CheckCircle, XCircle, Clock, CalendarCheck, Filter, SlidersHorizontal } from 'lucide-react';

const MatchingBoard = () => {
  const { jobs, cvs, matches, loading, matchCandidatesToJob, updateCandidateStatus } = useRecruiter();
  const [selectedJobId, setSelectedJobId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [feedback, setFeedback] = useState('');
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);

  // Set the first job as selected job when component mounts
  useEffect(() => {
    if (jobs.length > 0 && !selectedJobId) {
      setSelectedJobId(jobs[0].id);
    }
  }, [jobs]);

  const selectedJob = jobs.find(job => job.id === selectedJobId);

  // Filter matches based on selected job
  const jobMatches = matches.filter(match => match.jobId === selectedJobId);

  // Filter matches based on search term and status
  const filteredMatches = jobMatches.filter(match => {
    const candidate = cvs.find(cv => cv.id === match.candidateId);
    const matchesSearchTerm = candidate && 
      (candidate.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesStatus = statusFilter === 'all' || match.status === statusFilter;
    
    return matchesSearchTerm && matchesStatus;
  });

  // Sort matches by match score
  const sortedMatches = [...filteredMatches].sort((a, b) => b.matchScore - a.matchScore);

  const handleStatusChange = (candidateId, newStatus) => {
    updateCandidateStatus(selectedJobId, candidateId, newStatus, feedback);
    if (candidateId === selectedCandidateId) {
      setFeedback('');
      setSelectedCandidateId(null);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const getStatusColor = (status) => {
    const statusMap = {
      new: 'bg-blue-100 text-blue-800',
      reviewed: 'bg-purple-100 text-purple-800',
      shortlisted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      interview_scheduled: 'bg-amber-100 text-amber-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      new: <Clock className="h-4 w-4" />,
      reviewed: <CheckCircle className="h-4 w-4" />,
      shortlisted: <CheckCircle className="h-4 w-4" />,
      rejected: <XCircle className="h-4 w-4" />,
      interview_scheduled: <CalendarCheck className="h-4 w-4" />
    };
    return iconMap[status] || <Clock className="h-4 w-4" />;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-recruit-primary">Candidate Matching</h1>
          <p className="text-muted-foreground">Match and evaluate candidates for your open positions</p>
        </div>
        
        {selectedJobId && (
          <Button 
            onClick={() => matchCandidatesToJob(selectedJobId)}
            disabled={loading}
          >
            {loading ? 'Matching...' : 'Re-run Matching Algorithm'}
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Job Selection Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Jobs</CardTitle>
              <CardDescription>Select a job to see matched candidates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {jobs.map(job => (
                <Button
                  key={job.id}
                  variant={selectedJobId === job.id ? "default" : "outline"}
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => setSelectedJobId(job.id)}
                >
                  <div>
                    <p className="font-medium">{job.title}</p>
                    <p className="text-xs text-muted-foreground">{job.company}</p>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
          
          {selectedJob && (
            <Card>
              <CardHeader>
                <CardTitle>Selected Job</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{selectedJob.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedJob.company}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Requirements</Label>
                  <ul className="list-disc pl-5 text-sm mt-2">
                    {selectedJob.requirements.slice(0, 3).map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                    {selectedJob.requirements.length > 3 && (
                      <li>+{selectedJob.requirements.length - 3} more...</li>
                    )}
                  </ul>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Location</Label>
                  <p className="text-sm">{selectedJob.location}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Candidates Area */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader className="space-y-0 pb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Matched Candidates</CardTitle>
                  <CardDescription>
                    {filteredMatches.length} candidates matched with {selectedJob?.title}
                  </CardDescription>
                </div>
                
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      className="pl-10 w-full md:w-[200px]" 
                      placeholder="Search candidates..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="interview_scheduled">Interview</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-full max-w-md mx-auto space-y-4">
                    <div className="space-y-2">
                      <p className="text-center text-muted-foreground">Running matching algorithm...</p>
                      <Progress value={45} className="h-2" />
                    </div>
                  </div>
                </div>
              ) : sortedMatches.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <SlidersHorizontal className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Matches Found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filters to see more candidates.' 
                      : 'There are no candidates matched with this job description yet.'}
                  </p>
                  {!searchTerm && statusFilter === 'all' && (
                    <Button onClick={() => matchCandidatesToJob(selectedJobId)}>
                      Run Matching Algorithm
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedMatches.map(match => {
                    const candidate = cvs.find(cv => cv.id === match.candidateId);
                    if (!candidate) return null;
                    
                    return (
                      <Card key={match.candidateId} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row md:items-center">
                          <div className="flex-1 p-4">
                            <div className="flex items-start gap-4">
                              <Avatar className="h-12 w-12 border-2 border-recruit-primary">
                                <AvatarFallback className="bg-recruit-primary text-white">
                                  {getInitials(candidate.candidateName)}
                                </AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                  <div>
                                    <h3 className="font-semibold">{candidate.candidateName}</h3>
                                    <p className="text-sm text-muted-foreground">{candidate.email}</p>
                                  </div>
                                  
                                  <div className="flex items-center mt-2 md:mt-0">
                                    <Badge variant="outline" className={`flex items-center gap-1 ${getStatusColor(match.status)}`}>
                                      {getStatusIcon(match.status)}
                                      {match.status.replace('_', ' ')}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div className="mt-3">
                                  <div className="flex items-center mb-1 gap-2">
                                    <span className="text-sm font-medium">Match Score:</span>
                                    <div className="flex-1 max-w-[300px]">
                                      <Progress value={Math.round(match.matchScore * 100)} className="h-2" />
                                    </div>
                                    <span className="text-sm font-medium">{Math.round(match.matchScore * 100)}%</span>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-1 text-xs mt-3">
                                    <div className="flex items-center gap-1">
                                      <span className="text-muted-foreground">Skills:</span>
                                      <span className="font-medium">{Math.round(match.matchDetails.skillMatch * 100)}%</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="text-muted-foreground">Experience:</span>
                                      <span className="font-medium">{Math.round(match.matchDetails.experienceMatch * 100)}%</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="text-muted-foreground">Education:</span>
                                      <span className="font-medium">{Math.round(match.matchDetails.educationMatch * 100)}%</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {candidate.skills.slice(0, 4).map((skill, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">{skill}</Badge>
                                  ))}
                                  {candidate.skills.length > 4 && (
                                    <Badge variant="outline" className="text-xs">+{candidate.skills.length - 4} more</Badge>
                                  )}
                                </div>
                                
                                {match.feedback && (
                                  <div className="mt-3 text-sm bg-muted p-2 rounded">
                                    <span className="font-medium">Feedback:</span> {match.feedback}
                                  </div>
                                )}
                                
                                <div className="mt-3 pt-2 border-t flex flex-wrap gap-2">
                                  {match.status === 'new' && (
                                    <>
                                      <Button size="sm" variant="outline" onClick={() => handleStatusChange(candidate.id, 'reviewed')}>
                                        Mark as Reviewed
                                      </Button>
                                      <Button size="sm" variant="outline" onClick={() => setSelectedCandidateId(candidate.id)}>
                                        Add Feedback
                                      </Button>
                                    </>
                                  )}
                                  
                                  {match.status === 'reviewed' && (
                                    <>
                                      <Button size="sm" variant="default" onClick={() => handleStatusChange(candidate.id, 'shortlisted')}>
                                        Shortlist
                                      </Button>
                                      <Button size="sm" variant="destructive" onClick={() => handleStatusChange(candidate.id, 'rejected')}>
                                        Reject
                                      </Button>
                                      <Button size="sm" variant="outline" onClick={() => setSelectedCandidateId(candidate.id)}>
                                        Add Feedback
                                      </Button>
                                    </>
                                  )}
                                  
                                  {match.status === 'shortlisted' && (
                                    <>
                                      <Button size="sm" variant="default" onClick={() => handleStatusChange(candidate.id, 'interview_scheduled')}>
                                        Schedule Interview
                                      </Button>
                                      <Button size="sm" variant="outline" onClick={() => setSelectedCandidateId(candidate.id)}>
                                        Add Feedback
                                      </Button>
                                    </>
                                  )}
                                </div>
                                
                                {selectedCandidateId === candidate.id && (
                                  <div className="mt-3 space-y-2">
                                    <Textarea 
                                      placeholder="Add feedback about this candidate..."
                                      value={feedback}
                                      onChange={(e) => setFeedback(e.target.value)}
                                      className="h-20"
                                    />
                                    <div className="flex gap-2">
                                      <Button size="sm" onClick={() => {
                                        updateCandidateStatus(selectedJobId, candidate.id, match.status, feedback);
                                        setSelectedCandidateId(null);
                                        setFeedback('');
                                      }}>Save Feedback</Button>
                                      <Button size="sm" variant="outline" onClick={() => {
                                        setSelectedCandidateId(null);
                                        setFeedback('');
                                      }}>Cancel</Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MatchingBoard;
