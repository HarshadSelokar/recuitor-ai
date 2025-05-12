
export interface JobDescription {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  preferredSkills: string[];
  experience: string;
  education: string;
  location: string;
  salaryRange?: string;
  datePosted: string;
  status: 'active' | 'filled' | 'closed';
}

export interface CV {
  id: string;
  candidateName: string;
  email: string;
  phone?: string;
  skills: string[];
  experience: {
    title: string;
    company: string;
    duration: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  summary: string;
}

export interface CandidateMatch {
  jobId: string;
  candidateId: string;
  matchScore: number;
  matchDetails: {
    skillMatch: number;
    experienceMatch: number;
    educationMatch: number;
    overallScore: number;
  };
  status: 'new' | 'reviewed' | 'shortlisted' | 'rejected' | 'interview_scheduled';
  feedback?: string;
}

export interface Agent {
  id: string;
  name: string;
  role: 'reader' | 'matcher' | 'reviewer' | 'communicator';
  description: string;
  active: boolean;
}
