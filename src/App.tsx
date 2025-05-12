
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RecruiterProvider } from "@/context/RecruiterContext";

// Import Pages
import MainLayout from "@/layouts/MainLayout";
import Dashboard from "@/components/Dashboard";
import JobBoard from "@/components/JobBoard";
import CandidateBoard from "@/components/CandidateBoard";
import MatchingBoard from "@/components/MatchingBoard";
import AgentBoard from "@/components/AgentBoard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <RecruiterProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="jobs" element={<JobBoard />} />
              <Route path="candidates" element={<CandidateBoard />} />
              <Route path="matching" element={<MatchingBoard />} />
              <Route path="agents" element={<AgentBoard />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </RecruiterProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
