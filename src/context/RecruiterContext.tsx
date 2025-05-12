
import React, { createContext, useContext, useState, useEffect } from 'react';
import { JobDescription, CV, CandidateMatch, Agent } from '@/types/recruiter-types';
import { useToast } from '@/components/ui/use-toast';

// Sample data
import { sampleJobs, sampleCVs, sampleAgents } from '@/data/sample-data';

interface RecruiterContextType {
  jobs: JobDescription[];
  cvs: CV[];
  matches: CandidateMatch[];
  agents: Agent[];
  selectedJob: JobDescription | null;
  selectedCV: CV | null;
  loading: boolean;
  addJob: (job: Omit<JobDescription, 'id'>) => void;
  addCV: (cv: Omit<CV, 'id'>) => void;
  selectJob: (jobId: string | null) => void;
  selectCV: (cvId: string | null) => void;
  matchCandidatesToJob: (jobId: string) => void;
  updateCandidateStatus: (jobId: string, candidateId: string, status: CandidateMatch['status'], feedback?: string) => void;
  toggleAgent: (agentId: string) => void;
}

const RecruiterContext = createContext<RecruiterContextType | undefined>(undefined);

export const RecruiterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<JobDescription[]>(sampleJobs);
  const [cvs, setCVs] = useState<CV[]>(sampleCVs);
  const [matches, setMatches] = useState<CandidateMatch[]>([]);
  const [agents, setAgents] = useState<Agent[]>(sampleAgents);
  const [selectedJob, setSelectedJob] = useState<JobDescription | null>(null);
  const [selectedCV, setSelectedCV] = useState<CV | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Initialize some matches when component mounts
  useEffect(() => {
    if (jobs.length > 0 && cvs.length > 0 && matches.length === 0) {
      matchCandidatesToJob(jobs[0].id);
    }
  }, [jobs, cvs]);

  const addJob = (job: Omit<JobDescription, 'id'>) => {
    const newJob = {
      ...job,
      id: `job-${Date.now()}`,
      datePosted: new Date().toISOString(),
      status: 'active' as const,
    };
    setJobs([...jobs, newJob]);
    toast({
      title: 'Job Added',
      description: `${job.title} at ${job.company} has been added successfully.`,
    });
  };

  const addCV = (cv: Omit<CV, 'id'>) => {
    const newCV = {
      ...cv,
      id: `cv-${Date.now()}`,
    };
    setCVs([...cvs, newCV]);
    toast({
      title: 'CV Added',
      description: `${cv.candidateName}'s CV has been added successfully.`,
    });
  };

  const selectJob = (jobId: string | null) => {
    if (!jobId) {
      setSelectedJob(null);
      return;
    }
    const job = jobs.find(j => j.id === jobId) || null;
    setSelectedJob(job);
  };

  const selectCV = (cvId: string | null) => {
    if (!cvId) {
      setSelectedCV(null);
      return;
    }
    const cv = cvs.find(c => c.id === cvId) || null;
    setSelectedCV(cv);
  };

  // Function to simulate matching algorithm
  const matchCandidatesToJob = (jobId: string) => {
    setLoading(true);
    
    // In a real application, this would be a more sophisticated algorithm
    setTimeout(() => {
      const job = jobs.find(j => j.id === jobId);
      if (!job) return;
      
      const jobMatches: CandidateMatch[] = cvs.map(cv => {
        // Simple matching algorithm (would be much more sophisticated in a real app)
        const skillMatch = calculateSkillMatch(job.requirements, cv.skills);
        const experienceMatch = Math.random() * 0.5 + 0.5; // Simulate experience match
        const educationMatch = Math.random() * 0.5 + 0.5; // Simulate education match
        const overallScore = (skillMatch * 0.5) + (experienceMatch * 0.3) + (educationMatch * 0.2);
        
        return {
          jobId,
          candidateId: cv.id,
          matchScore: overallScore,
          matchDetails: {
            skillMatch,
            experienceMatch,
            educationMatch,
            overallScore,
          },
          status: 'new',
        };
      });
      
      // Sort by match score (highest first)
      jobMatches.sort((a, b) => b.matchScore - a.matchScore);
      
      // Remove any existing matches for this job and add new ones
      setMatches(prev => [...prev.filter(m => m.jobId !== jobId), ...jobMatches]);
      toast({
        title: 'Candidates Matched',
        description: `${jobMatches.length} candidates have been matched to ${job.title}.`,
      });
      setLoading(false);
    }, 1500); // Simulate processing time
  };

  const calculateSkillMatch = (requirements: string[], skills: string[]): number => {
    // Convert to lowercase for case-insensitive matching
    const lowerRequirements = requirements.map(r => r.toLowerCase());
    const lowerSkills = skills.map(s => s.toLowerCase());
    
    // Count how many requirements are matched by skills
    let matchCount = 0;
    lowerRequirements.forEach(req => {
      // Check if any skill contains this requirement
      if (lowerSkills.some(skill => skill.includes(req) || req.includes(skill))) {
        matchCount++;
      }
    });
    
    return requirements.length > 0 ? matchCount / requirements.length : 0;
  };

  const updateCandidateStatus = (
    jobId: string, 
    candidateId: string, 
    status: CandidateMatch['status'], 
    feedback?: string
  ) => {
    setMatches(prev => prev.map(match => {
      if (match.jobId === jobId && match.candidateId === candidateId) {
        return { ...match, status, feedback };
      }
      return match;
    }));
    
    const candidate = cvs.find(cv => cv.id === candidateId);
    toast({
      title: 'Candidate Status Updated',
      description: `${candidate?.candidateName}'s status has been updated to ${status.replace('_', ' ')}.`,
    });
  };

  const toggleAgent = (agentId: string) => {
    setAgents(prev => prev.map(agent => {
      if (agent.id === agentId) {
        return { ...agent, active: !agent.active };
      }
      return agent;
    }));
  };

  return (
    <RecruiterContext.Provider value={{
      jobs,
      cvs,
      matches,
      agents,
      selectedJob,
      selectedCV,
      loading,
      addJob,
      addCV,
      selectJob,
      selectCV,
      matchCandidatesToJob,
      updateCandidateStatus,
      toggleAgent,
    }}>
      {children}
    </RecruiterContext.Provider>
  );
};

export const useRecruiter = () => {
  const context = useContext(RecruiterContext);
  if (context === undefined) {
    throw new Error('useRecruiter must be used within a RecruiterProvider');
  }
  return context;
};
