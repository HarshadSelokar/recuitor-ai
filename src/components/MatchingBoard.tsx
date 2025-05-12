
import React, { useState, useEffect } from 'react';
import { useRecruiter } from '@/context/RecruiterContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Check, X, MessageSquare, User, BookOpen, BarChart4, Briefcase, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

const MatchingBoard = () => {
  const { jobs, cvs, matches, selectedJob, selectJob, updateCandidateStatus, loading } = useRecruiter();
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Set active job to selected job or first job if none selected
  useEffect(() => {
    if (selectedJob) {
      setActiveJobId(selectedJob.id);
    } else if (jobs.length > 0 && !activeJobId) {
      setActiveJobId(jobs[0].id);
    }
  }, [selectedJob, jobs, activeJobId]);
  
  // Get active job
  const activeJob = jobs.find(job => job.id === activeJobId);
  
  // Get matches for active job
  const jobMatches = activeJob
    ? matches
        .filter(match => match.jobId === activeJob.id)
        .filter(match => !statusFilter || match.status === statusFilter)
        .sort((a, b) => b.matchScore - a.matchScore)
    : [];
  
  // Get selected candidate details
  const selectedCandidate = selectedCandidateId
    ? cvs.find(cv => cv.id === selectedCandidateId)
    : null;
  
  const selectedMatch = selectedCandidateId && activeJobId
    ? matches.find(m => m.jobId === activeJobId && m.candidateId === selectedCandidateId)
    : null;
  
  const handleSelectJob = (jobId: string) => {
    setActiveJobId(jobId);
    selectJob(jobId);
    setSelectedCandidateId(null);
  };
  
  const handleCandidateClick = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
  };
  
  const handleUpdateStatus = (status: string) => {
    if (activeJobId && selectedCandidateId) {
      updateCandidateStatus(
        activeJobId, 
        selectedCandidateId, 
        status as any, 
        feedbackText
      );
      setFeedbackText("");
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'reviewed': return 'bg-orange-500';
      case 'shortlisted': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'interview_scheduled': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <AlertCircle className="h-4 w-4" />;
      case 'reviewed': return <BookOpen className="h-4 w-4" />;
      case 'shortlisted': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'interview_scheduled': return <Clock className="h-4 w-4" />;
      default: return null;
    }
  };
  
  const formatMatchPercentage = (score: number) => {
    return Math.round(score * 100);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left sidebar - Job selection */}
      <div className="w-64 border-r bg-muted/30 p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Active Jobs</h2>
        <div className="space-y-2">
          {jobs.map(job => (
            <Button
              key={job.id}
              variant={activeJobId === job.id ? "default" : "ghost"}
              className="w-full justify-start text-left h-auto py-2"
              onClick={() => handleSelectJob(job.id)}
            >
              <div className="truncate">
                <div className="font-medium truncate">{job.title}</div>
                <div className="text-xs text-muted-foreground truncate">{job.company}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
              <p className="mt-4 text-lg">Matching candidates...</p>
            </div>
          </div>
        ) : activeJob ? (
          <>
            {/* Job header */}
            <div className="p-4 border-b bg-card">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">{activeJob.title}</h1>
                  <p className="text-muted-foreground">{activeJob.company} • {activeJob.location}</p>
                </div>
                <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Candidates</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Main content with candidates list and details */}
            <div className="flex-1 overflow-hidden flex">
              {/* Candidates list */}
              <div className="w-1/3 border-r overflow-y-auto">
                {jobMatches.length > 0 ? (
                  jobMatches.map(match => {
                    const candidate = cvs.find(cv => cv.id === match.candidateId);
                    if (!candidate) return null;
                    
                    return (
                      <div
                        key={match.candidateId}
                        className={`border-b p-4 hover:bg-muted/50 cursor-pointer transition-colors ${selectedCandidateId === candidate.id ? 'bg-muted' : ''}`}
                        onClick={() => handleCandidateClick(candidate.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-recruit-primary text-white">
                                {getInitials(candidate.candidateName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{candidate.candidateName}</p>
                              <p className="text-sm text-muted-foreground">
                                {candidate.experience[0]?.title || 'No experience'}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1 mb-1">
                              <span className="text-sm font-medium">{formatMatchPercentage(match.matchScore)}%</span>
                              <div className={`h-2 w-2 rounded-full ${getStatusColor(match.status)}`}></div>
                            </div>
                            <Progress value={formatMatchPercentage(match.matchScore)} className="h-1.5 w-16" />
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <User className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Matches Found</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {statusFilter 
                        ? `No candidates with "${statusFilter}" status.` 
                        : 'No candidates have been matched to this job yet.'}
                    </p>
                    <Button variant="outline" onClick={() => setStatusFilter(null)}>
                      Show All Candidates
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Candidate details */}
              <div className="flex-1 overflow-y-auto">
                {selectedCandidate && selectedMatch ? (
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-recruit-primary">
                          <AvatarFallback className="bg-recruit-primary text-white text-xl">
                            {getInitials(selectedCandidate.candidateName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="text-2xl font-bold">{selectedCandidate.candidateName}</h2>
                          <p className="text-muted-foreground">{selectedCandidate.email} • {selectedCandidate.phone}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getStatusColor(selectedMatch.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(selectedMatch.status)}
                                <span>{selectedMatch.status.replace('_', ' ')}</span>
                              </div>
                            </Badge>
                            <Badge variant="outline">{formatMatchPercentage(selectedMatch.matchScore)}% Match</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">Send Message</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Send Message to {selectedCandidate.candidateName}</DialogTitle>
                              <DialogDescription>
                                This will generate a personalized message based on the job and candidate profile.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <Textarea 
                                className="min-h-[200px]"
                                defaultValue={`Dear ${selectedCandidate.candidateName},\n\nThank you for your interest in the ${activeJob.title} position at ${activeJob.company}. Based on our review, your skills and experience are a great match for this role.\n\nWe would like to invite you for an interview to discuss this opportunity further.\n\nBest regards,\nRecruitment Team`}
                              />
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button>Send Email</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="default" size="sm">Update Status</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Update Candidate Status</DialogTitle>
                              <DialogDescription>
                                Change the status of {selectedCandidate.candidateName} for the {activeJob.title} position.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="grid grid-cols-2 gap-2">
                                <Button
                                  variant="outline"
                                  className="justify-start"
                                  onClick={() => handleUpdateStatus('reviewed')}
                                >
                                  <BookOpen className="mr-2 h-4 w-4" />
                                  Mark as Reviewed
                                </Button>
                                <Button
                                  variant="outline"
                                  className="justify-start"
                                  onClick={() => handleUpdateStatus('rejected')}
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Reject Candidate
                                </Button>
                                <Button
                                  variant="outline"
                                  className="justify-start"
                                  onClick={() => handleUpdateStatus('shortlisted')}
                                >
                                  <Check className="mr-2 h-4 w-4" />
                                  Shortlist Candidate
                                </Button>
                                <Button
                                  variant="outline"
                                  className="justify-start"
                                  onClick={() => handleUpdateStatus('interview_scheduled')}
                                >
                                  <Clock className="mr-2 h-4 w-4" />
                                  Schedule Interview
                                </Button>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Feedback (optional)</p>
                                <Textarea 
                                  placeholder="Add notes or feedback about this candidate"
                                  value={feedbackText}
                                  onChange={(e) => setFeedbackText(e.target.value)}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button>Save Changes</Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    
                    <Tabs defaultValue="summary" className="w-full">
                      <TabsList className="w-full justify-start">
                        <TabsTrigger value="summary">Summary</TabsTrigger>
                        <TabsTrigger value="experience">Experience</TabsTrigger>
                        <TabsTrigger value="education">Education</TabsTrigger>
                        <TabsTrigger value="matches">Match Details</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="summary" className="space-y-6 pt-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Profile Summary</CardTitle>
                            <CardDescription>Overview of candidate's background and skills</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="mb-4">{selectedCandidate.summary}</p>
                            <h4 className="font-semibold mb-2">Skills</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedCandidate.skills.map((skill, idx) => (
                                <Badge 
                                  key={idx} 
                                  variant={activeJob.requirements.some(r => 
                                    r.toLowerCase().includes(skill.toLowerCase()) || 
                                    skill.toLowerCase().includes(r.toLowerCase())
                                  ) ? "default" : "secondary"}
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                        
                        {selectedMatch.feedback && (
                          <Card>
                            <CardHeader>
                              <CardTitle>Recruiter Feedback</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p>{selectedMatch.feedback}</p>
                            </CardContent>
                          </Card>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="experience" className="pt-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Work Experience</CardTitle>
                            <CardDescription>Professional background and work history</CardDescription>
                          </CardHeader>
                          <CardContent>
                            {selectedCandidate.experience.length > 0 ? (
                              <div className="space-y-6">
                                {selectedCandidate.experience.map((exp, idx) => (
                                  <div key={idx} className="space-y-2">
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <h4 className="font-semibold">{exp.title}</h4>
                                        <p className="text-sm text-muted-foreground">{exp.company} • {exp.duration}</p>
                                      </div>
                                      <Briefcase className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <p className="text-sm">{exp.description}</p>
                                    {idx < selectedCandidate.experience.length - 1 && <Separator className="mt-4" />}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-muted-foreground">No work experience listed.</p>
                            )}
                          </CardContent>
                        </Card>
                      </TabsContent>
                      
                      <TabsContent value="education" className="pt-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Education</CardTitle>
                            <CardDescription>Academic background and qualifications</CardDescription>
                          </CardHeader>
                          <CardContent>
                            {selectedCandidate.education.length > 0 ? (
                              <div className="space-y-6">
                                {selectedCandidate.education.map((edu, idx) => (
                                  <div key={idx} className="space-y-2">
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <h4 className="font-semibold">{edu.degree}</h4>
                                        <p className="text-sm text-muted-foreground">{edu.institution} • {edu.year}</p>
                                      </div>
                                      <GraduationCap className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    {idx < selectedCandidate.education.length - 1 && <Separator className="mt-4" />}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-muted-foreground">No education listed.</p>
                            )}
                          </CardContent>
                        </Card>
                      </TabsContent>
                      
                      <TabsContent value="matches" className="pt-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Match Analysis</CardTitle>
                            <CardDescription>Detailed scoring of candidate match to job requirements</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold">Overall Match</h4>
                                <span className="font-semibold">{formatMatchPercentage(selectedMatch.matchScore)}%</span>
                              </div>
                              <Progress value={formatMatchPercentage(selectedMatch.matchScore)} className="h-2.5" />
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <h4 className="text-sm font-medium">Skills Match</h4>
                                  <span className="text-sm">{formatMatchPercentage(selectedMatch.matchDetails.skillMatch)}%</span>
                                </div>
                                <Progress value={formatMatchPercentage(selectedMatch.matchDetails.skillMatch)} className="h-2" />
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <h4 className="text-sm font-medium">Experience Match</h4>
                                  <span className="text-sm">{formatMatchPercentage(selectedMatch.matchDetails.experienceMatch)}%</span>
                                </div>
                                <Progress value={formatMatchPercentage(selectedMatch.matchDetails.experienceMatch)} className="h-2" />
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <h4 className="text-sm font-medium">Education Match</h4>
                                  <span className="text-sm">{formatMatchPercentage(selectedMatch.matchDetails.educationMatch)}%</span>
                                </div>
                                <Progress value={formatMatchPercentage(selectedMatch.matchDetails.educationMatch)} className="h-2" />
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <h4 className="font-semibold">Requirement Matching</h4>
                              <div className="space-y-2">
                                {activeJob.requirements.map((req, idx) => {
                                  const isMatched = selectedCandidate.skills.some(skill => 
                                    skill.toLowerCase().includes(req.toLowerCase()) || 
                                    req.toLowerCase().includes(skill.toLowerCase())
                                  );
                                  return (
                                    <div key={idx} className="flex items-center gap-2">
                                      {isMatched ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                      ) : (
                                        <XCircle className="h-5 w-5 text-red-500" />
                                      )}
                                      <span>{req}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <User className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Candidate Selected</h3>
                    <p className="text-muted-foreground max-w-md">
                      Select a candidate from the list to view their details and match analysis.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Job Selected</h2>
              <p className="text-muted-foreground mb-6">Select a job from the sidebar to view candidate matches.</p>
              <Button onClick={() => selectJob(jobs[0]?.id || null)} disabled={jobs.length === 0}>
                Select First Job
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchingBoard;
