
import React, { useState } from 'react';
import { useRecruiter } from '@/context/RecruiterContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Plus, Search, Clock, MapPin, Calendar, DollarSign } from 'lucide-react';

const JobBoard = () => {
  const { jobs, selectJob, matchCandidatesToJob } = useRecruiter();
  const [searchTerm, setSearchTerm] = useState('');
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    preferredSkills: '',
    experience: '',
    education: '',
    location: '',
    salaryRange: '',
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  // Filter jobs based on search term
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewJob(prev => ({ ...prev, [name]: value }));
  };

  const handleAddJob = () => {
    // Parse requirements and preferred skills
    const requirements = newJob.requirements.split(',').map(item => item.trim());
    const preferredSkills = newJob.preferredSkills.split(',').map(item => item.trim());
    
    // Call addJob from context
    // This would be implemented in a real app
    console.log({
      ...newJob,
      requirements,
      preferredSkills,
    });
    
    // Reset form and close dialog
    setNewJob({
      title: '',
      company: '',
      description: '',
      requirements: '',
      preferredSkills: '',
      experience: '',
      education: '',
      location: '',
      salaryRange: '',
    });
    setDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-recruit-primary">Job Board</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Job</DialogTitle>
              <DialogDescription>
                Fill in the details below to post a new job opening.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={newJob.title} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Full Stack Developer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input 
                    id="company" 
                    name="company" 
                    value={newJob.company} 
                    onChange={handleInputChange} 
                    placeholder="e.g., TechCorp Inc."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={newJob.description} 
                  onChange={handleInputChange} 
                  placeholder="Describe the role and responsibilities"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements (comma-separated)</Label>
                  <Textarea 
                    id="requirements" 
                    name="requirements" 
                    value={newJob.requirements} 
                    onChange={handleInputChange} 
                    placeholder="e.g., React, Node.js, TypeScript"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredSkills">Preferred Skills (comma-separated)</Label>
                  <Textarea 
                    id="preferredSkills" 
                    name="preferredSkills" 
                    value={newJob.preferredSkills} 
                    onChange={handleInputChange} 
                    placeholder="e.g., AWS, GraphQL, Docker"
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Required</Label>
                  <Input 
                    id="experience" 
                    name="experience" 
                    value={newJob.experience} 
                    onChange={handleInputChange} 
                    placeholder="e.g., 3+ years"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="education">Education Required</Label>
                  <Input 
                    id="education" 
                    name="education" 
                    value={newJob.education} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Bachelor's in Computer Science"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    name="location" 
                    value={newJob.location} 
                    onChange={handleInputChange} 
                    placeholder="e.g., San Francisco, CA (Remote)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salaryRange">Salary Range</Label>
                  <Input 
                    id="salaryRange" 
                    name="salaryRange" 
                    value={newJob.salaryRange} 
                    onChange={handleInputChange} 
                    placeholder="e.g., $120,000 - $150,000"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddJob}>Post Job</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input 
          className="pl-10" 
          placeholder="Search for jobs by title, company, or keywords" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map(job => (
          <Card key={job.id} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <CardDescription className="mt-1">{job.company}</CardDescription>
                </div>
                <Briefcase className="h-5 w-5 text-recruit-secondary" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm line-clamp-3">{job.description}</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{job.experience}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>{job.salaryRange || 'Not disclosed'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Posted: {formatDate(job.datePosted)}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {job.requirements.slice(0, 3).map((req, idx) => (
                  <Badge key={idx} variant="secondary">{req}</Badge>
                ))}
                {job.requirements.length > 3 && (
                  <Badge variant="outline">+{job.requirements.length - 3} more</Badge>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Button 
                variant="outline" 
                onClick={() => selectJob(job.id)}
              >
                View Details
              </Button>
              <Button 
                onClick={() => matchCandidatesToJob(job.id)}
              >
                Match Candidates
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredJobs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Jobs Found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm ? 'No jobs match your search criteria.' : 'No jobs are currently available.'}
          </p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Job
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobBoard;
