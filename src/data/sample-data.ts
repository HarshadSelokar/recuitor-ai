
import { JobDescription, CV, Agent } from '@/types/recruiter-types';

export const sampleJobs: JobDescription[] = [
  {
    id: 'job-1',
    title: 'Full Stack Developer',
    company: 'TechCorp Inc.',
    description: 'We are looking for a Full Stack Developer to join our dynamic team. The ideal candidate will have experience building modern web applications using React, Node.js, and cloud technologies.',
    requirements: ['React', 'Node.js', 'JavaScript', 'TypeScript', 'Cloud Technologies', 'REST APIs'],
    preferredSkills: ['AWS', 'GraphQL', 'Docker', 'CI/CD'],
    experience: '3+ years',
    education: 'Bachelor\'s in Computer Science or related field',
    location: 'San Francisco, CA (Remote Option Available)',
    salaryRange: '$120,000 - $150,000',
    datePosted: '2025-05-01T00:00:00Z',
    status: 'active',
  },
  {
    id: 'job-2',
    title: 'Data Scientist',
    company: 'Analytics Plus',
    description: 'Looking for a data scientist to help build and deploy machine learning models. You will work with our team to extract insights from data and develop predictive models.',
    requirements: ['Python', 'Machine Learning', 'SQL', 'Data Analysis', 'Statistics'],
    preferredSkills: ['PyTorch', 'TensorFlow', 'Big Data', 'Cloud Platforms'],
    experience: '2-5 years',
    education: 'Master\'s degree in Data Science, Statistics, or related field',
    location: 'Boston, MA',
    salaryRange: '$110,000 - $140,000',
    datePosted: '2025-05-05T00:00:00Z',
    status: 'active',
  },
  {
    id: 'job-3',
    title: 'UI/UX Designer',
    company: 'Creative Solutions',
    description: 'We\'re seeking a talented UI/UX Designer to create beautiful, intuitive interfaces for our clients. The ideal candidate will combine design skills with user empathy.',
    requirements: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Visual Design'],
    preferredSkills: ['Adobe Creative Suite', 'Design Systems', 'User Testing', 'HTML/CSS'],
    experience: '3+ years',
    education: 'Bachelor\'s in Design, HCI, or related field',
    location: 'New York, NY (Hybrid)',
    salaryRange: '$95,000 - $120,000',
    datePosted: '2025-05-08T00:00:00Z',
    status: 'active',
  },
];

export const sampleCVs: CV[] = [
  {
    id: 'cv-1',
    candidateName: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '555-123-4567',
    skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'AWS', 'Docker'],
    experience: [
      {
        title: 'Senior Frontend Developer',
        company: 'WebTech Solutions',
        duration: '2022-2025',
        description: 'Led development of React-based applications. Implemented state management with Redux and optimized performance.'
      },
      {
        title: 'Full Stack Developer',
        company: 'Digital Innovations',
        duration: '2020-2022',
        description: 'Built RESTful APIs with Node.js and Express. Developed frontend interfaces with React.'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of California, Berkeley',
        year: '2020'
      }
    ],
    summary: 'Experienced full stack developer with a passion for building scalable web applications. Strong expertise in JavaScript ecosystem and cloud technologies.'
  },
  {
    id: 'cv-2',
    candidateName: 'Morgan Smith',
    email: 'morgan.smith@example.com',
    phone: '555-987-6543',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Data Visualization', 'Statistics'],
    experience: [
      {
        title: 'Data Scientist',
        company: 'Data Insights Corp',
        duration: '2021-2025',
        description: 'Built predictive models using machine learning algorithms. Performed data cleaning and feature engineering.'
      },
      {
        title: 'Data Analyst',
        company: 'Analytics Co',
        duration: '2019-2021',
        description: 'Created dashboards and reports. Performed SQL queries to extract relevant data for analysis.'
      }
    ],
    education: [
      {
        degree: 'Master of Science in Data Science',
        institution: 'MIT',
        year: '2019'
      },
      {
        degree: 'Bachelor of Science in Statistics',
        institution: 'Harvard University',
        year: '2017'
      }
    ],
    summary: 'Data scientist with strong analytical skills and expertise in machine learning. Passionate about turning data into actionable insights.'
  },
  {
    id: 'cv-3',
    candidateName: 'Jamie Williams',
    email: 'jamie.williams@example.com',
    phone: '555-234-5678',
    skills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Adobe Creative Suite', 'Design Systems'],
    experience: [
      {
        title: 'Senior UI/UX Designer',
        company: 'Design Innovations',
        duration: '2023-2025',
        description: 'Led design for major product redesign. Created and maintained design system.'
      },
      {
        title: 'Product Designer',
        company: 'CreativeTech',
        duration: '2020-2023',
        description: 'Designed user interfaces for mobile and web applications. Conducted user research and usability testing.'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Fine Arts in Graphic Design',
        institution: 'Rhode Island School of Design',
        year: '2020'
      }
    ],
    summary: 'Creative UI/UX designer with a strong portfolio of user-centered designs. Experienced in design systems and user research methodologies.'
  },
  {
    id: 'cv-4',
    candidateName: 'Taylor Chen',
    email: 'taylor.chen@example.com',
    phone: '555-345-6789',
    skills: ['JavaScript', 'React', 'Node.js', 'GraphQL', 'Docker', 'Kubernetes'],
    experience: [
      {
        title: 'Full Stack Developer',
        company: 'Tech Innovations',
        duration: '2022-2025',
        description: 'Developed and maintained full-stack applications using React and Node.js. Implemented GraphQL APIs.'
      },
      {
        title: 'Backend Developer',
        company: 'Software Solutions Inc.',
        duration: '2020-2022',
        description: 'Built RESTful APIs and microservices. Worked with containerization technologies.'
      }
    ],
    education: [
      {
        degree: 'Master of Computer Science',
        institution: 'Stanford University',
        year: '2020'
      },
      {
        degree: 'Bachelor of Engineering',
        institution: 'University of Michigan',
        year: '2018'
      }
    ],
    summary: 'Full stack developer with expertise in modern JavaScript frameworks and containerization technologies. Strong problem-solving skills and passion for clean code.'
  },
  {
    id: 'cv-5',
    candidateName: 'Jordan Patel',
    email: 'jordan.patel@example.com',
    phone: '555-456-7890',
    skills: ['Python', 'SQL', 'Data Analysis', 'Machine Learning', 'R', 'Statistics'],
    experience: [
      {
        title: 'Junior Data Scientist',
        company: 'Predictive Analytics',
        duration: '2023-2025',
        description: 'Developed machine learning models for customer segmentation. Performed feature engineering and model evaluation.'
      },
      {
        title: 'Data Analyst Intern',
        company: 'Big Data Co',
        duration: '2022-2023',
        description: 'Analyzed large datasets to extract insights. Created reports and visualizations using Tableau.'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science in Mathematics',
        institution: 'UCLA',
        year: '2022'
      }
    ],
    summary: 'Entry-level data scientist with strong foundation in statistics and programming. Eager to apply analytical skills to solve real-world problems.'
  }
];

export const sampleAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'JD Analyzer',
    role: 'reader',
    description: 'Analyzes job descriptions to extract key requirements and qualifications.',
    active: true
  },
  {
    id: 'agent-2',
    name: 'CV Parser',
    role: 'reader',
    description: 'Extracts relevant information from CVs including skills, experience, and education.',
    active: true
  },
  {
    id: 'agent-3',
    name: 'Matcher',
    role: 'matcher',
    description: 'Compares job requirements with candidate qualifications to determine match scores.',
    active: true
  },
  {
    id: 'agent-4',
    name: 'Reviewer',
    role: 'reviewer',
    description: 'Reviews and validates matches, providing additional insights for decision-making.',
    active: true
  },
  {
    id: 'agent-5',
    name: 'Communicator',
    role: 'communicator',
    description: 'Generates personalized communication to shortlisted candidates.',
    active: true
  }
];
