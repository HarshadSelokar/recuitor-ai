
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Briefcase, Users, GitCompare, Cpu, User, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';

const NavigationItem = ({ to, icon, label, isActive }: { to: string; icon: React.ReactNode; label: string; isActive: boolean }) => {
  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "w-full justify-start gap-3 py-6",
        isActive && "bg-muted font-semibold"
      )}
    >
      <Link to={to}>
        {icon}
        <span>{label}</span>
      </Link>
    </Button>
  );
};

const Navigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  
  const navItems = [
    { path: '/', icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard' },
    { path: '/jobs', icon: <Briefcase className="h-5 w-5" />, label: 'Jobs' },
    { path: '/candidates', icon: <Users className="h-5 w-5" />, label: 'Candidates' },
    { path: '/matching', icon: <GitCompare className="h-5 w-5" />, label: 'Matching' },
    { path: '/agents', icon: <Cpu className="h-5 w-5" />, label: 'AI Agents' },
  ];
  
  const renderNavItems = () => {
    return navItems.map((item) => (
      <NavigationItem
        key={item.path}
        to={item.path}
        icon={item.icon}
        label={item.label}
        isActive={location.pathname === item.path}
      />
    ));
  };
  
  // Desktop Navigation
  if (!isMobile) {
    return (
      <div className="h-screen w-64 border-r bg-card flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <div className="bg-recruit-primary text-white h-8 w-8 rounded-md flex items-center justify-center font-bold">
              RM
            </div>
            <h1 className="font-bold text-xl">RecruitMate AI</h1>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            {renderNavItems()}
          </nav>
        </div>
        
        <div className="p-4 mt-auto border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-recruit-primary text-white">
                  U
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium">User</p>
                <p className="text-muted-foreground">Admin</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Mobile Navigation
  return (
    <div className="border-b bg-card sticky top-0 z-50">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className="bg-recruit-primary text-white h-8 w-8 rounded-md flex items-center justify-center font-bold">
            RM
          </div>
          <h1 className="font-bold text-lg">RecruitMate AI</h1>
        </div>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-recruit-primary text-white h-8 w-8 rounded-md flex items-center justify-center font-bold">
                    RM
                  </div>
                  <h1 className="font-bold text-xl">RecruitMate AI</h1>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <nav className="grid gap-1 p-2" onClick={() => setIsOpen(false)}>
              {renderNavItems()}
            </nav>
            <div className="p-4 mt-auto border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-recruit-primary text-white">
                      U
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">User</p>
                    <p className="text-muted-foreground">Admin</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Navigation;
