
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

// Sample data
import { sampleJobs, sampleCVs, sampleAgents } from '@/data/sample-data';

const RecruiterContext = createContext(undefined);

export const RecruiterProvider = ({ children }) => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState(sampleJobs);
  const [cvs, setCVs] = useState(sampleCVs);
  const [matches, setMatches] = useState([]);
  const [agents, setAgents] = useState(sampleAgents);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedCV, setSelectedCV] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initialize some matches when component mounts
  useEffect(() => {
    if (jobs.length > 0 && cvs.length > 0 && matches.length === 0) {
      matchCandidatesToJob(jobs[0].id);
    }
  }, [jobs, cvs]);

  const addJob = (job) => {
    const newJob = {
      ...job,
      id: `job-${Date.now()}`,
      datePosted: new Date().toISOString(),
      status: 'active',
    };
    setJobs([...jobs, newJob]);
    toast({
      title: 'Job Added',
      description: `${job.title} at ${job.company} has been added successfully.`,
    });
  };

  const addCV = (cv) => {
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

  const selectJob = (jobId) => {
    if (!jobId) {
      setSelectedJob(null);
      return;
    }
    const job = jobs.find(j => j.id === jobId) || null;
    setSelectedJob(job);
  };

  const selectCV = (cvId) => {
    if (!cvId) {
      setSelectedCV(null);
      return;
    }
    const cv = cvs.find(c => c.id === cvId) || null;
    setSelectedCV(cv);
  };

  // Function to simulate matching algorithm
  const matchCandidatesToJob = (jobId) => {
    setLoading(true);
    
    // In a real application, this would be a more sophisticated algorithm
    setTimeout(() => {
      const job = jobs.find(j => j.id === jobId);
      if (!job) return;
      
      const jobMatches = cvs.map(cv => {
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

  const calculateSkillMatch = (requirements, skills) => {
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
    jobId, 
    candidateId, 
    status, 
    feedback
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

  const toggleAgent = (agentId) => {
    setAgents(prev => prev.map(agent => {
      if (agent.id === agentId) {
        return { ...agent, active: !agent.active };
      }
      return agent;
    }));
  };

  const contextValue = {
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
    toggleAgent
  };

  return (
    <RecruiterContext.Provider value={contextValue}>
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
