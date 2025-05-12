
import React, { useState } from 'react';
import { useRecruiter } from '@/context/RecruiterContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PlusCircle, Search, Mail, Phone, GraduationCap, Briefcase } from 'lucide-react';

const CandidateBoard = () => {
  const { cvs, selectCV } = useRecruiter();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter candidates based on search term
  const filteredCandidates = cvs.filter(cv => 
    cv.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cv.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
    cv.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-recruit-primary">Candidate Pool</h1>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Upload CV
        </Button>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input 
          className="pl-10" 
          placeholder="Search candidates by name, skills, or experience" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCandidates.map(candidate => (
          <Card 
            key={candidate.id} 
            className="overflow-hidden hover:shadow-md transition-all cursor-pointer"
            onClick={() => selectCV(candidate.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-recruit-primary">
                    <AvatarFallback className="bg-recruit-primary text-white">
                      {getInitials(candidate.candidateName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{candidate.candidateName}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Mail className="h-3 w-3" />
                      {candidate.email}
                    </CardDescription>
                    {candidate.phone && (
                      <CardDescription className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {candidate.phone}
                      </CardDescription>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm line-clamp-3">{candidate.summary}</p>
              
              <div className="space-y-3">
                {candidate.experience.length > 0 && (
                  <div className="flex gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{candidate.experience[0].title}</p>
                      <p className="text-xs text-muted-foreground">{candidate.experience[0].company} • {candidate.experience[0].duration}</p>
                    </div>
                  </div>
                )}
                
                {candidate.education.length > 0 && (
                  <div className="flex gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{candidate.education[0].degree}</p>
                      <p className="text-xs text-muted-foreground">{candidate.education[0].institution} • {candidate.education[0].year}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {candidate.skills.slice(0, 4).map((skill, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">{skill}</Badge>
                ))}
                {candidate.skills.length > 4 && (
                  <Badge variant="outline" className="text-xs">+{candidate.skills.length - 4} more</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredCandidates.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Candidates Found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm ? 'No candidates match your search criteria.' : 'No candidates are currently available.'}
          </p>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Upload CV
          </Button>
        </div>
      )}
    </div>
  );
};

export default CandidateBoard;
