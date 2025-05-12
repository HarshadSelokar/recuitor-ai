
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { useIsMobile } from '@/hooks/use-mobile';

const MainLayout = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {!isMobile && <Navigation />}
      <div className="flex-1 overflow-auto flex flex-col">
        {isMobile && <Navigation />}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
