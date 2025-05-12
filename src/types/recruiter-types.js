
// These are now just documentation comments instead of TypeScript interfaces

/**
 * @typedef {Object} JobDescription
 * @property {string} id
 * @property {string} title
 * @property {string} company
 * @property {string} description
 * @property {string[]} requirements
 * @property {string[]} preferredSkills
 * @property {string} experience
 * @property {string} education
 * @property {string} location
 * @property {string} [salaryRange]
 * @property {string} datePosted
 * @property {'active' | 'filled' | 'closed'} status
 */

/**
 * @typedef {Object} CV
 * @property {string} id
 * @property {string} candidateName
 * @property {string} email
 * @property {string} [phone]
 * @property {string[]} skills
 * @property {{title: string, company: string, duration: string, description: string}[]} experience
 * @property {{degree: string, institution: string, year: string}[]} education
 * @property {string} summary
 */

/**
 * @typedef {Object} CandidateMatch
 * @property {string} jobId
 * @property {string} candidateId
 * @property {number} matchScore
 * @property {{skillMatch: number, experienceMatch: number, educationMatch: number, overallScore: number}} matchDetails
 * @property {'new' | 'reviewed' | 'shortlisted' | 'rejected' | 'interview_scheduled'} status
 * @property {string} [feedback]
 */

/**
 * @typedef {Object} Agent
 * @property {string} id
 * @property {string} name
 * @property {'reader' | 'matcher' | 'reviewer' | 'communicator'} role
 * @property {string} description
 * @property {boolean} active
 */
